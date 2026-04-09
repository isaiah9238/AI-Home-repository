import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isAuthPage = nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');

  // 1. Allow API Auth routes to pass through untouched
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. The Development Bypass (Keep this for now if you want easy access)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next(); // Uncomment this to bypass security
  }

  // 3. Security Logic
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', nextUrl)); // Send to home/dashboard
  }

  return NextResponse.next();
});

export const config = {
  // We want to PROTECT everything EXCEPT static files and the favicon
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};