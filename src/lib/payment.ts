import "server-only";

import { createHash, randomUUID } from "node:crypto";
import type { CartLine } from "@/data/order";
import { syncCheckoutPromotion } from "@/lib/checkout-promotion";
import { writeCheckoutReturnCookie } from "@/lib/orders/return-cookie";
import { recordCheckoutSession } from "@/lib/stripe/webhooks";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import type { Order } from "@/lib/orders/types";
import {
  checkoutRedirectUrls,
  encodeOrderMetadata,
  stripeCheckoutLineItems,
  stripeShippingOptions,
  STRIPE_SHIPPING_COUNTRIES,
} from "@/lib/stripe/session";

export type PaymentStatus =
  | "disconnected"
  | "processing"
  | "succeeded"
  | "failed";

export type CheckoutSessionRequest = {
  name: string;
  email: string;
  items: CartLine[];
  promotionalProductId?: unknown;
};

export type PaymentResult =
  | { ok: false; status: "disconnected"; reason: "payment_unavailable" }
  | {
      ok: false;
      status: "failed";
      reason:
        | "empty"
        | "invalid_cart"
        | "stripe_error"
        | "invalid_promotional_product"
        | "gift_required";
    }
  | { ok: true; status: "processing"; url: string; orderId: string };

export function getPaymentStatus(): PaymentStatus {
  return isStripeConfigured() ? "processing" : "disconnected";
}

export function isPaymentEnabled() {
  return isStripeConfigured();
}

function checkoutIdempotencyKey(order: Order) {
  const payload = JSON.stringify({
    id: order.id,
    subtotal: order.subtotalCents,
    shipping: order.shippingCents,
    total: order.totalCents,
    gift: order.promotionalProductId,
    applied: order.promotionalGiftApplied,
    lines: order.lines,
  });
  const digest = createHash("sha256").update(payload).digest("hex").slice(0, 20);
  return `checkout_${order.id}_${digest}_${randomUUID().slice(0, 8)}`;
}

async function expirePreviousSession(order: Order) {
  if (!order.stripeCheckoutSessionId) return;
  const stripe = getStripe();
  if (!stripe) return;
  try {
    const session = await stripe.checkout.sessions.retrieve(
      order.stripeCheckoutSessionId,
    );
    if (session.status === "open") {
      await stripe.checkout.sessions.expire(session.id);
    }
  } catch (error) {
    console.error("stripe_session_expire_failed", {
      orderId: order.id,
      type: error instanceof Error ? error.name : "unknown",
    });
  }
}

export async function createCheckout(
  request: CheckoutSessionRequest,
): Promise<PaymentResult> {
  if (!isStripeConfigured()) {
    return { ok: false, status: "disconnected", reason: "payment_unavailable" };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { ok: false, status: "disconnected", reason: "payment_unavailable" };
  }

  const synced = await syncCheckoutPromotion({
    items: request.items,
    name: request.name,
    email: request.email,
    promotionalProductId: request.promotionalProductId,
    requireGiftIfQualified: true,
  });
  if (!synced.ok) {
    if (synced.reason === "empty") {
      return { ok: false, status: "failed", reason: "empty" };
    }
    if (
      synced.reason === "invalid_promotional_product" ||
      synced.reason === "gift_required"
    ) {
      return { ok: false, status: "failed", reason: synced.reason };
    }
    return { ok: false, status: "failed", reason: "invalid_cart" };
  }

  const { order, lines } = synced;
  await expirePreviousSession(order);

  const redirects = checkoutRedirectUrls();
  const metadata = encodeOrderMetadata(order);

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: order.id,
        customer_email: request.email,
        billing_address_collection: "required",
        shipping_address_collection: {
          allowed_countries: [...STRIPE_SHIPPING_COUNTRIES],
        },
        shipping_options: stripeShippingOptions(order.shippingCents),
        line_items: stripeCheckoutLineItems(lines, order),
        success_url: redirects.success_url,
        cancel_url: redirects.cancel_url,
        metadata,
        payment_intent_data: {
          metadata: {
            orderId: order.id,
          },
        },
      },
      { idempotencyKey: checkoutIdempotencyKey(order) },
    );

    if (!session.url) {
      console.error("stripe_session_missing_url", { orderId: order.id });
      return { ok: false, status: "failed", reason: "stripe_error" };
    }

    await recordCheckoutSession(order.id, session.id);
    await writeCheckoutReturnCookie({
      sessionId: session.id,
      orderId: order.id,
    });
    return {
      ok: true,
      status: "processing",
      url: session.url,
      orderId: order.id,
    };
  } catch (error) {
    console.error("stripe_session_create_failed", {
      orderId: order.id,
      type: error instanceof Error ? error.name : "unknown",
    });
    return { ok: false, status: "failed", reason: "stripe_error" };
  }
}

/** @deprecated Use createCheckout. */
export async function createPayment(
  request?: CheckoutSessionRequest,
): Promise<PaymentResult> {
  if (!request) {
    return { ok: false, status: "disconnected", reason: "payment_unavailable" };
  }
  return createCheckout(request);
}

export async function confirmPayment(
  _paymentId?: string,
): Promise<PaymentResult> {
  void _paymentId;
  return { ok: false, status: "disconnected", reason: "payment_unavailable" };
}
