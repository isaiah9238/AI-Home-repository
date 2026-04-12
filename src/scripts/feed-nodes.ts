// Instructions: Run this script to establish the VFS hierarchy.
// Use: npx ts-node -P tsconfig.json src/scripts/feed-nodes.ts

import { getAdminDb } from '../lib/firebaseAdmin';
import * as admin from 'firebase-admin';

const COLLECTION_NAME = 'ai_vfs';

async function seedCabinetNodes() {
 const db = getAdminDb();
 const userId = "master-architect"; // Replace with your actual Firebase UID

 const rootNodes = [
   { name: 'Discovery', path: '/discovery', type: 'directory', parentId: null },
   { name: 'Research', path: '/research', type: 'directory', parentId: null },
   { name: 'Safety', path: '/safety', type: 'directory', parentId: null },
   { name: 'Vault', path: '/vault', type: 'directory', parentId: null, metadata: { isVault: true } }
 ];

 console.log("🏛️ LIBRARIAN: Initiating Cabinet node growth...");
 try {
   for (const node of rootNodes) {
    // Check for existing root to prevent duplicates
     const existing = await db.collection(COLLECTION_NAME)
       .where('path', '==', node.path)
       .where('userId', '==', userId)
       .get();

     if (existing.empty) {
       const docRef = db.collection(COLLECTION_NAME).doc();
       await docRef.set({
         ...node,
         id: docRef.id,
         userId,
         updatedAt: admin.firestore.FieldValue.serverTimestamp(),
         metadata: node.metadata || { isVault: false }
       });
       console.log(`✅ Node Anchored: ${node.name}`);
     } else {
       console.log(`📡 Node already exists: ${node.name}`);
     }
   }
   console.log("🏁 LIBRARIAN: Cabinet Map Synchronization Complete.");
 } catch (error) {
   console.error("🚨 LIBRARIAN: Synchronization Failed.", error);
 }
}

seedCabinetNodes();