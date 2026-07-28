import { getApiBaseUrl } from "@/lib/api/config";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { BusinessHours, ServiceArea, ServiceItem } from "@/lib/settings/types";

const ONBOARDING_BASE = "/api/v1/onboarding";

export type OnboardingStatus = {
  shop_id: string;
  shop_name: string;
  is_business_info_set: boolean;
  is_hours_set: boolean;
  is_service_area_set: boolean;
  is_services_set: boolean;
  is_calendar_connected: boolean;
  is_completed: boolean;
  current_step: number;
  progress_percent: number;
};

export type OnboardingStepPayload = {
  step: number;
  name?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  greeting?: string;
  appointment_duration?: number;
  business_hours?: Record<string, { enabled: boolean; open: string; close: string }>;
  service_area?: {
    mode: "zip_codes" | "radius";
    zip_codes: string;
    radius_miles: number;
    center_zip: string;
  };
  services?: Array<{
    id: string;
    name: string;
    price_min: number;
    price_max: number;
    duration_min: number;
    keywords: string;
  }>;
};

export type CatalogImportRowError = {
  row_number: number;
  field?: string | null;
  error_message: string;
  raw_values?: Record<string, unknown>;
};

export type CatalogImportResponse = {
  success: boolean;
  filename: string;
  imported_count: number;
  updated_count: number;
  total_rows: number;
  errors: CatalogImportRowError[];
};

function shopParams(shopId: string): string {
  return new URLSearchParams({ shop_id: shopId }).toString();
}

export async function fetchOnboardingStatus(
  shopId: string,
  token?: string | null,
): Promise<OnboardingStatus> {
  return apiFetch<OnboardingStatus>(
    `${ONBOARDING_BASE}/status?${shopParams(shopId)}`,
    { token, cache: "no-store" },
  );
}

export async function saveOnboardingStep(
  shopId: string,
  payload: OnboardingStepPayload,
  token?: string | null,
): Promise<OnboardingStatus> {
  return apiFetch<OnboardingStatus>(
    `${ONBOARDING_BASE}/step?${shopParams(shopId)}`,
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );
}

export async function importCatalogFile(
  shopId: string,
  file: File,
  token?: string | null,
): Promise<CatalogImportResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${getApiBaseUrl()}${ONBOARDING_BASE}/import-catalog?${shopParams(shopId)}`,
    {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // keep generic
    }
    throw new ApiError(response.status, detail);
  }

  return (await response.json()) as CatalogImportResponse;
}

export function toApiBusinessHours(
  hours: BusinessHours,
): Record<string, { enabled: boolean; open: string; close: string }> {
  return Object.fromEntries(
    Object.entries(hours).map(([day, value]) => [
      day,
      {
        enabled: value.enabled,
        open: value.open,
        close: value.close,
      },
    ]),
  );
}

export function toApiServiceArea(area: ServiceArea) {
  return {
    mode: area.mode,
    zip_codes: area.zipCodes,
    radius_miles: area.radiusMiles,
    center_zip: area.centerZip,
  };
}

export function toApiServices(services: ServiceItem[]) {
  return services.map((service) => ({
    id: service.id,
    name: service.name,
    price_min: service.priceMin,
    price_max: service.priceMax,
    duration_min: service.durationMin,
    keywords: service.keywords,
  }));
}
