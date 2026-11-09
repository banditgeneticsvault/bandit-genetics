"use client";

import { useEffect, useId, useRef } from "react";
import { legislationCopy } from "@/content/legislation";
import { useLegislationClock } from "@/components/legislation/useLegislationCountdown";

function unitWord(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}

function spokenClock(days: number, hours: number, minutes: number) {
  const dayWord = unitWord(days, "day", "days");
  const hourWord = unitWord(hours, "hour", "hours");
  const minuteWord = unitWord(minutes, "minute", "minutes");
  return `${days} ${dayWord}, ${hours} ${hourWord}, ${minutes} ${minuteWord}. ${legislationCopy.timeNote}.`;
}

export function LegislationBar() {
  const clock = useLegislationClock();
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const noteId = useId();
  const upcoming = clock.phase === "upcoming";
  const units = [
    {
      key: "days",
      value: clock.days,
      label: unitWord(clock.days, legislationCopy.bannerDay, legislationCopy.bannerDays),
    },
    {
      key: "hours",
      value: clock.hours,
      label: unitWord(clock.hours, legislationCopy.bannerHour, legislationCopy.bannerHours),
    },
    { key: "minutes", value: clock.minutes, label: legislationCopy.bannerMinute },
    { key: "seconds", value: clock.seconds, label: legislationCopy.bannerSecond },
  ];

  useEffect(() => {
    const node = bannerRef.current;
    if (!node) return;

    const apply = () => {
      const { height } = node.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--legislation-bar-height",
        `${Math.ceil(height)}px`,
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [clock.phase]);

  return (
    <>
      <div
        ref={bannerRef}
        className="legislation-banner"
        role="region"
        aria-labelledby={titleId}
        aria-describedby={noteId}
      >
        <p id={titleId} className="legislation-banner-headline">
          {legislationCopy.bannerHeadline}
        </p>
        <p id={noteId} className="sr-only">
          {legislationCopy.bannerDistinction}
        </p>
        <p className="sr-only" aria-live="polite">
          {upcoming
            ? spokenClock(clock.days, clock.hours, clock.minutes)
            : clock.phase === "today"
              ? `${legislationCopy.today}. ${legislationCopy.bannerDistinction}`
              : `${legislationCopy.passedBar}. ${legislationCopy.bannerDistinction}`}
        </p>
        {upcoming ? (
          <p className="legislation-banner-clock" aria-hidden>
            {units.map((unit, index) => (
              <span key={unit.key}>
                {index > 0 ? <span className="legislation-banner-sep"> | </span> : null}
                <span className="legislation-banner-num" suppressHydrationWarning>
                  {unit.value}
                </span>{" "}
                <span className="legislation-banner-unit-label">{unit.label}</span>
              </span>
            ))}
          </p>
        ) : (
          <p className="legislation-banner-status">
            {clock.phase === "today" ? legislationCopy.today : legislationCopy.passedKicker}
          </p>
        )}
      </div>
      <div className="legislation-banner-spacer" aria-hidden />
    </>
  );
}
