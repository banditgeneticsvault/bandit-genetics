"use client";

import { cartCopy } from "@/content/cart";
import { CART_OPTION_MAX } from "@/data/order";
import { cn } from "@/lib/cn";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  name: string;
};

export function QuantityStepper({
  value,
  onChange,
  name,
}: QuantityStepperProps) {
  return (
    <div>
      <p className="font-label text-ui tracking-[0.22em] text-gold uppercase">
        {cartCopy.cartOptions}
      </p>
      <div className="mt-3 inline-flex items-stretch border border-gunmetal">
        <button
          type="button"
          aria-label="Decrease options in cart"
          onClick={() => onChange(value - 1)}
          className="inline-flex min-h-11 min-w-11 items-center justify-center font-label text-ui text-ice uppercase hover:text-gold"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border-x border-gunmetal font-label text-ui tracking-[0.12em] text-frost"
        >
          {value}
        </span>
        <button
          type="button"
          name={name}
          aria-label="Increase options in cart"
          disabled={value >= CART_OPTION_MAX}
          onClick={() => onChange(value + 1)}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center font-label text-ui text-ice uppercase hover:text-gold",
            value >= CART_OPTION_MAX && "cursor-not-allowed opacity-40",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}
