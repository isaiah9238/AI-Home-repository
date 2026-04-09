console.log("DEBUG: Evaluating src/auth.ts...");
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Telemetry for Sovereignty layer
console.log("--- AUTH_ENV_TELEMETRY ---");
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`AUTH_SECRET: ${process.env.AUTH_SECRET ? "✅ SET" : "❌ MISSING"}`);
console.log(`GOOGLE_ID: ${process.env.AUTH_GOOGLE_ID ? "✅ SET" : "❌ MISSING"}`);
console.log(`GOOGLE_SECRET: ${process.env.AUTH_GOOGLE_SECRET ? "✅ SET" : "❌ MISSING"}`);
console.log(`ALLOWED_EMAILS_RAW: ${process.env.ALLOWED_EMAILS ? "✅ SET" : "❌ MISSING"}`);
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "❌ NOT SET"}`);

if (process.env.NEXTAUTH_URL?.includes("/api/auth/callback")) {
  console.warn("🚨 CRITICAL_MISCONFIG: NEXTAUTH_URL should not include the callback path! It should be the base URL of your site.");
}

if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Authentication layers may fail.");
}

// Now pulling from .env for Sovereign privacy
// Clean whitespace from emails
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS 
  ? process.env.ALLOWED_EMAILS.split(",").map(e => e.trim()) 
  : [];

console.log(`ALLOWED_COUNT: ${ALLOWED_EMAILS.length}`);
console.log("--------------------------");

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 1. The Gatekeeper: Strict Sovereign Access
    async signIn({ user }) {
      console.log(`SIGN_IN_ATTEMPT: ${user?.email}`);
      
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        console.log(`ACCESS_GRANTED: ${user.email}`);
        return true; 
      }
      
      console.error("--- AUTH_FAILURE_REPORT ---");
      console.error(`TARGET_EMAIL: ${user?.email}`);
      console.error(`ALLOWED_LIST: ${ALLOWED_EMAILS.join(", ")}`);
      console.error(`TIME: ${new Date().toISOString()}`);
      console.error("ACTION: Check .env ALLOWED_EMAILS key.");
      console.error("---------------------------");
      
      return false; 
    },
    
    // 2. The Identity Sync: Pass user details to the Librarian (Actions)
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
});