"use client";

import { useEffect, useId, useRef } from "react";
import { legislationCopy } from "@/content/legislation";
import { LEGISLATION_DEADLINE_LABEL } from "@/lib/legislation-deadline";
import { useLegislationClock } from "@/components/legislation/useLegislationCountdown";

function unitWord(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}

function spokenClock(
  phase: "upcoming" | "today" | "passed",
  days: number,
  hours: number,
  minutes: number,
) {
  if (phase === "passed") return `${legislationCopy.passedBar}. ${legislationCopy.timeNote}.`;
  if (phase === "today") return `${legislationCopy.today}. ${legislationCopy.timeNote}.`;
  const dayWord = unitWord(days, "day", "days");
  const hourWord = unitWord(hours, "hour", "hours");
  const minuteWord = unitWord(minutes, "minute", "minutes");
  return `${days} ${dayWord}, ${hours} ${hourWord}, ${minutes} ${minuteWord} until ${LEGISLATION_DEADLINE_LABEL}. ${legislationCopy.timeNote}.`;
}

function ClockUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="legislation-clock-unit">
      <span className="legislation-clock-value" suppressHydrationWarning>
        {value}
      </span>
      <span className="legislation-clock-label">{label}</span>
    </div>
  );
}

export function LegislationClock() {
  const clock = useLegislationClock();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const upcoming = clock.phase === "upcoming";
  const spoken = spokenClock(clock.phase, clock.days, clock.hours, clock.minutes);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const apply = () => {
      const { height } = node.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--legislation-clock-height",
        `${Math.ceil(height)}px`,
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [clock.phase]);

  const units = [
    {
      key: "days",
      value: clock.days,
      label: unitWord(clock.days, legislationCopy.clockDay, legislationCopy.clockDays),
    },
    {
      key: "hours",
      value: clock.hours,
      label: unitWord(clock.hours, legislationCopy.clockHour, legislationCopy.clockHours),
    },
    {
      key: "minutes",
      value: clock.minutes,
      label: unitWord(clock.minutes, legislationCopy.clockMinute, legislationCopy.clockMinutes),
    },
    {
      key: "seconds",
      value: clock.seconds,
      label: unitWord(clock.seconds, legislationCopy.clockSecond, legislationCopy.clockSeconds),
    },
  ];

  return (
    <div
      ref={panelRef}
      className="legislation-clock"
      role="region"
      aria-labelledby={titleId}
    >
      <p id={titleId} className="legislation-clock-kicker">
        {legislationCopy.clockKicker}
      </p>
      <p className="sr-only" aria-live="polite">
        {spoken}
      </p>
      <div aria-hidden>
        {upcoming ? (
          <div className="legislation-clock-units">
            {units.map((unit) => (
              <ClockUnit key={unit.key} value={unit.value} label={unit.label} />
            ))}
          </div>
        ) : (
          <p className="legislation-clock-status">
            {clock.phase === "today" ? legislationCopy.today : legislationCopy.passedKicker}
          </p>
        )}
        <p className="legislation-clock-date">{LEGISLATION_DEADLINE_LABEL}</p>
      </div>
    </div>
  );
}
