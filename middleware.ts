import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const pathname = request.nextUrl.pathname;

  // Allow access to public paths even without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If there's no session and trying to access protected route, redirect to sign-in
  if (!session) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If there's a session and trying to access auth pages, redirect to home
  if (session && publicPaths.includes(pathname)) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|covers/|robot.png).*)",
  ],
};
