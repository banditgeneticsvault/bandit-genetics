"use client";

import { useActionState, useId, useState, type FormEvent, type HTMLAttributes } from "react";
import { startCheckout } from "@/app/checkout/actions";
import { SeedQuantityPicker } from "@/components/cart/PackPicker";
import { useCart } from "@/components/cart/CartProvider";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { SEED_TIERS } from "@/data/order";
import { CHECKOUT_LIMITS, cartSubtotalCents, formatUsd, resolveCart } from "@/lib/cart";
import {
  initialCheckoutState,
  parseCheckout,
  type CheckoutFieldErrors,
} from "@/lib/checkout";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-12 w-full rounded-none border border-white/12 bg-black/55 px-3 py-3 font-sans text-copy text-frost outline-none placeholder:text-ice/35 focus-visible:border-gold";

export function CheckoutDesk() {
  const { lines, setSeedTier, remove, ready } = useCart();
  const resolved = resolveCart(lines);
  const subtotal = cartSubtotalCents(resolved);
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutState,
  );
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});
  const formId = useId();
  const fieldErrors = pending
    ? {}
    : Object.keys(clientErrors).length > 0
      ? clientErrors
      : (state?.fieldErrors ?? {});
  const paymentOff = !pending && state?.status === "payment_unavailable";
  const showError =
    !pending && state?.status === "error" && Object.keys(fieldErrors).length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const parsed = parseCheckout(
      {
        name: String(new FormData(form).get("name") ?? ""),
        email: String(new FormData(form).get("email") ?? ""),
        line1: String(new FormData(form).get("line1") ?? ""),
        city: String(new FormData(form).get("city") ?? ""),
        region: String(new FormData(form).get("region") ?? ""),
        postal: String(new FormData(form).get("postal") ?? ""),
        country: String(new FormData(form).get("country") ?? ""),
        items: JSON.stringify(lines),
      },
      {
        required: cartCopy.required,
        invalidEmail: cartCopy.invalidEmail,
        emptyCart: cartCopy.emptyCart,
      },
    );
    if (!parsed.ok) {
      event.preventDefault();
      setClientErrors(parsed.fieldErrors);
      return;
    }
    setClientErrors({});
  }

  if (!ready) {
    return <p className="text-copy text-ice/60">Loading checkout.</p>;
  }

  if (resolved.length === 0) {
    return (
      <div className="border border-white/10 bg-charcoal px-5 py-6">
        <p className="font-label text-ui tracking-[0.18em] text-ice uppercase">
          {cartCopy.empty}
        </p>
        <p className="mt-3 text-copy text-ice/70">{cartCopy.emptyHint}</p>
        <div className="mt-6">
          <Button href="/vault" variant="secondary">
            {cartCopy.continue}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section className="lg:col-span-7" aria-labelledby={`${formId}-summary`}>
        <p className="section-kicker">{cartCopy.summary}</p>
        <h2
          id={`${formId}-summary`}
          className="mt-3 font-display text-[clamp(1.7rem,4vw,2.4rem)] leading-none text-frost"
        >
          {cartCopy.cart}
        </h2>
        <ul className="mt-6 grid gap-3">
          {resolved.map((line) => (
            <li
              key={`${line.productId}-${line.variantId}`}
              className="border border-white/10 bg-charcoal px-4 py-4"
            >
              <div className="flex min-w-0 items-start gap-4">
                <div className="w-20 shrink-0 sm:w-24">
                  <StrainMedia
                    image={line.image}
                    theme={line.theme}
                    name={line.name}
                    className="px-0 py-0"
                    sizes="96px"
                    imageClassName="max-h-24"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[clamp(1.3rem,3vw,1.8rem)] leading-tight text-frost">
                    {line.name}
                  </p>
                  <p className="mt-2 font-label text-ui tracking-[0.12em] text-ice uppercase">
                    {cartCopy.seedQuantity}: {line.seedLabel}
                  </p>
                  <p className="mt-2 text-copy text-ice">
                    {cartCopy.lineTotal}: {formatUsd(line.lineTotalCents)}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <SeedQuantityPicker
                  name={`${formId}-${line.productId}-${line.variantId}`}
                  value={line.variantId}
                  options={SEED_TIERS}
                  onChange={(next) =>
                    setSeedTier(line.productId, line.variantId, next)
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
        {subtotal != null ? (
          <div className="mt-6 grid gap-2 text-copy text-ice">
            <p>
              {cartCopy.subtotal}: {formatUsd(subtotal)}
            </p>
            <p>
              {cartCopy.orderTotal}: {formatUsd(subtotal)}
            </p>
          </div>
        ) : null}
        <p className="mt-3 text-copy text-ice/50">{cartCopy.taxNote}</p>
      </section>

      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="border border-white/10 bg-charcoal/95 lg:col-span-5"
      >
        <div className="grid gap-6 px-5 py-6 md:px-7 md:py-8">
          <input type="hidden" name="items" value={JSON.stringify(lines)} />
          <p className="section-kicker">{cartCopy.shipping}</p>
          <Field
            id={`${formId}-name`}
            name="name"
            label={cartCopy.name}
            autoComplete="name"
            maxLength={CHECKOUT_LIMITS.name}
            error={fieldErrors.name}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-email`}
            name="email"
            type="email"
            label={cartCopy.email}
            autoComplete="email"
            inputMode="email"
            maxLength={CHECKOUT_LIMITS.email}
            error={fieldErrors.email}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-line1`}
            name="line1"
            label={cartCopy.line1}
            autoComplete="address-line1"
            maxLength={CHECKOUT_LIMITS.line1}
            error={fieldErrors.line1}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-city`}
            name="city"
            label={cartCopy.city}
            autoComplete="address-level2"
            maxLength={CHECKOUT_LIMITS.city}
            error={fieldErrors.city}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-region`}
            name="region"
            label={cartCopy.region}
            autoComplete="address-level1"
            maxLength={CHECKOUT_LIMITS.region}
            error={fieldErrors.region}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-postal`}
            name="postal"
            label={cartCopy.postal}
            autoComplete="postal-code"
            maxLength={CHECKOUT_LIMITS.postal}
            error={fieldErrors.postal}
            disabled={pending}
            required
          />
          <Field
            id={`${formId}-country`}
            name="country"
            label={cartCopy.country}
            autoComplete="country-name"
            maxLength={CHECKOUT_LIMITS.country}
            error={fieldErrors.country}
            disabled={pending}
            required
          />
          {fieldErrors.items ? (
            <p role="alert" className="text-copy text-gold">
              {fieldErrors.items}
            </p>
          ) : null}

          <div className="border-t border-white/10 pt-6">
            <p className="section-kicker">{cartCopy.payment}</p>
            <p className="mt-3 text-copy leading-relaxed text-ice/75">
              {cartCopy.paymentOff}
            </p>
          </div>

          {paymentOff ? (
            <p role="status" className="border border-white/10 px-4 py-3 text-copy text-ice">
              {cartCopy.paymentOff}
            </p>
          ) : null}
          {showError ? (
            <p role="alert" className="border border-white/10 px-4 py-3 text-copy text-gold">
              {cartCopy.network}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 w-full items-center justify-center border border-frost px-6 font-label text-ui tracking-[0.22em] text-frost uppercase hover:bg-frost hover:text-black disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "CHECKING" : "CONTINUE"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  id,
  name,
  label,
  error,
  disabled,
  required,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string;
  name: string;
  label: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-label text-ui tracking-[0.22em] text-gold uppercase">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClassName)}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-copy text-gold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
