import "server-only";

import type { OrderLine } from "@/lib/orders/types";
import {
  eligiblePromotionalProductIds,
  isEligiblePromotionalProductId,
  parsePromotionalProductIdInput,
  promotionalGiftView,
} from "@/lib/promotional-catalog";
import {
  assignPromotionalProductId,
  PROMOTIONAL_ITEM_PRICE_CENTS,
  PROMOTIONAL_PACK_SIZE,
  PROMOTIONAL_QUANTITY,
  PROMOTIONAL_VARIANT_ID,
} from "@/lib/shipping-promotion";

export function resolvePromotionalAssignment(input: {
  qualified: boolean;
  persistedProductId: string | null;
  requestedProductId?: string | null;
}) {
  const eligibleProductIds = eligiblePromotionalProductIds();
  if (input.qualified && eligibleProductIds.length === 0) {
    throw new Error("promotional_catalog_empty");
  }
  return assignPromotionalProductId({
    qualified: input.qualified,
    persistedProductId: input.persistedProductId,
    requestedProductId: input.requestedProductId ?? null,
    eligibleProductIds,
  });
}

export function promotionalProductRequestFromUnknown(value: unknown):
  | { ok: true; productId: string | null }
  | { ok: false; reason: "invalid_promotional_product" } {
  const parsed = parsePromotionalProductIdInput(value);
  if (parsed.status === "omitted") {
    return { ok: true, productId: null };
  }
  if (parsed.status === "invalid") {
    return { ok: false, reason: "invalid_promotional_product" };
  }
  if (!isEligiblePromotionalProductId(parsed.productId)) {
    return { ok: false, reason: "invalid_promotional_product" };
  }
  return { ok: true, productId: parsed.productId };
}

export function promotionalOrderLine(productId: string): OrderLine | null {
  const gift = promotionalGiftView(productId);
  if (!gift) return null;
  return {
    kind: "promotional",
    productId: gift.productId,
    variantId: PROMOTIONAL_VARIANT_ID,
    strainName: gift.name,
    packLabel: gift.seedLabel,
    seedCount: PROMOTIONAL_PACK_SIZE,
    quantity: PROMOTIONAL_QUANTITY,
    unitPriceCents: PROMOTIONAL_ITEM_PRICE_CENTS,
    lineTotalCents: PROMOTIONAL_ITEM_PRICE_CENTS,
  };
}

export function paidOrderLines(lines: OrderLine[]): OrderLine[] {
  return lines.filter((line) => line.kind !== "promotional");
}
