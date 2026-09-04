import { vaultCopy } from "@/content/site";
import type { VaultFilters, VaultView } from "@/data/genetics";
import { cn } from "@/lib/cn";

type VaultToolbarProps = {
  filters: VaultFilters;
  onChange: (next: VaultFilters) => void;
  resultCount: number;
};

const VIEWS: { id: VaultView; label: string }[] = [
  { id: "ALL", label: "ALL" },
  { id: "FEMINIZED_PHOTOPERIOD", label: "FEMINIZED PHOTOPERIOD" },
  { id: "AUTOFLOWER", label: "AUTOFLOWER" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-none border px-3 font-label text-ui tracking-[0.16em] uppercase",
        active
          ? "border-frost bg-frost text-black"
          : "border-gunmetal text-ice hover:border-gold hover:text-gold",
      )}
    >
      {children}
    </button>
  );
}

export function VaultToolbar({
  filters,
  onChange,
  resultCount,
}: VaultToolbarProps) {
  const resultLabel =
    resultCount === 1 ? vaultCopy.resultOne : vaultCopy.resultMany;

  return (
    <div className="border border-white/10 bg-black/40">
      <div className="border-b border-white/8 px-4 py-4 md:px-5">
        <label className="block">
          <span className="sr-only">{vaultCopy.searchLabel}</span>
          <input
            type="search"
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder={vaultCopy.searchPlaceholder}
            autoComplete="off"
            className="min-h-12 w-full appearance-none rounded-none border-0 bg-transparent font-label text-copy tracking-[0.18em] text-frost uppercase outline-none placeholder:text-ice/35"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <fieldset>
          <legend className="sr-only">{vaultCopy.filtersLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {VIEWS.map((view) => (
              <Chip
                key={view.id}
                active={filters.view === view.id}
                onClick={() => onChange({ ...filters, view: view.id })}
              >
                {view.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <p className="font-label text-meta tracking-[0.22em] text-ice/45 uppercase">
          {resultCount} {resultLabel}
        </p>
      </div>
    </div>
  );
}
