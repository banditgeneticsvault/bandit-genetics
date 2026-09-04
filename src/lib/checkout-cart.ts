import {
  canAddToCart,
  CART_OPTION_MAX,
  isVariantId,
  toOrderListing,
  type CartLine,
  type VariantId,
} from "@/data/order";
import { resolveCartLine, type ResolvedCartLine } from "@/lib/cart";

export type CheckoutCartError =
  | "empty"
  | "malformed"
  | "invalid_product"
  | "invalid_variant"
  | "invalid_quantity"
  | "unavailable";

export type CheckoutCartResult =
  | { ok: true; lines: ResolvedCartLine[]; subtotalCents: number }
  | { ok: false; reason: CheckoutCartError };

function parseStrictQuantity(value: unknown): number | null {
  if (typeof value === "number") {
    if (!Number.isInteger(value)) return null;
    if (value < 1 || value > CART_OPTION_MAX) return null;
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > CART_OPTION_MAX) return null;
    return n;
  }
  return null;
}

export function parseCheckoutCartPayload(
  raw: unknown,
): { ok: true; lines: CartLine[] } | { ok: false; reason: CheckoutCartError } {
  if (typeof raw !== "string") return { ok: false, reason: "malformed" };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return { ok: false, reason: "malformed" };
    if (parsed.length === 0) return { ok: false, reason: "empty" };
    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") {
        return { ok: false, reason: "malformed" };
      }
      const record = item as Record<string, unknown>;
      const productId =
        typeof record.productId === "string"
          ? record.productId.trim()
          : typeof record.slug === "string"
            ? record.slug.trim()
            : "";
      const variantId =
        typeof record.variantId === "string"
          ? record.variantId
          : typeof record.packId === "string"
            ? record.packId
            : "";
      if (!productId) return { ok: false, reason: "invalid_product" };
      if (!variantId || !isVariantId(variantId)) {
        return { ok: false, reason: "invalid_variant" };
      }
      const quantity = parseStrictQuantity(record.quantity);
      if (quantity == null) return { ok: false, reason: "invalid_quantity" };
      lines.push({
        productId,
        variantId: variantId as VariantId,
        quantity,
      });
    }
    return { ok: true, lines };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

export function validateCheckoutCart(lines: CartLine[]): CheckoutCartResult {
  if (lines.length === 0) return { ok: false, reason: "empty" };

  const merged = new Map<string, CartLine>();
  for (const line of lines) {
    if (!isVariantId(line.variantId)) {
      return { ok: false, reason: "invalid_variant" };
    }
    const quantity = parseStrictQuantity(line.quantity);
    if (quantity == null) return { ok: false, reason: "invalid_quantity" };

    const listing = toOrderListing(line.productId);
    if (!listing) return { ok: false, reason: "invalid_product" };
    if (!canAddToCart(listing.orderState)) {
      return { ok: false, reason: "unavailable" };
    }

    const key = `${listing.productId}:${line.variantId}`;
    const existing = merged.get(key);
    const nextQty = existing ? existing.quantity + quantity : quantity;
    if (nextQty > CART_OPTION_MAX) {
      return { ok: false, reason: "invalid_quantity" };
    }
    merged.set(key, {
      productId: listing.productId,
      variantId: line.variantId,
      quantity: nextQty,
    });
  }

  const resolved: ResolvedCartLine[] = [];
  for (const line of merged.values()) {
    const item = resolveCartLine(line);
    if ("error" in item) {
      return {
        ok: false,
        reason: item.error === "variant" ? "invalid_variant" : "invalid_product",
      };
    }
    resolved.push(item);
  }

  if (resolved.length === 0) return { ok: false, reason: "empty" };

  const subtotalCents = resolved.reduce(
    (sum, line) => sum + line.lineTotalCents,
    0,
  );
  return { ok: true, lines: resolved, subtotalCents };
}

export function checkoutCartMessage(
  reason: CheckoutCartError,
  copy: { emptyCart: string; invalidItems: string },
): string {
  if (reason === "empty") return copy.emptyCart;
  return copy.invalidItems;
}
