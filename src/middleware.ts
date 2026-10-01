import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  // Handle Lightweight Telemetry / Action Tracking
  if (pathname === "/api/track") {
    const event = searchParams.get("event") || "Interaction";
    console.log(`[ACTION] 🎯 ${timestamp} | ${event} | IP: ${ip} | UA: ${userAgent.slice(0, 45)}...`);
    return NextResponse.json({ ok: true });
  }

  // Skip static assets and internal next.js files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Log page visits
  console.log(`[VISIT] 🌐 ${timestamp} | ${request.method} ${pathname} | IP: ${ip} | UA: ${userAgent.slice(0, 45)}...`);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/track",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
