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

export function AboutPage() {
  const [philosophyOne, philosophyTwo] = aboutCopy.philosophyTitle.split("\n");

  return (
    <main className="relative overflow-x-clip bg-black">
      <Atmosphere />

      <PageContainer
        width="wide"
        className="relative pt-28 pb-20 md:pt-36 md:pb-28"
      >
        <header className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-12">
          <div className="lg:col-span-7">
            <Kicker>{aboutCopy.kicker}</Kicker>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.86] text-frost">
              {aboutCopy.title}
            </h1>
            <p className="mt-6 max-w-xl font-display text-[clamp(1.25rem,3.2vw,2rem)] leading-[1.12] text-ice">
              {aboutCopy.slogan}
            </p>
          </div>
          <div className="max-w-xl lg:col-span-5">
            {aboutCopy.opening.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-copy leading-relaxed text-ice/80 first:mt-0"
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
          <p className="mt-4 max-w-2xl text-copy leading-relaxed text-ice/75">
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

        <section className="mt-12 grid gap-10 border-b border-white/10 pb-12 md:mt-14 md:gap-12 md:pb-14 lg:grid-cols-2">
          <div>
            <Kicker>{aboutCopy.crossesKicker}</Kicker>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost">
              {aboutCopy.crossesTitle}
            </h2>
            {aboutCopy.crosses.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 max-w-prose text-copy leading-relaxed text-ice/80"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <Kicker>{aboutCopy.huntKicker}</Kicker>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost">
              {aboutCopy.huntTitle}
            </h2>
            {aboutCopy.hunt.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 max-w-prose text-copy leading-relaxed text-ice/80"
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-6 font-display text-[clamp(1.35rem,3vw,1.85rem)] leading-[1.1] text-frost">
              {aboutCopy.huntPull}
            </p>
            <ul className="mt-4 space-y-1.5">
              {aboutCopy.huntMarks.map((line) => (
                <li
                  key={line}
                  className="font-label text-ui tracking-[0.12em] text-ice/70 uppercase"
                >
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-copy-lg leading-relaxed text-ice/85">
              {aboutCopy.huntClose}
            </p>
          </div>
        </section>

        <section
          aria-labelledby="philosophy-title"
          className="mt-12 grid gap-8 border-b border-white/10 pb-12 md:mt-14 md:pb-14 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-7">
            <Kicker>{aboutCopy.philosophyKicker}</Kicker>
            <h2
              id="philosophy-title"
              className="mt-3 font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.95] text-frost"
            >
              {philosophyOne}
              <span className="mt-1 block text-ice">{philosophyTwo}</span>
            </h2>
          </div>
          <div className="max-w-xl lg:col-span-5">
            {aboutCopy.philosophy.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-copy leading-relaxed text-ice/80 first:mt-0"
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-6 font-display text-[clamp(1.35rem,3vw,1.9rem)] leading-[1.1] text-frost">
              {aboutCopy.philosophyClose}
            </p>
          </div>
        </section>

        <section
          aria-labelledby="vault-title"
          className="mt-12 border-b border-white/10 pb-12 md:mt-14 md:pb-14"
        >
          <Kicker>{aboutCopy.vaultKicker}</Kicker>
          <h2
            id="vault-title"
            className="mt-3 max-w-3xl font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost"
          >
            {aboutCopy.vaultTitle}
          </h2>
          {aboutCopy.vault.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 max-w-prose text-copy leading-relaxed text-ice/80"
            >
              {paragraph}
            </p>
          ))}
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
