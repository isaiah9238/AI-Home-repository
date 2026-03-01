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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAvydFedHHp-P0Gldx_QsZ0JV9psd5hoNU",
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
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Explicitly set the debug token to true before initializing App Check.
    // This tells Firebase to generate a new debug token and print it to the console.
    (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log("🛠️ App Check: Debug Mode Enabled. Check console for your Debug Token.");
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LewdWQsAAAAAAmRE94NsbKPY0gfwD787wc1fgpE'),
    isTokenAutoRefreshEnabled: true
  });
}

// 5. Initialize Vertex AI for Firebase
// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

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
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

//export const lessonModel = getGenerativeModel(ai, {
  //model: "gemini-2.5-flash",
  //systemInstruction: "You are an expert educator. Create structured, clear lesson plans."
//});
