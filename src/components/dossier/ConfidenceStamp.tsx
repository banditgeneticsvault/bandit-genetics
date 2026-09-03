import { dossierCopy } from "@/content/dossier";
import type { Confidence } from "@/data/genetics/types";
import { cn } from "@/lib/cn";

const labels: Record<Confidence, string> = {
  DOCUMENTED: dossierCopy.documented,
  INFERRED: dossierCopy.inferred,
  UNKNOWN: dossierCopy.unknown,
};

type ConfidenceStampProps = {
  level: Confidence;
};

export function ConfidenceStamp({ level }: ConfidenceStampProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-label text-[0.58rem] tracking-[0.2em] uppercase",
        level === "DOCUMENTED" && "border-gold/50 text-gold",
        level === "INFERRED" && "border-ice/40 text-ice",
        level === "UNKNOWN" && "border-gunmetal text-ice/50",
      )}
    >
      {labels[level]}
    </span>
  );
}
