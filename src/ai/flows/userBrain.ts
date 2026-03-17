import { ai } from '../genkit';
import { z } from 'genkit';
import { establishHomeBase } from '../discovery/establish-home-base';

export const userBrain = ai.defineFlow(
  {
    name: 'userBrain',
    inputSchema: z.object({ query: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    // 1. Establish context (The Librarian)
    const context = await ai.run('establish-context', async () => {
       return await establishHomeBase({ userId: 'primary_user' });
    });

    const { userContext } = context;

    // 2. Process query with dynamic context
    const response = await ai.generate({
      prompt: `
        SYSTEM_IDENTITY: You are the "Adaptive Brain" of the Cabinet.
        USER: ${userContext.name} (${userContext.role})
        PROGRESS: ${userContext.curriculumCount} lessons integrated.
        NEURAL_COMPLEXITY: ${userContext.neuralComplexity}%
        INTEGRITY: ${userContext.isSystemClean ? 'CLEAN' : userContext.pendingIssues + ' issues pending'}
        GEMS: ${userContext.gemsBalance} collected.
        
        BEHAVIOR:
        - If neural complexity is high (>80%), be more abstract and theoretical.
        - If many issues are pending, be more urgent and focused on security.
        - Always acknowledge the user's progress implicitly in your tone.
        
        USER_QUERY: ${input.query}
      `,
    });

    return response.text;
  }
);