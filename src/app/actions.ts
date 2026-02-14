
"use server";

import { fluxEcho } from "@/ai/discovery/link-genie";
import { mentorAiFlow } from "@/ai/discovery/mentor-ai";
import type { DocumentData } from "firebase/firestore";

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
  } catch (error) {
    console.error("FluxEcho Error:", error);
    return { message: "FluxEcho couldn't capture the signal. Please ensure it's a valid public URL!" };
  }
}
