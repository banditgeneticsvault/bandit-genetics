import "server-only";

import { randomInt } from "node:crypto";
import type { OrderLine } from "@/lib/orders/types";
import {
  eligiblePromotionalProductIds,
  promotionalGiftView,
} from "@/lib/promotional-catalog";
import {
  assignPromotionalProductId,
  PROMOTIONAL_ITEM_PRICE_CENTS,
  PROMOTIONAL_PACK_SIZE,
  PROMOTIONAL_QUANTITY,
  PROMOTIONAL_VARIANT_ID,
} from "@/lib/shipping-promotion";

export function pickRandomEligibleProductId(eligibleProductIds: string[]) {
  if (eligibleProductIds.length === 0) {
    throw new Error("promotional_catalog_empty");
  }
  return eligibleProductIds[randomInt(0, eligibleProductIds.length)]!;
}

export function resolvePromotionalAssignment(input: {
  qualified: boolean;
  persistedProductId: string | null;
}) {
  const eligibleProductIds = eligiblePromotionalProductIds();
  return assignPromotionalProductId({
    qualified: input.qualified,
    persistedProductId: input.persistedProductId,
    eligibleProductIds,
    pick: pickRandomEligibleProductId,
  });
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
