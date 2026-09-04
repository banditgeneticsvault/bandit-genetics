"use client";

import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { SeedQuantityPicker } from "@/components/cart/PackPicker";
import { CartLineVisual } from "@/components/cart/CartLineVisual";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { SEED_TIERS } from "@/data/order";
import { cartSubtotalCents, formatUsd, resolveCart } from "@/lib/cart";
import { formatPromotionProgress } from "@/lib/shipping-promotion";
import { useEffect, useId } from "react";

export function CartDrawer() {
  const {
    lines,
    ready,
    open,
    closeCart,
    setSeedTier,
    setLineQuantity,
    remove,
    clear,
  } = useCart();
  const titleId = useId();
  const resolved = resolveCart(lines);
  const subtotal = cartSubtotalCents(resolved);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/70"
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-x-hidden overflow-y-auto border-l border-white/10 bg-charcoal"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <h2
            id={titleId}
            className="font-display text-[clamp(1.8rem,4vw,2.4rem)] leading-none text-frost"
          >
            {cartCopy.cart}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="min-h-11 px-3 font-label text-ui tracking-[0.22em] text-ice uppercase hover:text-gold"
          >
            CLOSE
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 py-6">
          {!ready || resolved.length === 0 ? (
            <div>
              <p className="font-label text-ui tracking-[0.18em] text-ice uppercase">
                {cartCopy.empty}
              </p>
              <p className="mt-3 text-copy text-ice/70">{cartCopy.emptyHint}</p>
            </div>
          ) : (
            <ul className="grid gap-3">
              {resolved.map((line) => (
                <li
                  key={`${line.productId}-${line.variantId}`}
                  className="min-w-0 border border-white/10 px-4 py-4"
                >
                  <CartLineVisual line={line} />
                  <div className="mt-4">
                    <SeedQuantityPicker
                      name={`cart-${line.productId}-${line.variantId}`}
                      value={line.variantId}
                      options={SEED_TIERS}
                      onChange={(next) =>
                        setSeedTier(line.productId, line.variantId, next)
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <QuantityStepper
                      name={`qty-${line.productId}-${line.variantId}`}
                      value={line.quantity}
                      onChange={(next) =>
                        setLineQuantity(line.productId, line.variantId, next)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.productId, line.variantId)}
                    className="mt-3 min-h-11 border border-gunmetal px-3 font-label text-ui tracking-[0.18em] text-ice uppercase hover:border-gold hover:text-gold"
                  >
                    {cartCopy.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {subtotal != null ? (
            <div className="mt-6 grid gap-2 text-copy text-ice">
              <p>
                {cartCopy.subtotal}: {formatUsd(subtotal)}
              </p>
              <p className="font-label text-ui tracking-[0.12em] text-gold uppercase">
                {formatPromotionProgress(
                  subtotal,
                  formatUsd,
                  cartCopy,
                )}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            <Button href="/vault" variant="secondary" onClick={closeCart}>
              {cartCopy.continue}
            </Button>
            {resolved.length > 0 ? (
              <>
                <Button href="/checkout" onClick={closeCart}>
                  {cartCopy.checkout}
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="min-h-11 font-label text-ui tracking-[0.18em] text-ice/70 uppercase hover:text-gold"
                >
                  {cartCopy.clear}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}
