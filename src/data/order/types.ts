export const ORDER_STATES = [
  "AVAILABLE",
  "LOW_STOCK",
  "SOLD_OUT",
  "COMING_SOON",
  "INQUIRY_ONLY",
] as const;

export type OrderState = (typeof ORDER_STATES)[number];

export const VARIANT_IDS = ["seed-1", "seed-2", "seed-3", "seed-5"] as const;
export type VariantId = (typeof VARIANT_IDS)[number];
/** @deprecated Use VariantId. */
export type PackId = VariantId;

export type SeedTier = {
  id: VariantId;
  seeds: number;
  label: string;
  /** Package price for this seed option. */
  priceCents: number;
  /** Display per-seed amount for this option. */
  perSeedCents: number;
  /** Savings versus buying that many seeds at the 1-seed price. */
  saveCents?: number;
};

/** @deprecated Use SeedTier. */
export type PackOption = SeedTier;

export type OrderListing = {
  productId: string;
  slug: string;
  name: string;
  type: string;
  lineage: string;
  orderState: OrderState;
  seedTiers: SeedTier[];
  /** @deprecated Use seedTiers. */
  packOptions: SeedTier[];
};

export type CartLine = {
  productId: string;
  variantId: VariantId;
  /** Number of this seed option in the cart. Distinct from seeds in the option. */
  quantity: number;
};
