import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Authentication layers may fail.");
}

// Now pulling from .env for Sovereign privacy
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(",") || [];

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
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true; 
      }
      console.warn(`BLOCKED_ACCESS: Unauthorized entry attempt by ${user?.email}`);
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