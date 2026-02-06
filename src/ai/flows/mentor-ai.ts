'use server';

import { z } from 'genkit';
// @ts-ignore
import { ai } from '@/ai/genkit';
import { getUserProfile } from '@/lib/firebase';

export const mentorAiFlow = ai.defineFlow(
  {
    name: 'mentorAi',
    inputSchema: z.object({ request: z.string() }),
    outputSchema: z.object({ response: z.string() }),
  },
  async (input) => {
    // 1. Fetch your permanent memory
    const profile = await getUserProfile();
    const userName = profile?.name || "Isaiah";
    const interests = profile?.interests?.join(', ') || "Web Development";

    // 2. Give the Mentor the context
    const prompt = `
      You are the Mentor AI for ${userName}. 
      ${userName} is interested in: ${interests}.
      Your job is to support the development of the 'AI Home' system and provide clear guidance.
      User Request: ${input.request}
    `;

    const { text } = await ai.generate({
      prompt: prompt,
      // The engine is already tuned to 2.5-flash in genkit.ts!
    });

    return { response: text };
  }
);