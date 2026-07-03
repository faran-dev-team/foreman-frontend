import type { Metadata } from "next";

import { ForemanLanding } from "@/components/marketing/foreman-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Foreman — Never Miss Another Job",
  },
  description:
    "Foreman answers every missed call for HVAC and trades businesses, qualifies the job, and books it into your calendar automatically.",
  openGraph: {
    title: "Foreman — Never Miss Another Job",
    description:
      "The AI front office for HVAC and trades. Every call answered, every job booked.",
    type: "website",
    images: [{ url: "/foreman-lockup-dark.png" }],
  },
};

export default function HomePage() {
  return <ForemanLanding />;
}
