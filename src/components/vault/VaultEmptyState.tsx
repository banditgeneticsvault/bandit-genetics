import { vaultCopy } from "@/content/site";

type VaultEmptyStateProps = {
  onClear: () => void;
};

export function VaultEmptyState({ onClear }: VaultEmptyStateProps) {
  return (
    <div className="border border-gunmetal bg-charcoal px-6 py-16 text-center md:py-24">
      <p className="section-kicker">
        Archive miss
      </p>
      <p className="mt-4 font-display text-3xl text-frost md:text-4xl">
        {vaultCopy.empty}
      </p>
      <p className="mx-auto mt-3 max-w-sm text-copy text-ice/65">{vaultCopy.emptyHint}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-8 inline-flex min-h-11 items-center border border-frost px-5 font-label text-ui tracking-[0.22em] text-frost uppercase"
      >
        {vaultCopy.clear}
      </button>
    </div>
  );
}
