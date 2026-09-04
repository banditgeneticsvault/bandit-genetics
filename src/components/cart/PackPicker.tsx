"use client";

import { cartCopy } from "@/content/cart";
import { perSeedCents, type SeedTier, type VariantId } from "@/data/order";
import { formatUsd } from "@/lib/cart";
import { cn } from "@/lib/cn";

type SeedQuantityPickerProps = {
  name: string;
  value: VariantId;
  options: SeedTier[];
  disabled?: boolean;
  onChange: (value: VariantId) => void;
};

export function SeedQuantityPicker({
  name,
  value,
  options,
  disabled,
  onChange,
}: SeedQuantityPickerProps) {
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="font-label text-ui tracking-[0.22em] text-gold uppercase">
        {cartCopy.seedQuantity}
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((tier) => {
          const active = tier.id === value;
          return (
            <label
              key={tier.id}
              className={cn(
                "flex min-h-11 cursor-pointer flex-col justify-center border px-3 py-3",
                active
                  ? "border-frost bg-frost text-black"
                  : "border-gunmetal text-ice hover:border-gold hover:text-gold",
              )}
            >
              <input
                type="radio"
                name={name}
                value={tier.id}
                checked={active}
                onChange={() => onChange(tier.id)}
                className="sr-only"
              />
              <span className="flex items-baseline justify-between gap-3 font-label text-ui tracking-[0.14em] uppercase">
                <span>{tier.label}</span>
                <span>{formatUsd(tier.priceCents)}</span>
              </span>
              <span
                className={cn(
                  "mt-1 font-label text-meta tracking-[0.12em] uppercase",
                  active ? "text-black/70" : "text-ice/55",
                )}
              >
                {formatUsd(perSeedCents(tier))} {cartCopy.perSeed}
                {tier.saveCents ? ` · Save ${formatUsd(tier.saveCents)}` : ""}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** @deprecated Use SeedQuantityPicker. */
export const PackPicker = SeedQuantityPicker;
