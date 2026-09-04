import { getStrainById } from "@/data/genetics";
import {
  canAddToCart,
  getOrderListings,
  type OrderListing,
} from "@/data/order";
import { pickVaultImage } from "@/lib/artwork";
import type { StrainImage, StrainTheme } from "@/data/genetics/types";
import {
  PROMOTIONAL_PACK_SIZE,
  PROMOTIONAL_QUANTITY,
  PROMOTIONAL_VARIANT_ID,
} from "@/lib/shipping-promotion";

export type PromotionalGiftView = {
  productId: string;
  slug: string;
  name: string;
  variantId: typeof PROMOTIONAL_VARIANT_ID;
  seedCount: number;
  seedLabel: "5 SEEDS";
  quantity: number;
  priceCents: 0;
  lineTotalCents: 0;
  image?: StrainImage;
  theme: StrainTheme;
};

/**
 * Complimentary packs use the same purchase eligibility as the storefront cart.
 * Unavailable / inquiry-only / sold-out files cannot be purchased, so they
 * cannot be awarded. Missing identifiers or artwork are excluded.
 */
export function eligiblePromotionalListings(): OrderListing[] {
  return getOrderListings().filter((listing) => {
    if (!listing.productId) return false;
    if (!canAddToCart(listing.orderState)) return false;
    const strain = getStrainById(listing.productId);
    if (!strain) return false;
    const image = pickVaultImage(strain);
    return Boolean(image?.src);
  });
}

export function eligiblePromotionalProductIds(): string[] {
  return eligiblePromotionalListings().map((listing) => listing.productId);
}

export function isEligiblePromotionalProductId(productId: string) {
  return eligiblePromotionalProductIds().includes(productId);
}

export function parsePromotionalProductIdInput(
  value: unknown,
):
  | { status: "omitted" }
  | { status: "invalid" }
  | { status: "value"; productId: string } {
  if (value === undefined || value === null) return { status: "omitted" };
  if (typeof value !== "string") return { status: "invalid" };
  const productId = value.trim();
  if (!productId) return { status: "omitted" };
  if (productId.length > 80) return { status: "invalid" };
  return { status: "value", productId };
}

export function promotionalGiftView(
  productId: string,
): PromotionalGiftView | null {
  const listing = eligiblePromotionalListings().find(
    (item) => item.productId === productId,
  );
  if (!listing) return null;
  const strain = getStrainById(listing.productId);
  if (!strain) return null;
  const image = pickVaultImage(strain);
  if (!image?.src) return null;
  return {
    productId: listing.productId,
    slug: listing.slug,
    name: listing.name,
    variantId: PROMOTIONAL_VARIANT_ID,
    seedCount: PROMOTIONAL_PACK_SIZE,
    seedLabel: "5 SEEDS",
    quantity: PROMOTIONAL_QUANTITY,
    priceCents: 0,
    lineTotalCents: 0,
    image,
    theme: strain.theme,
  };
}
