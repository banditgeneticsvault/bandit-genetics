import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

type OrderEmailLinkProps = {
  className?: string;
};

export function OrderEmailLink({ className }: OrderEmailLinkProps) {
  return (
    <a
      href={`mailto:${brand.email}`}
      className={cn(
        "break-all text-gold underline decoration-gold/50 underline-offset-4 hover:text-frost hover:decoration-frost",
        className,
      )}
    >
      {brand.email}
    </a>
  );
}
