import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  // 🚨 THE BYPASS: If running locally, open the blast doors.
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/flux-echo');

  // If trying to access protected routes without a session in production, boot to Login
  if (!isLoggedIn && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/flux-echo/:path*', '/api/ai/:path*'],
};