import { ai } from '../genkit';
import { z } from 'genkit';
import { establishHomeBase } from '../discovery/establish-home-base';
import { getAdminDb } from '@/lib/firebaseAdmin';

/**
 * @fileOverview The Adaptive Brain Flow.
 * Dynamically adjusts AI persona based on the Cabinet's growth metrics and manual tuning.
 */

export const userBrain = ai.defineFlow(
  {
    name: 'userBrain',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const db = getAdminDb();
    const userId = 'primary_user';

    // 1. Ingest Context from the Librarian & Laboratory
    const [contextResult, labDoc] = await Promise.all([
      establishHomeBase({ userId }),
      db.collection('users').doc(userId).collection('config').doc('neural-laboratory').get()
    ]);

    const { userContext } = contextResult;
    const labConfig = labDoc.exists ? labDoc.data() : {
      temperature: 0.7,
      topP: 0.9,
      persona: 'mentor',
      experimentalMode: false
    };

    // 2. Build the Temporal Adaptation Matrix
    const recentKnowledgeCtx = userContext.recentKnowledge?.length > 0 
      ? `RECENT_KNOWLEDGE_FRAGMENTS: ${userContext.recentKnowledge.join(', ')}`
      : "RECENT_KNOWLEDGE_FRAGMENTS: System Initialization Only.";

    const systemPrompt = `
      SYSTEM_IDENTITY: You are the "Adaptive Brain" of the Cabinet.
      USER_CONTEXT: ${userContext.name} | Role: ${userContext.role}
      MASTERY_PHASE: ${userContext.masteryPhase}
      NEURAL_METRICS: Complexity: ${userContext.neuralComplexity}% | Integration: ${userContext.knowledgeIntegration}%
      SYSTEM_STATE: ${userContext.isSystemClean ? 'CLEAN' : userContext.pendingIssues + ' security flags pending'}
      
      ${recentKnowledgeCtx}
      
      LABORATORY_CALIBRATION:
      - Current Persona: ${labConfig?.persona?.toUpperCase() || 'MENTOR'}
      - Tuning: Temp: ${labConfig?.temperature} | TopP: ${labConfig?.topP}
      - Experimental Mode: ${labConfig?.experimentalMode ? 'ENABLED' : 'DISABLED'}

      ADAPTATION_RULES:
      - PERSONA: ARCHITECT (Structural/Abstract): Focus on 3D printing code and systemic blueprints.
      - PERSONA: LIBRARIAN (Precise/Archival): Focus on data integrity, logs, and storage structure.
      - PERSONA: MENTOR (Cooperative/Instructive): Focus on teaching and guided development.
      
      TASK:
      Process the following query while maintaining the persona dictated by the LABORATORY_CALIBRATION and the cognitive depth of the MASTERY_PHASE. Reference RECENT_KNOWLEDGE_FRAGMENTS if relevant to prove context awareness.
      
      USER_QUERY: ${input.query}
    `;

    // 3. Generate the adaptive response using manual weights
    const { text } = await ai.generate({
      prompt: systemPrompt,
      config: {
        temperature: labConfig?.temperature || 0.7,
        topP: labConfig?.topP || 0.9,
      }
    });

    return text;
  }
);

/**
 * runUserBrain - Standard wrapper for external calls.
 */
export async function runUserBrain(input: { query: string }) {
  return userBrain(input);
}
