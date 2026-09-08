import { ageGateCopy } from "@/content/age-gate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Age verification",
  description: ageGateCopy.body,
  robots: { index: false, follow: false },
};

export default function AgeGatePage() {
  return null;
}
