import { parents, parentsById } from "./parents";
import { strains } from "./strains";
import type {
  GeneticInfluence,
  ParentRecord,
  StrainRecord,
  VaultListItem,
} from "./types";

const REQUIRED_SLUGS = [
  "gorilla-heist",
  "black-market-barbie",
  "vault-robbery",
  "criminal-cherry",
  "velvet-vice",
  "diamond-thief",
  "bandit-queen",
  "felons-fantasy",
  "money-laundering",
  "highway-robbery",
  "getaway-girl",
  "speeding-ticket",
] as const;

const REQUIRED_LINEAGE: Record<(typeof REQUIRED_SLUGS)[number], string> = {
  "gorilla-heist": "Gorilla Glue #4 × Dante's Inferno",
  "black-market-barbie":
    "Permanent Marker S1 × Platinum Lemon Cherry Gelato S1",
  "vault-robbery": "Gorilla Glue #4 S1 × Platinum Frosting",
  "criminal-cherry": "Tropicana Blue × Blueberry Inferno",
  "velvet-vice": "Gucciberry × Dip N Stix S1",
  "diamond-thief": "Blue Ve'Gas × Platinum City Diesel",
  "bandit-queen": "Dragon Gas × Blueberry Piff",
  "felons-fantasy": "Jokers Pie × Blue Grapesicle",
  "money-laundering": "Big Perm × Platinum City Diesel",
  "highway-robbery": "Guava N Chem Auto × Carbon Cherry Auto",
  "getaway-girl": "Strawberry Milk & Qookies F2 Auto × Red Runtz Auto",
  "speeding-ticket": "Tropicana Cookies Auto × Atomic Burn Auto",
};

function assertCatalog() {
  if (strains.length !== 12) {
    throw new Error(`Catalog must contain 12 strains. Found ${strains.length}.`);
  }

  const photos = strains.filter(
    (strain) => strain.type === "FEMINIZED_PHOTOPERIOD",
  );
  const autos = strains.filter((strain) => strain.type === "AUTOFLOWER");

  if (photos.length !== 9) {
    throw new Error(
      `Expected 9 feminized photoperiod strains. Found ${photos.length}.`,
    );
  }

  if (autos.length !== 3) {
    throw new Error(`Expected 3 autoflowers. Found ${autos.length}.`);
  }

  const slugs = new Set(strains.map((strain) => strain.slug));
  for (const slug of REQUIRED_SLUGS) {
    if (!slugs.has(slug)) {
      throw new Error(`Missing slug ${slug}.`);
    }
    const strain = strains.find((item) => item.slug === slug);
    if (strain && strain.lineage !== REQUIRED_LINEAGE[slug]) {
      throw new Error(`Lineage mismatch for ${slug}.`);
    }
  }

  for (const strain of strains) {
    if (!parentsById[strain.parentOneId] || !parentsById[strain.parentTwoId]) {
      throw new Error(`Missing parent record for ${strain.name}.`);
    }
  }
}

assertCatalog();

export function getStrains(): StrainRecord[] {
  return strains;
}

export function getStrainBySlug(slug: string): StrainRecord | undefined {
  return strains.find((strain) => strain.slug === slug);
}

export function getParents(): ParentRecord[] {
  return parents;
}

export function getParentById(id: string): ParentRecord | undefined {
  return parentsById[id];
}

export function getInfluencesForStrain(strain: StrainRecord): GeneticInfluence[] {
  const one = parentsById[strain.parentOneId]?.influences ?? [];
  const two = parentsById[strain.parentTwoId]?.influences ?? [];
  return [...new Set([...one, ...two])];
}

export function getStrainsByParentId(parentId: string): StrainRecord[] {
  return strains.filter(
    (strain) =>
      strain.parentOneId === parentId || strain.parentTwoId === parentId,
  );
}

export function getStrainsByInfluence(
  influence: GeneticInfluence,
): StrainRecord[] {
  return strains.filter((strain) =>
    getInfluencesForStrain(strain).includes(influence),
  );
}

export function getSharedParentMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const parent of parents) {
    map[parent.name] = getStrainsByParentId(parent.id).map(
      (strain) => strain.name,
    );
  }
  return map;
}

