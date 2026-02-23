import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/api" || pathname.startsWith("/api/api/")) {
    const normalizedPath = pathname.replace(/^\/api\/api(?=\/|$)/, "/api");
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath;

    console.warn(`[proxy] normalized duplicated API path: ${pathname} -> ${normalizedPath}`);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/api/:path*", "/api/api"],
};
