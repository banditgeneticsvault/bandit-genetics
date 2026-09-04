import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { withOrderDb } from "../src/lib/orders/db";
import {
  applyOrderStatus,
  claimWebhookEvent,
  completeWebhookEvent,
  createPendingOrder,
  getOrderById,
  hasProcessedEvent,
  releaseWebhookEvent,
  saveOrder,
} from "../src/lib/orders/repository";
import type { Order } from "../src/lib/orders/types";

function loadEnvLocal() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function giftCount(order: Order | null) {
  return (order?.lines ?? []).filter((line) => line.kind === "promotional")
    .length;
}

async function runClaimedWork(
  eventId: string,
  orderId: string,
  work: () => Promise<void>,
): Promise<"done" | "busy" | "completed"> {
  const claim = await claimWebhookEvent(eventId);
  if (claim.kind !== "claimed") return claim.kind;
  try {
    await work();
    const completed = await completeWebhookEvent(eventId, claim.token, orderId);
    if (!completed) throw new Error("complete_failed");
    return "done";
  } catch (error) {
    await releaseWebhookEvent(eventId, claim.token);
    throw error;
  }
}

async function main() {
  loadEnvLocal();
  assert(
    process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim(),
    "DATABASE_URL/POSTGRES_URL missing",
  );

  const created = await createPendingOrder({
    customerEmail: "webhook-race@example.invalid",
    customerName: "Webhook Race",
    subtotalCents: 10000,
    shippingCents: 0,
    taxCents: 0,
    totalCents: 10000,
    promotionStatus: "qualified",
    freeShipping: true,
    promotionalGiftApplied: true,
    promotionalProductId: "gorilla-heist",
    promotionalStrainName: "GORILLA HEIST",
    promotionalPackSize: 5,
    promotionalQuantity: 1,
    promotionalItemPriceCents: 0,
    lines: [
      {
        kind: "paid",
        productId: "getaway-girl",
        variantId: "seed-5",
        strainName: "GETAWAY GIRL",
        packLabel: "5 SEEDS",
        seedCount: 5,
        quantity: 2,
        unitPriceCents: 3500,
        lineTotalCents: 7000,
      },
      {
        kind: "promotional",
        productId: "gorilla-heist",
        variantId: "seed-5",
        strainName: "GORILLA HEIST",
        packLabel: "5 SEEDS",
        seedCount: 5,
        quantity: 1,
        unitPriceCents: 0,
        lineTotalCents: 0,
      },
    ],
    paymentMethod: "card",
    status: "pending",
    paymentStatus: "unpaid",
  });

  const sql = await withOrderDb();
  const suffix = created.id.slice(3, 11);
  const concurrentEvent = `evt_race_${suffix}`;
  const retryEvent = `evt_retry_${suffix}`;
  let mutations = 0;

  async function markPaidOnce() {
    mutations += 1;
    const current = await getOrderById(created.id);
    assert(current, "order exists during webhook work");
    if (giftCount(current) !== 1) {
      throw new Error("gift already duplicated");
    }
    const paid = applyOrderStatus(current, "paid", "paid");
    await saveOrder({
      ...paid,
      lines: [
        ...paid.lines,
        // A buggy duplicate handler would append another gift. The claim
        // must ensure this body cannot run twice for the same event.
      ],
    });
  }

  const concurrent = await Promise.all(
    Array.from({ length: 8 }, () =>
      runClaimedWork(concurrentEvent, created.id, markPaidOnce).catch(
        (error: unknown) =>
          error instanceof Error ? error.message : "failed",
      ),
    ),
  );

  const doneCount = concurrent.filter((result) => result === "done").length;
  const blockedCount = concurrent.filter(
    (result) => result === "busy" || result === "completed",
  ).length;
  assert(doneCount === 1, "exactly one concurrent worker completes");
  assert(blockedCount === 7, "other concurrent workers do not mutate");
  assert(mutations === 1, "order mutation ran once");
  assert(await hasProcessedEvent(concurrentEvent), "event marked completed");

  const afterConcurrent = await getOrderById(created.id);
  assert(afterConcurrent?.status === "paid", "order paid once");
  assert(giftCount(afterConcurrent) === 1, "still one promotional gift");
  assert(
    afterConcurrent?.lines.filter((line) => line.kind !== "promotional")
      .length === 1,
    "paid lines not duplicated",
  );

  const duplicate = await runClaimedWork(concurrentEvent, created.id, markPaidOnce);
  assert(duplicate === "completed", "duplicate after success is a no-op");
  assert(mutations === 1, "duplicate does not mutate again");

  let attempts = 0;
  const failing = runClaimedWork(retryEvent, created.id, async () => {
    attempts += 1;
    throw new Error("forced_failure");
  });
  await assertRejects(failing, "forced_failure");
  assert(!(await hasProcessedEvent(retryEvent)), "failed event remains retryable");
  assert(attempts === 1, "failed attempt recorded");

  const retried = await runClaimedWork(retryEvent, created.id, markPaidOnce);
  assert(retried === "done", "retry after failure processes once");
  assert(attempts === 1, "failure path did not count as success mutation");
  assert(mutations === 2, "retry mutation ran once");
  assert(await hasProcessedEvent(retryEvent), "retried event completed");
  const afterRetry = await getOrderById(created.id);
  assert(giftCount(afterRetry) === 1, "retry did not duplicate gift");

  await sql`DELETE FROM stripe_webhook_events WHERE event_id = ${concurrentEvent}`;
  await sql`DELETE FROM stripe_webhook_events WHERE event_id = ${retryEvent}`;
  await sql`DELETE FROM orders WHERE id = ${created.id}`;
  console.log("webhook idempotency checks passed");
}

async function assertRejects(promise: Promise<unknown>, message: string) {
  try {
    await promise;
  } catch (error) {
    if (error instanceof Error && error.message === message) return;
    throw error;
  }
  throw new Error(`expected failure: ${message}`);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "webhook_idempotency_test_failed",
  );
  process.exit(1);
});
