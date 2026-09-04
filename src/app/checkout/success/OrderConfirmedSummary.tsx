import { CartLineVisual } from "@/components/cart/CartLineVisual";
import { PromotionalGiftLine } from "@/components/cart/PromotionalGiftLine";
import { cartCopy } from "@/content/cart";
import { getStrainById } from "@/data/genetics";
import { isVariantId, toOrderListing } from "@/data/order";
import { pickVaultImage } from "@/lib/artwork";
import { formatUsd, type ResolvedCartLine } from "@/lib/cart";
import type { Order, OrderLine } from "@/lib/orders/types";
import { promotionalGiftView } from "@/lib/promotional-catalog";

function visualFromPaidLine(line: OrderLine): ResolvedCartLine {
  const listing = toOrderListing(line.productId);
  const strain = getStrainById(listing?.productId ?? line.productId);
  const variantId = isVariantId(line.variantId) ? line.variantId : "seed-5";
  return {
    productId: line.productId,
    slug: listing?.slug ?? line.productId,
    name: line.strainName,
    variantId,
    quantity: line.quantity,
    seedCount: line.seedCount,
    seedLabel: line.packLabel,
    totalSeeds: line.seedCount * line.quantity,
    priceCents: line.unitPriceCents,
    lineTotalCents: line.lineTotalCents,
    image: strain ? pickVaultImage(strain) : undefined,
    theme: strain?.theme ?? "METAL",
  };
}

export function OrderConfirmedSummary({ order }: { order: Order }) {
  const paidLines = order.lines.filter((line) => line.kind !== "promotional");
  const gift =
    order.promotionalGiftApplied && order.promotionalProductId
      ? promotionalGiftView(order.promotionalProductId)
      : null;

  return (
    <div className="grid min-w-0 max-w-3xl gap-6 border border-white/10 bg-charcoal px-5 py-6">
      <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
        {cartCopy.orderLabel} {order.id}
      </p>
      {paidLines.length > 0 ? (
        <ul className="grid min-w-0 gap-3">
          {paidLines.map((line, index) => (
            <li
              key={`${line.productId}-${line.variantId}-${index}`}
              className="min-w-0 border border-white/10 px-4 py-4"
            >
              <p className="mb-3 font-label text-ui tracking-[0.18em] text-ice uppercase">
                {cartCopy.paidItem}
              </p>
              <CartLineVisual line={visualFromPaidLine(line)} />
            </li>
          ))}
        </ul>
      ) : null}
      {gift ? (
        <ul className="grid min-w-0 gap-3">
          <PromotionalGiftLine gift={gift} />
        </ul>
      ) : order.promotionalGiftApplied ? (
        <div className="min-w-0 border border-gold/40 px-4 py-4">
          <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
            {cartCopy.promotionalGift}
          </p>
          {order.promotionalStrainName ? (
            <p className="mt-3 font-display text-[clamp(1.3rem,3vw,1.7rem)] leading-tight text-frost">
              {order.promotionalStrainName}
            </p>
          ) : null}
          <p className="mt-2 font-label text-ui tracking-[0.12em] text-ice uppercase">
            {order.promotionalPackSize ?? 5} SEEDS
          </p>
          <p className="mt-1 font-label text-ui tracking-[0.12em] text-gold uppercase">
            {cartCopy.freeLabel}
          </p>
          <p className="mt-2 text-copy text-ice">
            {formatUsd(order.promotionalItemPriceCents)}
          </p>
        </div>
      ) : null}
      <div className="grid gap-2 text-copy text-ice">
        <p>
          {cartCopy.merchandiseSubtotal}: {formatUsd(order.subtotalCents)}
        </p>
        <p>
          {cartCopy.shippingAmount}:{" "}
          {order.freeShipping || order.shippingCents === 0
            ? cartCopy.shippingFree
            : formatUsd(order.shippingCents)}
        </p>
        {order.promotionalGiftApplied ? (
          <p>
            {cartCopy.promotionalGift}: {formatUsd(order.promotionalItemPriceCents)}
          </p>
        ) : null}
        <p>
          {cartCopy.orderTotal}: {formatUsd(order.totalCents)}
        </p>
      </div>
    </div>
  );
}
