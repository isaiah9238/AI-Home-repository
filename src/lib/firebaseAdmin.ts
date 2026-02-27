import * as admin from 'firebase-admin';

// Check if we are in development mode
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // These MUST be set before initializeApp is called
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = '127.0.0.1:7000';
}

export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  if (isDev) {
    console.log("🛠️ Admin SDK: Initializing for Local Emulators");
    // In dev, we don't need the cert() or private keys
    return admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dev-project',
    });
  }

  // Production path
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
};

export const adminDb = initAdmin().firestore();
export const adminAuth = initAdmin().auth();