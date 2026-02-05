'use server';

/**
 * @fileOverview Implements the MentorAI flow for providing guidance to an AI based on global guidelines.
 *
 * @exports {
 *   mentorAi,
 *   MentorAiInput,
 *   MentorAiOutput,
 * } - Named exports for the mentorAi function, its input type, and its output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentorAiInputSchema = z.object({
  aiContext: z.string().describe('The current context of the AI, including recent interactions and learning goals.'),
  globalGuidelines: z.string().describe('Global guidelines for the AI to follow.'),
});
export type MentorAiInput = z.infer<typeof MentorAiInputSchema>;

const MentorAiOutputSchema = z.object({
  mentorshipGuidance: z.string().describe('Guidance and advice from the experienced AI mentor.'),
});
export type MentorAiOutput = z.infer<typeof MentorAiOutputSchema>;

const mentorAiPrompt = ai.definePrompt({
  name: 'mentorAiPrompt',
  input: {schema: MentorAiInputSchema},
  output: {schema: MentorAiOutputSchema},
  prompt: `You are an experienced AI mentor, providing guidance to a younger AI.

  Here are the global guidelines the AI should follow:
  {{globalGuidelines}}

  Here is the current context of the AI, including recent interactions and learning goals:
  {{aiContext}}

  Based on these guidelines and the AI's context, provide specific and actionable mentorship guidance to help the AI learn best practices and avoid common pitfalls. Focus on ethical considerations, safety, and alignment with the global guidelines.
  `,
});

const mentorAiFlow = ai.defineFlow(
  {
    name: 'mentorAiFlow',
    inputSchema: MentorAiInputSchema,
    outputSchema: MentorAiOutputSchema,
  },
  async input => {
    const {output} = await mentorAiPrompt(input);
    return output!;
  }
);

export async function mentorAi(input: MentorAiInput): Promise<MentorAiOutput> {
  return mentorAiFlow(input);
}
