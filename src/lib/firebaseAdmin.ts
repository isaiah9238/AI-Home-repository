import * as admin from 'firebase-admin';

/**
 * @fileOverview The Librarian's Administrative Core.
 * Handles server-side Firebase Admin initialization and environment stabilization.
 */

export const initAdmin = () => {
  // 1. Redundancy Guard: If an app already exists, return it to avoid initialization conflicts.
  if (admin.apps.length > 0) return admin.app();

  // 2. Coordinate Extraction: Pull essential project identifiers.
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.SERVICE_ACCOUNT_KEY;

  // 3. The Purge: Force cloud connectivity by neutralizing emulator signals in non-local nodes.
  const isRemote = process.env.NODE_ENV === 'production' || 
                   !!process.env.VERCEL || 
                   !!process.env.FIREBASE_STUDIO ||
                   !!process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (isRemote) {
    const emulatorKeys = [
      'FIRESTORE_EMULATOR_HOST',
      'FIREBASE_AUTH_EMULATOR_HOST',
      'FIREBASE_STORAGE_EMULATOR_HOST',
      'FIREBASE_DATABASE_EMULATOR_HOST',
      'FIREBASE_FUNCTIONS_EMULATOR_HOST'
    ];
    
    emulatorKeys.forEach(key => {
      if (process.env[key]) delete process.env[key];
    });
    
    // Aesthetic status feedback for the Studio environment
    if (process.env.FIREBASE_STUDIO) {
      console.log("Librarian: Emulator signals purged. Cloud synchronization established.");
    }
  }

  // 4. Authenticate: High-Fidelity Service Account Protocol.
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
    } catch (e) {
      console.error("🚨 Librarian_Auth_Error: Failed to parse structural credentials.", e);
    }
  }

  // 5. Fallback: Application Default Credentials (ADC).
  return admin.initializeApp({
    projectId: projectId,
  });
};

/**
 * getAdminDb - Returns the Firestore instance for server-side operations.
 */
export const getAdminDb = () => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.firestore();
};

/**
 * getAdminAuth - Returns the Auth instance for server-side operations.
 */
export const getAdminAuth = () => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.auth();
};
