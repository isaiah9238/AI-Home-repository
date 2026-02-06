/**
 * @fileOverview A flow to filter user input for inappropriate language.
 *
 * - filterUserInput - A function that filters user input.
 * - FilterUserInputInput - The input type for the filterUserInput function.
 * - FilterUserInputOutput - The return type for the filterUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterUserInputInputSchema = z.object({
  text: z.string().describe('The text to filter for inappropriate language.'),
});
export type FilterUserInputInput = z.infer<typeof FilterUserInputInputSchema>;

const FilterUserInputOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe('Whether the text is appropriate or not.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the text is considered inappropriate.'),
});
export type FilterUserInputOutput = z.infer<typeof FilterUserInputOutputSchema>;

export async function filterUserInput(
  input: FilterUserInputInput
): Promise<FilterUserInputOutput> {
  return filterUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterUserInputPrompt',
  input: {schema: FilterUserInputInputSchema},
  output: {schema: FilterUserInputOutputSchema},
  prompt: `You are a content moderation AI.

You will be given a text input and must determine if it is appropriate or not.

If the text is appropriate, return isAppropriate as true and omit the reason field.
If the text is inappropriate, return isAppropriate as false and provide a reason.

Text: {{{text}}}`,
});

const filterUserInputFlow = ai.defineFlow(
  {
    name: 'filterUserInputFlow',
    inputSchema: FilterUserInputInputSchema,
    outputSchema: FilterUserInputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
