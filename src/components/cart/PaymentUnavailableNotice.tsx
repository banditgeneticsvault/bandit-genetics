import { OrderEmailLink } from "@/components/layout/OrderEmailLink";

export function PaymentUnavailableNotice() {
  return (
    <p className="max-w-3xl text-copy leading-relaxed text-ice/80">
      Payment processing is not currently enabled. Nothing will be charged. Email
      us at <OrderEmailLink /> to place your first order. Payment system is not
      configured at this time.
    </p>
  );
}
