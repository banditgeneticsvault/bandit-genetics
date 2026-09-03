import Image from "next/image";
import { ConfidenceStamp } from "@/components/dossier/ConfidenceStamp";
import {
  DossierPair,
  DossierSection,
} from "@/components/dossier/DossierSection";
import { LineagePanel } from "@/components/dossier/LineagePanel";
import { PendingPanel } from "@/components/dossier/PendingPanel";
import { RelatedGenetics } from "@/components/dossier/RelatedGenetics";
import { ResearchStatus } from "@/components/dossier/ResearchStatus";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { dossierCopy } from "@/content/dossier";
import {
  getInfluencesForStrain,
  getParentById,
  getRelatedStrains,
} from "@/data/genetics";
import { STRAIN_TYPE_LABELS, type StrainRecord } from "@/data/genetics/types";
import { hasArtworkSrc, isLandscapeArtwork } from "@/lib/artwork";
import { isPendingCopy } from "@/lib/pending";

function Body({ children }: { children: string }) {
  return (
    <p className="max-w-2xl text-[1.02rem] leading-relaxed text-ice/80">{children}</p>
  );
}

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
  const unknown = Boolean(value && value.includes("UNKNOWN"));

  return (
    <DossierSection id={id} title={title} kicker={kicker} compact={compact}>
      {isPendingCopy(value) ? (
        <PendingPanel label={dossierCopy.comingSoon} />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <ConfidenceStamp level="INFERRED" />
            {unknown ? <ConfidenceStamp level="UNKNOWN" /> : null}
          </div>
          <p className="w-full text-[1.02rem] leading-relaxed text-ice/80">
            {value as string}
          </p>
          <p className="mt-3 w-full text-[0.82rem] leading-relaxed text-ice/45">
            {dossierCopy.inferredReading}
          </p>
        </>
      )}
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
  const influences = getInfluencesForStrain(strain);
  const gallery = strain.galleryImages.filter(hasArtworkSrc);
  const landscapeHero = isLandscapeArtwork(strain.heroImage);

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

      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <header className="border-b border-white/10 pb-10">
          <p className="font-label text-[0.62rem] tracking-[0.28em] text-gold uppercase">
            {dossierCopy.classified} · {dossierCopy.restricted}
          </p>
          <div className="mt-4 flex flex-wrap items-start gap-x-8 gap-y-4 font-label text-[0.65rem] tracking-[0.16em] text-ice/55 uppercase">
            <span>File {strain.fileCode}</span>
            <span>{STRAIN_TYPE_LABELS[strain.type]}</span>
            <span>{strain.collection}</span>
            <span>{strain.status}</span>
          </div>

          <div className="mt-8 grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 className="max-w-4xl font-display text-[clamp(2.6rem,8vw,5.8rem)] leading-[0.85] text-frost">
                {strain.name}
              </h1>
              <p className="mt-5 max-w-2xl font-label text-[0.82rem] leading-relaxed tracking-[0.07em] text-ice uppercase">
                {strain.lineage}
              </p>
              {influences.length > 0 ? (
                <p className="mt-5 font-label text-[0.62rem] tracking-[0.18em] text-ice/45 uppercase">
                  Influence map: {influences.join(" · ")}
                </p>
              ) : null}
            </div>
            <p className="max-w-md text-[1.02rem] leading-relaxed text-ice/75 lg:col-span-5">
              {strain.shortDescription}
            </p>
          </div>
        </header>

        <div
          className={
            landscapeHero
              ? "mt-10 grid gap-8"
              : "mt-10 grid gap-8 lg:grid-cols-12 lg:items-start"
          }
        >
          <StrainMedia
            image={strain.heroImage}
            fileCode={strain.fileCode}
            theme={strain.theme}
            name={strain.name}
            labelled
            priority
            className={
              landscapeHero
                ? "w-full px-2 py-3 sm:px-4"
                : "lg:col-span-5 px-2 py-3 sm:px-3"
            }
            sizes={
              landscapeHero
                ? "(max-width: 768px) 100vw, 92rem"
                : "(max-width: 1024px) 100vw, 42vw"
            }
            imageClassName={
              landscapeHero
                ? "max-h-[min(70vh,36rem)]"
                : "max-h-[min(82vh,48rem)]"
            }
          />
          <div className={landscapeHero ? "max-w-3xl" : "lg:col-span-6 lg:col-start-7 lg:pt-4"}>
            <p className="font-label text-[0.62rem] tracking-[0.28em] text-gold uppercase">
              Opening statement
            </p>
            <p className="mt-4 font-display text-[clamp(1.45rem,2.6vw,2rem)] leading-snug text-frost">
              {strain.whyItsInTheVault}
            </p>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-ice/55">
              {dossierCopy.banditDidNotBreed.replace(
                "this parent",
                "the original parent genetics",
              )}
            </p>
          </div>
        </div>

        {gallery.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
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

        <div className="mt-16 flex flex-col gap-16 md:mt-24 md:gap-24">
          <LineagePanel
            strain={strain}
            parentOne={parentOne}
            parentTwo={parentTwo}
          />

          <DossierSection id="bandit-file" title={dossierCopy.banditFile} kicker="WHY IT IS HERE">
            <Body>{strain.longDescription}</Body>
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-ice/60">
              {strain.whyItsInTheVault}
            </p>
          </DossierSection>

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

          <CharacterSection
            id="resin"
            title={dossierCopy.resin}
            kicker="PRIMARY INTEREST"
            value={strain.resinExpression}
          />

          <DossierPair>
            <CharacterSection
              id="color"
              title={dossierCopy.color}
              kicker="VISUAL RANGE"
              value={strain.colorPotential}
              compact
            />
            <CharacterSection
              id="aroma"
              title={dossierCopy.aroma}
              kicker="NOSE AND PALATE"
              value={strain.aromaDirection}
              compact
            />
          </DossierPair>

          <CharacterSection
            id="lineage-character"
            title={dossierCopy.lineageCharacter}
            kicker="FAMILY TENSION"
            value={strain.lineageCharacter}
          />

          <CharacterSection
            id="breeding"
            title={dossierCopy.breeding}
            kicker="SELECTION"
            value={strain.breedingInterest}
          />

          <ResearchStatus
            strain={strain}
            parentOne={parentOne}
            parentTwo={parentTwo}
          />

          <DossierSection id="phenotype" title={dossierCopy.phenotype} kicker="FIELD NOTES">
            {isPendingCopy(strain.phenotypeNotes) ? (
              <PendingPanel label={dossierCopy.phenotypePending} />
            ) : (
              <Body>{strain.phenotypeNotes}</Body>
            )}
          </DossierSection>

          <DossierSection id="grow" title={dossierCopy.grow} kicker="GARDEN LOG">
            {isPendingCopy(strain.growNotes) ? (
              <PendingPanel label={dossierCopy.growPending} />
            ) : (
              <Body>{strain.growNotes}</Body>
            )}
          </DossierSection>

          <DossierSection id="quote" title={dossierCopy.quote} kicker="FILE REMARK">
            {strain.quote ? (
              <blockquote className="max-w-3xl font-display text-[clamp(1.6rem,4vw,2.8rem)] leading-[1.05] text-frost">
                <p>{strain.quote}</p>
              </blockquote>
            ) : (
              <PendingPanel label={dossierCopy.quotePending} />
            )}
          </DossierSection>

          <RelatedGenetics related={related} />

          <div className="border-t border-white/10 pt-10">
            <Button href="/vault" variant="secondary">
              {dossierCopy.returnVault}
            </Button>
          </div>
        </div>
      </PageContainer>
    </article>
  );
}
