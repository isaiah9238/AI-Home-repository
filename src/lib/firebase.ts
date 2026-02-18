'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from"firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAI, getGenerativeModel } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

//1. Your Web App Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_FIREBASE_API_KEY,
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

const ai = getAI(app);

//4. Connect to Emulators (ONLY in Development)
// We check window.location to ensure we are on the client, and NODE_ENV for the server.
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  // Prevent double-connection during hot reloads
  // (The 'undefined' check is a safeguard for Server-Side Rendering)
  if (typeof window !== 'undefined') {
    
    // Connect Auth (Port 9099)
    // Note: The second 'http://127.0.0.1:9099' arg is vital for Auth to work properly
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

    // Connect Firestore (Port 8080)
    connectFirestoreEmulator(db, '127.0.0.1', 8080);

    // Connect Realtime Database (Port 9000)
    connectDatabaseEmulator(rtdb, '127.0.0.1', 9000);

    // Connect Storage (Port 9199)
    connectStorageEmulator(storage, '127.0.0.1', 9199);

    // Connect Functions (Port 5001)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);

    console.log("🔥 Firebase Emulators Connected! 🔥");
  }
}

export{ app, auth, db, rtdb, storage, functions }

// 5. Export Models (Using the latest 2026 stable IDs)
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
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}
