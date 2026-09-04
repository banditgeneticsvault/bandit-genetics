"use server";

import { redirect } from "next/navigation";
import { cartCopy } from "@/content/cart";
import { parseCheckout, type CheckoutFormState } from "@/lib/checkout";
import { createCheckout } from "@/lib/payment";

export async function startCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const parsed = parseCheckout(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      items: formData.get("items"),
    },
    {
      required: cartCopy.required,
      invalidEmail: cartCopy.invalidEmail,
      emptyCart: cartCopy.emptyCart,
      invalidItems: cartCopy.invalidItems,
    },
  );

  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  const payment = await createCheckout({
    name: parsed.data.customer.name,
    email: parsed.data.customer.email,
    items: parsed.data.cartLines,
  });

  if (!payment.ok) {
    if (payment.reason === "payment_unavailable") {
      return { status: "payment_unavailable", fieldErrors: {} };
    }
    if (payment.reason === "empty") {
      return {
        status: "error",
        fieldErrors: { items: cartCopy.emptyCart },
      };
    }
    if (payment.reason === "invalid_cart") {
      return {
        status: "error",
        fieldErrors: { items: cartCopy.invalidItems },
      };
    }
    return { status: "error", fieldErrors: {} };
  }

  redirect(payment.url);
}
