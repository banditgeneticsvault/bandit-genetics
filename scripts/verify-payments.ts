import { SEED_TIERS } from "../src/data/order/packs.ts";
import {
  parseCheckoutCartPayload,
  validateCheckoutCart,
} from "../src/lib/checkout-cart.ts";
import { parseCheckout } from "../src/lib/checkout.ts";

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

console.log("checkout validation checks passed");
