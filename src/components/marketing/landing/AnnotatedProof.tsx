"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LandingMode, C, Reveal } from "./shared";
import { 
  DoodleSunburst, 
  DoodleRingingPhone, 
  DoodleClipboard, 
  DoodleHouseCheck 
} from "../foreman-illustrations";

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

function Calendar({ o }: { o?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={C.accentOrange} strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16l2 2 4-4" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PROOF_COPY: Record<LandingMode, { eyebrow: string; headline: string; sub: string }> = {
  main: { eyebrow: "MISSED CALL TO BOOKED JOB IN UNDER A MINUTE", headline: "1. Answers. 2. Qualifies. 3. Books.", sub: "Foreman doesn't just take messages. It qualifies the caller and puts them on your schedule." },
  hvac: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for HVAC", sub: "Answers instantly, qualifies and prices the job, then books and confirms." },
  plumbing: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for plumbing", sub: "Answers instantly, qualifies the job and flags emergencies, then books and confirms." },
  electrical: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for electrical", sub: "Answers instantly, qualifies the job and flags emergencies like sparking panels, then books and confirms." },
  restoration: { eyebrow: "EMERGENCY CALL TO BOOKED ASSESSMENT", headline: "How Foreman works for restoration", sub: "Answers instantly, captures details and triages the emergency, then books and alerts your team." },
  "property-management": { eyebrow: "TENANT CALL TO HANDLED WORK ORDER", headline: "How Foreman works for property management", sub: "Answers every call, triages the issue based on your escalation rules, then books or dispatches." }
};

export function AnnotatedProof({ mode = "main" }: { mode?: LandingMode }) {
  const pCopy = PROOF_COPY[mode] || PROOF_COPY.main;
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -100px 0px" });

  return (
    <section ref={ref} className="fm-island" style={{ position: "relative", background: C.bgCard, padding: "60px 0", zIndex: 5 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 40 }}>
          <div className="fm-eyebrow">{pCopy.eyebrow}</div>
          <div style={{ margin: "24px 0", position: "relative", display: "inline-block" }}>
            <h2 style={{
              fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: C.textHeading,
              position: "relative",
              display: "inline-block"
            }}>
              <span style={{ position: "absolute", top: -15, left: -30, zIndex: -1, pointerEvents: "none" }}>
                <DoodleSunburst style={{ width: 80, height: 80 }} />
              </span>
              {pCopy.headline}
            </h2>
          </div>
          <p className="fm-secsub">{pCopy.sub}</p>
        </Reveal>

        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", padding: "40px 0" }}>
          {/* Central Animated Timeline Line */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "rgba(255,255,255,0.05)", transform: "translateX(-50%)", zIndex: 0 }}>
            <motion.div
              style={{ width: "100%", height: 120, background: `linear-gradient(to bottom, transparent, ${C.accentOrange}, transparent)` }}
              animate={isInView ? { y: [-100, 1000] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Step 1: Answers */}
          <div className="fm-timeline-row left">
            <Reveal className="fm-timeline-content" style={{ position: "relative" }}>
              <div className="fm-callcard fm-hoverlift" style={{ background: `${C.accentOrange}15`, border: `1px solid ${C.accentOrange}30` }}>
                <div className="fm-callrow">
                  <div className="fm-callic" style={{ background: "transparent", color: C.accentOrange }}><UserIcon /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>John Doe</div>
                    <div style={{ fontSize: 13, color: C.textBody }}>Furnace blowing cold air, verified address 123 Main St</div>
                  </div>
                </div>
              </div>
              {/* Callout Bubble */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 10 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 5 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.08, rotate: 0 }}
                style={{ position: "absolute", top: -20, right: -20, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10 }}
              >
                Auto-qualified in 40s!
              </motion.div>
            </Reveal>
            <div className="fm-timeline-visual">
              <Reveal delay={0.2}>
                <motion.div animate={isInView ? { y: [-5, 5] } : {}} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
                  <DoodleRingingPhone style={{ width: 140, height: 140, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))" }} />
                </motion.div>
              </Reveal>
            </div>
          </div>

          {/* Step 2: Qualifies & Books */}
          <div className="fm-timeline-row right">
            <Reveal delay={0.1} className="fm-timeline-content" style={{ position: "relative" }}>
              <div className="fm-callcard fm-hoverlift" style={{ background: `${C.accentOrange}15`, border: `1px solid ${C.accentOrange}30` }}>
                <div className="fm-callrow">
                  <div className="fm-callic"><Calendar o /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>Service Appointment</div>
                    <div style={{ fontSize: 13, color: C.textBody }}>Scheduled for Tomorrow at 9:00 AM</div>
                  </div>
                  <span className="fm-badge fm-badge-booked">BOOKED</span>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                whileInView={{ scale: 1, opacity: 1, rotate: -5 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                whileHover={{ scale: 1.08, rotate: 0 }}
                style={{ position: "absolute", bottom: -20, left: -20, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10 }}
              >
                Synced to your calendar!
              </motion.div>
            </Reveal>
            <div className="fm-timeline-visual">
              <Reveal delay={0.3}>
                <motion.div animate={isInView ? { y: [-5, 5] } : {}} transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}>
                  <DoodleClipboard style={{ width: 140, height: 140, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))" }} />
                </motion.div>
              </Reveal>
            </div>
          </div>

          {/* Step 3: Books */}
          <div className="fm-timeline-row left">
            <Reveal delay={0.2} className="fm-timeline-content" style={{ position: "relative" }}>
              <div className="fm-callcard fm-hoverlift" style={{ background: `${C.accentOrange}15`, border: `1px solid ${C.accentOrange}30` }}>
                <div className="fm-callrow">
                  <div className="fm-callic" style={{ background: "transparent", color: C.accentOrange }}><UserIcon /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>Unknown Caller</div>
                    <div style={{ fontSize: 13, color: C.textBody }}>Emergency pipe burst at 8:47 PM</div>
                  </div>
                  <span className="fm-badge fm-badge-booked">BOOKED</span>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: 10 }}
                whileInView={{ scale: 1, opacity: 1, rotate: 5 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, type: "spring" }}
                whileHover={{ scale: 1.08, rotate: 0 }}
                style={{ position: "absolute", top: -20, right: -20, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10 }}
              >
                Recovered at 8:47pm!
              </motion.div>
            </Reveal>
            <div className="fm-timeline-visual">
              <Reveal delay={0.4}>
                <motion.div animate={isInView ? { y: [-5, 5] } : {}} transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}>
                  <DoodleHouseCheck style={{ width: 140, height: 140, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))" }} />
                </motion.div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
