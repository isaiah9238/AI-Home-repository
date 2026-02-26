import * as admin from 'firebase-admin';

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

admin.initializeApp({
  projectId: "studio-3863072923-d4373"
});

const db = admin.firestore();

async function check() {
  console.log("🔍 Checking Firestore for 'primary_user'...");
  try {
    const doc = await db.collection('users').doc('primary_user').get();
    
    if (doc.exists) {
      console.log("✅ FOUND DATA:");
      console.log(JSON.stringify(doc.data(), null, 2));
    } else {
      console.log("❌ No document found. The seed script might not have run correctly.");
    }
  } catch (e) {
    console.error("❌ Error reading from emulator:", e);
  } finally {
    process.exit();
  }
}

check();