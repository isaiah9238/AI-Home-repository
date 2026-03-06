'use server';

import { mentorAiFlow } from '@/ai/discovery/mentor-ai';
import { linkGenie } from '@/ai/domains/research/link-genie';
import { fluxEcho } from '@/ai/discovery/flux-echo';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * @fileOverview The "Cabinet" of Server Actions.
 * These functions bridge the UI to the AI flows and Database.
 */

// --- 1. Mentor AI: Get Morning Briefing ---
export async function getMorningBriefing(userContext?: any) {
  try {
    const result = await mentorAiFlow({ 
      request: "Give me my morning briefing.",
      userProfile: userContext 
    });
    return result.response;
  } catch (error) {
    console.error("Mentor Action Error:", error);
    return "SYSTEM_OFFLINE: Could not sync with Mentor AI.";
  }
}

// --- 2. Flux Echo: Run Link Reconnaissance ---
export async function runFluxEcho(url: string) {
  try {
    const result = await linkGenie({ url });
    return { success: true, data: result };
  } catch (error) {
    console.error("Flux Echo Action Error:", error);
    return { success: false, error: "RECON_FAILED: Targeted URL unreachable." };
  }
}

// --- 3. Flux Echo: Epitomize URL (Legacy support for older pages) ---
export type EpitomizeState = {
    message: string;
    data: any | null;
};

export async function EpitomizeUrl(prevState: EpitomizeState, formData: FormData): Promise<EpitomizeState> {
    const url = formData.get('url') as string;
    try {
        const result = await fluxEcho(url);
        return { message: "Success", data: result };
    } catch (error: any) {
        return { message: error.message || "Failed to epitomize.", data: null };
    }
}

// --- 4. Database: Seed Home Base ---
export async function seedHomeBaseAction() {
  try {
    const userData = {
      name: "Isaiah Smith",
      interests: ["Next.js", "AI Engineering", "UI/UX Design", "Land Surveying"],
      role: "Primary User",
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await adminDb.collection('users').doc('primary_user').set(userData);
    return { success: true };
  } catch (error) {
    console.error("Seeding Action Error:", error);
    return { success: false, error: "SEED_FAILED: Librarian cannot write to disk." };
  }
}

// --- 5. Database: Fetch User Profile ---
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

// --- 6. Evolution: Calculate System Age ---
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

// --- 7. Curriculum: Fetch Learning Progress ---
export async function getCurriculumProgress() {
  try {
    const doc = await adminDb.collection('users').doc('primary_user').get();
    const data = doc.data();
    
    // In the future, this will be calculated by the number of processed lesson plans
    return {
      success: true,
      integratedPlans: data?.lessonPlansCount || 0,
      neuralComplexity: data?.neuralComplexity || 64, // placeholder from your UI
      lastTopic: data?.lastLesson || "Next.js Fundamentals"
    };
  } catch (error) {
    return { success: false, integratedPlans: 0 };
  }
}

// --- 8. Safety: Check System Integrity ---
export async function getSystemIntegrity() {
  try {
    // Check for any 'pending' gems with 'high' or 'critical' severity
    const criticalGems = await adminDb.collection('gems')
      .where('status', '==', 'pending')
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