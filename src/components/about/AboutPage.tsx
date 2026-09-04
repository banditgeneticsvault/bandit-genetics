import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { aboutCopy } from "@/content/about";

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

function Kicker({ children }: { children: string }) {
  return <p className="section-kicker">{children}</p>;
}

function PairBody({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="mt-4 space-y-4 lg:mt-0">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-copy leading-relaxed text-ice/80">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function AboutPage() {
  const [philosophyOne, philosophyTwo] = aboutCopy.philosophyTitle.split("\n");

  return (
    <main className="relative overflow-x-clip bg-black">
      <Atmosphere />

      <PageContainer
        width="wide"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28"
      >
        <header className="grid grid-cols-1 gap-x-12 gap-y-0 border-b border-white/10 pb-10 md:pb-12 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-y-3">
          <Kicker>{aboutCopy.kicker}</Kicker>
          <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.86] text-frost lg:col-start-1 lg:row-start-2 lg:mt-0">
            {aboutCopy.title}
          </h1>
          <p className="mt-6 max-w-xl font-display text-[clamp(1.25rem,3.2vw,2rem)] leading-[1.12] text-ice lg:col-start-1 lg:row-start-3 lg:mt-0">
            {aboutCopy.slogan}
          </p>
          <div className="mt-8 space-y-4 lg:col-start-2 lg:row-span-2 lg:row-start-2 lg:mt-0">
            {aboutCopy.opening.map((paragraph) => (
              <p
                key={paragraph}
                className="text-copy leading-relaxed text-ice/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <section
          aria-labelledby="focus-title"
          className="mt-12 border-b border-white/10 pb-12 md:mt-14 md:pb-14"
        >
          <Kicker>{aboutCopy.focusKicker}</Kicker>
          <h2
            id="focus-title"
            className="mt-3 max-w-3xl font-display text-[clamp(1.9rem,4.5vw,3.2rem)] leading-[0.95] text-frost"
          >
            {aboutCopy.focusTitle}
          </h2>
          <p className="mt-4 max-w-3xl text-copy leading-relaxed text-ice/75">
            {aboutCopy.focusIntro}
          </p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {aboutCopy.focus.map((item) => (
              <li
                key={item.id}
                className="border border-white/10 bg-charcoal px-5 py-6"
              >
                <h3 className="font-display text-[clamp(1.45rem,2.4vw,1.85rem)] leading-tight text-frost">
                  {item.title}
                </h3>
                <p className="mt-3 text-copy leading-relaxed text-ice/75">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-x-12 gap-y-0 border-b border-white/10 pb-12 md:mt-14 md:pb-14 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto] lg:items-start lg:gap-y-3">
          <div className="lg:col-start-1 lg:row-start-1">
            <Kicker>{aboutCopy.crossesKicker}</Kicker>
          </div>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost lg:col-start-1 lg:row-start-2 lg:mt-0">
            {aboutCopy.crossesTitle}
          </h2>
          <div className="lg:col-start-1 lg:row-start-3">
            <PairBody paragraphs={aboutCopy.crosses} />
          </div>

          <div className="mt-10 lg:col-start-2 lg:row-start-1 lg:mt-0">
            <Kicker>{aboutCopy.huntKicker}</Kicker>
          </div>
          <h2 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost lg:col-start-2 lg:row-start-2 lg:mt-0">
            {aboutCopy.huntTitle}
          </h2>
          <div className="lg:col-start-2 lg:row-start-3">
            <PairBody paragraphs={aboutCopy.hunt} />
          </div>
        </section>

        <section
          aria-labelledby="philosophy-title"
          className="mt-12 border-b border-white/10 pb-12 md:mt-14 md:pb-14"
        >
          <Kicker>{aboutCopy.philosophyKicker}</Kicker>
          <h2
            id="philosophy-title"
            className="mt-3 max-w-4xl font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.95] text-frost"
          >
            {philosophyOne}
            <span className="mt-1 block text-ice">{philosophyTwo}</span>
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2 lg:items-start">
            {aboutCopy.philosophy.map((paragraph) => (
              <p
                key={paragraph}
                className="text-copy leading-relaxed text-ice/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="vault-title"
          className="mt-12 border-b border-white/10 pb-12 md:mt-14 md:pb-14"
        >
          <Kicker>{aboutCopy.vaultKicker}</Kicker>
          <h2
            id="vault-title"
            className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost"
          >
            {aboutCopy.vaultTitle}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-2 lg:items-start">
            {aboutCopy.vault.map((paragraph) => (
              <p
                key={paragraph}
                className="text-copy leading-relaxed text-ice/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-12 md:mt-16">
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button href={aboutCopy.vaultCta.href}>
              {aboutCopy.vaultCta.label}
            </Button>
            <Button href={aboutCopy.contactCta.href} variant="secondary">
              {aboutCopy.contactCta.label}
            </Button>
          </div>
        </section>
      </PageContainer>
    </main>
  );
}
