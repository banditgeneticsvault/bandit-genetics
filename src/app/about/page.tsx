import { AboutPage } from "@/components/about/AboutPage";
import { aboutCopy } from "@/content/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: `${aboutCopy.slogan} ${aboutCopy.opening[0]}`,
};

export default function About() {
  return <AboutPage />;
}
