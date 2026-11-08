"use client";

import { LegislationFigure } from "@/components/legislation/LegislationCountdown";
import { useLegislationCountdown } from "@/components/legislation/useLegislationCountdown";
import { Button } from "@/components/ui/Button";
import { legislationCopy } from "@/content/legislation";
import { homeHero } from "@/content/site";

export function LegislationAnnouncement() {
  const countdown = useLegislationCountdown();
  const passed = countdown.phase === "passed";

  return (
    <section
      id={legislationCopy.sectionId}
      aria-labelledby="legislation-title"
      className="relative isolate scroll-mt-6 overflow-hidden border-t border-gold/40 bg-black"
    >
      <div className="pointer-events-none absolute inset-0 vault-grate opacity-[0.08]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_60%,rgb(11_36_31_/_0.95),transparent_52%),radial-gradient(ellipse_at_100%_0%,rgb(42_23_51_/_0.55),transparent_46%),radial-gradient(ellipse_at_72%_100%,rgb(184_149_85_/_0.08),transparent_42%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 vault-grain" aria-hidden />

      <div className="page-gutter relative mx-auto max-w-[92rem] py-16 md:py-24 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8">
          <div className="lg:col-span-7">
            <p className="section-kicker">{legislationCopy.kicker}</p>
            <div className="legislation-rule mt-4 h-px w-16 origin-left bg-gold" aria-hidden />
            <h2
              id="legislation-title"
              className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.1rem)] leading-[0.88] font-medium tracking-[-0.03em] text-frost uppercase"
            >
              {passed ? legislationCopy.passedHeadline : legislationCopy.headline}
            </h2>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <LegislationFigure countdown={countdown} />
          </div>

          <div className="lg:col-span-7 lg:row-start-2">
            <p className="max-w-xl text-copy leading-relaxed text-ice/80">
              {passed ? legislationCopy.passedSupport : legislationCopy.support}
            </p>
            <p className="mt-4 max-w-xl text-copy leading-relaxed text-ice/75">
              {passed ? legislationCopy.passedBandit : legislationCopy.bandit}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={homeHero.primaryCta.href}>{legislationCopy.cta}</Button>
              <Button href={legislationCopy.secondaryHref} variant="secondary">
                {legislationCopy.secondary}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-3xl border-t border-white/10 pt-6 text-[0.95rem] leading-relaxed text-ice/75 md:mt-16">
          {passed ? legislationCopy.passedNote : legislationCopy.note}
        </p>
      </div>
    </section>
  );
}
