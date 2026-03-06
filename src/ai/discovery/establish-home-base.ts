import { ai } from '../genkit';
import { z } from 'genkit';
import { adminDb } from '../../lib/firebaseAdmin';

/**
 * @fileOverview A flow to establish the user's home base and fetch profile context.
 *
 * - establishHomeBase - A function that fetches or initializes the user profile.
 */

export const establishHomeBase = ai.defineFlow(
  {
    name: 'establishHomeBase',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.object({ status: z.string(), userContext: z.any() }),
  },
  async (input) => {
    // Connect to Firestore: Fetch the Primary User's desk data
    const userDoc = await adminDb.collection('users').doc(input.userId).get();

    if (!userDoc.exists) {
      console.warn(`⚠️ Librarian Alert: No profile for user [${input.userId}]. Using default template.`);
      return {
        status: 'Home Base: Template Initialized',
        userContext: {
          name: 'Primary User',
          role: 'Architect',
          established: '2026-02-06'
        }
      };
    }

    const userData = userDoc.data();

    return {
      status: 'Home Base Established: Librarian Operational',
      userContext: {
        name: userData?.name || 'Isaiah Smith',
        role: userData?.role || 'Primary User',
        established: userData?.establishedDate || '2026-02-06',
        interests: userData?.interests || []
      }
    };
  }
);