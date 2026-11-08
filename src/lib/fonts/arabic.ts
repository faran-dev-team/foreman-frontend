import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";

/**
 * Arabic typefaces for the GCC marketing pages.
 *  - IBM Plex Sans Arabic: body copy and UI (`--font-ar`)
 *  - Noto Kufi Arabic:     display headlines (`--font-ar-display`)
 *
 * Arabic subset only, not preloaded: the unicode-range keeps Latin-only views
 * from downloading them, and Latin glyphs fall through to Outfit/Playfair.
 */
export const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Geeza Pro", "Segoe UI", "Tahoma", "sans-serif"],
  variable: "--font-ar",
});

export const arabicDisplay = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Geeza Pro", "Segoe UI", "Tahoma", "sans-serif"],
  variable: "--font-ar-display",
});
