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

console.log("checkout validation checks passed");
