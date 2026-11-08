"use client";

import { legislationCopy } from "@/content/legislation";
import {
  LEGISLATION_DEADLINE_LABEL,
  type LegislationCountdown as CountdownState,
} from "@/lib/legislation-deadline";

function daysLabel(days: number) {
  return days === 1 ? legislationCopy.dayRemaining : legislationCopy.daysRemaining;
}

export function LegislationFigure({ countdown }: { countdown: CountdownState }) {
  const passed = countdown.phase === "passed";
  const today = countdown.phase === "today";

  return (
    <div className="relative flex min-h-[17rem] flex-col items-center justify-center bg-black/55 px-6 py-10 sm:min-h-[20rem] sm:px-10 sm:py-12">
      <span className="absolute top-0 left-0 h-8 w-px bg-gold" aria-hidden />
      <span className="absolute top-0 left-0 h-px w-8 bg-gold" aria-hidden />
      <span className="absolute top-0 right-0 h-8 w-px bg-gold" aria-hidden />
      <span className="absolute top-0 right-0 h-px w-8 bg-gold" aria-hidden />
      <span className="absolute bottom-0 left-0 h-8 w-px bg-gold" aria-hidden />
      <span className="absolute bottom-0 left-0 h-px w-8 bg-gold" aria-hidden />
      <span className="absolute right-0 bottom-0 h-8 w-px bg-gold" aria-hidden />
      <span className="absolute right-0 bottom-0 h-px w-8 bg-gold" aria-hidden />

      <p className="section-kicker text-center">
        {passed ? legislationCopy.passedKicker : daysLabel(countdown.daysRemaining)}
      </p>

      {passed ? (
        <p className="mt-6 text-center font-display text-[clamp(2.4rem,6vw,3.6rem)] leading-[0.92] text-frost">
          {LEGISLATION_DEADLINE_LABEL}
        </p>
      ) : (
        <p
          className="mt-3 text-center font-display text-[clamp(6.5rem,18vw,10.5rem)] leading-[0.82] font-medium tabular-nums tracking-[-0.04em] text-frost"
          suppressHydrationWarning
        >
          <span className="inline-block min-w-[2ch]">{countdown.daysRemaining}</span>
        </p>
      )}

      <p className="mt-4 text-center font-label text-ui tracking-[0.22em] text-gold uppercase">
        {passed ? legislationCopy.timeNote : today ? legislationCopy.today : legislationCopy.until}
      </p>
      {passed ? null : (
        <p className="mt-3 text-center font-label text-meta tracking-[0.16em] text-ice/75 uppercase">
          {legislationCopy.timeNote}
        </p>
      )}
    </div>
  );
}
