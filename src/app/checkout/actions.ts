"use server";

import { redirect } from "next/navigation";
import { cartCopy } from "@/content/cart";
import { createCryptoOrder } from "@/lib/crypto/checkout";
import {
  parseCheckout,
  parseCheckoutIntent,
  type CheckoutFormState,
} from "@/lib/checkout";

export async function startCheckout(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const intent = parseCheckoutIntent(formData.get("intent"));
  if (!intent) {
    return { status: "error", fieldErrors: {} };
  }

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

  const payment = await createCryptoOrder({
    name: parsed.data.customer.name,
    email: parsed.data.customer.email,
    items: parsed.data.cartLines,
    cryptocurrency: formData.get("cryptocurrency"),
    transactionHash: formData.get("transactionHash"),
    promotionalProductId: formData.get("promotionalProductId"),
  });
  if (!payment.ok) {
    if (payment.reason === "empty") {
      return { status: "error", fieldErrors: { items: cartCopy.emptyCart } };
    }
    if (payment.reason === "invalid_asset") {
      return {
        status: "error",
        fieldErrors: { cryptocurrency: cartCopy.invalidCrypto },
      };
    }
    if (payment.reason === "gift_required") {
      return { status: "error", fieldErrors: { gift: cartCopy.giftRequired } };
    }
    if (payment.reason === "invalid_promotional_product") {
      return { status: "error", fieldErrors: { gift: cartCopy.invalidGift } };
    }
    return {
      status: "error",
      fieldErrors: { items: cartCopy.invalidItems },
    };
  }
  redirect(`/checkout/crypto?order=${encodeURIComponent(payment.order.id)}`);
}
