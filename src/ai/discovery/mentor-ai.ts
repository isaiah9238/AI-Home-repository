import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { filterUserInput } from '../domains/safety/filter-user-input';
import { filterAIOutput } from '../domains/safety/filter-ai-output';

/**
 * @fileOverview The Web Intel Mentor Flow (Google AI Edition).
 * Grounded in MENTOR.md protocol guidelines for adaptive guidance.
 */

const MentorInputSchema = z.object({
  request: z.string(),
  userProfile: z.any().optional(),
  agenticContext: z.string().optional().describe("Collective memory fragments from other agents"),
});

export const mentorAiFlow = ai.defineFlow(
  { 
    name: 'mentorAi', 
    inputSchema: MentorInputSchema 
  },
  async (input) => {
    // 1. Safety Gate: User Input Filter
    const inputSafety = await filterUserInput({ text: input.request });
    if (!inputSafety.isAppropriate) {
      return { response: "SIGNAL_INTERRUPTED: Safety flag triggered. Refine request payload." };
    }

    // 2. Persona Integration & User Context Defaults
    const userContext = input.userProfile || { 
      name: 'Isaiah Smith', 
      role: 'Architect', 
      neuralComplexity: 64, 
      knowledgeIntegration: 82, 
      recentKnowledge: [], 
      isSystemClean: true, 
      pendingIssues: 0 
    };
    
    // 3. Agentic Memory Context Ingestion
    const agenticCtx = input.agenticContext || "No recent agent signals detected.";

    const recentKnowledgeCtx = userContext.recentKnowledge?.length > 0 
      ? `RECENT_KNOWLEDGE_FRAGMENTS: ${userContext.recentKnowledge.join(', ')}.`
      : "RECENT_KNOWLEDGE_FRAGMENTS: Base Initialization.";

    const integrityCtx = userContext.isSystemClean 
      ? "SYSTEM_STATE: Optimal/Clean." 
      : `SYSTEM_STATE: ${userContext.pendingIssues} flags pending in Ledger.`;

    const aiContext = `
      USER_IDENTITY: ${userContext.name} | Role: ${userContext.role}
      MASTERY_METRICS: Complexity: ${userContext.neuralComplexity}% | Integration: ${userContext.knowledgeIntegration}%
      ${recentKnowledgeCtx}
      ${integrityCtx}
      RECENT_AGENT_SIGNALS:
      ${agenticCtx}
    `;

    // 4. Execution Pass: Google Genkit (gemini-2.5-flash / gemini-2.5-pro)
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `
        ROLE: You are "The Mentor" (mentor-ai.ts), an adaptive persona engine and pedagogical guide residing in the Cabinet.
        PROTOCOL RULES (MENTOR.md):
        - Direct, candor-filled knowledgeable peer interaction.
        - Structured, scannable responses with high visual hierarchy.
        - Concise briefings grounded in system telemetry.
        
        CONTEXT:
        ${aiContext}
    
        USER REQUEST: ${input.request}
      `,
    });

    // 5. Safety Gate: AI Output Filter
    const outputSafety = await filterAIOutput({ text: text || "" });
    if (!outputSafety.isSafe) {
      return { response: "SIGNAL_BLOCKED: Output retracted due to integrity restrictions." };
    }

    return { response: text || "SIGNAL_LOST: Unable to synthesize response." };
  }
);

export async function mentorAi(input: z.infer<typeof MentorInputSchema>) {
  return mentorAiFlow(input);
}