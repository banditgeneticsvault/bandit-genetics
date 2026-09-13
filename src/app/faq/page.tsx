import { FaqPage } from "@/components/faq/FaqPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { seoCopy } from "@/content/site";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description: seoCopy.faqDescription,
  path: "/faq",
});

export default function Faq() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <FaqPage />
    </>
  );
}
