"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand, navItems } from "@/content/site";
import { cartCopy } from "@/content/cart";
import { homeArtworkSrc } from "@/lib/artwork";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/cart/CartProvider";

function CartGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none">
      <path
        d="M4 5h1.6l1.2 9.2h11.1L19.6 8H8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="19" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const { itemCount, ready, openCart } = useCart();

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

  const count = ready ? itemCount : 0;

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="page-gutter mx-auto flex max-w-[92rem] items-center justify-between gap-4 py-4 md:gap-6 md:py-5">
        <Link
          href="/"
          aria-label="Bandit Genetics home"
          className="relative z-10 flex shrink-0 items-center"
        >
          <Image
            src={homeArtworkSrc("frost-queen-bandit.png")}
            alt="Bandit Genetics home"
            width={88}
            height={88}
            priority
            className="h-12 w-12 object-contain sm:h-[3.25rem] sm:w-[3.25rem]"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7 xl:gap-8">
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
                      "font-label text-ui tracking-[0.22em] uppercase transition-colors",
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={count > 0 ? `${cartCopy.openCart}, ${count}` : cartCopy.openCart}
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center border border-gunmetal text-ice hover:border-gold hover:text-gold"
          >
            <CartGlyph />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-5 bg-gold px-1 text-center font-label text-[0.7rem] leading-5 text-black">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center border border-gunmetal px-3 font-label text-ui tracking-[0.24em] text-ice uppercase lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
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
            <p className="section-kicker">
              Access panel
            </p>
            <button
              type="button"
              className="font-label text-ui tracking-[0.28em] text-ice uppercase"
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
                      <span className="font-label text-meta tracking-[0.22em] text-gunmetal uppercase">
                        0{index + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="pb-10 font-label text-ui tracking-[0.18em] text-ice/50">
            {brand.philosophy}
          </p>
        </div>
      </div>
    </header>
  );
}
