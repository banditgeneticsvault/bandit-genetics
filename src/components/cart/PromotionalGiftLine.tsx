import { StrainMedia } from "@/components/vault/StrainMedia";
import { cartCopy } from "@/content/cart";
import { formatUsd } from "@/lib/cart";
import type { PromotionalGiftView } from "@/lib/promotional-catalog";

export function PromotionalGiftLine({ gift }: { gift: PromotionalGiftView }) {
  return (
    <li className="min-w-0 border border-gold/40 bg-charcoal px-4 py-4">
      <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
        {cartCopy.promotionalGift}
      </p>
      <div className="mt-4 flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden bg-black sm:h-24 sm:w-24">
          <StrainMedia
            image={gift.image}
            theme={gift.theme}
            name={gift.name}
            className="h-full w-full px-0 py-0"
            sizes="96px"
            imageClassName="max-h-24 max-w-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[clamp(1.3rem,3vw,1.7rem)] leading-tight text-frost">
            {gift.name}
          </p>
          <p className="mt-2 font-label text-ui tracking-[0.12em] text-ice uppercase">
            {gift.seedLabel}
          </p>
          <p className="mt-1 font-label text-ui tracking-[0.12em] text-gold uppercase">
            {cartCopy.freeLabel}
          </p>
          <p className="mt-2 text-copy text-ice">
            {formatUsd(gift.priceCents)}
          </p>
        </div>
      </div>
    </li>
  );
}
