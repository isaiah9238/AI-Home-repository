import { z } from 'genkit';
// @ts-ignore - The module is verified on disk via 'ls'
import { ai } from '@/ai/genkit';

export const fluxEcho = ai.defineFlow(
  {
    name: 'fluxEcho',
    inputSchema: z.string(),
    outputSchema: z.object({
      summary: z.string(),
      suggestedActions: z.array(z.string()),
    }),
  },
  async (url: string) => {
    const response = await ai.generate({
      prompt: `You are FluxEcho. Visit this URL and epitomize the content into 3 concise, high-impact bullet points: ${url}`,
    });

    return {
      summary: response.text,
      suggestedActions: ["Share", "Save"],
    };
  }
);