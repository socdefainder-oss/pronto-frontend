import { NextRequest, NextResponse } from "next/server";

// Rotas que exigem autenticação
const PROTECTED_PREFIXES = ["/app", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get("pronto_auth");

  if (!authCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
