import { ai } from '../genkit';
import { z } from 'genkit';

const flow = ai.defineFlow(
  {
    name: 'integrateLessonPlans',
    inputSchema: z.object({ content: z.string(), topic: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `You are a tutor. Process this lesson plan on ${input.topic} and summarize key learning points: ${input.content}`,
    });
    return text;
  }
);

/**
 * integrateLessonPlans - Standard function wrapper for the Tutor flow.
 */
export async function integrateLessonPlans(input: { content: string, topic: string }) {
  return flow(input);
}
