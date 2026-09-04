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

export type OrderLineKind = "paid" | "promotional";

export type OrderLine = {
  kind?: OrderLineKind;
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

export type PromotionStatus = "qualified" | "not_qualified";

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
  promotionStatus: PromotionStatus;
  freeShipping: boolean;
  promotionalGiftApplied: boolean;
  promotionalProductId: string | null;
  promotionalStrainName: string | null;
  promotionalPackSize: number | null;
  promotionalQuantity: number | null;
  promotionalItemPriceCents: number;
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
  promotionStatus?: PromotionStatus;
  freeShipping?: boolean;
  promotionalGiftApplied?: boolean;
  promotionalProductId?: string | null;
  promotionalStrainName?: string | null;
  promotionalPackSize?: number | null;
  promotionalQuantity?: number | null;
  promotionalItemPriceCents?: number;
  lines: OrderLine[];
  paymentMethod?: PaymentMethod;
  cryptocurrency?: CryptoAssetId | null;
  receivingAddress?: string | null;
  transactionHash?: string | null;
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
};
