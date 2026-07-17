'use server'; // 🛡️ THE BULLETPROOF FIREWALL

import { multiAgentDispatcher } from '@/ai/discovery/multi-agent-dispatcher';

interface DispatchPayload {
  request: string;
  agenticContext?: string;
  userProfile?: any;
}

/**
 * handleAutonomousDispatch
 * Isolated gateway server action that executes your multi-agent routing
 * entirely on the secure server layer, safely keeping Genkit out of the client bundle.
 */
export async function handleAutonomousDispatch(payload: { request: string; agenticContext?: string; userProfile?: any }) {
  try {
    const response = await multiAgentDispatcher(payload);
    return { success: true, data: response };
  } catch (error: any) {
    console.error("GATEWAY_ERROR: Dispatch tracking failed.", error.message);
    return { success: false, error: error.message || "SIGNAL_INTERRUPTED" };
  }
}