import { cn } from "@/lib/cn";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section";
  width?: "default" | "wide" | "full";
};

const widths = {
  default: "max-w-[72rem]",
  wide: "max-w-[92rem]",
  full: "max-w-none",
};

export function PageContainer({
  children,
  className,
  as: Tag = "div",
  width = "default",
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        "page-gutter mx-auto w-full",
        widths[width],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
