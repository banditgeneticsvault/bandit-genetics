import { LEGISLATION_DEADLINE_LABEL } from "@/lib/legislation-deadline";

export const legislationCopy = {
  regionLabel: "Federal hemp definition date",
  barCta: "Explore the vault",
  barCtaShort: "Vault",
  barStory: "The announcement",
  daysRemaining: "Days remaining",
  dayRemaining: "Day remaining",
  until: `Until ${LEGISLATION_DEADLINE_LABEL}`,
  today: `${LEGISLATION_DEADLINE_LABEL} is today`,
  passedKicker: "The date has passed",
  passedBar: `${LEGISLATION_DEADLINE_LABEL} has passed`,
  timeNote: "Eastern Time",
  bannerHeadline:
    "WE'RE SHUTTING DOWN — FEDERAL SEED BAN TAKES EFFECT DECEMBER 11, 2026.",
  bannerDistinction:
    "December 11, 2026 is the federal effective date, not a confirmed Bandit closing day.",
  bannerDay: "DAY",
  bannerDays: "DAYS",
  bannerHour: "HR",
  bannerHours: "HRS",
  bannerMinute: "MIN",
  bannerSecond: "SEC",
  sectionId: "legislation",
  kicker: "A turning point",
  headline: "The clock is ticking on American cannabis genetics.",
  passedHeadline: "The collection is still open.",
  support:
    "Federal legislation is changing the definition of hemp and the treatment of viable conventional cannabis seeds. Independent breeders, seed banks, and collectors face an uncertain future.",
  passedSupport:
    "December 11, 2026 was the scheduled date for most of the revised federal hemp definition, including the treatment of viable conventional cannabis seeds. What that means for any one person or business is not something this page can decide.",
  bandit:
    "Bandit is shutting down. December 11, 2026 is the federal effective date, not a confirmed last operating day, and not an order deadline.",
  passedBandit:
    "The Vault is still open. December 11 was the federal effective date, not a confirmed last operating day or an order deadline.",
  note: `Most of the revised federal hemp definition is scheduled for ${LEGISLATION_DEADLINE_LABEL}, including an exclusion for viable seeds from cannabis plants over 0.3% total THC, THCA included. Public Law 119-103 delayed those portions to this date. The clock counts down to 12:00 a.m. Eastern Time at the start of that date, because the statute does not name an hour. It is not a ban on every cannabis seed, not a Bandit order deadline, and not legal advice.`,
  passedNote:
    "The December 11, 2026 date for most of the revised federal hemp definition has passed. This site is not declaring an outcome for every seed, and it is not legal advice. The Vault remains open.",
  cta: "Explore the vault",
  secondary: "Why we opened",
  secondaryHref: "/faq#why-public-run-now",
  vaultKicker: "Federal date",
  vaultUpcoming:
    "Most of the revised hemp definition, including viable cannabis seeds, is scheduled for this date. The Vault is open. This is not an order deadline.",
  vaultPassed:
    "That federal date has passed. The Vault stays open. It was not an order deadline.",
  vaultLink: "Read the announcement",
} as const;
