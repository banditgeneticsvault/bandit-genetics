import { SEED_TIERS } from "../src/data/order/packs.ts";
import {
  parseCheckoutCartPayload,
  validateCheckoutCart,
} from "../src/lib/checkout-cart.ts";
import { parseCheckout, parseCheckoutIntent } from "../src/lib/checkout.ts";
import {
  cryptoStatusForHash,
  sanitizeTransactionHash,
} from "../src/lib/crypto/hash.ts";
import { CRYPTO_WALLETS, isCryptoAsset } from "../src/lib/crypto/wallets.ts";
import {
  eligiblePromotionalProductIds,
  isEligiblePromotionalProductId,
  parsePromotionalProductIdInput,
} from "../src/lib/promotional-catalog.ts";
import {
  sessionBelongsToOrder,
  stripeSessionOrderId,
} from "../src/lib/stripe/association.ts";
import {
  checkoutReturnAllows,
  checkoutReturnPresentation,
  signCheckoutReturnAuth,
  verifyCheckoutReturnAuth,
} from "../src/lib/stripe/return-auth.ts";
import {
  assignPromotionalProductId,
  formatPromotionProgress,
  PROMOTION_THRESHOLD_CENTS,
  quoteShippingPromotion,
  remainingCentsForPromotion,
  STANDARD_SHIPPING_CENTS,
} from "../src/lib/shipping-promotion.ts";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function reasonOf(result: { ok: true } | { ok: false; reason: string }) {
  return result.ok ? undefined : result.reason;
}

const messages = {
  required: "required",
  invalidEmail: "email",
  emptyCart: "empty",
  invalidItems: "invalid",
};

const expected = {
  "seed-1": 1000,
  "seed-2": 1750,
  "seed-3": 2500,
  "seed-5": 3500,
} as const;

for (const tier of SEED_TIERS) {
  assert(
    tier.priceCents === expected[tier.id],
    `catalog price mismatch for ${tier.id}`,
  );
}

assert(reasonOf(parseCheckoutCartPayload("[]")) === "empty", "empty cart JSON");

const oneSeed = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-1", quantity: 1 },
]);
assert(oneSeed.ok && oneSeed.subtotalCents === 1000, "1 seed price");

const two = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-2", quantity: 1 },
]);
assert(two.ok && two.subtotalCents === 1750, "2 seed price");

const three = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-3", quantity: 1 },
]);
assert(three.ok && three.subtotalCents === 2500, "3 seed price");

const five = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-5", quantity: 1 },
]);
assert(five.ok && five.subtotalCents === 3500, "5 seed price");

const multiQty = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-1", quantity: 3 },
]);
assert(multiQty.ok && multiQty.subtotalCents === 3000, "3x 1 seed option");

const multiStrain = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-2", quantity: 1 },
  { productId: "vault-robbery", variantId: "seed-5", quantity: 2 },
]);
assert(
  multiStrain.ok && multiStrain.subtotalCents === 1750 + 3500 * 2,
  "multiple strains and packs",
);

const manipulated = parseCheckout(
  {
    name: "Test Buyer",
    email: "buyer@example.com",
    items: JSON.stringify([
      {
        productId: "gorilla-heist",
        variantId: "seed-1",
        quantity: 1,
        priceCents: 1,
        lineTotalCents: 1,
        stripePriceId: "price_fake",
        subtotal: 1,
      },
    ]),
  },
  messages,
);
assert(
  manipulated.ok && manipulated.data.subtotalCents === 1000,
  "client prices and Stripe price IDs must be ignored",
);

assert(
  !validateCheckoutCart([
    { productId: "not-a-strain", variantId: "seed-1", quantity: 1 },
  ]).ok,
  "invalid product",
);

assert(
  reasonOf(
    parseCheckoutCartPayload(
      JSON.stringify([
        { productId: "gorilla-heist", variantId: "seed-99", quantity: 1 },
      ]),
    ),
  ) === "invalid_variant",
  "invalid variant",
);

assert(
  reasonOf(
    parseCheckoutCartPayload(
      JSON.stringify([
        { productId: "gorilla-heist", variantId: "seed-1", quantity: 0 },
      ]),
    ),
  ) === "invalid_quantity",
  "quantity 0",
);

assert(CRYPTO_WALLETS.btc.address === "3Ni45Pm2qdbBmbDnCuykzCbeXo4EYRFquz", "btc address");
assert(
  CRYPTO_WALLETS.eth.address === "0xA3AfF13287dA2cf900208D401149e7EaE2CF8684",
  "eth address",
);
assert(
  CRYPTO_WALLETS.sol.address === "Aj2poturfv7Pr9pEzuz6xC2HNfPnVcaxD1mvNcf6MnzH",
  "sol address",
);
assert(!isCryptoAsset("doge"), "unsupported crypto");
assert(parseCheckoutIntent("crypto") === "crypto", "crypto intent");
assert(parseCheckoutIntent("wire") === null, "invalid intent");
assert(sanitizeTransactionHash("abc123") === "abc123", "hash keep");
assert(cryptoStatusForHash("abc123").paymentStatus === "unpaid", "hash unpaid");
assert(cryptoStatusForHash("abc123").status === "payment_submitted", "hash submitted");
assert(cryptoStatusForHash(null).status === "pending_payment", "no hash pending");

