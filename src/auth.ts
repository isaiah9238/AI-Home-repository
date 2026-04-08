import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

if (!process.env.AUTH_SECRET) {
  console.warn("⚠️ AUTH_SECRET is missing! Authentication layers may fail.");
}

// Define the absolute list of who is allowed in
const ALLOWED_EMAILS = ["isaiahmichaelsmith@hotmail.com", "isaiah9238@gmail.com"]; 

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
    async signIn({ user }) {
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true; 
      }
      return false; 
    },
  },
});