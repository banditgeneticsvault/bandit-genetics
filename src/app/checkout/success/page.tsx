import { ClearPaidCart } from "@/app/checkout/success/ClearPaidCart";
import { ConfirmPaymentPoll } from "@/app/checkout/success/ConfirmPaymentPoll";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { siteUrl } from "@/content/site";
import { lookupOrderForSession } from "@/lib/stripe/webhooks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout return",
  description: cartCopy.successPending,
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${siteUrl}/checkout/success`,
  },
};

export const dynamic = "force-dynamic";

function isSessionId(value: string) {
  return /^cs_(test|live)_[A-Za-z0-9]+$/.test(value);
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionIdRaw = params.session_id;
  const sessionId = Array.isArray(sessionIdRaw) ? sessionIdRaw[0] : sessionIdRaw;
  const validSession = sessionId && isSessionId(sessionId) ? sessionId : null;
  const lookup = validSession
    ? await lookupOrderForSession(validSession)
    : { order: null, sessionFound: false, sessionPaid: false };

  const paid = lookup.order?.status === "paid";
  const failed = lookup.order?.status === "payment_failed";
  const body = !validSession || !lookup.sessionFound
    ? cartCopy.successMissing
    : failed
      ? cartCopy.successFailed
      : paid
        ? cartCopy.successPaid
        : cartCopy.successPending;

  return (
    <main className="relative overflow-x-clip bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] vault-grate opacity-40"
        aria-hidden
      />
      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <header className="mb-12 max-w-3xl">
          <p className="section-kicker">{cartCopy.successKicker}</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5.8rem)] leading-[0.85] text-frost">
            {cartCopy.successTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-copy leading-relaxed text-ice/75">
            {body}
          </p>
        </header>
        {paid && lookup.order ? <ClearPaidCart orderId={lookup.order.id} /> : null}
        {validSession && lookup.sessionFound && !paid && !failed ? (
          <ConfirmPaymentPoll sessionId={validSession} />
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button href="/checkout" variant="secondary">
            Return to checkout
          </Button>
          <Button href="/vault">{cartCopy.continue}</Button>
        </div>
      </PageContainer>
    </main>
  );
}
