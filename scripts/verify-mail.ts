import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { orderNotificationText } from "../src/lib/order-notify.ts";
import { sendBanditMail } from "../src/lib/mail.ts";
import type { Order } from "../src/lib/orders/types.ts";

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

function sampleOrder(): Order {
  const now = new Date().toISOString();
  return {
    id: "bg_00000000-0000-4000-8000-000000000001",
    customerEmail: "mail-verify@example.com",
    customerName: "Mail Verify",
    customerNotes: "Leave at the side gate.",
    paymentMethod: "request",
    status: "requested",
    paymentStatus: "unpaid",
    currency: "usd",
    subtotalCents: 4500,
    shippingCents: 1200,
    taxCents: 0,
    totalCents: 5700,
    promotionStatus: "not_qualified",
    freeShipping: false,
    promotionalGiftApplied: false,
    promotionalProductId: null,
    promotionalStrainName: null,
    promotionalPackSize: null,
    promotionalQuantity: null,
    promotionalItemPriceCents: 0,
    lines: [
      {
        kind: "paid",
        productId: "gorilla-heist",
        variantId: "seed-1",
        strainName: "GORILLA HEIST",
        packLabel: "1 SEED",
        seedCount: 1,
        quantity: 1,
        unitPriceCents: 1000,
        lineTotalCents: 1000,
      },
      {
        kind: "paid",
        productId: "vault-robbery",
        variantId: "seed-5",
        strainName: "VAULT ROBBERY",
        packLabel: "5 SEEDS",
        seedCount: 5,
        quantity: 1,
        unitPriceCents: 3500,
        lineTotalCents: 3500,
      },
    ],
    createdAt: now,
    updatedAt: now,
    paidAt: null,
  };
}

async function main() {
  const mode = process.argv[2] ?? "content";

  if (mode === "missing-env") {
    loadEnvLocal();
    delete process.env.CONTACT_SMTP_USER;
    delete process.env.CONTACT_SMTP_PASSWORD;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
    const result = await sendBanditMail({
      replyTo: "mail-verify@example.com",
      subject: "Missing env check",
      text: "missing",
      html: "<p>missing</p>",
    });
    assert(!result.ok && result.reason === "unconfigured", "missing env must be unconfigured");
    console.log("missing env check passed");
    return;
  }

  loadEnvLocal();

  if (mode === "content") {
    const text = orderNotificationText(sampleOrder());
    assert(text.includes("Mail Verify"), "customer name");
    assert(text.includes("mail-verify@example.com"), "customer email");
    assert(text.includes("GORILLA HEIST"), "product");
    assert(text.includes("1 SEED"), "variant");
    assert(text.includes("× 1"), "quantity");
    assert(text.includes("VAULT ROBBERY"), "second product");
    assert(text.includes("$45.00"), "authoritative subtotal");
    assert(text.includes("bg_00000000-0000-4000-8000-000000000001"), "order id");
    assert(text.includes("Order request"), "payment method");
    assert(text.includes("requested"), "order status");
    assert(!text.includes("banditgeneticsvault@proton.me"), "no legacy proton recipient in body");
    console.log("order notification content checks passed");
    return;
  }

  if (mode === "send") {
    const result = await sendBanditMail({
      replyTo: "mail-verify@example.com",
      subject: "Bandit Genetics mail path test",
      text: [
        "This is a controlled mail-path test.",
        "It is not a customer order and did not charge anyone.",
        "If you received this at support@banditgenetics.com, SMTP delivery works.",
      ].join("\n"),
      html: "<p>This is a controlled mail-path test. It is not a customer order.</p>",
    });
    if (!result.ok) {
      throw new Error(`mail send failed: ${result.reason}`);
    }
    console.log("mail send accepted");
    return;
  }

  throw new Error(`unknown mode: ${mode}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "verify_mail_failed");
  process.exit(1);
});
