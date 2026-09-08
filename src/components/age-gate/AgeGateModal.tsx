"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { confirmAdultAge } from "@/app/age-gate/actions";
import { Button } from "@/components/ui/Button";
import { ageGateCopy } from "@/content/age-gate";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AgeGateModal() {
  const router = useRouter();
  const [restricted, setRestricted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("age-gate-lock");
    return () => {
      html.classList.remove("age-gate-lock");
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.focus();

    function focusables() {
      return Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (node) => node.tabIndex !== -1,
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = focusables();
      if (nodes.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog?.contains(active))) {
        event.preventDefault();
        last.focus();
        return;
      }
      if (!event.shiftKey && (active === last || !dialog?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [restricted]);

  const title = restricted ? ageGateCopy.deniedTitle : ageGateCopy.title;
  const body = restricted ? ageGateCopy.deniedBody : ageGateCopy.body;
  const kicker = restricted ? ageGateCopy.deniedKicker : ageGateCopy.kicker;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/78" aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[26.5rem] overflow-y-auto overscroll-contain border border-white/12 bg-charcoal px-5 py-6 outline-none md:px-6 md:py-7"
      >
        <p className="section-kicker">{kicker}</p>
        <h2
          id={titleId}
          className="mt-3 font-display text-[clamp(1.85rem,7vw,2.55rem)] leading-[0.9] text-frost"
        >
          {title}
        </h2>
        <p id={descriptionId} className="mt-4 text-copy leading-relaxed text-ice/80">
          {body}
        </p>

        {restricted ? (
          <div className="mt-7">
            <Button
              type="button"
              className="w-full sm:w-full"
              onClick={() => setRestricted(false)}
            >
              {ageGateCopy.returnToGate}
            </Button>
          </div>
        ) : (
          <form
            action={async () => {
              await confirmAdultAge();
              router.refresh();
            }}
            className="mt-7 grid gap-3"
          >
            <AgeGateChoices onUnder21={() => setRestricted(true)} />
          </form>
        )}
      </div>
    </div>
  );
}

function AgeGateChoices({ onUnder21 }: { onUnder21: () => void }) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button type="submit" disabled={pending} className="w-full sm:w-full">
        {ageGateCopy.yes}
      </Button>
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        className="w-full sm:w-full"
        onClick={onUnder21}
      >
        {ageGateCopy.no}
      </Button>
    </>
  );
}
