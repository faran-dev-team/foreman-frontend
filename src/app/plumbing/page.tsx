import type { Metadata } from "next";

import { ForemanLanding } from "@/components/marketing/foreman-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Foreman — AI Front Office for Plumbers",
  },
  description:
    "The 2 AM burst pipe goes to whoever answers. Foreman answers instantly, qualifies the job, and books it.",
};

export default function PlumbingPage() {
  return <ForemanLanding mode="plumbing" />;
}
