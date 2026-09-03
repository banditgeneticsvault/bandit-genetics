import { vaultCopy } from "@/content/site";

type VaultEmptyStateProps = {
  onClear: () => void;
  featuredOnly?: boolean;
};

export function VaultEmptyState({
  onClear,
  featuredOnly = false,
}: VaultEmptyStateProps) {
  const kicker = featuredOnly ? vaultCopy.featuredKicker : "Archive miss";
  const title = featuredOnly ? vaultCopy.featuredEmpty : vaultCopy.empty;
  const hint = featuredOnly ? vaultCopy.featuredEmptyHint : vaultCopy.emptyHint;

  return (
    <div className="border border-gunmetal bg-charcoal px-6 py-16 text-center md:py-24">
      <p className="font-label text-[0.68rem] tracking-[0.28em] text-gold uppercase">
        {kicker}
      </p>
      <p className="mt-4 font-display text-3xl text-frost md:text-4xl">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-sm text-ice/65">{hint}</p>
      <button
        type="button"
        onClick={onClear}
        className="mt-8 inline-flex min-h-11 items-center border border-frost px-5 font-label text-[0.68rem] tracking-[0.22em] text-frost uppercase"
      >
        {vaultCopy.clear}
      </button>
    </div>
  );
}
