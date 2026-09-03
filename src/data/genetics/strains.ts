import { localStrainImage } from "@/lib/artwork";
import type { StrainRecord } from "./types";

const strainArt = {
  "gorilla-heist": localStrainImage(
    "gorilla-heist",
    "hero.png",
    "GORILLA HEIST limited release artwork",
    1921,
    2560,
  ),
  "black-market-barbie": localStrainImage(
    "black-market-barbie",
    "hero.JPG",
    "BLACK MARKET BARBIE limited release artwork",
    4000,
    1848,
  ),
  "vault-robbery": localStrainImage(
    "vault-robbery",
    "hero.jpg",
    "VAULT ROBBERY limited release artwork",
    3024,
    3024,
  ),
  "criminal-cherry": localStrainImage(
    "criminal-cherry",
    "hero.jpg",
    "CRIMINAL CHERRY limited release artwork",
    2296,
    4080,
  ),
  "velvet-vice": localStrainImage(
    "velvet-vice",
    "hero.jpg",
    "VELVET VICE limited release artwork",
    2160,
    3840,
  ),
  "diamond-thief": localStrainImage(
    "diamond-thief",
    "hero.png",
    "DIAMOND THIEF limited release artwork",
    1921,
    2560,
  ),
  "bandit-queen": localStrainImage(
    "bandit-queen",
    "hero.jpg",
    "BANDIT QUEEN limited release artwork",
    1530,
    2040,
  ),
  "felons-fantasy": localStrainImage(
    "felons-fantasy",
    "hero.jpg",
    "FELON'S FANTASY limited release artwork",
    3000,
    4000,
  ),
  "money-laundering": localStrainImage(
    "money-laundering",
    "hero.jpg",
    "MONEY LAUNDERING limited release artwork",
    3024,
    4032,
  ),
  "highway-robbery": localStrainImage(
    "highway-robbery",
    "hero.jpg",
    "HIGHWAY ROBBERY limited release artwork",
    2160,
    2880,
  ),
  "getaway-girl": localStrainImage(
    "getaway-girl",
    "hero.JPG",
    "GETAWAY GIRL limited release artwork",
    2592,
    3888,
  ),
  "speeding-ticket": localStrainImage(
    "speeding-ticket",
    "hero.jpg",
    "SPEEDING TICKET limited release artwork",
    3000,
    4000,
  ),
} as const;

const comingSoon = "INFORMATION COMING SOON";

