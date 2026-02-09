
"use server";

import { mentorAiFlow } from "@/ai/discovery/mentor-ai";
import type { DocumentData } from "firebase/firestore";

export async function getMorningBriefing(userProfile: DocumentData | null) {
  const { response } = await mentorAiFlow({ 
    request: "Give me a morning briefing.",
    userProfile: userProfile ?? undefined
  });
  return response;
}
