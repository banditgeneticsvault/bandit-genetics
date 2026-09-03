import type { StrainImage } from "@/data/genetics/types";
import { homeArtworkSrc } from "@/lib/artwork";

export const brand = {
  name: "Bandit Genetics",
  wordmark: "BANDIT GENETICS",
  slogan: "TAKEN FROM THE BEST.\nBRED FOR THE REST.",
  sloganInline: "TAKEN FROM THE BEST. BRED FOR THE REST.",
  philosophy: "FEW STRAINS. NO FILLER.",
  shortStatement:
    "A curated genetics operation. We take exceptional plants, study them in the dark, and release only what belongs in the vault. Quality over volume, always.",
} as const;

export const navItems = [
  { href: "/", label: "HOME" },
  { href: "/vault", label: "THE VAULT" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;

export const homeHero: {
  classified: string;
  primaryCta: { href: string; label: string };
  /** Bandit Genetics Frost Queen brand artwork. */
  artwork?: StrainImage;
} = {
  classified: "FILE // BG 00  ·  VAULT ACCESS",
  primaryCta: { href: "/vault", label: "ENTER THE VAULT" },
  artwork: {
    src: homeArtworkSrc("frost-queen-bandit.png"),
    alt: "Frost Queen, the Bandit Genetics brand mark",
    width: 1254,
    height: 1254,
  },
};

export const vaultCopy = {
  kicker: "CLASSIFIED ARCHIVE",
  title: "THE VAULT",
  statement: "NOTHING ORDINARY MAKES IT THIS FAR.",
  intro: "Taken from the best. Bred for the rest.",
  searchPlaceholder: "SEARCH THE VAULT",
  searchLabel: "Search the vault",
  filtersLabel: "Filter strains",
  all: "ALL",
  empty: "NO STRAINS MATCH THIS SEARCH.",
  emptyHint: "Clear the query or filters and open the archive again.",
  clear: "CLEAR FILTERS",
  viewDossier: "VIEW DOSSIER",
  comingSoon: "INFORMATION COMING SOON",
  resultOne: "STRAIN IN RANGE",
  resultMany: "STRAINS IN RANGE",
} as const;

export const pageCopy = {
  vault: {
    title: "THE VAULT",
    kicker: "CLASSIFIED ARCHIVE",
    body: "Twelve named Bandit cultivars. Lineage stays accurate. The keeper hunt comes later.",
  },
  about: {
    title: "About",
    kicker: "The operation",
    body: "Bandit Genetics is a cannabis genetics and seed brand. An underground luxury operation built around finding exceptional genetics, studying them, and breeding with restraint.",
  },
  contact: {
    title: "Contact",
    kicker: "Direct line",
    body: "A working contact channel will be added when the brand is ready to receive inquiries. This page is a route stub only.",
  },
} as const;
