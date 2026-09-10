"use client";

import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useMemo, useState, type ElementType } from "react";
import PhoneInput, {
  getCountryCallingCode,
  isSupportedCountry,
  isValidPhoneNumber,
  parsePhoneNumber,
  type Country,
  type PhoneNumber,
} from "react-phone-number-input/max";

import { useShop } from "@/components/dashboard/shop-provider";
import { BusinessHoursForm } from "@/components/settings/business-hours-form";
import { ServiceAreaForm } from "@/components/settings/service-area-form";
import { ServicesForm } from "@/components/settings/services-form";
import {
  inputClassName,
  labelClassName,
  SettingsSection,
} from "@/components/settings/settings-section";
import {
  resolveDashboardQueryError,
} from "@/hooks/use-dashboard-queries";
import { useOnboardingQuery, type OnboardingPageData } from "@/hooks/use-onboarding-query";
import { ApiError } from "@/lib/api/client";
import {
  fetchOnboardingStatus,
  importCatalogFile,
  saveOnboardingStep,
  toApiBusinessHours,
  toApiServiceArea,
  toApiServices,
  type CatalogImportResponse,
} from "@/lib/api/onboarding";
import { withClerkAuthRetry } from "@/lib/auth/clerk-token";
import { queryKeys } from "@/lib/query/keys";
import { defaultShopSettings } from "@/lib/settings/defaults";
import type {
  BusinessHours,
  ServiceArea,
  ServiceItem,
} from "@/lib/settings/types";

const DEFAULT_PHONE_COUNTRY: Country = "US";

function asCountry(value?: string | null): Country | undefined {
  if (!value || !isSupportedCountry(value)) return undefined;
  return value;
}

function callingCodeFor(country?: string | null): string {
  const supported = asCountry(country);
  if (!supported) return "";
  try {
    return getCountryCallingCode(supported);
  } catch {
    return "";
  }
}

function tryParsePhone(
  input: string,
  defaultCountry?: Country,
): PhoneNumber | undefined {
  if (!input.trim()) return undefined;
  try {
    return parsePhoneNumber(input, defaultCountry) ?? undefined;
  } catch {
    return undefined;
  }
}

function countryFromParsed(
  parsed: PhoneNumber | undefined,
  fallbackCountry: Country,
): Country {
  const direct = asCountry(parsed?.country);
  if (direct) return direct;
  const possible = parsed?.getPossibleCountries?.() ?? [];
  for (const code of possible) {
    const country = asCountry(code);
    if (country) return country;
  }
  return asCountry(fallbackCountry) ?? DEFAULT_PHONE_COUNTRY;
}

function parseStoredPhone(
  value?: string | null,
  fallbackCountry: Country = DEFAULT_PHONE_COUNTRY,
): {
  value: string;
  country: Country;
} {
  const raw = value?.trim() ?? "";
  if (!raw) {
    return { value: "", country: fallbackCountry };
  }

  const compact = raw.replace(/[^\d+]/g, "");
  const nationalDigits = compact.replace(/^\+/, "");
  const looksInternational = compact.startsWith("+") || compact.startsWith("00");
  const from00 = compact.startsWith("00") ? `+${compact.slice(2)}` : undefined;
  const fallbackCallingCode = callingCodeFor(fallbackCountry);

  const internationalParsed =
    tryParsePhone(raw) ||
    tryParsePhone(compact) ||
    (from00 ? tryParsePhone(from00) : undefined);

  const plusParsed = nationalDigits
    ? tryParsePhone(`+${nationalDigits}`)
    : undefined;
  const plusIsValid = Boolean(
    plusParsed?.number && isValidPhoneNumber(plusParsed.number),
  );
  const plusIsForeign = Boolean(
    plusParsed?.number &&
      plusParsed.countryCallingCode &&
      plusParsed.countryCallingCode !== fallbackCallingCode,
  );

  const nationalParsed =
    tryParsePhone(raw, fallbackCountry) ||
    tryParsePhone(nationalDigits, fallbackCountry);
  const nationalIsValid = Boolean(
    nationalParsed?.number &&
      (isValidPhoneNumber(nationalParsed.number) ||
        isValidPhoneNumber(nationalParsed.number, fallbackCountry)),
  );

  let parsed = internationalParsed;
  if (!parsed && looksInternational && plusParsed) {
    parsed = plusParsed;
  }
  if (!parsed) {
    if (nationalIsValid) {
      parsed = nationalParsed;
    } else if (plusIsForeign || plusIsValid) {
      parsed = plusParsed;
    } else {
      parsed = nationalParsed || plusParsed;
    }
  }

  return {
    value: parsed?.number ?? "",
    country: countryFromParsed(parsed, fallbackCountry),
  };
}

