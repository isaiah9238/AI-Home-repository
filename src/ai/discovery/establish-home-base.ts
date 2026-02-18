'use server';

import { z } from 'genkit';
// @ts-ignore
import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';

export const getHomeBase = ai.defineFlow(
  {
    name: 'getHomeBase',
    inputSchema: z.void(), // No input needed to fetch the primary profile
    outputSchema: z.object({ 
      success: z.boolean(), 
      data: z.any().optional(),
      message: z.string().optional() 
    }),
  },
  async () => {
    try {
      const { getDoc, doc } = await import('firebase/firestore');
      const userDoc = await getDoc(doc(db, 'users', 'primary_user'));

      if (!userDoc.exists()) {
        return { success: false, message: "Home Base not established yet." };
      }

      return { success: true, data: userDoc.data() };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
);