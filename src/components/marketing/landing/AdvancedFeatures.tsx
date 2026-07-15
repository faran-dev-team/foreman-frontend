"use client";

import { LandingMode, C, Reveal, TiltCard } from "./shared";


const FEATURES_COPY: Record<LandingMode, { title: string; desc: string }[]> = {
  main: [
    { title: "Natural Voice", desc: "Not a robot voice menu. Foreman sounds like a real human, with conversational pauses and empathy." },
    { title: "Industry Knowledge", desc: "It knows what a heat exchanger is, why a breaker trips, and how to price a water heater flush." },
    { title: "Direct Booking", desc: "It reads your ServiceTitan or Housecall Pro calendar and books jobs directly into open slots." },
    { title: "Smart Handoff", desc: "If a caller asks a complex technical question it can't answer, it takes a message or forwards the call to your cell." },
    { title: "Spam Filtering", desc: "It recognizes robocalls and telemarketers and hangs up instantly. You only see real jobs." },
    { title: "After-Hours Mode", desc: "Set it to only answer when you're busy, or let it take the night shift for emergency calls." }
  ],
  hvac: [
    { title: "Natural Voice", desc: "Sounds like a real human. Conversational, professional, and empathetic to homeowners without AC." },
    { title: "HVAC Knowledge", desc: "Knows the difference between a bad capacitor and a frozen coil. Quotes dispatch fees accurately." },
    { title: "Direct Booking", desc: "Reads your ServiceTitan or Housecall Pro calendar and books repairs directly into open slots." },
    { title: "Smart Handoff", desc: "If a caller needs technical troubleshooting, it takes a message or forwards the call to a tech." },
    { title: "Spam Filtering", desc: "Recognizes telemarketers selling leads and hangs up instantly. You only see real jobs." },
    { title: "Peak-Season Mode", desc: "Set it to answer only when your lines are full, or let it take the night shift for emergencies." }
  ],
  plumbing: [
    { title: "Natural Voice", desc: "Sounds like a real human. Conversational, professional, and calm during plumbing emergencies." },
    { title: "Plumbing Knowledge", desc: "Knows how to triage a leaking water heater vs a slow drain. Quotes dispatch fees accurately." },
    { title: "Direct Booking", desc: "Reads your calendar and books jobs directly into open slots, routing based on zip code." },
    { title: "Smart Handoff", desc: "If a caller needs an exact quote over the phone, it takes their info for you to call back." },
    { title: "Spam Filtering", desc: "Recognizes robocalls and hangs up instantly. You only see real jobs." },
    { title: "After-Hours Mode", desc: "Takes over the phones at 5 PM. Flags true emergencies and pages your on-call plumber." }
  ],
  electrical: [
    { title: "Natural Voice", desc: "Sounds like a real human. Professional, clear, and reassuring." },
    { title: "Electrical Knowledge", desc: "Knows how to triage a sparking outlet vs a panel upgrade quote. Quotes dispatch fees accurately." },
    { title: "Direct Booking", desc: "Reads your calendar and books service calls directly into open slots." },
    { title: "Smart Handoff", desc: "If a caller asks complex code questions, it takes a detailed message for you to call back." },
    { title: "Spam Filtering", desc: "Recognizes robocalls and hangs up instantly. You only see real jobs." },
    { title: "After-Hours Mode", desc: "Takes over the phones at night. Flags true emergencies (loss of power) and pages you." }
  ],
  restoration: [
    { title: "Natural Voice", desc: "Sounds human. Empathy is critical when a homeowner is standing in an inch of water." },
    { title: "Insurance Knowledge", desc: "Collects insurance carrier info, policy numbers, and date of loss automatically." },
    { title: "Direct Dispatch", desc: "Triggers emergency dispatches via SMS or webhook directly to your on-call technicians." },
    { title: "Smart Handoff", desc: "If a commercial property manager calls, it can route them directly to your cell." },
    { title: "Spam Filtering", desc: "Hangs up on robocalls. You only see real mitigation jobs." },
    { title: "24/7 Reliability", desc: "Restoration is a 24/7 business. Foreman never sleeps, never takes a break, and answers instantly." }
  ],
  "property-management": [
    { title: "Natural Voice", desc: "Sounds like a real human property manager. Professional and patient with tenants." },
    { title: "Triage Engine", desc: "Knows the difference between a burned-out lightbulb and a burst pipe, applying your specific rules." },
    { title: "Direct Dispatch", desc: "Books routine maintenance into AppFolio/Buildium, and pages on-call maintenance for emergencies." },
    { title: "Smart Handoff", desc: "Routes leasing inquiries to the leasing team, and maintenance to the maintenance queue." },
    { title: "Vendor Coordination", desc: "Can call your preferred plumbers or electricians to dispatch them to a unit if you are unavailable." },
    { title: "Audit Trail", desc: "Transcribes and logs every tenant call to the unit record. Total compliance and visibility." }
  ]
};

export function AdvancedFeatures({ mode = "main" }: { mode?: LandingMode }) {
  const fCopy = FEATURES_COPY[mode] || FEATURES_COPY.main;

  return (
    <section id="features" className="fm-island" style={{ background: C.bgPrimary, padding: "80px 0", position: "relative" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 64 }}>
          <div className="fm-eyebrow">ENTERPRISE-GRADE CAPABILITIES</div>
          <h2 className="fm-h2" style={{ fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            Beyond just a voicebot.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {fCopy.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <TiltCard className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 20, padding: 32, height: "100%" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.textHeading, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: C.textBody, lineHeight: 1.6 }}>{f.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
