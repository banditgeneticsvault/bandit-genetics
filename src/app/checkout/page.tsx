import { Suspense } from "react";
import { CheckoutDesk } from "@/app/checkout/CheckoutDesk";
import { PaymentUnavailableNotice } from "@/components/cart/PaymentUnavailableNotice";
import { PageContainer } from "@/components/layout/PageContainer";
import { cartCopy } from "@/content/cart";
import { siteUrl } from "@/content/site";
import { isPaymentEnabled } from "@/lib/payment";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: cartCopy.checkoutIntro,
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${siteUrl}/checkout`,
  },
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const paymentEnabled = isPaymentEnabled();

  return (
    <main className="relative overflow-x-clip bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] vault-grate opacity-40"
        aria-hidden
      />
      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <header className="mb-12 max-w-3xl">
          <p className="section-kicker">{cartCopy.checkoutKicker}</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5.8rem)] leading-[0.85] text-frost">
            {cartCopy.checkoutTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-copy leading-relaxed text-ice/75">
            {paymentEnabled ? cartCopy.checkoutIntroLive : cartCopy.checkoutIntro}
          </p>
        </header>
        <Suspense fallback={<p className="text-copy text-ice/60">Loading checkout.</p>}>
          <CheckoutDesk paymentEnabled={paymentEnabled} />
        </Suspense>
        {!paymentEnabled ? (
          <div className="mt-10 max-w-3xl border border-white/10 bg-charcoal px-5 py-6">
            <PaymentUnavailableNotice />
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}
