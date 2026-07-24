import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';
import { indexVFSNode } from './vector-sync'; // 👈 Import the newly updated sync tool

export interface VFSNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  parentId: string | null;
  userId: string;
  updatedAt: string;
  createdAt?: string;
  mimeType?: string;
  metadata?: {
    isVault?: boolean;
    owner_agent?: string;
    agentOrigin?: string;
    source_blueprint?: string;
    neuralWeight?: number;
    intent_vector?: string;
    disappearanceMarker?: boolean;
    type?: string;
    analysis?: any;
    [key: string]: any;
  };
}

const COLLECTION_NAME = 'ai_vfs';

function sanitizeNode(docId: string, data: any): VFSNode {
  return {
    id: docId,
    name: data.name || 'Unnamed_Node',
    path: data.path || '/',
    type: data.type || 'file',
    content: data.content || '',
    parentId: data.parentId || null,
    userId: data.userId || 'unknown',
    mimeType: data.mimeType || 'text/plain',
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
    metadata: data.metadata || {}
  };
}

// 1. PERSIST (The Writer - Now Connected to Vector Memory)
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc();
  
  const writeData = {
    ...node,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await docRef.set(writeData);
  
  // 🚀 BACKGROUND SYNC DETECTED: If it's a file with readable text content, index it!
  // Don't index secure Vault entries to respect the Sovereign Vault's privacy domain boundaries.
  if (node.type === 'file' && node.content && !node.metadata?.isVault) {
    // We execute this asynchronously so the VFS doesn't lag while generating embeddings
    indexVFSNode({
      nodeId: docRef.id,
      path: node.path,
      content: node.content,
      userId: node.userId,
      agentOrigin: node.metadata?.agentOrigin || node.metadata?.owner_agent
    }).catch(err => {
      console.error(`🚨 VFS_VECTOR_SYNC_FAILED for node ${docRef.id}:`, err);
    });
  }
  
  return sanitizeNode(docRef.id, {
    ...node,
    updatedAt: { toDate: () => new Date() }
  });
}

// 2. PURGE (The Eraser)
export async function purgeVFSNode(nodeId: string) {
  const db = getAdminDb();
  const batch = db.batch();
  
  const findChildren = async (pid: string) => {
    const snapshot = await db.collection(COLLECTION_NAME).where('parentId', '==', pid).get();
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      await findChildren(doc.id);
    }
  };
  
  await findChildren(nodeId);
  batch.delete(db.collection(COLLECTION_NAME).doc(nodeId));
  await batch.commit();
  return { success: true };
}

// 3. GET (The Reader)
export async function getNodesByParent(userId: string, parentId: string | null = null) {
  const db = getAdminDb();
  
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('userId', '==', userId)
    .where('parentId', '==', parentId)
    .get();

  if (snapshot.empty) return [];

  return snapshot.docs.map(doc => sanitizeNode(doc.id, doc.data()));
}

// 4. GET SINGLE NODE (By Document ID)
export async function getVFSNode(nodeId: string): Promise<VFSNode | null> {
  try {
    const db = getAdminDb();
    const docRef = db.collection(COLLECTION_NAME).doc(nodeId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return sanitizeNode(doc.id, doc.data());
  } catch (error) {
    console.error(`🚨 VFS_READ_ERROR for node ${nodeId}:`, error);
    return null;
  }
}