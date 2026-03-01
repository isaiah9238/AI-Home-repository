import { ai } from '../../genkit';
import { z } from 'genkit';

export const epitomizeFetchedContent = ai.defineFlow(
  {
    name: 'epitomizeFetchedContent',
    inputSchema: z.object({ rawText: z.string(), sourceUrl: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Deep read the following content from ${input.sourceUrl} and turn the noise into clean, epitomized notes:\n\n${input.rawText}`,
    });
    return text;
  }
);