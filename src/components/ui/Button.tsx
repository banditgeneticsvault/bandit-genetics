import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-frost bg-frost text-black hover:bg-ice hover:border-ice",
  secondary:
    "border-gunmetal bg-transparent text-ice hover:border-gold hover:text-gold",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center border px-6 text-center font-label text-ui font-semibold tracking-[0.22em] uppercase transition-colors sm:w-auto sm:min-w-[12.5rem]",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
