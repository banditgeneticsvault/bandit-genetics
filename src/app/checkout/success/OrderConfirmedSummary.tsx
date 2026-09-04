import { PromotionalGiftLine } from "@/components/cart/PromotionalGiftLine";
import { cartCopy } from "@/content/cart";
import { formatUsd } from "@/lib/cart";
import type { Order } from "@/lib/orders/types";
import { promotionalGiftView } from "@/lib/promotional-catalog";

export function OrderConfirmedSummary({ order }: { order: Order }) {
  const gift =
    order.promotionalGiftApplied && order.promotionalProductId
      ? promotionalGiftView(order.promotionalProductId)
      : null;

  return (
    <div className="grid max-w-3xl gap-6 border border-white/10 bg-charcoal px-5 py-6">
      <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
        {cartCopy.orderLabel} {order.id}
      </p>
      <div className="grid gap-2 text-copy text-ice">
        <p>
          {cartCopy.paidMerchandise}: {formatUsd(order.subtotalCents)}
        </p>
        <p>
          {cartCopy.shippingAmount}:{" "}
          {order.freeShipping || order.shippingCents === 0
            ? cartCopy.shippingFree
            : formatUsd(order.shippingCents)}
        </p>
        {order.promotionalGiftApplied ? (
          <p>
            {cartCopy.freeRandomFive}: {formatUsd(order.promotionalItemPriceCents)}
          </p>
        ) : null}
        <p>
          {cartCopy.orderTotal}: {formatUsd(order.totalCents)}
        </p>
      </div>
      {gift ? (
        <ul className="grid gap-3">
          <PromotionalGiftLine gift={gift} />
        </ul>
      ) : order.promotionalGiftApplied ? (
        <div className="border border-gold/40 px-4 py-4">
          <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
            {cartCopy.freeRandomFive}
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
        </div>
      ) : null}
    </div>
  );
}
