import { ConfidenceStamp } from "@/components/dossier/ConfidenceStamp";
import { DossierSection } from "@/components/dossier/DossierSection";
import { dossierCopy } from "@/content/dossier";
import {
  combinedDirectionCopy,
  parentContributionCopy,
} from "@/data/genetics/parentVoice";
import type { Confidence, ParentRecord, StrainRecord } from "@/data/genetics/types";

type LineagePanelProps = {
  strain: StrainRecord;
  parentOne: ParentRecord;
  parentTwo: ParentRecord;
};

function parentLevels(parent: ParentRecord): Confidence[] {
  const levels = [...new Set(parent.researchNotes.map((note) => note.confidence))];
  return levels.length > 0 ? levels : (["UNKNOWN"] as Confidence[]);
}

function ParentColumn({
  label,
  parent,
  contribution,
  split,
}: {
  label: string;
  parent: ParentRecord;
  contribution: string;
  split?: boolean;
}) {
  return (
    <div
      className={
        split
          ? "border-t border-white/10 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8"
          : "md:pr-8"
      }
    >
      <p className="font-label text-[0.62rem] tracking-[0.24em] text-gold uppercase">
        {label}
      </p>
      <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-[0.95] text-frost">
        {parent.name}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {parentLevels(parent).map((level) => (
          <ConfidenceStamp key={level} level={level} />
        ))}
      </div>
      {parent.lineage ? (
        <p className="mt-3 font-label text-[0.72rem] leading-relaxed tracking-[0.06em] text-ice/70 uppercase">
          {dossierCopy.publicLineage}: {parent.lineage}
        </p>
      ) : (
        <p className="mt-3 font-label text-[0.72rem] tracking-[0.08em] text-ice/40 uppercase">
          {dossierCopy.publicLineage}: {dossierCopy.unknown}
        </p>
      )}
      <p className="mt-5 text-[0.95rem] leading-relaxed text-ice/80">{contribution}</p>
      <p className="mt-3 text-[0.82rem] leading-relaxed text-ice/45">
        {dossierCopy.inferredReading}
      </p>
    </div>
  );
}

export function LineagePanel({
  strain,
  parentOne,
  parentTwo,
}: LineagePanelProps) {
  const oneCopy = parentContributionCopy(
    strain.name,
    parentOne,
    parentTwo.name,
  );
  const twoCopy = parentContributionCopy(
    strain.name,
    parentTwo,
    parentOne.name,
  );
  const combined = combinedDirectionCopy(
    strain.name,
    parentOne.name,
    parentTwo.name,
    strain.lineageCharacter ?? strain.shortDescription,
    strain.type === "AUTOFLOWER" ? "autoflower" : "regular",
  );

  return (
    <DossierSection id="lineage" title={dossierCopy.lineagePanel} kicker="PARENTS ON FILE">
      <p className="max-w-2xl font-label text-[0.8rem] leading-relaxed tracking-[0.08em] text-ice uppercase">
        {strain.lineage}
      </p>
      <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-0">
        <ParentColumn
          label={dossierCopy.parentOne}
          parent={parentOne}
          contribution={oneCopy}
        />
        <ParentColumn
          label={dossierCopy.parentTwo}
          parent={parentTwo}
          contribution={twoCopy}
          split
        />
      </div>
      <div className="mt-12 border-t border-gold/30 pt-8">
        <p className="font-label text-[0.62rem] tracking-[0.24em] text-gold uppercase">
          {dossierCopy.combined}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ConfidenceStamp level="INFERRED" />
        </div>
        <p className="mt-4 max-w-3xl text-[1.02rem] leading-relaxed text-ice/85">
          {combined}
        </p>
      </div>
    </DossierSection>
  );
}