type PhoneCountrySelectProps = {
  value?: Country;
  onChange: (value?: string) => void;
  options: Array<{ value?: string; label: string; divider?: boolean }>;
  disabled?: boolean;
  readOnly?: boolean;
  iconComponent: ElementType<{
    country?: Country;
    label?: string;
    "aria-hidden"?: boolean;
  }>;
};

function PhoneCountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  iconComponent: Icon,
}: PhoneCountrySelectProps) {
  const selectedCallingCode = callingCodeFor(value);

  return (
    <div className="PhoneInputCountry">
      <select
        aria-label="Country"
        className="PhoneInputCountrySelect"
        disabled={disabled || readOnly}
        value={value ?? "ZZ"}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "ZZ" ? undefined : next);
        }}
      >
        {options.map((option) => {
          const optionValue = option.divider ? "|" : option.value ?? "ZZ";
          const callingCode = callingCodeFor(option.value);
          return (
            <option
              key={option.divider ? "|" : optionValue}
              disabled={option.divider}
              value={optionValue}
            >
              {option.label}
              {callingCode ? ` +${callingCode}` : ""}
            </option>
          );
        })}
      </select>
      <Icon aria-hidden country={value} label={value} />
      {selectedCallingCode ? (
        <span className="ml-1.5 whitespace-nowrap text-sm text-slate-700">
          +{selectedCallingCode}
        </span>
      ) : null}
      <div className="PhoneInputCountrySelectArrow" />
    </div>
  );
}

