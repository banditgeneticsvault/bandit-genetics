import type { StrainImage } from "@/data/genetics/types";

/** Site-root paths served from `public/images`. */
export const IMAGE_ROOT = "/images" as const;

export function homeArtworkSrc(file = "hero.webp"): string {
  return `${IMAGE_ROOT}/home/${file}`;
}

export function strainHeroSrc(slug: string, file = "hero.webp"): string {
  return `${IMAGE_ROOT}/strains/${slug}/${file}`;
}

export function strainGallerySrc(slug: string, file: string): string {
  return `${IMAGE_ROOT}/strains/${slug}/${file}`;
}

export function hasArtworkSrc(
  image?: StrainImage,
): image is StrainImage {
  return Boolean(image?.src);
}
