"use client";

import { useEffect, useState } from "react";
import {
  getLegislationCountdown,
  millisecondsUntilNextEasternDate,
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
