import type { Metadata } from "next";

import { META } from "@/components/marketing/gcc/content";
import { GccLanding } from "@/components/marketing/gcc/gcc-landing";

export const metadata: Metadata = {
  metadataBase: new URL(META.siteUrl),
  title: { absolute: META.title },
  description: META.description,
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar" },
  },
  openGraph: {
    title: META.title,
    description: META.description,
    type: "website",
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    url: "/",
    siteName: "Foreman",
    images: [{ url: "/foreman-lockup-dark.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
  },
};

export default function HomePage() {
  return <GccLanding />;
}
