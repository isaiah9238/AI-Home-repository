import { ai } from '../../genkit';
import { z } from 'genkit';

export const analyzeCodeSnippet = ai.defineFlow(
  {
    name: 'analyzeCodeSnippet',
    inputSchema: z.object({ code: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Analyze the following code for bugs, security vulnerabilities, and performance issues:\n\n${input.code}`,
    });
    return text;
  }
);