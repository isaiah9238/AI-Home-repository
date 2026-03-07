import * as admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK.
 * This handles the transition between local development and production environments.
 */
export const initAdmin = () => {
  // If an app already exists, return it to avoid initialization conflicts
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // 1. Clear any lingering emulator host variables that might cause ECONNREFUSED
  // in production or cloud-based studio environments.
  if (process.env.NODE_ENV === 'production' || !process.env.FIRESTORE_EMULATOR_HOST) {
    delete process.env.FIRESTORE_EMULATOR_HOST;
  }

  // 2. Prioritize Service Account Key if available (Local/Secret-based Dev)
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
    } catch (e) {
      console.error("🚨 Admin SDK: Failed to parse service account key", e);
    }
  }

  // 3. Fallback to Application Default Credentials (Standard Cloud Auth)
  return admin.initializeApp({
    projectId: projectId,
  });
};

// Export singleton instances for use across the Cabinet
const adminApp = initAdmin();
export const adminDb = adminApp.firestore();
export const adminAuth = adminApp.auth();
