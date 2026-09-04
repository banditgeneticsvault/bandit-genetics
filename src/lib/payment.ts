export type PaymentStatus =
  | "disconnected"
  | "processing"
  | "succeeded"
  | "failed";

export type CheckoutSessionRequest = {
  productIds: string[];
  variantIds: string[];
};

export type PaymentResult =
  | { ok: false; status: "disconnected"; reason: "payment_unavailable" }
  | { ok: true; status: "succeeded"; paymentId: string };

export function getPaymentStatus(): PaymentStatus {
  return "disconnected";
}

export function isPaymentEnabled() {
  return false;
}

export async function createCheckout(
  _request?: CheckoutSessionRequest,
): Promise<PaymentResult> {
  void _request;
  return { ok: false, status: "disconnected", reason: "payment_unavailable" };
}

export async function createPayment(
  _request?: CheckoutSessionRequest,
): Promise<PaymentResult> {
  void _request;
  return { ok: false, status: "disconnected", reason: "payment_unavailable" };
}

export async function confirmPayment(
  _paymentId?: string,
): Promise<PaymentResult> {
  void _paymentId;
  return { ok: false, status: "disconnected", reason: "payment_unavailable" };
}

export async function handlePaymentWebhook(
  _payload?: unknown,
): Promise<PaymentResult> {
  void _payload;
  return { ok: false, status: "disconnected", reason: "payment_unavailable" };
}
