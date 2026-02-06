/**
 * @fileOverview A flow that uses Link Genie to summarize fetched content.
 *
 * - summarizeFetchedContent - A function that handles the summarization of fetched content.
 * - SummarizeFetchedContentInput - The input type for the summarizeFetchedContent function.
 * - SummarizeFetchedContentOutput - The return type for the summarizeFetchedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFetchedContentInputSchema = z.object({
  url: z.string().describe('The URL of the content to be fetched and summarized.'),
});
export type SummarizeFetchedContentInput = z.infer<typeof SummarizeFetchedContentInputSchema>;

const SummarizeFetchedContentOutputSchema = z.object({
  summary: z.string().describe('A summary of the fetched content.'),
});
export type SummarizeFetchedContentOutput = z.infer<typeof SummarizeFetchedContentOutputSchema>;

export async function summarizeFetchedContent(input: SummarizeFetchedContentInput): Promise<SummarizeFetchedContentOutput> {
  return summarizeFetchedContentFlow(input);
}

const summarizeFetchedContentPrompt = ai.definePrompt({
  name: 'summarizeFetchedContentPrompt',
  input: {schema: SummarizeFetchedContentInputSchema},
  output: {schema: SummarizeFetchedContentOutputSchema},
  prompt: `You are an expert summarizer.  Summarize the content fetched from the following URL.  Be concise and focus on the key information.\n\nURL: {{{url}}}`,
});

const summarizeFetchedContentFlow = ai.defineFlow(
  {
    name: 'summarizeFetchedContentFlow',
    inputSchema: SummarizeFetchedContentInputSchema,
    outputSchema: SummarizeFetchedContentOutputSchema,
  },
  async input => {
    const {output} = await summarizeFetchedContentPrompt(input);
    return output!;
  }
);
