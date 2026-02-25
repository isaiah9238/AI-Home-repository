// src/scripts/seed-home-base.ts
import { db } from '../lib/firebase'; // Adjust path to your firebase config
import { doc, setDoc } from 'firebase/firestore';

async function seed() {
  console.log("🌱 Starting Home Base seeding...");
  
  try {
    await setDoc(doc(db, 'users', 'primary_user'), {
      name: "Developer",
      interests: ["Web Dev", "Surveying Math", "ASL Projects"],
      lastUpdated: new Date().toISOString(),
      status: "active"
    });
    
    console.log("✅ Home Base Established! 'primary_user' created in Firestore.");
  } catch (error) {
    console.error("❌ Error seeding Home Base:", error);
  } finally {
    process.exit();
  }
}

seed();