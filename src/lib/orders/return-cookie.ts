import "server-only";

import { cookies } from "next/headers";
import {
  signCheckoutReturnAuth,
  verifyCheckoutReturnAuth,
  type CheckoutReturnAuth,
} from "@/lib/stripe/return-auth";

export const CHECKOUT_RETURN_COOKIE = "bg_checkout_return";

function signingSecret() {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export async function readCheckoutReturnAuth(): Promise<CheckoutReturnAuth | null> {
  const store = await cookies();
  return verifyCheckoutReturnAuth(
    store.get(CHECKOUT_RETURN_COOKIE)?.value,
    signingSecret(),
  );
}

export async function writeCheckoutReturnCookie(input: {
  sessionId: string;
  orderId: string;
}) {
  const token = signCheckoutReturnAuth(input, signingSecret());
  if (!token) return;
  const store = await cookies();
  store.set(CHECKOUT_RETURN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}
