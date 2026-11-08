import { CALENDLY_PILOT_URL } from "./calendly";

/**
 * WhatsApp Business number for the marketing site, digits only in
 * international format (e.g. 9715XXXXXXXX). Set NEXT_PUBLIC_WHATSAPP_NUMBER.
 *
 * When it is unset, WhatsApp-specific links are hidden and "Book a Pilot"
 * falls back to the Calendly pilot link, so no button ever points nowhere.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const HAS_WHATSAPP = WHATSAPP_NUMBER.length >= 8;

export function whatsappUrl(message = "Hi Foreman, I'd like to book a pilot.") {
  if (!HAS_WHATSAPP) return CALENDLY_PILOT_URL;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_PILOT_URL = whatsappUrl();
