import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NewOrderInput, Order, OrderPaymentStatus, OrderStatus } from "./types";

type StoreFile = {
  orders: Record<string, Order>;
  events: Record<string, { receivedAt: string; orderId?: string }>;
};

const EMPTY: StoreFile = { orders: {}, events: {} };

function storePath() {
  return path.join(process.cwd(), ".data", "orders.json");
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(storePath(), "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || typeof parsed !== "object") return { ...EMPTY };
    return {
      orders: Object.fromEntries(
        Object.entries(parsed.orders ?? {}).map(([id, order]) => [
          id,
          hydrateOrder(order),
        ]),
      ),
      events: parsed.events ?? {},
    };
  } catch {
    return { ...EMPTY, orders: {}, events: {} };
  }
}

async function writeStore(store: StoreFile): Promise<boolean> {
  try {
    const dir = path.dirname(storePath());
    await mkdir(dir, { recursive: true });
    await writeFile(storePath(), JSON.stringify(store), "utf8");
    return true;
  } catch (error) {
    console.error("order_store_write_failed", {
      code: error instanceof Error ? error.name : "unknown",
    });
    return false;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function hydrateOrder(order: Order): Order {
  return {
    ...order,
    paymentMethod: order.paymentMethod === "crypto" ? "crypto" : "card",
    cryptocurrency: order.cryptocurrency ?? null,
    receivingAddress: order.receivingAddress ?? null,
    transactionHash: order.transactionHash ?? null,
  };
}

export function createOrderId() {
  return `bg_${randomUUID()}`;
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
    totalCents: input.totalCents,
    lines: input.lines,
    createdAt,
    updatedAt: createdAt,
    paidAt: null,
  };
  const store = await readStore();
  store.orders[order.id] = order;
  await writeStore(store);
  return order;
}

export async function saveOrder(order: Order): Promise<Order> {
  const next = { ...order, updatedAt: nowIso() };
  const store = await readStore();
  store.orders[next.id] = next;
  await writeStore(store);
  return next;
}

export function isInternalOrderId(value: string) {
  return /^bg_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  const store = await readStore();
  return store.orders[id] ?? null;
}

export async function getOrderBySessionId(
  sessionId: string,
): Promise<Order | null> {
  const store = await readStore();
  return (
    Object.values(store.orders).find(
      (order) => order.stripeCheckoutSessionId === sessionId,
    ) ?? null
  );
}

export async function getOrderByPaymentIntentId(
  paymentIntentId: string,
): Promise<Order | null> {
  const store = await readStore();
  return (
    Object.values(store.orders).find(
      (order) => order.stripePaymentIntentId === paymentIntentId,
    ) ?? null
  );
}

export async function attachStripeSession(
  orderId: string,
  sessionId: string,
): Promise<Order | null> {
  const store = await readStore();
  const order = store.orders[orderId];
  if (!order) return null;
  const next: Order = {
    ...order,
    stripeCheckoutSessionId: sessionId,
    updatedAt: nowIso(),
  };
  store.orders[orderId] = next;
  await writeStore(store);
  return next;
}

export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  const store = await readStore();
  return Boolean(store.events[eventId]);
}

export async function markProcessedEvent(
  eventId: string,
  orderId?: string,
): Promise<void> {
  const store = await readStore();
  store.events[eventId] = { receivedAt: nowIso(), orderId };
  await writeStore(store);
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
