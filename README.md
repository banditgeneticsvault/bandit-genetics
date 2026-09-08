# Bandit Genetics

Premium cannabis genetics site foundation.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Ordering

Customers submit an order request from checkout. Bandit Genetics then follows up at the email they provided. Direct mail still goes to [support@banditgenetics.com](mailto:support@banditgenetics.com).

Copy `.env.local` from `.env.example` and set:

- `NEXT_PUBLIC_SITE_URL` — public origin, for example `http://localhost:3000` locally or `https://www.banditgenetics.com` in production.
- `DATABASE_URL` — Postgres connection string (Neon or Vercel Postgres). Server-only. Orders are stored here, not in `.data/orders.json`.
- `CONTACT_SMTP_HOST` — SMTP host used to send Contact and order notification mail. Server-only.
- `CONTACT_SMTP_PORT` — SMTP port (`587` for STARTTLS). Server-only.
- `CONTACT_SMTP_USER` — SMTP username (`support@banditgenetics.com`). Server-only.
- `CONTACT_SMTP_PASSWORD` — SMTP token, not an account password. Server-only. Never use `NEXT_PUBLIC_*` for this value.
- `CONTACT_DESTINATION_EMAIL` — mailbox that receives Contact messages and order request notifications, typically `support@banditgenetics.com`. Server-only.

Checkout stores the request in Postgres and sends a detailed notification through the same SMTP settings as the Contact form. If SMTP is not configured, the site will not show a false success message.

### Vercel (after code review)

Set `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_SMTP_PASSWORD`, and `CONTACT_DESTINATION_EMAIL` on the Vercel project (Production). Mark `CONTACT_SMTP_PASSWORD` as a secret.
