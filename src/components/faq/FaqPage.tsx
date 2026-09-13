import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { OrderEmailLink } from "@/components/layout/OrderEmailLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { SiteBreadcrumb } from "@/components/seo/SiteBreadcrumb";
import { Button } from "@/components/ui/Button";
import { brand } from "@/content/site";
import { faqCopy, faqSections } from "@/content/faq";

function Atmosphere() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] vault-grate opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_10%_0%,rgb(42_23_51_/_0.45),transparent_40%),radial-gradient(ellipse_at_90%_10%,rgb(22_64_56_/_0.4),transparent_42%)]"
        aria-hidden
      />
    </>
  );
}

export function FaqPage() {
  return (
    <main className="relative overflow-x-clip bg-black">
      <Atmosphere />

      <PageContainer
        width="wide"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28"
      >
        <SiteBreadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "FAQ" },
          ]}
        />

        <header className="grid grid-cols-1 gap-x-12 gap-y-0 border-b border-white/10 pb-10 md:pb-12 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="section-kicker">{faqCopy.kicker}</p>
            <h1 className="mt-3 font-display text-[clamp(2.8rem,9vw,6.2rem)] leading-[0.84] text-frost">
              {faqCopy.title}
            </h1>
          </div>
          <div className="mt-8 max-w-xl space-y-4 lg:mt-0">
            <p className="font-display text-[clamp(1.2rem,3vw,1.85rem)] leading-[1.2] text-gold">
              {faqCopy.lead}
            </p>
            <p className="text-copy leading-relaxed text-ice/80">
              {faqCopy.transition}
            </p>
          </div>
        </header>

        <nav
          aria-label={faqCopy.indexLabel}
          className="mt-8 border-b border-white/10 pb-8 md:mt-10 md:pb-10"
        >
          <p className="section-kicker mb-4">{faqCopy.indexLabel}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {faqSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-11 items-center font-label text-ui tracking-[0.18em] text-ice/60 uppercase hover:text-gold"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4">
          {faqSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-28 border-b border-white/10 py-10 md:py-12"
            >
              <p className="section-kicker">{section.kicker}</p>
              <h2
                id={`${section.id}-title`}
                className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] text-frost"
              >
                {section.title}
              </h2>
              {section.intro ? (
                <p className="mt-4 max-w-2xl text-copy leading-relaxed text-ice/70">
                  {section.intro}
                </p>
              ) : null}
              <div className="mt-6">
                <FaqAccordion items={section.items} />
              </div>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="promise-title"
          className="scroll-mt-28 border-b border-white/10 py-12 md:py-16"
        >
          <p className="section-kicker">{faqCopy.promiseKicker}</p>
          <h2
            id="promise-title"
            className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.1rem)] leading-[0.95] text-frost"
          >
            {faqCopy.promiseTitle}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4">
            {faqCopy.promise.map((paragraph) => (
              <p key={paragraph} className="text-copy leading-relaxed text-ice/80">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="faq-cta-title"
          className="scroll-mt-28 pt-12 md:pt-16"
        >
          <p className="section-kicker">{faqCopy.ctaKicker}</p>
          <h2
            id="faq-cta-title"
            className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.92] text-frost"
          >
            {faqCopy.ctaTitle}
          </h2>
          <p className="mt-5 max-w-xl text-copy leading-relaxed text-ice/80">
            {faqCopy.ctaBody}{" "}
            <OrderEmailLink />.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`mailto:${brand.email}`}>{faqCopy.ctaButton}</Button>
            <Button href="/contact" variant="secondary">
              {faqCopy.contactButton}
            </Button>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
