'use server';

/**
 * @fileOverview Integrates user-provided lesson plans to guide the AI's learning.
 *
 * This file exports:
 * - `integrateLessonPlans`: A function to integrate lesson plans and update the AI's knowledge.
 * - `IntegrateLessonPlansInput`: The input type for the integrateLessonPlans function.
 * - `IntegrateLessonPlansOutput`: The return type for the integrateLessonPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntegrateLessonPlansInputSchema = z.object({
  lessonPlan: z.string().describe('The lesson plan content provided by the user.'),
});
export type IntegrateLessonPlansInput = z.infer<typeof IntegrateLessonPlansInputSchema>;

const IntegrateLessonPlansOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the lesson plan integration was successful.'),
  message: z.string().describe('A message providing details about the integration process.'),
});
export type IntegrateLessonPlansOutput = z.infer<typeof IntegrateLessonPlansOutputSchema>;

export async function integrateLessonPlans(input: IntegrateLessonPlansInput): Promise<IntegrateLessonPlansOutput> {
  return integrateLessonPlansFlow(input);
}

const integrateLessonPlansPrompt = ai.definePrompt({
  name: 'integrateLessonPlansPrompt',
  input: {schema: IntegrateLessonPlansInputSchema},
  output: {schema: IntegrateLessonPlansOutputSchema},
  prompt: `You are an AI learning assistant. A user has provided the following lesson plan to expand your knowledge.  Review this plan and confirm your understanding and integration of the new information.  Respond with a success status of 'true' if the integration completes with no issues. Respond with status 'false' if there are any issues.

Lesson Plan:
{{{lessonPlan}}}

Ensure your response indicates if there were issues integrating the lesson plan.`,
});

const integrateLessonPlansFlow = ai.defineFlow(
  {
    name: 'integrateLessonPlansFlow',
    inputSchema: IntegrateLessonPlansInputSchema,
    outputSchema: IntegrateLessonPlansOutputSchema,
  },
  async input => {
    try {
      const {output} = await integrateLessonPlansPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error integrating lesson plan:', error);
      return {
        success: false,
        message: `Failed to integrate lesson plan: ${error.message || 'Unknown error'}`,
      };
    }
  }
);
