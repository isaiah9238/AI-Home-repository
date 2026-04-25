import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

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
  };
}

const COLLECTION_NAME = 'ai_vfs';

/**
 * Helper to ensure Firestore data is serializable for Client Components.
 */
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

// 1. PERSIST (The Writer)
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc();
  
  const writeData = {
    ...node,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await docRef.set(writeData);
  
  // Return a clean, serializable version
  return sanitizeNode(docRef.id, {
    ...node,
    updatedAt: { toDate: () => new Date() } // Mock for immediate return
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
