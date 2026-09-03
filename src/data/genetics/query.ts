import type { StrainType, VaultListItem } from "./types";

export type VaultView = "ALL" | StrainType;

export type VaultFilters = {
  query: string;
  view: VaultView;
};

export const defaultVaultFilters: VaultFilters = {
  query: "",
  view: "ALL",
};

function haystack(item: VaultListItem): string {
  return [
    item.name,
    item.lineage,
    item.parentOne,
    item.parentTwo,
    item.type,
    item.vaultDescription,
    item.fileCode,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterVaultItems(
  items: VaultListItem[],
  filters: VaultFilters,
): VaultListItem[] {
  const needle = filters.query.trim().toLowerCase();

  return items
    .filter((item) => {
      if (needle && !haystack(item).includes(needle)) return false;
      if (filters.view === "ALL") return true;
      return item.type === filters.view;
    })
    .sort((a, b) => a.name.localeCompare(b.name, "en"));
}
