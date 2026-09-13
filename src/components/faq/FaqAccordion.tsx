"use client";

import { Fragment, useEffect } from "react";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { brand } from "@/content/site";
import type { FaqItem } from "@/content/faq";

function AnswerParagraph({ text }: { text: string }) {
  const email = brand.email;
  const parts = text.split(email);

  return (
    <p className="text-copy leading-relaxed text-ice/80">
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <OrderEmailLink /> : null}
        </Fragment>
      ))}
    </p>
  );
}

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <div className="border-t border-white/10">
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          className="group scroll-mt-28 border-b border-white/10"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-4 py-4 text-left marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="pt-0.5 font-sans text-[1.05rem] leading-snug text-frost md:text-copy">
              {item.question}
            </span>
            <span
              aria-hidden
              className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 text-gold transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none motion-reduce:group-open:rotate-0"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                <path
                  d="M8 2v12M2 8h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          </summary>
          <div className="max-w-3xl space-y-3 pb-5 pr-14">
            {item.paragraphs.map((paragraph) => (
              <AnswerParagraph key={paragraph} text={paragraph} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
