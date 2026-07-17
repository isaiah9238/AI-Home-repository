import { ai } from '../genkit';
import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

interface VFSEmbeddingPayload {
  nodeId: string;
  path: string;
  content: string;
  userId: string;
  agentOrigin?: string;
}

export interface VectorMatchResult {
  nodeId: string;
  path: string;
  contentPreview: string;
  agentOrigin: string;
  distance: number; 
}

const VECTOR_COLLECTION = 'ai_vfs_vectors';

/**
 * 1. Generate High-Dimensional Vector Embeddings
 * Aligned to Genkit 1.x EmbedderParams ('embedder' and 'content')
 */
async function generateChunkEmbedding(text: string): Promise<number[]> {
  const response = await ai.embed({
    embedder: 'googleai/text-embedding-004', 
    content: text,
  });
  
  if (!response || !response[0] || !response[0].embedding) {
    throw new Error("🚨 VECTOR_SYNC_ERROR: Failed to retrieve embeddings from Gemini.");
  }
  
  return response[0].embedding;
}

/**
 * 2. Index or Update a VFS Node into Firestore Vector Search
 */
export async function indexVFSNode(payload: VFSEmbeddingPayload) {
  try {
    const db = getAdminDb();
    const vector = await generateChunkEmbedding(payload.content);
    
    const vectorValue = admin.firestore.FieldValue.vector(vector);
    
    await db.collection(VECTOR_COLLECTION).doc(payload.nodeId).set({
      nodeId: payload.nodeId,
      path: payload.path,
      userId: payload.userId,
      agentOrigin: payload.agentOrigin || 'unknown',
      contentPreview: payload.content.substring(0, 500),
      embedding: vectorValue, 
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`📡 LIBRARIAN_VECTOR_SYNC: Indexed node ${payload.nodeId} successfully.`);
  } catch (error) {
    console.error("🚨 LIBRARIAN_VECTOR_CRASH:", error);
    throw error;
  }
}

/**
 * 3. Query VFS Context (The Semantic Search Engine)
 * Fixed type definition: Safely accesses the vector distance metadata field via unknown casting.
 */
export async function queryVFSContext(
  userId: string,
  queryText: string,
  limitCount: number = 5
): Promise<VectorMatchResult[]> {
  try {
    const db = getAdminDb();
    
    const response = await ai.embed({
      embedder: 'googleai/text-embedding-004',
      content: queryText,
    });

    if (!response || !response[0] || !response[0].embedding) {
      throw new Error("🚨 VECTOR_QUERY_ERROR: Failed to generate search embedding.");
    }

    const searchVector = admin.firestore.FieldValue.vector(response[0].embedding);
    
    const querySnapshot = await db.collection(VECTOR_COLLECTION)
      .where('userId', '==', userId)
      .findNearest({
        vectorField: 'embedding',
        queryVector: searchVector,
        limit: limitCount,
        distanceMeasure: 'COSINE'
      })
      .get();

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Cast doc to an explicit any/unknown block to pull the distance metric injected by vector queries
      const docWithDistance = doc as any;
      
      return {
        nodeId: data.nodeId || doc.id,
        path: data.path || '',
        contentPreview: data.contentPreview || '',
        agentOrigin: data.agentOrigin || 'unknown',
        distance: typeof docWithDistance.distance === 'number' ? docWithDistance.distance : 0
      };
    });

  } catch (error) {
    console.error("🚨 LIBRARIAN_VECTOR_QUERY_CRASH:", error);
    return [];
  }
}