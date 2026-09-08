"use server";

import { redirect } from "next/navigation";
import { cartCopy } from "@/content/cart";
import { syncCheckoutPromotion } from "@/lib/checkout-promotion";
import {
  parseCheckout,
  parseCheckoutIntent,
  type CheckoutFormState,
} from "@/lib/checkout";
import { deliverOrderRequest } from "@/lib/order-notify";
import { clearPendingOrderCookie } from "@/lib/orders/pending-cookie";
import { saveOrder } from "@/lib/orders/repository";

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

  let synced: Awaited<ReturnType<typeof syncCheckoutPromotion>>;
  try {
    synced = await syncCheckoutPromotion({
      items: parsed.data.cartLines,
      name: parsed.data.customer.name,
      email: parsed.data.customer.email,
      promotionalProductId: formData.get("promotionalProductId"),
      requireGiftIfQualified: true,
    });
  } catch {
    console.error("order.submit.failed");
    return { status: "error", fieldErrors: {} };
  }

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

  let delivered: Awaited<ReturnType<typeof deliverOrderRequest>>;
  try {
    delivered = await deliverOrderRequest(synced.order);
  } catch {
    console.error("order.delivery.failed");
    return { status: "error", fieldErrors: {} };
  }

  if (!delivered.ok) {
    if (delivered.reason === "unconfigured") {
      console.info("order.delivery.unconfigured");
      return { status: "unconfigured", fieldErrors: {} };
    }
    return { status: "error", fieldErrors: {} };
  }

  try {
    await saveOrder({
      ...synced.order,
      status: "requested",
    });
    await clearPendingOrderCookie();
  } catch {
    console.error("order.request.finalize_failed");
  }

  redirect(`/checkout/success?order=${encodeURIComponent(synced.order.id)}`);
}
