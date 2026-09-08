"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent, type HTMLAttributes } from "react";
import { useSearchParams } from "next/navigation";
import { startCheckout } from "@/app/checkout/actions";
import { CartLineVisual } from "@/components/cart/CartLineVisual";
import { PromotionalGiftLine } from "@/components/cart/PromotionalGiftLine";
import { PromotionalGiftSelector } from "@/components/cart/PromotionalGiftSelector";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { SeedQuantityPicker } from "@/components/cart/PackPicker";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { SEED_TIERS } from "@/data/order";
import { CHECKOUT_LIMITS, cartSubtotalCents, formatUsd, resolveCart } from "@/lib/cart";
import {
  eligiblePromotionalListings,
  promotionalGiftView,
  type PromotionalGiftView,
} from "@/lib/promotional-catalog";
import {
  formatPromotionProgress,
  qualifiesForShippingPromotion,
  quoteShippingPromotion,
} from "@/lib/shipping-promotion";
import {
  CHECKOUT_FIELD_ORDER,
  emailValidationError,
  initialCheckoutState,
  nameValidationError,
  parseCheckout,
  type CheckoutFieldErrors,
} from "@/lib/checkout";
import { revealInvalidControl } from "@/lib/form-focus";
import { cn } from "@/lib/cn";

const fieldClassName =
  "min-h-12 w-full scroll-mt-28 scroll-mb-28 rounded-none border bg-black/55 px-3 py-3 font-sans text-copy text-frost outline-none placeholder:text-ice/35 focus-visible:border-gold";

const parseMessages = {
  nameRequired: cartCopy.nameRequired,
  nameInvalid: cartCopy.nameInvalid,
  emailRequired: cartCopy.emailRequired,
  invalidEmail: cartCopy.invalidEmail,
  emptyCart: cartCopy.emptyCart,
  invalidItems: cartCopy.invalidItems,
};

type ServerQuote = {
  merchandiseSubtotalCents: number;
  shippingCents: number;
  totalCents: number;
  promotionStatus: "qualified" | "not_qualified";
  remainingCents: number;
  freeShipping: boolean;
  promotionalGiftApplied: boolean;
  gift: PromotionalGiftView | null;
};

