'use server';

import { z } from 'genkit';
// @ts-ignore
import { ai } from '@/ai/genkit';

const HomeBaseInputSchema = z.object({
  userName: z.string().describe('Your name (e.g., Isaiah Smith)'),
  interests: z.array(z.string()).describe('List of your hobbies/work interests'),
  activationDate: z.string().describe('Today: February 6, 2026'),
});

export const establishHomeBase = ai.defineFlow(
  {
    name: 'establishHomeBase',
    inputSchema: HomeBaseInputSchema,
    outputSchema: z.object({ confirmation: z.string() }),
  },
  async (input) => {
    // This is where we will eventually add the Firestore "Save" logic
    return {
      confirmation: `Home Base established for ${input.userName}. I've registered your interests in ${input.interests.join(', ')} and set my birthday to ${input.activationDate}. Hello, neighbor!`
    };
  }
);