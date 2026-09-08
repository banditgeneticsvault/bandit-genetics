"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AGE_GATE_PATH } from "@/lib/age-gate";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ageGate = pathname === AGE_GATE_PATH || pathname.startsWith(`${AGE_GATE_PATH}/`);

  if (ageGate) {
    return children;
  }

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-frost focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>
      <SiteHeader />
      <div id="content" className="flex-1">
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
