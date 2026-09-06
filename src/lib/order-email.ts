import { brand } from "@/content/site";

export function orderMailto(input?: { strainName?: string }) {
  const subject = input?.strainName
    ? `Order inquiry · ${input.strainName}`
    : "Order inquiry";
  const body = input?.strainName
    ? `I would like to place an order for ${input.strainName}. Please include seed counts, shipping details, and any questions.`
    : "I would like to place an order. Please include the strains, seed counts, shipping details, and any questions.";

  return `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
