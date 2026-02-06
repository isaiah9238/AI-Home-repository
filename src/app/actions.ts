
"use server";

import { mentorAiFlow } from "@/ai/flows/mentor-ai";
import { getUserProfile } from "@/lib/firebase";

export async function getMorningBriefing() {
  const { response } = await mentorAiFlow({ request: "Give me a morning briefing." });
  return response;
}

export async function getUserInterests() {
  const profile = await getUserProfile();
  return profile?.interests || [];
}
