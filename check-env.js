// check-env.js
const fs = require('fs');

console.log("🛠️  LIBRARIAN DIAGNOSTIC STARTING...");

const checklist = [
  { name: 'NEXT_PUBLIC_FIREBASE_API_KEY', type: 'Public (Browser)' },
  { name: 'FIREBASE_SERVICE_ACCOUNT_KEY', type: 'Private (Server)' },
  { name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', type: 'Public (Browser)' }
];

checklist.forEach(item => {
  const value = process.env[item.name];
  if (!value || value === "") {
    console.log(`❌ MISSING: ${item.name} [${item.type}]`);
  } else {
    console.log(`✅ FOUND: ${item.name} (${value.substring(0, 10)}...)`);
  }
});