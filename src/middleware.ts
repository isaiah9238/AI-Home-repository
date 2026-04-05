import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // If trying to access the Dashboard without a session, boot to Login
  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/ai/:path*'],
};