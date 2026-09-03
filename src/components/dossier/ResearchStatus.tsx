import { ConfidenceStamp } from "@/components/dossier/ConfidenceStamp";
import { DossierSection } from "@/components/dossier/DossierSection";
import { dossierCopy } from "@/content/dossier";
import type { ParentRecord, ResearchNote, StrainRecord } from "@/data/genetics/types";
import type { Confidence } from "@/data/genetics/types";

function uniqueLevels(notes: ResearchNote[]): Confidence[] {
  return [...new Set(notes.map((note) => note.confidence))];
}

function statusCopy(levels: Confidence[]): string {
  const hasDoc = levels.includes("DOCUMENTED");
  const hasInf = levels.includes("INFERRED");
  const hasUnk = levels.includes("UNKNOWN");

  if (hasDoc && !hasInf && !hasUnk) {
    return "Parent history on this file is documented. Bandit garden notes are still pending.";
  }
  if (!hasDoc && hasUnk && !hasInf) {
    return "Documentation on one or more parents is thin. Gaps stay visible. We will not invent a cleaner story.";
  }
  return "This file mixes documented parent history with inferred garden expectations. Unknown items stay marked. Future Bandit Genetics phenotype observations are not in yet.";
}

type ResearchStatusProps = {
  strain: StrainRecord;
  parentOne: ParentRecord;
  parentTwo: ParentRecord;
};

export function ResearchStatus({
  strain,
  parentOne,
  parentTwo,
}: ResearchStatusProps) {
  const notes = [
    ...strain.researchNotes,
    ...parentOne.researchNotes,
    ...parentTwo.researchNotes,
  ];
  const levels = uniqueLevels(notes);

  return (
    <DossierSection id="research" title={dossierCopy.research} kicker="CREDIBILITY">
      <div className="flex flex-wrap gap-2">
        {(levels.length > 0 ? levels : (["UNKNOWN"] as Confidence[])).map(
          (level) => (
            <ConfidenceStamp key={level} level={level} />
          ),
        )}
      </div>
      <p className="mt-5 max-w-2xl text-copy leading-relaxed text-ice/80">
        {statusCopy(levels)}
      </p>
      <p className="mt-4 max-w-2xl text-copy leading-relaxed text-ice/55">
        {dossierCopy.futureObs}
      </p>
      {strain.researchNotes.length > 0 ? (
        <ul className="mt-6 max-w-2xl space-y-4">
          {strain.researchNotes.map((note) => (
            <li key={`${note.topic}-${note.confidence}`} className="border-t border-white/8 pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-label text-kicker tracking-[0.2em] text-gold uppercase">
                  {note.topic}
                </p>
                <ConfidenceStamp level={note.confidence} />
              </div>
              <p className="mt-2 text-copy leading-relaxed text-ice/75">{note.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </DossierSection>
  );
}
