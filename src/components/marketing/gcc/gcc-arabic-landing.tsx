"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { ForemanLogo } from "@/lib/brand";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";

import { AR_HERO, FOOTER } from "./content";
import { GccShell } from "./gcc-landing";
import { HeroBackdrop, LanguageChips, TrustLine } from "./gcc-hero";
import { LiveCallConsole } from "./live-call-console";
import { EASE, MagneticLink } from "./primitives";

/**
 * Arabic landing — hero only, per the GCC copy doc (section 14).
 * The remaining sections must be written and reviewed by a native Gulf Arabic
 * speaker before they are added here; the page is `noindex` until then.
 */
export function GccArabicLanding() {
  const reduced = useReducedMotion();
  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: EASE } };

  // Split the headline so the last word carries the accent.
  const words = AR_HERO.headline.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const last = words[words.length - 1];

  return (
    <GccShell dir="rtl" lang="ar">
      <div className="gx-rtl">
        <nav className="gx-nav is-scrolled" aria-label="Main">
          <div className="gx-wrap gx-nav-inner">
            <Link href="/ar" className="gx-brand" aria-label="Foreman">
              <ForemanLogo size={30} />
              <span dir="ltr">Foreman</span>
            </Link>
            <div className="gx-nav-actions">
              <Link href="/" className="gx-lang-switch" hrefLang="en" lang="en" dir="ltr">
                English
              </Link>
              <a href={CALENDLY_PILOT_URL} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn-primary gx-btn-sm gx-ar">
                {AR_HERO.cta}
              </a>
            </div>
          </div>
        </nav>

        <main>
          <header className="gx-hero gx-hero-ar-page">
            <HeroBackdrop id="gx-ar-geo" />
            <div className="gx-wrap gx-hero-grid">
              <div className="gx-hero-copy">
                <motion.h1 className="gx-h1-ar" {...fade(0.08)}>
                  {lead} <span className="gx-ar-accent">{last}</span>
                </motion.h1>
                <motion.p className="gx-hero-sub gx-ar" {...fade(0.2)}>
                  {AR_HERO.body}
                </motion.p>
                <motion.div {...fade(0.3)}>
                  <LanguageChips includeSwitch={false} />
                </motion.div>
                <motion.div className="gx-hero-ctas" {...fade(0.38)}>
                  <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-primary gx-btn-lg gx-ar">
                    {AR_HERO.cta}
                    <ArrowLeft size={18} strokeWidth={2.4} aria-hidden />
                  </MagneticLink>
                </motion.div>
                <motion.div {...fade(0.48)}>
                  <TrustLine items={AR_HERO.trust} className="gx-ar" />
                </motion.div>
              </div>
              <motion.div
                className="gx-hero-visual"
                initial={reduced ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
              >
                <LiveCallConsole showGloss={false} />
              </motion.div>
            </div>
          </header>
        </main>

        <footer className="gx-footer gx-footer-mini">
          <div className="gx-wrap gx-footer-bottom" dir="ltr">
            <span>
              © {new Date().getFullYear()} {FOOTER.legalEntity}
            </span>
            <span className="gx-footer-sep" aria-hidden>
              ·
            </span>
            <span>{FOOTER.bottom}</span>
            <span className="gx-footer-sep" aria-hidden>
              ·
            </span>
            <Link href="/">English</Link>
          </div>
        </footer>
      </div>
    </GccShell>
  );
}
