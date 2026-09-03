import { cn } from "@/lib/cn";

type DossierSectionProps = {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
};

export function DossierSection({
  id,
  title,
  kicker,
  children,
  className,
}: DossierSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-28", className)}
    >
      {kicker ? (
        <p className="mb-2 font-label text-[0.62rem] tracking-[0.28em] text-gold uppercase">
          {kicker}
        </p>
      ) : null}
      <h2
        id={`${id}-title`}
        className="font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[0.95] text-frost"
      >
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
