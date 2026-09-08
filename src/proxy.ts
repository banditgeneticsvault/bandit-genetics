import { NextResponse, type NextRequest } from "next/server";
import { AGE_GATE_PATH, safeAgeGateReturnPath } from "@/lib/age-gate";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    (pathname === AGE_GATE_PATH || pathname.startsWith(`${AGE_GATE_PATH}/`)) &&
    request.method !== "POST"
  ) {
    const next = request.nextUrl.clone();
    const destination = safeAgeGateReturnPath(request.nextUrl.searchParams.get("from"));
    const [path, query] = destination.split("?");
    next.pathname = path || "/";
    next.search = query ? `?${query}` : "";
    return NextResponse.redirect(next);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt)$).*)",
  ],
};
