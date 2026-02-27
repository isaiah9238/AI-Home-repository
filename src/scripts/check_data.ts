import * as admin from 'firebase-admin';

// Suggested Fix #1: Externalize Configuration
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';

// 1. Ensure the host is set correctly for the current terminal session
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

// 2. Add the "Owner" header (The 'Master Key' for emulators)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373',
    // This tells the emulator: "I am the owner, don't check my ID"
    credential: admin.credential.applicationDefault(), 
  });
}

const db = admin.firestore();

async function check() {
  console.log("🔍 Checking Home Base data...");
  try {
    const doc = await db.collection('users').doc('primary_user').get();
    
    if (doc.exists) {
      // Suggested Fix #3: Mask sensitive data (only log names/interests)
      const data = doc.data();
      console.log("✅ SUCCESS: Found Primary User:", data?.name);
      console.log("📝 Interests:", data?.interests);
    } else {
      console.log("❌ ERROR: No 'primary_user' found. Did you run the seed script?");
    }
  } catch (error) {
    console.error("🚨 Connection Error:", error);
  }
}

// Suggested Fix #4: Refined process exit
check().then(() => {
  console.log("👋 Check complete.");
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});