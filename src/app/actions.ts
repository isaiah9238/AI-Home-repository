
"use server";

import { fluxEcho } from "@/ai/discovery/flux-echo";
import { mentorAiFlow } from "@/ai/discovery/mentor-ai";
import type { DocumentData } from "firebase/firestore";
import * as admin from 'firebase-admin';

export async function seedHomeBaseAction() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Ensure the server knows to look at the local emulator
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }

  const db = admin.firestore();

  try {
    await db.collection('users').doc('primary_user').set({
      name: "Isaiah Smith",
      interests: ["Soccer", "Web Development", "AI Engineering", "UI/UX Design"],
      role: "Primary User",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Seeding failed from UI:", error);
    return { success: false, error: "Failed to seed database" };
  }
}

export async function getMorningBriefing(userProfile: DocumentData | null) {
  const { response } = await mentorAiFlow({ 
    request: "Give me a morning briefing.",
    userProfile: userProfile ?? undefined
  });
  return response;
}


export type EpitomizeState = {
    message: string;
    data?: {
        summary: string;
        suggestedActions: string[];
    } | null;
}

export async function EpitomizeUrl(prevState: EpitomizeState, formData: FormData): Promise<EpitomizeState> {
  const url = formData.get('url') as string;
  if (!url || !url.startsWith('http')) {
    return { message: 'Please enter a valid URL.' };
  }
  try {
    const result = await fluxEcho(url);
    return { message: 'Success', data: result };
  } catch (error: any) {
    console.error("FluxEcho Error:", error);
    return { message: `FluxEcho couldn't capture the signal. Reason: ${error.message}. Please ensure it's a valid, publicly accessible URL.` };
  }
}
