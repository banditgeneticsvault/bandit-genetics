export const ORDER_STATUSES = [
  "pending",
  "pending_payment",
  "payment_submitted",
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

export const PAYMENT_METHODS = ["card", "crypto"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type CryptoAssetId = "btc" | "eth" | "sol";

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
  paymentMethod: PaymentMethod;
  cryptocurrency: CryptoAssetId | null;
  receivingAddress: string | null;
  transactionHash: string | null;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  currency: "usd";
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
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
  shippingCents?: number;
  taxCents?: number;
  totalCents: number;
  lines: OrderLine[];
  paymentMethod?: PaymentMethod;
  cryptocurrency?: CryptoAssetId | null;
  receivingAddress?: string | null;
  transactionHash?: string | null;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
};
