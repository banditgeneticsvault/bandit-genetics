import { ContactForm } from "@/components/contact/ContactForm";
import { VaultAtmosphere } from "@/components/home/VaultAtmosphere";
import { PageContainer } from "@/components/layout/PageContainer";
import { homeHero, pageCopy } from "@/content/site";
import type { Metadata } from "next";

const copy = pageCopy.contact;

export const metadata: Metadata = {
  title: "Contact",
  description: copy.body,
};

export default function ContactPage() {
  return (
    <main className="relative isolate min-h-[100dvh] overflow-x-clip bg-black">
      <VaultAtmosphere
        softened
        tone="page"
        background={homeHero.background}
      />

      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <header className="mb-12 max-w-3xl">
          <h1 className="font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[0.9] font-medium tracking-tight text-frost drop-shadow-[0_2px_16px_rgb(0_0_0_/_0.72)]">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-xl text-copy leading-relaxed text-ice drop-shadow-[0_2px_12px_rgb(0_0_0_/_0.7)]">
            {copy.body}
          </p>
        </header>

        <div className="max-w-xl">
          <ContactForm />
        </div>
      </PageContainer>
    </main>
  );
}
