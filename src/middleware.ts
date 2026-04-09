// This is likely the line you are missing or need to verify
export { auth as middleware } from "@/auth"; 

import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  // 🚨 THE BYPASS: If running locally, open the blast doors.
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Redirect to login if not logged in and not on an auth-related page
  if (!isLoggedIn && !isAuthPage && !isApiAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Redirect to dashboard if logged in and trying to access the login page
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // This regex ensures middleware doesn't run on static files or specific API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};