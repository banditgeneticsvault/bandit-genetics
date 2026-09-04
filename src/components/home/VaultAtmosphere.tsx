import Image from "next/image";
import { hasArtworkSrc } from "@/lib/artwork";
import type { StrainImage } from "@/data/genetics/types";

type VaultAtmosphereProps = {
  softened?: boolean;
  background?: StrainImage;
};

export function VaultAtmosphere({
  softened = false,
  background,
}: VaultAtmosphereProps) {
  const showBackground = hasArtworkSrc(background);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-black" />
      <div data-artwork-slot="" className="absolute inset-0">
        {showBackground ? (
          <Image
            src={background.src}
            alt=""
            fill
            priority
            quality={70}
            sizes="100vw"
            className="object-cover object-[center_62%] opacity-[0.5] brightness-[0.42] contrast-[0.62] saturate-[0.7] md:opacity-[0.4] md:brightness-[0.38]"
          />
        ) : null}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_14%,rgb(7_8_10_/_0.22)_52%,rgb(7_8_10_/_0.74)_100%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/72 via-black/14 to-black/80" />
      <div className="absolute inset-0 bg-linear-to-r from-black/38 via-black/12 to-black/34 md:from-black/58 md:via-black/16 md:to-black/48" />
      <div
        className={
          softened
            ? "absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgb(42_23_51_/_0.35),transparent_42%),radial-gradient(ellipse_at_88%_8%,rgb(199_216_228_/_0.06),transparent_34%),radial-gradient(ellipse_at_70%_90%,rgb(11_36_31_/_0.55),transparent_46%)]"
            : "absolute inset-0 bg-[radial-gradient(ellipse_at_18%_12%,rgb(42_23_51_/_0.7),transparent_42%),radial-gradient(ellipse_at_88%_8%,rgb(199_216_228_/_0.12),transparent_34%),radial-gradient(ellipse_at_70%_90%,rgb(11_36_31_/_0.9),transparent_46%)]"
        }
      />
      <div
        className={
          softened
            ? "vault-grate absolute inset-0 opacity-20"
            : "vault-grate absolute inset-0 opacity-70"
        }
      />
      {!softened ? (
        <>
          <div className="absolute -top-24 right-[-10%] h-[70%] w-[58%] bg-[radial-gradient(circle,rgb(199_216_228_/_0.16),transparent_62%)] blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-12%] h-[55%] w-[50%] bg-[radial-gradient(circle,rgb(22_64_56_/_0.55),transparent_64%)]" />
          <div className="absolute top-[18%] right-[8%] hidden h-[58%] w-px bg-gold/35 md:block" />
          <svg
            className="absolute right-[-8%] bottom-[-12%] h-[78%] w-[62%] text-emerald opacity-[0.18]"
            viewBox="0 0 640 720"
            fill="none"
          >
            <path
              d="M392 700C286 548 318 430 412 318C338 392 214 430 148 372C214 430 250 250 360 168C250 250 168 148 220 48C168 148 318 214 430 132C318 214 470 286 520 214C470 286 488 430 412 500C488 430 546 560 392 700Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M412 318C360 400 372 520 392 700"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </>
      ) : null}
      <div className="vault-grain absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent" />
    </div>
  );
}
