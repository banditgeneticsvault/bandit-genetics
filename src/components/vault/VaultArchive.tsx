"use client";

import { useMemo, useState } from "react";
import { StrainCard } from "@/components/vault/StrainCard";
import { VaultEmptyState } from "@/components/vault/VaultEmptyState";
import { VaultToolbar } from "@/components/vault/VaultToolbar";
import {
  defaultVaultFilters,
  filterVaultItems,
  type VaultFilters,
  type VaultListItem,
} from "@/data/genetics";

type VaultArchiveProps = {
  items: VaultListItem[];
};

export function VaultArchive({ items }: VaultArchiveProps) {
  const [filters, setFilters] = useState<VaultFilters>(defaultVaultFilters);

  const results = useMemo(
    () => filterVaultItems(items, filters),
    [filters, items],
  );

  return (
    <div>
      <VaultToolbar
        filters={filters}
        onChange={setFilters}
        resultCount={results.length}
      />

      {results.length === 0 ? (
        <div className="mt-8">
          <VaultEmptyState
            featuredOnly={filters.featuredOnly}
            onClear={() => setFilters(defaultVaultFilters)}
          />
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
          {results.map((strain) => (
            <li key={strain.id} className="min-w-0">
              <StrainCard strain={strain} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
