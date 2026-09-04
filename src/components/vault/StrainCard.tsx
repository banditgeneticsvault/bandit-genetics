import Link from "next/link";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { vaultCopy } from "@/content/site";
import type { VaultListItem } from "@/data/genetics/types";
import { STRAIN_TYPE_LABELS } from "@/data/genetics/types";
import { pickVaultImage } from "@/lib/artwork";

type StrainCardProps = {
  strain: VaultListItem;
};

export function StrainCard({ strain }: StrainCardProps) {
  return (
    <article className="flex h-full flex-col border border-white/10 bg-charcoal">
      <header className="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3">
        <p className="font-label text-meta tracking-[0.18em] text-gold uppercase">
          {STRAIN_TYPE_LABELS[strain.type]}
        </p>
      </header>

      <div className="px-4 pt-5 pb-4">
        <h2 className="font-display text-[clamp(1.55rem,2.8vw,2.2rem)] leading-[0.95] text-frost">
          {strain.name}
        </h2>
        <p className="mt-3 font-label text-ui leading-relaxed tracking-[0.05em] text-ice uppercase">
          {strain.lineage}
        </p>
      </div>

      <StrainMedia
        image={pickVaultImage(strain)}
        theme={strain.theme}
        name={strain.name}
        className="px-3 py-3"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        imageClassName="max-h-[min(58vh,28rem)]"
      />

      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="text-copy leading-relaxed text-ice/75">
          {strain.vaultDescription}
        </p>
        <Link
          href={`/strain/${strain.slug}`}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center border border-gunmetal px-4 font-label text-ui tracking-[0.22em] text-ice uppercase hover:border-ice hover:text-frost sm:w-auto"
        >
          {vaultCopy.viewDossier}
        </Link>
      </div>
    </article>
  );
}
