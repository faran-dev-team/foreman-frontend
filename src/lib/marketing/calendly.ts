/** Pilot booking URL — override with NEXT_PUBLIC_CALENDLY_URL in .env.local */
export const CALENDLY_PILOT_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || "https://calendly.com/";
