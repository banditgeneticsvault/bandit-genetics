import "server-only";

import type { CartLine } from "@/data/order";
import type { ResolvedCartLine } from "@/lib/cart";
import { validateCheckoutCart } from "@/lib/checkout-cart";
import {
  readPendingOrderCookie,
  writePendingOrderCookie,
} from "@/lib/orders/pending-cookie";
import {
  createPendingOrder,
  getReusablePendingOrder,
  saveOrder,
} from "@/lib/orders/repository";
import type { Order, OrderLine } from "@/lib/orders/types";
import { promotionalGiftView } from "@/lib/promotional-catalog";
import {
  promotionalOrderLine,
  promotionalProductRequestFromUnknown,
  resolvePromotionalAssignment,
} from "@/lib/promotional-gift";
import { quoteShippingPromotion } from "@/lib/shipping-promotion";

export type CheckoutPromotionQuote = {
  orderId: string;
  merchandiseSubtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  promotionStatus: "qualified" | "not_qualified";
  remainingCents: number;
  freeShipping: boolean;
  promotionalGiftApplied: boolean;
  gift: ReturnType<typeof promotionalGiftView>;
};

function paidLinesFromResolved(lines: ResolvedCartLine[]): OrderLine[] {
  return lines.map((line) => ({
    kind: "paid" as const,
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

export async function syncCheckoutPromotion(input: {
  items: CartLine[];
  name?: string;
  email?: string;
  promotionalProductId?: unknown;
  requireGiftIfQualified?: boolean;
}): Promise<
  | { ok: true; quote: CheckoutPromotionQuote; order: Order; lines: ResolvedCartLine[] }
  | {
      ok: false;
      reason:
        | "empty"
        | "invalid_cart"
        | "promotional_catalog_empty"
        | "invalid_promotional_product"
        | "gift_required";
    }
> {
  if (input.items.length === 0) {
    return { ok: false, reason: "empty" };
  }

  const cart = validateCheckoutCart(input.items);
  if (!cart.ok) {
    if (cart.reason === "empty") return { ok: false, reason: "empty" };
    return { ok: false, reason: "invalid_cart" };
  }

  const requested = promotionalProductRequestFromUnknown(
    input.promotionalProductId,
  );
  if (!requested.ok) {
    return { ok: false, reason: "invalid_promotional_product" };
  }

  const quote = quoteShippingPromotion(cart.subtotalCents, 0);
  const existing = await getReusablePendingOrder(await readPendingOrderCookie());
  const qualified = quote.promotionStatus === "qualified";
  let assignment;
  try {
    assignment = resolvePromotionalAssignment({
      qualified,
      persistedProductId: existing?.promotionalProductId ?? null,
      requestedProductId: requested.productId,
    });
  } catch {
    return { ok: false, reason: "promotional_catalog_empty" };
  }

  const giftLine =
    assignment.applied && assignment.productId
      ? promotionalOrderLine(assignment.productId)
      : null;
  if (qualified && assignment.applied && !giftLine) {
    return { ok: false, reason: "promotional_catalog_empty" };
  }
  if (input.requireGiftIfQualified && qualified && !giftLine) {
    return { ok: false, reason: "gift_required" };
  }

  const assignedView = assignment.productId
    ? promotionalGiftView(assignment.productId)
    : null;
  const giftView = assignment.applied ? assignedView : null;
  const paidLines = paidLinesFromResolved(cart.lines);
  const lines = giftLine ? [...paidLines, giftLine] : paidLines;
  const customerName = input.name?.trim() || existing?.customerName || "";
  const customerEmail = input.email?.trim() || existing?.customerEmail || "";

  const fields = {
    customerEmail,
    customerName,
    subtotalCents: quote.merchandiseSubtotalCents,
    shippingCents: quote.shippingCents,
    taxCents: quote.taxCents,
    totalCents: quote.totalCents,
    promotionStatus: quote.promotionStatus,
    freeShipping: quote.freeShipping,
    promotionalGiftApplied: Boolean(giftLine),
    promotionalProductId: assignment.productId,
    promotionalStrainName:
      assignedView?.name ?? existing?.promotionalStrainName ?? null,
    promotionalPackSize: giftLine
      ? giftLine.seedCount
      : (existing?.promotionalPackSize ?? null),
    promotionalQuantity: giftLine
      ? giftLine.quantity
      : (existing?.promotionalQuantity ?? null),
    promotionalItemPriceCents: giftLine ? giftLine.unitPriceCents : 0,
    lines,
  };

  const order = existing
    ? await saveOrder({
        ...existing,
        ...fields,
        paymentMethod: "request",
      })
    : await createPendingOrder({
        ...fields,
        paymentMethod: "request",
        status: "pending",
        paymentStatus: "unpaid",
      });

  await writePendingOrderCookie(order.id);

  return {
    ok: true,
    lines: cart.lines,
    order,
    quote: {
      orderId: order.id,
      merchandiseSubtotalCents: quote.merchandiseSubtotalCents,
      shippingCents: quote.shippingCents,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
      promotionStatus: quote.promotionStatus,
      remainingCents: quote.remainingCents,
      freeShipping: quote.freeShipping,
      promotionalGiftApplied: Boolean(giftLine),
      gift: giftView,
    },
  };
}

export function publicQuotePayload(quote: CheckoutPromotionQuote) {
  return {
    merchandiseSubtotalCents: quote.merchandiseSubtotalCents,
    shippingCents: quote.shippingCents,
    taxCents: quote.taxCents,
    totalCents: quote.totalCents,
    promotionStatus: quote.promotionStatus,
    remainingCents: quote.remainingCents,
    freeShipping: quote.freeShipping,
    promotionalGiftApplied: quote.promotionalGiftApplied,
    gift: quote.gift
      ? {
          productId: quote.gift.productId,
          slug: quote.gift.slug,
          name: quote.gift.name,
          variantId: quote.gift.variantId,
          seedCount: quote.gift.seedCount,
          seedLabel: quote.gift.seedLabel,
          quantity: quote.gift.quantity,
          priceCents: quote.gift.priceCents,
          lineTotalCents: quote.gift.lineTotalCents,
          image: quote.gift.image,
          theme: quote.gift.theme,
        }
      : null,
  };
}
