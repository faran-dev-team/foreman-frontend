'use client';
import { Nav, Footer, Pricing, FAQ, Check, CinematicWorkflow, C } from '../foreman-landing';
import '../foreman-landing.css';
import { ReactLenis } from '@studio-freight/react-lenis';
import { TradeId } from './content';

import { HeroSection } from './industry-hero';
import { MathSection } from './math-section';
import { TimelineSection } from './ai-solution-timeline';
import { PhoneDemoSection } from './interactive-phone-demo';
import { FeatureGrid } from './feature-grid';
import { CTASection } from './final-cta';

export function IndustryPage({ tradeId }: { tradeId: TradeId }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.6, smoothWheel: true }}>
      <main
        className="fm-landing font-sans"
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          color: C.textHeading,
          background: C.navBg,
          overflowX: "clip",
        }}
      >
        <Nav />
        <HeroSection tradeId={tradeId} />
        <MathSection tradeId={tradeId} />
        <div id="how">
          <TimelineSection />
        </div>
        <PhoneDemoSection tradeId={tradeId} />
        <div id="features">
          <FeatureGrid tradeId={tradeId} />
        </div>
        
        {/* Skipping Integrations, ROI, Dashboard, Testimonials for brevity in this iteration */}
        <CTASection tradeId={tradeId} />
        
        <Pricing />

        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0 20px", background: "#0A0F1C" }}>
          <div className="fm-hero-trust" style={{ margin: 0 }}>
            {["No monthly fee during pilot", "Pay only per booking", "Live in 24 hours"].map((t) => (
              <span key={t}><Check /> {t}</span>
            ))}
          </div>
        </div>

        <FAQ mode="main" />
        
        <div id="workflow">
          <CinematicWorkflow tradeId={tradeId} />
        </div>

        <Footer hideIntegrations />
      </main>
    </ReactLenis>
  );
}
