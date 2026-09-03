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

  const regulars = strains.filter((strain) => strain.type === "REGULAR");
  const autos = strains.filter((strain) => strain.type === "AUTOFLOWER");

  if (regulars.length !== 9) {
    throw new Error(`Expected 9 regular strains. Found ${regulars.length}.`);
  }

  if (autos.length !== 3) {
    throw new Error(`Expected 3 autoflowers. Found ${autos.length}.`);
  }

  for (const auto of autos) {
    if (auto.difficulty !== "BEGINNER") {
      throw new Error(`${auto.name} must be BEGINNER.`);
    }
  }

  for (const regular of regulars) {
    if (regular.difficulty) {
      throw new Error(`${regular.name} must not have assigned difficulty.`);
    }
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
    difficulty: strain.difficulty,
    collection: strain.collection,
    theme: strain.theme,
    shortDescription: strain.shortDescription,
    quote: strain.quote,
    heroImage: strain.heroImage,
    galleryImages: strain.galleryImages,
    featured: strain.featured,
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

export function getRelatedStrains(
  strain: StrainRecord,
  limit = 4,
): RelatedStrainLink[] {
  const ownInfluences = getInfluencesForStrain(strain);

  const scored = strains
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

      const sharedInfluences = getInfluencesForStrain(other).filter((influence) =>
        ownInfluences.includes(influence),
      );

      const reasons: string[] = [
        ...sharedParents.map((name) => `Shares ${name}`),
        ...sharedInfluences.map((influence) => `Shares ${influence} influence`),
      ];

      if (sharedParents.length > 0 && other.collection === strain.collection) {
        reasons.push("Same collection");
      }

      const score =
        sharedParents.length * 100 +
        sharedInfluences.length * 10 +
        (other.collection === strain.collection ? 2 : 0) +
        (other.type === strain.type ? 1 : 0);

      return {
        other,
        reasons,
        score,
        include: sharedParents.length > 0 || sharedInfluences.length > 0,
      };
    })
    .filter((entry) => entry.include)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((entry) => ({
    item: toVaultListItem(entry.other),
    reasons: entry.reasons,
  }));
}