export function toVaultListItem(strain: StrainRecord): VaultListItem {
  return {
    id: strain.id,
    fileCode: strain.fileCode,
    name: strain.name,
    slug: strain.slug,
    lineage: strain.lineage,
    parentOne: parentsById[strain.parentOneId].name,
    parentTwo: parentsById[strain.parentTwoId].name,
    type: strain.type,
    theme: strain.theme,
    vaultDescription: strain.vaultDescription,
    heroImage: strain.heroImage,
    vaultImage: strain.vaultImage,
    galleryImages: strain.galleryImages,
    availability: strain.availability,
  };
}

export function getVaultListItems(): VaultListItem[] {
  return strains.map(toVaultListItem);
}

export function getStrainSlugs(): string[] {
  return strains.map((strain) => strain.slug);
}

export type RelatedStrainLink = {
  item: VaultListItem;
  reasons: string[];
};

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function citationNames(parent: ParentRecord): string[] {
  return unique(
    [parent.name, ...(parent.aliases ?? [])]
      .map((name) => name.replace(/\s+S1$/i, "").replace(/\s+Auto$/i, "").trim())
      .filter((name) => name.length >= 10),
  );
}

function lineageCitesParent(
  lineage: string | undefined,
  parent: ParentRecord,
): boolean {
  if (!lineage) return false;
  return citationNames(parent).some((name) => lineage.includes(name));
}

function isSelfedPair(a: string, b: string): boolean {
  return a === `${b}-s1` || b === `${a}-s1`;
}

function documentedDirectReasons(
  strain: StrainRecord,
  other: StrainRecord,
): string[] {
  const ownParents = [
    parentsById[strain.parentOneId],
    parentsById[strain.parentTwoId],
  ];
  const otherParents = [
    parentsById[other.parentOneId],
    parentsById[other.parentTwoId],
  ];
  const reasons: string[] = [];

  for (const own of ownParents) {
    for (const theirs of otherParents) {
      if (own.id === theirs.id) continue;

      if (isSelfedPair(own.id, theirs.id)) {
        reasons.push(
          `Documented family link through ${own.name} and ${theirs.name}`,
        );
      }

      if (lineageCitesParent(theirs.lineage, own)) {
        reasons.push(`Documented in ${theirs.name} lineage: ${own.name}`);
      }

      if (lineageCitesParent(own.lineage, theirs)) {
        reasons.push(`Documented in ${own.name} lineage: ${theirs.name}`);
      }
    }
  }

  return unique(reasons);
}

type RelatedScore = {
  other: StrainRecord;
  reasons: string[];
  score: number;
  sharedParentCount: number;
  directCount: number;
  influenceCount: number;
};

export function getRelatedStrains(
  strain: StrainRecord,
  limit = 4,
): RelatedStrainLink[] {
  const ownInfluences = getInfluencesForStrain(strain);

  const scored: RelatedScore[] = strains
    .filter((other) => other.id !== strain.id)
    .map((other) => {
      const sharedParents = unique(
        [other.parentOneId, other.parentTwoId]
          .filter(
            (parentId) =>
              parentId === strain.parentOneId || parentId === strain.parentTwoId,
          )
          .map((parentId) => parentsById[parentId].name),
      );

      const direct = documentedDirectReasons(strain, other);

      const sharedInfluences = getInfluencesForStrain(other).filter((influence) =>
        ownInfluences.includes(influence),
      );

      const reasons: string[] = [
        ...sharedParents.map((name) => `Shares ${name}`),
        ...direct,
        ...sharedInfluences.map(
          (influence) => `Shares documented ${influence} influence`,
        ),
      ];

      if (reasons.length > 0 && other.collection === strain.collection) {
        reasons.push("Same collection");
      }

      const score =
        sharedParents.length * 400 +
        direct.length * 120 +
        sharedInfluences.length * 15 +
        (other.collection === strain.collection ? 3 : 0) +
        (other.type === strain.type ? 1 : 0);

      return {
        other,
        reasons: unique(reasons),
        score,
        sharedParentCount: sharedParents.length,
        directCount: direct.length,
        influenceCount: sharedInfluences.length,
      };
    });

  const genetic = scored.filter(
    (entry) =>
      entry.sharedParentCount > 0 ||
      entry.directCount > 0 ||
      entry.influenceCount > 0,
  );

  const core = genetic
    .filter((entry) => entry.sharedParentCount > 0 || entry.directCount > 0)
    .sort((a, b) => b.score - a.score);

  const selected =
    core.length >= 3
      ? core.slice(0, limit)
      : [...genetic].sort((a, b) => b.score - a.score).slice(0, limit);

  return selected.map((entry) => ({
    item: toVaultListItem(entry.other),
    reasons: entry.reasons,
  }));
}
