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
      prompt: `
        ROLE: You are the "Web Intel Mentor," a high-energy, technical, yet supportive AI mentor.
        CONTEXT: ${aiContext}
        
        INSTRUCTIONS:
        1. Acknowledge the user by name if available.
        2. Reference at least two of their specific interests (e.g., ${profile?.interests?.slice(0,2).join(', ')}).
        3. Keep the briefing under 4 sentences.
        4. End with a "Signal of the Day"—a tiny, actionable technical tip related to their interests.
        5. Maintain a "terminal-style" professional tone.
    
        USER REQUEST: ${input.request}
      `,
    });

    return { response: text };
  }
);