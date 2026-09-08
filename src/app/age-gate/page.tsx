import { Suspense } from "react";
import { AgeGateExperience } from "@/app/age-gate/AgeGateExperience";
import { ageGateCopy } from "@/content/age-gate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age verification",
  description: ageGateCopy.body,
  robots: { index: false, follow: false },
};

export default function AgeGatePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center bg-black">
          <p className="page-gutter text-copy text-ice/70">Confirming access.</p>
        </main>
      }
    >
      <AgeGateExperience />
    </Suspense>
  );
}
