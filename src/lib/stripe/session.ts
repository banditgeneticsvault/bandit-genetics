import "server-only";

import type Stripe from "stripe";
import type { ResolvedCartLine } from "@/lib/cart";
import type { Order } from "@/lib/orders/types";
import { getPublicSiteUrl, publicAssetUrl } from "@/lib/site-url";

const METADATA_CHUNK = 450;

export const STRIPE_SHIPPING_COUNTRIES = [
  "US",
  "CA",
  "MX",
  "GB",
  "IE",
  "AU",
  "NZ",
  "DE",
  "FR",
  "NL",
  "ES",
  "IT",
  "PT",
  "BE",
  "AT",
  "CH",
  "SE",
  "NO",
  "DK",
  "FI",
  "PL",
  "CZ",
  "JP",
] as const;

type Snapshot = {
  id: string;
  email: string;
  name: string;
  subtotalCents: number;
  totalCents: number;
  currency: "usd";
  lines: Array<{
    productId: string;
    variantId: string;
    strainName: string;
    packLabel: string;
    seedCount: number;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }>;
};

export function orderToSnapshot(order: Order): Snapshot {
  return {
    id: order.id,
    email: order.customerEmail,
    name: order.customerName,
    subtotalCents: order.subtotalCents,
    totalCents: order.totalCents,
    currency: order.currency,
    lines: order.lines,
  };
}

export function encodeOrderMetadata(
  order: Order,
  extras: Record<string, string> = {},
): Record<string, string> {
  const json = JSON.stringify(orderToSnapshot(order));
  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += METADATA_CHUNK) {
    chunks.push(json.slice(i, i + METADATA_CHUNK));
  }
  const metadata: Record<string, string> = {
    orderId: order.id,
    orderStatus: order.status,
    ...extras,
    sc: String(chunks.length),
  };
  chunks.forEach((chunk, index) => {
    metadata[`s${index}`] = chunk;
  });
  return metadata;
}

export function decodeOrderSnapshot(
  metadata: Stripe.Metadata | null | undefined,
): Snapshot | null {
  if (!metadata?.orderId) return null;
  const count = Number(metadata.sc ?? "0");
  if (!Number.isInteger(count) || count < 1 || count > 40) {
    return {
      id: metadata.orderId,
      email: "",
      name: "",
      subtotalCents: 0,
      totalCents: 0,
      currency: "usd",
      lines: [],
    };
  }
  let json = "";
  for (let i = 0; i < count; i += 1) {
    json += metadata[`s${i}`] ?? "";
  }
  try {
    const parsed = JSON.parse(json) as Snapshot;
    if (parsed.id !== metadata.orderId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function stripeLineItems(
  lines: ResolvedCartLine[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return lines.map((line) => {
    const image = line.image?.src ? publicAssetUrl(line.image.src) : undefined;
    const packPhrase =
      line.seedCount === 1 ? "1 seed option" : `${line.seedCount} seed option`;
    const description =
      line.quantity === 1
        ? `${packPhrase}. Price is for this option, not per seed.`
        : `${packPhrase}. ${line.quantity} of this option. Price is per option, not per seed.`;

    return {
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: line.priceCents,
        product_data: {
          name: `${line.name} — ${line.seedLabel}`,
          description,
          ...(image ? { images: [image] } : {}),
          metadata: {
            productId: line.productId,
            variantId: line.variantId,
            seedCount: String(line.seedCount),
          },
        },
      },
    };
  });
}

export function checkoutRedirectUrls() {
  const origin = getPublicSiteUrl();
  return {
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?checkout=cancelled`,
  };
}
