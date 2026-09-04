"use client";

import { useEffect, useRef, useState } from "react";
import { brandQuotes } from "@/content/brand-quotes";
import { cn } from "@/lib/cn";

const HOLD_MS = 4500;
const TRANSITION_MS = 850;
const GAP_MS = 180;
const REDUCED_CROSSFADE_MS = 240;

type Phase = "in" | "out" | "prepare";

export function RotatingQuote() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");
  const indexRef = useRef(0);

  useEffect(() => {
    let holdTimer = 0;
    let fadeTimer = 0;
    let gapTimer = 0;
    let cancelled = false;

    const prefersReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clearCycle = () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(gapTimer);
    };

    const advance = () => {
      indexRef.current = (indexRef.current + 1) % brandQuotes.length;
      setIndex(indexRef.current);
    };

    const runCycle = () => {
      if (cancelled || document.hidden) return;

      holdTimer = window.setTimeout(() => {
        if (cancelled || document.hidden) return;

        if (prefersReducedMotion()) {
          setPhase("out");
          fadeTimer = window.setTimeout(() => {
            if (cancelled || document.hidden) return;
            advance();
            setPhase("in");
            runCycle();
          }, REDUCED_CROSSFADE_MS);
          return;
        }

        setPhase("out");
        fadeTimer = window.setTimeout(() => {
          if (cancelled || document.hidden) return;
          advance();
          setPhase("prepare");
          gapTimer = window.setTimeout(() => {
            if (cancelled || document.hidden) return;
            setPhase("in");
            runCycle();
          }, GAP_MS);
        }, TRANSITION_MS);
      }, HOLD_MS);
    };

    const onVisibility = () => {
      if (cancelled) return;
      clearCycle();
      setPhase("in");
      if (!document.hidden) runCycle();
    };

    runCycle();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearCycle();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const quote = brandQuotes[index];
  const motionClass =
    phase === "in"
      ? "hero-quote-in"
      : phase === "out"
        ? "hero-quote-out"
        : "hero-quote-prepare";

  return (
    <div className="mt-8 max-w-lg">
      <div className="relative grid">
        {brandQuotes.map((sizingQuote) => (
          <p
            key={sizingQuote}
            aria-hidden
            className="invisible col-start-1 row-start-1 font-display text-[clamp(1.65rem,3.4vw,2.7rem)] leading-[1.12] text-gold"
          >
            {sizingQuote}
          </p>
        ))}
        <p
          className={cn(
            "hero-quote col-start-1 row-start-1 font-display text-[clamp(1.65rem,3.4vw,2.7rem)] leading-[1.12] text-gold",
            motionClass,
          )}
        >
          {quote}
        </p>
      </div>
    </div>
  );
}
