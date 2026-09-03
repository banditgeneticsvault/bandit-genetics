"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navItems } from "@/content/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="page-gutter mx-auto flex max-w-[92rem] items-center justify-between gap-6 py-5 md:py-7">
        <Link
          href="/"
          className="shrink min-w-0 font-label text-[0.72rem] tracking-[0.18em] text-frost uppercase sm:tracking-[0.32em]"
        >
          <span className="sm:hidden">BANDIT</span>
          <span className="hidden sm:inline">{brand.wordmark}</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const current =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "font-label text-[0.68rem] tracking-[0.24em] uppercase transition-colors",
                      current ? "text-frost" : "text-ice/55 hover:text-frost",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-10 shrink-0 items-center border border-gunmetal px-3 font-label text-[0.68rem] tracking-[0.28em] text-ice uppercase lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-50 bg-black lg:hidden"
      >
        <div className="absolute inset-0 vault-grate opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgb(42_23_51_/_0.55),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgb(22_64_56_/_0.35),transparent_40%)]" aria-hidden />

        <div className="page-gutter relative flex h-full flex-col">
          <div className="flex items-center justify-between py-5">
            <p className="font-label text-[0.68rem] tracking-[0.28em] text-gold uppercase">
              Access panel
            </p>
            <button
              type="button"
              className="font-label text-[0.68rem] tracking-[0.28em] text-ice uppercase"
              onClick={() => setOpen(false)}
            >
              CLOSE
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-2">
              {navItems.map((item, index) => {
                const current =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="border-b border-white/8">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className="flex items-baseline justify-between py-4"
                      onClick={() => setOpen(false)}
                    >
                      <span className="font-display text-[clamp(2.25rem,10vw,3.5rem)] leading-none text-frost">
                        {item.label}
                      </span>
                      <span className="font-label text-[0.62rem] tracking-[0.22em] text-gunmetal uppercase">
                        0{index + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="pb-10 font-label text-[0.68rem] tracking-[0.28em] text-ice/50 uppercase">
            {brand.philosophy}
          </p>
        </div>
      </div>
    </header>
  );
}
