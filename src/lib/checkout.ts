import { CHECKOUT_LIMITS } from "@/lib/cart";
import {
  checkoutCartMessage,
  parseCheckoutCartPayload,
  validateCheckoutCart,
  type CheckoutCartError,
} from "@/lib/checkout-cart";
import type { CartLine } from "@/data/order";
import type { ResolvedCartLine } from "@/lib/cart";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckoutCustomer = {
  name: string;
  email: string;
};

export type CheckoutFieldErrors = Partial<{
  name: string;
  email: string;
  items: string;
  cryptocurrency: string;
  gift: string;
}>;

export type CheckoutParseMessages = {
  required: string;
  invalidEmail: string;
  emptyCart: string;
  invalidItems: string;
  invalidCrypto?: string;
};

export type CheckoutSnapshot = {
  customer: CheckoutCustomer;
  lines: ResolvedCartLine[];
  subtotalCents: number;
  cartLines: CartLine[];
};

export type CheckoutFormState = {
  status: "idle" | "error";
  fieldErrors: CheckoutFieldErrors;
};

export const initialCheckoutState: CheckoutFormState = {
  status: "idle",
  fieldErrors: {},
};

export function parseCheckoutIntent(value: unknown): "crypto" | null {
  if (value === "crypto") return value;
  return null;
}

export function parseCheckout(
  input: Record<string, unknown>,
  messages: CheckoutParseMessages,
):
  | { ok: true; data: CheckoutSnapshot }
  | { ok: false; fieldErrors: CheckoutFieldErrors } {
  const customer: CheckoutCustomer = {
    name: normalize(input.name, CHECKOUT_LIMITS.name),
    email: normalize(input.email, CHECKOUT_LIMITS.email).toLowerCase(),
  };

  const fieldErrors: CheckoutFieldErrors = {};
  if (!customer.name) fieldErrors.name = messages.required;
  if (!customer.email) fieldErrors.email = messages.required;
  else if (!EMAIL_PATTERN.test(customer.email)) fieldErrors.email = messages.invalidEmail;

  const parsedItems = parseCheckoutCartPayload(input.items);
  if (!parsedItems.ok) {
    fieldErrors.items = checkoutCartMessage(parsedItems.reason, messages);
    return { ok: false, fieldErrors };
  }

  const cart = validateCheckoutCart(parsedItems.lines);
  if (!cart.ok) {
    fieldErrors.items = checkoutCartMessage(cart.reason, messages);
    return { ok: false, fieldErrors };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    data: {
      customer,
      lines: cart.lines,
      subtotalCents: cart.subtotalCents,
      cartLines: cart.lines.map((line) => ({
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
      })),
    },
  };
}

export function cartLinesFromUnknown(raw: unknown): CartLine[] {
  const parsed = parseCheckoutCartPayload(typeof raw === "string" ? raw : "");
  return parsed.ok ? parsed.lines : [];
}

export function isCheckoutCartError(value: string): value is CheckoutCartError {
  return (
    value === "empty" ||
    value === "malformed" ||
    value === "invalid_product" ||
    value === "invalid_variant" ||
    value === "invalid_quantity" ||
    value === "unavailable"
  );
}

function normalize(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
