import type { Metadata } from "next";

import { ForemanLanding } from "@/components/marketing/foreman-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Foreman — AI Front Office for Restoration",
  },
  description:
    "The first company to answer wins the job. Be first, every time. Foreman answers every emergency call instantly.",
};

export default function RestorationPage() {
  return <ForemanLanding mode="restoration" />;
}
