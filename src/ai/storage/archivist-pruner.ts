import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { getVFSNode, persistVFSNode, purgeVFSNode } from "@/ai/storage/virtual-file-system";

/**
 * Input Schema for The Archivist (Theta) Pruning Engine
 */
const PruneMemoryInputSchema = z.object({
  vfsNodeIds: z.array(z.string()).describe("List of candidate VFS node IDs to evaluate for memory abstraction."),
  compressionRatioThreshold: z.number().default(0.5).describe("Target size ratio reduction (0.1 to 0.9)."),
  deleteOriginalsAfterSummary: z.boolean().default(false).describe("If true, removes raw source nodes after synthesizing summary node."),
});

/**
 * Output Schema detailing memory abstraction results
 */
const PruneMemoryOutputSchema = z.object({
  abstractedRulesNodeId: z.string(),
  originalCount: z.number(),
  prunedNodeIds: z.array(z.string()),
  compressedContent: z.string(),
  tokensSavedEstimate: z.number(),
});

/**
 * The Archivist Flow (Theta Agent)
 * Synthesizes raw memory fragments into compact, long-term operational rules
 * and prunes redundant VFS text nodes.
 */
export const runArchivistPrunerFlow = ai.defineFlow(
  {
    name: "runArchivistPrunerFlow",
    inputSchema: PruneMemoryInputSchema,
    outputSchema: PruneMemoryOutputSchema,
  },
  async (input) => {
    const rawContents: string[] = [];
    const validNodeIds: string[] = [];

    // 1. Gather memory fragments from target nodes
    for (const nodeId of input.vfsNodeIds) {
      const node = await getVFSNode(nodeId);
      if (node && node.content) {
        rawContents.push(`--- MEMORY NODE [${node.path}] ---\n${node.content}`);
        validNodeIds.push(nodeId);
      }
    }

    if (rawContents.length === 0) {
      throw new Error("[The Archivist] No valid content found in specified target nodes.");
    }

    const combinedRawText = rawContents.join("\n\n");

    // 2. Synthesize long-term conceptual rules via Gemini
    const { output } = await ai.generate({
      model: "googleai/gemini-2.5-flash",
      prompt: `
You are 'The Archivist (Theta)', the Artificial Forgetting & Abstraction Engine of 'The Cabinet'.
Your responsibility is to compress verbose developer notes, agent logs, and temporary fragments into high-density, long-term architectural rules.

RAW MEMORY FRAGMENTS:
${combinedRawText}

INSTRUCTIONS:
1. Extract core architectural decisions, recurring bug patterns, and key system calibrations.
2. Eliminate redundant fluff, repetitive diagnostic logs, and short-lived session context.
3. Express findings as bulleted operational rules for future multi-agent context retrieval.

Return JSON in this format:
{
  "abstractedRules": "The condensed markdown string of core rules and learnings."
}
`,
      output: {
        schema: z.object({
          abstractedRules: z.string(),
        }),
      },
    });

    if (!output?.abstractedRules) {
      throw new Error("[The Archivist] Abstraction synthesis failed.");
    }

    // 3. Persist condensed summary node to VFS
    const summaryNodeId = `archivist_summary_${Date.now()}`;
    await persistVFSNode({
      id: summaryNodeId,
      name: `abstracted_rules_${Date.now()}.md`,
      path: `agent_memory/abstracted/${summaryNodeId}.md`,
      type: "file",
      content: output.abstractedRules,
      parentId: "agent_memory",
      metadata: {
        agentOrigin: "The Archivist (Theta)",
        compressedNodeCount: validNodeIds.length,
        abstractedAt: new Date().toISOString(),
      },
    });

    // 4. Optionally purge raw source nodes
    const prunedIds: string[] = [];
    if (input.deleteOriginalsAfterSummary) {
      for (const id of validNodeIds) {
        await purgeVFSNode(id);
        prunedIds.push(id);
      }
    }

    const estimatedTokensSaved = Math.max(
      0,
      Math.floor((combinedRawText.length - output.abstractedRules.length) / 4)
    );

    return {
      abstractedRulesNodeId: summaryNodeId,
      originalCount: validNodeIds.length,
      prunedNodeIds: prunedIds,
      compressedContent: output.abstractedRules,
      tokensSavedEstimate: estimatedTokensSaved,
    };
  }
);

/**
 * Server Action for HUD Maintenance Switchboard
 */
export async function executeArchivistPrune(vfsNodeIds: string[], deleteOriginals: boolean = false) {
  return await runArchivistPrunerFlow({
    vfsNodeIds,
    deleteOriginalsAfterSummary: deleteOriginals,
  });
}