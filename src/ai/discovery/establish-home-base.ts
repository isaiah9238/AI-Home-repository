import { ai } from '../genkit';
import { z } from 'genkit';
import { getAdminDb } from '../../lib/firebaseAdmin';

/**
 * @fileOverview A flow to establish the user's home base and fetch profile context.
 */

// Utility to ensure dates are strings for Server Action serializability
const sanitizeVal = (val: any): any => {
  if (!val) return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (typeof val._seconds === 'number') return new Date(val._seconds * 1000).toISOString();
  return val;
};

const flow = ai.defineFlow(
  {
    name: 'establishHomeBase',
    inputSchema: z.object({ userId: z.string() }),
    outputSchema: z.object({ status: z.string(), userContext: z.any() }),
  },
  async (input) => {
    const db = getAdminDb();
    const userId = input.userId;

    // Fetch primary user data, curriculum, and integrity in parallel
    const [userDoc, lessonsSnapshot, gemsSnapshot] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('curriculum')
        .where('userId', '==', userId)
        .orderBy('completedAt', 'desc')
        .limit(5)
        .get(),
      db.collection('gems').where('resolution', '==', 'pending').get()
    ]);

    if (!userDoc.exists) {
      return {
        status: 'Home Base: Template Initialized',
        userContext: {
          name: 'Primary User',
          role: 'Architect',
          established: '2026-02-06',
          curriculumCount: 0,
          pendingIssues: 0,
          neuralComplexity: 64,
          knowledgeIntegration: 82,
          masteryPhase: 'INITIALIZATION',
          recentKnowledge: []
        }
      };
    }

    const userData = userDoc.data();
    const curriculumCount = lessonsSnapshot.size;
    const pendingIssues = gemsSnapshot.size;
    const complexity = userData?.neuralComplexity || 64;
    
    // Extract recent lesson titles for Brain Ingestion
    const recentKnowledge = lessonsSnapshot.docs.map(doc => doc.data().title);

    // Determine Mastery Phase
    let masteryPhase = 'INITIAL';
    if (complexity > 75) masteryPhase = 'ARCHITECT';
    else if (complexity > 40) masteryPhase = 'EXPANSION';

    return {
      status: 'Home Base Established: Librarian Operational',
      userContext: {
        name: userData?.name || 'Isaiah Smith',
        role: userData?.role || 'Primary User',
        established: sanitizeVal(userData?.establishedDate) || '2026-02-06',
        interests: userData?.interests || [],
        gemsBalance: userData?.gemsBalance || 0,
        curriculumCount,
        pendingIssues,
        isSystemClean: pendingIssues === 0,
        neuralComplexity: complexity,
        knowledgeIntegration: userData?.knowledgeIntegration || 82,
        masteryPhase,
        recentKnowledge
      }
    };
  }
);

/**
 * establishHomeBase - Standard function wrapper for the Genkit flow.
 */
export async function establishHomeBase(input: { userId: string }) {
  return flow(input);
}
