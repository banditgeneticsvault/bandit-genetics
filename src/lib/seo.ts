import type { Metadata } from "next";
import { brand, homeHero, pageCopy, siteUrl, socialPlatforms } from "@/content/site";
import { STRAIN_TYPE_LABELS, type StrainRecord } from "@/data/genetics/types";
import { inferOrderState, SEED_TIERS, type OrderState } from "@/data/order";
import { hasArtworkSrc } from "@/lib/artwork";

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

export function canonicalPath(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "/"): string {
  const normalized = canonicalPath(path);
  if (normalized === "/") return `${siteUrl}/`;
  return `${siteUrl}${normalized}`;
}

export function brandOgImage() {
  const artwork = homeHero.artwork;
  return {
    url: artwork?.src ?? "/images/home/frost-queen-bandit.png",
    width: artwork?.width ?? 1254,
    height: artwork?.height ?? 1254,
    alt: artwork?.alt ?? "Frost Queen, the Bandit Genetics brand mark",
  };
}

function shareTitle(title: string) {
  if (title === brand.name || title.includes(brand.name)) return title;
  return `${title} · ${brand.name}`;
}

function ogImageList(
  images: Array<{ url: string; width?: number; height?: number; alt?: string }>,
) {
  return images.map((image) => ({
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
  }));
}

export function pageMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImages = ogImageList(images && images.length > 0 ? images : [brandOgImage()]);
  const social = shareTitle(title);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: social,
      description,
      url,
      siteName: brand.name,
      locale: "en_US",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: ogImages.map((image) => image.url),
    },
  };
}

export function strainShareImage(strain: StrainRecord) {
  if (!hasArtworkSrc(strain.heroImage)) return undefined;
  return {
    url: strain.heroImage.src,
    width: strain.heroImage.width,
    height: strain.heroImage.height,
    alt: strain.heroImage.alt || strain.name,
  };
}

export function strainSeoDescription(strain: StrainRecord) {
  const typeLabel = STRAIN_TYPE_LABELS[strain.type];
  if (strain.seoDescription.includes(typeLabel)) return strain.seoDescription;
  return `${strain.seoDescription} ${typeLabel}.`;
}

export function strainPageMetadata(strain: StrainRecord): Metadata {
  const image = strainShareImage(strain);

  return pageMetadata({
    title: strain.seoTitle,
    description: strainSeoDescription(strain),
    path: `/strain/${strain.slug}`,
    images: image ? [image] : undefined,
  });
}

type JsonLd = Record<string, unknown>;

function centsToPrice(cents: number) {
  return (cents / 100).toFixed(2);
}

function schemaAvailability(state: OrderState): string | null {
  switch (state) {
    case "AVAILABLE":
    case "LOW_STOCK":
      return "https://schema.org/InStock";
    case "COMING_SOON":
      return "https://schema.org/PreOrder";
    case "SOLD_OUT":
      return "https://schema.org/OutOfStock";
    case "INQUIRY_ONLY":
      return null;
  }
}

export function organizationGraph(): JsonLd {
  const logo = brandOgImage();
  const logoUrl = absoluteUrl(logo.url);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: brand.name,
        url: absoluteUrl("/"),
        description: pageCopy.about.body,
        email: brand.email,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          width: logo.width,
          height: logo.height,
        },
        image: logoUrl,
        sameAs: socialPlatforms.map((platform) => platform.href),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: brand.name,
        url: absoluteUrl("/"),
        description: pageCopy.about.body,
        inLanguage: "en-US",
        publisher: {
          "@id": ORGANIZATION_ID,
        },
      },
    ],
  };
}

export function breadcrumbList(
  crumbs: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    ...breadcrumbList(crumbs),
  };
}

export function vaultBreadcrumbJsonLd() {
  return breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "The Vault", path: "/vault" },
  ]);
}

export function aboutBreadcrumbJsonLd() {
  return breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
}

export function contactBreadcrumbJsonLd() {
  return breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);
}

export function strainJsonLd(strain: StrainRecord): JsonLd {
  const url = absoluteUrl(`/strain/${strain.slug}`);
  const orderState = inferOrderState(strain.availability);
  const availability = schemaAvailability(orderState);
  const image = strainShareImage(strain);
  const prices = SEED_TIERS.map((tier) => tier.priceCents);

  const product: JsonLd = {
    "@type": "Product",
    name: strain.name,
    description: strainSeoDescription(strain),
    url,
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    sku: strain.fileCode,
    category: STRAIN_TYPE_LABELS[strain.type],
  };

  if (image) {
    product.image = [absoluteUrl(image.url)];
  }

  if (availability) {
    product.offers = {
      "@type": "AggregateOffer",
      url,
      priceCurrency: "USD",
      lowPrice: centsToPrice(Math.min(...prices)),
      highPrice: centsToPrice(Math.max(...prices)),
      offerCount: SEED_TIERS.length,
      availability,
      offers: SEED_TIERS.map((tier) => ({
        "@type": "Offer",
        name: tier.label,
        url,
        price: centsToPrice(tier.priceCents),
        priceCurrency: "USD",
        availability,
        seller: {
          "@id": ORGANIZATION_ID,
        },
      })),
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      product,
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "The Vault", path: "/vault" },
        { name: strain.name, path: `/strain/${strain.slug}` },
      ]),
    ],
  };
}
