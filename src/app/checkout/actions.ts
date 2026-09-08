"use server";

import { redirect } from "next/navigation";
import { cartCopy } from "@/content/cart";
import { syncCheckoutPromotion } from "@/lib/checkout-promotion";
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
      nameRequired: cartCopy.nameRequired,
      nameInvalid: cartCopy.nameInvalid,
      emailRequired: cartCopy.emailRequired,
      invalidEmail: cartCopy.invalidEmail,
      emptyCart: cartCopy.emptyCart,
      invalidItems: cartCopy.invalidItems,
    },
  );

  if (!parsed.ok) {
    return { status: "error", fieldErrors: parsed.fieldErrors };
  }

  const synced = await syncCheckoutPromotion({
    items: parsed.data.cartLines,
    name: parsed.data.customer.name,
    email: parsed.data.customer.email,
    promotionalProductId: formData.get("promotionalProductId"),
    requireGiftIfQualified: true,
  });
  if (!synced.ok) {
    if (synced.reason === "empty") {
      return { status: "error", fieldErrors: { items: cartCopy.emptyCart } };
    }
    if (synced.reason === "gift_required") {
      return { status: "error", fieldErrors: { gift: cartCopy.giftRequired } };
    }
    if (synced.reason === "invalid_promotional_product") {
      return { status: "error", fieldErrors: { gift: cartCopy.invalidGift } };
    }
    return {
      status: "error",
      fieldErrors: { items: cartCopy.invalidItems },
    };
  }

  redirect(`/checkout/success?order=${encodeURIComponent(synced.order.id)}`);
}
