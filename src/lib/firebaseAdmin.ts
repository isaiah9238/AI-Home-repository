import * as admin from 'firebase-admin';

// Check if we are in development mode
const isDev = process.env.NODE_ENV === 'development';

export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  if (isDev) {
    console.log("🛠️ Admin SDK: Initializing for Local Project");
    return admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373',
    });
  }

  // Production path: Firebase App Hosting handles credentials automatically
  return admin.initializeApp();
};

export const adminDb = initAdmin().firestore();
export const adminAuth = initAdmin().auth();
