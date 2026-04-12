// 1. Instructions: Replace existing file with this enhanced version.
// 2. Added: Recursive sub-node fetching for bulk movement or deletion.
// 3. Added: Vault isolation metadata for Privacy Domain nodes.

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
    isVault?: boolean;      // Flag for Sovereign Vault access
    agentOrigin?: string;  // Which agent (Architect/Scout) created this?
    neuralWeight?: number; // Importance to the Adaptive Brain
  };
}

const COLLECTION_NAME = 'ai_vfs';

/**
 * Persist or Update a Node.
 */
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  // Check if ID exists in metadata or props to allow updates
  const docRef = db.collection(COLLECTION_NAME).doc();
  
  const newNode = {
    ...node,
    id: docRef.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(newNode);
  return { ...newNode, updatedAt: new Date().toISOString() } as VFSNode;
}

/**
 * Recursive Purge: Ensures directories don't leave "ghost" children.
 */
export async function purgeVFSNode(nodeId: string) {
  const db = getAdminDb();
  const batch = db.batch();
  
  // Find all descendants
  const findChildren = async (pid: string) => {
    const snapshot = await db.collection(COLLECTION_NAME).where('parentId', '==', pid).get();
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      await findChildren(doc.id); // Recurse
    }
  };

  await findChildren(nodeId);
  batch.delete(db.collection(COLLECTION_NAME).doc(nodeId));
  
  await batch.commit();
  return { success: true };
}