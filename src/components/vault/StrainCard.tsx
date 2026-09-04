import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { StrainMedia } from "@/components/vault/StrainMedia";
import { vaultCopy } from "@/content/site";
import { cartCopy } from "@/content/cart";
import { canAddToCart, inferOrderState } from "@/data/order";
import type { VaultListItem } from "@/data/genetics/types";
import { STRAIN_TYPE_LABELS } from "@/data/genetics/types";
import { pickVaultImage } from "@/lib/artwork";
import { cn } from "@/lib/cn";

type StrainCardProps = {
  strain: VaultListItem;
};

export function StrainCard({ strain }: StrainCardProps) {
  const href = `/strain/${strain.slug}`;
  const purchasable = canAddToCart(inferOrderState(strain.availability));

  return (
    <article className="group flex h-full flex-col border border-white/10 bg-charcoal transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-[0_10px_24px_rgb(0_0_0_/_0.28)]">
      <header className="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3">
        <p className="font-label text-meta tracking-[0.18em] text-gold uppercase">
          {STRAIN_TYPE_LABELS[strain.type]}
        </p>
      </header>

      <div className="px-4 pt-5 pb-4">
        <h2 className="font-display text-[clamp(1.55rem,2.8vw,2.2rem)] leading-[0.95] text-frost">
          <Link
            href={href}
            className="transition-colors hover:text-gold focus-visible:text-gold"
          >
            {strain.name}
          </Link>
        </h2>
        <p className="mt-3 font-label text-ui leading-relaxed tracking-[0.05em] text-ice uppercase">
          {strain.lineage}
        </p>
      </div>

      <div className="relative">
        <Link
          href={href}
          className="group/media block outline-offset-4"
          aria-label={`Open ${strain.name}`}
        >
          <StrainMedia
            image={pickVaultImage(strain)}
            theme={strain.theme}
            name={strain.name}
            className="px-3 py-3"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            imageClassName="max-h-[min(42vh,20rem)] transition-[filter] duration-300 ease-out group-hover/media:brightness-[1.12]"
          />
        </Link>
        {purchasable ? (
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center md:flex",
              "opacity-0 transition-opacity duration-200",
              "group-hover:pointer-events-auto group-hover:opacity-100",
              "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
            )}
          >
            <AddToCartButton
              productId={strain.id}
              name={strain.name}
              label={cartCopy.add}
              className="min-h-11 border border-gold bg-black/80 px-4 font-label text-ui tracking-[0.18em] text-gold uppercase backdrop-blur-[2px] transition-colors hover:bg-gold hover:text-black"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-5">
        <p className="text-copy leading-relaxed text-ice/75">
          {strain.vaultDescription}
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Link
            href={href}
            className="inline-flex min-h-11 w-full items-center justify-center border border-gunmetal px-4 font-label text-ui tracking-[0.22em] text-ice uppercase transition-colors duration-300 group-hover:border-gold group-hover:text-gold hover:border-gold hover:text-gold sm:w-auto"
          >
            {vaultCopy.viewDossier}
          </Link>
          {purchasable ? (
            <AddToCartButton
              productId={strain.id}
              name={strain.name}
              label={cartCopy.add}
              className="inline-flex min-h-11 w-full items-center justify-center border border-gold px-4 font-label text-ui tracking-[0.22em] text-gold uppercase hover:bg-gold hover:text-black md:hidden"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
