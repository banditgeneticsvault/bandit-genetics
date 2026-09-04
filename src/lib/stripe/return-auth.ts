import { createHmac, timingSafeEqual } from "node:crypto";
import { isStripeCheckoutSessionId } from "@/lib/stripe/association";

const ORDER_ID_PATTERN =
  /^bg_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const CHECKOUT_RETURN_TTL_SECONDS = 60 * 60 * 24;

export type CheckoutReturnAuth = {
  sessionId: string;
  orderId: string;
  expiresAt: number;
};

function isOrderId(value: string) {
  return ORDER_ID_PATTERN.test(value);
}

function base64UrlEncode(value: string | Buffer) {
  const buffer = typeof value === "string" ? Buffer.from(value, "utf8") : value;
  return buffer
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(`${padded}${pad}`, "base64");
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest();
}

export function signCheckoutReturnAuth(
  input: { sessionId: string; orderId: string; expiresAt?: number },
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): string | null {
  const key = secret.trim();
  if (!key) return null;
  if (!isStripeCheckoutSessionId(input.sessionId) || !isOrderId(input.orderId)) {
    return null;
  }
  const expiresAt =
    input.expiresAt ?? nowSeconds + CHECKOUT_RETURN_TTL_SECONDS;
  const body = JSON.stringify({
    v: 1,
    sid: input.sessionId,
    oid: input.orderId,
    exp: expiresAt,
  });
  const encoded = base64UrlEncode(body);
  const signature = base64UrlEncode(signPayload(encoded, key));
  return `v1.${encoded}.${signature}`;
}

export function verifyCheckoutReturnAuth(
  token: string | null | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): CheckoutReturnAuth | null {
  const key = secret.trim();
  if (!key || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;
  const encoded = parts[1];
  const signature = parts[2];
  if (!encoded || !signature) return null;

  let expected: Buffer;
  let provided: Buffer;
  try {
    expected = signPayload(encoded, key);
    provided = base64UrlDecode(signature);
  } catch {
    return null;
  }
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(encoded).toString("utf8")) as {
      v?: unknown;
      sid?: unknown;
      oid?: unknown;
      exp?: unknown;
    };
    if (parsed.v !== 1) return null;
    if (typeof parsed.sid !== "string" || typeof parsed.oid !== "string") {
      return null;
    }
    if (typeof parsed.exp !== "number" || !Number.isInteger(parsed.exp)) {
      return null;
    }
    if (parsed.exp <= nowSeconds) return null;
    if (!isStripeCheckoutSessionId(parsed.sid) || !isOrderId(parsed.oid)) {
      return null;
    }
    return {
      sessionId: parsed.sid,
      orderId: parsed.oid,
      expiresAt: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function checkoutReturnAllows(
  auth: CheckoutReturnAuth | null | undefined,
  sessionId: string,
  orderId: string,
) {
  if (!auth) return false;
  return auth.sessionId === sessionId && auth.orderId === orderId;
}

export function checkoutReturnPresentation(input: {
  authorized: boolean;
  sessionPaid: boolean;
  orderFailed: boolean;
  sessionExpired: boolean;
}): "missing" | "pending" | "failed" | "confirmed" {
  if (!input.authorized) return "missing";
  if (input.sessionPaid) return "confirmed";
  if (input.orderFailed || input.sessionExpired) return "failed";
  return "pending";
}
