'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

// 1. Web App Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIza...",
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

// 4. Initialize App Check
if (typeof window !== "undefined") {
  // In development, we use the Debug Provider.
  // This will print a debug token to your browser console.
  if (process.env.NODE_ENV === 'development') {
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    // Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual site key from Google Cloud Console 
    // when you're ready for production.
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'YOUR_RECAPTCHA_SITE_KEY'),
    isTokenAutoRefreshEnabled: true
  });
}

// 5. Initialize Vertex AI for Firebase
const ai = getAI(app, {
  backend: new GoogleAIBackend() 
});

// 6. Connect to Emulators (ONLY in Development)
const isDev = process.env.NODE_ENV === 'development';
const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;

if (isDev && host) {
  if (typeof window !== 'undefined') {
    connectFirestoreEmulator(db, `8080-${host}`, 443);
    connectDatabaseEmulator(rtdb, `7000-${host}`, 443);
    connectStorageEmulator(storage, `9199-${host}`, 443);
    connectFunctionsEmulator(functions, `5001-${host}`, 443);
    connectAuthEmulator(auth, `https://9099-${host}`, { disableWarnings: true });
    
    console.log("🚀 Browser: Connected via Workstation Tunnel");
  } else {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectDatabaseEmulator(rtdb, '127.0.0.1', 7000);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  }
}

export { app, auth, db, rtdb, storage, functions };

// Export Models
export const model = getGenerativeModel(ai, { 
  model: "gemini-2.0-flash-exp" 
});

export const lessonModel = getGenerativeModel(ai, {
  model: "gemini-2.0-flash-exp",
  systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
});
