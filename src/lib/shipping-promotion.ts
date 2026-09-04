export const PROMOTION_THRESHOLD_CENTS = 10000;
export const STANDARD_SHIPPING_CENTS = 1200;
export const PROMOTIONAL_PACK_SIZE = 5;
export const PROMOTIONAL_QUANTITY = 1;
export const PROMOTIONAL_VARIANT_ID = "seed-5" as const;
export const PROMOTIONAL_ITEM_PRICE_CENTS = 0;

export type PromotionStatus = "qualified" | "not_qualified";

export type ShippingPromotionQuote = {
  promotionStatus: PromotionStatus;
  merchandiseSubtotalCents: number;
  shippingCents: number;
  taxCents: number;
  promotionalItemPriceCents: number;
  remainingCents: number;
  freeShipping: boolean;
  promotionalGiftApplied: boolean;
  totalCents: number;
};

function asCents(value: number) {
  if (!Number.isInteger(value) || value < 0) return 0;
  return value;
}

export function qualifiesForShippingPromotion(
  merchandiseSubtotalCents: number,
) {
  return asCents(merchandiseSubtotalCents) >= PROMOTION_THRESHOLD_CENTS;
}

export function shippingCentsForMerchandise(
  merchandiseSubtotalCents: number,
) {
  return qualifiesForShippingPromotion(merchandiseSubtotalCents)
    ? 0
    : STANDARD_SHIPPING_CENTS;
}

export function remainingCentsForPromotion(
  merchandiseSubtotalCents: number,
) {
  const paid = asCents(merchandiseSubtotalCents);
  if (paid >= PROMOTION_THRESHOLD_CENTS) return 0;
  return PROMOTION_THRESHOLD_CENTS - paid;
}

export function quoteShippingPromotion(
  merchandiseSubtotalCents: number,
  taxCents = 0,
): ShippingPromotionQuote {
  const merchandise = asCents(merchandiseSubtotalCents);
  const tax = asCents(taxCents);
  const qualified = qualifiesForShippingPromotion(merchandise);
  const shippingCents = shippingCentsForMerchandise(merchandise);
  return {
    promotionStatus: qualified ? "qualified" : "not_qualified",
    merchandiseSubtotalCents: merchandise,
    shippingCents,
    taxCents: tax,
    promotionalItemPriceCents: PROMOTIONAL_ITEM_PRICE_CENTS,
    remainingCents: remainingCentsForPromotion(merchandise),
    freeShipping: qualified,
    promotionalGiftApplied: qualified,
    totalCents: merchandise + shippingCents + tax + PROMOTIONAL_ITEM_PRICE_CENTS,
  };
}

export function formatPromotionProgress(
  merchandiseSubtotalCents: number,
  formatUsd: (cents: number) => string,
  copy: { spendMoreForPromotion: string; promotionUnlocked: string },
) {
  if (qualifiesForShippingPromotion(merchandiseSubtotalCents)) {
    return copy.promotionUnlocked;
  }
  return copy.spendMoreForPromotion.replace(
    "{amount}",
    formatUsd(remainingCentsForPromotion(merchandiseSubtotalCents)),
  );
}

export function assignPromotionalProductId(input: {
  qualified: boolean;
  persistedProductId: string | null;
  eligibleProductIds: string[];
  pick: (eligibleProductIds: string[]) => string;
}): { applied: boolean; productId: string | null } {
  const eligible = input.eligibleProductIds.filter(Boolean);
  const persisted =
    input.persistedProductId && eligible.includes(input.persistedProductId)
      ? input.persistedProductId
      : input.persistedProductId && !eligible.includes(input.persistedProductId)
        ? null
        : input.persistedProductId;

  if (!input.qualified) {
    return {
      applied: false,
      productId: persisted,
    };
  }

  if (eligible.length === 0) {
    return { applied: false, productId: persisted };
  }

  if (persisted && eligible.includes(persisted)) {
    return { applied: true, productId: persisted };
  }

  return { applied: true, productId: input.pick(eligible) };
}
