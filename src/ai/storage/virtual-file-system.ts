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
  mimeType?: string;
  metadata?: {
    isVault?: boolean;
    agentOrigin?: string;
    neuralWeight?: number;
    disappearanceMarker?: boolean; // Required for 'Silver Memory'
  };
}

const COLLECTION_NAME = 'ai_vfs';

// --- THE TRINITY OF EXPORTS ---

// 1. PERSIST (The Writer)
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc();
  const newNode = {
    ...node,
    id: docRef.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  await docRef.set(newNode);
  return { ...newNode, updatedAt: new Date().toISOString() } as VFSNode;
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

  return snapshot.docs.map(doc => {
    const data = doc.data();
    
    // THE SANITIZER: Convert everything to plain text/numbers
    return {
      ...data,
      id: doc.id,
      // Convert 'createdAt' timestamp to string
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      // Convert 'updatedAt' timestamp to string
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      // Force parentId to be a string or null (no hidden prototypes)
      parentId: data.parentId || null
    };
  });
}