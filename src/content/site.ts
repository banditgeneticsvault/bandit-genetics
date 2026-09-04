import type { StrainImage } from "@/data/genetics/types";
import { homeArtworkSrc } from "@/lib/artwork";

export const brand = {
  name: "Bandit Genetics",
  wordmark: "BANDIT GENETICS",
  slogan: "TAKEN FROM THE BEST.\nBRED FOR THE REST.",
  sloganInline: "TAKEN FROM THE BEST. BRED FOR THE REST.",
  philosophy: "Fewer Strains. Higher Standards.",
  shortStatement:
    "A curated genetics operation. We take exceptional plants, study them in the dark, and release only what belongs in the vault. Quality over volume, always.",
} as const;

export const navItems = [
  { href: "/", label: "HOME" },
  { href: "/vault", label: "THE VAULT" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;

export const socialPlatforms = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/banditgeneticsvault",
  },
  { id: "discord", label: "Discord", href: null },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/banditgenetics" },
  { id: "x", label: "X", href: "https://x.com/banditgenetics" },
  {
    id: "reddit",
    label: "Reddit",
    href: "https://www.reddit.com/r/BanditGenetics/",
  },
  {
    id: "threads",
    label: "Threads",
    href: "https://www.threads.com/@banditgeneticsvault",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@banditgenetics",
  },
] as const;

export type SocialPlatformId = (typeof socialPlatforms)[number]["id"];

export const homeHero: {
  primaryCta: { href: string; label: string };
  /** Bandit Genetics Frost Queen brand artwork. */
  artwork?: StrainImage;
  /** Atmospheric cannabis photograph used on the Contact page. */
  background?: StrainImage;
} = {
  primaryCta: { href: "/vault", label: "ENTER THE VAULT" },
  artwork: {
    src: homeArtworkSrc("frost-queen-bandit.png"),
    alt: "Frost Queen, the Bandit Genetics brand mark",
    width: 1254,
    height: 1254,
  },
  background: {
    src: homeArtworkSrc("background.jpg"),
    alt: "",
    width: 1376,
    height: 768,
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
  viewDossier: "EXPLORE GENETICS",
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
    title: "CONTACT BANDIT GENETICS",
    kicker: "Direct line",
    body: "Questions about our genetics, releases, or the Bandit Vault? Have a custom bulk order in mind? Send us a message.",
    submit: "SEND MESSAGE",
    submitting: "SENDING",
    success: "Message sent. We'll be in touch.",
    error: "Something went wrong sending your message. Please try again.",
    nameLabel: "Name",
    emailLabel: "Email",
    subjectLabel: "Subject",
    messageLabel: "Message",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    honeypotLabel: "Leave this field blank",
  },
} as const;
