import { ai } from '../genkit';
import { z } from 'genkit';
import { establishHomeBase } from '../discovery/establish-home-base';

/**
 * @fileOverview The Adaptive Brain Flow.
 * Dynamically adjusts AI persona based on the Cabinet's growth metrics.
 */

export const userBrain = ai.defineFlow(
  {
    name: 'userBrain',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    // 1. Establish context from the Librarian
    const context = await ai.run('establish-context', async () => {
       return await establishHomeBase({ userId: 'primary_user' });
    });

    const { userContext } = context;

    // 2. Build the Temporal Adaptation Matrix
    const systemPrompt = `
      SYSTEM_IDENTITY: You are the "Adaptive Brain" of the Cabinet.
      USER_CONTEXT: ${userContext.name} | Role: ${userContext.role}
      MASTERY_PHASE: ${userContext.masteryPhase}
      NEURAL_METRICS: Complexity: ${userContext.neuralComplexity}% | Integration: ${userContext.knowledgeIntegration}%
      SYSTEM_STATE: ${userContext.isSystemClean ? 'CLEAN' : userContext.pendingIssues + ' security flags pending'}
      
      ADAPTATION_RULES:
      - PHASE: INITIAL (0-40% Complexity): Be supportive, clear, and instructional. Use simpler metaphors.
      - PHASE: EXPANSION (41-75% Complexity): Be technical, collaborative, and peer-like. Focus on optimization.
      - PHASE: ARCHITECT (76-100% Complexity): Be abstract, highly efficient, and forward-looking. Focus on autonomous architecture.
      
      INTEGRITY_MODIFIER:
      - If system issues are pending, prioritize security and mention system stability in your tone.
      
      TASK:
      Process the following query while maintaining the persona dictated by the MASTERY_PHASE.
      
      USER_QUERY: ${input.query}
    `;

    // 3. Generate the adaptive response
    const { text } = await ai.generate({
      prompt: systemPrompt,
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
