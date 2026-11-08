import { brand } from "@/content/site";

export type FaqItem = {
  id: string;
  question: string;
  paragraphs: readonly string[];
};

export type FaqSection = {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
  items: readonly FaqItem[];
};

export const faqCopy = {
  kicker: "OPEN FILE",
  title: "FAQ",
  lead: "Questions are good. Especially when you're buying genetics from a name you haven't heard before.",
  transition: "So here's everything we think you should know about Bandit.",
  indexLabel: "On this page",
  promiseKicker: "THE PROMISE",
  promiseTitle: "Small business. Real people. Real genetics.",
  promise: [
    "Every order that comes in is an actual order. Someone here reads it. Someone here follows up. Someone here packs what goes out.",
    "Bandit is being built carefully. We would rather grow at the speed of the work than look bigger than we are. The name on the pack is the same name on the inbox, and we care what that name is attached to.",
  ],
  ctaKicker: "DIRECT LINE",
  ctaTitle: "Still have a question?",
  ctaBody: "Ask us. Email lands with the people running Bandit, not a ticket maze.",
  ctaButton: "EMAIL BANDIT",
  contactButton: "CONTACT PAGE",
} as const;

export const faqSections: readonly FaqSection[] = [
  {
    id: "meet-bandit",
    kicker: "THE OPERATION",
    title: "Meet Bandit",
    intro:
      "Start here if you want to know who you're dealing with before you think about an order.",
    items: [
      {
        id: "who-is-bandit",
        question: "Who is Bandit Genetics?",
        paragraphs: [
          "Bandit Genetics is a small, family-owned cannabis genetics company. We hunt down plants worth studying, breed with them, and release a selective public collection through The Vault.",
          "We are not trying to be the catalog with everything. We want the Bandit name on genetics we actually believe belong in the collection.",
        ],
      },
      {
        id: "family-owned",
        question: "Is Bandit Genetics family owned?",
        paragraphs: [
          "Yes. Bandit is a family-owned business. When you write, you are reaching the people who run it.",
        ],
      },
      {
        id: "who-is-behind-bandit",
        question: "Who's behind Bandit?",
        paragraphs: [
          "A family that's been in genetics and the culture for a while. Long enough to know what deserves a slot. Small enough that customers still talk to the people doing the work.",
          "If you want to talk to us, email works. The inbox is the introduction.",
        ],
      },
      {
        id: "how-long",
        question: "How long have you been doing this?",
        paragraphs: [
          "This did not begin when the website did. The people behind Bandit have been around the space for some time.",
          "We are not going to hang a number on it. The honest version is simpler: the collection comes from work that was already happening. A public run is how we decided to share it.",
        ],
      },
      {
        id: "why-open-public",
        question: "Why did you open Bandit Genetics to the public?",
        paragraphs: [
          "Because we wanted other people to run what we'd been working with. For a long time this lived with us. Opening The Vault is a choice to put a carefully selected collection in reach, not a rebrand of a giant inventory.",
        ],
      },
      {
        id: "bandit-name",
        question: "What does the Bandit name mean?",
        paragraphs: [
          "Bandit is the name we put on work we think should get out of exclusive circles and into real rooms. Interesting genetics should not only sit behind a famous label or an outrageous price.",
          "The slogan is the short version: taken from the best, bred for the rest.",
        ],
      },
      {
        id: "slogan",
        question: `What does “${brand.sloganInline}” mean?`,
        paragraphs: [
          "We look for exceptional plants, study what makes them interesting, and breed toward work that growers can actually run. Sourced from the elite. Brought to people who will pop it.",
          "It is not a claim that every seed is a finished cut. It is a stance: the good stuff should not stay locked up just because a name got popular.",
        ],
      },
      {
        id: "vs-large-company",
        question: "What makes Bandit different from a large seed company?",
        paragraphs: [
          "Scale, mostly. A large company can afford a sprawling catalog and a distant support line. We cannot, and we are not trying to.",
          "We keep the collection selective so a Bandit file means we wanted it in here. Orders are handled personally. If something is unclear on a page, we would rather say so than pad the file.",
        ],
      },
      {
        id: "why-small-collection",
        question: "Why is your collection intentionally small?",
        paragraphs: [
          "Because we only want the Bandit name on genetics we genuinely believe belong in The Vault. Adding names to look busy would make the catalog cheaper, not better.",
          "A smaller collection is how we stay honest about what we are willing to stand behind.",
        ],
      },
    ],
  },
  {
    id: "why-now",
    kicker: "THE PUBLIC RUN",
    title: "Why now?",
    items: [
      {
        id: "why-public-run-now",
        question: "Why are you doing a public run now?",
        paragraphs: [
          "We have been working with genetics for some time. Sharing that work publicly was always going to be a real chapter, not a side listing. We wanted the collection ready, and we wanted the timing to make sense.",
          "Most of the changes to the federal definition of hemp are scheduled for December 11, 2026. Those changes could materially affect how viable cannabis seeds are treated under the federal hemp framework. We are not going to predict the outcome for you. We are not going to tell you the sky is falling.",
          "What we can say is this: we were ready to open The Vault, and with the federal landscape shifting, this felt like the right time to do it. December 11, 2026 is not a closing date, and it is not a last order date.",
        ],
      },
    ],
  },
  {
    id: "first-time",
    kicker: "FIRST TIME HERE",
    title: "If you're just finding us",
    intro:
      "Plenty of people land here from a search, a post, or a friend. You do not need to already know the name.",
    items: [
      {
        id: "is-bandit-real",
        question: "How do I know Bandit Genetics is a real business?",
        paragraphs: [
          `If you're discovering us for the first time, it's fair to have questions. We're a small business. A smaller name does not automatically come with years of familiarity, and we would not ask you to pretend it does.`,
          `We're family owned. We keep the operation small on purpose. You can write ${brand.email} before you place an order, after you place one, or if something feels off. We'd rather earn trust in how we treat you than ask you to take a slogan as proof.`,
        ],
      },
      {
        id: "who-am-i-buying-from",
        question: "Who am I actually buying from?",
        paragraphs: [
          "You're buying from Bandit Genetics — the same family-owned company behind The Vault, the dossiers, and the inbox. There isn't a hidden storefront on the other side of the brand.",
          "Orders are handled by the people running Bandit. That is slower than a giant checkout machine. It is also why you can actually reach us.",
        ],
      },
      {
        id: "talk-before-order",
        question: "Can I talk to someone before placing an order?",
        paragraphs: [
          `Yes. Email ${brand.email} or use the Contact page. Ask about a file, an order, or anything that isn't sitting right. A real person reads it.`,
        ],
      },
    ],
  },
  {
    id: "the-vault",
    kicker: "THE ARCHIVE",
    title: "The Vault",
    items: [
      {
        id: "why-not-hundreds",
        question: "Why don't you have hundreds of strains?",
        paragraphs: [
          "Because most of those names would be filler. We would rather keep a focused library than stock a wall of files we don't stand behind.",
          "The Vault is meant to stay selective on purpose. If a release does not deserve a slot, it does not get one.",
        ],
      },
      {
        id: "how-vault-is-chosen",
        question: "How do you choose what makes it into The Vault?",
        paragraphs: [
          "A file has to have a reason to exist. We look for plants and crosses that are actually interesting to hunt — resin, color, aroma, structure, flower quality, unusual expression — not another pairing for the sake of a label.",
          "If it does not earn a slot, it stays out. That is the whole filter.",
        ],
      },
      {
        id: "all-genetics-available",
        question: "Are all of your genetics available right now?",
        paragraphs: [
          "Not necessarily. The Vault is the library. What you can order depends on the status on each file. Some genetics are available now. Others may be coming soon, sold out, or inquiry only.",
          "If a file can be ordered, you can add it to the cart. If it can't, the page will say so.",
        ],
      },
      {
        id: "information-coming-soon",
        question: "Why does some strain information say information coming soon?",
        paragraphs: [
          "Because we do not invent a plant log to make a page look finished. Some notes — phenotype observations, grow notes, remarks — are reserved for Bandit data that is not on the file yet.",
          "If we don't have something worth saying, we'd rather tell you that than make something up. Lineage we can document stays documented. The rest waits.",
        ],
      },
      {
        id: "available-now",
        question: "What does available now mean?",
        paragraphs: [
          "Available now means that file can be added to the cart and included in an order. It is the order status, not a promise about how the plant will turn out.",
          "Information coming soon is different. That is missing write-up on the dossier, not a claim that the genetics are unavailable.",
        ],
      },
      {
        id: "more-releases",
        question: "Will you release more genetics?",
        paragraphs: [
          "The archive should grow when a release deserves a slot, not because a catalog looks empty without more names. We are not going to promise a drop calendar from here.",
          "When something earns its way in, it will show up in The Vault.",
        ],
      },
    ],
  },
  {
    id: "orders",
    kicker: "THE DESK",
    title: "Orders",
    intro: "This is the actual path. Nothing hidden behind checkout.",
    items: [
      {
        id: "how-to-order",
        question: "How do I place an order?",
        paragraphs: [
          "Open The Vault, choose the genetics you want, and add them to the cart. Then go to checkout, enter your name and email, and place your order.",
          "That's an order. We receive it, then we follow up with you to complete payment.",
        ],
      },
      {
        id: "after-order",
        question: "What happens after I place my order?",
        paragraphs: [
          "Bandit receives the order. You'll see confirmation on the site that we have it. Then we follow up at the email you entered to complete payment and confirm where the order should ship.",
          "Checkout collects your name and email so we can reach you. Shipping details are confirmed in that follow-up. Once payment is completed, we prepare the order for shipment.",
        ],
      },
      {
        id: "order-confirmation",
        question: "Will I receive an order confirmation?",
        paragraphs: [
          "Yes. After you place the order, the site confirms that we have it. That confirmation means the order reached Bandit. It is not payment yet, and it is not a shipment yet.",
          "The next message you should expect is us following up at the email you provided.",
        ],
      },
      {
        id: "payment-process",
        question: "How does the payment process work?",
        paragraphs: [
          "You place the order on the site. We follow up directly to complete payment. After payment is completed, we prepare the shipment.",
          "If anything about that follow-up is unclear, reply to it or email us. Questions can be answered in the same conversation.",
        ],
      },
      {
        id: "why-not-card-at-checkout",
        question: "Why don't I pay by card directly at checkout?",
        paragraphs: [
          "Checkout is where you place the order. Payment is completed afterward, when we follow up with you. That is how Bandit handles orders right now.",
          "It keeps the desk personal. You hear from us. If you have a question before money moves, you can ask it.",
        ],
      },
      {
        id: "when-it-ships",
        question: "When will my order actually ship?",
        paragraphs: [
          "After payment is completed, we prepare the order for shipment. We do not publish a guaranteed ship date or delivery window.",
          "If you need a status, email us with your name and the email you used at checkout. We'll look up the order.",
        ],
      },
      {
        id: "order-being-handled",
        question: "How do I know my order is being handled?",
        paragraphs: [
          "If you placed the order, we have it. The next step is our follow-up to complete payment. If you have not heard anything and you are unsure, write to us with the email you used at checkout.",
        ],
      },
    ],
  },
  {
    id: "payment",
    kicker: "PAYMENT",
    title: "Payment",
    items: [
      {
        id: "why-payment-after-order",
        question: "Why is payment handled after I place my order?",
        paragraphs: [
          `Bandit currently follows up directly after an order is placed to complete payment. You place the order, we receive it, then we contact you at the email you entered.`,
          `That follow-up is also where shipping details get confirmed and where questions can be answered before the order is packed. If you want to reach us first, use ${brand.email}.`,
        ],
      },
    ],
  },
  {
    id: "shipping",
    kicker: "SHIPMENT",
    title: "Shipping",
    items: [
      {
        id: "where-we-ship",
        question: "Where do you ship?",
        paragraphs: [
          "We ship within the United States.",
        ],
      },
      {
        id: "international",
        question: "Do you ship internationally?",
        paragraphs: [
          "No. Orders ship inside the United States only.",
        ],
      },
      {
        id: "how-shipped",
        question: "How are orders shipped?",
        paragraphs: [
          "After payment is completed, we pack the order and ship it to the United States address confirmed in our follow-up.",
          "Checkout shows the shipping charge for your cart, including when an order qualifies for free shipping. We do not name a carrier here as a promise.",
        ],
      },
      {
        id: "shipping-time",
        question: "How long does shipping usually take?",
        paragraphs: [
          "We don't publish a delivery window. Carriers vary, and we are not going to guarantee someone else's timeline.",
          "If a package is taking longer than feels reasonable, email us and we will look at it with you.",
        ],
      },
      {
        id: "package-delayed",
        question: "What happens if my package is delayed?",
        paragraphs: [
          `Write to ${brand.email} with the email you used on the order. We'll look at what we have and go from there. We can't control a carrier once a package is moving, but you should not be left guessing whether we still have you.`,
        ],
      },
      {
        id: "package-damaged",
        question: "What happens if my package arrives damaged?",
        paragraphs: [
          "Contact us and tell us what arrived. Send photos if you have them. We will look at the situation with you.",
          "We are not going to write you a blank promise from this page. We are going to ask that you actually reach us so a real person can see it.",
        ],
      },
      {
        id: "wrong-address",
        question: "What if I entered the wrong address?",
        paragraphs: [
          "Checkout does not collect a street address. Shipping details are confirmed when we follow up after the order.",
          "Give us the correct address in that conversation. If something already looks wrong, email us as soon as you notice.",
        ],
      },
      {
        id: "update-address",
        question: "Can I update my shipping address?",
        paragraphs: [
          "Yes — reach us with the email you used at checkout and the address it should go to. The sooner you write, the easier it is to catch before the order ships.",
          "Once a package is already moving, changing the address may not be possible.",
        ],
      },
    ],
  },
  {
    id: "packaging",
    kicker: "THE PACK",
    title: "Packaging",
    items: [
      {
        id: "how-packaged",
        question: "How are my seeds packaged?",
        paragraphs: [
          "Orders are packed here with care, not thrown in a loose envelope and hoped for. Seeds go out in packaging meant to protect them in transit, inside a professional shipment.",
          "We keep the presentation intentional. It should look like it came from a real operation, because it did.",
        ],
      },
      {
        id: "arrive-safely",
        question: "Will my order arrive safely?",
        paragraphs: [
          "We pack so the order can travel. We cannot control every mile after it leaves. If something arrives in a condition that does not look right, contact us.",
        ],
      },
      {
        id: "discreet-packaging",
        question: "Is the packaging discreet?",
        paragraphs: [
          "Yes. We ship in plain, professional packaging. Nothing about the outside of the package is meant to advertise the contents.",
        ],
      },
    ],
  },
  {
    id: "storage",
    kicker: "KEEPING SEED",
    title: "Storage",
    items: [
      {
        id: "how-to-store",
        question: "How should I store my seeds?",
        paragraphs: [
          "Keep them cool, dry, and dark. Avoid moisture and big temperature swings.",
          "If you are holding them longer, an airtight or moisture-resistant container helps. Don't overcomplicate it, and don't try to aggressively dry seed yourself.",
        ],
      },
    ],
  },
  {
    id: "germination",
    kicker: "THE POP",
    title: "Germination",
    items: [
      {
        id: "germination-guarantee",
        question: "Do you guarantee germination?",
        paragraphs: [
          "No. We do not publish a germination guarantee. Too much of the result depends on the seed, the genetics, how it was stored, and how it is started.",
          "A guarantee we could not honestly keep would not help anyone.",
        ],
      },
      {
        id: "seed-problem",
        question: "What if I have a problem with my seeds?",
        paragraphs: [
          `Email ${brand.email} and tell us what you received and what you're seeing. Include the email you used on the order so we can find it.`,
          "We are not going to script an outcome from this page. We are going to tell you to come to us if something is actually wrong.",
        ],
      },
      {
        id: "something-not-right",
        question: "What should I do if something doesn't look right?",
        paragraphs: [
          "Write to us. A photo helps. Don't assume you are on your own, and don't wait until you've talked yourself out of sending the email.",
        ],
      },
    ],
  },
  {
    id: "legal",
    kicker: "ACCESS",
    title: "Legal and age",
    items: [
      {
        id: "why-21",
        question: "Why do I need to be 21+?",
        paragraphs: [
          "Access to Bandit Genetics is restricted to people 21 years of age or older. That is the door to the site, and it stays that way.",
        ],
      },
      {
        id: "are-seeds-legal",
        question: "Are cannabis seeds legal?",
        paragraphs: [
          "It depends on where you are. Seed laws are not the same in every jurisdiction, and we are not going to tell you they are legal everywhere.",
          "You are responsible for knowing and following the laws that apply to you.",
        ],
      },
      {
        id: "can-i-grow",
        question: "Can I grow these seeds?",
        paragraphs: [
          "Purchasing seeds does not, by itself, make cultivation legal where you live. Whether you can grow is a question of the laws that apply to you, not a permission slip from this website.",
          "We do not give cultivation advice in this FAQ.",
        ],
      },
      {
        id: "check-local-laws",
        question: "Do I need to check my local laws?",
        paragraphs: [
          "Yes. Federal, state, and local rules can all matter, and they can differ. Check them before you order, and before you do anything with seed.",
          "The scheduled federal change on December 11, 2026 is one reason people are paying attention. It is not a blanket statement that every seed is illegal, and it is not legal advice.",
        ],
      },
    ],
  },
  {
    id: "support",
    kicker: "THE INBOX",
    title: "Customer support",
    items: [
      {
        id: "real-person",
        question: "Can I talk to a real person?",
        paragraphs: [
          `Yes. Email ${brand.email} or send a message on the Contact page. You are not getting pushed through a corporate support tree. The people behind Bandit read the mail.`,
        ],
      },
      {
        id: "question-not-here",
        question: "What if my question isn't answered here?",
        paragraphs: [
          "Then ask it. This page is what we thought you should know. It is not a wall. If something is still sitting with you, we would rather hear it than have you guess.",
        ],
      },
      {
        id: "order-contact",
        question: "Who do I contact about an order?",
        paragraphs: [
          `Email ${brand.email} and include the name and email you used at checkout. You can also use the Contact page.`,
          "That is the line for an order you already placed, a payment follow-up, or a shipment question.",
        ],
      },
    ],
  },
];

export function allFaqItems() {
  return faqSections.flatMap((section) => section.items);
}
