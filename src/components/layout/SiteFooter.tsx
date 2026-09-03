import Link from "next/link";
import { brand, navItems } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 bg-charcoal">
      <div className="page-gutter mx-auto grid max-w-[92rem] gap-12 py-14 md:grid-cols-[1.4fr_0.8fr] md:items-end md:py-20">
        <div className="max-w-md">
          <p className="font-label text-[0.68rem] tracking-[0.28em] text-gold uppercase">
            {brand.philosophy}
          </p>
          <p className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.92] text-frost">
            {brand.wordmark}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col items-start gap-3 md:items-end">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-label text-[0.7rem] tracking-[0.24em] text-ice/60 uppercase hover:text-frost"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
