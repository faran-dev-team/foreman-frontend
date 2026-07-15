"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingMode, C, Reveal } from "./shared";

const FAQS: Record<LandingMode, { q: string; a: string }[]> = {
  main: [
    { q: "How much does it cost?", a: "We charge purely on performance. You pay $35 only when Foreman successfully books a qualified job into your calendar. No monthly software fees, no hidden costs. If we don't book you a job, you pay nothing." },
    { q: "Does it sound like a robot?", a: "No. Foreman uses the latest low-latency voice models. It includes conversational fillers, pauses naturally, and speaks with genuine empathy." },
    { q: "How does it know my prices?", a: "During onboarding, we ingest your pricebook, dispatch fees, and standard operating procedures. Foreman quotes exactly how you tell it to." },
    { q: "What if the caller asks a complex question?", a: "Foreman knows its limits. If a caller asks a complex technical question or requests a custom commercial quote, it will take a detailed message or instantly transfer the call to your cell." },
    { q: "Can it integrate with ServiceTitan or Housecall Pro?", a: "Yes. Foreman connects directly via API to read real-time availability and inject bookings directly into your dispatch board." }
  ],
  hvac: [
    { q: "How much does it cost?", a: "We charge purely on performance. You pay $35 only when Foreman successfully books a qualified job into your calendar." },
    { q: "Does it know HVAC terminology?", a: "Yes. It understands tonnage, SEER ratings, capacitors, and freon leaks. It asks the right qualifying questions before booking." },
    { q: "Can it handle peak-season call volume?", a: "Absolutely. Foreman can handle unlimited simultaneous calls. If 10 people call at once during a heat wave, 10 people get answered instantly." },
    { q: "What if it's an emergency?", a: "Foreman flags emergencies (like no AC for an elderly customer or water leaking) and can page your on-call tech immediately via SMS." },
    { q: "Does it integrate with my CRM?", a: "Yes, it integrates with ServiceTitan, Housecall Pro, Jobber, and FieldEdge to read your calendar and book directly." }
  ],
  plumbing: [
    { q: "How much does it cost?", a: "You pay $35 only when Foreman successfully books a qualified job into your calendar. No monthly fees." },
    { q: "Does it know plumbing terminology?", a: "Yes. It understands main line backups, slab leaks, and water heater issues, and triages them appropriately." },
    { q: "Can it handle emergency dispatching?", a: "Yes. It flags true emergencies and can send an SMS or webhook directly to your on-call plumber, while booking the slot." },
    { q: "What if the caller needs troubleshooting?", a: "Foreman doesn't try to be a technician. If a caller asks complex questions, it takes a message for you to call back." },
    { q: "Does it integrate with my CRM?", a: "Yes, it integrates seamlessly with ServiceTitan, Housecall Pro, and Jobber." }
  ],
  electrical: [
    { q: "How much does it cost?", a: "You pay $35 only when Foreman successfully books a qualified job. No monthly fees." },
    { q: "Does it know electrical terminology?", a: "Yes. It understands panel upgrades, knob and tube, AFCI breakers, and short circuits." },
    { q: "Can it handle after-hours calls?", a: "Foreman runs 24/7. It can take over at 5 PM, book standard calls for the next day, and page you for emergencies." },
    { q: "What if the caller needs a major commercial quote?", a: "Foreman will collect the commercial property details, timeline, and scope, and then route the lead to your estimating team." },
    { q: "Does it integrate with my CRM?", a: "Yes, it integrates directly with ServiceTitan, Housecall Pro, and other major trade CRMs." }
  ],
  restoration: [
    { q: "How much does it cost?", a: "You pay $35 only when Foreman successfully dispatches or books an assessment. No monthly fees." },
    { q: "Can it collect insurance information?", a: "Yes. Foreman is trained to ask for the insurance carrier, claim number (if they have one), and date of loss." },
    { q: "Restoration is urgent. Can it dispatch immediately?", a: "Yes. Once an emergency is qualified (e.g. active flooding), Foreman can trigger SMS alerts directly to your mitigation team." },
    { q: "Does it sound empathetic?", a: "Yes. We specifically tune Foreman's voice profile for restoration to sound calm, empathetic, and reassuring during disasters." },
    { q: "Does it integrate with our software?", a: "Yes, Foreman can integrate with your CRM or dispatch software via direct API or Zapier." }
  ],
  "property-management": [
    { q: "How much does it cost?", a: "You pay $35 only when Foreman successfully logs a work order or books a vendor. No monthly fees." },
    { q: "Can it triage emergencies from routine requests?", a: "Yes. We load your specific matrix (e.g. 'AC out' is an emergency if >85 degrees, otherwise routine). It routes accordingly." },
    { q: "Can it dispatch our vendors?", a: "Yes. Foreman can call or SMS your preferred plumbing/HVAC vendors directly to dispatch them to the unit." },
    { q: "Does it log the calls?", a: "Every call is transcribed, summarized, and logged into AppFolio, Buildium, or your CRM, attached to the tenant record." },
    { q: "Can we use it just for after-hours?", a: "Yes. Many property managers use Foreman as their dedicated overnight and weekend emergency line." }
  ]
};

export function FAQ({ mode = "main" }: { mode?: LandingMode }) {
  const faqs = FAQS[mode] || FAQS.main;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "80px 0", borderTop: `1px solid ${C.borderPrimary}` }}>
      <div className="fm-wrap" style={{ maxWidth: 800 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 48 }}>
          <h2 className="fm-h2" style={{ fontSize: 40 }}>Frequently Asked Questions</h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    background: C.bgPrimary,
                    border: `1px solid ${isOpen ? C.accentOrange : C.borderPrimary}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={{
                      width: "100%", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "transparent", border: "none", color: C.textHeading, fontSize: 18, fontWeight: 600,
                      cursor: "pointer", textAlign: "left", fontFamily: "var(--font-outfit), sans-serif",
                    }}
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ color: isOpen ? C.accentOrange : C.textBody, flexShrink: 0, marginLeft: 16 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div style={{ padding: "0 32px 32px", color: C.textBody, fontSize: 16, lineHeight: 1.6 }}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
