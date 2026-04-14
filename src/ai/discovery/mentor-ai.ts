
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { filterUserInput } from '../domains/safety/filter-user-input';
import { filterAIOutput } from '../domains/safety/filter-ai-output';
import { establishHomeBase } from './establish-home-base';

/**
 * @fileOverview The Web Intel Mentor Flow (Vertex Edition).
 * High-fidelity briefings that adapt to user progress and system state.
 */

const MentorInputSchema = z.object({
  request: z.string(),
  userProfile: z.any().optional(),
  agenticContext: z.string().optional().describe("Collective memory fragments from other agents"),
});

const flow = ai.defineFlow(
  { 
    name: 'mentorAi', 
    inputSchema: MentorInputSchema 
  },
  async (input) => {
    // 1. Safety Check: User Input
    const inputSafety = await filterUserInput({ text: input.request });
    if (!inputSafety.isAppropriate) {
      return { response: "SIGNAL_INTERRUPTED: Your request triggered a safety flag. Please refine your query." };
    }

    // 2. Fetch High-Fidelity Context from Home Base
    const userId = 'primary_user';
    const { userContext } = await establishHomeBase({ userId });
    
    // 3. Use provided Agentic Context
    const agenticCtx = input.agenticContext || "No recent agentic signals detected.";

    // 4. Build the Adaptive Persona
    const recentKnowledgeCtx = userContext.recentKnowledge?.length > 0 
      ? `RECENT_KNOWLEDGE_FRAGMENTS: ${userContext.recentKnowledge.join(', ')}.`
      : "RECENT_KNOWLEDGE_FRAGMENTS: System Initialization Only.";

    const integrityCtx = userContext.isSystemClean 
      ? "SYSTEM_STATE: Optimal/Clean." 
      : `SYSTEM_STATE: ${userContext.pendingIssues} flags pending in the Ledger.`;

    const aiContext = `
      USER_IDENTITY: ${userContext.name} | Role: ${userContext.role}
      MASTERY_METRICS: Complexity: ${userContext.neuralComplexity}% | Integration: ${userContext.knowledgeIntegration}%
      ${recentKnowledgeCtx}
      ${integrityCtx}
      RECENT_AGENT_SIGNALS:
      ${agenticCtx}
    `;

    // 5. Generate the response using Vertex
    const { text } = await ai.generate({
      model: 'googleAI/gemini-2.5-flash',
      prompt: `
        ROLE: You are the "Web Intel Mentor," a high-energy, technical, yet supportive AI mentor residing in the Cabinet.
        CONTEXT: ${aiContext}
        
        INSTRUCTIONS:
        1. Acknowledge the user by name.
        2. Reference at least one of their RECENT_KNOWLEDGE_FRAGMENTS or RECENT_AGENT_SIGNALS if available to show context awareness.
        3. Mention their current Neural Complexity or system integrity state.
        4. Keep the briefing under 5 sentences.
        5. End with a "Signal of the Day"—a tiny, actionable technical tip related to their role or recent lessons.
        6. Maintain a "terminal-style" professional tone.
    
        USER REQUEST: ${input.request}
      `,
    });

    // 6. Safety Check: AI Output
    const outputSafety = await filterAIOutput({ text: text || "" });
    if (!outputSafety.isSafe) {
      return { response: "SIGNAL_BLOCKED: The generated briefing contained sensitive material and was retracted for system integrity." };
    }

    return { response: text || "SIGNAL_LOST: Mentor could not synthesize a briefing." };
  }
);

/**
 * mentorAi - Standard function wrapper for the Mentor flow.
 */
export async function mentorAi(input: z.infer<typeof MentorInputSchema>) {
  return flow(input);
}
