import { cn } from "@/lib/cn";

export const dossierKickerClass =
  "section-kicker tracking-[0.26em]";

type DossierSectionProps = {
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
  /** Column-aware title size for equal-width paired grids. */
  compact?: boolean;
};

export function DossierSection({
  id,
  title,
  kicker,
  children,
  className,
  compact = false,
}: DossierSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("min-w-0 w-full @container scroll-mt-28", className)}
    >
      {kicker ? (
        <p className={cn("mb-2", dossierKickerClass)}>
          {kicker}
        </p>
      ) : null}
      <h2
        id={`${id}-title`}
        className={cn(
          "w-full font-display leading-[0.95] text-frost",
          compact
            ? "text-[clamp(1.7rem,8cqi,2.35rem)]"
            : "text-[clamp(1.85rem,4vw,2.75rem)]",
        )}
      >
        {title}
      </h2>
      <div className="mt-3 w-full">{children}</div>
    </section>
  );
}

export function DossierPair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-8">
      {children}
    </div>
  );
}
