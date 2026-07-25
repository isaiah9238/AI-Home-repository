import 'server-only';

import { ai } from "@/ai/genkit";
import { z } from "genkit";

/**
 * Interface representing a VFS node snippet returned by RAG
 */
export interface VFSRagMatch {
  id: string;
  path: string;
  type: string;
  contentPreview: string;
  similarityScore: number;
}

/**
 * Calculates cosine similarity between two numeric embedding vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Queries VFS nodes semantically using text embeddings
 */
export async function queryVFSContext(
  query: string,
  topK: number = 3
): Promise<VFSRagMatch[]> {
  try {
    // 1. Generate embedding for the search query
    const queryEmbedResult = await ai.embed({
      embedder: "googleai/text-embedding-004",
      content: query,
    });

    const queryVector = queryEmbedResult[0]?.embedding;
    if (!queryVector) {
      console.warn("[VFS RAG Hook] Failed to generate query embedding.");
      return [];
    }

    // 2. Fetch target VFS nodes (In production, replace with vector-indexed Firestore query)
    // For now, we fetch candidate VFS nodes to perform semantic matching
    const sampleNodes = [
      {
        id: "node_1",
        path: "src/ai/storage/virtual-file-system.ts",
        type: "file",
        content: "export async function persistVFSNode() { ... } export async function getVFSNode() { ... }",
      },
      {
        id: "node_2",
        path: "src/ai/domains/safety/warden-guard.ts",
        type: "file",
        content: "export const evaluateExecutionGuardFlow = ai.defineFlow(...) // Rate limiting and compute governance",
      },
    ];

    const matches: VFSRagMatch[] = [];

    // 3. Compute vector similarity for each candidate node
    for (const node of sampleNodes) {
      if (!node.content) continue;

      const nodeEmbedResult = await ai.embed({
        embedder: "googleai/text-embedding-004",
        content: node.content.slice(0, 2000), // Embed code chunk
      });

      const nodeVector = nodeEmbedResult[0]?.embedding;
      if (nodeVector) {
        const similarity = cosineSimilarity(queryVector, nodeVector);
        matches.push({
          id: node.id,
          path: node.path,
          type: node.type,
          contentPreview: node.content.slice(0, 300), // High-density preview snippet
          similarityScore: similarity,
        });
      }
    }

    // 4. Sort by highest similarity score and take top K
    return matches
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK);

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`[VFS RAG Hook Error] ${errorMsg}`);
    return [];
  }
}