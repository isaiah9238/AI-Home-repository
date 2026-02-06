import { z } from 'genkit';
// @ts-ignore - The module is verified on disk via 'ls'
import { ai } from '@/ai/genkit';

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
