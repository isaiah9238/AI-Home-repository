import * as admin from 'firebase-admin';

/**
 * @fileOverview The Librarian's Administrative Core.
 * Handles server-side Firebase Admin initialization and environment stabilization.
 */

export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.SERVICE_ACCOUNT_KEY;

  // #3 THE PURGE: Neutralize emulator signals in remote nodes
  const isRemote = process.env.NODE_ENV === 'production' || !!process.env.FIREBASE_STUDIO; 
                   
  if (isRemote) {
    const emulatorVars = [ 'FIRESTORE_EMULATOR_HOST', 'FIREBASE_AUTH_EMULATOR_HOST' ];
    
    emulatorVars.forEach( key => delete process.env[key] );
    
    if (process.env.FIREBASE_STUDIO) {
      console.log("LIBRARIAN: Cloud synchronization established. Emulator signals neutralized.");
    }
  }

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
    } catch (e) {
      console.error("🚨 Librarian_Auth_Error", e);
    }
  }

  return admin.initializeApp({ projectId: projectId });
};

export const getAdminDb = () => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.firestore();
};

/**
 * NEW: Added verifySessionCookie to fix TS2305 error
 */
export const verifySessionCookie = async (sessionCookie: string) => {
  const app = admin.apps.length > 0 ? admin.app() : initAdmin();
  return app.auth().verifySessionCookie(sessionCookie, true);
};