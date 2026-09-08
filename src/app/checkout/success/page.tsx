import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { siteUrl } from "@/content/site";
import { formatUsd } from "@/lib/cart";
import { isInternalOrderId, getOrderById } from "@/lib/orders/repository";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order ticket",
  description: cartCopy.ticketSubmittedBody,
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
  const raw = params.order;
  const orderId = Array.isArray(raw) ? raw[0] : raw;
  const validId = orderId && isInternalOrderId(orderId) ? orderId : null;
  const order = validId ? await getOrderById(validId) : null;

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
            {order ? cartCopy.ticketSubmitted : cartCopy.checkoutTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-copy leading-relaxed text-ice/75">
            {order ? cartCopy.ticketSubmittedBody : cartCopy.ticketMissing}
          </p>
        </header>

        {order ? (
          <div className="grid max-w-3xl gap-4 border border-white/10 bg-charcoal px-5 py-6">
            <p className="text-copy text-ice">
              {cartCopy.orderLabel} {order.id}
            </p>
            <p className="text-copy text-ice">
              {cartCopy.merchandiseSubtotal}: {formatUsd(order.subtotalCents)}
            </p>
            <p className="text-copy text-ice">
              {cartCopy.shippingAmount}:{" "}
              {order.freeShipping
                ? cartCopy.shippingFree
                : formatUsd(order.shippingCents)}
            </p>
            {order.promotionalGiftApplied ? (
              <p className="text-copy text-ice">
                {cartCopy.promotionalGift}
                {order.promotionalStrainName
                  ? ` — ${order.promotionalStrainName}`
                  : ""}
                : {formatUsd(order.promotionalItemPriceCents)}
              </p>
            ) : null}
            <p className="text-copy text-ice">
              {cartCopy.orderTotal}: {formatUsd(order.totalCents)}
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/checkout" variant="secondary">
            Return to checkout
          </Button>
          <Button href="/vault">{cartCopy.continue}</Button>
        </div>
      </PageContainer>
    </main>
  );
}
