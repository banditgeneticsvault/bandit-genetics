import Link from "next/link";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { brand, navItems } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 bg-charcoal">
      <div className="page-gutter mx-auto grid max-w-[92rem] gap-12 py-14 md:grid-cols-[1.4fr_0.8fr] md:items-end md:py-16">
        <div className="max-w-md">
          <p className="font-label text-kicker tracking-[0.18em] text-gold">
            {brand.philosophy}
          </p>
          <p className="mt-4 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.92] text-frost">
            {brand.wordmark}
          </p>
          <p className="mt-5 max-w-sm break-words text-copy leading-relaxed text-ice/70">
            Submit an order request at checkout. For questions, email{" "}
            <OrderEmailLink />.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col items-start gap-3 md:items-end">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-label text-ui tracking-[0.24em] text-ice/60 uppercase hover:text-frost"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="page-gutter mx-auto max-w-[92rem] border-t border-white/8 py-8 md:py-10">
        <p className="section-kicker mb-4">Connect</p>
        <SocialLinks />
      </div>
    </footer>
  );
}
