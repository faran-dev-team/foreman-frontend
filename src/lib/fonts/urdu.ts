import { Noto_Nastaliq_Urdu } from "next/font/google";

/**
 * Urdu (Nastaliq) typeface for marketing snippets that show Urdu text.
 * Exposed as `--font-urdu`; consumed by the `.fm-urdu` class. Not preloaded —
 * it only renders a few inline phrases, and unicode-range keeps Latin pages
 * from ever downloading it.
 */
export const urduFont = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
  // No metric-adjusted Latin fallback: its local("Times New Roman") face has no
  // unicode-range and would render Urdu in Naskh. Fall back to real Urdu faces.
  adjustFontFallback: false,
  fallback: ["Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Urdu Typesetting", "Noto Naskh Arabic", "serif"],
  variable: "--font-urdu",
});
