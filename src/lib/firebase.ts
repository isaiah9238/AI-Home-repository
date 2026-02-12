'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 1. Initialize App (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Export Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ai = getAI(app);

// 3. Export Models (Using the latest 2026 stable IDs)
// Use 'gemini-3-flash-preview' for the best speed/cost balance
export const model = getGenerativeModel(ai, { model: "gemini-3-flash-preview" });

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-3-flash-preview",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});

// 4. App Check (Client-side safety)
if (typeof window !== 'undefined') {
  // If you aren't using App Check yet, you can keep this commented out
  // to prevent 'missing-token' errors during your initial tests.
  /*
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
  */
}