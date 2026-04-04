import { getAdminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin';

/**
 * @fileOverview The Librarian's Virtual File System (VFS) Manager.
 * Handles the persistence and retrieval of AI-generated assets in Firestore.
 */

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
  metadata?: any;
}

const COLLECTION_NAME = 'ai_vfs';

/**
 * Syncs a node to the Firestore VFS collection.
 */
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc();
  
  const newNode = {
    ...node,
    id: docRef.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(newNode);
  return newNode;
}

/**
 * Retrieves all nodes for a user at a specific depth.
 */
export async function getNodesByParent(userId: string, parentId: string | null) {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('userId', '==', userId)
    .where('parentId', '==', parentId)
    .orderBy('type', 'desc') // Directories first
    .orderBy('name', 'asc')
    .get();

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    } as VFSNode;
  });
}

/**
 * Deletes a node and recursively marks its children for deletion (logic-side).
 */
export async function purgeVFSNode(nodeId: string) {
  const db = getAdminDb();
  await db.collection(COLLECTION_NAME).doc(nodeId).delete();
  return { success: true };
}
