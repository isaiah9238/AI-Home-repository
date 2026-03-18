import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Librarian Note: Ensure environment variables are loaded
if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Middleware will hang.");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // Use a fallback for local dev to prevent the hang
  secret: process.env.AUTH_SECRET || "development-secret-only-not-for-prod",
  trustHost: true, // Crucial for IDX and App Hosting proxies
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // You can attach the user ID to the session here later
      return session;
    },
  },
});
