"use client";

import type { ReactNode } from "react";
import { LegislationBar } from "@/components/legislation/LegislationBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-frost focus:px-4 focus:py-3 focus:text-black"
      >
        Skip to content
      </a>
      <div className="absolute inset-x-0 top-0 z-40">
        <LegislationBar />
        <SiteHeader />
      </div>
      <div id="content" className="flex-1">
        {children}
      </div>
      <SiteFooter />
    </>
  );
}
