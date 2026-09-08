"use client";

import { useId, useState } from "react";
import { SeedQuantityPicker } from "@/components/cart/PackPicker";
import { useCart } from "@/components/cart/CartProvider";
import { EmailOrderCta } from "@/components/layout/EmailOrderCta";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import {
  ORDER_STATE_LABELS,
  SEED_TIERS,
  canAddToCart,
  type OrderListing,
  type VariantId,
} from "@/data/order";

type AddToCartPanelProps = {
  listing: OrderListing;
};

export function AddToCartPanel({ listing }: AddToCartPanelProps) {
  const formId = useId();
  const { add } = useCart();
  const [variantId, setVariantId] = useState<VariantId>("seed-1");
  const [status, setStatus] = useState<"idle" | "added" | "blocked">("idle");
  const open = canAddToCart(listing.orderState);
  const selected = SEED_TIERS.find((tier) => tier.id === variantId) ?? SEED_TIERS[0];

  function handleAdd() {
    const ok = add(listing.productId, variantId);
    setStatus(ok ? "added" : "blocked");
  }

  const statusCopy =
    listing.orderState === "SOLD_OUT"
      ? cartCopy.soldOut
      : listing.orderState === "INQUIRY_ONLY"
        ? cartCopy.inquiryOnly
        : listing.orderState === "COMING_SOON"
          ? cartCopy.comingSoon
          : null;

  return (
    <section
      id="cart"
      aria-labelledby={`${formId}-title`}
      className="scroll-mt-28 border border-white/10 bg-charcoal px-5 py-6 md:px-6 md:py-7"
    >
      <p className="section-kicker">{cartCopy.cart}</p>
      <h2
        id={`${formId}-title`}
        className="mt-3 font-display text-[clamp(1.7rem,4vw,2.4rem)] leading-[0.95] text-frost"
      >
        {cartCopy.add}
      </h2>
      <p className="mt-3 font-label text-ui tracking-[0.16em] text-gold uppercase">
        {cartCopy.fileStatus}: {ORDER_STATE_LABELS[listing.orderState]}
      </p>
      {statusCopy ? (
        <p className="mt-3 text-copy leading-relaxed text-ice/75">{statusCopy}</p>
      ) : null}

      {open ? (
        <div className="mt-6 grid gap-6">
          <SeedQuantityPicker
            name={`${formId}-seeds`}
            value={variantId}
            options={listing.seedTiers}
            onChange={(next) => {
              setVariantId(next);
              setStatus("idle");
            }}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={handleAdd}
              aria-label={`Add ${listing.name}, ${selected.label}`}
            >
              {cartCopy.add}
            </Button>
          </div>
          {status === "added" ? (
            <p role="status" className="text-copy text-ice">
              {cartCopy.added}
            </p>
          ) : null}
          {status === "blocked" ? (
            <p role="alert" className="text-copy text-gold">
              {cartCopy.unavailable}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-6 text-copy text-ice/70">{cartCopy.unavailable}</p>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="section-kicker">CONTACT</p>
        <div className="mt-5">
          <EmailOrderCta strainName={listing.name} />
        </div>
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="section-kicker">CUSTOM BULK</p>
        <h3 className="mt-3 font-display text-[clamp(1.4rem,3vw,1.9rem)] leading-tight text-frost">
          {cartCopy.bulkTitle}
        </h3>
        <p className="mt-3 text-copy leading-relaxed text-ice/70">{cartCopy.bulkBody}</p>
        <div className="mt-5">
          <Button href={`/contact?strain=${listing.slug}`} variant="secondary">
            {cartCopy.bulkCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
