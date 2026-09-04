import "server-only";

import type Stripe from "stripe";
import {
  applyOrderStatus,
  attachStripeSession,
  createPendingOrder,
  getOrderById,
  getOrderByPaymentIntentId,
  getOrderBySessionId,
  hasProcessedEvent,
  markProcessedEvent,
  saveOrder,
} from "@/lib/orders/repository";
import type { Order, OrderLine } from "@/lib/orders/types";
import type { ResolvedCartLine } from "@/lib/cart";
import { decodeOrderSnapshot, encodeOrderMetadata } from "@/lib/stripe/session";
import { getStripe } from "@/lib/stripe/client";

function paymentIntentId(
  value: string | Stripe.PaymentIntent | null | undefined,
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function linesFromResolved(lines: ResolvedCartLine[]): OrderLine[] {
  return lines.map((line) => ({
    productId: line.productId,
    variantId: line.variantId,
    strainName: line.name,
    packLabel: line.seedLabel,
    seedCount: line.seedCount,
    quantity: line.quantity,
    unitPriceCents: line.priceCents,
    lineTotalCents: line.lineTotalCents,
  }));
}

export async function beginPendingOrder(input: {
  email: string;
  name: string;
  lines: ResolvedCartLine[];
  subtotalCents: number;
}): Promise<Order> {
  return createPendingOrder({
    customerEmail: input.email,
    customerName: input.name,
    subtotalCents: input.subtotalCents,
    totalCents: input.subtotalCents,
    lines: linesFromResolved(input.lines),
    paymentMethod: "card",
    status: "pending",
    paymentStatus: "unpaid",
  });
}

export async function recordCheckoutSession(
  orderId: string,
  sessionId: string,
): Promise<Order | null> {
  return attachStripeSession(orderId, sessionId);
}

async function persistStatus(
  order: Order,
  stripe: Stripe,
): Promise<Order> {
  const saved = await saveOrder(order);
  if (saved.stripeCheckoutSessionId) {
    try {
      await stripe.checkout.sessions.update(saved.stripeCheckoutSessionId, {
        metadata: {
          ...encodeOrderMetadata(saved),
        },
      });
    } catch (error) {
      console.error("stripe_session_metadata_update_failed", {
        orderId: saved.id,
        type: error instanceof Error ? error.name : "unknown",
      });
    }
  }
  return saved;
}

function orderFromSession(
  session: Stripe.Checkout.Session,
  existing: Order | null,
): Order | null {
  const metadata = session.metadata;
  const orderId = metadata?.orderId ?? existing?.id;
  if (!orderId) return existing;
  const snapshot = decodeOrderSnapshot(metadata);
  const status = existing?.status ?? "pending";
  const email =
    session.customer_details?.email ??
    session.customer_email ??
    snapshot?.email ??
    existing?.customerEmail ??
    "";
  const createdAt = existing?.createdAt ?? new Date().toISOString();
  return {
    id: orderId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      paymentIntentId(session.payment_intent) ??
      existing?.stripePaymentIntentId ??
      null,
    customerEmail: email,
    customerName:
      session.customer_details?.name ??
      snapshot?.name ??
      existing?.customerName ??
      "",
    status,
    paymentStatus: existing?.paymentStatus ?? "unpaid",
    paymentMethod: existing?.paymentMethod ?? "card",
    cryptocurrency: existing?.cryptocurrency ?? null,
    receivingAddress: existing?.receivingAddress ?? null,
    transactionHash: existing?.transactionHash ?? null,
    currency: "usd",
    subtotalCents: snapshot?.subtotalCents ?? existing?.subtotalCents ?? 0,
    shippingCents: existing?.shippingCents ?? 0,
    taxCents: existing?.taxCents ?? 0,
    totalCents: snapshot?.totalCents ?? existing?.totalCents ?? 0,
    lines: snapshot?.lines?.length
      ? snapshot.lines
      : (existing?.lines ?? []),
    createdAt,
    updatedAt: new Date().toISOString(),
    paidAt:
      existing?.paidAt ?? (status === "paid" ? new Date().toISOString() : null),
  };
}

async function loadOrderForSession(
  session: Stripe.Checkout.Session,
): Promise<Order | null> {
  const bySession = await getOrderBySessionId(session.id);
  const orderId = session.metadata?.orderId;
  const byId = orderId ? await getOrderById(orderId) : null;
  return orderFromSession(session, bySession ?? byId);
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  if (await hasProcessedEvent(event.id)) {
    return;
  }

  const stripe = getStripe();
  if (!stripe) {
    throw new Error("stripe_unconfigured");
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await loadOrderForSession(session);
      if (!order) {
        throw new Error("order_not_ready");
      }
      const paid = session.payment_status === "paid";
      const next = paid
        ? applyOrderStatus(order, "paid", "paid", {
            stripePaymentIntentId: paymentIntentId(session.payment_intent),
          })
        : applyOrderStatus(order, "pending", "unpaid", {
            stripePaymentIntentId: paymentIntentId(session.payment_intent),
          });
      const merged = {
        ...next,
        stripeCheckoutSessionId: session.id,
        customerEmail:
          session.customer_details?.email ??
          session.customer_email ??
          next.customerEmail,
      };
      await persistStatus(merged, stripe);
      await markProcessedEvent(event.id, merged.id);
      return;
    }
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await loadOrderForSession(session);
      if (!order) {
        throw new Error("order_not_ready");
      }
      const next = applyOrderStatus(order, "paid", "paid", {
        stripePaymentIntentId: paymentIntentId(session.payment_intent),
      });
      await persistStatus(
        { ...next, stripeCheckoutSessionId: session.id },
        stripe,
      );
      await markProcessedEvent(event.id, next.id);
      return;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await loadOrderForSession(session);
      if (!order) {
        throw new Error("order_not_ready");
      }
      const next = applyOrderStatus(order, "payment_failed", "failed", {
        stripePaymentIntentId: paymentIntentId(session.payment_intent),
      });
      await persistStatus(
        { ...next, stripeCheckoutSessionId: session.id },
        stripe,
      );
      await markProcessedEvent(event.id, next.id);
      return;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await loadOrderForSession(session);
      if (!order) {
        throw new Error("order_not_ready");
      }
      const next = applyOrderStatus(order, "cancelled", "cancelled", {
        stripePaymentIntentId: paymentIntentId(session.payment_intent),
      });
      await persistStatus(
        { ...next, stripeCheckoutSessionId: session.id },
        stripe,
      );
      await markProcessedEvent(event.id, next.id);
      return;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      let order = orderId
        ? await getOrderById(orderId)
        : await getOrderByPaymentIntentId(intent.id);
      if (!order) {
        try {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: intent.id,
            limit: 1,
          });
          const session = sessions.data[0];
          if (session) order = await loadOrderForSession(session);
        } catch (error) {
          console.error("stripe_payment_intent_session_lookup_failed", {
            name: error instanceof Error ? error.name : "unknown",
          });
        }
      }
      if (!order) {
        if (orderId) {
          throw new Error("order_not_ready");
        }
        await markProcessedEvent(event.id);
        return;
      }
      const next = applyOrderStatus(order, "payment_failed", "failed", {
        stripePaymentIntentId: intent.id,
      });
      await persistStatus(next, stripe);
      await markProcessedEvent(event.id, next.id);
      return;
    }
    default:
      await markProcessedEvent(event.id);
  }
}

export async function lookupOrderForSession(
  sessionId: string,
): Promise<{ order: Order | null; sessionPaid: boolean; sessionFound: boolean }> {
  const stripe = getStripe();
  if (!stripe) {
    return { order: null, sessionPaid: false, sessionFound: false };
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = await loadOrderForSession(session);
    return {
      order,
      sessionFound: true,
      sessionPaid: session.payment_status === "paid",
    };
  } catch {
    return { order: null, sessionPaid: false, sessionFound: false };
  }
}
