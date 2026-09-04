import "server-only";

import { cookies } from "next/headers";
import { isInternalOrderId } from "@/lib/orders/repository";

export const PENDING_ORDER_COOKIE = "bg_pending_order";

export async function readPendingOrderCookie(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(PENDING_ORDER_COOKIE)?.value ?? "";
  return isInternalOrderId(value) ? value : null;
}

export async function writePendingOrderCookie(orderId: string) {
  if (!isInternalOrderId(orderId)) return;
  const store = await cookies();
  store.set(PENDING_ORDER_COOKIE, orderId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}
