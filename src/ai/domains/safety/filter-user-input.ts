/**
 * @fileOverview Internal user input filtering logic.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {recordGem} from './gems-logger';

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

    if (output && !output.isAppropriate) {
      await recordGem({
        type: 'user_input',
        reason: output.reason || 'Unknown violation',
        content: input.text,
        severity: 'medium',
      });
    }

    return output!;
  }
);

/**
 * filterUserInput - Asynchronous wrapper for internal logic.
 */
export async function filterUserInput(input: FilterUserInputInput): Promise<FilterUserInputOutput> {
  return filterUserInputFlow(input);
}