assert(
  !validateCheckoutCart([
    { productId: "gorilla-heist", variantId: "seed-1", quantity: 1.5 },
  ]).ok,
  "fractional quantity",
);

const cases: Array<[number, number, boolean]> = [
  [0, STANDARD_SHIPPING_CENTS, false],
  [1000, STANDARD_SHIPPING_CENTS, false],
  [3500, STANDARD_SHIPPING_CENTS, false],
  [8000, STANDARD_SHIPPING_CENTS, false],
  [9900, STANDARD_SHIPPING_CENTS, false],
  [9999, STANDARD_SHIPPING_CENTS, false],
  [10000, 0, true],
  [10001, 0, true],
  [12500, 0, true],
  [20000, 0, true],
];
for (const [subtotal, shipping, qualified] of cases) {
  const quote = quoteShippingPromotion(subtotal);
  assert(quote.shippingCents === shipping, `shipping at ${subtotal}`);
  assert(quote.promotionalGiftApplied === qualified, `gift flag at ${subtotal}`);
  assert(
    quote.totalCents === subtotal + shipping,
    `total excludes gift value at ${subtotal}`,
  );
  assert(
    quote.merchandiseSubtotalCents === subtotal,
    `merchandise unchanged at ${subtotal}`,
  );
}

assert(remainingCentsForPromotion(8000) === 2000, "remaining $20");
assert(remainingCentsForPromotion(9000) === 1000, "remaining $10");
assert(remainingCentsForPromotion(9999) === 1, "remaining $0.01");
assert(remainingCentsForPromotion(10000) === 0, "remaining at threshold");
assert(
  formatPromotionProgress(8000, (cents) => `$${(cents / 100).toFixed(2)}`, {
    spendMoreForPromotion: "SPEND {amount} MORE FOR FREE SHIPPING + A FREE 5 SEED PACK",
    promotionChooseGift: "FREE SHIPPING + CHOOSE YOUR FREE 5 SEED PACK",
    promotionUnlocked: "FREE SHIPPING + FREE 5 SEED PACK SELECTED",
  }) === "SPEND $20.00 MORE FOR FREE SHIPPING + A FREE 5 SEED PACK",
  "progress copy $80",
);
assert(
  formatPromotionProgress(10000, (cents) => `$${(cents / 100).toFixed(2)}`, {
    spendMoreForPromotion: "SPEND {amount} MORE FOR FREE SHIPPING + A FREE 5 SEED PACK",
    promotionChooseGift: "FREE SHIPPING + CHOOSE YOUR FREE 5 SEED PACK",
    promotionUnlocked: "FREE SHIPPING + FREE 5 SEED PACK SELECTED",
  }) === "FREE SHIPPING + CHOOSE YOUR FREE 5 SEED PACK",
  "progress copy choose gift",
);
assert(
  formatPromotionProgress(
    10000,
    (cents) => `$${(cents / 100).toFixed(2)}`,
    {
      spendMoreForPromotion: "SPEND {amount} MORE FOR FREE SHIPPING + A FREE 5 SEED PACK",
      promotionChooseGift: "FREE SHIPPING + CHOOSE YOUR FREE 5 SEED PACK",
      promotionUnlocked: "FREE SHIPPING + FREE 5 SEED PACK SELECTED",
    },
    true,
  ) === "FREE SHIPPING + FREE 5 SEED PACK SELECTED",
  "progress copy selected gift",
);

const eligible = eligiblePromotionalProductIds();
assert(eligible.length === 12, "all purchasable catalog strains with artwork");
assert(!eligible.includes(""), "no empty product ids");
assert(isEligiblePromotionalProductId(eligible[0] ?? ""), "eligible id accepted");
assert(!isEligiblePromotionalProductId("not-a-strain"), "fake gift id rejected");
assert(parsePromotionalProductIdInput(undefined).status === "omitted", "omitted gift");
assert(parsePromotionalProductIdInput("").status === "omitted", "empty gift omitted");
assert(parsePromotionalProductIdInput(12).status === "invalid", "non-string gift rejected");
assert(
  parsePromotionalProductIdInput("gorilla-heist").status === "value",
  "gift id parsed",
);

const kept = assignPromotionalProductId({
  qualified: true,
  persistedProductId: "getaway-girl",
  eligibleProductIds: eligible,
});
assert(kept.applied && kept.productId === "getaway-girl", "do not reroll persisted gift");

const below = assignPromotionalProductId({
  qualified: false,
  persistedProductId: "getaway-girl",
  eligibleProductIds: eligible,
});
assert(!below.applied && below.productId === "getaway-girl", "keep assignment below threshold");

const first = assignPromotionalProductId({
  qualified: true,
  persistedProductId: null,
  eligibleProductIds: eligible,
});
assert(!first.applied && first.productId === null, "do not auto-assign when missing");

