/**
 * @fileOverview A flow that uses Flux Echo to Epitomize fetched content.
 *
 * - EpitomizeFetchedContent - A function that handles the summarization of fetched content.
 * - EpitomizeFetchedContentInput - The input type for the EpitomizeFetchedContent function.
 * - EpitomizeFetchedContentOutput - The return type for the EpitomizeFetchedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EpitomizeFetchedContentInputSchema = z.object({
  url: z.string().describe('The URL of the content to be fetched and Epitomized.'),
});
export type EpitomizeFetchedContentInput = z.infer<typeof EpitomizeFetchedContentInputSchema>;

const EpitomizeFetchedContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the fetched content.'),
});
export type EpitomizeFetchedContentOutput = z.infer<typeof EpitomizeFetchedContentOutputSchema>;

export async function EpitomizeFetchedContent(input: EpitomizeFetchedContentInput): Promise<EpitomizeFetchedContentOutput> {
  return EpitomizeFetchedContentFlow(input);
}

const EpitomizeFetchedContentPrompt = ai.definePrompt({
  name: 'EpitomizeFetchedContentPrompt',
  input: {schema: EpitomizeFetchedContentInputSchema},
  output: {schema: EpitomizeFetchedContentOutputSchema},
  prompt: `You are an expert Epitomizer.  Epitomize the content fetched from the following URL.  Be concise and focus on the key information.\n\nURL: {{{url}}}`,
});

const EpitomizeFetchedContentFlow = ai.defineFlow(
  {
    name: 'EpitomizeFetchedContentFlow',
    inputSchema: EpitomizeFetchedContentInputSchema,
    outputSchema: EpitomizeFetchedContentOutputSchema,
  },
  async input => {
    const {output} = await EpitomizeFetchedContentPrompt(input);
    return output!;
  }
);
