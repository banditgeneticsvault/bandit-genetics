"use client";

import { useEffect, useId, useState } from "react";
import { SeedQuantityPicker } from "@/components/cart/PackPicker";
import { useCart } from "@/components/cart/CartProvider";
import { cartCopy } from "@/content/cart";
import { SEED_TIERS, type VariantId } from "@/data/order";

export function SeedSelectDialog() {
  const { pendingAdd, cancelAdd, add } = useCart();
  if (!pendingAdd) return null;
  return (
    <SeedSelectForm
      key={pendingAdd.productId}
      productId={pendingAdd.productId}
      name={pendingAdd.name}
      onCancel={cancelAdd}
      onAdd={add}
    />
  );
}

function SeedSelectForm({
  productId,
  name,
  onCancel,
  onAdd,
}: {
  productId: string;
  name: string;
  onCancel: () => void;
  onAdd: (productId: string, variantId: VariantId) => boolean;
}) {
  const titleId = useId();
  const [variantId, setVariantId] = useState<VariantId>("seed-1");
  const selected = SEED_TIERS.find((tier) => tier.id === variantId) ?? SEED_TIERS[0];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close seed quantity"
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-4 top-1/2 mx-auto w-full max-w-md -translate-y-1/2 border border-white/10 bg-charcoal px-5 py-6 md:px-6"
      >
        <p className="section-kicker">{cartCopy.add}</p>
        <h2
          id={titleId}
          className="mt-3 font-display text-[clamp(1.6rem,4vw,2.2rem)] leading-none text-frost"
        >
          {name}
        </h2>
        <p className="mt-3 text-copy text-ice/70">{cartCopy.chooseSeeds}</p>
        <div className="mt-5">
          <SeedQuantityPicker
            name={`${titleId}-seeds`}
            value={variantId}
            options={SEED_TIERS}
            onChange={setVariantId}
          />
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onAdd(productId, variantId)}
            className="inline-flex min-h-12 items-center justify-center border border-gold px-4 font-label text-ui tracking-[0.18em] text-gold uppercase hover:bg-gold hover:text-black"
          >
            {cartCopy.add} · {selected.label}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 font-label text-ui tracking-[0.18em] text-ice uppercase hover:text-gold"
          >
            {cartCopy.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
