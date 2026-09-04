import { ClearPaidCart } from "@/app/checkout/success/ClearPaidCart";
import { ConfirmPaymentPoll } from "@/app/checkout/success/ConfirmPaymentPoll";
import { OrderConfirmedSummary } from "@/app/checkout/success/OrderConfirmedSummary";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { siteUrl } from "@/content/site";
import { readPendingOrderCookie } from "@/lib/orders/pending-cookie";
import { isStripeCheckoutSessionId } from "@/lib/stripe/association";
import { confirmCheckoutReturn } from "@/lib/stripe/webhooks";
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

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionIdRaw = params.session_id;
  const sessionId = Array.isArray(sessionIdRaw) ? sessionIdRaw[0] : sessionIdRaw;
  const validSession =
    sessionId && isStripeCheckoutSessionId(sessionId) ? sessionId : null;
  const cookieOrderId = await readPendingOrderCookie();
  const result = validSession
    ? await confirmCheckoutReturn(validSession, cookieOrderId)
    : {
        order: null,
        sessionFound: false,
        sessionPaid: false,
        view: "missing" as const,
      };

  const confirmed = result.view === "confirmed" && result.order;
  const title = confirmed ? cartCopy.orderConfirmed : cartCopy.successTitle;
  const body = !validSession || result.view === "missing"
    ? cartCopy.successMissing
    : result.view === "failed"
      ? cartCopy.successFailed
      : result.view === "confirmed"
        ? cartCopy.paymentConfirmed
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
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-copy leading-relaxed text-ice/75">
            {body}
          </p>
        </header>
        {confirmed && result.order ? (
          <>
            <ClearPaidCart orderId={result.order.id} />
            <OrderConfirmedSummary order={result.order} />
          </>
        ) : null}
        {validSession && result.view === "pending" ? (
          <ConfirmPaymentPoll sessionId={validSession} />
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {confirmed ? null : (
            <Button href="/checkout" variant="secondary">
              Return to checkout
            </Button>
          )}
          <Button href="/vault">{cartCopy.continue}</Button>
        </div>
      </PageContainer>
    </main>
  );
}
