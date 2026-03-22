import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Librarian Note: Auth.js v5 uses AUTH_SECRET for encryption and trust.
if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Authentication layers may fail.");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Critical for port-forwarding proxies in development environments
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
});
