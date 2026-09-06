import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { Button } from "@/components/ui/Button";
import { cartCopy } from "@/content/cart";
import { orderMailto } from "@/lib/order-email";
import { cn } from "@/lib/cn";

type EmailOrderCtaProps = {
  strainName?: string;
  compact?: boolean;
  hideIntro?: boolean;
  className?: string;
};

export function EmailOrderCta({
  strainName,
  compact = false,
  hideIntro = false,
  className,
}: EmailOrderCtaProps) {
  return (
    <div className={cn("grid min-w-0 gap-3", className)}>
      {compact || hideIntro ? null : (
        <p className="text-copy leading-relaxed text-ice/80">
          {cartCopy.emailOrderBody} <OrderEmailLink />. {cartCopy.emailOrderCryptoNote}
        </p>
      )}
      <Button href={orderMailto({ strainName })} variant="secondary">
        {cartCopy.emailOrderCta}
      </Button>
      {compact ? (
        <p className="break-words text-copy leading-relaxed text-ice/70">
          {cartCopy.emailOrderCompact} <OrderEmailLink />.
        </p>
      ) : null}
    </div>
  );
}
