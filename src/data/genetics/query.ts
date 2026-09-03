import type { Collection, Difficulty, StrainType, VaultListItem } from "./types";

export type VaultFilters = {
  query: string;
  collection: Collection | "ALL";
  type: StrainType | "ALL";
  difficulty: Difficulty | "ALL";
  featuredOnly: boolean;
};

export const defaultVaultFilters: VaultFilters = {
  query: "",
  collection: "ALL",
  type: "ALL",
  difficulty: "ALL",
  featuredOnly: false,
};

function haystack(item: VaultListItem): string {
  return [
    item.name,
    item.lineage,
    item.parentOne,
    item.parentTwo,
    item.collection,
    item.type,
    item.shortDescription,
    item.difficulty ?? "",
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

  return items.filter((item) => {
    if (needle && !haystack(item).includes(needle)) return false;
    if (filters.collection !== "ALL" && item.collection !== filters.collection) {
      return false;
    }
    if (filters.type !== "ALL" && item.type !== filters.type) return false;
    if (filters.difficulty !== "ALL") {
      if (item.difficulty !== filters.difficulty) return false;
    }
    if (filters.featuredOnly && !item.featured) return false;
    return true;
  });
}
