import "server-only";

import type Stripe from "stripe";
import type { ResolvedCartLine } from "@/lib/cart";
import type { Order, OrderLine } from "@/lib/orders/types";
import { promotionalGiftView } from "@/lib/promotional-catalog";
import { getPublicSiteUrl, publicAssetUrl } from "@/lib/site-url";
import { STANDARD_SHIPPING_CENTS } from "@/lib/shipping-promotion";

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
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  promotionStatus: "qualified" | "not_qualified";
  freeShipping: boolean;
  promotionalGiftApplied: boolean;
  promotionalProductId: string | null;
  promotionalStrainName: string | null;
  promotionalPackSize: number | null;
  promotionalQuantity: number | null;
  promotionalItemPriceCents: number;
  currency: "usd";
  lines: OrderLine[];
};

export function orderToSnapshot(order: Order): Snapshot {
  return {
    id: order.id,
    email: order.customerEmail,
    name: order.customerName,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    taxCents: order.taxCents,
    totalCents: order.totalCents,
    promotionStatus: order.promotionStatus,
    freeShipping: order.freeShipping,
    promotionalGiftApplied: order.promotionalGiftApplied,
    promotionalProductId: order.promotionalProductId,
    promotionalStrainName: order.promotionalStrainName,
    promotionalPackSize: order.promotionalPackSize,
    promotionalQuantity: order.promotionalQuantity,
    promotionalItemPriceCents: order.promotionalItemPriceCents,
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
      shippingCents: 0,
      taxCents: 0,
      totalCents: 0,
      promotionStatus: "not_qualified",
      freeShipping: false,
      promotionalGiftApplied: false,
      promotionalProductId: null,
      promotionalStrainName: null,
      promotionalPackSize: null,
      promotionalQuantity: null,
      promotionalItemPriceCents: 0,
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
            kind: "paid",
          },
        },
      },
    };
  });
}

export function stripePromotionalLineItem(
  order: Order,
): Stripe.Checkout.SessionCreateParams.LineItem | null {
  if (!order.promotionalGiftApplied || !order.promotionalProductId) return null;
  const gift = promotionalGiftView(order.promotionalProductId);
  if (!gift) return null;
  const image = gift.image?.src ? publicAssetUrl(gift.image.src) : undefined;
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: 0,
      product_data: {
        name: `FREE RANDOM 5 PACK — ${gift.name}`,
        description:
          "Complimentary promotional 5 seed pack. $0.00. Not a paid purchase.",
        ...(image ? { images: [image] } : {}),
        metadata: {
          productId: gift.productId,
          variantId: gift.variantId,
          seedCount: String(gift.seedCount),
          kind: "promotional",
          orderId: order.id,
        },
      },
    },
  };
}

export function stripeCheckoutLineItems(
  paidLines: ResolvedCartLine[],
  order: Order,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items = stripeLineItems(paidLines);
  const promotional = stripePromotionalLineItem(order);
  if (promotional) items.push(promotional);
  return items;
}

export function stripeShippingOptions(
  shippingCents: number,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const amount = shippingCents === 0 ? 0 : STANDARD_SHIPPING_CENTS;
  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount,
          currency: "usd",
        },
        display_name:
          amount === 0 ? "Free shipping" : "Standard shipping",
      },
    },
  ];
}

export function checkoutRedirectUrls() {
  const origin = getPublicSiteUrl();
  return {
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?checkout=cancelled`,
  };
}
