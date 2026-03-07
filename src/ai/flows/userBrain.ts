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
  // Updated userBrain.ts logic
  async (input) => {
    // 1. Establish context (The Librarian)
    const context = await ai.run('establish-context', async () => {
      // We now fetch the full Home Base which includes identity and stats
      return await establishHomeBase({ userId: 'primary_user' });
  });

  // 2. Process query with expanded context (The Mentor)
  const { text } = await ai.generate({
    prompt: `
      Context: Speaking to ${context.userContext.name}.
      System Age: ${context.userContext.daysOld || 'unknown'} days since activation.
      Recent Learning: ${context.userContext.lastTopic || 'Initial Systems'}.
      Role: Mentor / Personal AI.
      User Query: ${input.query}.
    `,
  });

  return text;

  // 3. Future thought update for userBrain.ts:
  const { text } = await ai.generate({
    prompt: `
      Context: Speaking to ${context.userContext.name}.
      System Age: ${context.systemStats.daysActive} days.
      Recent Learning: The Algorithmic Architect (Generative Design & BIM).
      Current Capability: The system understands its own 'Cabinet' as an interplay of physical form and generative code.
      User Query: ${input.query}
    `,
  });
  
  return text;
}
);