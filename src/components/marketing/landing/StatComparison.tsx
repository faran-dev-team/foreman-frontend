"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { LandingMode, C, Reveal, TiltCard } from "./shared";


const PROBLEM_COPY: Record<LandingMode, { eyebrow: string; headline: string; body: string }> = {
  main: {
    eyebrow: "THE QUIET KILLER IN THE TRADES",
    headline: "1 in 4 calls goes unanswered. Every one is a job.",
    body: "You can't answer with your hands in a furnace or under a sink. Voicemail loses 80% of callers to the next name on Google. That's not a phone problem, that's revenue walking out the door, every single day."
  },
  hvac: {
    eyebrow: "THE QUIET KILLER IN HVAC",
    headline: "Peak-season overload.",
    body: "In a heat wave the calls never stop and neither do the missed ones. Each is a repair or install gone to the next shop. You can't answer mid-job. Foreman does, every time."
  },
  plumbing: {
    eyebrow: "THE QUIET KILLER IN PLUMBING",
    headline: "The money is after hours.",
    body: "Burst pipes and backups hit at 2 AM. Whoever answers wins. A flooding homeowner calls the next plumber if you don't answer. Foreman always answers."
  },
  electrical: {
    eyebrow: "THE QUIET KILLER IN ELECTRICAL",
    headline: "First to answer wins.",
    body: "When a homeowner has no power, they don't leave a voicemail. They call the next electrician on Google. If you don't answer first, you lose the job."
  },
  restoration: {
    eyebrow: "THE QUIET KILLER IN RESTORATION",
    headline: "First to answer wins.",
    body: "In water and fire restoration, speed decides everything. Foreman answers every emergency call instantly, 24/7/365, captures the details, and books the assessment, so you never lose a five-figure job to voicemail."
  },
  "property-management": {
    eyebrow: "THE QUIET KILLER IN PROPERTY MANAGEMENT",
    headline: "Relentless call volume.",
    body: "Every leak, lockout, and broken AC is a call. Across hundreds of units, your team can't keep up. Missed calls mean angry tenants and compliance risk. Foreman answers and logs every single one."
  }
};

