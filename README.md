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
- `CONTACT_SMTP_HOST` — Proton SMTP host, `smtp.protonmail.ch`. Server-only. Defaults to this host if omitted.
- `CONTACT_SMTP_PORT` — SMTP port (`587` for STARTTLS). Server-only. Defaults to `587` if omitted.
- `CONTACT_SMTP_USER` — SMTP username. Must be the Proton custom-domain address paired with the token, usually `support@banditgenetics.com`. Server-only.
- `CONTACT_SMTP_PASSWORD` — Proton SMTP token, not the Proton account password. Server-only. Never use `NEXT_PUBLIC_*` for this value.
- `EMAIL_FROM` — From address. Must be the same Proton custom-domain address authorized by the SMTP token. Server-only.
- `CONTACT_DESTINATION_EMAIL` — mailbox that receives Contact and order notifications. Use `support@banditgenetics.com`. Server-only.

Checkout stores the request in Postgres and sends a detailed notification through the same SMTP settings as the Contact form. If SMTP is not configured, the site will not show a false success message.

### Vercel (Production)

In the Vercel project → Settings → Environment Variables, set these for Production (and Preview if you test there), then redeploy:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`
- `CONTACT_SMTP_HOST` = `smtp.protonmail.ch`
- `CONTACT_SMTP_PORT` = `587`
- `CONTACT_SMTP_USER` = `support@banditgenetics.com`
- `CONTACT_SMTP_PASSWORD` = Proton SMTP token (mark Sensitive)
- `EMAIL_FROM` = `support@banditgenetics.com`
- `CONTACT_DESTINATION_EMAIL` = `support@banditgenetics.com`

Do not put the SMTP token in git, Cursor chat, or any `NEXT_PUBLIC_*` variable. After changing Production env vars, trigger a new deployment so the runtime picks them up.
