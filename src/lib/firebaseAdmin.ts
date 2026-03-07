import * as admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK.
 * This handles the transition between local development and production environments.
 * It is explicitly configured to prevent accidental emulator connections in the Studio environment.
 */
export const initAdmin = () => {
  // If an app already exists, return it to avoid initialization conflicts
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // AGGRESSIVE PURGE: Ensure the Admin SDK does NOT attempt to connect to emulators
  // unless we are explicitly in a local dev environment that requires them.
  // This prevents the ECONNREFUSED errors in cloud-based Studio sessions.
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.FIREBASE_STUDIO) {
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
  }

  // 1. Prioritize Service Account Key if available (Secret-based Auth)
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

  // 2. Fallback to Application Default Credentials
  return admin.initializeApp({
    projectId: projectId,
  });
};

// Export singleton instances
const adminApp = initAdmin();
export const adminDb = adminApp.firestore();
export const adminAuth = adminApp.auth();
