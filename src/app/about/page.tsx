import { AboutPage } from "@/components/about/AboutPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoCopy } from "@/content/site";
import { aboutBreadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: seoCopy.aboutDescription,
  path: "/about",
});

export default function About() {
  return (
    <>
      <JsonLd data={aboutBreadcrumbJsonLd()} />
      <AboutPage />
    </>
  );
}
