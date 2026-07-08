import type { Metadata } from "next";

import { ForemanLanding } from "@/components/marketing/foreman-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Foreman — AI Front Office for Property Management",
  },
  description:
    "Every tenant call, answered and handled. Across your whole portfolio. Foreman answers every one, day and night.",
};

export default function PropertyManagementPage() {
  return <ForemanLanding mode="property-management" />;
}
