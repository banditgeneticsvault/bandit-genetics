import { ContactForm } from "@/components/contact/ContactForm";
import { PageContainer } from "@/components/layout/PageContainer";
import { pageCopy } from "@/content/site";
import type { Metadata } from "next";

const copy = pageCopy.contact;

export const metadata: Metadata = {
  title: "Contact",
  description: copy.body,
};

export default function ContactPage() {
  return (
    <main className="relative overflow-x-clip bg-black">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] vault-grate opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_10%_0%,rgb(42_23_51_/_0.45),transparent_40%),radial-gradient(ellipse_at_90%_10%,rgb(22_64_56_/_0.4),transparent_42%)]"
        aria-hidden
      />

      <PageContainer width="wide" className="relative pt-28 pb-20 md:pt-36 md:pb-28">
        <header className="mb-12 max-w-3xl">
          <h1 className="font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[0.9] font-medium tracking-tight text-frost">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-xl text-copy leading-relaxed text-ice/80">
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
