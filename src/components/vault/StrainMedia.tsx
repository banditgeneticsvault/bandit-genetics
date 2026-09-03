import Image from "next/image";
import { cn } from "@/lib/cn";
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
  fileCode: string;
  theme: StrainTheme;
  name: string;
  className?: string;
  labelled?: boolean;
};

export function StrainMedia({
  image,
  fileCode,
  theme,
  name,
  className,
  labelled = false,
}: StrainMediaProps) {
  if (image?.src) {
    return (
      <div className={cn("relative overflow-hidden bg-steel", className)}>
        <Image
          src={image.src}
          alt={image.alt || name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", washes[theme], className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? `${name}. Artwork pending.` : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <div className="vault-grate absolute inset-0 opacity-80" />
      <div className="vault-grain absolute inset-0" />
      <p className="absolute top-4 left-4 font-label text-[0.62rem] tracking-[0.28em] text-gold uppercase">
        Artwork pending
      </p>
      <p className="absolute right-4 bottom-4 font-display text-4xl text-frost/25">
        {fileCode}
      </p>
    </div>
  );
}
