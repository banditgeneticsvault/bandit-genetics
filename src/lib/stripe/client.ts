import "server-only";

import Stripe from "stripe";

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  return Boolean(key);
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

export function getWebhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret || null;
}
