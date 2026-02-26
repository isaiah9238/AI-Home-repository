import * as admin from 'firebase-admin';

const adminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Use NEXT_PUBLIC for consistency
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  if (process.env.NODE_ENV === 'development') {
    // This tells the Admin SDK to talk to your local emulators
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    console.log("🛠️ Admin SDK: Routing to Local Emulators");
  }

  return admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
  });
};

export const adminDb = initAdmin().firestore();