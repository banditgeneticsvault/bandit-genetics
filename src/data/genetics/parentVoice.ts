import type { ParentRecord } from "./types";

const kernels: Record<string, string> = {
  "gorilla-glue-4":
    "Documented history treats GG4 as an accidental Nevada keeper famous for greasy resin, flower stretch, and a diesel pine earth cocoa nose. Those are parent reputations. They may show in a cross. They are not a Bandit harvest log.",
  "dantes-inferno":
    "Public listings place Dante's Inferno on Oreoz × Devil Driver, often via the Mile High Dave #8 cut. Documented talk clusters around dessert fruit, cream, stacked calyxes, and color when nights run cool. Offspring can miss that show. Color is phenotype dependent and environment dependent.",
  "permanent-marker-s1":
    "Permanent Marker is Seed Junky work in the Biscotti, Jealousy, and Sherb lane, later made loud in the market. An S1 can concentrate candy gas and bag appeal. An S1 is not a clone. Ink, floral dough, and dense boutique flowers are reasonable hopes, not promises.",
  "platinum-lemon-cherry-gelato-s1":
    "This S1 is documented as a selfed Platinum Lemon Cherry Gelato line. Records describe lemon cherry candy, heavy frost, and vivid color showing more often than in a loose hybrid. Still a seed. Still a hunt.",
  "gorilla-glue-4-s1":
    "This is a selfed GG4 line, not a new pairing. Glue resin, chem diesel, and stretch remain the point. Uniformity is a hope. Treat it as glue family influence, not a finished cut.",
  "platinum-frosting":
    "Documented as Platinum Lemon Cherry Gelato × Oreoz. Fruit cream from the platinum side may meet cookie chocolate gas and dark frost from Oreoz. That is parent reputation from public listings, not a Bandit jar note.",
  "tropicana-blue":
    "Documented as Tropicana Cherry × Blueberry Sugar. Candy citrus on top and sugared berry structure underneath are the usual reading. Citrus candy is likely. The exact mix depends on the plant.",
  "blueberry-inferno":
    "Documented as Blueberry Sugar × Dante's Inferno. Public notes frame Dante as darker fruit and drama, Blueberry Sugar as sweeter, calmer growth. Deep berry is a reasonable direction. It is not a Bandit result.",
  "gucciberry":
    "Documented as Blueberry Sugar × Joker Juice 11. Listings describe blueberry jam, candy, and a modern resin frame with organized branching. Boutique berry is the contribution we are watching for.",
  "dip-n-stix-s1":
    "Heisenbeans lists this as Dip N Stix selfed. The deeper Beleaf pedigree is messy in public trees, so we leave ancestry UNKNOWN. What is documented is a reputation for dense, colorful, frosty flowers with sweet fruit over earth. Do not invent a family tree to make the file prettier.",
  "blue-vegas":
    "Documented as Gorilla Butter × Blueberry Sugar. Gorilla Butter is GG4 × Peanut Butter Breath, so glue resin sits one generation back. Berry dessert, color, and frost are the documented sales pitch. GG4 is influence, not a direct parent on the Bandit card.",
  "platinum-city-diesel":
    "Documented as Platinum Lemon Cherry Gelato × 3D Chem in regular seed. PLCG may bring fruit, color, and boutique flower. 3D Chem may bring frame, vigor, and chem diesel. Fuel intensity will vary.",
  "dragon-gas":
    "Documented as Grape Gas × Zero Gravity. Public notes describe sturdy branching, density, resin, grape, and botanical gas, with possible jewel tones. That is a listing, not our garden.",
  "blueberry-piff":
    "No clean public pedigree was confirmed. The name suggests blueberry and piff families. That is a name reading, confidence INFERRED at best. Deeper history stays UNKNOWN until a reliable tree is in hand.",
  "jokers-pie":
    "Documented as Joker Juice 11 × Grape Pie. Public copy leans grape candy, cream, a gassy back note, color, and resin. Cookies family here means dessert adjacency, not a claim that GSC sits on the card.",
  "blue-grapesicle":
    "Public listings disagree on the exact tree. One record says Blue Ice × Joker Juice 11. Another says Blueberry Sugar × Joker Juice. We print the parent name we were given and refuse to freeze a fake pedigree. Fruit candy is the safe inference. Lineage detail is UNKNOWN.",
  "big-perm":
    "Documented as Permanent Marker × 3D Chem. Marker credit stays with Seed Junky. 3D Chem is the chem spine. Candy ink over chem structure is the expected argument of the parent, not a guarantee in the pack.",
  "guava-n-chem-auto":
    "Similar named autos exist under other breeders. A confirmed Seedlys or Heisenbeans page for this exact parent was not locked. CHEM is tagged from the given name. Tropical fuel talk is INFERRED from the name, not from a verified cut.",
  "carbon-cherry-auto":
    "Carbon Crusher is a different Heisenbeans name. No reliable public page for Carbon Cherry Auto was confirmed. Breeder, lineage, and traits stay UNKNOWN. We will not borrow another file's story.",
  "strawberry-milk-qookies-f2-auto":
    "Close names exist in other catalogs. We do not assign those packs to this parent. COOKIES is tagged from Qookies in the given name. Strawberry milk and cream are INFERRED. An F2 can scatter. Structure remains UNKNOWN.",
  "red-runtz-auto":
    "Photoperiod Red Runtz is commonly listed in the Runtz and Red Pop lane. Auto versions come from more than one source. The Bandit parent breeder is not assigned. RUNTZ is tagged from the name and that wider family. Candy and possible red or pink accents are INFERRED.",
  "tropicana-cookies-auto":
    "Photoperiod Tropicana Cookies is widely tied to Cookies × Tangie work. Many companies sell autos under the same name with different auto donors. We do not pin this parent to a third party catalog. Orange citrus candy is the family reputation. The auto donor is UNKNOWN.",
  "atomic-burn-auto":
    "No reliable public pedigree was confirmed. History, breeder, and trait claims stay empty. Do not invent a burn story to balance the page.",
};

export function parentKernel(parent: ParentRecord): string {
  return (
    kernels[parent.id] ??
    "Public documentation on this parent is thin. Bandit Genetics will not invent a biography to fill the panel."
  );
}

export function parentContributionCopy(
  strainName: string,
  parent: ParentRecord,
  otherParentName: string,
): string {
  const lineageLine = parent.lineage
    ? ` Public lineage on file: ${parent.lineage}.`
    : " Public lineage is not confirmed.";

  return `${strainName} seats ${parent.name} across from ${otherParentName}. Bandit Genetics did not create ${parent.name}. ${parentKernel(parent)}${lineageLine}`;
}

export function combinedDirectionCopy(
  strainName: string,
  parentOneName: string,
  parentTwoName: string,
  lineageCharacter: string,
  typeLabel: string,
): string {
  return `${lineageCharacter} In ${strainName}, ${parentOneName} and ${parentTwoName} set a ${typeLabel} hunt. What actually shows is phenotype dependent. Bandit selections come later.`;
}
