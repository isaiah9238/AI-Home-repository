import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // 1. Allow the user to hit the login page without getting blocked
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isLoginRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return; // Pass through cleanly to show the HUD
  }

  // 2. If they aren't logged in and aren't on the login page, protect the app
  if (!isLoggedIn && !isLoginRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};