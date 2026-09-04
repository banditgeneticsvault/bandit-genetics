import "server-only";

import type Stripe from "stripe";
import {
  applyOrderStatus,
  attachStripeSession,
  claimWebhookEvent,
  completeWebhookEvent,
  createPendingOrder,
  getOrderById,
  getOrderByPaymentIntentId,
  getOrderBySessionId,
  isInternalOrderId,
  releaseWebhookEvent,
  saveOrder,
} from "@/lib/orders/repository";
import type { Order, OrderLine } from "@/lib/orders/types";
import type { ResolvedCartLine } from "@/lib/cart";
import {
  sessionBelongsToOrder,
  stripeSessionOrderId,
} from "@/lib/stripe/association";
import {
  checkoutReturnAllows,
  checkoutReturnPresentation,
  type CheckoutReturnAuth,
} from "@/lib/stripe/return-auth";
import { encodeOrderMetadata } from "@/lib/stripe/session";
import { getStripe } from "@/lib/stripe/client";

function paymentIntentId(
  value: string | Stripe.PaymentIntent | null | undefined,
): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function linesFromResolved(lines: ResolvedCartLine[]): OrderLine[] {
  return lines.map((line) => ({
    kind: "paid",
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

function withSessionPointers(
  order: Order,
  session: Stripe.Checkout.Session,
): Order {
  return {
    ...order,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      paymentIntentId(session.payment_intent) ?? order.stripePaymentIntentId,
    customerEmail:
      session.customer_details?.email ??
      session.customer_email ??
      order.customerEmail,
  };
}

export async function resolveStoredOrderForSession(
  session: Stripe.Checkout.Session,
): Promise<Order | null> {
  const associatedId = stripeSessionOrderId(session);
  if (associatedId && !isInternalOrderId(associatedId)) return null;

  const bySession = await getOrderBySessionId(session.id);
  const byId = associatedId ? await getOrderById(associatedId) : null;

  if (bySession && byId && bySession.id !== byId.id) return null;

  const order = bySession ?? byId;
  if (!order) return null;
  if (!sessionBelongsToOrder(session, order)) return null;
  return order;
}

async function markOrderPaidFromSession(
  order: Order,
  session: Stripe.Checkout.Session,
  stripe: Stripe,
): Promise<Order> {
  const next = applyOrderStatus(
    withSessionPointers(order, session),
    "paid",
    "paid",
    {
      stripePaymentIntentId: paymentIntentId(session.payment_intent),
    },
  );
  return persistStatus(next, stripe);
}

export type CheckoutReturnView = "missing" | "pending" | "failed" | "confirmed";

export async function confirmCheckoutReturn(
  sessionId: string,
  returnAuth?: CheckoutReturnAuth | null,
): Promise<{
  sessionFound: boolean;
  sessionPaid: boolean;
  view: CheckoutReturnView;
  order: Order | null;
}> {
  const stripe = getStripe();
  if (!stripe) {
    return {
      sessionFound: false,
      sessionPaid: false,
      view: "missing",
      order: null,
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const order = await resolveStoredOrderForSession(session);
    if (!order) {
      return {
        sessionFound: true,
        sessionPaid: session.payment_status === "paid",
        view: "missing",
        order: null,
      };
    }

    const authorized = checkoutReturnAllows(returnAuth, session.id, order.id);
    const sessionPaid = session.payment_status === "paid";
    let stored = order;
    if (sessionPaid) {
      stored = await markOrderPaidFromSession(order, session, stripe);
    }

    const view = checkoutReturnPresentation({
      authorized,
      sessionPaid,
      orderFailed:
        stored.status === "payment_failed" || stored.paymentStatus === "failed",
      sessionExpired: session.status === "expired",
    });

    return {
      sessionFound: true,
      sessionPaid,
      view,
      order: view === "confirmed" ? stored : null,
    };
  } catch {
    return {
      sessionFound: false,
      sessionPaid: false,
      view: "missing",
      order: null,
    };
  }
}

async function isStaleSessionEvent(
  session: Stripe.Checkout.Session,
): Promise<boolean> {
  const associatedId = stripeSessionOrderId(session);
  if (!associatedId || !isInternalOrderId(associatedId)) return false;
  const existing = await getOrderById(associatedId);
  if (!existing?.stripeCheckoutSessionId) return false;
  return existing.stripeCheckoutSessionId !== session.id;
}

async function requireStoredOrder(
  session: Stripe.Checkout.Session,
): Promise<Order | "stale"> {
  const order = await resolveStoredOrderForSession(session);
  if (order) return order;
  if (await isStaleSessionEvent(session)) return "stale";
  throw new Error("order_not_ready");
}

async function applyCheckoutSessionEvent(
  event: Stripe.Event,
  stripe: Stripe,
): Promise<string | null> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await requireStoredOrder(session);
      if (order === "stale") return null;
      if (session.payment_status === "paid") {
        const saved = await markOrderPaidFromSession(order, session, stripe);
        return saved.id;
      }
      const next = applyOrderStatus(
        withSessionPointers(order, session),
        "pending",
        "unpaid",
        {
          stripePaymentIntentId: paymentIntentId(session.payment_intent),
        },
      );
      await persistStatus(next, stripe);
      return next.id;
    }
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await requireStoredOrder(session);
      if (order === "stale") return null;
      const saved = await markOrderPaidFromSession(order, session, stripe);
      return saved.id;
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await requireStoredOrder(session);
      if (order === "stale") return null;
      const next = applyOrderStatus(
        withSessionPointers(order, session),
        "payment_failed",
        "failed",
        {
          stripePaymentIntentId: paymentIntentId(session.payment_intent),
        },
      );
      await persistStatus(next, stripe);
      return next.id;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const order = await requireStoredOrder(session);
      if (order === "stale") return null;
      const next = applyOrderStatus(
        withSessionPointers(order, session),
        "cancelled",
        "cancelled",
        {
          stripePaymentIntentId: paymentIntentId(session.payment_intent),
        },
      );
      await persistStatus(next, stripe);
      return next.id;
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
          if (session) order = await resolveStoredOrderForSession(session);
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
        return null;
      }
      const next = applyOrderStatus(order, "payment_failed", "failed", {
        stripePaymentIntentId: intent.id,
      });
      await persistStatus(next, stripe);
      return next.id;
    }
    default:
      return null;
  }
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("stripe_unconfigured");
  }

  const claim = await claimWebhookEvent(event.id);
  if (claim.kind === "completed") return;
  if (claim.kind === "busy") {
    throw new Error("webhook_event_busy");
  }

  try {
    const orderId = await applyCheckoutSessionEvent(event, stripe);
    const completed = await completeWebhookEvent(
      event.id,
      claim.token,
      orderId ?? undefined,
    );
    if (!completed) {
      throw new Error("webhook_event_complete_failed");
    }
  } catch (error) {
    await releaseWebhookEvent(event.id, claim.token);
    throw error;
  }
}

export async function lookupOrderForSession(
  sessionId: string,
  returnAuth?: CheckoutReturnAuth | null,
): Promise<{ order: Order | null; sessionPaid: boolean; sessionFound: boolean }> {
  const result = await confirmCheckoutReturn(sessionId, returnAuth);
  return {
    order: result.order,
    sessionFound: result.sessionFound,
    sessionPaid: result.sessionPaid,
  };
}
