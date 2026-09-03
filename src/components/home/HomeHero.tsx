import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { VaultAtmosphere } from "@/components/home/VaultAtmosphere";
import { brand, homeHero } from "@/content/site";
import { hasArtworkSrc } from "@/lib/artwork";

export function HomeHero() {
  const [firstLine, secondLine] = brand.slogan.split("\n");
  const artwork = homeHero.artwork;
  const showArtwork = hasArtworkSrc(artwork);

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden bg-black">
      <VaultAtmosphere softened={showArtwork} />

      <div className="page-gutter relative mx-auto flex min-h-[100dvh] max-w-[92rem] flex-col justify-start pt-28 pb-10 md:justify-center md:pt-32 md:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-6 lg:pb-6">
            <p className="font-label text-meta tracking-[0.32em] text-gold uppercase">
              {homeHero.classified}
            </p>
            <h1 className="mt-5 pr-4 font-display text-[clamp(3.1rem,12vw,8.4rem)] leading-[0.82] font-medium tracking-[-0.03em] text-frost lg:pr-8">
              BANDIT
              <span className="block text-ice/90">GENETICS</span>
            </h1>
            <p className="mt-8 max-w-md font-display text-[clamp(1.65rem,3.4vw,2.7rem)] leading-[1.05] text-frost">
              {firstLine}
              <span className="mt-1 block text-ice">{secondLine}</span>
            </p>
            <p className="mt-6 max-w-sm text-copy leading-relaxed text-ice/75">
              {brand.shortStatement}
            </p>
            <div className="mt-8">
              <Button href={homeHero.primaryCta.href}>
                {homeHero.primaryCta.label}
              </Button>
            </div>
          </div>

          {showArtwork ? (
            <figure className="order-first flex min-w-0 items-center justify-center lg:order-none lg:col-span-5 lg:col-start-8">
              <Image
                src={artwork.src}
                alt={artwork.alt || "Bandit Genetics brand artwork"}
                width={artwork.width ?? 1254}
                height={artwork.height ?? 1254}
                priority
                quality={90}
                sizes="(max-width: 1024px) 88vw, 38vw"
                className="h-auto w-auto max-h-[min(48vh,24rem)] max-w-full object-contain md:max-h-[min(62vh,34rem)]"
              />
            </figure>
          ) : null}
        </div>

        <p className="mt-14 font-label text-ui tracking-[0.34em] text-ice/45 uppercase md:mt-20">
          {brand.philosophy}
        </p>
      </div>
    </section>
  );
}
