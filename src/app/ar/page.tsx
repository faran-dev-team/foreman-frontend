import type { Metadata } from "next";

import { AR_HERO } from "@/components/marketing/gcc/content";
import { GccArabicLanding } from "@/components/marketing/gcc/gcc-arabic-landing";
import { getSiteUrl } from "@/lib/marketing/site-url";

const title = `فورمان — ${AR_HERO.headline}`;

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { absolute: title },
  description: AR_HERO.body,
  alternates: {
    canonical: "/ar",
    languages: { en: "/", ar: "/ar" },
  },
  openGraph: {
    title,
    description: AR_HERO.body,
    type: "website",
    locale: "ar_AE",
    alternateLocale: ["en_AE"],
    url: "/ar",
    siteName: "Foreman",
    images: [{ url: "/foreman-lockup-dark.png" }],
  },
  // Hero-only Arabic page pending native Gulf Arabic review (copy doc §14).
  // Remove this once the reviewed sections are in.
  robots: { index: false, follow: true },
};

export default function ArabicHomePage() {
  return <GccArabicLanding />;
}
