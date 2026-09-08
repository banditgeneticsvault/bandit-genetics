export const AGE_COOKIE_NAME = "bg_age_verified";
export const AGE_COOKIE_VALUE = "21";
export const AGE_GATE_PATH = "/age-gate";

const STATIC_FILE_PATTERN =
  /\.(?:avif|css|gif|ico|jpg|jpeg|js|map|mp4|png|svg|txt|webm|webp|woff2?)$/i;

export function isAgeVerifiedCookie(value: string | undefined | null) {
  return value === AGE_COOKIE_VALUE;
}

export function isAgeGatePublicPath(pathname: string) {
  if (pathname === AGE_GATE_PATH || pathname.startsWith(`${AGE_GATE_PATH}/`)) {
    return true;
  }
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  if (STATIC_FILE_PATTERN.test(pathname)) return true;
  return false;
}

export function safeAgeGateReturnPath(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  if (value.startsWith("/\\")) return "/";
  if (value.includes("://")) return "/";
  const [rawPath, ...queryParts] = value.split("?");
  const path = (rawPath ?? "/").split("#")[0] || "/";
  if (!path.startsWith("/")) return "/";
  if (path === AGE_GATE_PATH || path.startsWith(`${AGE_GATE_PATH}/`)) return "/";
  const query = queryParts.join("?");
  return query ? `${path}?${query}` : path;
}
