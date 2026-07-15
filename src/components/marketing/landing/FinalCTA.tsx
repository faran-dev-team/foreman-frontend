"use client";

import { LandingMode, C, Reveal, MagneticButton, Logo } from "./shared";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";

const CTA_COPY: Record<LandingMode, { headline: string; sub: string }> = {
  main: { headline: "Stop losing jobs to the next guy on Google.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your business on the call. Zero risk. Zero cost for the pilot." },
  hvac: { headline: "Stop losing installs to the next shop on Google.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your HVAC business on the call." },
  plumbing: { headline: "Stop losing emergency calls to voicemail.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your plumbing business on the call." },
  electrical: { headline: "Stop losing jobs to the next electrician on Google.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your electrical business on the call." },
  restoration: { headline: "Stop losing five-figure mitigation jobs to voicemail.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your restoration business on the call." },
  "property-management": { headline: "Get your maintenance calls under control.", sub: "Book a 15-minute pilot call. We'll set up a live phone number for your property management firm on the call." }
};

export function FinalCTA({ mode = "main" }: { mode?: LandingMode }) {
  const cta = CTA_COPY[mode] || CTA_COPY.main;

  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "120px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle, rgba(249,122,53,0.15) 0%, transparent 60%)`, backgroundPosition: "center", backgroundSize: "1000px 1000px", backgroundRepeat: "no-repeat" }} />
      <div className="fm-wrap" style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800 }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <Logo size={64} />
          </div>
          <h2 className="fm-h2" style={{ fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.1, marginBottom: 24 }}>
            {cta.headline}
          </h2>
          <p className="fm-secsub" style={{ fontSize: 20, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            {cta.sub}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MagneticButton href={CALENDLY_PILOT_URL} className="fm-btn fm-btn-primary" style={{ fontSize: 18, padding: "20px 40px" }}>
              Claim your free pilot
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
