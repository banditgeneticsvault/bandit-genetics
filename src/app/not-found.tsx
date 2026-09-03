import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { dossierCopy } from "@/content/dossier";

export default function NotFound() {
  return (
    <main className="bg-black">
      <PageContainer width="wide" className="flex min-h-[70dvh] flex-col justify-center pt-32 pb-20">
        <p className="font-label text-[0.68rem] tracking-[0.28em] text-gold uppercase">
          {dossierCopy.notFoundKicker}
        </p>
        <h1 className="mt-4 max-w-xl font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] text-frost">
          {dossierCopy.notFoundTitle}
        </h1>
        <p className="mt-5 max-w-md text-ice/70">{dossierCopy.notFoundBody}</p>
        <div className="mt-10">
          <Button href="/vault">{dossierCopy.returnVault}</Button>
        </div>
      </PageContainer>
    </main>
  );
}
