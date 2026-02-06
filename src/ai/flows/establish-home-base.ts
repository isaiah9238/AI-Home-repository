'use server';

import { z } from 'genkit';
// @ts-ignore
import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const HomeBaseInputSchema = z.object({
  userName: z.string(),
  interests: z.array(z.string()),
});

export const establishHomeBase = ai.defineFlow(
  {
    name: 'establishHomeBase',
    inputSchema: HomeBaseInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (input) => {
    try {
      // Save the profile to a 'users' collection using the name as the ID
      const userRef = doc(db, 'users', 'primary_user'); 
      
      await setDoc(userRef, {
        name: input.userName,
        interests: input.interests,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        aiBirthday: "February 6, 2026"
      }, { merge: true });

      return {
        success: true,
        message: `Welcome home, ${input.userName}. I've recorded your interests and saved our start date to Firestore.`
      };
    } catch (error: any) {
      console.error("Firestore Save Error:", error);
      return { success: false, message: error.message };
    }
  }
);