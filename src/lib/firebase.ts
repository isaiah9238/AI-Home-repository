'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// 1. Web App Configuration
// Note: These MUST start with NEXT_PUBLIC_ to work in the browser.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize App (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 3. Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Initialize Vertex AI for Firebase
// (Make sure you have enabled the Vertex AI API in Google Cloud Console)
const ai = getAI(app);

// 4. Connect to Emulators (ONLY in Development)
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  if (typeof window !== 'undefined') {
    // Connect Auth (Standard Port 9099)
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    
    // Connect Other Services
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectDatabaseEmulator(rtdb, '127.0.0.1', 9000);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);

    console.log("🔥 Firebase Emulators Connected! 🔥");
    
    // Enable App Check Debug Token for Localhost
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
}

// 5. Initialize App Check
// We wrap this check so it only runs in the browser
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    // Make sure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is in your .env
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

// 6. Exports
export { app, auth, db, rtdb, storage, functions };

// Export Models
export const model = getGenerativeModel(ai, { 
  model: "gemini-2.0-flash" 
}); // Updated to standard model name

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});