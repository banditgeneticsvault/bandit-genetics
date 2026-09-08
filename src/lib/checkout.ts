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
const NAME_TOKEN = /[A-Za-z]/;

export type CheckoutCustomer = {
  name: string;
  email: string;
  notes: string;
};

export type CheckoutFieldErrors = Partial<{
  name: string;
  email: string;
  notes: string;
  items: string;
  gift: string;
}>;

export type CheckoutParseMessages = {
  nameRequired: string;
  nameInvalid: string;
  emailRequired: string;
  invalidEmail: string;
  emptyCart: string;
  invalidItems: string;
};

export type CheckoutSnapshot = {
  customer: CheckoutCustomer;
  lines: ResolvedCartLine[];
  subtotalCents: number;
  cartLines: CartLine[];
};

export type CheckoutFormState = {
  status: "idle" | "error" | "unconfigured" | "success";
  fieldErrors: CheckoutFieldErrors;
  orderId?: string;
};

export const initialCheckoutState: CheckoutFormState = {
  status: "idle",
  fieldErrors: {},
};

export const CHECKOUT_FIELD_ORDER = ["name", "email", "gift", "items"] as const;

export function parseCheckoutIntent(value: unknown): "order" | null {
  if (value === "order") return value;
  return null;
}

export function nameValidationError(
  value: unknown,
  messages: Pick<CheckoutParseMessages, "nameRequired" | "nameInvalid">,
) {
  const name = normalize(value, CHECKOUT_LIMITS.name);
  if (!name) return messages.nameRequired;
  if (!isFullName(name)) return messages.nameInvalid;
  return undefined;
}

export function emailValidationError(
  value: unknown,
  messages: Pick<CheckoutParseMessages, "emailRequired" | "invalidEmail">,
) {
  const email = normalize(value, CHECKOUT_LIMITS.email).toLowerCase();
  if (!email) return messages.emailRequired;
  if (!EMAIL_PATTERN.test(email)) return messages.invalidEmail;
  return undefined;
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
    notes: normalizeMessage(input.notes, CHECKOUT_LIMITS.notes),
  };

  const fieldErrors: CheckoutFieldErrors = {};
  const nameError = nameValidationError(input.name, messages);
  const emailError = emailValidationError(input.email, messages);
  if (nameError) fieldErrors.name = nameError;
  if (emailError) fieldErrors.email = emailError;

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

function isFullName(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return parts.length >= 2 && parts.every((part) => NAME_TOKEN.test(part));
}

function normalize(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function normalizeMessage(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, max);
}
