import "server-only";

import type { CartLine } from "@/data/order";
import { validateCheckoutCart } from "@/lib/checkout-cart";
import {
  beginPendingOrder,
  recordCheckoutSession,
} from "@/lib/stripe/webhooks";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import {
  checkoutRedirectUrls,
  encodeOrderMetadata,
  stripeLineItems,
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
};

export type PaymentResult =
  | { ok: false; status: "disconnected"; reason: "payment_unavailable" }
  | { ok: false; status: "failed"; reason: "empty" | "invalid_cart" | "stripe_error" }
  | { ok: true; status: "processing"; url: string; orderId: string };

export function getPaymentStatus(): PaymentStatus {
  return isStripeConfigured() ? "processing" : "disconnected";
}

export function isPaymentEnabled() {
  return isStripeConfigured();
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

  const cart = validateCheckoutCart(request.items);
  if (!cart.ok) {
    if (cart.reason === "empty") {
      return { ok: false, status: "failed", reason: "empty" };
    }
    return { ok: false, status: "failed", reason: "invalid_cart" };
  }

  const order = await beginPendingOrder({
    email: request.email,
    name: request.name,
    lines: cart.lines,
    subtotalCents: cart.subtotalCents,
  });

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
        payment_method_types: ["card"],
        line_items: stripeLineItems(cart.lines),
        success_url: redirects.success_url,
        cancel_url: redirects.cancel_url,
        metadata,
        payment_intent_data: {
          metadata: {
            orderId: order.id,
          },
        },
      },
      { idempotencyKey: `order_${order.id}` },
    );

    if (!session.url) {
      console.error("stripe_session_missing_url", { orderId: order.id });
      return { ok: false, status: "failed", reason: "stripe_error" };
    }

    await recordCheckoutSession(order.id, session.id);
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
