'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "studio-3863072923-d4373.firebaseapp.com",
  databaseURL: "https://studio-3863072923-d4373-default-rtdb.firebaseio.com", 
  projectId: "studio-3863072923-d4373",
  storageBucket: "studio-3863072923-d4373.firebasestorage.app",
  messagingSenderId: "1032380781554",
  appId: "1:1032380781554:web:45a51ed906b91dd13dd16b",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const functions = getFunctions(app);

const isDev = process.env.NODE_ENV === 'development';

if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
      console.error("Persistence failure:", error.message);
    });

  // Only initialize App Check if a valid key is provided
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (siteKey && siteKey !== "RECAPTCHA_SITE_KEY") {
    if (isDev) {
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true
    });
  } else {
    console.warn("Librarian Note: App Check site key missing. Protection disabled for this session.");
  }
}

const ai = getAI(app, { backend: new GoogleAIBackend() });

export { ai, app, auth, db, rtdb, storage, functions, firebaseConfig };

export const model = getGenerativeModel(ai, { 
  model: "gemini-1.5-flash" 
});

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-1.5-flash",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});
