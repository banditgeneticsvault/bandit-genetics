import { notFound } from "next/navigation";
import { GeneticDossier } from "@/components/dossier/GeneticDossier";
import { getStrainBySlug, getStrainSlugs } from "@/data/genetics";
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
    return { title: "File missing" };
  }
  return {
    title: strain.seoTitle,
    description: strain.seoDescription,
  };
}

export default async function StrainPage({ params }: StrainPageProps) {
  const { slug } = await params;
  const strain = getStrainBySlug(slug);
  if (!strain) notFound();

  return (
    <main>
      <GeneticDossier strain={strain} />
    </main>
  );
}
