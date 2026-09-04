import { HomeHero } from "@/components/home/HomeHero";
import { seoCopy } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...pageMetadata({
    title: seoCopy.homeTitle,
    description: seoCopy.homeDescription,
    path: "/",
  }),
  title: {
    absolute: seoCopy.homeTitle,
  },
};

export default function Home() {
  return (
    <main>
      <HomeHero />
    </main>
  );
}
