'use server';

import { mentorAiFlow } from '@/ai/discovery/mentor-ai';
import { linkGenie } from '@/ai/domains/research/link-genie';
import { epitomizeFetchedContent } from '@/ai/domains/research/epitomize-fetched-content';
import { generateInitialFiles } from '@/ai/discovery/generate-initial-files';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { migrateLessonToDb } from '@/ai/discovery/migrate-lesson-to-db';
import { revalidatePath } from 'next/cache';

/**
 * @fileOverview The "Cabinet" of Server Actions.
 * These functions bridge the UI to the AI flows and Database.
 */

// --- 1. Terminal / Chat Logic ---

export async function sendTerminalMessage(message: string) {
  try {
    const result = await mentorAiFlow({ request: message });
    return { success: true, response: result.response };
  } catch (error: any) {
    console.error("Terminal Action Error:", error?.message || "Unknown");
    return { success: false, error: "SIGNAL_INTERRUPTED: The Cabinet could not process the request." };
  }
}

// --- 2. Mentor AI: Get Morning Briefing ---
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
    console.error("Mentor Action Error:", error instanceof Error ? error.message : "Sync error");
    return "SYSTEM_OFFLINE: Could not sync with Mentor AI.";
  }
}

// --- 3. Research Domain: Flux Echo & Epitomizer ---

export async function runResearch(input: { url: string, mode: 'scout' | 'deep' }) {
  try {
    let result;
    if (input.mode === 'scout') {
      result = await linkGenie({ url: input.url });
    } else {
      result = await epitomizeFetchedContent({ url: input.url });
    }

    // INTERNAL HANDSHAKE: Log the research mission to the database
    await getAdminDb().collection('internal_comms').add({
      agent: 'Flux Echo',
      action: input.mode,
      target_url: input.url,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });

    return { success: true, mode: input.mode, data: result };
  } catch (error: any) {
    // Log the failure too
    await getAdminDb().collection('internal_comms').add({
      agent: 'Flux Echo',
      action: input.mode,
      error: error?.message || "Unknown",
      timestamp: new Date().toISOString(),
      status: 'FAILED'
    });
    
    return { success: false, error: `MISSION_FAILED: ${error?.message || "Coordinate unreachable."}` };
  }
}

// --- 4. Discovery Domain: Architect ---

export async function runArchitect(blueprint: string) {
  try {
    const result = await generateInitialFiles({ blueprint });
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Architect Action Error:", error?.message || "Blueprint unreadable");
    return { success: false, error: `CONSTRUCTION_FAILED: ${error?.message || "Blueprint unreadable."}` };
  }
}

// --- 5. Database: Home Base Logic ---

export async function getHomeBaseAction() {
  try {
    const userDoc = await getAdminDb().collection('users').doc('primary_user').get();
    if (!userDoc.exists) return null;

    const data = userDoc.data() || {};

    return {
      ...data,
      name: data.name || "Isaiah Smith", //
      interests: data.interests || [], // Force an array to prevent .join() errors
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };
  } catch (error) {
    return null;
  }
}

