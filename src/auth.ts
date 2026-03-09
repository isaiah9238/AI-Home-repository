import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// 🏛️ These three exports are what the rest of your app is looking for!
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // ... rest of your config
});