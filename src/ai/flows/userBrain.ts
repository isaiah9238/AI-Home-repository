import { ai } from '../genkit';
import { z } from 'genkit';
import { establishHomeBase } from '../discovery/establish-home-base';

// The Core Brain that connects the Librarian (Firestore) to the Mentor (AI)
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

    // 2. Process query with context (The Mentor)
    const { text } = await ai.generate({
      prompt: `
        Context: You are speaking to ${context.userContext.name}.
        Role: Mentor / Personal AI.
        User Query: ${input.query}
      `,
    });
    
    return text;
  }
);