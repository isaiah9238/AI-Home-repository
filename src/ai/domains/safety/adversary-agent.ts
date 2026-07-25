import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { getVFSNode, persistVFSNode } from "@/ai/storage/virtual-file-system";

const NeutralizeChaosInputSchema = z.object({
  vfsNodeId: z.string().describe("The ID of the target VFS node to disarm."),
  restoreCode: z.string().optional().describe("Optional clean code payload to restore."),
});

/**
 * Neutralizes active chaos state on a targeted VFS node.
 */
export const neutralizeChaosFlow = ai.defineFlow(
  {
    name: "neutralizeChaosFlow",
    inputSchema: NeutralizeChaosInputSchema,
    outputSchema: z.object({
      vfsNodeId: z.string(),
      neutralized: z.boolean(),
      message: z.string(),
    }),
  },
  async (input) => {
    const targetNode = await getVFSNode(input.vfsNodeId);
    if (!targetNode) {
      throw new Error(`[Adversary Neutralizer] Node '${input.vfsNodeId}' not found.`);
    }

    // Sanitize metadata to strip adversary flags
    const updatedMetadata = { ...targetNode.metadata };
    delete updatedMetadata.adversary_active;
    delete updatedMetadata.last_chaos_vector;

    await persistVFSNode({
      id: targetNode.id,
      name: targetNode.name,
      path: targetNode.path,
      type: targetNode.type,
      content: input.restoreCode || targetNode.content, // Restore clean content if supplied
      parentId: targetNode.parentId,
      metadata: {
        ...updatedMetadata,
        agentOrigin: "The Warden (Zeta) // Disarmed",
      },
    });

    return {
      vfsNodeId: input.vfsNodeId,
      neutralized: true,
      message: `Chaos state deactivated for node ${input.vfsNodeId}. System restored.`,
    };
  }
);

/**
 * Server Action for HUD Switchboard
 */
export async function disarmAdversaryNode(vfsNodeId: string, restoreCode?: string) {
  return await neutralizeChaosFlow({ vfsNodeId, restoreCode });
}