export function CheckoutDesk() {
  const { lines, setSeedTier, setLineQuantity, remove, ready } = useCart();
  const resolved = resolveCart(lines);
  const subtotal = cartSubtotalCents(resolved) ?? 0;
  const localQuote = quoteShippingPromotion(subtotal);
  const [serverQuote, setServerQuote] = useState<ServerQuote | null>(null);
  const [chosenGiftId, setChosenGiftId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("checkout") === "cancelled";
  const [state, formAction, pending] = useActionState(
    startCheckout,
    initialCheckoutState,
  );
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});
  const [values, setValues] = useState({ name: "", email: "", notes: "" });
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const fieldErrors = pending ? {} : clientErrors;
  const showFieldErrors = Object.keys(fieldErrors).length > 0;
  const showUnconfigured =
    !pending && state?.status === "unconfigured" && !showFieldErrors;
  const showError =
    !pending && state?.status === "error" && !showFieldErrors;

  useEffect(() => {
    if (!ready || lines.length === 0) {
      return;
    }
    const controller = new AbortController();
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: lines,
        promotionalProductId: chosenGiftId ?? undefined,
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as ServerQuote;
      })
      .then((quote) => {
        if (quote) setServerQuote(quote);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [chosenGiftId, lines, ready]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    const fitPanelToViewport = () => {
      if (!desktop.matches) {
        form.style.maxHeight = "";
        return;
      }
      const stickyTop = Number.parseFloat(getComputedStyle(form).top) || 112;
      const gap = 24;
      const top = Math.max(form.getBoundingClientRect().top, stickyTop);
      form.style.maxHeight = `${Math.max(320, window.innerHeight - top - gap)}px`;
    };

    fitPanelToViewport();
    const observer = new ResizeObserver(fitPanelToViewport);
    observer.observe(form.parentElement ?? form);
    window.addEventListener("scroll", fitPanelToViewport, { passive: true });
    window.addEventListener("resize", fitPanelToViewport);
    desktop.addEventListener("change", fitPanelToViewport);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", fitPanelToViewport);
      window.removeEventListener("resize", fitPanelToViewport);
      desktop.removeEventListener("change", fitPanelToViewport);
      form.style.maxHeight = "";
    };
  }, [ready, resolved.length]);

  useEffect(() => {
    if (wasPending.current && !pending && state?.fieldErrors) {
      setClientErrors(state.fieldErrors);
      if (Object.keys(state.fieldErrors).length > 0) {
        revealFirstInvalidField(formRef.current, state.fieldErrors);
      }
    }
    wasPending.current = pending;
  }, [pending, state]);

  const giftProductId = chosenGiftId ?? serverQuote?.gift?.productId ?? null;
  const quote =
    serverQuote && serverQuote.merchandiseSubtotalCents === subtotal
      ? serverQuote
      : localQuote;
  const showGift =
    Boolean(serverQuote?.promotionalGiftApplied && serverQuote.gift) &&
    serverQuote?.merchandiseSubtotalCents === subtotal;
  const qualified = qualifiesForShippingPromotion(subtotal);
  const giftOptions = qualified
    ? eligiblePromotionalListings()
        .map((listing) => promotionalGiftView(listing.productId))
        .filter((gift): gift is PromotionalGiftView => Boolean(gift))
    : [];
  const progress = formatPromotionProgress(
    quote.merchandiseSubtotalCents,
    formatUsd,
    cartCopy,
    showGift,
  );
  const showSpendMore = quote.remainingCents > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const native = event.nativeEvent as SubmitEvent;
    const submitter = native.submitter;
    const intent =
      submitter instanceof HTMLButtonElement ? submitter.value : "";

    if (intent !== "order" || pending) {
      event.preventDefault();
      return;
    }

    const nextErrors: CheckoutFieldErrors = {};
    if (qualified && !showGift) {
      nextErrors.gift = cartCopy.giftRequired;
    }

    const parsed = parseCheckout(
      {
        name: values.name,
        email: values.email,
        notes: values.notes,
        items: JSON.stringify(lines),
      },
      parseMessages,
    );
    if (!parsed.ok) {
      Object.assign(nextErrors, parsed.fieldErrors);
    }

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setClientErrors(nextErrors);
      revealFirstInvalidField(form, nextErrors);
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
    <div className="grid gap-10 pb-28 lg:grid-cols-12 lg:pb-0">
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
              className="min-w-0 border border-white/10 bg-charcoal px-4 py-4"
            >
              <CartLineVisual line={line} />
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
              <div className="mt-4">
                <QuantityStepper
                  name={`${formId}-qty-${line.productId}-${line.variantId}`}
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
        {qualified ? (
          <PromotionalGiftSelector
            options={giftOptions}
            selectedProductId={giftProductId}
            error={fieldErrors.gift}
            errorId={`${formId}-gift-error`}
            onSelect={(productId) => {
              setClientErrors((current) => {
                const next = { ...current };
                delete next.gift;
                return next;
              });
              setChosenGiftId(productId);
            }}
            disabled={pending}
          />
        ) : null}
        {showGift && serverQuote?.gift ? (
          <ul className="mt-3 grid gap-3">
            <PromotionalGiftLine gift={serverQuote.gift} />
          </ul>
        ) : null}
        <div className="mt-6 grid gap-2 text-copy text-ice">
          <p>
            {cartCopy.merchandiseSubtotal}: {formatUsd(subtotal)}
          </p>
          <p>
            {cartCopy.shippingAmount}:{" "}
            {quote.freeShipping
              ? cartCopy.shippingFree
              : formatUsd(quote.shippingCents)}
          </p>
          {showGift ? (
            <p>
              {cartCopy.promotionalGift}: {formatUsd(0)}
            </p>
          ) : null}
          <p>
            {cartCopy.orderTotal}: {formatUsd(quote.totalCents)}
          </p>
          {showSpendMore ? (
            <div className="mt-1 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <p className="min-w-0 font-label text-ui tracking-[0.12em] text-gold uppercase">
                {progress}
              </p>
              <Button
                href="/vault"
                variant="secondary"
                className="shrink-0"
              >
                {cartCopy.backToTheVault}
              </Button>
            </div>
          ) : (
            <p className="font-label text-ui tracking-[0.12em] text-gold uppercase">
              {progress}
            </p>
          )}
        </div>
        <p className="mt-3 text-copy text-ice/50">{cartCopy.taxNote}</p>
      </section>

      <form
        id="checkout-form"
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex min-w-0 flex-col border border-white/10 bg-charcoal/95 lg:col-span-5 lg:sticky lg:top-28 lg:z-10 lg:max-h-[calc(100dvh-8.5rem)] lg:self-start lg:overflow-hidden"
      >
        <div className="grid min-h-0 min-w-0 gap-6 overflow-x-hidden px-5 py-6 md:px-7 md:py-8 lg:flex-1 lg:overflow-y-auto">
          <input type="hidden" name="items" value={JSON.stringify(lines)} />
          <input
            type="hidden"
            name="promotionalProductId"
            value={giftProductId ?? ""}
          />
          {cancelled ? (
            <p role="status" className="border border-white/10 px-4 py-3 text-copy text-ice/80">
              {cartCopy.cancelledCheckout}
            </p>
          ) : null}
          <p className="section-kicker">{cartCopy.shipping}</p>
          <Field
            id={`${formId}-name`}
            name="name"
            label={cartCopy.name}
            autoComplete="name"
            maxLength={CHECKOUT_LIMITS.name}
            error={fieldErrors.name}
            disabled={pending}
            value={values.name}
            onChange={(value) => {
              setValues((current) => ({ ...current, name: value }));
              setClientErrors((current) =>
                updateFieldError(current, "name", nameValidationError(value, parseMessages)),
              );
            }}
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
            value={values.email}
            onChange={(value) => {
              setValues((current) => ({ ...current, email: value }));
              setClientErrors((current) =>
                updateFieldError(current, "email", emailValidationError(value, parseMessages)),
              );
            }}
            required
          />
          <div className="grid gap-2">
            <label
              htmlFor={`${formId}-notes`}
              className="font-label text-ui tracking-[0.22em] text-gold uppercase"
            >
              {cartCopy.notes}
            </label>
            <textarea
              id={`${formId}-notes`}
              name="notes"
              rows={4}
              maxLength={CHECKOUT_LIMITS.notes}
              disabled={pending}
              value={values.notes}
              onChange={(event) =>
                setValues((current) => ({ ...current, notes: event.target.value }))
              }
              className={cn(fieldClassName, "min-h-28 resize-y border-white/12")}
            />
            <p className="text-copy text-ice/50">{cartCopy.notesHint}</p>
          </div>
          {fieldErrors.items ? (
            <p role="alert" className="text-copy text-alert">
              {fieldErrors.items}
            </p>
          ) : null}

          <div className="min-w-0 border-t border-white/10 pt-6">
            <p className="section-kicker">{cartCopy.paymentMethod}</p>
            <p className="mt-3 text-copy text-ice/70">{cartCopy.choosePayment}</p>
            <p className="mt-3 text-copy text-ice/70">
              {cartCopy.howToOrderContact} <OrderEmailLink />{" "}
              {cartCopy.howToOrderContactAfter}
            </p>
            <Button
              type="submit"
              name="intent"
              value="order"
              variant="secondary"
              disabled={pending}
              className="mt-4 w-full sm:w-full lg:hidden"
            >
              {pending ? cartCopy.submittingOrder : cartCopy.placeOrder}
            </Button>
          </div>

          {showUnconfigured ? (
            <p role="alert" className="border border-white/10 px-4 py-3 text-copy text-ice">
              {cartCopy.unconfigured} <OrderEmailLink />.
            </p>
          ) : null}
          {showError ? (
            <p role="alert" className="border border-white/10 px-4 py-3 text-copy text-ice">
              {cartCopy.sendFailed} <OrderEmailLink />.
            </p>
          ) : null}
        </div>
        <div className="hidden shrink-0 border-t border-white/10 bg-charcoal px-5 py-4 lg:block md:px-7">
          <Button
            type="submit"
            name="intent"
            value="order"
            variant="secondary"
            disabled={pending}
            className="w-full sm:w-full"
          >
            {pending ? cartCopy.submittingOrder : cartCopy.placeOrder}
          </Button>
        </div>
      </form>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/95 p-4 lg:hidden">
          <Button
            type="submit"
            form="checkout-form"
            name="intent"
            value="order"
            variant="secondary"
            disabled={pending}
            className="w-full sm:w-full"
          >
            {pending ? cartCopy.submittingOrder : cartCopy.placeOrder}
          </Button>
        </div>
    </div>
  );
}

function updateFieldError(
  current: CheckoutFieldErrors,
  field: keyof CheckoutFieldErrors,
  error: string | undefined,
) {
  if (!current[field]) return current;
  const next = { ...current };
  if (error) next[field] = error;
  else delete next[field];
  return next;
}

function revealFirstInvalidField(
  form: HTMLFormElement | null,
  errors: CheckoutFieldErrors,
) {
  const first = CHECKOUT_FIELD_ORDER.find((key) => errors[key]);
  if (!first) return;

  const target =
    first === "gift"
      ? document.querySelector<HTMLElement>("#checkout-gift button") ??
        document.getElementById("checkout-gift")
      : form?.querySelector<HTMLElement>(`[name="${first}"]`);
  if (!target) return;

  revealInvalidControl(target);
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
  value,
  onChange,
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
  value: string;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="font-label text-ui tracking-[0.22em] text-gold uppercase">
        {label}
        {required ? (
          <span className="font-sans tracking-normal text-ice/70 normal-case">
            {" "}
            <span aria-hidden="true">*</span>
            <span className="sr-only"> (required)</span>
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        aria-required={required || undefined}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          fieldClassName,
          error
            ? "border-alert focus-visible:border-alert"
            : "border-white/12",
        )}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-copy text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
