import Link from "next/link";
import { DossierSection } from "@/components/dossier/DossierSection";
import { dossierCopy } from "@/content/dossier";
import type { RelatedStrainLink } from "@/data/genetics";

type RelatedGeneticsProps = {
  related: RelatedStrainLink[];
};

export function RelatedGenetics({ related }: RelatedGeneticsProps) {
  return (
    <DossierSection id="related" title={dossierCopy.related} kicker="SHARED BLOOD">
      {related.length === 0 ? (
        <p className="max-w-xl text-[0.95rem] leading-relaxed text-ice/60">
          {dossierCopy.relatedEmpty}
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {related.map((entry) => (
            <li key={entry.item.id}>
              <Link
                href={`/strain/${entry.item.slug}`}
                className="block h-full border border-white/10 bg-charcoal px-4 py-5 transition-colors hover:border-ice/40"
              >
                <p className="font-label text-[0.58rem] tracking-[0.2em] text-gold uppercase">
                  File {entry.item.fileCode}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-frost">
                  {entry.item.name}
                </h3>
                <p className="mt-2 font-label text-[0.7rem] leading-relaxed tracking-[0.05em] text-ice/70 uppercase">
                  {entry.item.lineage}
                </p>
                <p className="mt-3 text-[0.8rem] leading-relaxed text-ice/50">
                  {entry.reasons.join(". ")}.
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DossierSection>
  );
}
