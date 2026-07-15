"use client";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { C, Reveal, MagneticButton } from "./shared";

export function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 8, marginTop: 2 }}>
      <path d="M20 6L9 17l-5-5" stroke={C.accentGreenText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="fm-island" style={{ background: C.bgPrimary, padding: "80px 0" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 64 }}>
          <div className="fm-eyebrow">NO MONTHLY FEES. ZERO RISK.</div>
          <h2 className="fm-h2" style={{ fontSize: 40 }}>You only pay when we book a job.</h2>
          <p className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto" }}>
            We don't believe in software subscriptions. We believe in performance. If Foreman doesn't book you a job, you don't pay us a dime.
          </p>
        </Reveal>

        <div style={{ display: "flex", justifyContent: "center", maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 24, padding: 48, width: "100%", maxWidth: 480, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.accentOrange}, ${C.accentGreenText})` }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: C.textHeading, marginBottom: 8 }}>Pay Per Booking</h3>
                  <p style={{ fontSize: 15, color: C.textBody }}>For trades businesses ready to scale.</p>
                </div>
                <div style={{ background: "rgba(249,122,53,0.1)", border: `1px solid rgba(249,122,53,0.3)`, color: C.accentOrange, padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
                  MOST POPULAR
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 40 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: C.textHeading, lineHeight: 1 }}>$35</span>
                <span style={{ fontSize: 16, color: C.textBody }}>/ booked job</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
                {[
                  "Unlimited inbound calls",
                  "Unlimited call minutes",
                  "Direct calendar integration",
                  "SMS dispatch alerts",
                  "Call recording & transcripts",
                  "Custom trained on your business",
                  "Dedicated success manager"
                ].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: 16, color: C.textBody }}>
                    <Check />
                    {f}
                  </div>
                ))}
              </div>

              <MagneticButton href={CALENDLY_PILOT_URL} className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Book Your Pilot
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
