"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

import { AgentGreetingForm } from "@/components/settings/agent-greeting-form";
import { BusinessHoursForm } from "@/components/settings/business-hours-form";
import { ServiceAreaForm } from "@/components/settings/service-area-form";
import { ServicesForm } from "@/components/settings/services-form";
import { useShop } from "@/components/dashboard/shop-provider";
import { ApiError } from "@/lib/api/client";
import { fetchShopSettings, saveShopSettings } from "@/lib/api/settings";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { defaultShopSettings } from "@/lib/settings/defaults";
import type { ShopSettingsForm } from "@/lib/settings/types";

type LoadState = "loading" | "ready" | "error";

export function ShopSettingsForms() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { shopId, loading: shopLoading } = useShop();

  const [settings, setSettings] = useState<ShopSettingsForm>(defaultShopSettings);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!isLoaded) {
      setLoadState("loading");
      return;
    }
    if (!isSignedIn) {
      setLoadState("error");
      setLoadError("Sign in required to manage shop settings.");
      return;
    }
    if (!shopId) {
      if (shopLoading) {
        setLoadState("loading");
        return;
      }
      setLoadState("error");
      setLoadError("No shop resolved for this account.");
      return;
    }

    setLoadState("loading");
    setLoadError(null);

    try {
      const loaded = await withClerkAuthRetry(getToken, (token) =>
        fetchShopSettings(shopId, token),
      );
      setSettings(loaded);
      setIsDirty(false);
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      if (error instanceof ApiError) {
        setLoadError(error.message);
      } else if (error instanceof TypeError) {
        setLoadError(
          "Cannot reach the Foreman API. Is the backend running on NEXT_PUBLIC_API_URL?",
        );
      } else {
        setLoadError("Failed to load shop settings.");
      }
    }
  }, [getToken, isLoaded, isSignedIn, shopId, shopLoading]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const updateSettings = <K extends keyof ShopSettingsForm>(
    key: K,
    value: ShopSettingsForm[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSaveMessage(null);
  };

  const handleSave = async () => {
    if (!shopId) {
      setSaveMessage({
        type: "error",
        text: "No shop resolved for this account.",
      });
      return;
    }

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

    setSaving(true);
    setSaveMessage(null);

    try {
      const saved = await withClerkAuthRetry(getToken, (token) =>
        saveShopSettings(shopId, settings, token),
      );
      setSettings(saved);
      setIsDirty(false);
      setSaveMessage({
        type: "success",
        text: "Settings saved. Greeting, hours, services, and service area are now in the database.",
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text:
          error instanceof ApiError
            ? error.message
            : "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultShopSettings);
    setIsDirty(true);
    setSaveMessage({
      type: "success",
      text: "Defaults restored in the form — click Save settings to persist them.",
    });
  };

  if ((!isLoaded || (!shopId && shopLoading) || loadState === "loading") &&
    loadState !== "error") {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-56 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-800">Unable to load settings</p>
        <p className="mt-1 text-sm text-red-700">{loadError}</p>
        <button
          type="button"
          onClick={() => void loadSettings()}
          className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-900"
        >
          Retry
        </button>
      </div>
    );
  }

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
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-lg bg-foreman-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reset to defaults
        </button>
        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={saving}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reload
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