const requested = assignPromotionalProductId({
  qualified: true,
  persistedProductId: "getaway-girl",
  requestedProductId: "gorilla-heist",
  eligibleProductIds: eligible,
});
assert(
  requested.applied && requested.productId === "gorilla-heist",
  "customer selection replaces persisted gift",
);

const fake = assignPromotionalProductId({
  qualified: true,
  persistedProductId: "getaway-girl",
  requestedProductId: "not-a-strain",
  eligibleProductIds: eligible,
});
assert(
  fake.applied && fake.productId === "getaway-girl",
  "invalid requested gift is ignored by assigner",
);

const hundred = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-5", quantity: 2 },
  { productId: "vault-robbery", variantId: "seed-1", quantity: 3 },
]);
assert(hundred.ok && hundred.subtotalCents === 3500 * 2 + 1000 * 3, "paid 5 pack plus other");
assert(
  hundred.ok && hundred.subtotalCents === PROMOTION_THRESHOLD_CENTS,
  "$100 from paid merchandise only",
);
assert(quoteShippingPromotion(hundred.subtotalCents).shippingCents === 0, "free shipping at $100");
assert(quoteShippingPromotion(hundred.subtotalCents).promotionalGiftApplied, "gift at $100");

const justUnder = validateCheckoutCart([
  { productId: "gorilla-heist", variantId: "seed-5", quantity: 2 },
  { productId: "vault-robbery", variantId: "seed-2", quantity: 1 },
]);
assert(
  justUnder.ok &&
    justUnder.subtotalCents === 8750 &&
    !quoteShippingPromotion(justUnder.subtotalCents).promotionalGiftApplied,
  "$87.50 does not include a phantom gift toward threshold",
);

const orderId = "bg_8e01e882-9879-4b2b-b3bb-d7f2fe984f6c";
const session = {
  id: "cs_test_abc123",
  metadata: { orderId },
  client_reference_id: orderId,
};
assert(stripeSessionOrderId(session) === orderId, "metadata orderId");
assert(
  sessionBelongsToOrder(session, {
    id: orderId,
    stripeCheckoutSessionId: null,
  }),
  "session matches order before session id is stored",
);
assert(
  sessionBelongsToOrder(session, {
    id: orderId,
    stripeCheckoutSessionId: "cs_test_abc123",
  }),
  "session matches stored session id",
);
assert(
  !sessionBelongsToOrder(session, {
    id: orderId,
    stripeCheckoutSessionId: "cs_test_other",
  }),
  "stored session mismatch is rejected",
);
assert(
  !sessionBelongsToOrder(
    { ...session, metadata: { orderId: "bg_11111111-1111-1111-1111-111111111111" } },
    { id: orderId, stripeCheckoutSessionId: "cs_test_abc123" },
  ),
  "metadata order mismatch is rejected",
);

const returnSecret = "test_checkout_return_secret";
const otherOrderId = "bg_11111111-1111-1111-1111-111111111111";
const otherSessionId = "cs_test_othercustomer";
const returnToken = signCheckoutReturnAuth(
  { sessionId: session.id, orderId },
  returnSecret,
);
assert(returnToken, "return token created");
const verified = verifyCheckoutReturnAuth(returnToken, returnSecret);
assert(verified?.sessionId === session.id, "return token session");
assert(verified?.orderId === orderId, "return token order");
assert(
  checkoutReturnAllows(verified, session.id, orderId),
  "A: legitimate return is authorized",
);
assert(
  checkoutReturnPresentation({
    authorized: true,
    sessionPaid: true,
    orderFailed: false,
    sessionExpired: false,
  }) === "confirmed",
  "A: legitimate paid return is confirmed",
);
assert(
  checkoutReturnPresentation({
    authorized: true,
    sessionPaid: true,
    orderFailed: false,
    sessionExpired: false,
  }) === "confirmed",
  "B/C: refresh and revisit stay confirmed without creating another order",
);
assert(
  !checkoutReturnAllows(verified, otherSessionId, otherOrderId),
  "D: different session/order is not authorized",
);
assert(
  checkoutReturnPresentation({
    authorized: false,
    sessionPaid: true,
    orderFailed: false,
    sessionExpired: false,
  }) === "missing",
  "D: paid session without matching auth hides order details",
);
assert(
  checkoutReturnPresentation({
    authorized: false,
    sessionPaid: true,
    orderFailed: false,
    sessionExpired: false,
  }) === "missing",
  "E: missing confirmation authorization hides order details",
);
assert(
  verifyCheckoutReturnAuth(returnToken, "wrong_secret") === null,
  "E: invalid signature is rejected",
);
assert(
  verifyCheckoutReturnAuth(returnToken, returnSecret, 4_000_000_000) === null,
  "E: expired confirmation authorization is rejected",
);
assert(
  checkoutReturnAllows(null, session.id, orderId) === false,
  "E: absent confirmation authorization is rejected",
);

console.log("checkout validation checks passed");
