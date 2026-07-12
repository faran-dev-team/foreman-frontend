import type { Metadata } from "next";
import { IndustryPage } from "@/components/marketing/industry/industry-page";

export const metadata: Metadata = {
  title: "Foreman — AI Front Office for Roofing",
  description: "Stop missing jobs. Foreman answers every missed call, qualifies the job, and books it.",
};

export default function Page() {
  return <IndustryPage tradeId="roofing" />;
}
