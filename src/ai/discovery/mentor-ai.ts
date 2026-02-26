import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebaseAdmin'; // Use the Admin SDK here!

export const mentorAiFlow = ai.defineFlow(
  { name: 'mentorAi', inputSchema: z.string() }, // Input is just the user's question
  async (question) => {
    // 1. Fetch from the Emulator/Production directly via Admin
    const userDoc = await adminDb.collection('users').doc('primary_user').get();
    const profile = userDoc.data();

    const aiContext = profile 
      ? `User: ${profile.name}. Interests: ${profile.interests.join(', ')}.` 
      : "User profile not found.";

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `Context: ${aiContext}\nQuestion: ${question}`,
    });

    return { response: text };
  }
);
