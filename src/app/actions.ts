'use server';

import { linkGenie } from '@/ai/domains/research/link-genie';

export async function runFluxEcho(url: string) {
  try {
    const result = await linkGenie({ url });
    return { success: true, data: result };
  } catch (error) {
    console.error("Flux Echo Error:", error);
    return { success: false, error: "Failed to analyze link." };
  }
}