import "server-only";

import type { CartLine } from "@/data/order";
import type { ResolvedCartLine } from "@/lib/cart";
import { validateCheckoutCart } from "@/lib/checkout-cart";
import { cryptoStatusForHash, sanitizeTransactionHash } from "@/lib/crypto/hash";
import { notifyCryptoOrder } from "@/lib/crypto/notify";
import { isCryptoAsset, walletFor, type CryptoAsset } from "@/lib/crypto/wallets";
import { createPendingOrder } from "@/lib/orders/repository";
import type { Order, OrderLine } from "@/lib/orders/types";

export type CryptoCheckoutRequest = {
  name: string;
  email: string;
  items: CartLine[];
  cryptocurrency: unknown;
  transactionHash?: unknown;
};

export type CryptoCheckoutResult =
  | { ok: false; reason: "empty" | "invalid_cart" | "invalid_asset" }
  | { ok: true; order: Order };

function linesFromCart(lines: ResolvedCartLine[]): OrderLine[] {
  return lines.map((line) => ({
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

export function parseCryptoAsset(value: unknown): CryptoAsset | null {
  return isCryptoAsset(value) ? value : null;
}

export async function createCryptoOrder(
  request: CryptoCheckoutRequest,
): Promise<CryptoCheckoutResult> {
  const asset = parseCryptoAsset(request.cryptocurrency);
  if (!asset) {
    return { ok: false, reason: "invalid_asset" };
  }

  const cart = validateCheckoutCart(request.items);
  if (!cart.ok) {
    if (cart.reason === "empty") {
      return { ok: false, reason: "empty" };
    }
    return { ok: false, reason: "invalid_cart" };
  }

  const wallet = walletFor(asset);
  const hash = sanitizeTransactionHash(request.transactionHash);
  const { status, paymentStatus } = cryptoStatusForHash(hash);

  const order = await createPendingOrder({
    customerEmail: request.email,
    customerName: request.name,
    subtotalCents: cart.subtotalCents,
    totalCents: cart.subtotalCents,
    lines: linesFromCart(cart.lines),
    paymentMethod: "crypto",
    cryptocurrency: asset,
    receivingAddress: wallet.address,
    transactionHash: hash,
    status,
    paymentStatus,
  });

  await notifyCryptoOrder(order);
  return { ok: true, order };
}
