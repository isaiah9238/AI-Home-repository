'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAI, getGenerativeModel } from "firebase/ai"; // The new Feb 2026 standard
/*import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';*/

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

// 2. Export Services (No execution logic here!)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const ai = getAI(app);

// Update your models to the new Gemini 3 standards
export const lessonModel = getGenerativeModel(ai, { 
  model: "gemini-3-flash",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});

// 4. App Check (Client-side safety)
/*if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}*/