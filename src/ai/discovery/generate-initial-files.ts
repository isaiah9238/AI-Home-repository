import { ai } from '../genkit';
import { z } from 'genkit';

export const generateInitialFiles = ai.defineFlow(
  {
    name: 'generateInitialFiles',
    inputSchema: z.object({ blueprint: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Act as a software architect. Generate a file structure based on this blueprint: ${input.blueprint}`,
    });
    return text;
  }
);