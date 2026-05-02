import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS 
  ? process.env.ALLOWED_EMAILS.split(",").map(e => e.trim()) 
  : [];

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
      if (process.env.NODE_ENV === 'development') return true;
      
      if (user.email && ALLOWED_EMAILS.includes(user.email)) {
        return true; 
      }
      
      console.warn(`[AUTH] Access denied for user: ${user?.email}`);
      return false; 
    },
    
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; 
      }
      return session;
    },
  },
});
