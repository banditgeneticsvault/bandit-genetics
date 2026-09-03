import Link from "next/link";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { vaultCopy } from "@/content/site";
import type { VaultListItem } from "@/data/genetics/types";
import { cn } from "@/lib/cn";

const shells: Record<VaultListItem["theme"], string> = {
  METAL: "border-white/10 bg-charcoal",
  SILK: "border-purple/50 bg-black",
  FROST: "border-ice/20 bg-steel",
};

const mediaRatio: Record<VaultListItem["theme"], string> = {
  METAL: "aspect-[16/9]",
  SILK: "aspect-[5/3]",
  FROST: "aspect-[16/10]",
};

type StrainCardProps = {
  strain: VaultListItem;
};

export function StrainCard({ strain }: StrainCardProps) {
  return (
    <article
      className={cn("flex h-full flex-col border", shells[strain.theme])}
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3">
        <p className="font-label text-[0.62rem] tracking-[0.22em] text-gold uppercase">
          File {strain.fileCode}
        </p>
        <p className="text-right font-label text-[0.62rem] tracking-[0.18em] text-ice/55 uppercase">
          {strain.type}
          <span className="mt-1 block text-ice/35">{strain.collection}</span>
        </p>
      </header>

      <div className="px-4 pt-5 pb-4">
        <h2 className="font-display text-[clamp(1.55rem,2.8vw,2.2rem)] leading-[0.95] text-frost">
          {strain.name}
        </h2>
        <p className="mt-3 font-label text-[0.75rem] leading-relaxed tracking-[0.05em] text-ice uppercase">
          {strain.lineage}
        </p>
        {strain.difficulty ? (
          <p className="mt-3 font-label text-[0.62rem] tracking-[0.22em] text-gold uppercase">
            Difficulty {strain.difficulty}
          </p>
        ) : null}
      </div>

      <StrainMedia
        image={strain.heroImage}
        fileCode={strain.fileCode}
        theme={strain.theme}
        name={strain.name}
        className={mediaRatio[strain.theme]}
      />

      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="text-[0.92rem] leading-relaxed text-ice/75">
          {strain.shortDescription}
        </p>
        {strain.quote ? (
          <p className="mt-4 font-display text-lg leading-snug text-frost/80">
            {strain.quote}
          </p>
        ) : null}
        <Link
          href={`/strain/${strain.slug}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center border border-gunmetal px-4 font-label text-[0.68rem] tracking-[0.22em] text-ice uppercase hover:border-ice hover:text-frost sm:w-auto"
        >
          {vaultCopy.viewDossier}
        </Link>
      </div>
    </article>
  );
}
