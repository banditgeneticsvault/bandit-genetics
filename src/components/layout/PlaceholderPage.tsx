import { Section, SectionHeader } from "@/components/ui/Section";
import { pageCopy } from "@/content/site";

type PlaceholderPageProps = {
  page: keyof typeof pageCopy;
};

export function PlaceholderPage({ page }: PlaceholderPageProps) {
  const copy = pageCopy[page];

  return (
    <Section className="min-h-[70dvh] pt-32 md:pt-40">
      <SectionHeader kicker={copy.kicker} title={copy.title}>
        <p>{copy.body}</p>
      </SectionHeader>
    </Section>
  );
}
