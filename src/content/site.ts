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
  { href: "/collections", label: "COLLECTIONS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;

export const homeHero = {
  classified: "FILE // BG 00  ·  VAULT ACCESS",
  primaryCta: { href: "/vault", label: "ENTER THE VAULT" },
  secondaryCta: { href: "/collections", label: "EXPLORE GENETICS" },
} as const;

export const vaultCopy = {
  kicker: "CLASSIFIED ARCHIVE",
  title: "THE VAULT",
  statement: "NOTHING ORDINARY MAKES IT THIS FAR.",
  intro:
    "Twelve named Bandit cultivars. Lineage stays accurate. The keeper hunt comes later.",
  searchPlaceholder: "SEARCH THE VAULT",
  searchLabel: "Search the vault",
  filtersLabel: "Filter files",
  all: "ALL",
  collection: "COLLECTION",
  type: "TYPE",
  difficulty: "DIFFICULTY",
  featured: "FEATURED",
  featuredOnly: "FEATURED ONLY",
  empty: "NO FILES MATCH THIS SEARCH.",
  emptyHint: "Clear the query or filters and open the archive again.",
  clear: "CLEAR FILTERS",
  viewDossier: "VIEW DOSSIER",
  unassigned: "UNASSIGNED",
  comingSoon: "INFORMATION COMING SOON",
  resultOne: "FILE IN RANGE",
  resultMany: "FILES IN RANGE",
} as const;

export const pageCopy = {
  vault: {
    title: "THE VAULT",
    kicker: "CLASSIFIED ARCHIVE",
    body: "Twelve named Bandit cultivars. Lineage stays accurate. The keeper hunt comes later.",
  },
  collections: {
    title: "Collections",
    kicker: "Curated releases",
    body: "Releases will be grouped here once the catalog is ready. Nothing is listed until it is real.",
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
