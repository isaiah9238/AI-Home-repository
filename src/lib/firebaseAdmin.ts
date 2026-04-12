// Instructions: Update firebaseAdmin.ts to include explicit error reporting.
// This prevents the 'Failed to Fetch' by identifying the root cause in the logs.

import * as admin from 'firebase-admin';

export const initAdmin = () => {
 if (admin.apps.length > 0) return admin.app();

 const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
 const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.SERVICE_ACCOUNT_KEY;

 if (!serviceAccountKey && process.env.NODE_ENV === 'production') {
   console.error("🚨 LIBRARIAN: Service Account Key is missing from Environment.");
   return null; 
 }

 try {
   if (serviceAccountKey) {
     // Handle both stringified JSON and raw strings
     const serviceAccount = typeof serviceAccountKey === 'string' 
       ? JSON.parse(serviceAccountKey) 
       : serviceAccountKey;

     return admin.initializeApp({
       credential: admin.credential.cert(serviceAccount),
       projectId: projectId,
     });
   }
 } catch (e) {
   console.error("🚨 LIBRARIAN_AUTH_CRASH:", e);
 }

 // Fallback for local development using application default credentials
 return admin.initializeApp({ projectId: projectId });
};

export const getAdminDb = () => {
 const app = initAdmin();
 if (!app) throw new Error("Librarian could not initialize Admin SDK.");
 return admin.firestore();
};