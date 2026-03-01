"use server";

import { fluxEcho } from "@/ai/discovery/flux-echo";
import { mentorAiFlow } from "@/ai/discovery/mentor-ai";
import { getHomeBase} from "@/ai/discovery/establish-home-base";
import type { DocumentData } from "firebase/firestore";
import * as admin from 'firebase-admin';
import { googleAI } from '@genkit-ai/google-genai';

export async function seedHomeBaseAction() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!admin.apps.length) {
    admin.initializeApp({ projectId });
  }

  const db = admin.firestore();

  try {
    await db.collection('users').doc('primary_user').set({
      name: "Isaiah Smith",
      interests: ["Next.js Engineering", "SpaceX Launches", "Advanced AI"],
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

export async function getAIBriefingAction() {
  const profileResponse = await getHomeBase();
  if (!profileResponse.success || !profileResponse.data) {
    return "No profile found. Please initialize your Home Base.";
  }
  
  const profile = profileResponse.data;

  // This runs on the server
  const model = googleAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const prompt = `System: You are an AI Mentor. 
                  User: ${profile.name}. 
                  Interests: ${profile.interests?.join(', ') || 'AI'}. 
                  Give a 1-sentence greeting based on these interests.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
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