export const strains: StrainRecord[] = [
  {
    id: "gorilla-heist",
    fileCode: "BG 01",
    name: "GORILLA HEIST",
    slug: "gorilla-heist",
    lineage: "Gorilla Glue #4 × Dante's Inferno",
    parentOneId: "gorilla-glue-4",
    parentTwoId: "dantes-inferno",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "BANDIT COLLECTION",
    theme: "METAL",
    shortDescription:
      "GORILLA HEIST is Gorilla Glue #4 crossed to Dante's Inferno. Glue supplies the resin-and-fuel spine; Dante supplies dessert density and a lane for color. The pairing is interesting because greasy chem structure sits next to stacked pastry flower instead of another fuel parent. The file points toward a vigorous, frost-forward hybrid with pine diesel on one side and berry cream on the other.",
    vaultDescription:
      "GG4 resin and pine diesel against Dante dessert. Dense, greasy flowers with a lane for berry cream and cool-finish color.",
    longDescription:
      "GG4 is consistently described as vigorous, stretchy in flower, and coated in greasy trichomes. Dante's Inferno, listed as Oreoz × Devil Driver, is known for calyx stack, pastry sweetness, and dark color potential. This Bandit release watches for plants that keep the glue stick without losing Dante’s dessert nose. The pairing is built for resin and flower quality, not a uniform tray.",
    plantCharacter:
      "The pairing can lean vigorous, with GG4’s reputation for flower stretch and lateral arms that may need support as colas pack on. Dante can keep the outline from reading as a single spear, offering a fuller stacked frame. A strong hybrid structure is the reasonable direction.",
    flowerCharacter:
      "Flowers can lean dense and resin-heavy, with GG4’s greasy bracts against Dante’s tighter dessert stacks. Aroma may split between pine, earth, and diesel and a berry-cream pastry lane. Color can show when Dante leads.",
    resinExpression:
      "GG4 is famous for greasy, tool-sticking frost. Dante is also a resin-forward parent. The file is built around trichome potential.",
    colorPotential:
      "Dante lines can run purple to burgundy. GG4 often stays forest green. Mixed color in a pack is the honest range.",
    aromaDirection:
      "Pine, diesel, and cocoa-earth from glue against berry cream and cookie dessert from Dante.",
    lineageCharacter:
      "Chem, diesel, and Oreoz dessert in one release.",
    breedingInterest:
      "Useful later if a keeper holds glue structure under Dante terps, or Dante color on a stickier plant.",
    whyItsInTheVault:
      "Greasy glue structure next to Dante dessert is too clean a pairing to leave unnamed.",
    heroImage: strainArt["gorilla-heist"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Naming",
        body: "This file uses a Bandit name. Do not treat it as somebody else’s pairing under a different label.",
        confidence: "DOCUMENTED",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "GORILLA HEIST",
    seoDescription:
      "GORILLA HEIST is Bandit Genetics’ Gorilla Glue #4 × Dante's Inferno regular. Accurate lineage. Our name. Our future selections.",
  },
  {
    id: "black-market-barbie",
    fileCode: "BG 02",
    name: "BLACK MARKET BARBIE",
    slug: "black-market-barbie",
    lineage: "Permanent Marker S1 × Platinum Lemon Cherry Gelato S1",
    parentOneId: "permanent-marker-s1",
    parentTwoId: "platinum-lemon-cherry-gelato-s1",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "THIRST TRAP COLLECTION",
    theme: "SILK",
    shortDescription:
      "BLACK MARKET BARBIE pairs Permanent Marker S1 with Platinum Lemon Cherry Gelato S1. Two selfed dessert parents, one Bandit release. Marker is known for candy gas, ink, and boutique density; PLCG is known for lemon-cherry, platinum frost, and color. The pairing hunts a dressed-up dessert flower with gas still in the jar.",
    vaultDescription:
      "Two selfed dessert parents. Marker candy-gas and density against PLCG lemon-cherry, frost, and color.",
    longDescription:
      "An S1 on both sides can concentrate familiar traits without turning the pack into a clone. Marker can bring solvent candy, floral dough, and tight internodes. PLCG can bring zesty lemon, cherry candy, and a silvery coat. The interest is whether ink and fruit stack on the same plant, or split into two loud lanes.",
    plantCharacter:
      "Both parents are modern boutique lines. A medium, managed canopy is a fair read, with Marker often bushy and tight-noded. Stretch and internodes can shift with which S1 leads.",
    flowerCharacter:
      "Flowers can come dense and photogenic. Marker is grown for bag appeal; PLCG is grown for platinum frost and citrus-cherry candy. Aroma can lean candy gas, lemon-cherry custard, or both.",
    resinExpression:
      "Both parents are described as heavy frost donors. Resin is a central theme of the pairing.",
    colorPotential:
      "PLCG is often vivid. Marker families can darken. Color may show; it is not locked.",
    aromaDirection:
      "Solvent candy and gas from Marker against lemon, cherry, and cream from PLCG.",
    lineageCharacter:
      "Dessert on both sides, with Marker’s sharper chemical edge against PLCG fruit.",
    breedingInterest:
      "Useful later for candy that still holds gas.",
    whyItsInTheVault:
      "Two selfed dessert parents with ink on one side and lemon-cherry on the other.",
    heroImage: strainArt["black-market-barbie"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "BLACK MARKET BARBIE",
    seoDescription:
      "BLACK MARKET BARBIE is Permanent Marker S1 × Platinum Lemon Cherry Gelato S1. A Bandit Thirst Trap regular with accurate lineage.",
  },
  {
    id: "vault-robbery",
    fileCode: "BG 03",
    name: "VAULT ROBBERY",
    slug: "vault-robbery",
    lineage: "Gorilla Glue #4 S1 × Platinum Frosting",
    parentOneId: "gorilla-glue-4-s1",
    parentTwoId: "platinum-frosting",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "BANDIT COLLECTION",
    theme: "METAL",
    shortDescription:
      "VAULT ROBBERY is Gorilla Glue #4 S1 under Platinum Frosting. Selfed glue keeps the resin-and-fuel family close. Frosting, listed as Platinum Lemon Cherry Gelato × Oreoz, brings lemon-cherry cream and cookie chocolate gas. The file asks what glue does when the other parent is dessert frosting instead of Dante.",
    vaultDescription:
      "Selfed GG4 under Platinum Frosting. Greasy glue resin against lemon-cherry cream and Oreoz cookie gas.",
    longDescription:
      "GG4 S1 can still want vertical room and greasy colas. Frosting can thicken the flower and darken the finish, with PLCG fruit against Oreoz’s chocolate-cookie gas. Compared with GORILLA HEIST, this pack trades Dante fruit for frosting dessert over the same glue spine. Keepers may be the plants that hold both fuel and cream.",
    plantCharacter:
      "GG4 S1 can still stretch and branch. Frosting, sitting on Oreoz and PLCG, can thicken the frame and tighten internodes. Do not assume a squat plant; the pairing suggests a hybrid that may need room and support.",
    flowerCharacter:
      "A fight between glue spears and dessert density is a fair reading. Some plants may ice over early. Some may stack darker, chunkier flowers with cookie gas over pine diesel.",
    resinExpression:
      "Both sides are resin talkers: GG4 for grease, Oreoz for a glassy coat. Heavy frost is the direction.",
    colorPotential:
      "Oreoz and PLCG can run dark. GG4 often stays green. Mixed color in a pack is plausible.",
    aromaDirection:
      "Pine diesel and cocoa glue against lemon-cherry cream and cookie gas.",
    lineageCharacter:
      "Direct GG4 plus PLCG and Oreoz.",
    breedingInterest:
      "A second GG4 anchor beside GORILLA HEIST, for comparing Dante fruit against Frosting dessert.",
    whyItsInTheVault:
      "Glue under frosting, not Dante, so the vault can compare two dessert exits off the same resin spine.",
    heroImage: strainArt["vault-robbery"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "VAULT ROBBERY",
    seoDescription:
      "VAULT ROBBERY is Gorilla Glue #4 S1 × Platinum Frosting. Bandit named regular. Accurate lineage.",
  },
  {
    id: "criminal-cherry",
    fileCode: "BG 04",
    name: "CRIMINAL CHERRY",
    slug: "criminal-cherry",
    lineage: "Tropicana Blue × Blueberry Inferno",
    parentOneId: "tropicana-blue",
    parentTwoId: "blueberry-inferno",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "BANDIT COLLECTION",
    theme: "METAL",
    shortDescription:
      "CRIMINAL CHERRY is Tropicana Blue crossed to Blueberry Inferno. Tropicana Blue is Tropicana Cherry × Blueberry Sugar; Inferno is Blueberry Sugar × Dante's Inferno. Blueberry Sugar sits on both sides, with citrus candy on one parent and darker Dante fruit on the other. The release is fruit-forward, with a cherry-citrus lane still open.",
    vaultDescription:
      "Citrus candy from Tropicana Blue against blueberry and Dante fruit. Frost and color can show; cherry is a direction, not a lock.",
    longDescription:
      "The stack is berry dessert with a citrus exit still available. Tropicana Blue can brighten the top; Inferno can deepen cooked blueberry and invite Dante color. Cherry is a plausible reading of the name and the Tropicana Cherry ancestry, not an assigned terp on every plant.",
    plantCharacter:
      "Both parents are cooperative modern hybrids. A balanced frame is likely, with possible stretch from Tropicana Cherry ancestry. Inferno can add a heavier, stacked outline through Dante.",
    flowerCharacter:
      "Berry lines can pack calyx. Dante in Inferno may add stack and weight. Aroma can run cherry-citrus candy against deeper blueberry and pastry fruit.",
    resinExpression:
      "Frost is a talking point on both parents. Resin is a likely theme.",
    colorPotential:
      "Dante and blueberry dessert lines can darken. Citrus parents sometimes stay greener. Color is on the table.",
    aromaDirection:
      "Cherry citrus candy against cooked blueberry and darker Dante fruit.",
    lineageCharacter:
      "Blueberry Sugar stacked, with Tropicana Cherry and Dante in the wings.",
    breedingInterest:
      "A fruit release with a second Dante touchstone beside GORILLA HEIST.",
    whyItsInTheVault:
      "Stacked blueberry dessert with a citrus lane still open.",
    heroImage: strainArt["criminal-cherry"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "CRIMINAL CHERRY",
    seoDescription:
      "CRIMINAL CHERRY is Tropicana Blue × Blueberry Inferno. Bandit Genetics regular. Fruit first, lineage accurate.",
  },
  {
    id: "velvet-vice",
    fileCode: "BG 05",
    name: "VELVET VICE",
    slug: "velvet-vice",
    lineage: "Gucciberry × Dip N Stix S1",
    parentOneId: "gucciberry",
    parentTwoId: "dip-n-stix-s1",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "THIRST TRAP COLLECTION",
    theme: "SILK",
    shortDescription:
      "VELVET VICE is Gucciberry crossed to Dip N Stix S1. Gucciberry is Blueberry Sugar × Joker Juice 11; Dip N Stix is selfed, with a deeper tree that stays unmapped. The pairing is a looker: jammy blueberry candy against dense, colorful frost. Fruit-forward, not chem-led.",
    vaultDescription:
      "Jammy blueberry candy from Gucciberry with Dip N Stix density, frost, and color potential.",
    longDescription:
      "Gucciberry can offer organized branching and boutique berry. Dip N Stix listings point at density, color, and sweet fruit over earth. Public Dip N Stix pedigrees conflict, so this file does not invent a family tree. The hunt is bag appeal and fruit, not a mapped chem story.",
    plantCharacter:
      "Gucciberry is described as organized and agreeable. Dip N Stix is described as resilient. A manageable hybrid frame is a fair hope, without promising a uniform canopy.",
    flowerCharacter:
      "Both parents are sold on dense, colorful flowers. Blueberry candy from Gucciberry can meet sweet fruit and earth from Dip N Stix. Bag appeal is the direction.",
    resinExpression:
      "Joker Juice and Dip N Stix both carry resin reputations. Frost is likely.",
    colorPotential:
      "Dip N Stix listings mention greens into purple. Gucciberry can show dessert color. Potential is there.",
    aromaDirection:
      "Blueberry candy from Gucciberry. Sweet fruit and earth from Dip N Stix.",
    lineageCharacter:
      "Blueberry Sugar and Joker Juice on one side. An S1 looker on the other.",
    breedingInterest:
      "A berry parent that photographs well, without pretending the Dip N Stix tree is fully mapped.",
    whyItsInTheVault:
      "Boutique berry against a frosty S1 looker.",
    heroImage: strainArt["velvet-vice"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Dip N Stix pedigree",
        body: "Public genealogy is inconsistent. Do not publish a fake family tree on this dossier.",
        confidence: "UNKNOWN",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "VELVET VICE",
    seoDescription:
      "VELVET VICE is Gucciberry × Dip N Stix S1. A Bandit Thirst Trap regular. Lineage as supplied.",
  },
  {
    id: "diamond-thief",
    fileCode: "BG 06",
    name: "DIAMOND THIEF",
    slug: "diamond-thief",
    lineage: "Blue Ve'Gas × Platinum City Diesel",
    parentOneId: "blue-vegas",
    parentTwoId: "platinum-city-diesel",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "BANDIT COLLECTION",
    theme: "METAL",
    shortDescription:
      "DIAMOND THIEF pairs Blue Ve'Gas with Platinum City Diesel. Blue Ve'Gas is Gorilla Butter × Blueberry Sugar, so glue sits one generation back. Platinum City Diesel is Platinum Lemon Cherry Gelato × 3D Chem. The file is frost and fuel sharing a plant: berry butter against platinum chem diesel.",
    vaultDescription:
      "Berry glue-butter from Blue Ve'Gas against platinum chem diesel. Resin-heavy on paper, with berry, lemon-cherry, and fuel in the mix.",
    longDescription:
      "Blue Ve'Gas can bring berry dessert and a buttery glue echo. Platinum City Diesel can bring chem frame, fuel, and PLCG fruit. The same diesel parent also sits in MONEY LAUNDERING, on purpose. Diamonds in the name are a resin metaphor, not a lab result.",
    plantCharacter:
      "3D Chem is used here as a structure parent. Gorilla Butter lines can be sturdy too. A strong frame is likely; height still depends on the plant.",
    flowerCharacter:
      "Boutique frost from the platinum side against berry density from Blue Ve'Gas. Aroma can mix berry butter with lemon-cherry and chem diesel.",
    resinExpression:
      "Glue ancestry plus PLCG plus chem is a resin-heavy recipe on paper.",
    colorPotential:
      "Blueberry Sugar and PLCG can color up. Chem parents sometimes stay greener. Mixed pack likely.",
    aromaDirection:
      "Berry butter against lemon-cherry and chem diesel.",
    lineageCharacter:
      "GG4 influence through Gorilla Butter. Direct PLCG. Direct 3D Chem.",
    breedingInterest:
      "Pairs with MONEY LAUNDERING as the two Platinum City Diesel files.",
    whyItsInTheVault:
      "Berry glue-butter against platinum chem diesel, built for frost.",
    heroImage: strainArt["diamond-thief"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "DIAMOND THIEF",
    seoDescription:
      "DIAMOND THIEF is Blue Ve'Gas × Platinum City Diesel. Bandit regular. Shared diesel anchor with MONEY LAUNDERING.",
  },
  {
    id: "bandit-queen",
    fileCode: "BG 07",
    name: "BANDIT QUEEN",
    slug: "bandit-queen",
    lineage: "Dragon Gas × Blueberry Piff",
    parentOneId: "dragon-gas",
    parentTwoId: "blueberry-piff",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "THIRST TRAP COLLECTION",
    theme: "SILK",
    shortDescription:
      "BANDIT QUEEN is Dragon Gas × Blueberry Piff. Dragon Gas is Grape Gas × Zero Gravity, with a reputation for a sturdy stem, thick sides, resin, and grape-botanical gas. Blueberry Piff has no confirmed pedigree here. The pairing is mapped muscle next to an open blueberry-piff question.",
    vaultDescription:
      "Dragon Gas may bring branching, density, resin, and grape-botanical gas. Blueberry Piff is unmapped, so blueberry or incense notes stay unconfirmed.",
    longDescription:
      "Dragon Gas can suggest density, branching without wild height, and jewel-toned calyxes. Blueberry Piff stays unnamed beyond the name. Watch the grape-gas parent; treat blueberry or incense notes as unconfirmed until flower. Honesty about the second parent is part of the file.",
    plantCharacter:
      "Dragon Gas listings describe a sturdy main stem and thick sides without wild height. Blueberry Piff structure is unknown. The pairing can lean compact and branched on the documented side.",
    flowerCharacter:
      "Dragon Gas is described with detailed calyxes, showy resin, and grape-botanical gas. Blueberry Piff flower character stays open. Color may appear as jewel tones from Dragon Gas; blueberry color is a name reading only.",
    resinExpression:
      "Resin talk sits on the Dragon Gas side. Piff resin is not assigned.",
    colorPotential:
      "Dragon Gas listings mention jewel tones. Blueberry names often color. Still a maybe.",
    aromaDirection:
      "Grape gas is the documented lane. Blueberry and incense piff notes stay guesses until the plants speak.",
    lineageCharacter:
      "One parent is mapped. One parent is not.",
    breedingInterest:
      "Worth running to see if Blueberry Piff adds a high tone over grape gas.",
    whyItsInTheVault:
      "Mapped grape-gas structure beside an honest piff gap.",
    heroImage: strainArt["bandit-queen"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Blueberry Piff",
        body: "Do not fill this parent with folklore. Update when a reliable pedigree is in hand.",
        confidence: "UNKNOWN",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "BANDIT QUEEN",
    seoDescription:
      "BANDIT QUEEN is Dragon Gas × Blueberry Piff. Bandit Thirst Trap regular. Lineage as supplied. Piff history still open.",
  },
  {
    id: "felons-fantasy",
    fileCode: "BG 08",
    name: "FELON'S FANTASY",
    slug: "felons-fantasy",
    lineage: "Jokers Pie × Blue Grapesicle",
    parentOneId: "jokers-pie",
    parentTwoId: "blue-grapesicle",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "THIRST TRAP COLLECTION",
    theme: "SILK",
    shortDescription:
      "FELON'S FANTASY is Jokers Pie crossed to Blue Grapesicle. Jokers Pie is Joker Juice 11 × Grape Pie, often read as grape candy, cream, and a gas back note. Blue Grapesicle’s public trees conflict, so the parent name stays as recorded. The fantasy is fruit dessert, not chem.",
    vaultDescription:
      "Grape candy, cream, and gas from Jokers Pie against a grapesicle fruit parent. Dessert density and purple potential.",
    longDescription:
      "The Pie side can offer medium vigor, color, and candy density. Grapesicle should stay in fruit. Listings disagree on Blue Grapesicle (Blue Ice × Joker Juice 11 versus Blueberry Sugar × Joker Juice), so this file will not freeze a fake tree. Joker Juice may appear on both sides depending on which listing is right.",
    plantCharacter:
      "Jokers Pie is described as medium, vigorous, and trainable. Blue Grapesicle structure waits on a cleaner source. A dessert hybrid frame is the safe read.",
    flowerCharacter:
      "Dessert density and color from the Pie side are a reasonable direction. Grapesicle should echo fruit candy. Chem is unlikely unless a rogue plant appears.",
    resinExpression:
      "Joker Juice parents are often sticky. Frost is likely.",
    colorPotential:
      "Jokers Pie is often described with purple. Grapesicle names suggest cold color too. Potential is high. Not guaranteed.",
    aromaDirection:
      "Grape candy, cream, and a gas back note from Pie. Grapesicle should stay in fruit.",
    lineageCharacter:
      "Joker Juice and grape dessert, with an unresolved Grapesicle pedigree.",
    breedingInterest:
      "A candy release. Update Blue Grapesicle once the cut is confirmed.",
    whyItsInTheVault:
      "Grape dessert on dessert, with the second tree left honest.",
    heroImage: strainArt["felons-fantasy"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Blue Grapesicle conflict",
        body: "Resolve parentage before treating either tree as fact.",
        confidence: "UNKNOWN",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "FELON'S FANTASY",
    seoDescription:
      "FELON'S FANTASY is Jokers Pie × Blue Grapesicle. Bandit Thirst Trap regular. Visible name keeps the apostrophe.",
  },
  {
    id: "money-laundering",
    fileCode: "BG 09",
    name: "MONEY LAUNDERING",
    slug: "money-laundering",
    lineage: "Big Perm × Platinum City Diesel",
    parentOneId: "big-perm",
    parentTwoId: "platinum-city-diesel",
    type: "FEMINIZED_PHOTOPERIOD",
    collection: "BANDIT COLLECTION",
    theme: "METAL",
    shortDescription:
      "MONEY LAUNDERING is Big Perm × Platinum City Diesel. Big Perm is Permanent Marker × 3D Chem; Platinum City Diesel is Platinum Lemon Cherry Gelato × 3D Chem. Chem sits on both sides, with Marker candy-gas on one parent and lemon-cherry diesel on the other.",
    vaultDescription:
      "Permanent Marker candy-gas over stacked 3D Chem and PLCG diesel. Structure may run sturdy; aroma can mix ink, lemon-cherry, and fuel.",
    longDescription:
      "Double 3D Chem can suggest a sturdier frame. Marker can dress the flower; PLCG can add fruit and frost. The pack can also run chem-heavy. Compare with DIAMOND THIEF to see Marker versus berry glue on the same diesel parent.",
    plantCharacter:
      "3D Chem is used as a dependable frame. Dual chem parents may mean thicker arms and less flop. It is still a hunt.",
    flowerCharacter:
      "Marker flowers are grown to be stared at. PLCG adds boutique shape. Chem can add spear and funk. Aroma can mix ink, candy, lemon-cherry, and fuel.",
    resinExpression:
      "Marker, PLCG, and 3D Chem are all resin-adjacent in listings. Frost is likely.",
    colorPotential:
      "Marker and PLCG can color. Chem often stays green. Both lanes are possible.",
    aromaDirection:
      "Ink, candy, lemon-cherry, and chem diesel.",
    lineageCharacter:
      "Permanent Marker plus stacked 3D Chem plus PLCG.",
    breedingInterest:
      "The second Platinum City Diesel file, for comparing Marker against berry glue.",
    whyItsInTheVault:
      "Dessert washed through chem on purpose.",
    heroImage: strainArt["money-laundering"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "MONEY LAUNDERING",
    seoDescription:
      "MONEY LAUNDERING is Big Perm × Platinum City Diesel. Bandit regular. Shared diesel parent with DIAMOND THIEF.",
  },
  {
    id: "highway-robbery",
    fileCode: "BG 10",
    name: "HIGHWAY ROBBERY",
    slug: "highway-robbery",
    lineage: "Guava N Chem Auto × Carbon Cherry Auto",
    parentOneId: "guava-n-chem-auto",
    parentTwoId: "carbon-cherry-auto",
    type: "AUTOFLOWER",
    collection: "BANDIT COLLECTION",
    theme: "FROST",
    shortDescription:
      "HIGHWAY ROBBERY is Guava N Chem Auto × Carbon Cherry Auto. Exact public pages for these Bandit parents are thin. The names suggest tropical fuel against a cherry auto. This is a compact autoflower file, not a photoperiod hunt.",
    vaultDescription:
      "Guava and chem suggest tropical fuel. Cherry from the second parent is a name reading. Auto stature is expected.",
    longDescription:
      "Guava-and-chem autos are often described as fruit over fuel; that is market pattern, not confirmation of this cut. Carbon Cherry stays lightly documented. Similar named packs exist elsewhere and are not treated as this parent. Flower character stays conservative until a Bandit run.",
    plantCharacter:
      "Autoflower stature and a modest frame are the safe read. Exact height and branch habit for this pair remain open.",
    flowerCharacter:
      "Chem-named autos are often grown for grease. Cherry from the second parent is a name reading. Tropical fuel is a plausible direction, not a locked terp list.",
    resinExpression:
      "Chem-named autos are often grown for grease. That is a market pattern, not a measurement.",
    colorPotential:
      "Color is not assigned. Carbon Cherry does not come with a confirmed visual map.",
    aromaDirection:
      "Guava and chem is a plausible tropical fuel split. Cherry from the second parent is a name reading.",
    lineageCharacter:
      "Chem influence is the only mapped family tag.",
    breedingInterest:
      "An auto with chem on the label. Pin the exact parent cuts later.",
    whyItsInTheVault:
      "A fast auto file with honest gaps on both parents.",
    heroImage: strainArt["highway-robbery"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Parent identity",
        body: "Do not attribute another pack’s copy to these parents without confirmation.",
        confidence: "UNKNOWN",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "HIGHWAY ROBBERY",
    seoDescription:
      "HIGHWAY ROBBERY is Guava N Chem Auto × Carbon Cherry Auto. Bandit autoflower. Lineage as supplied.",
  },
  {
    id: "getaway-girl",
    fileCode: "BG 11",
    name: "GETAWAY GIRL",
    slug: "getaway-girl",
    lineage: "Strawberry Milk & Qookies F2 Auto × Red Runtz Auto",
    parentOneId: "strawberry-milk-qookies-f2-auto",
    parentTwoId: "red-runtz-auto",
    type: "AUTOFLOWER",
    collection: "THIRST TRAP COLLECTION",
    theme: "FROST",
    shortDescription:
      "GETAWAY GIRL is Strawberry Milk & Qookies F2 Auto crossed to Red Runtz Auto. The names point at strawberry cream, cookie dessert, and Runtz candy. An F2 on one parent can widen the range. This is the candy auto in the launch set.",
    vaultDescription:
      "Strawberry cream and cookie dessert against Red Runtz candy. Auto stature expected; F2 on one parent may widen the range.",
    longDescription:
      "Close names exist elsewhere and are not treated as this parent. Cookies and Runtz are name tags. Red Runtz families can show candy and occasional red or pink accents; that stays possible, not promised. An F2 parent can scatter, which is useful for a hunt and messy for a uniform tray.",
    plantCharacter:
      "Auto stature is expected. F2 on parent one may widen the range. Structure details stay open.",
    flowerCharacter:
      "Dessert autos are often sticky and candy-led. Strawberry cream and cookie dough are reasonable hopes; Runtz candy may sit on top. Gas and color can appear without being promised.",
    resinExpression:
      "Dessert autos are often sticky. Frost is likely, not logged.",
    colorPotential:
      "Red Runtz families can show red and pink pistils or darker flower. Possible, not promised.",
    aromaDirection:
      "Strawberry cream and cookie dough against Runtz candy. Gas may appear.",
    lineageCharacter:
      "Cookies and Runtz tags from the supplied names.",
    breedingInterest:
      "The candy auto in the launch set.",
    whyItsInTheVault:
      "Strawberry cookie dessert into Red Runtz candy, on auto timing.",
    heroImage: strainArt["getaway-girl"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "GETAWAY GIRL",
    seoDescription:
      "GETAWAY GIRL is Strawberry Milk & Qookies F2 Auto × Red Runtz Auto. Bandit autoflower.",
  },
  {
    id: "speeding-ticket",
    fileCode: "BG 12",
    name: "SPEEDING TICKET",
    slug: "speeding-ticket",
    lineage: "Tropicana Cookies Auto × Atomic Burn Auto",
    parentOneId: "tropicana-cookies-auto",
    parentTwoId: "atomic-burn-auto",
    type: "AUTOFLOWER",
    collection: "BANDIT COLLECTION",
    theme: "FROST",
    shortDescription:
      "SPEEDING TICKET is Tropicana Cookies Auto × Atomic Burn Auto. Tropicana Cookies photoperiods are widely listed as Cookies × Tangie, with orange citrus candy as the family reputation. Atomic Burn Auto has no confirmed pedigree here. Citrus on a timer, with a wildcard in the passenger seat.",
    vaultDescription:
      "Tropicana Cookies auto reputation is orange citrus candy. Atomic Burn is unmapped, so fuel or spice is not assigned.",
    longDescription:
      "Autos that reuse Tropicana Cookies can keep some orange candy or lean toward the auto donor. Atomic Burn stays blank rather than invented. The file exists to see whether the citrus is real when Burn is unknown.",
    plantCharacter:
      "Auto timing and a modest frame are the safe assumptions. Atomic Burn structure is unknown. Expect a compact auto, not a mapped photoperiod outline.",
    flowerCharacter:
      "Orange citrus candy is the Tropicana Cookies reputation. Atomic Burn is not assigned fuel, spice, or dessert. Color can purple on Tropicana Cookies lines; Burn color stays open.",
    resinExpression:
      "Frost is not graded. Tropicana Cookies families can finish resinous; Burn does not add a documented resin claim.",
    colorPotential:
      "Tropicana Cookies lines can purple. Atomic Burn color is unknown.",
    aromaDirection:
      "Orange citrus candy from the Tropicana Cookies reputation. Atomic Burn is not guessed.",
    lineageCharacter:
      "Cookies family through Tropicana Cookies. Second parent unmapped.",
    breedingInterest:
      "Closes the auto trio. Identify Atomic Burn before writing terp scripture.",
    whyItsInTheVault:
      "Citrus on auto timing, with Burn left as a real gap.",
    heroImage: strainArt["speeding-ticket"],
    galleryImages: [],
    featured: false,
    status: "IN VAULT",
    availability: comingSoon,
    researchNotes: [
      {
        topic: "Atomic Burn Auto",
        body: "No reliable pedigree found. Leave blank rather than invent a burn story.",
        confidence: "UNKNOWN",
      },
    ],
    phenotypeNotes: comingSoon,
    growNotes: comingSoon,
    seoTitle: "SPEEDING TICKET",
    seoDescription:
      "SPEEDING TICKET is Tropicana Cookies Auto × Atomic Burn Auto. Bandit autoflower.",
  },
];
