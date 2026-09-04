import { CHECKOUT_LIMITS, parseCartPayload, resolveCart, type ResolvedCartLine } from "@/lib/cart";
import type { CartLine } from "@/data/order";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckoutCustomer = {
  name: string;
  email: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  country: string;
};

export type CheckoutFieldErrors = Partial<{
  name: string;
  email: string;
  line1: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  items: string;
}>;

export type CheckoutParseMessages = {
  required: string;
  invalidEmail: string;
  emptyCart: string;
};

export type CheckoutSnapshot = {
  customer: CheckoutCustomer;
  lines: ResolvedCartLine[];
  subtotalCents?: number;
};

export type CheckoutFormState = {
  status: "idle" | "error" | "payment_unavailable";
  fieldErrors: CheckoutFieldErrors;
};

export const initialCheckoutState: CheckoutFormState = {
  status: "idle",
  fieldErrors: {},
};

export function parseCheckout(
  input: Record<string, unknown>,
  messages: CheckoutParseMessages,
):
  | { ok: true; data: CheckoutSnapshot }
  | { ok: false; fieldErrors: CheckoutFieldErrors } {
  const customer: CheckoutCustomer = {
    name: normalize(input.name, CHECKOUT_LIMITS.name),
    email: normalize(input.email, CHECKOUT_LIMITS.email).toLowerCase(),
    line1: normalize(input.line1, CHECKOUT_LIMITS.line1),
    city: normalize(input.city, CHECKOUT_LIMITS.city),
    region: normalize(input.region, CHECKOUT_LIMITS.region),
    postal: normalize(input.postal, CHECKOUT_LIMITS.postal),
    country: normalize(input.country, CHECKOUT_LIMITS.country),
  };

  const fieldErrors: CheckoutFieldErrors = {};
  if (!customer.name) fieldErrors.name = messages.required;
  if (!customer.email) fieldErrors.email = messages.required;
  else if (!EMAIL_PATTERN.test(customer.email)) fieldErrors.email = messages.invalidEmail;
  if (!customer.line1) fieldErrors.line1 = messages.required;
  if (!customer.city) fieldErrors.city = messages.required;
  if (!customer.region) fieldErrors.region = messages.required;
  if (!customer.postal) fieldErrors.postal = messages.required;
  if (!customer.country) fieldErrors.country = messages.required;

  const payload = parseCartPayload(input.items);
  if (!payload || payload.length === 0) {
    fieldErrors.items = messages.emptyCart;
    return { ok: false, fieldErrors };
  }

  const lines = resolveCart(payload);
  if (lines.length === 0) {
    fieldErrors.items = messages.emptyCart;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  const subtotalCents = lines.every((line) => line.lineTotalCents != null)
    ? lines.reduce((sum, line) => sum + (line.lineTotalCents ?? 0), 0)
    : undefined;

  return { ok: true, data: { customer, lines, subtotalCents } };
}

export function cartLinesFromUnknown(raw: unknown): CartLine[] {
  return parseCartPayload(typeof raw === "string" ? raw : "") ?? [];
}

function normalize(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}
