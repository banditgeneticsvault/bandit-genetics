import type { SeedTier, VariantId } from "./types";

export const CART_OPTION_MAX = 99;

/**
 * Authoritative seed-option pricing for every strain.
 * Totals are package prices, not $10 × seed count.
 */
export const SEED_TIERS: SeedTier[] = [
  {
    id: "seed-1",
    seeds: 1,
    label: "1 SEED",
    priceCents: 1000,
    perSeedCents: 1000,
  },
  {
    id: "seed-2",
    seeds: 2,
    label: "2 SEEDS",
    priceCents: 1750,
    perSeedCents: 875,
    saveCents: 250,
  },
  {
    id: "seed-3",
    seeds: 3,
    label: "3 SEEDS",
    priceCents: 2500,
    perSeedCents: 833,
    saveCents: 500,
  },
  {
    id: "seed-5",
    seeds: 5,
    label: "5 SEEDS",
    priceCents: 3500,
    perSeedCents: 700,
    saveCents: 1500,
  },
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
  return tier.perSeedCents;
}

export function clampCartQuantity(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 1;
  return Math.min(CART_OPTION_MAX, Math.max(1, Math.floor(n)));
}

export function cartOptionsPhrase(quantity: number, seeds: number) {
  const unit = seeds === 1 ? "1 SEED" : `${seeds} SEED`;
  const optionWord = quantity === 1 ? "OPTION" : "OPTIONS";
  return `${quantity} × ${unit} ${optionWord}`;
}

export function totalSeedsPhrase(totalSeeds: number) {
  return totalSeeds === 1 ? "1 TOTAL SEED" : `${totalSeeds} TOTAL SEEDS`;
}
