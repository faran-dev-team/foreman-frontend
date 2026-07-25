export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type DayHours = {
  enabled: boolean;
  open: string;
  close: string;
};

export type BusinessHours = Record<DayOfWeek, DayHours>;

export type ServiceItem = {
  id: string;
  name: string;
  priceMin: number;
  priceMax: number;
  durationMin: number;
  keywords: string;
};

export type ServiceAreaMode = "zip_codes" | "radius";

export type ServiceArea = {
  mode: ServiceAreaMode;
  zipCodes: string;
  radiusMiles: number;
  centerZip: string;
};

export type ReviewAutomationSettings = {
  googleReviewUrl: string;
  reviewAutomationEnabled: boolean;
  reviewDelayMinutes: number;
  reviewMaxRetries: number;
};

export type AppointmentReminderSettings = {
  appointmentReminderEnabled: boolean;
  appointmentReminderMaxRetries: number;
};

export type FollowUpAutomationSettings = {
  followUpAutomationEnabled: boolean;
  followUpDelayMinutes: number;
  followUpMaxRetries: number;
};

export type ShopSettingsForm = {
  greeting: string;
  businessHours: BusinessHours;
  services: ServiceItem[];
  serviceArea: ServiceArea;
  reviewAutomation: ReviewAutomationSettings;
  appointmentReminders: AppointmentReminderSettings;
  followUpAutomation: FollowUpAutomationSettings;
};
