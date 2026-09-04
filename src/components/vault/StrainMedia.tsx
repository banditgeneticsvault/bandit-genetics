import Image from "next/image";
import { dossierCopy } from "@/content/dossier";
import { cn } from "@/lib/cn";
import { hasArtworkSrc } from "@/lib/artwork";
import type { StrainImage, StrainTheme } from "@/data/genetics/types";

const washes: Record<StrainTheme, string> = {
  METAL:
    "bg-[radial-gradient(ellipse_at_30%_0%,rgb(22_64_56_/_0.55),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgb(18_21_26_/_0.9),#07080a)]",
  SILK:
    "bg-[radial-gradient(ellipse_at_80%_0%,rgb(42_23_51_/_0.7),transparent_50%),radial-gradient(ellipse_at_0%_100%,rgb(11_36_31_/_0.4),#07080a)]",
  FROST:
    "bg-[radial-gradient(ellipse_at_70%_20%,rgb(199_216_228_/_0.14),transparent_45%),radial-gradient(ellipse_at_10%_100%,rgb(22_64_56_/_0.45),#07080a)]",
};

type StrainMediaProps = {
  image?: StrainImage;
  theme: StrainTheme;
  name: string;
  className?: string;
  labelled?: boolean;
  sizes?: string;
  /** Tailwind max-height classes. Artwork keeps its ratio inside this cap. */
  imageClassName?: string;
  priority?: boolean;
};

export function StrainMedia({
  image,
  theme,
  name,
  className,
  labelled = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw",
  imageClassName = "max-h-[min(70vh,36rem)]",
  priority = false,
}: StrainMediaProps) {
  if (hasArtworkSrc(image)) {
    const width = image.width ?? 1600;
    const height = image.height ?? 1600;

    return (
      <figure
        className={cn(
          "flex items-center justify-center overflow-hidden bg-black",
          className,
        )}
      >
        <Image
          src={image.src}
          alt={image.alt || name}
          width={width}
          height={height}
          sizes={sizes}
          quality={85}
          priority={priority}
          className={cn(
            "h-auto w-auto max-w-full object-contain",
            imageClassName,
          )}
        />
      </figure>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-44 overflow-hidden",
        washes[theme],
        className,
      )}
      role={labelled ? "img" : undefined}
      aria-label={
        labelled ? `${name}. ${dossierCopy.artworkPending}.` : undefined
      }
      aria-hidden={labelled ? undefined : true}
    >
      <div className="vault-grate absolute inset-0 opacity-80" />
      <div className="vault-grain absolute inset-0" />
      <p className="section-kicker absolute top-4 left-4">
        {dossierCopy.artworkPending}
      </p>
    </div>
  );
}
