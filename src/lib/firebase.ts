
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from 'firebase/auth';
import { FirestorePermissionError } from '@/firebase/errors';

// Your web app's Firebase configuration}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ReCAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
};

// Initialize Firebase (Singleton pattern to prevent multiple instances)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const ai = getAI(app, { 
  backend: new GoogleAIBackend() 
});


 if (typeof window !== 'undefined') {
    initializeAppCheck (app, {
    provider: new ReCaptchaV3Provider (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

export const model = getGenerativeModel(ai, { 
  model: "gemini-2.5-flash" 
});


export async function getUserProfile() {
  const userRef = doc(db, 'users', 'primary_user');
  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    // Check if the error is a permission error and wrap it in our custom error.
    if (error instanceof Error && error.message.includes('permission')) {
       throw new FirestorePermissionError({
        path: userRef.path,
        operation: 'get',
      });
    }
    // Re-throw other types of errors
    throw error;
  }
}
