import type { MetadataRoute } from "next";
import { getStrainSlugs } from "@/data/genetics";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const strains = [...new Set(getStrainSlugs())].map((slug) => ({
    url: absoluteUrl(`/strain/${slug}`),
  }));

  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/vault") },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/contact") },
    ...strains,
  ];
}
