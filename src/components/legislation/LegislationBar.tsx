"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { legislationCopy } from "@/content/legislation";
import {
  LEGISLATION_DEADLINE_LABEL,
  LEGISLATION_DEADLINE_SHORT,
} from "@/lib/legislation-deadline";
import { useLegislationCountdown } from "@/components/legislation/useLegislationCountdown";

function daysLabel(days: number) {
  return days === 1 ? legislationCopy.dayRemaining : legislationCopy.daysRemaining;
}

function statusText(days: number, phase: "upcoming" | "today" | "passed") {
  if (phase === "passed") {
    return `${legislationCopy.passedBar}. ${legislationCopy.timeNote}.`;
  }
  const unit = days === 1 ? "day" : "days";
  if (phase === "today") {
    return `${legislationCopy.today}. ${unit} remaining. ${legislationCopy.timeNote}.`;
  }
  return `${days} ${unit} remaining until ${LEGISLATION_DEADLINE_LABEL}. ${legislationCopy.timeNote}.`;
}

export function LegislationBar() {
  const countdown = useLegislationCountdown();
  const pathname = usePathname();
  const onVault = pathname === "/vault";
  const storyHref =
    pathname === "/" ? `#${legislationCopy.sectionId}` : `/#${legislationCopy.sectionId}`;
  const passed = countdown.phase === "passed";
  const status = statusText(countdown.daysRemaining, countdown.phase);

  const readout = (
    <>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
      <span aria-hidden className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {passed ? (
          <span className="truncate font-label text-[0.72rem] tracking-[0.14em] text-frost uppercase sm:text-[0.8rem] sm:tracking-[0.18em]">
            {legislationCopy.passedBar}
          </span>
        ) : (
          <>
            <span
              className="font-display text-[1.65rem] leading-none tabular-nums text-frost"
              suppressHydrationWarning
            >
              {countdown.daysRemaining}
            </span>
            <span className="truncate font-label text-[0.72rem] tracking-[0.14em] text-ice uppercase sm:text-[0.8rem] sm:tracking-[0.18em]">
              <span className="sm:hidden">
                {countdown.daysRemaining === 1 ? "Day" : "Days"} · {LEGISLATION_DEADLINE_SHORT}
              </span>
              <span className="hidden sm:inline">
                {daysLabel(countdown.daysRemaining)}
                <span className="text-gold"> · </span>
                {LEGISLATION_DEADLINE_LABEL}
              </span>
            </span>
          </>
        )}
      </span>
    </>
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
            className="inline-flex h-full shrink-0 items-center font-label text-[0.72rem] tracking-[0.16em] text-gold uppercase hover:text-frost sm:text-[0.8rem] sm:tracking-[0.2em]"
          >
            {legislationCopy.barStory}
          </a>
        ) : (
          <Link
            href="/vault"
            className="inline-flex h-full shrink-0 items-center font-label text-[0.72rem] tracking-[0.16em] text-gold uppercase hover:text-frost sm:text-[0.8rem] sm:tracking-[0.2em]"
          >
            <span className="sm:hidden">{legislationCopy.barCtaShort}</span>
            <span className="hidden sm:inline">{legislationCopy.barCta}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
