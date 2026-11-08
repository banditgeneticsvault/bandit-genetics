"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { legislationCopy } from "@/content/legislation";
import {
  LEGISLATION_DEADLINE_LABEL,
  LEGISLATION_DEADLINE_SHORT,
} from "@/lib/legislation-deadline";
import { useLegislationCountdown } from "@/components/legislation/useLegislationCountdown";

function barLabel(phase: "upcoming" | "today" | "passed") {
  if (phase === "passed") return legislationCopy.passedBar;
  if (phase === "today") return legislationCopy.today;
  return `${legislationCopy.clockKicker} · ${LEGISLATION_DEADLINE_LABEL}`;
}

export function LegislationBar() {
  const countdown = useLegislationCountdown();
  const pathname = usePathname();
  const onVault = pathname === "/vault";
  const storyHref =
    pathname === "/" ? `#${legislationCopy.sectionId}` : `/#${legislationCopy.sectionId}`;
  const label = barLabel(countdown.phase);

  const readout = (
    <span className="truncate font-label text-[0.72rem] tracking-[0.14em] text-frost uppercase sm:text-[0.8rem] sm:tracking-[0.18em]">
      <span className="sm:hidden">{LEGISLATION_DEADLINE_SHORT}</span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );

  return (
    <div
      className="legislation-bar overflow-hidden border-b border-gold/35 bg-emerald-deep text-frost"
      role="region"
      aria-label={legislationCopy.regionLabel}
    >
      <div className="page-gutter mx-auto flex h-full max-w-[92rem] items-center justify-between gap-3">
        {onVault ? (
          <p className="flex min-w-0 items-center">{readout}</p>
        ) : (
          <a href={storyHref} className="flex h-full min-w-0 items-center">
            {readout}
          </a>
        )}

        {onVault ? (
          <a
            href={storyHref}
            className="legislation-clock-clearance inline-flex h-full shrink-0 items-center font-label text-[0.72rem] tracking-[0.16em] text-gold uppercase hover:text-frost sm:text-[0.8rem] sm:tracking-[0.2em]"
          >
            {legislationCopy.barStory}
          </a>
        ) : (
          <Link
            href="/vault"
            className="legislation-clock-clearance inline-flex h-full shrink-0 items-center font-label text-[0.72rem] tracking-[0.16em] text-gold uppercase hover:text-frost sm:text-[0.8rem] sm:tracking-[0.2em]"
          >
            <span className="sm:hidden">{legislationCopy.barCtaShort}</span>
            <span className="hidden sm:inline">{legislationCopy.barCta}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
