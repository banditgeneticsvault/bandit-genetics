import { notFound } from "next/navigation";
import { GeneticDossier } from "@/components/dossier/GeneticDossier";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStrainBySlug, getStrainSlugs } from "@/data/genetics";
import { strainJsonLd, strainPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type StrainPageProps = PageProps<"/strain/[slug]">;

export function generateStaticParams() {
  return getStrainSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StrainPageProps): Promise<Metadata> {
  const { slug } = await params;
  const strain = getStrainBySlug(slug);
  if (!strain) {
    return { title: "File missing", robots: { index: false, follow: false } };
  }
  return strainPageMetadata(strain);
}

export default async function StrainPage({ params }: StrainPageProps) {
  const { slug } = await params;
  const strain = getStrainBySlug(slug);
  if (!strain) notFound();

  return (
    <main>
      <JsonLd data={strainJsonLd(strain)} />
      <GeneticDossier strain={strain} />
    </main>
  );
}
