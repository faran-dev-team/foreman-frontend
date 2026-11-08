"use client";

import { useEffect } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

import { GCC_FONT_VARS } from "./fonts";
import { GccDashboard } from "./gcc-dashboard";
import { GccFaq, GccFinalCta } from "./gcc-faq-cta";
import { GccFeatures } from "./gcc-features";
import { GccFm, GccTrust } from "./gcc-fm-trust";
import { GccFooter } from "./gcc-footer";
import { GccHero } from "./gcc-hero";
import { GccHow } from "./gcc-how";
import { GccLanguages } from "./gcc-languages";
import { GccNav, TopBar } from "./gcc-nav";
import { GccPricing } from "./gcc-pricing";
import { GccProblem } from "./gcc-problem";

import "./gcc.css";

/** Shell shared by every GCC marketing page (fonts, smooth scroll, nav, footer). */
export function GccShell({ children, dir = "ltr", lang = "en" }: { children: React.ReactNode; dir?: "ltr" | "rtl"; lang?: string }) {
  useEffect(() => {
    if (!window.location.hash) return;
    const t = setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.09, duration: 1.2, smoothWheel: true, syncTouch: false }}>
      <div className={`gx gx-page ${GCC_FONT_VARS}`} dir={dir} lang={lang}>
        {children}
      </div>
    </ReactLenis>
  );
}

export function GccLanding() {
  return (
    <GccShell>
      <TopBar />
      <GccNav />
      <main>
        <GccHero />
        <GccProblem />
        <GccDashboard />
        <GccHow />
        <GccLanguages />
        <GccFeatures />
        <GccPricing />
        <GccFm />
        <GccTrust />
        <GccFaq />
        <GccFinalCta />
      </main>
      <GccFooter />
    </GccShell>
  );
}
