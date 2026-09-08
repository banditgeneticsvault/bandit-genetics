"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { SeedSelectDialog } from "@/components/cart/SeedSelectDialog";
import { AGE_GATE_PATH } from "@/lib/age-gate";

export function AppProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ageGate = pathname === AGE_GATE_PATH || pathname.startsWith(`${AGE_GATE_PATH}/`);

  if (ageGate) {
    return children;
  }

  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <SeedSelectDialog />
      <CartToast />
    </CartProvider>
  );
}
