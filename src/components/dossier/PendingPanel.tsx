import { dossierCopy } from "@/content/dossier";

type PendingPanelProps = {
  label: string;
};

export function PendingPanel({ label }: PendingPanelProps) {
  return (
    <div className="border border-white/10 bg-charcoal px-5 py-8 md:px-8 md:py-10">
      <p className="font-label text-[0.62rem] tracking-[0.28em] text-gold uppercase">
        {dossierCopy.pendingKicker}
      </p>
      <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-frost">
        {label}
      </p>
      <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ice/70">
        {dossierCopy.pendingBody}
      </p>
    </div>
  );
}
