import { CONTACT_LIMITS } from "@/lib/contact";
import { getStrainById } from "@/data/genetics";
import type { StrainImage, StrainTheme } from "@/data/genetics/types";
import {
  canAddToCart,
  clampCartQuantity,
  getSeedTier,
  isVariantId,
  toOrderListing,
  type CartLine,
  type VariantId,
} from "@/data/order";
import { pickVaultImage } from "@/lib/artwork";

export type ResolvedCartLine = {
  productId: string;
  slug: string;
  name: string;
  variantId: VariantId;
  quantity: number;
  seedCount: number;
  seedLabel: string;
  totalSeeds: number;
  priceCents: number;
  lineTotalCents: number;
  image?: StrainImage;
  theme: StrainTheme;
};

function parseQuantity(value: unknown): number {
  return clampCartQuantity(value);
}

export function parseCartPayload(raw: unknown): CartLine[] | null {
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const productId =
        typeof record.productId === "string"
          ? record.productId
          : typeof record.slug === "string"
            ? record.slug
            : null;
      const variantId =
        typeof record.variantId === "string"
          ? record.variantId
          : typeof record.packId === "string"
            ? record.packId
            : null;
      if (!productId || !variantId) return null;
      if (!isVariantId(variantId)) return null;
      lines.push({
        productId: productId.trim(),
        variantId,
        quantity: parseQuantity(record.quantity),
      });
    }
    return lines;
  } catch {
    return null;
  }
}

export function resolveCartLine(
  line: CartLine,
): ResolvedCartLine | { error: "product" | "variant" } {
  const listing = toOrderListing(line.productId);
  if (!listing) return { error: "product" };
  if (!canAddToCart(listing.orderState)) return { error: "product" };
  if (!isVariantId(line.variantId)) return { error: "variant" };
  const tier = getSeedTier(line.variantId);
  if (!tier) return { error: "variant" };

  const quantity = clampCartQuantity(line.quantity);
  const strain = getStrainById(listing.productId);
  const image = strain ? pickVaultImage(strain) : undefined;

  return {
    productId: listing.productId,
    slug: listing.slug,
    name: listing.name,
    variantId: tier.id,
    quantity,
    seedCount: tier.seeds,
    seedLabel: tier.label,
    totalSeeds: tier.seeds * quantity,
    priceCents: tier.priceCents,
    lineTotalCents: tier.priceCents * quantity,
    image,
    theme: strain?.theme ?? "METAL",
  };
}

export function resolveCart(lines: CartLine[]): ResolvedCartLine[] {
  const resolved: ResolvedCartLine[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const item = resolveCartLine(line);
    if ("error" in item) continue;
    const key = `${item.productId}:${item.variantId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    resolved.push(item);
  }
  return resolved;
}

export function cartSubtotalCents(lines: ResolvedCartLine[]): number | undefined {
  if (lines.length === 0) return undefined;
  return lines.reduce((sum, line) => sum + line.lineTotalCents, 0);
}

export function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** @deprecated Use formatUsd. */
export const formatCents = formatUsd;

export const CHECKOUT_LIMITS = {
  name: CONTACT_LIMITS.name,
  email: CONTACT_LIMITS.email,
  notes: 2000,
  line1: 120,
  city: 80,
  region: 80,
  postal: 20,
  country: 80,
} as const;
