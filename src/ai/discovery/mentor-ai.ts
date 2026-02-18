import { z } from 'genkit';
import { ai } from '@/ai/genkit';

const MentorAiInputSchema = z.object({
  request: z.string(),
  userProfile: z.object({
    name: z.string(),
    interests: z.array(z.string()),
  }).optional(),
});


export const mentorAiFlow = ai.defineFlow(
  {
    name: 'mentorAi',
    inputSchema: MentorAiInputSchema,
    outputSchema: z.object({ 
      response: z.string(),
      contextUsed: z.boolean() 
    }),
  },
  async (input) => {
    // 1. Use the passed-in profile
    const profile = input.userProfile;
    
    // 2. Build the context dynamically
    const aiContext = profile 
      ? `User: ${profile.name}. Interests: ${profile.interests.join(', ')}.` 
      : "User profile not found.";

    const globalGuidelines = "Be a supportive mentor. Prioritize clarity for web dev, surveying math, and ASL projects.";

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash', // OR the model variable from your config
      prompt: `
        Context: ${aiContext}
        Guidelines: ${globalGuidelines}
        Request: ${input.request}
      `,
    });

    return { 
      response: text,
      contextUsed: !!profile 
    };
  }
);
