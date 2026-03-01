'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// 1. Web App Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIza....",
  authDomain: "studio-3863072923-d4373.firebaseapp.com",
  databaseURL: "https://studio-3863072923-d4373-default-rtdb.firebaseio.com", 
  projectId: "studio-3863072923-d4373",
  storageBucket: "studio-3863072923-d4373.firebasestorage.app",
  messagingSenderId: "1032380781554",
  appId: "1:1032380781554:web:45a51ed906b91dd13dd16b",
};

// 2. Initialize App (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 3. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Check if we are in development mode
const isDev = process.env.NODE_ENV === 'development';

// 4. Initialize App Check
if (typeof window !== "undefined") {
  if (isDev) {
    // Explicitly set the debug token to true before initializing App Check.
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log("🛠️ App Check: Debug Mode Enabled. Check console for your Debug Token.");
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Lew....'),
    isTokenAutoRefreshEnabled: true
  });
}

// 5. Initialize Vertex AI for Firebase
const ai = getAI(app, { backend: new GoogleAIBackend() });

// 6. Export Services
export { app, auth, db, rtdb, storage, functions };

// 7. Export Models
export const model = getGenerativeModel(ai, { 
  model: "gemini-2.5-flash" 
});

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});
