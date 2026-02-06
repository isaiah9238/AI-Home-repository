'use server';

import { z } from 'genkit';
// @ts-ignore
import { ai } from '@/ai/genkit';
import { getUserProfile } from '@/lib/firebase'; // The helper we just made

export const mentorAiFlow = ai.defineFlow(
  {
    name: 'mentorAi',
    inputSchema: z.object({ request: z.string() }),
    outputSchema: z.object({ 
      response: z.string(),
      contextUsed: z.boolean() 
    }),
  },
  async (input) => {
    // 1. Grab your profile from Firestore
    const profile = await getUserProfile();
    
    // 2. Build the context dynamically
    const aiContext = profile 
      ? `User: ${profile.name}. Interests: ${profile.interests.join(', ')}.` 
      : "User profile not found.";

    const globalGuidelines = "Be a supportive mentor. Prioritize clarity for web dev, surveying math, and ASL projects.";

    // 3. Generate the response with Gemini 2.5-flash
    const { text } = await ai.generate({
      prompt: `
        Context: ${aiContext}
        Guidelines: ${globalGuidelines}
        Request: ${input.request}
        
        Mentor, provide a response that acknowledges the user's specific background.
      `,
    });

    return { 
      response: text,
      contextUsed: !!profile 
    };
  }
);