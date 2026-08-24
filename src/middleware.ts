import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/site-login") {
    return NextResponse.next();
  }

  // サイト全体のパスワードゲート(SITE_PASSWORD未設定の間はゲートなしで通す)
  const siteExpected = process.env.SITE_PASSWORD;
  const siteCookie = request.cookies.get("site_auth")?.value;
  if (siteExpected && siteCookie !== siteExpected) {
    const loginUrl = new URL("/site-login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const adminCookie = request.cookies.get("admin_auth")?.value;
    const adminExpected = process.env.ADMIN_PASSWORD;

    if (!adminExpected || adminCookie !== adminExpected) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
