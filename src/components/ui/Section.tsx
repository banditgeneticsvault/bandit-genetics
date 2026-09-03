import { cn } from "@/lib/cn";
import { PageContainer } from "@/components/layout/PageContainer";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  width?: "default" | "wide" | "full";
  id?: string;
};

export function Section({
  children,
  className,
  containerClassName,
  width = "wide",
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-(--spacing-section)", className)}>
      <PageContainer width={width} className={containerClassName}>
        {children}
      </PageContainer>
    </section>
  );
}

type SectionHeaderProps = {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
  align?: "start" | "end";
};

export function SectionHeader({
  kicker,
  title,
  children,
  align = "start",
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-12 max-w-xl",
        align === "end" && "ml-auto text-right",
      )}
    >
      {kicker ? (
        <p className="mb-3 font-label text-ui tracking-[0.28em] text-gold uppercase">
          {kicker}
        </p>
      ) : null}
      <h1 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.95] font-medium tracking-tight text-frost">
        {title}
      </h1>
      {children ? (
        <div className="mt-5 text-copy leading-relaxed text-ice/80">
          {children}
        </div>
      ) : null}
    </header>
  );
}
