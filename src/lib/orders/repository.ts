import "server-only";

import { randomUUID } from "node:crypto";
import { withOrderDb } from "@/lib/orders/db";
import type { NewOrderInput, Order, OrderPaymentStatus, OrderStatus } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function hydrateOrder(order: Order): Order {
  const promotionalProductId = order.promotionalProductId ?? null;
  const promotionalGiftApplied = Boolean(order.promotionalGiftApplied);
  return {
    ...order,
    paymentMethod: order.paymentMethod === "crypto" ? "crypto" : "card",
    cryptocurrency: order.cryptocurrency ?? null,
    receivingAddress: order.receivingAddress ?? null,
    transactionHash: order.transactionHash ?? null,
    shippingCents: order.shippingCents ?? 0,
    taxCents: order.taxCents ?? 0,
    promotionStatus: order.promotionStatus === "qualified" ? "qualified" : "not_qualified",
    freeShipping: Boolean(order.freeShipping),
    promotionalGiftApplied,
    promotionalProductId,
    promotionalStrainName: order.promotionalStrainName ?? null,
    promotionalPackSize: order.promotionalPackSize ?? null,
    promotionalQuantity: order.promotionalQuantity ?? null,
    promotionalItemPriceCents: order.promotionalItemPriceCents ?? 0,
    lines: (order.lines ?? []).map((line) => ({
      ...line,
      kind: line.kind === "promotional" ? "promotional" : "paid",
    })),
  };
}

function orderFromRow(document: unknown): Order | null {
  if (!document || typeof document !== "object") return null;
  return hydrateOrder(document as Order);
}

export function createOrderId() {
  return `bg_${randomUUID()}`;
}

export function isInternalOrderId(value: string) {
  return /^bg_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function persistOrder(order: Order): Promise<Order> {
  const sql = await withOrderDb();
  const document = JSON.stringify(order);
  await sql`
    INSERT INTO orders (
      id,
      stripe_checkout_session_id,
      stripe_payment_intent_id,
      document,
      created_at,
      updated_at
    )
    VALUES (
      ${order.id},
      ${order.stripeCheckoutSessionId},
      ${order.stripePaymentIntentId},
      ${document}::jsonb,
      ${order.createdAt}::timestamptz,
      ${order.updatedAt}::timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
      stripe_checkout_session_id = EXCLUDED.stripe_checkout_session_id,
      stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
      document = EXCLUDED.document,
      updated_at = EXCLUDED.updated_at
  `;
  return order;
}

export async function createPendingOrder(input: NewOrderInput): Promise<Order> {
  const createdAt = nowIso();
  const order: Order = {
    id: createOrderId(),
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    paymentMethod: input.paymentMethod ?? "card",
    cryptocurrency: input.cryptocurrency ?? null,
    receivingAddress: input.receivingAddress ?? null,
    transactionHash: input.transactionHash ?? null,
    status: input.status ?? "pending",
    paymentStatus: input.paymentStatus ?? "unpaid",
    currency: "usd",
    subtotalCents: input.subtotalCents,
    shippingCents: input.shippingCents ?? 0,
    taxCents: input.taxCents ?? 0,
    totalCents: input.totalCents,
    promotionStatus: input.promotionStatus ?? "not_qualified",
    freeShipping: input.freeShipping ?? false,
    promotionalGiftApplied: input.promotionalGiftApplied ?? false,
    promotionalProductId: input.promotionalProductId ?? null,
    promotionalStrainName: input.promotionalStrainName ?? null,
    promotionalPackSize: input.promotionalPackSize ?? null,
    promotionalQuantity: input.promotionalQuantity ?? null,
    promotionalItemPriceCents: input.promotionalItemPriceCents ?? 0,
    lines: input.lines,
    createdAt,
    updatedAt: createdAt,
    paidAt: null,
  };
  return persistOrder(order);
}

export async function saveOrder(order: Order): Promise<Order> {
  return persistOrder({ ...order, updatedAt: nowIso() });
}

export async function getReusablePendingOrder(
  id: string | null | undefined,
): Promise<Order | null> {
  if (!id || !isInternalOrderId(id)) return null;
  const order = await getOrderById(id);
  if (!order) return null;
  if (order.status === "paid" || order.paymentStatus === "paid") return null;
  if (order.status === "payment_submitted") return null;
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sql = await withOrderDb();
  const rows = await sql`
    SELECT document FROM orders WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ? orderFromRow(rows[0].document) : null;
}

export async function getOrderBySessionId(
  sessionId: string,
): Promise<Order | null> {
  const sql = await withOrderDb();
  const rows = await sql`
    SELECT document
    FROM orders
    WHERE stripe_checkout_session_id = ${sessionId}
    LIMIT 1
  `;
  return rows[0] ? orderFromRow(rows[0].document) : null;
}

export async function getOrderByPaymentIntentId(
  paymentIntentId: string,
): Promise<Order | null> {
  const sql = await withOrderDb();
  const rows = await sql`
    SELECT document
    FROM orders
    WHERE stripe_payment_intent_id = ${paymentIntentId}
    LIMIT 1
  `;
  return rows[0] ? orderFromRow(rows[0].document) : null;
}

export async function attachStripeSession(
  orderId: string,
  sessionId: string,
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;
  return saveOrder({
    ...order,
    stripeCheckoutSessionId: sessionId,
  });
}

export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  const sql = await withOrderDb();
  const rows = await sql`
    SELECT event_id FROM stripe_webhook_events WHERE event_id = ${eventId} LIMIT 1
  `;
  return rows.length > 0;
}

export async function markProcessedEvent(
  eventId: string,
  orderId?: string,
): Promise<void> {
  const sql = await withOrderDb();
  await sql`
    INSERT INTO stripe_webhook_events (event_id, order_id, received_at)
    VALUES (${eventId}, ${orderId ?? null}, ${nowIso()}::timestamptz)
    ON CONFLICT (event_id) DO NOTHING
  `;
}

export function canTransition(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  if (current === next) return true;
  if (current === "paid") return false;
  if (next === "paid") return true;
  if (current === "cancelled" && next === "payment_failed") return false;
  if (current === "payment_failed" && next === "cancelled") return false;
  return true;
}

export function applyOrderStatus(
  order: Order,
  status: OrderStatus,
  paymentStatus: OrderPaymentStatus,
  extras: Partial<Pick<Order, "stripePaymentIntentId" | "paidAt">> = {},
): Order {
  if (order.status === "paid") {
    return {
      ...order,
      stripePaymentIntentId:
        extras.stripePaymentIntentId ?? order.stripePaymentIntentId,
      updatedAt: nowIso(),
    };
  }
  if (!canTransition(order.status, status)) {
    return { ...order, updatedAt: nowIso() };
  }
  const paidAt =
    status === "paid" ? (extras.paidAt ?? nowIso()) : order.paidAt;
  return {
    ...order,
    status,
    paymentStatus,
    stripePaymentIntentId:
      extras.stripePaymentIntentId ?? order.stripePaymentIntentId,
    paidAt,
    updatedAt: nowIso(),
  };
}
