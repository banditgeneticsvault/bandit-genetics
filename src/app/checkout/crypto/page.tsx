import { CopyAddress } from "@/app/checkout/crypto/CopyAddress";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { siteUrl } from "@/content/site";
import { walletFor } from "@/lib/crypto/wallets";
import { formatUsd } from "@/lib/cart";
import { isInternalOrderId, getOrderById } from "@/lib/orders/repository";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto payment",
  description: cartCopy.cryptoUnpaid,
  robots: { index: false, follow: false },
  alternates: {
    canonical: `${siteUrl}/checkout/crypto`,
  },
};

export const dynamic = "force-dynamic";

export default async function CryptoCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.order;
  const orderId = Array.isArray(raw) ? raw[0] : raw;
  const validId = orderId && isInternalOrderId(orderId) ? orderId : null;
  const order = validId ? await getOrderById(validId) : null;
  const cryptoOrder =
    order && order.paymentMethod === "crypto" && order.cryptocurrency
      ? order
      : null;
  const wallet = cryptoOrder?.cryptocurrency
    ? walletFor(cryptoOrder.cryptocurrency)
    : null;
  const unpaid =
    cryptoOrder?.paymentStatus !== "paid" && cryptoOrder?.status !== "paid";

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
            {cryptoOrder ? cartCopy.cryptoSubmitted : cartCopy.checkoutTitle}
          </h1>
          {cryptoOrder && unpaid ? (
            <p className="mt-6 font-label text-ui tracking-[0.18em] text-gold uppercase">
              {cartCopy.cryptoPaymentRequired}
            </p>
          ) : null}
          <p className="mt-6 max-w-2xl text-copy leading-relaxed text-ice/75">
            {cryptoOrder
              ? unpaid
                ? cartCopy.cryptoUnpaid
                : cartCopy.cryptoVerified
              : cartCopy.successMissing}
          </p>
        </header>

        {cryptoOrder && wallet ? (
          <div className="grid max-w-3xl gap-6 border border-white/10 bg-charcoal px-5 py-6">
            <p className="text-copy text-ice">
              Order {cryptoOrder.id}
            </p>
            <p className="text-copy text-ice">
              {cartCopy.orderTotal}: {formatUsd(cryptoOrder.totalCents)} USD
            </p>
            <p className="text-copy text-ice/80">{cartCopy.cryptoAmountNote}</p>
            <p className="font-label text-ui tracking-[0.18em] text-gold uppercase">
              {wallet.label}
            </p>
            <CopyAddress value={wallet.address} />
            <p className="text-copy text-ice/80">{cartCopy.cryptoVerifyNote}</p>
            {cryptoOrder.transactionHash ? (
              <p className="break-all text-copy text-ice/70">
                Recorded hash (unverified): {cryptoOrder.transactionHash}
              </p>
            ) : null}
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
