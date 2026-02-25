const admin = require('firebase-admin');

// Tell the Admin SDK to talk to your local emulator on port 8080
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

admin.initializeApp({
  projectId: "studio-3863072923-d4373" // Matches your terminal logs
});

const db = admin.firestore();

async function seed() {
  console.log("🚀 Powering through... Writing directly to Firestore.");
  try {
    await db.collection('users').doc('primary_user').set({
      name: "Isaiah",
      interests: ["Web Dev", "ASL Projects", "Math"],
      established: true
    });
    console.log("✅ SUCCESS: Home Base established!");
  } catch (e) {
    console.error("❌ Failed:", e);
  } finally {
    process.exit();
  }
}
seed();