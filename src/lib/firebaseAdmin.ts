import * as admin from 'firebase-admin';

const isDev = process.env.NODE_ENV === 'development';

export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  // Use Secret Manager / Env Var approach
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (isDev && serviceAccountKey) {
    console.log("🛠️ Admin SDK: Initializing with Secret Key");
    const serviceAccount = JSON.parse(serviceAccountKey);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  // Production path: Usually handles credentials automatically in cloud environments
  return admin.initializeApp();
};

export const adminDb = initAdmin().firestore();
export const adminAuth = initAdmin().auth();