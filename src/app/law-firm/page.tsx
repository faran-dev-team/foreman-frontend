import type { Metadata } from "next";
import { IndustryPage } from "@/components/marketing/industry/industry-page";

export const metadata: Metadata = {
  title: "Foreman — AI Front Office for Law Firms",
  description: "Never lose a high-value case to a missed call. Foreman answers instantly, qualifies the lead, and books the consultation.",
};

export default function Page() {
  return <IndustryPage tradeId="law-firm" />;
}
