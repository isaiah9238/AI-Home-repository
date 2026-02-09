'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
// The new standard for 2026
import { getAI, getGenerativeModel } from "firebase/ai";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 1. Initialize App Check with Debug Bypass
if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

// 2. Initialize AI Logic (the new 'ai' instead of 'vertexAI')
const ai = getAI(app);

// 1. CHAT (The one your current AIChat component expects)
export const chatModel = getGenerativeModel(ai, { model: "gemini-1.5-flash" });

// 2. MATH (High intelligence for ArithmaGen)
export const mathModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

// 3. CODE (Specific for your coding/debugging tasks)
export const codeModel = getGenerativeModel(ai, { model: "gemini-2.5-pro" });

// 4. ALIAS: This keeps your current code working!
// It just points 'model' to the 'chatModel'.
export const model = chatModel;