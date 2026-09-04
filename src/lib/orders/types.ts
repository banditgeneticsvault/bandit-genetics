export const ORDER_STATUSES = [
  "pending",
  "paid",
  "payment_failed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "failed",
  "cancelled",
] as const;

export type OrderPaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type OrderLine = {
  productId: string;
  variantId: string;
  strainName: string;
  packLabel: string;
  seedCount: number;
  /** Number of this seed option (packs), not number of seeds. */
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type Order = {
  id: string;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  customerEmail: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  currency: "usd";
  subtotalCents: number;
  totalCents: number;
  lines: OrderLine[];
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
};

export type NewOrderInput = {
  customerEmail: string;
  customerName: string;
  subtotalCents: number;
  totalCents: number;
  lines: OrderLine[];
};
