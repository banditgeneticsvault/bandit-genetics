export const STRAIN_TYPES = ["REGULAR", "AUTOFLOWER"] as const;
export type StrainType = (typeof STRAIN_TYPES)[number];

export const COLLECTIONS = [
  "BANDIT COLLECTION",
  "THIRST TRAP COLLECTION",
] as const;
export type Collection = (typeof COLLECTIONS)[number];

export const DIFFICULTIES = [
  "BEGINNER",
  "BEGINNER REGULAR",
  "ADVANCED REGULAR",
] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const CONFIDENCE_LEVELS = ["DOCUMENTED", "INFERRED", "UNKNOWN"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export const GENETIC_INFLUENCES = [
  "CHEM",
  "GG4",
  "DANTE",
  "PLCG",
  "DIESEL",
  "BLUEBERRY",
  "COOKIES",
  "RUNTZ",
  "OREOZ",
] as const;
export type GeneticInfluence = (typeof GENETIC_INFLUENCES)[number];

export const STRAIN_THEMES = ["METAL", "SILK", "FROST"] as const;
export type StrainTheme = (typeof STRAIN_THEMES)[number];

export type ResearchNote = {
  topic: string;
  body: string;
  confidence: Confidence;
};

/** Local public path, for example `/images/strains/{slug}/hero.webp`. */
export type StrainImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ParentRecord = {
  id: string;
  name: string;
  aliases?: string[];
  lineage?: string;
  /** Documented family tags used for related genetics and the influence map. */
  influences: GeneticInfluence[];
  /** Name or market readings only. Never used as proof of relatedness. */
  inferredInfluences?: GeneticInfluence[];
  researchNotes: ResearchNote[];
};

export type StrainRecord = {
  id: string;
  fileCode: string;
  name: string;
  slug: string;
  lineage: string;
  parentOneId: string;
  parentTwoId: string;
  type: StrainType;
  difficulty?: Difficulty;
  collection: Collection;
  theme: StrainTheme;
  shortDescription: string;
  longDescription: string;
  plantCharacter?: string;
  flowerCharacter?: string;
  resinExpression?: string;
  colorPotential?: string;
  aromaDirection?: string;
  lineageCharacter?: string;
  breedingInterest?: string;
  whyItsInTheVault: string;
  quote?: string;
  heroImage?: StrainImage;
  galleryImages: StrainImage[];
  featured: boolean;
  status: string;
  availability: string;
  researchNotes: ResearchNote[];
  phenotypeNotes: string;
  growNotes: string;
  seoTitle: string;
  seoDescription: string;
};

export type VaultListItem = {
  id: string;
  fileCode: string;
  name: string;
  slug: string;
  lineage: string;
  parentOne: string;
  parentTwo: string;
  type: StrainType;
  difficulty?: Difficulty;
  collection: Collection;
  theme: StrainTheme;
  shortDescription: string;
  quote?: string;
  heroImage?: StrainImage;
  galleryImages: StrainImage[];
  featured: boolean;
  availability: string;
};
