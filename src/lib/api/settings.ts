import { apiFetch } from "@/lib/api/client";
import type { ShopSettingsForm } from "@/lib/settings/types";
import { defaultShopSettings } from "@/lib/settings/defaults";
import { DAYS_OF_WEEK } from "@/lib/settings/types";

const DASHBOARD_BASE = "/api/v1/dashboard";

/** API snake_case shape for GET/PATCH /api/v1/dashboard/settings */
type ApiDayHours = {
  enabled: boolean;
  open: string;
  close: string;
};

type ApiServiceItem = {
  id: string;
  name: string;
  price_min: number;
  price_max: number;
  duration_min: number;
  keywords: string;
};

type ApiServiceArea = {
  mode: "zip_codes" | "radius";
  zip_codes: string;
  radius_miles: number;
  center_zip: string;
};

type ApiReviewAutomation = {
  google_review_url?: string | null;
  review_automation_enabled?: boolean;
  review_delay_minutes?: number;
  review_max_retries?: number;
};

type ApiAppointmentReminders = {
  appointment_reminder_enabled?: boolean;
  appointment_reminder_max_retries?: number;
};

type ApiFollowUpAutomation = {
  follow_up_automation_enabled?: boolean;
  follow_up_delay_minutes?: number;
  follow_up_max_retries?: number;
};

type ApiShopSettings = {
  greeting: string;
  business_hours: Record<string, ApiDayHours>;
  services: ApiServiceItem[];
  service_area: ApiServiceArea;
  review_automation?: ApiReviewAutomation | null;
  appointment_reminders?: ApiAppointmentReminders | null;
  follow_up_automation?: ApiFollowUpAutomation | null;
};

export function mapApiToShopSettings(api: ApiShopSettings): ShopSettingsForm {
  const businessHours = { ...DEFAULT_FORM_HOURS() };
  for (const day of DAYS_OF_WEEK) {
    const hours = api.business_hours?.[day];
    if (hours) {
      businessHours[day] = {
        enabled: Boolean(hours.enabled),
        open: hours.open || "09:00",
        close: hours.close || "17:00",
      };
    }
  }

  const review = api.review_automation;
  const reminders = api.appointment_reminders;
  const followUp = api.follow_up_automation;

  return {
    greeting: api.greeting,
    businessHours,
    services: (api.services ?? []).map((service) => ({
      id: service.id,
      name: service.name,
      priceMin: service.price_min,
      priceMax: service.price_max,
      durationMin: service.duration_min,
      keywords: service.keywords || "",
    })),
    serviceArea: {
      mode: api.service_area?.mode === "radius" ? "radius" : "zip_codes",
      zipCodes: api.service_area?.zip_codes || "",
      radiusMiles: api.service_area?.radius_miles ?? 25,
      centerZip: api.service_area?.center_zip || "",
    },
    reviewAutomation: {
      googleReviewUrl: review?.google_review_url ?? "",
      reviewAutomationEnabled: Boolean(review?.review_automation_enabled),
      reviewDelayMinutes:
        review?.review_delay_minutes ??
        defaultShopSettings.reviewAutomation.reviewDelayMinutes,
      reviewMaxRetries:
        review?.review_max_retries ??
        defaultShopSettings.reviewAutomation.reviewMaxRetries,
    },
    appointmentReminders: {
      appointmentReminderEnabled: Boolean(
        reminders?.appointment_reminder_enabled,
      ),
      appointmentReminderMaxRetries:
        reminders?.appointment_reminder_max_retries ??
        defaultShopSettings.appointmentReminders.appointmentReminderMaxRetries,
    },
    followUpAutomation: {
      followUpAutomationEnabled: Boolean(
        followUp?.follow_up_automation_enabled,
      ),
      followUpDelayMinutes:
        followUp?.follow_up_delay_minutes ??
        defaultShopSettings.followUpAutomation.followUpDelayMinutes,
      followUpMaxRetries:
        followUp?.follow_up_max_retries ??
        defaultShopSettings.followUpAutomation.followUpMaxRetries,
    },
  };
}

function mapShopSettingsToApi(settings: ShopSettingsForm): ApiShopSettings {
  const business_hours: Record<string, ApiDayHours> = {};
  for (const day of DAYS_OF_WEEK) {
    const hours = settings.businessHours[day];
    business_hours[day] = {
      enabled: hours.enabled,
      open: hours.open,
      close: hours.close,
    };
  }

  return {
    greeting: settings.greeting,
    business_hours,
    services: settings.services.map((service) => ({
      id: service.id,
      name: service.name,
      price_min: service.priceMin,
      price_max: service.priceMax,
      duration_min: service.durationMin,
      keywords: service.keywords,
    })),
    service_area: {
      mode: settings.serviceArea.mode,
      zip_codes: settings.serviceArea.zipCodes,
      radius_miles: settings.serviceArea.radiusMiles,
      center_zip: settings.serviceArea.centerZip,
    },
    review_automation: {
      google_review_url: settings.reviewAutomation.googleReviewUrl.trim() || null,
      review_automation_enabled:
        settings.reviewAutomation.reviewAutomationEnabled,
      review_delay_minutes: settings.reviewAutomation.reviewDelayMinutes,
      review_max_retries: settings.reviewAutomation.reviewMaxRetries,
    },
    appointment_reminders: {
      appointment_reminder_enabled:
        settings.appointmentReminders.appointmentReminderEnabled,
      appointment_reminder_max_retries:
        settings.appointmentReminders.appointmentReminderMaxRetries,
    },
    follow_up_automation: {
      follow_up_automation_enabled:
        settings.followUpAutomation.followUpAutomationEnabled,
      follow_up_delay_minutes: settings.followUpAutomation.followUpDelayMinutes,
      follow_up_max_retries: settings.followUpAutomation.followUpMaxRetries,
    },
  };
}

function DEFAULT_FORM_HOURS(): ShopSettingsForm["businessHours"] {
  return {
    monday: { enabled: true, open: "08:00", close: "18:00" },
    tuesday: { enabled: true, open: "08:00", close: "18:00" },
    wednesday: { enabled: true, open: "08:00", close: "18:00" },
    thursday: { enabled: true, open: "08:00", close: "18:00" },
    friday: { enabled: true, open: "08:00", close: "18:00" },
    saturday: { enabled: true, open: "09:00", close: "14:00" },
    sunday: { enabled: false, open: "09:00", close: "14:00" },
  };
}

/** Load shop settings for the Settings page. */
export async function fetchShopSettings(
  shopId: string,
  token?: string | null,
): Promise<ShopSettingsForm> {
  const params = new URLSearchParams({ shop_id: shopId });
  const api = await apiFetch<ApiShopSettings>(
    `${DASHBOARD_BASE}/settings?${params.toString()}`,
    { token, cache: "no-store" },
  );
  return mapApiToShopSettings(api);
}

/** Save shop settings for the Settings page. */
export async function saveShopSettings(
  shopId: string,
  settings: ShopSettingsForm,
  token?: string | null,
): Promise<ShopSettingsForm> {
  const params = new URLSearchParams({ shop_id: shopId });
  const api = await apiFetch<ApiShopSettings>(
    `${DASHBOARD_BASE}/settings?${params.toString()}`,
    {
      method: "PATCH",
      token,
      cache: "no-store",
      body: JSON.stringify(mapShopSettingsToApi(settings)),
    },
  );
  return mapApiToShopSettings(api);
}
