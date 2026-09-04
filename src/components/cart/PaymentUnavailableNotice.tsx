import { OrderEmailLink } from "@/components/layout/OrderEmailLink";

export function PaymentUnavailableNotice() {
  return (
    <p className="max-w-3xl text-copy leading-relaxed text-ice/80">
      Card checkout cannot start because Stripe is not configured on this server.
      Nothing will be charged by card. Email{" "}
      <OrderEmailLink /> if you need help, or use PAY LATER / PAY WITH CRYPTO.
      Submitting crypto does not mark the order paid.
    </p>
  );
}
