import * as admin from 'firebase-admin';

/**
 * Librarian: Firebase Admin Initialization Node.
 * Optimized for Cloud Run / App Hosting environments.
 */
export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.SERVICE_ACCOUNT_KEY;

  try {
    // 1. Production Mode: Use Service Account Secret
    if (serviceAccountKey) {
      const serviceAccount = typeof serviceAccountKey === 'string' 
        ? JSON.parse(serviceAccountKey) 
        : serviceAccountKey;

      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
    }

    // 2. Cloud Mode: Use Application Default Credentials (e.g. App Hosting Service Account)
    if (process.env.NODE_ENV === 'production' || process.env.FIREBASE_CONFIG) {
      return admin.initializeApp({
        projectId: projectId
      });
    }

    // 3. Development Mode: Fallback for local workstation
    return admin.initializeApp({ projectId: projectId });
  } catch (e) {
    console.error("🚨 LIBRARIAN_AUTH_CRASH:", e);
    return null;
  }
};

export const getAdminDb = () => {
  const app = initAdmin();
  if (!app) throw new Error("Librarian could not initialize Admin SDK.");
  return admin.firestore();
};