const STEPS = [
  { id: 1, title: "Business info", description: "Shop name, business number, and greeting" },
  { id: 2, title: "Hours", description: "When you're open for bookings" },
  { id: 3, title: "Service area", description: "ZIPs or radius you cover" },
  { id: 4, title: "Services & pricing", description: "Catalog entry or spreadsheet import" },
  { id: 5, title: "Calendar", description: "Connect Google Calendar" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function OnboardingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

export function OnboardingWizardPanel() {
  const { getToken } = useAuth();
  const { shopId, shopName } = useShop();
  const queryClient = useQueryClient();
  const onboardingQuery = useOnboardingQuery();

  const status = onboardingQuery.data?.status ?? null;
  const [hydratedAt, setHydratedAt] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<CatalogImportResponse | null>(
    null,
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<Country>(DEFAULT_PHONE_COUNTRY);
  const [address, setAddress] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [appointmentDuration, setAppointmentDuration] = useState(60);
  const [greeting, setGreeting] = useState(defaultShopSettings.greeting);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(
    defaultShopSettings.businessHours,
  );
  const [serviceArea, setServiceArea] = useState<ServiceArea>(
    defaultShopSettings.serviceArea,
  );
  const [services, setServices] = useState<ServiceItem[]>(
    defaultShopSettings.services,
  );

  useEffect(() => {
    const data = onboardingQuery.data;
    if (!data || onboardingQuery.dataUpdatedAt === hydratedAt) return;

    const nextStatus = data.status;
    const settings = data.settings;
    setActiveStep(Math.min(Math.max(nextStatus.current_step || 1, 1), 5));
    setName(nextStatus.shop_name || shopName || "");
    if (typeof nextStatus.phone === "string") {
      const parsedPhone = parseStoredPhone(nextStatus.phone);
      setPhone(parsedPhone.value);
      setPhoneCountry(parsedPhone.country);
    }
    if (typeof nextStatus.address === "string") {
      setAddress(nextStatus.address.trim());
    }
    if (nextStatus.timezone?.trim()) {
      setTimezone(nextStatus.timezone.trim());
    }
    if (nextStatus.appointment_duration) {
      setAppointmentDuration(nextStatus.appointment_duration);
    }
    setGreeting(settings.greeting || defaultShopSettings.greeting);
    setBusinessHours(settings.businessHours);
    setServiceArea(settings.serviceArea);
    setServices(
      settings.services.length > 0
        ? settings.services
        : defaultShopSettings.services,
    );
    setHydratedAt(onboardingQuery.dataUpdatedAt);
  }, [
    hydratedAt,
    onboardingQuery.data,
    onboardingQuery.dataUpdatedAt,
    shopName,
  ]);

  const checklist = useMemo(() => {
    if (!status) return [];
    return [
      { label: "Business info", done: status.is_business_info_set },
      { label: "Hours", done: status.is_hours_set },
      { label: "Service area", done: status.is_service_area_set },
      { label: "Services", done: status.is_services_set },
      { label: "Calendar", done: status.is_calendar_connected },
    ];
  }, [status]);

  const stepDoneMap = useMemo<Record<StepId, boolean>>(
    () => ({
      1: status?.is_business_info_set ?? false,
      2: status?.is_hours_set ?? false,
      3: status?.is_service_area_set ?? false,
      4: status?.is_services_set ?? false,
      5: status?.is_calendar_connected ?? false,
    }),
    [status],
  );

  const saveStep = async () => {
    if (!shopId) return;
    setSaving(true);
    setErrorMessage(null);
    setImportResult(null);

    try {
      let payload;
      if (activeStep === 1) {
        const storedPhone = parseStoredPhone(phone, phoneCountry);
        if (!name.trim() || !storedPhone.value) {
          throw new Error("Shop name and business number are required.");
        }
        if (
          !isValidPhoneNumber(storedPhone.value) &&
          !isValidPhoneNumber(storedPhone.value, storedPhone.country)
        ) {
          throw new Error("Enter a valid business number.");
        }
        if (greeting.trim().length < 10) {
          throw new Error("Greeting must be at least 10 characters.");
        }
        payload = {
          step: 1,
          name: name.trim(),
          phone: storedPhone.value,
          address: address.trim() || undefined,
          timezone: timezone.trim() || undefined,
          appointment_duration: appointmentDuration,
          greeting: greeting.trim(),
        };
      } else if (activeStep === 2) {
        payload = {
          step: 2,
          business_hours: toApiBusinessHours(businessHours),
        };
      } else if (activeStep === 3) {
        if (
          serviceArea.mode === "zip_codes" &&
          !serviceArea.zipCodes.trim()
        ) {
          throw new Error("Enter at least one ZIP code for your service area.");
        }
        payload = {
          step: 3,
          service_area: toApiServiceArea(serviceArea),
        };
      } else if (activeStep === 4) {
        const validServices = services.filter((s) => s.name.trim());
        if (validServices.length === 0) {
          throw new Error(
            "Add at least one service, or import a catalog spreadsheet.",
          );
        }
        payload = {
          step: 4,
          services: toApiServices(validServices),
        };
      } else {
        // Step 5 is calendar connect — refresh status only.
        const refreshed = await withClerkAuthRetry(getToken, (token) =>
          fetchOnboardingStatus(shopId, token),
        );
        if (shopId) {
          queryClient.setQueryData(
            queryKeys.onboarding(shopId),
            (prev: OnboardingPageData | undefined) =>
              prev ? { ...prev, status: refreshed } : prev,
          );
        }
        setSaving(false);
        return;
      }

      const next = await withClerkAuthRetry(getToken, (token) =>
        saveOnboardingStep(shopId, payload, token),
      );
      queryClient.setQueryData(
        queryKeys.onboarding(shopId),
        (prev: OnboardingPageData | undefined) =>
          prev ? { ...prev, status: next } : prev,
      );
      if (activeStep < 5) {
        setActiveStep((step) => Math.min(step + 1, 5));
      }
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save onboarding step.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async (file: File | null) => {
    if (!shopId || !file) return;
    setImporting(true);
    setErrorMessage(null);
    setImportResult(null);
    try {
      const result = await withClerkAuthRetry(getToken, (token) =>
        importCatalogFile(shopId, file, token),
      );
      setImportResult(result);
      if (result.success) {
        await onboardingQuery.refetch();
      }
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Catalog import failed. Upload a valid .csv or .xlsx file.",
      );
    } finally {
      setImporting(false);
    }
  };

  if (onboardingQuery.isPending && !onboardingQuery.data) {
    return <OnboardingSkeleton />;
  }

  if (onboardingQuery.isError && !status) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-800">
        <p className="font-medium">Could not load onboarding</p>
        <p className="mt-1">
          {resolveDashboardQueryError(onboardingQuery.error)}
        </p>
        <button
          type="button"
          onClick={() => void onboardingQuery.refetch()}
          className="mt-3 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Setup progress
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {status?.progress_percent ?? 0}%
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {status?.is_completed
                ? "Core onboarding complete. Connect calendar if you haven’t yet."
                : "Complete each step to finish shop setup."}
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:max-w-xs">
            <div
              className="h-full rounded-full bg-foreman-accent transition-all"
              style={{ width: `${Math.min(status?.progress_percent ?? 0, 100)}%` }}
            />
          </div>
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {checklist.map((item) => (
            <li
              key={item.label}
              className={`rounded-lg border px-3 py-2 text-sm ${
                item.done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              {item.done ? "✓ " : "○ "}
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isDone = stepDoneMap[step.id];
          return (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm transition ${
              isActive
                ? "bg-foreman-navy text-white"
                : isDone
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="block font-semibold">
              {isDone ? "✓ " : ""}
              {step.id}. {step.title}
            </span>
            <span
              className={`mt-0.5 block text-xs ${
                isActive
                  ? "text-white/80"
                  : isDone
                    ? "text-emerald-700"
                    : "text-slate-500"
              }`}
            >
              {step.description}
            </span>
          </button>
          );
        })}
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        {activeStep === 1 ? (
          <SettingsSection
            title="Business info"
            description="Basic shop identity used by the voice agent and dashboard."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClassName} htmlFor="ob-name">
                  Shop name
                </label>
                <input
                  id="ob-name"
                  className={inputClassName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="ob-phone">
                  Business number
                </label>
                <PhoneInput
                  key={`ob-phone-${hydratedAt}`}
                  id="ob-phone"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm [--PhoneInput-color--focus:#0A0F1C] focus-within:border-foreman-navy focus-within:outline-none focus-within:ring-1 focus-within:ring-foreman-navy"
                  numberInputProps={{
                    className:
                      "min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 outline-none focus:ring-0",
                  }}
                  placeholder="(555) 123-4567"
                  international={false}
                  initialValueFormat="national"
                  defaultCountry={phoneCountry}
                  addInternationalOption={false}
                  countrySelectComponent={PhoneCountrySelect}
                  value={phone}
                  onChange={(value) => setPhone(value ?? "")}
                  onCountryChange={(country) =>
                    setPhoneCountry(country ?? DEFAULT_PHONE_COUNTRY)
                  }
                />
                <p className="mt-1 text-xs text-slate-500">
                  Business number is required to complete onboarding and support callbacks.
                </p>
              </div>
              <div>
                <label className={labelClassName} htmlFor="ob-timezone">
                  Timezone
                </label>
                <input
                  id="ob-timezone"
                  className={inputClassName}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="America/New_York"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClassName} htmlFor="ob-address">
                  Address
                </label>
                <input
                  id="ob-address"
                  className={inputClassName}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="ob-duration">
                  Default appointment duration (minutes)
                </label>
                <input
                  id="ob-duration"
                  type="number"
                  min={15}
                  max={480}
                  className={inputClassName}
                  value={appointmentDuration}
                  onChange={(e) =>
                    setAppointmentDuration(Number(e.target.value) || 60)
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClassName} htmlFor="ob-greeting">
                  Agent greeting
                </label>
                <textarea
                  id="ob-greeting"
                  rows={4}
                  className={inputClassName}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Include a recording disclosure (e.g. “this call may be recorded”).
                </p>
              </div>
            </div>
          </SettingsSection>
        ) : null}

        {activeStep === 2 ? (
          <BusinessHoursForm value={businessHours} onChange={setBusinessHours} />
        ) : null}

        {activeStep === 3 ? (
          <ServiceAreaForm value={serviceArea} onChange={setServiceArea} />
        ) : null}

        {activeStep === 4 ? (
          <div className="space-y-6">
            <SettingsSection
              title="Import pricing catalog"
              description="Upload .csv or .xlsx with columns like Service Name, Min Price, Max Price, Duration, Keywords."
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto">
                  <Upload className="h-4 w-4" />
                  {importing ? "Importing…" : "Choose spreadsheet"}
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    disabled={importing}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      void handleImport(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="text-xs text-slate-500">
                  Max 5MB · up to 500 rows · all-or-nothing if validation fails
                </p>
              </div>

              {importResult ? (
                <div
                  className={`mt-4 rounded-lg border px-3 py-3 text-sm ${
                    importResult.success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-amber-200 bg-amber-50 text-amber-950"
                  }`}
                >
                  <p className="font-semibold">
                    {importResult.filename}:{" "}
                    {importResult.success ? "Import succeeded" : "Import had errors"}
                  </p>
                  <p className="mt-1">
                    Imported {importResult.imported_count} · Updated{" "}
                    {importResult.updated_count} · Rows {importResult.total_rows}
                  </p>
                  {importResult.errors.length > 0 ? (
                    <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs">
                      {importResult.errors.slice(0, 20).map((err, idx) => (
                        <li key={`${err.row_number}-${idx}`}>
                          Row {err.row_number}
                          {err.field ? ` (${err.field})` : ""}: {err.error_message}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </SettingsSection>

            <ServicesForm value={services} onChange={setServices} />
          </div>
        ) : null}

        {activeStep === 5 ? (
          <SettingsSection
            title="Connect Google Calendar"
            description="Calendar connection is managed in Settings. After connecting, refresh this step."
          >
            <div className="space-y-3 text-sm text-slate-700">
              <p>
                Status:{" "}
                <span className="font-semibold">
                  {status?.is_calendar_connected
                    ? "Connected"
                    : "Not connected yet"}
                </span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center rounded-lg bg-foreman-navy px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Open Settings → Google Calendar
                </Link>
                <button
                  type="button"
                  onClick={() => void onboardingQuery.refetch()}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Refresh status
                </button>
              </div>
            </div>
          </SettingsSection>
        ) : null}

        <div className="flex flex-col-reverse gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-between">
          <button
            type="button"
            disabled={activeStep <= 1 || saving}
            onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            disabled={saving || importing}
            onClick={() => void saveStep()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreman-accent px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {activeStep === 5
              ? "Refresh & check completion"
              : activeStep === 4
                ? "Save services & continue"
                : "Save & continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingWizardPanelFallback() {
  return <OnboardingSkeleton />;
}
