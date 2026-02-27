import * as admin from 'firebase-admin';

// Configuration from environment or defaults
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-3863072923-d4373';

// Force connection to the local emulator
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

const db = admin.firestore();

async function seed() {
  console.log("🚀 Establishing Home Base...");
  
  const userData = {
    name: "Isaiah Smith",
    interests: ["Soccer", "Web Development", "AI Engineering", "UI/UX Design"],
    role: "Primary User",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  try {
    // We use .set() to overwrite any existing data or create it if missing
    await db.collection('users').doc('primary_user').set(userData);
    console.log("✅ SUCCESS: Home Base established for:", userData.name);
  } catch (error) {
    console.error("🚨 Seeding failed:", error);
    throw error; // Rethrow so the caller knows it failed
  }
}

// Execute and handle the process lifecycle
seed()
  .then(() => {
    console.log("🌱 Seeding complete. Ready for development.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
  });