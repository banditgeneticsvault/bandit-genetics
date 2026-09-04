import type { SeedTier, VariantId } from "./types";

/**
 * Authoritative seed-quantity pricing for every strain.
 * Totals are tier prices, not $10 × seed count.
 */
export const SEED_TIERS: SeedTier[] = [
  { id: "seed-1", seeds: 1, label: "1 SEED", priceCents: 1000 },
  { id: "seed-2", seeds: 2, label: "2 SEEDS", priceCents: 1500 },
  { id: "seed-3", seeds: 3, label: "3 SEEDS", priceCents: 2500 },
  { id: "seed-5", seeds: 5, label: "5 SEEDS", priceCents: 3500 },
];

/** @deprecated Use SEED_TIERS. */
export const PACK_OPTIONS = SEED_TIERS;

export function getSeedTier(id: string): SeedTier | undefined {
  return SEED_TIERS.find((tier) => tier.id === id);
}

/** @deprecated Use getSeedTier. */
export const getPackOption = getSeedTier;

export function isVariantId(value: string): value is VariantId {
  return SEED_TIERS.some((tier) => tier.id === value);
}

/** @deprecated Use isVariantId. */
export const isPackId = isVariantId;

export function perSeedCents(tier: SeedTier) {
  return Math.round(tier.priceCents / tier.seeds);
}
