import { ai } from "@/ai/genkit";
import { z } from "genkit";

/**
 * Execution metrics tracker for active closed-loop sessions
 */
interface ExecutionTrack {
  count: number;
  totalTokensEstimate: number;
  lastExecutionTime: number;
}

// In-memory sliding execution ledger (Key: agentId or nodePath)
const executionLedger: Map<string, ExecutionTrack> = new Map();

// Configuration Guardrails
const WARDEN_LIMITS = {
  MAX_RECURSION_DEPTH: 3,        // Max self-refactor loops allowed per target node per window
  SLIDING_WINDOW_MS: 60 * 1000,  // 1-minute tracking window
  MAX_ESTIMATED_TOKENS: 50000,   // Token ceiling within the window
};

/**
 * Input Schema for The Warden (Zeta) Check
 */
const EvaluateExecutionInputSchema = z.object({
  agentId: z.string().describe("Identifier of the agent initiating execution (e.g. 'agent_architect')."),
  targetPath: z.string().describe("Path or ID of the VFS node being operated on."),
  estimatedTokens: z.number().default(1000).describe("Estimated token weight for the payload."),
  resetWindow: z.boolean().default(false).describe("Explicit override flag to reset execution counters."),
});

/**
 * Output Schema detailing quota clearance
 */
const EvaluateExecutionOutputSchema = z.object({
  allowed: z.boolean(),
  reason: z.string(),
  currentRecursionDepth: z.number(),
  estimatedTokensUsed: z.number(),
  timeToResetMs: z.number(),
});

/**
 * The Warden Flow (Zeta Agent)
 * Evaluates compute quotas and execution loop depth to prevent runaway AI recursion.
 */
export const evaluateExecutionGuardFlow = ai.defineFlow(
  {
    name: "evaluateExecutionGuardFlow",
    inputSchema: EvaluateExecutionInputSchema,
    outputSchema: EvaluateExecutionOutputSchema,
  },
  async (input) => {
    const key = `${input.agentId}:${input.targetPath}`;
    const now = Date.now();

    let track = executionLedger.get(key) || {
      count: 0,
      totalTokensEstimate: 0,
      lastExecutionTime: now,
    };

    // Reset counters if sliding window has elapsed or explicit override flag is sent
    if (input.resetWindow || now - track.lastExecutionTime > WARDEN_LIMITS.SLIDING_WINDOW_MS) {
      track = { count: 0, totalTokensEstimate: 0, lastExecutionTime: now };
    }

    const timeToResetMs = Math.max(0, WARDEN_LIMITS.SLIDING_WINDOW_MS - (now - track.lastExecutionTime));

    // 1. Check Recursion Loop Depth Limit
    if (track.count >= WARDEN_LIMITS.MAX_RECURSION_DEPTH) {
      return {
        allowed: false,
        reason: `[The Warden (Zeta)] Execution blocked: Exceeded maximum recursion depth (${WARDEN_LIMITS.MAX_RECURSION_DEPTH} loops/min).`,
        currentRecursionDepth: track.count,
        estimatedTokensUsed: track.totalTokensEstimate,
        timeToResetMs,
      };
    }

    // 2. Check Token Ceiling Limit
    if (track.totalTokensEstimate + input.estimatedTokens > WARDEN_LIMITS.MAX_ESTIMATED_TOKENS) {
      return {
        allowed: false,
        reason: `[The Warden (Zeta)] Execution blocked: Token ceiling exceeded (${WARDEN_LIMITS.MAX_ESTIMATED_TOKENS} tokens/min limit).`,
        currentRecursionDepth: track.count,
        estimatedTokensUsed: track.totalTokensEstimate,
        timeToResetMs,
      };
    }

    // Update track state upon passing checks
    track.count += 1;
    track.totalTokensEstimate += input.estimatedTokens;
    track.lastExecutionTime = now;
    executionLedger.set(key, track);

    return {
      allowed: true,
      reason: "[The Warden (Zeta)] Execution cleared. Compute limits within safe boundaries.",
      currentRecursionDepth: track.count,
      estimatedTokensUsed: track.totalTokensEstimate,
      timeToResetMs,
    };
  }
);

/**
 * Public Helper / Server Action for Orchestrator Middleware
 */
export async function checkWardenGuard(
  agentId: string, 
  targetPath: string, 
  estimatedTokens: number = 2000
) {
  return await evaluateExecutionGuardFlow({
    agentId,
    targetPath,
    estimatedTokens,
  });
}