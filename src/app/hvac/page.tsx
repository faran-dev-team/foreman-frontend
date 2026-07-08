import type { Metadata } from "next";

import { ForemanLanding } from "@/components/marketing/foreman-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Foreman — AI Front Office for HVAC",
  },
  description:
    "In a heat wave, every missed call is a lost install. Foreman answers every missed call, qualifies the job, and books it.",
};

export default function HVACPage() {
  return <ForemanLanding mode="hvac" />;
}
