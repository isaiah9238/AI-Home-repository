import * as admin from 'firebase-admin';

const isDev = process.env.NODE_ENV === 'development';

export const initAdmin = () => {
  // If an app already exists, return it
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  // 1. If we have a Service Account Key (usually in Dev with secrets)
  if (serviceAccountKey) {
    try {
      console.log("🛠️ Admin SDK: Initializing with Secret Key");
      const serviceAccount = JSON.parse(serviceAccountKey);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId,
      });
    } catch (e) {
      console.error("🚨 Admin SDK: Failed to parse service account key", e);
    }
  }

  // 2. Production or ADC path: Falls back to Application Default Credentials
  // We explicitly pass the projectId to ensure it doesn't try to connect to a default 'local' host
  return admin.initializeApp({
    projectId: projectId,
  });
};

// Initialize once and export instances
const adminApp = initAdmin();
export const adminDb = adminApp.firestore();
export const adminAuth = adminApp.auth();
