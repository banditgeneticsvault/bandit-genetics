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
    id: order.id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerNotes: typeof order.customerNotes === "string" ? order.customerNotes : "",
    paymentMethod: "request",
    status: order.status,
    paymentStatus: order.paymentStatus,
    currency: "usd",
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents ?? 0,
    taxCents: order.taxCents ?? 0,
    totalCents: order.totalCents,
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
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    paidAt: order.paidAt ?? null,
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
  const document = JSON.stringify(hydrateOrder(order));
  await sql`
    INSERT INTO orders (
      id,
      document,
      created_at,
      updated_at
    )
    VALUES (
      ${order.id},
      ${document}::jsonb,
      ${order.createdAt}::timestamptz,
      ${order.updatedAt}::timestamptz
    )
    ON CONFLICT (id) DO UPDATE SET
      document = EXCLUDED.document,
      updated_at = EXCLUDED.updated_at
  `;
  return hydrateOrder({ ...order, updatedAt: order.updatedAt });
}

export async function createPendingOrder(input: NewOrderInput): Promise<Order> {
  const createdAt = nowIso();
  const order: Order = {
    id: createOrderId(),
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    customerNotes: input.customerNotes?.trim() ?? "",
    paymentMethod: "request",
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
  if (order.status === "requested" || order.status === "payment_submitted") {
    return null;
  }
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sql = await withOrderDb();
  const rows = await sql`
    SELECT document FROM orders WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ? orderFromRow(rows[0].document) : null;
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
  extras: Partial<Pick<Order, "paidAt">> = {},
): Order {
  if (order.status === "paid") {
    return {
      ...hydrateOrder(order),
      updatedAt: nowIso(),
    };
  }
  if (!canTransition(order.status, status)) {
    return { ...hydrateOrder(order), updatedAt: nowIso() };
  }
  const paidAt =
    status === "paid" ? (extras.paidAt ?? nowIso()) : order.paidAt;
  return hydrateOrder({
    ...order,
    status,
    paymentStatus,
    paidAt,
    updatedAt: nowIso(),
  });
}
