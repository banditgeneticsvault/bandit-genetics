"use server";

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
      line1: formData.get("line1"),
      city: formData.get("city"),
      region: formData.get("region"),
      postal: formData.get("postal"),
      country: formData.get("country"),
      items: formData.get("items"),
    },
    {
      required: cartCopy.required,
      invalidEmail: cartCopy.invalidEmail,
      emptyCart: cartCopy.emptyCart,
    },
  );

  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  const payment = await createCheckout({
    productIds: parsed.data.lines.map((line) => line.productId),
    variantIds: parsed.data.lines.map((line) => line.variantId),
  });

  if (!payment.ok) {
    return { status: "payment_unavailable", fieldErrors: {} };
  }

  return { status: "payment_unavailable", fieldErrors: {} };
}
