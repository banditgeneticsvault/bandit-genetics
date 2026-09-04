"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ConfirmPaymentPoll({ sessionId }: { sessionId: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    async function tick() {
      attempts += 1;
      try {
        const response = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (response.ok) {
          const body = (await response.json()) as { paid?: boolean };
          if (body.paid) {
            router.refresh();
            return;
          }
        }
      } catch {
        // Keep the pending confirmation state. Do not treat network errors as paid.
      }
      if (!cancelled && attempts < 8) {
        window.setTimeout(tick, 2000);
      }
    }

    const timer = window.setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [router, sessionId]);

  return null;
}
