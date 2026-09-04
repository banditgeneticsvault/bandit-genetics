import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SiteBreadcrumb } from "@/components/seo/SiteBreadcrumb";
import { VaultArchive } from "@/components/vault/VaultArchive";
import { brand, seoCopy, vaultCopy } from "@/content/site";
import { getVaultListItems } from "@/data/genetics";
import { pageMetadata, vaultBreadcrumbJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: vaultCopy.title,
  description: seoCopy.vaultDescription,
  path: "/vault",
});

export default function VaultPage() {
  const items = getVaultListItems();

  return (
    <main className="relative overflow-x-clip bg-black">
      <JsonLd data={vaultBreadcrumbJsonLd()} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] vault-grate opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_10%_0%,rgb(42_23_51_/_0.45),transparent_40%),radial-gradient(ellipse_at_90%_10%,rgb(22_64_56_/_0.4),transparent_42%)]"
        aria-hidden
      />

      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <SiteBreadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "The Vault" },
          ]}
        />
        <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="section-kicker">
              {vaultCopy.kicker}
            </p>
            <h1 className="mt-4 font-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.82] text-frost">
              {vaultCopy.title}
            </h1>
            <p className="mt-6 max-w-full font-display text-[clamp(1.2rem,5.6vw,2.2rem)] leading-[1.12] text-ice">
              {vaultCopy.statement}
            </p>
          </div>
          <div className="max-w-sm lg:col-span-4 lg:col-start-9">
            <p className="text-copy leading-relaxed text-ice/75">
              {vaultCopy.intro}
            </p>
            <p className="mt-6 font-label text-ui tracking-[0.18em] text-gold">
              {brand.philosophy}
            </p>
          </div>
        </div>

        <VaultArchive items={items} />
      </PageContainer>
    </main>
  );
}
