"use client";

import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/cn";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  label: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  name,
  label,
  className,
}: AddToCartButtonProps) {
  const { beginAdd } = useCart();

  return (
    <button
      type="button"
      aria-label={`Choose seed quantity for ${name}`}
      onClick={() => beginAdd(productId, name)}
      className={cn(className)}
    >
      {label}
    </button>
  );
}
