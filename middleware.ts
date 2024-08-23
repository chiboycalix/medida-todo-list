import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const publicRoutes = ["/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (authToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
