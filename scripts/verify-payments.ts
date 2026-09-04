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
import { eligiblePromotionalProductIds } from "../src/lib/promotional-catalog.ts";
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
assert(remainingCentsForPromotion(9999) === 1, "remaining $0.01");
assert(remainingCentsForPromotion(10000) === 0, "remaining at threshold");
assert(
  formatPromotionProgress(8000, (cents) => `$${(cents / 100).toFixed(2)}`, {
    spendMoreForPromotion: "SPEND {amount} MORE FOR FREE SHIPPING + A FREE RANDOM 5 PACK",
    promotionUnlocked: "FREE SHIPPING + FREE RANDOM 5 PACK",
  }) === "SPEND $20.00 MORE FOR FREE SHIPPING + A FREE RANDOM 5 PACK",
  "progress copy $80",
);

const eligible = eligiblePromotionalProductIds();
assert(eligible.length === 12, "all purchasable catalog strains with artwork");
assert(!eligible.includes(""), "no empty product ids");

const kept = assignPromotionalProductId({
  qualified: true,
  persistedProductId: "getaway-girl",
  eligibleProductIds: eligible,
  pick: () => "gorilla-heist",
});
assert(kept.applied && kept.productId === "getaway-girl", "do not reroll persisted gift");

const below = assignPromotionalProductId({
  qualified: false,
  persistedProductId: "getaway-girl",
  eligibleProductIds: eligible,
  pick: () => "gorilla-heist",
});
assert(!below.applied && below.productId === "getaway-girl", "keep assignment below threshold");

const first = assignPromotionalProductId({
  qualified: true,
  persistedProductId: null,
  eligibleProductIds: eligible,
  pick: (ids) => ids[0] ?? "",
});
assert(first.applied && first.productId === eligible[0], "assign once when missing");

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

console.log("checkout validation checks passed");
