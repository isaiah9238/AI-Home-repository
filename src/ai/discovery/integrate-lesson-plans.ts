import { ai } from '../genkit';
import { z } from 'genkit';

export const integrateLessonPlans = ai.defineFlow(
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