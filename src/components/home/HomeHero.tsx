import { Button } from "@/components/ui/Button";
import { VaultAtmosphere } from "@/components/home/VaultAtmosphere";
import { brand, homeHero } from "@/content/site";

export function HomeHero() {
  const [firstLine, secondLine] = brand.slogan.split("\n");

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-black">
      <VaultAtmosphere />

      <div className="page-gutter relative mx-auto flex min-h-[100dvh] max-w-[92rem] flex-col justify-end pt-28 pb-10 md:justify-center md:pt-32 md:pb-16">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:pb-6">
            <p className="font-label text-[0.62rem] tracking-[0.32em] text-gold uppercase">
              {homeHero.classified}
            </p>
            <h1 className="mt-5 font-display text-[clamp(3.1rem,12vw,8.4rem)] leading-[0.82] font-medium tracking-[-0.03em] text-frost">
              BANDIT
              <span className="block text-ice/90">GENETICS</span>
            </h1>
          </div>

          <div className="max-w-md lg:col-span-5 lg:col-start-8 lg:mb-4 lg:justify-self-end">
            <p className="font-display text-[clamp(1.65rem,3.4vw,2.7rem)] leading-[1.05] text-frost">
              {firstLine}
              <span className="mt-1 block text-ice">{secondLine}</span>
            </p>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ice/75">
              {brand.shortStatement}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={homeHero.primaryCta.href}>
                {homeHero.primaryCta.label}
              </Button>
              <Button href={homeHero.secondaryCta.href} variant="secondary">
                {homeHero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-14 font-label text-[0.68rem] tracking-[0.34em] text-ice/45 uppercase md:mt-20">
          {brand.philosophy}
        </p>
      </div>
    </section>
  );
}
