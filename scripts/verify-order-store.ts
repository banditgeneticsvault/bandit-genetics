import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { withOrderDb } from "../src/lib/orders/db";
import {
  createPendingOrder,
  getOrderById,
  getReusablePendingOrder,
  isInternalOrderId,
  saveOrder,
} from "../src/lib/orders/repository";

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

function describeUrl(url: string) {
  let hostKind = "other";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".neon.tech")) hostKind = "neon.tech";
  } catch {
    hostKind = "unparseable";
  }
  return {
    present: true,
    scheme: url.startsWith("postgresql://")
      ? "postgresql"
      : url.startsWith("postgres://")
        ? "postgres"
        : "other",
    hostKind,
    length: url.length,
  };
}

async function main() {
  loadEnvLocal();

  const databaseUrl =
    process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || "";

  assert(databaseUrl, "DATABASE_URL/POSTGRES_URL missing");
  assert(
    /^postgres(ql)?:\/\//i.test(databaseUrl),
    "DATABASE_URL is not a postgres URL",
  );
  console.log("DATABASE_URL read", describeUrl(databaseUrl));

  const created = await createPendingOrder({
    customerEmail: "order-store-test@example.invalid",
    customerName: "Order Store Test",
    subtotalCents: 9000,
    shippingCents: 1200,
    taxCents: 0,
    totalCents: 10200,
    promotionStatus: "not_qualified",
    freeShipping: false,
    promotionalGiftApplied: false,
    promotionalProductId: "speeding-ticket",
    promotionalStrainName: "SPEEDING TICKET",
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
        kind: "paid",
        productId: "gorilla-heist",
        variantId: "seed-1",
        strainName: "GORILLA HEIST",
        packLabel: "1 SEED",
        seedCount: 1,
        quantity: 2,
        unitPriceCents: 1000,
        lineTotalCents: 2000,
      },
    ],
    paymentMethod: "crypto",
    status: "pending",
    paymentStatus: "unpaid",
  });

  const sql = await withOrderDb();
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'orders'
    ORDER BY table_name
  `;
  const tableNames = tables.map((row) => String(row.table_name));
  assert(tableNames.includes("orders"), "orders table missing");
  console.log("tables", tableNames);

  assert(isInternalOrderId(created.id), "created order id format");
  assert(created.status === "pending", "created status");
  assert(created.paymentStatus === "unpaid", "created payment status");
  assert(created.shippingCents === 1200, "created shipping");
  assert(created.taxCents === 0, "created tax");
  assert(created.subtotalCents === 9000, "created subtotal");
  assert(created.promotionalProductId === "speeding-ticket", "gift persisted");

  const loaded = await getOrderById(created.id);
  assert(loaded?.id === created.id, "getOrderById");
  assert(loaded?.shippingCents === 1200, "retrieved shipping");
  assert(loaded?.promotionalProductId === "speeding-ticket", "retrieved gift id");

  const reusable = await getReusablePendingOrder(created.id);
  assert(reusable?.id === created.id, "getReusablePendingOrder");

  const saved = await saveOrder({
    ...loaded,
    customerName: "Order Store Test Updated",
    totalCents: 10200,
  });
  const afterSave = await getOrderById(saved.id);
  assert(afterSave?.customerName === "Order Store Test Updated", "saveOrder");

  await sql`DELETE FROM orders WHERE id = ${created.id}`;

  const gone = await getOrderById(created.id);
  assert(!gone, "test order cleaned up");

  console.log("order repository checks passed");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "order_store_test_failed");
  process.exit(1);
});
