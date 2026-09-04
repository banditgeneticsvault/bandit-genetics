import Link from "next/link";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

type SiteBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function SiteBreadcrumb({ items }: SiteBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-label text-meta tracking-[0.16em] uppercase">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-x-2">
              {index > 0 ? (
                <span className="text-ice/25" aria-hidden>
                  /
                </span>
              ) : null}
              {last || !item.href ? (
                <span
                  className="text-gold/80"
                  aria-current={last ? "page" : undefined}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-ice/45 transition-colors hover:text-gold"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
