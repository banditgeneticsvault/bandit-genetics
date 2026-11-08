"use client";

import { useEffect, useState } from "react";
import {
  getLegislationClock,
  getLegislationCountdown,
  millisecondsUntilNextEasternDate,
  type LegislationClock,
  type LegislationCountdown,
} from "@/lib/legislation-deadline";

const MAX_WAIT_MS = 60_000;
const MIN_WAIT_MS = 1_000;

export function useLegislationCountdown(): LegislationCountdown {
  const [countdown, setCountdown] = useState(getLegislationCountdown);

  useEffect(() => {
    let timer = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      setCountdown((current) => {
        const next = getLegislationCountdown();
        if (
          current.daysRemaining === next.daysRemaining &&
          current.phase === next.phase
        ) {
          return current;
        }
        return next;
      });
      const remaining = millisecondsUntilNextEasternDate();
      const wait = Math.min(Math.max(remaining, MIN_WAIT_MS), MAX_WAIT_MS);
      timer = window.setTimeout(tick, wait);
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      tick();
    };

    tick();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return countdown;
}

function millisecondsUntilNextSecond(now = Date.now()) {
  const remainder = now % 1000;
  return remainder === 0 ? 1000 : 1000 - remainder;
}

export function useLegislationClock(): LegislationClock {
  const [clock, setClock] = useState(getLegislationClock);

  useEffect(() => {
    let timer = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const next = getLegislationClock();
      setClock((current) => {
        if (
          current.phase === next.phase &&
          current.days === next.days &&
          current.hours === next.hours &&
          current.minutes === next.minutes &&
          current.seconds === next.seconds
        ) {
          return current;
        }
        return next;
      });
      const wait =
        next.phase === "upcoming"
          ? millisecondsUntilNextSecond()
          : Math.min(Math.max(millisecondsUntilNextEasternDate(), MIN_WAIT_MS), MAX_WAIT_MS);
      timer = window.setTimeout(tick, wait);
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      tick();
    };

    tick();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return clock;
}
