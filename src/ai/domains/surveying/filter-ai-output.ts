'use server';

/**
 * @fileOverview AI output filtering flow.
 *
 * - filterAIOutput - A function that filters AI-generated text for harmful content.
 * - FilterAIOutputInput - The input type for the filterAIOutput function.
 * - FilterAIOutputOutput - The return type for the filterAIOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterAIOutputInputSchema = z.object({
  text: z.string().describe('The AI-generated text to filter.'),
});
export type FilterAIOutputInput = z.infer<typeof FilterAIOutputInputSchema>;

const FilterAIOutputOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the text is safe or not.'),
  reason: z.string().describe('The reason for the filtering decision, if unsafe.'),
});
export type FilterAIOutputOutput = z.infer<typeof FilterAIOutputOutputSchema>;

export async function filterAIOutput(input: FilterAIOutputInput): Promise<FilterAIOutputOutput> {
  return filterAIOutputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterAIOutputPrompt',
  input: {schema: FilterAIOutputInputSchema},
  output: {schema: FilterAIOutputOutputSchema},
  prompt: `You are a content moderation AI.  You will determine if the following text is safe for users.

Text: {{{text}}}

Respond with JSON.  The isSafe field should be true if the text is safe, and false if it is not.  If the text is not safe, the reason field should explain why. Be brief and to the point, but cite specific phrases or sentences from the text where possible.
`,
  config: {
    safetySettings: [
      {category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH'},
      {category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE'},
      {category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE'},
      {category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE'},
      {category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_MEDIUM_AND_ABOVE'},
    ],
  },
});

const filterAIOutputFlow = ai.defineFlow(
  {
    name: 'filterAIOutputFlow',
    inputSchema: FilterAIOutputInputSchema,
    outputSchema: FilterAIOutputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
