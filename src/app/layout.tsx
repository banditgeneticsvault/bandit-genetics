import type { Metadata } from "next";
import { Barlow_Condensed, Cormorant_Garamond, Figtree } from "next/font/google";
import { AppProviders } from "@/components/layout/AppProviders";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand, seoCopy, siteUrl } from "@/content/site";
import { brandOgImage, organizationGraph } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const siteDescription = seoCopy.homeDescription;
const ogImage = brandOgImage();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brand.name,
    template: `%s · ${brand.name}`,
  },
  description: siteDescription,
  icons: {
    icon: [
      {
        url: "/bandit-genetics-favicon.png",
        type: "image/png",
        sizes: "512x512",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "48x48",
      },
    ],
  },
  openGraph: {
    title: brand.name,
    description: siteDescription,
    siteName: brand.name,
    locale: "en_US",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: siteDescription,
    images: [ogImage.url],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${barlow.variable} ${figtree.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:bg-frost focus:px-4 focus:py-3 focus:text-black"
        >
          Skip to content
        </a>
        <JsonLd data={organizationGraph()} />
        <AppProviders>
          <SiteHeader />
          <div id="content" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
