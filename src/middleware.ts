import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const parsed = JSON.parse(token);
      if (!parsed.userId || !parsed.role) {
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.set("admin-token", "", { maxAge: 0, path: "/" });
        return response;
      }
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.set("admin-token", "", { maxAge: 0, path: "/" });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
