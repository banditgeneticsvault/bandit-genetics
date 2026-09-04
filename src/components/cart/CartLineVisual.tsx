import { StrainMedia } from "@/components/vault/StrainMedia";
import { cartCopy } from "@/content/cart";
import { cartOptionsPhrase, totalSeedsPhrase } from "@/data/order";
import { formatUsd, type ResolvedCartLine } from "@/lib/cart";

type CartLineVisualProps = {
  line: ResolvedCartLine;
  showLineTotal?: boolean;
};

export function CartLineVisual({
  line,
  showLineTotal = true,
}: CartLineVisualProps) {
  return (
    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden bg-black sm:h-24 sm:w-24">
        <StrainMedia
          image={line.image}
          theme={line.theme}
          name={line.name}
          className="h-full w-full px-0 py-0"
          sizes="96px"
          imageClassName="max-h-24 max-w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[clamp(1.3rem,3vw,1.7rem)] leading-tight text-frost">
          {line.name}
        </p>
        <p className="mt-2 font-label text-ui tracking-[0.12em] text-ice uppercase">
          {line.seedLabel}
        </p>
        <p className="mt-1 font-label text-ui tracking-[0.12em] text-ice uppercase">
          {line.seedCount === 1
            ? "1 SEED IN THIS OPTION"
            : `${line.seedCount} SEEDS IN THIS OPTION`}
        </p>
        <p className="mt-2 text-copy text-ice">
          {cartCopy.optionPrice}: {formatUsd(line.priceCents)}
        </p>
        {line.quantity > 1 ? (
          <p className="mt-2 font-label text-ui tracking-[0.12em] text-gold uppercase">
            {cartOptionsPhrase(line.quantity, line.seedCount)}
          </p>
        ) : null}
        <p className="mt-1 font-label text-ui tracking-[0.12em] text-ice uppercase">
          {totalSeedsPhrase(line.totalSeeds)}
        </p>
        {showLineTotal ? (
          <p className="mt-2 text-copy text-ice">
            {cartCopy.lineTotal}: {formatUsd(line.lineTotalCents)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
