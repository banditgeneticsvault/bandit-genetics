import {
  DossierSection,
  dossierKickerClass,
} from "@/components/dossier/DossierSection";
import { dossierCopy } from "@/content/dossier";
import type { ParentRecord } from "@/data/genetics/types";

type LineagePanelProps = {
  parentOne: ParentRecord;
  parentTwo: ParentRecord;
};

function ParentColumn({
  label,
  parent,
  split,
}: {
  label: string;
  parent: ParentRecord;
  split?: boolean;
}) {
  return (
    <div
      className={
        split
          ? "border-t border-white/10 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8"
          : "md:pr-8"
      }
    >
      <p className={dossierKickerClass}>{label}</p>
      <h3 className="mt-2 font-display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-[0.95] text-frost">
        {parent.name}
      </h3>
      {parent.lineage ? (
        <p className="mt-2 font-label text-ui leading-relaxed tracking-[0.06em] text-ice/70 uppercase">
          {parent.lineage}
        </p>
      ) : (
        <p className="mt-2 font-label text-ui tracking-[0.08em] text-ice/40 uppercase">
          {dossierCopy.unknown}
        </p>
      )}
    </div>
  );
}

export function LineagePanel({
  parentOne,
  parentTwo,
}: LineagePanelProps) {
  return (
    <DossierSection id="lineage" title={dossierCopy.lineagePanel} kicker="PARENTS ON FILE">
      <div className="grid gap-6 md:grid-cols-2 md:gap-0">
        <ParentColumn label={dossierCopy.parentOne} parent={parentOne} />
        <ParentColumn label={dossierCopy.parentTwo} parent={parentTwo} split />
      </div>
    </DossierSection>
  );
}
