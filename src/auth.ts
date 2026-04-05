import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Authentication layers may fail.");
}

// Define the absolute list of who is allowed in
const ALLOWED_EMAILS = ["isaiah9238@hotmail.com", "isaiah@example.com"]; 

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
    // 1. The Gatekeeper: Check the email before creating a session
    async signIn({ user }) {
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true; // Access Granted
      }
      
      console.warn(`Unauthorized login attempt from: ${user.email}`);
      return false; // Access Denied (redirects back to login with an error)
    },
    
    // 2. The Session Sync
    async session({ session, token }) {
      return session;
    },
  },
});