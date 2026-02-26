'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'; // Stay muted

// 1. Web App Configuration
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

// Initialize Vertex AI for Firebase with the Google AI Provider
const ai = getAI(app, {
  backend: new GoogleAIBackend() 
});

// 4. Connect to Emulators (ONLY in Development)
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectDatabaseEmulator(rtdb, '127.0.0.1', 7000);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);

  if (typeof window !== 'undefined') {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    console.log("🔥 Firebase Emulators Connected! 🔥");
  }
}

// 6. Exports
export { app, auth, db, rtdb, storage, functions };

// Export Models
export const model = getGenerativeModel(ai, { 
  model: "gemini-2.0-flash-exp" 
});

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash-exp",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});