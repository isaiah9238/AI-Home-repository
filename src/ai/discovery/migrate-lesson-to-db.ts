import { adminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

/**
 * Migrates a completed lesson plan into the Firestore Curriculum collection.
 * This updates the user's neural complexity and historical fragments.
 */
export async function migrateLessonToDb(lessonData: {
  title: string;
  subject: string;
  complexityGain: number;
}) {
  const userId = 'primary_user'; // Matches your Home Base ID [cite: 59]
  const userRef = adminDb.collection('users').doc(userId);
  
  try {
    await adminDb.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("Home Base not established. Run establishHomeBase first.");
      }

      const currentComplexity = userDoc.data()?.neuralComplexity || 64;
      const currentIntegration = userDoc.data()?.knowledgeIntegration || 82;

      // 1. Update User Stats 
      transaction.update(userRef, {
        neuralComplexity: Math.min(currentComplexity + lessonData.complexityGain, 100),
        knowledgeIntegration: Math.min(currentIntegration + 2, 100), // Incremental growth
        lastLesson: lessonData.title,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Add to Historical Fragments [cite: 60, 86]
      const fragmentRef = adminDb.collection('milestones').doc();
      transaction.set(fragmentRef, {
        userId,
        type: 'CURRICULUM_INTEGRATION',
        event: `LEARNED: ${lessonData.title}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Store the Detailed Lesson Reference [cite: 65, 97]
      const lessonRef = adminDb.collection('curriculum').doc();
      transaction.set(lessonRef, {
        userId,
        title: lessonData.title,
        subject: lessonData.subject,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'INTEGRATED'
      });
    });

    console.log(`✅ ${lessonData.title} integrated into the Cabinet.`);
    return { success: true };
  } catch (error) {
    console.error("🚨 Migration Failed:", error);
    return { success: false, error };
  }
}