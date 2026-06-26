"use client";

import { useState } from "react";

import { AgentGreetingForm } from "@/components/settings/agent-greeting-form";
import { BusinessHoursForm } from "@/components/settings/business-hours-form";
import { ServiceAreaForm } from "@/components/settings/service-area-form";
import { ServicesForm } from "@/components/settings/services-form";
import { defaultShopSettings } from "@/lib/settings/defaults";
import type { ShopSettingsForm } from "@/lib/settings/types";

export function ShopSettingsForms() {
  const [settings, setSettings] = useState<ShopSettingsForm>(defaultShopSettings);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateSettings = <K extends keyof ShopSettingsForm>(
    key: K,
    value: ShopSettingsForm[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  const handleSave = () => {
    if (!settings.greeting.toLowerCase().includes("record")) {
      setSaveMessage({
        type: "error",
        text: "Greeting must mention that the call may be recorded (legal requirement).",
      });
      return;
    }

    const invalidService = settings.services.find(
      (s) => !s.name.trim() || s.priceMax < s.priceMin,
    );
    if (invalidService) {
      setSaveMessage({
        type: "error",
        text: "Each service needs a name and price max must be ≥ price min.",
      });
      return;
    }

    setSaveMessage({
      type: "success",
      text: "Settings validated locally. Backend save API coming soon — Dev 2 will wire persistence.",
    });
    setIsDirty(false);
  };

  const handleReset = () => {
    setSettings(defaultShopSettings);
    setIsDirty(false);
    setSaveMessage(null);
  };

  return (
    <div className="space-y-6">
      <AgentGreetingForm
        value={settings.greeting}
        onChange={(greeting) => updateSettings("greeting", greeting)}
      />

      <BusinessHoursForm
        value={settings.businessHours}
        onChange={(businessHours) => updateSettings("businessHours", businessHours)}
      />

      <ServicesForm
        value={settings.services}
        onChange={(services) => updateSettings("services", services)}
      />

      <ServiceAreaForm
        value={settings.serviceArea}
        onChange={(serviceArea) => updateSettings("serviceArea", serviceArea)}
      />

      {saveMessage && (
        <div
          role="alert"
          className={`rounded-lg px-4 py-3 text-sm ${
            saveMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-foreman-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Save settings
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset to defaults
        </button>
        {isDirty && (
          <span className="self-center text-sm text-amber-600">
            Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
}
