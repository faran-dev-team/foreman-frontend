/**
 * Public origin used for canonical / hreflang / Open Graph URLs.
 *
 * 1. NEXT_PUBLIC_SITE_URL, if set (e.g. https://foremanai.tech once the domain
 *    is connected to Vercel).
 * 2. Vercel's production domain (VERCEL_PROJECT_PRODUCTION_URL), which follows
 *    whatever domain is marked as production in the Vercel project.
 * 3. https://foremanai.tech as a last resort.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("https://foremanai.tech");
}
