import type { Metadata } from "next";
import { Suspense } from "react";

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
      <div>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Onboarding wizard
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 sm:mt-2 sm:text-base">
          Set up business info, hours, service area, pricing catalog, and
          calendar — step by step.
        </p>
      </div>

      <Suspense fallback={<OnboardingWizardPanelFallback />}>
        <OnboardingWizardPanel />
      </Suspense>
    </section>
  );
}
