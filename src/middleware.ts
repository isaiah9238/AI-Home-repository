import { auth } from "@/auth";

export default auth((req) => {
  // BYPASS: Temporarily disabling mandatory login redirects for prototyping
  return;
  
  /*
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Redirect to login terminal if not authorized
  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to dashboard core if already authorized
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
  */
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
