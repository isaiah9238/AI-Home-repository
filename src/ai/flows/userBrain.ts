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
    // Using the flow directly since we are on Genkit 1.x
    const context = await ai.run('establish-context', async () => {
       return await establishHomeBase({ userId: 'primary_user' });
    });

    // 2. Process query with unified context
    // FIX: Only one declaration of 'response' or 'text'
    const response = await ai.generate({
      prompt: `
        Identity: Speaking to ${context.userContext?.name || 'Architect'}.
        System Status: ${context.userContext?.daysOld || 'Unknown'} days since core activation.
        Current Focus: The Algorithmic Architect (Generative Design & BIM).
        
        Capabilities: The system understands its own 'Cabinet' as an interplay 
        of physical form and generative code.
        
        User Query: ${input.query}
      `,
    });

    // 3. Return the synthesis
    return response.text;
  }
);