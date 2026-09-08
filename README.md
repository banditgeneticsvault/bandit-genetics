# Bandit Genetics

Premium cannabis genetics site foundation.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ordering

Customers can place an order by emailing [support@banditgenetics.com](mailto:support@banditgenetics.com).

Copy `.env.local` from `.env.example` and set:

- `NEXT_PUBLIC_SITE_URL` — public origin, for example `http://localhost:3000` locally or `https://www.banditgenetics.com` in production.
- `DATABASE_URL` — Postgres connection string (Neon or Vercel Postgres). Server-only. Orders are stored here, not in `.data/orders.json`.
- `CONTACT_SMTP_HOST` — Proton SMTP host. Server-only.
- `CONTACT_SMTP_PORT` — Proton SMTP port (`587` for STARTTLS). Server-only.
- `CONTACT_SMTP_USER` — SMTP username (`support@banditgenetics.com`). Server-only.
- `CONTACT_SMTP_PASSWORD` — Proton-generated SMTP token, not the account password. Server-only. Never use `NEXT_PUBLIC_*` for this value.
- `CONTACT_DESTINATION_EMAIL` — mailbox that receives Contact form messages. Server-only.

The checkout form validates the cart and customer details, then stores an unpaid internal order ticket. The Contact form sends mail through Proton SMTP when the `CONTACT_SMTP_*` variables are set.

### Vercel (after code review)

Set `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASSWORD`, and `CONTACT_DESTINATION_EMAIL` on the Vercel project (Production). Mark `CONTACT_SMTP_PASSWORD` as a secret.
