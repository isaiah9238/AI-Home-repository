import * as admin from 'firebase-admin';

// 1. Define a Shape for your Data (Type Safety)
interface UserProfile {
  name: string;
  interests: string[];
  established: boolean;
}

// 2. Use Environment Variables with Fallbacks
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "studio-3863072923-d4373";
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

async function seed() {
  console.log("🚀 Establishing Home Base...");
  
  const userData: UserProfile = {
    name: "Isaiah Smith",
    interests: ["soccer", "music", "web app development", "land surveying", "traveling"],
    established: true
  };

  try {
    // 3. Use { merge: true } to avoid accidental data wipes
    await db.collection('users').doc('primary_user').set(userData, { merge: true });
    console.log("✅ SUCCESS: Home Base established!");
  } catch (e) {
    console.error("❌ Failed to seed:", e);
  }
}

// 4. Run the function, then exit cleanly
seed().then(() => {
  console.log("👋 Seeding complete.");
  process.exit(0);
}).catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});