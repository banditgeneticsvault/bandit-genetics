# Bandit Genetics

Premium cannabis genetics site foundation.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stripe Checkout (test mode)

Payments use Stripe-hosted Checkout. Card numbers never enter this application.

Copy `.env.example` to `.env.local` and set:

- `STRIPE_SECRET_KEY` — Stripe secret key (`sk_test_...` for test mode). Server-only. Never use `NEXT_PUBLIC_*` for this value.
- `STRIPE_WEBHOOK_SECRET` — webhook signing secret (`whsec_...`). Server-only.
- `NEXT_PUBLIC_SITE_URL` — public origin, for example `http://localhost:3000` locally or `https://www.banditgenetics.com` in production.

If `STRIPE_SECRET_KEY` is missing, checkout stays in the existing payment-disabled state and no Checkout Session is created.

### Local webhook forwarding (optional)

Do not commit credentials. Install the Stripe CLI separately if you want live event delivery:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the CLI-printed `whsec_...` value as `STRIPE_WEBHOOK_SECRET`.

Use Stripe test payment methods only (for example `ACCT-000015`). Do not use real cards.

### Vercel (after code review)

Set the same three variables on the Vercel project. Register the production webhook in Stripe:

`https://www.banditgenetics.com/api/stripe/webhook`

Events to send: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `payment_intent.payment_failed`.

Production charges are not live until production keys, the production webhook secret, successful webhook delivery, and a verified paid internal order are all in place.
