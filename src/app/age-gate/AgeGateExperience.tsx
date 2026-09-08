"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { confirmAdultAge } from "@/app/age-gate/actions";
import { VaultAtmosphere } from "@/components/home/VaultAtmosphere";
import { Button } from "@/components/ui/Button";
import { ageGateCopy } from "@/content/age-gate";
import { homeHero } from "@/content/site";
import { hasArtworkSrc } from "@/lib/artwork";
import { safeAgeGateReturnPath } from "@/lib/age-gate";

export function AgeGateExperience() {
  const searchParams = useSearchParams();
  const from = safeAgeGateReturnPath(searchParams.get("from"));
  const [restricted, setRestricted] = useState(false);
  const artwork = homeHero.artwork;
  const showArtwork = hasArtworkSrc(artwork);

  return (
    <main className="relative isolate min-h-dvh overflow-x-clip bg-black">
      <VaultAtmosphere softened tone="page" background={homeHero.background} />

      <div className="page-gutter relative mx-auto flex min-h-dvh max-w-[42rem] flex-col justify-center py-16 md:py-24">
        {showArtwork ? (
          <Image
            src={artwork.src}
            alt=""
            width={88}
            height={88}
            priority
            className="mb-8 h-14 w-14 object-contain"
          />
        ) : null}

        {restricted ? (
          <section aria-labelledby="age-restricted-title">
            <p className="section-kicker">{ageGateCopy.deniedKicker}</p>
            <h1
              id="age-restricted-title"
              className="mt-4 font-display text-[clamp(2.6rem,10vw,5.4rem)] leading-[0.86] text-frost"
            >
              {ageGateCopy.deniedTitle}
            </h1>
            <p className="mt-6 max-w-xl text-copy leading-relaxed text-ice/80">
              {ageGateCopy.deniedBody}
            </p>
            <div className="mt-10">
              <Button type="button" onClick={() => setRestricted(false)}>
                {ageGateCopy.returnToGate}
              </Button>
            </div>
          </section>
        ) : (
          <section aria-labelledby="age-gate-title">
            <p className="section-kicker">{ageGateCopy.kicker}</p>
            <h1
              id="age-gate-title"
              className="mt-4 font-display text-[clamp(2.6rem,10vw,5.4rem)] leading-[0.86] text-frost"
            >
              {ageGateCopy.title}
            </h1>
            <p className="mt-6 max-w-xl text-copy leading-relaxed text-ice/80">
              {ageGateCopy.body}
            </p>
            <form action={confirmAdultAge} className="mt-10 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="from" value={from} />
              <Button type="submit" className="w-full sm:w-full">
                {ageGateCopy.yes}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-full"
                onClick={() => setRestricted(true)}
              >
                {ageGateCopy.no}
              </Button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
