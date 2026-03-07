'use server';

import { mentorAiFlow } from '@/ai/discovery/mentor-ai';
import { linkGenie } from '@/ai/domains/research/link-genie';
import { epitomizeFetchedContent } from '@/ai/domains/research/epitomize-fetched-content';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
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
        // LANDMARK: Map the properties directly since 'data' isn't a type
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

export async function runFluxEcho(url: string) {
  return runResearch({ url, mode: 'scout' });
}

export type ResearchMode = 'scout' | 'deep';

export async function runResearch(input: { url: string, mode: ResearchMode }) {
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

// --- 4. Legacy / Utility Actions ---

export type EpitomizeState = {
    message: string;
    data: any | null;
};

export async function EpitomizeUrl(prevState: EpitomizeState, formData: FormData): Promise<EpitomizeState> {
    const url = formData.get('url') as string;
    try {
        const result = await epitomizeFetchedContent({ url });
        return { message: "Success", data: { summary: result.epitome, ...result } };
    } catch (error: any) {
        return { message: error.message || "Failed to epitomize.", data: null };
    }
}

// ✅ Update your FETCH logic, not just the SEED logic
export async function getHomeBaseAction() {
  try {
    const userDoc = await adminDb.collection('users').doc('primary_user').get();
    
    if (!userDoc.exists) return null;

    const data = userDoc.data();

    // The Critical Step: Convert Firestore Class -> Plain String
    return {
      ...data,
      createdAt: data?.createdAt?.toDate().toISOString() || null,
      // If you have an updatedAt, do the same:
      updatedAt: data?.updatedAt?.toDate().toISOString() || null,
    };
  } catch (error) {
    console.error("Librarian Fetch Error:", error);
    return null;
  }
}

// --- 6. Database: Fetch User Profile ---
export async function getHomeBase() {
  try {
    const doc = await adminDb.collection('users').doc('primary_user').get();
    if (doc.exists) {
      return { success: true, data: doc.data() };
    }
    return { success: false, error: "HOME_BASE_NOT_FOUND" };
  } catch (error) {
    console.error("Fetch Home Base Error:", error);
    return { success: false, error: "SYSTEM_READ_ERROR" };
  }
}

// --- 7. Evolution: Calculate System Age ---
export async function getSystemEvolution() {
  try {
    const doc = await adminDb.collection('users').doc('primary_user').get();
    const establishedDate = doc.exists 
      ? doc.data()?.establishedDate 
      : '2026-02-06'; // [cite: 59, 60]

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

// --- 8. Curriculum: Fetch Learning Progress ---
export async function getCurriculumProgress() {
  try {
    const userId = 'primary_user';
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const data = userDoc.data();
    
    // Fetch lessons for dynamic complexity calculation and display [cite: blueprint.md]
    const lessonsSnapshot = await adminDb.collection('curriculum').where('userId', '==', userId).orderBy('completedAt', 'desc').get();
    const lessonCount = lessonsSnapshot.size;
    const lessons = lessonsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().completedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Fetch milestone count for knowledge integration calculation [cite: blueprint.md]
    const milestonesSnapshot = await adminDb.collection('milestones').get();
    const milestoneCount = milestonesSnapshot.size;

    // Phase 2.0 Calculation: Lessons * Gain (assumed 5% per lesson)
    const calculatedComplexity = Math.min(lessonCount * 5 + 64, 100); 
    // Knowledge Integration: Historical Fragments count * 2%
    const calculatedIntegration = Math.min(milestoneCount * 2 + 82, 100);

    return {
      success: true,
      integratedPlans: lessonCount,
      neuralComplexity: calculatedComplexity,
      knowledgeIntegration: calculatedIntegration,
      lastTopic: data?.lastLesson || "System Initialization",
      lessons: lessons
    };
  } catch (error) {
    console.error("Curriculum Progress Error:", error);
    return { success: false, integratedPlans: 0, neuralComplexity: 64, knowledgeIntegration: 82, lessons: [] };
  }
}

// --- 9. Migrate lesson Plan
export async function integrateLessonAction(data: { title: string; subject: string; complexityGain: number }) {
  // This runs strictly on the server
  return await migrateLessonToDb(data);
}

// --- . Safety: Check System Integrity ---
export async function getSystemIntegrity() {
  try {
    // Check for any 'pending' gems with 'high' or 'critical' severity
    const criticalGems = await adminDb.collection('gems')
      .where('resolution', '==', 'pending')
      .where('severity', 'in', ['high', 'critical'])
      .get();

    return {
      success: true,
      isClean: criticalGems.empty,
      activeLogger: true,
      issueCount: criticalGems.size
    };
  } catch (error) {
    console.error("Integrity Check Error:", error);
    return { success: false, isClean: true, activeLogger: false };
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
    console.error("Fetch Gems Error:", error);
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}

export async function resolveGem(id: string, resolution: 'resolved' | 'dismissed') {
  try {
    await adminDb.collection('gems').doc(id).update({ resolution });
    revalidatePath('/reports');
    return { success: true };
  } catch (error) {
    console.error("Resolve Gem Error:", error);
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
    console.error("Fetch Milestones Error:", error);
    return { success: false, error: "LIBRARIAN_READ_ERROR" };
  }
}
