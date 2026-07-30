import type {
  BusinessHours,
  ServiceItem,
  ShopSettingsForm,
} from "@/lib/settings/types";

const defaultBusinessHours: BusinessHours = {
  monday: { enabled: true, open: "08:00", close: "18:00" },
  tuesday: { enabled: true, open: "08:00", close: "18:00" },
  wednesday: { enabled: true, open: "08:00", close: "18:00" },
  thursday: { enabled: true, open: "08:00", close: "18:00" },
  friday: { enabled: true, open: "08:00", close: "18:00" },
  saturday: { enabled: true, open: "09:00", close: "14:00" },
  sunday: { enabled: false, open: "09:00", close: "14:00" },
};

const defaultServices: ServiceItem[] = [
  {
    id: "svc-1",
    name: "AC not cooling / repair",
    priceMin: 89,
    priceMax: 350,
    durationMin: 120,
    keywords: "ac, air conditioning, not cooling, warm air",
  },
  {
    id: "svc-2",
    name: "No heat / furnace repair",
    priceMin: 99,
    priceMax: 400,
    durationMin: 120,
    keywords: "heat, furnace, no heat, boiler",
  },
  {
    id: "svc-3",
    name: "Tune-up / maintenance",
    priceMin: 79,
    priceMax: 149,
    durationMin: 60,
    keywords: "tune up, maintenance, seasonal",
  },
];

export const defaultShopSettings: ShopSettingsForm = {
  greeting:
    "Thanks for calling {{shop_name}}, this is the front desk. This call may be recorded for quality and training. How can I help you today?",
  businessHours: defaultBusinessHours,
  services: defaultServices,
  serviceArea: {
    mode: "zip_codes",
    zipCodes: "90210, 90211, 90212",
    radiusMiles: 25,
    centerZip: "90210",
  },
  reviewAutomation: {
    googleReviewUrl: "",
    reviewAutomationEnabled: false,
    reviewDelayMinutes: 60,
    reviewMaxRetries: 3,
  },
  appointmentReminders: {
    appointmentReminderEnabled: false,
    appointmentReminderMaxRetries: 3,
  },
  followUpAutomation: {
    followUpAutomationEnabled: false,
    followUpDelayMinutes: 1440,
    followUpMaxRetries: 3,
  },
};

export function createEmptyService(): ServiceItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    priceMin: 0,
    priceMax: 0,
    durationMin: 60,
    keywords: "",
  };
}
