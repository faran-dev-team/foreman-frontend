"use client";

import dynamic from "next/dynamic";
import { ReactLenis } from "@studio-freight/react-lenis";
import { LandingMode, C } from "./landing/shared";
import { Nav } from "./landing/Nav";
import { Hero } from "./landing/Hero";
import { PersistentWidget, ScrollToTopButton, Footer } from "./landing/Footer";

// Lazy-loaded below-the-fold components
const CinematicWorkflow = dynamic(() => import("./landing/CinematicWorkflow").then((mod) => mod.CinematicWorkflow));
const TradeSelector = dynamic(() => import("./landing/TradeSelector").then((mod) => mod.TradeSelector));
const StatComparison = dynamic(() => import("./landing/StatComparison").then((mod) => mod.StatComparison));
const AnnotatedProof = dynamic(() => import("./landing/AnnotatedProof").then((mod) => mod.AnnotatedProof));
const IntegrationsRow = dynamic(() => import("./landing/IntegrationsRow").then((mod) => mod.IntegrationsRow));
const AdvancedFeatures = dynamic(() => import("./landing/AdvancedFeatures").then((mod) => mod.AdvancedFeatures));
const FinalCTA = dynamic(() => import("./landing/FinalCTA").then((mod) => mod.FinalCTA));
const Pricing = dynamic(() => import("./landing/Pricing").then((mod) => mod.Pricing));
const FAQ = dynamic(() => import("./landing/FAQ").then((mod) => mod.FAQ));

export function ForemanLanding({ mode = "main" }: { mode?: LandingMode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.6, smoothWheel: true }}>
      <main
        className="fm-landing"
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          color: C.textHeading,
          background: C.navBg,
          overflowX: "clip",
        }}
      >
        <Nav />
        <Hero mode={mode} />
        <div id="how">
          <CinematicWorkflow />
        </div>
        {mode === "main" && <TradeSelector />}
        <StatComparison mode={mode} />
        <AnnotatedProof mode={mode} />
        <IntegrationsRow />
        <AdvancedFeatures mode={mode} />
        <FinalCTA mode={mode} />
        <Pricing />
        <FAQ mode={mode} />
        <Footer />
        <PersistentWidget />
        <ScrollToTopButton />
      </main>
    </ReactLenis>
  );
}