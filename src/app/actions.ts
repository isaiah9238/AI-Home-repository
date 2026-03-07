'use server';

import { mentorAiFlow } from '@/ai/discovery/mentor-ai';
import { linkGenie } from '@/ai/domains/research/link-genie';
import { epitomizeFetchedContent } from '@/ai/domains/research/epitomize-fetched-content';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { adminDb } from '@/lib/firebaseAdmin';
import { migrateLessonToDb } from '@/ai/discovery/migrate-lesson-to-db';
import { revalidatePath } from 'next/cache';

/**
 * @fileOverview The "Cabinet" of Server Actions.
 * These functions bridge the UI to the AI flows and Database.
 */

// --- 1. Mentor AI: Get Morning Briefing ---
export async function getMorningBriefing(userContext?: any) {
  try {
    const [curriculum, integrity] = await Promise.all([
      getCurriculumProgress(),
      getSystemIntegrity()
    ]);

    const result = await mentorAiFlow({ 
      request: "Give me my morning briefing.",
      userProfile: {
        ...userContext,
        curriculum: curriculum.success ? {
          integratedPlans: curriculum.integratedPlans,
          lastTopic: curriculum.lastTopic
        } : null,
        integrity: integrity.success ? {
          isClean: integrity.isClean,
          issueCount: integrity.issueCount
        } : null
      }
    });
    
    return result.response;
  } catch (error) {
    console.error("Mentor Action Error:", error);
    return "SYSTEM_OFFLINE: Could not sync with Mentor AI.";
  }
}

// --- 2. Research Domain: Flux Echo & Epitomizer ---

export async function runResearch(input: { url: string, mode: 'scout' | 'deep' }) {
  try {
    if (input.mode === 'scout') {
      const result = await linkGenie({ url: input.url });
      return { success: true, mode: 'scout', data: result };
    } else {
      const result = await epitomizeFetchedContent({ url: input.url });
      return { success: true, mode: 'deep', data: result };
    }
  } catch (error: any) {
    console.error("Research Action Error:", error);
    return { success: false, error: `MISSION_FAILED: ${error.message || "Coordinate unreachable."}` };
  }
}

// --- 3. Discovery Domain: Architect ---

export async function runArchitect(blueprint: string) {
  try {
    const result = await generateInitialFiles({ blueprint });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Architect Action Error:", error);
    return { success: false, error: `CONSTRUCTION_FAILED: ${error.message || "Blueprint unreadable."}` };
  }
}

// --- 4. Database: Home Base Logic ---

export async function getHomeBaseAction() {
  try {
    const userDoc = await adminDb.collection('users').doc('primary_user').get();
    
    if (!userDoc.exists) return null;

    const data = userDoc.data();
    if (!data) return null;

    // Sanitize Firestore Classes (Timestamps) into plain strings for Client hydration
    return {
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };
  } catch (error) {
    // Return null silently to allow the UI to handle the missing state gracefully
    console.warn("Librarian Sync Warning: Could not reach Home Base. Check connection.");
    return null;
  }
}

export async function getHomeBase() {
  try {
    const doc = await adminDb.collection('users').doc('primary_user').get();
    if (doc.exists) {
      const data = doc.data();
      return { 
        success: true, 
        data: {
          ...data,
          createdAt: data?.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
        }
      };
    }
    return { success: false, error: "HOME_BASE_NOT_FOUND" };
  } catch (error) {
    return { success: false, error: "SYSTEM_READ_ERROR" };
  }
}

// --- 5. Evolution & Curriculum ---

export async function getSystemEvolution() {
  try {
    const doc = await adminDb.collection('users').doc('primary_user').get();
    const establishedDate = doc.exists 
      ? doc.data()?.establishedDate 
      : '2026-02-06';

    const start = new Date(establishedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { 
      success: true, 
      daysOld: diffDays, 
      isAnniversary: now.getMonth() === start.getMonth() && now.getDate() === start.getDate() 
    };
  } catch (error) {
    return { success: false, daysOld: 0 };
  }
}

export async function getCurriculumProgress() {
  try {
    const userId = 'primary_user';
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const data = userDoc.data();
    
    const lessonsSnapshot = await adminDb.collection('curriculum')
      .where('userId', '==', userId)
      .orderBy('completedAt', 'desc')
      .get();

    const lessons = lessonsSnapshot.docs.map(doc => {
      const l = doc.data();
      return {
        id: doc.id,
        ...l,
        completedAt: l.completedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    const milestonesSnapshot = await adminDb.collection('milestones').get();
    const milestoneCount = milestonesSnapshot.size;

    return {
      success: true,
      integratedPlans: lessons.length,
      neuralComplexity: Math.min(lessons.length * 5 + 64, 100),
      knowledgeIntegration: Math.min(milestoneCount * 2 + 82, 100),
      lastTopic: data?.lastLesson || "System Initialization",
      lessons: lessons
    };
  } catch (error) {
    return { success: false, integratedPlans: 0, neuralComplexity: 64, knowledgeIntegration: 82, lessons: [] };
  }
}

export async function integrateLessonAction(data: { title: string; subject: string; complexityGain: number }) {
  return await migrateLessonToDb(data);
}

// --- 6. Safety & Integrity ---

export async function getSystemIntegrity() {
  try {
    const criticalGems = await adminDb.collection('gems')
      .where('resolution', '==', 'pending')
      .where('severity', 'in', ['high', 'critical'])
      .get();

    return {
      success: true,
      isClean: criticalGems.empty,
      issueCount: criticalGems.size
    };
  } catch (error) {
    return { success: false, isClean: true, issueCount: 0 };
  }
}

export async function getGems() {
  try {
    const snapshot = await adminDb.collection('gems').orderBy('time', 'desc').get();
    const gems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        time: data.time?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
    return { success: true, data: gems };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}

export async function resolveGem(id: string, resolution: 'resolved' | 'dismissed') {
  try {
    await adminDb.collection('gems').doc(id).update({ resolution });
    revalidatePath('/reports');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getMilestones() {
  try {
    const snapshot = await adminDb.collection('milestones').orderBy('date', 'desc').get();
    const milestones = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.()?.toISOString().split('T')[0] || data.date
      };
    });
    return { success: true, data: milestones };
  } catch (error) {
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}
