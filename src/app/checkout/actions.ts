"use server";

import { cartCopy } from "@/content/cart";
import { prepareCheckoutOrder } from "@/lib/checkout-promotion";
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
    console.error("order.submit.invalid_intent");
    return { status: "error", fieldErrors: {} };
  }

  const parsed = parseCheckout(
    {
      name: formData.get("name"),
      email: formData.get("email"),
      notes: formData.get("notes"),
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

  let prepared: ReturnType<typeof prepareCheckoutOrder>;
  try {
    prepared = prepareCheckoutOrder({
      items: parsed.data.cartLines,
      name: parsed.data.customer.name,
      email: parsed.data.customer.email,
      notes: parsed.data.customer.notes,
      promotionalProductId: formData.get("promotionalProductId"),
      requireGiftIfQualified: true,
    });
  } catch {
    console.error("order.submit.prepare_failed");
    return { status: "error", fieldErrors: {} };
  }

  if (!prepared.ok) {
    if (prepared.reason === "empty") {
      return { status: "error", fieldErrors: { items: cartCopy.emptyCart } };
    }
    if (prepared.reason === "gift_required") {
      return { status: "error", fieldErrors: { gift: cartCopy.giftRequired } };
    }
    if (prepared.reason === "invalid_promotional_product") {
      return { status: "error", fieldErrors: { gift: cartCopy.invalidGift } };
    }
    return {
      status: "error",
      fieldErrors: { items: cartCopy.invalidItems },
    };
  }

  let delivered: Awaited<ReturnType<typeof deliverOrderRequest>>;
  try {
    delivered = await deliverOrderRequest(prepared.order);
  } catch {
    console.error("order.delivery.failed");
    return { status: "error", fieldErrors: {} };
  }

  if (!delivered.ok) {
    if (delivered.reason === "unconfigured") {
      console.error("order.delivery.unconfigured");
      return { status: "unconfigured", fieldErrors: {} };
    }
    console.error("order.delivery.rejected");
    return { status: "error", fieldErrors: {} };
  }

  try {
    await saveOrder({
      ...prepared.order,
      status: "requested",
    });
    await clearPendingOrderCookie();
  } catch {
    console.error("order.request.finalize_failed");
  }

  return {
    status: "success",
    fieldErrors: {},
    orderId: prepared.order.id,
  };
}