export function StatComparison({ mode = "main" }: { mode?: LandingMode }) {
  const reducedMotion = useReducedMotion();
  const pCopy = PROBLEM_COPY[mode] || PROBLEM_COPY.main;
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -200px 0px" });

  return (
    <section ref={ref} className="fm-island" style={{ background: C.bgPrimary, padding: "48px 0", zIndex: 4, overflow: "hidden" }}>

      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 64 }}>
          <div className="fm-eyebrow">{pCopy.eyebrow}</div>
          <h2 className="fm-h2" style={{ fontSize: 40 }}>{pCopy.headline}</h2>
          <p className="fm-secsub" style={{ maxWidth: 700, margin: "0 auto" }}>{pCopy.body}</p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch", maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 16, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Missed calls without Foreman:</div>
              <div className="fm-statnum" style={{ color: C.textBody }}>40%</div>
            </div>
            {!reducedMotion && (
              <motion.div
                className="fm-phone-img"
                style={{ position: "absolute", zIndex: 3, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }}
                animate={isInView ? { rotate: [-6, 6], y: [-5, 5] } : {}}
                whileHover={{ scale: 1.12, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <Image src="/images/phone.png" alt="Phone" width={110} height={110} style={{ width: "100%", height: "auto" }} />
              </motion.div>
            )}
          </Reveal>
          <Reveal delay={0.1} style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.accentOrange, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 16, color: C.bgPrimary, fontWeight: 600, marginBottom: 12 }}>Missed calls with Foreman:</div>
              <div className="fm-statnum" style={{ color: C.bgPrimary, position: "relative", display: "inline-block" }}>
                0%
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", width: "170%", height: "170%", pointerEvents: "none" }}
                >
                  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", color: "rgba(255,255,255,0.4)" }}><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
                </motion.div>
              </div>
            </div>
            {!reducedMotion && (
              <div
                className="fm-zero-img"
                style={{ position: "absolute", zIndex: 3, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}
              >
                <Image src="/images/zero.png" alt="Zero" width={100} height={100} style={{ width: "100%", height: "auto" }} />
              </div>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.2} style={{ marginTop: 64, maxWidth: 1040, margin: "64px auto 0" }}>
          <TiltCard
            className="fm-dashboard-container"
            style={{
              background: "rgba(20, 28, 48, 0.4)",
              border: `1px solid ${C.accentOrange}40`,
              borderRadius: 24,
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h3 style={{
                fontSize: 22, fontWeight: 700, letterSpacing: 2,
                color: C.textHeading, textTransform: "uppercase"
              }}>
                <span style={{ color: C.accentOrange }}>AI</span> BUSINESS DASHBOARD
              </h3>
            </div>
            <div className="fm-dashboard-grid">
              {/* Card 1 */}
              <div style={{ background: C.bgPrimary, border: `1px solid ${C.borderPrimary}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(249,122,53,0.1)", border: `1px solid rgba(249,122,53,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: C.accentOrange }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div style={{ fontSize: 14, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Calls Today</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.textHeading, marginBottom: 12 }}>24</div>
                <div style={{ fontSize: 13, color: C.accentGreenText, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  +18%
                </div>
                <div style={{ fontSize: 12, color: "rgba(184,191,204,0.5)", marginTop: 4 }}>vs yesterday</div>
              </div>

              {/* Card 2 */}
              <div style={{ background: C.bgPrimary, border: `1px solid ${C.borderPrimary}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(167,139,250,0.1)", border: `1px solid rgba(167,139,250,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#A78BFA" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a4.5 4.5 0 0 1 4.5-4.5h4a4.5 4.5 0 0 1 4.5 4.5v2" /><path d="M19 11a2 2 0 0 1 0 4" /><path d="M22 9a4 4 0 0 1 0 8" /></svg>
                </div>
                <div style={{ fontSize: 14, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Answer Rate</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.textHeading, marginBottom: 12 }}>98.6%</div>
                <div style={{ fontSize: 13, color: C.accentGreenText, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  +3.2%
                </div>
                <div style={{ fontSize: 12, color: "rgba(184,191,204,0.5)", marginTop: 4 }}>vs yesterday</div>
              </div>

              {/* Card 3 */}
              <div style={{ background: C.bgPrimary, border: `1px solid ${C.borderPrimary}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(249,122,53,0.1)", border: `1px solid rgba(249,122,53,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: C.accentOrange }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><rect x="8" y="14" width="2" height="2" /><rect x="12" y="14" width="2" height="2" /><rect x="16" y="14" width="2" height="2" /></svg>
                </div>
                <div style={{ fontSize: 14, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Jobs Booked</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.textHeading, marginBottom: 12 }}>7</div>
                <div style={{ fontSize: 13, color: C.accentGreenText, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  +40%
                </div>
                <div style={{ fontSize: 12, color: "rgba(184,191,204,0.5)", marginTop: 4 }}>vs yesterday</div>
              </div>

              {/* Card 4 */}
              <div style={{ background: C.bgPrimary, border: `1px solid ${C.borderPrimary}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(31,170,89,0.1)", border: `1px solid rgba(31,170,89,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: C.accentGreenText }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div style={{ fontSize: 14, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Revenue</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: C.textHeading, marginBottom: 12 }}>$4,250</div>
                <div style={{ fontSize: 13, color: C.accentGreenText, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
                  +28%
                </div>
                <div style={{ fontSize: 12, color: "rgba(184,191,204,0.5)", marginTop: 4 }}>vs yesterday</div>
              </div>

              {/* Card 5 */}
              <div style={{ background: C.bgPrimary, border: `1px solid ${C.borderPrimary}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(31,170,89,0.05)", border: `1px solid rgba(31,170,89,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.accentGreenText, boxShadow: `0 0 12px ${C.accentGreenText}` }} />
                </div>
                <div style={{ fontSize: 14, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>AI Status</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.accentGreenText, marginBottom: 12, marginTop: 4 }}>Online</div>
                <div style={{ fontSize: 13, color: "rgba(184,191,204,0.6)", fontWeight: 500, marginTop: "auto" }}>All Systems Go</div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>

      {/* Optional faint scrolling ribbon */}
      <motion.div
        aria-hidden
        style={{
          marginTop: 16,
          whiteSpace: "nowrap", fontSize: "clamp(60px, 15vw, 160px)", fontWeight: 900,
          color: "rgba(255,255,255,0.02)", pointerEvents: "none"
        }}
        animate={isInView ? { x: ["0%", "-50%"] } : {}}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        ANSWERED QUALIFIED BOOKED ANSWERED QUALIFIED BOOKED
      </motion.div>
    </section>
  );
}
