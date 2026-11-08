"use client";

import { useLegislationCountdown } from "@/components/legislation/useLegislationCountdown";
import { legislationCopy } from "@/content/legislation";
import { LEGISLATION_DEADLINE_LABEL } from "@/lib/legislation-deadline";

export function LegislationVaultNote() {
  const countdown = useLegislationCountdown();
  const passed = countdown.phase === "passed";

  return (
    <aside
      aria-label="Federal date for this collection"
      className="mb-12 border border-white/10 border-t-gold/80 bg-charcoal/75"
    >
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="min-w-0">
          <p className="section-kicker">{legislationCopy.vaultKicker}</p>
          <p className="mt-2 font-display text-[clamp(1.7rem,3vw,2.35rem)] leading-[1.05] text-frost">
            {passed ? legislationCopy.passedBar : LEGISLATION_DEADLINE_LABEL}
          </p>
        </div>
        <p className="max-w-md text-[1.02rem] leading-relaxed text-ice/75">
          {passed ? legislationCopy.vaultPassed : legislationCopy.vaultUpcoming}
        </p>
        <a
          href={`/#${legislationCopy.sectionId}`}
          className="inline-flex min-h-11 shrink-0 items-center font-label text-ui tracking-[0.18em] text-gold uppercase hover:text-frost"
        >
          {legislationCopy.vaultLink}
        </a>
      </div>
    </aside>
  );
}
