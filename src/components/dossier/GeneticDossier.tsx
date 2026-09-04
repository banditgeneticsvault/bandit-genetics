import Image from "next/image";
import {
  DossierPair,
  DossierSection,
  dossierKickerClass,
} from "@/components/dossier/DossierSection";
import { AddToCartPanel } from "@/components/cart/AddToCartPanel";
import { RelatedGenetics } from "@/components/dossier/RelatedGenetics";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteBreadcrumb } from "@/components/seo/SiteBreadcrumb";
import { dossierCopy } from "@/content/dossier";
import { getParentById, getRelatedStrains } from "@/data/genetics";
import { STRAIN_TYPE_LABELS, type StrainRecord } from "@/data/genetics/types";
import { toOrderListing } from "@/data/order";
import { hasArtworkSrc } from "@/lib/artwork";
import { cn } from "@/lib/cn";
import { isPendingCopy } from "@/lib/pending";

function CharacterSection({
  id,
  title,
  kicker,
  value,
  compact = false,
}: {
  id: string;
  title: string;
  kicker: string;
  value?: string;
  compact?: boolean;
}) {
  if (isPendingCopy(value)) return null;

  return (
    <DossierSection id={id} title={title} kicker={kicker} compact={compact}>
      <p className="w-full text-copy-lg leading-relaxed text-ice/80">
        {value as string}
      </p>
    </DossierSection>
  );
}

type GeneticDossierProps = {
  strain: StrainRecord;
};

export function GeneticDossier({ strain }: GeneticDossierProps) {
  const parentOne = getParentById(strain.parentOneId);
  const parentTwo = getParentById(strain.parentTwoId);

  if (!parentOne || !parentTwo) {
    throw new Error(`Missing parent records for ${strain.name}.`);
  }

  const related = getRelatedStrains(strain);
  const listing = toOrderListing(strain.slug);
  const gallery = strain.galleryImages.filter(hasArtworkSrc);
  const showResin = !isPendingCopy(strain.resinExpression);
  const showColor = !isPendingCopy(strain.colorPotential);
  const showAroma = !isPendingCopy(strain.aromaDirection);

  return (
    <article className="relative overflow-x-clip bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] vault-grate opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_0%_0%,rgb(42_23_51_/_0.4),transparent_42%),radial-gradient(ellipse_at_100%_0%,rgb(22_64_56_/_0.35),transparent_40%)]"
        aria-hidden
      />

      <PageContainer width="wide" className="relative pt-28 pb-16 md:pt-36 md:pb-24">
        <SiteBreadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "The Vault", href: "/vault" },
            { name: strain.name },
          ]}
        />
        <header className="border-b border-white/10 pb-8">
          <h1 className="max-w-4xl font-display text-[clamp(2.6rem,8vw,5.8rem)] leading-[0.85] text-frost">
            {strain.name}
          </h1>
          <p className={cn("mt-4", dossierKickerClass)}>
            {STRAIN_TYPE_LABELS[strain.type]}
          </p>
          <p className="mt-4 max-w-2xl font-label text-copy leading-relaxed tracking-[0.07em] text-ice uppercase">
            {parentOne.name} × {parentTwo.name}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10">
          <StrainMedia
            image={strain.heroImage}
            theme={strain.theme}
            name={strain.name}
            labelled
            priority
            className="min-w-0 w-full px-1 py-2"
            sizes="(max-width: 768px) 100vw, 46vw"
            imageClassName="max-h-[min(78vh,44rem)]"
          />
          <DossierSection
            id="bandit-file"
            title={dossierCopy.banditFile}
            kicker="WHY IT IS HERE"
          >
            <p className="max-w-prose text-copy-lg leading-relaxed text-ice/80">
              {strain.shortDescription}
            </p>
            <p className="mt-4 max-w-prose text-copy-lg leading-relaxed text-ice/80">
              {strain.longDescription}
            </p>
          </DossierSection>
        </div>

        {gallery.length > 0 ? (
          <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((image) => (
              <li key={image.src} className="flex items-center justify-center bg-black p-2">
                <Image
                  src={image.src}
                  alt={image.alt || strain.name}
                  width={image.width ?? 1200}
                  height={image.height ?? 1600}
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="h-auto w-auto max-h-80 max-w-full object-contain"
                />
              </li>
            ))}
          </ul>
        ) : null}

        {listing ? (
          <div className="mt-10 md:mt-12">
            <AddToCartPanel listing={listing} />
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-10 md:mt-12 md:gap-12">
          <DossierPair>
            <CharacterSection
              id="plant"
              title={dossierCopy.plant}
              kicker="STRUCTURE"
              value={strain.plantCharacter}
              compact
            />
            <CharacterSection
              id="flower"
              title={dossierCopy.flower}
              kicker="FORMATION"
              value={strain.flowerCharacter}
              compact
            />
          </DossierPair>

          {showColor || showAroma ? (
            <DossierPair>
              <CharacterSection
                id="color"
                title={dossierCopy.color}
                kicker="COLOR"
                value={strain.colorPotential}
                compact
              />
              <CharacterSection
                id="aroma"
                title={dossierCopy.aroma}
                kicker="AROMA"
                value={strain.aromaDirection}
                compact
              />
            </DossierPair>
          ) : null}

          {showResin ? (
            <CharacterSection
              id="resin"
              title={dossierCopy.resin}
              kicker="RESIN"
              value={strain.resinExpression}
            />
          ) : null}

          <RelatedGenetics related={related} />

          <div className="border-t border-white/10 pt-8">
            <Button href="/vault" variant="secondary">
              {dossierCopy.returnVault}
            </Button>
          </div>
        </div>
      </PageContainer>
    </article>
  );
}
