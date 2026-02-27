import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebaseAdmin';

// Define a schema that matches what actions.ts is sending
const MentorInputSchema = z.object({
  request: z.string(),
  userProfile: z.any().optional(),
});

export const mentorAiFlow = ai.defineFlow(
  { 
    name: 'mentorAi', 
    inputSchema: MentorInputSchema 
  },
  async (input) => {
    // 1. If userProfile wasn't passed, try to fetch it from Firestore
    let profile = input.userProfile;
    
    if (!profile) {
      const userDoc = await adminDb.collection('users').doc('primary_user').get();
      profile = userDoc.data();
    }

    // 2. Build the Persona
    const aiContext = profile 
      ? `You are a Web Intel Mentor. User: ${profile.name}. Interests: ${profile.interests?.join(', ')}.` 
      : "You are a Web Intel Mentor. The user profile is not yet established.";

    // 3. Generate the response
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `Context: ${aiContext}\n\nTask: ${input.request}`,
    });

    return { response: text };
  }
);