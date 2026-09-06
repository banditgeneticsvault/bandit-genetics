import { siteUrl } from "@/content/site";

function originFrom(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Public site origin. */
export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    const origin = originFrom(fromEnv);
    if (origin) return origin;
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
  return siteUrl;
}

export function isPublicHttpsOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && url.hostname !== "localhost";
  } catch {
    return false;
  }
}

export function publicAssetUrl(path: string): string | undefined {
  if (!path.startsWith("/") || path.startsWith("//")) return undefined;
  const origin = getPublicSiteUrl();
  if (!isPublicHttpsOrigin(origin)) return undefined;
  return `${origin}${path}`;
}
