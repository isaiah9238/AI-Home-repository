import * as admin from 'firebase-admin';

export const initAdmin = () => {
  // 1. Safety Check: If an app already exists, return it to avoid initialization conflicts
  if (admin.apps.length > 0) return admin.app();

  // 2. Variables (Restored): These are essential for the "Librarian" to find your data
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // 3. The Purge (Updated): Catch all scenarios that aren't local dev
  if (process.env.NODE_ENV === 'production' || 
      process.env.VERCEL || 
      process.env.FIREBASE_STUDIO || 
      process.env.NEXT_PUBLIC_VERCEL_ENV) {
    
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
    delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
    
    console.log("Librarian: Purging emulator hosts to force cloud connection.");
  }

  // 4. Authenticate: Prioritize Service Account Key if available
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

  // 5. Fallback: Use Application Default Credentials
  return admin.initializeApp({
    projectId: projectId,
  });
};

// Getters for your Server Actions
export const getAdminDb = () => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.firestore();
};

export const getAdminAuth = () => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.auth();
};