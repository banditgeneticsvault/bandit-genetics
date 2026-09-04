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
- `DATABASE_URL` — Postgres connection string (Neon or Vercel Postgres). Server-only. Orders and Stripe webhook event IDs are stored here, not in `.data/orders.json`.
- `CONTACT_SMTP_HOST` — Proton SMTP host. Server-only.
- `CONTACT_SMTP_PORT` — Proton SMTP port (`587` for STARTTLS). Server-only.
- `CONTACT_SMTP_USER` — SMTP username (`support@banditgenetics.com`). Server-only.
- `CONTACT_SMTP_PASSWORD` — Proton-generated SMTP token, not the account password. Server-only. Never use `NEXT_PUBLIC_*` for this value.
- `CONTACT_DESTINATION_EMAIL` — mailbox that receives Contact form messages. Server-only.

If `STRIPE_SECRET_KEY` is missing, checkout still loads. The cart still works. **CHECKOUT WITH CARD** stays visible when the cart has items, but it is disabled and the page explains that card processing is unavailable. **PAY LATER / PAY WITH CRYPTO** remains available.

The checkout button submits the existing cart to the `startCheckout` server action. Card checkout creates an internal pending order and a Stripe Checkout Session, then redirects to Stripe-hosted Checkout. Crypto checkout creates an unpaid internal order and shows receiving-address instructions. Crypto verification is manual. The Contact form sends mail through Proton SMTP when the `CONTACT_SMTP_*` variables are set.

### Local webhook forwarding (optional)

Do not commit credentials. Install the Stripe CLI separately if you want live event delivery:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the CLI-printed `whsec_...` value as `STRIPE_WEBHOOK_SECRET`.

Use Stripe test payment methods only (for example `ACCT-000015`). Do not use real cards.

### Vercel (after code review)

Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASSWORD`, and `CONTACT_DESTINATION_EMAIL` on the Vercel project (Production). Mark `CONTACT_SMTP_PASSWORD` as a secret. Register the production webhook in Stripe:

`https://www.banditgenetics.com/api/stripe/webhook`

Events to send: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`, `payment_intent.payment_failed`.

Production charges are not live until production keys, the production webhook secret, successful webhook delivery, and a verified paid internal order are all in place.
