import "server-only";

import type { CartLine } from "@/data/order";
import { syncCheckoutPromotion } from "@/lib/checkout-promotion";
import { cryptoStatusForHash, sanitizeTransactionHash } from "@/lib/crypto/hash";
import { notifyCryptoOrder } from "@/lib/crypto/notify";
import { isCryptoAsset, walletFor, type CryptoAsset } from "@/lib/crypto/wallets";
import { saveOrder } from "@/lib/orders/repository";
import type { Order } from "@/lib/orders/types";

export type CryptoCheckoutRequest = {
  name: string;
  email: string;
  items: CartLine[];
  cryptocurrency: unknown;
  transactionHash?: unknown;
  promotionalProductId?: unknown;
};

export type CryptoCheckoutResult =
  | {
      ok: false;
      reason:
        | "empty"
        | "invalid_cart"
        | "invalid_asset"
        | "invalid_promotional_product"
        | "gift_required";
    }
  | { ok: true; order: Order };

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

  const synced = await syncCheckoutPromotion({
    items: request.items,
    name: request.name,
    email: request.email,
    promotionalProductId: request.promotionalProductId,
    requireGiftIfQualified: true,
  });
  if (!synced.ok) {
    if (synced.reason === "empty") return { ok: false, reason: "empty" };
    if (
      synced.reason === "invalid_promotional_product" ||
      synced.reason === "gift_required"
    ) {
      return { ok: false, reason: synced.reason };
    }
    return { ok: false, reason: "invalid_cart" };
  }

  const wallet = walletFor(asset);
  const hash = sanitizeTransactionHash(request.transactionHash);
  const { status, paymentStatus } = cryptoStatusForHash(hash);

  const order = await saveOrder({
    ...synced.order,
    customerEmail: request.email,
    customerName: request.name,
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
