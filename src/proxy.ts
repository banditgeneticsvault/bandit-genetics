import { NextResponse, type NextRequest } from "next/server";
import {
  AGE_COOKIE_NAME,
  AGE_GATE_PATH,
  isAgeGatePublicPath,
  isAgeVerifiedCookie,
  safeAgeGateReturnPath,
} from "@/lib/age-gate";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const verified = isAgeVerifiedCookie(request.cookies.get(AGE_COOKIE_NAME)?.value);

  if (verified) {
    if (pathname === AGE_GATE_PATH || pathname.startsWith(`${AGE_GATE_PATH}/`)) {
      const next = request.nextUrl.clone();
      const destination = safeAgeGateReturnPath(request.nextUrl.searchParams.get("from"));
      const [path, query] = destination.split("?");
      next.pathname = path || "/";
      next.search = query ? `?${query}` : "";
      return NextResponse.redirect(next);
    }
    return NextResponse.next();
  }

  if (isAgeGatePublicPath(pathname)) {
    return NextResponse.next();
  }

  const gate = request.nextUrl.clone();
  gate.pathname = AGE_GATE_PATH;
  const from = `${pathname}${search}`;
  gate.search = from && from !== "/" ? `?from=${encodeURIComponent(from)}` : "";
  return NextResponse.redirect(gate);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt)$).*)",
  ],
};
