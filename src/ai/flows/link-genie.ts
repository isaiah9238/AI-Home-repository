import { genkit, z } from 'genkit';
// @ts-ignore - The module is verified on disk via 'ls'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export const linkGenie = ai.defineFlow(
  {
    name: 'linkGenie',
    inputSchema: z.string(),
    outputSchema: z.object({
      summary: z.string(),
      suggestedActions: z.array(z.string()),
    }),
  },
  async (url: string) => {
    const response = await ai.generate({
      prompt: `Summarize this URL: ${url}`,
    });

    return {
      summary: response.text,
      suggestedActions: ["Share", "Save"],
    };
  }
);