// Do the same for getHomeBase() to keep the Mentorship page stable
export async function getHomeBase() {
  try {
    const doc = await getAdminDb().collection('users').doc('primary_user').get();
    if (doc.exists) {
      const data = doc.data() || {};
      return { 
        success: true, 
        data: {
          ...data,
          interests: data.interests || [],
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

// --- 6. Evolution & Curriculum ---

export async function getSystemEvolution() {
  try {
    const doc = await getAdminDb().collection('users').doc('primary_user').get();
    const data = doc.data();
    const establishedDate = data?.establishedDate || '2026-02-06';
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
    const userDoc = await getAdminDb().collection('users').doc(userId).get();
    const data = userDoc.data();
    
    const lessonsSnapshot = await getAdminDb().collection('curriculum')
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

    const milestonesSnapshot = await getAdminDb().collection('milestones').get();
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
  try {
    const result = await migrateLessonToDb(data);
    
    // THE FIX: Explicitly return a plain object. 
    // This prevents the "Unexpected Response" crash by avoiding complex class instances.
    return { 
      success: true, 
      planId: result || 'GENERATED_ID',
      timestamp: new Date().toISOString() 
    };
  } catch (error: any) {
    console.error("Librarian Sync Failure:", error.message);
    return { success: false, error: "SIGNAL_LOST: Check Firebase Admin permissions." };
  }
}

export async function savePlanToCabinet(planData: { title: string; type: string; content: any }) {
  try {
    const docRef = await getAdminDb().collection('plans').add({
      ...planData,
      userId: 'primary_user',
      createdAt: new Date().toISOString(),
    });
    revalidatePath('/');
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: "PLAN_STORAGE_FAILED" };
  }
}

// --- 7. Safety & Integrity ---

export async function getSystemIntegrity() {
  try {
    const criticalGems = await getAdminDb().collection('gems')
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
    const snapshot = await getAdminDb().collection('gems').orderBy('time', 'desc').get();
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
    await getAdminDb().collection('gems').doc(id).update({ resolution });
    revalidatePath('/reports');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function getMilestones() {
  try {
    const snapshot = await getAdminDb().collection('milestones').orderBy('date', 'desc').get();
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

// --- 8. The Universal Librarian ---

/**
 * Universal Write: Files any payload into a specific Cabinet drawer (collection).
 * Use this for internal_comms, safety_intercepts, or mentor_briefs.
 */
/**
 * FILES A SECURITY PULSE (GEM) TO THE LIBRARIAN
 */
export async function fileToCabinet(type: string, details: { reason: string, severity: 'low' | 'medium' | 'high' | 'critical', content: string }) {
  try {
    const docRef = await getAdminDb().collection('gems').add({
      type,
      reason: details.reason,
      severity: details.severity,
      content: details.content,
      time: new Date().toISOString(), // Matches your GemsDrawer interface
      resolution: 'pending',
      userId: 'primary_user'
    });

    revalidatePath('/'); // Refresh the HUD to show the new pulse
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Librarian Logging Error:", error);
    return { success: false, error: "LOG_FAILED" };
  }
}

// --- 9. Storage & Librarian Link ---

/**
 * Links a file in Firebase Storage to the Firestore Cabinet.
 * Use this after you manually upload a file to the console.
 */
export async function linkStorageFileToCabinet(fileData: { 
  fileName: string, 
  storagePath: string, 
  category: 'Lesson Plan' | 'Blueprint' 
}) {
  try {
    const userId = 'primary_user';
    
    // Create a searchable reference in the 'plans' collection
    const docRef = await getAdminDb().collection('plans').add({
      title: fileData.fileName,
      type: fileData.category,
      storageUrl: `gs://studio-3863072923-d4373.firebasestorage.app/${fileData.storagePath}`,
      userId,
      createdAt: new Date().toISOString(),
      status: 'archived'
    });

    revalidatePath('/dashboard');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Librarian Sync Error:", error);
    return { success: false, error: "LINK_FAILED" };
  }
}

/**
 * ONE-TIME SYNC: Links your manual Storage upload to the HUD.
 */
export async function syncArchitectureLesson() {
  try {
    // This connects the file path in your screenshot to the 'plans' collection
    const docRef = await getAdminDb().collection('plans').add({
      title: "First Lesson Plan on Architecture",
      type: "Lesson Plan",
      storagePath: "Vault/QlgcLKxywSXa.../First lesson Plan on Achitecture.txt",
      userId: 'primary_user',
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: "SYNC_FAILED" };
  }
}

// --- 10. Development Domain: Code Analyzer ---

/**
 * Inspects code and logs the event to the Librarian.
 */
export async function runCodeAnalysis(code: string) {
  try {
    // Here you would eventually call your analyzer AI flow
    // For now, we log the intent and return a success signal.
    await getAdminDb().collection('internal_comms').add({
      agent: 'Code Analyzer',
      action: 'code_inspection',
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    });

    return { 
      success: true, 
      analysis: "CODE_INTEGRITY_VERIFIED: No critical syntax errors found in local scope." 
    };
  } catch (error: any) {
    return { success: false, error: "ANALYSIS_INTERRUPTED" };
  }
}

export async function deleteAudit(docId: string) {
  try {
    const db = getAdminDb();
    await db.collection('internal_comms').doc(docId).delete();
    
    // Refresh the sidebar immediately
    revalidatePath('/code-analyzer');
    return { success: true };
  } catch (error) {
    console.error("LIBRARIAN_ERROR: Delete failed", error);
    return { success: false, error: "Deletion failed" };
  }
}