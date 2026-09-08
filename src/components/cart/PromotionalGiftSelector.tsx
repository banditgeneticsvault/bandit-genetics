"use client";

import { StrainMedia } from "@/components/vault/StrainMedia";
import { cartCopy } from "@/content/cart";
import type { PromotionalGiftView } from "@/lib/promotional-catalog";
import { cn } from "@/lib/cn";

export function PromotionalGiftSelector({
  options,
  selectedProductId,
  onSelect,
  disabled,
  error,
  errorId,
}: {
  options: PromotionalGiftView[];
  selectedProductId: string | null;
  onSelect: (productId: string) => void;
  disabled?: boolean;
  error?: string;
  errorId?: string;
}) {
  const selected = Boolean(selectedProductId);

  return (
    <div
      id="checkout-gift"
      tabIndex={-1}
      role="group"
      aria-label={cartCopy.chooseFreeFive}
      aria-describedby={error && errorId ? errorId : undefined}
      className={cn(
        "mt-6 min-w-0 scroll-mt-28 scroll-mb-28 border bg-charcoal px-4 py-5",
        error ? "border-alert" : "border-gold/40",
      )}
    >
      <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
        {selected ? cartCopy.changeFreeGift : cartCopy.chooseFreeFive}
      </p>
      <h3 className="mt-3 font-display text-[clamp(1.5rem,4vw,2rem)] leading-none text-frost">
        {cartCopy.chooseFreeFive}
      </h3>
      <p className="mt-3 text-copy text-ice/70">{cartCopy.chooseFreeFiveHint}</p>
      <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const active = option.productId === selectedProductId;
          return (
            <button
              key={option.productId}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option.productId)}
              aria-pressed={active}
              className={cn(
                "flex min-w-0 flex-col border px-3 py-3 text-left",
                active
                  ? "border-frost bg-frost/10"
                  : "border-white/10 hover:border-gold",
                disabled ? "opacity-60" : "",
              )}
            >
              <div className="aspect-square w-full overflow-hidden bg-black">
                <StrainMedia
                  image={option.image}
                  theme={option.theme}
                  name={option.name}
                  className="h-full w-full px-0 py-0"
                  sizes="(max-width: 640px) 42vw, 160px"
                  imageClassName="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="mt-3 font-display text-[clamp(1rem,3.4vw,1.25rem)] leading-tight text-frost">
                {option.name}
              </p>
              <p className="mt-2 font-label text-ui tracking-[0.12em] text-ice uppercase">
                {option.seedLabel}
              </p>
              {active ? (
                <p className="mt-2 font-label text-ui tracking-[0.12em] text-gold uppercase">
                  {cartCopy.freeLabel}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-3 text-copy text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
