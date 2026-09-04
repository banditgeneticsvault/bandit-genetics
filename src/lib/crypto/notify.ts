import "server-only";

import type { Order } from "@/lib/orders/types";

/**
 * Email delivery is not wired. This is the same seam as contact mail:
 * persist the order, do not pretend a message was sent.
 */
export async function notifyCryptoOrder(
  order: Order,
): Promise<{ sent: false; reason: "unconfigured" }> {
  void order.id;
  return { sent: false, reason: "unconfigured" };
}
