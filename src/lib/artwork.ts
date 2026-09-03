import type { StrainImage } from "@/data/genetics/types";

/** Site-root paths served from `public/images`. */
export const IMAGE_ROOT = "/images" as const;

export function homeArtworkSrc(file: string): string {
  return `${IMAGE_ROOT}/home/${file}`;
}

export function strainHeroSrc(slug: string, file: string): string {
  return `${IMAGE_ROOT}/strains/${slug}/${file}`;
}

export function strainGallerySrc(slug: string, file: string): string {
  return `${IMAGE_ROOT}/strains/${slug}/${file}`;
}

export function localStrainImage(
  slug: string,
  file: string,
  alt: string,
  width: number,
  height: number,
): StrainImage {
  return {
    src: strainHeroSrc(slug, file),
    alt,
    width,
    height,
  };
}

export function hasArtworkSrc(
  image?: StrainImage,
): image is StrainImage {
  return Boolean(image?.src);
}

export function pickVaultImage(strain: {
  vaultImage?: StrainImage;
  heroImage?: StrainImage;
}): StrainImage | undefined {
  return hasArtworkSrc(strain.vaultImage)
    ? strain.vaultImage
    : strain.heroImage;
}

export function isLandscapeArtwork(image?: StrainImage): boolean {
  if (!image?.width || !image.height) return false;
  return image.width > image.height;
}
