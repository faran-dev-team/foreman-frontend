import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardPageHero } from "@/components/dashboard/dashboard-page-hero";
import {
  OnboardingWizardPanel,
  OnboardingWizardPanelFallback,
} from "@/components/onboarding/onboarding-wizard-panel";

export const metadata: Metadata = {
  title: "Onboarding | Foreman",
};

export default function OnboardingPage() {
  return (
    <section className="space-y-6">
      <DashboardPageHero
        title="Onboarding wizard"
        lead="Set up business info, hours, service area, pricing catalog, and calendar."
        support="Walk through it step by step."
      />

      <Suspense fallback={<OnboardingWizardPanelFallback />}>
        <OnboardingWizardPanel />
      </Suspense>
    </section>
  );
}
