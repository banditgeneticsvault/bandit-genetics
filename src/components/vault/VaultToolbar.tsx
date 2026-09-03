import { vaultCopy } from "@/content/site";
import type { VaultFilters } from "@/data/genetics";
import { COLLECTIONS, STRAIN_TYPES } from "@/data/genetics/types";
import { cn } from "@/lib/cn";

type VaultToolbarProps = {
  filters: VaultFilters;
  onChange: (next: VaultFilters) => void;
  resultCount: number;
};

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
        "inline-flex min-h-11 items-center rounded-none border px-3 font-label text-[0.65rem] tracking-[0.16em] uppercase",
        active
          ? "border-frost bg-frost text-black"
          : "border-gunmetal text-ice hover:border-ice",
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
            className="min-h-12 w-full appearance-none rounded-none border-0 bg-transparent font-label text-[0.85rem] tracking-[0.18em] text-frost uppercase outline-none placeholder:text-ice/35"
          />
        </label>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4 md:px-5">
        <fieldset>
          <legend className="mb-2 font-label text-[0.62rem] tracking-[0.24em] text-gold uppercase">
            {vaultCopy.collection}
          </legend>
          <div className="flex flex-wrap gap-2">
            <Chip
              active={filters.collection === "ALL"}
              onClick={() => onChange({ ...filters, collection: "ALL" })}
            >
              {vaultCopy.all}
            </Chip>
            {COLLECTIONS.map((collection) => (
              <Chip
                key={collection}
                active={filters.collection === collection}
                onClick={() => onChange({ ...filters, collection })}
              >
                {collection}
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 font-label text-[0.62rem] tracking-[0.24em] text-gold uppercase">
              {vaultCopy.type}
            </legend>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={filters.type === "ALL"}
                onClick={() => onChange({ ...filters, type: "ALL" })}
              >
                {vaultCopy.all}
              </Chip>
              {STRAIN_TYPES.map((type) => (
                <Chip
                  key={type}
                  active={filters.type === type}
                  onClick={() => onChange({ ...filters, type })}
                >
                  {type}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-label text-[0.62rem] tracking-[0.24em] text-gold uppercase">
              {vaultCopy.difficulty}
            </legend>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={filters.difficulty === "ALL"}
                onClick={() => onChange({ ...filters, difficulty: "ALL" })}
              >
                {vaultCopy.all}
              </Chip>
              <Chip
                active={filters.difficulty === "BEGINNER"}
                onClick={() => onChange({ ...filters, difficulty: "BEGINNER" })}
              >
                BEGINNER
              </Chip>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Chip
            active={filters.featuredOnly}
            onClick={() =>
              onChange({ ...filters, featuredOnly: !filters.featuredOnly })
            }
          >
            {vaultCopy.featuredOnly}
          </Chip>
          <p className="font-label text-[0.62rem] tracking-[0.22em] text-ice/45 uppercase">
            {resultCount} {resultLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
