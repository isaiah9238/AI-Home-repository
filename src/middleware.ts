import { auth } from "@/auth";

export default auth((req) => {
  // BYPASS: Temporarily allow all traffic to dashboard for development
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
