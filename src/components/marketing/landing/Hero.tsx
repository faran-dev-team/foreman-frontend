"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, useInView } from "framer-motion";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { DoodleTechnicianOnCall } from "../foreman-illustrations";
import { LandingMode, C, MagneticButton, Check } from "./shared";

const CALENDLY_LINK = CALENDLY_PILOT_URL;

/* ------------------------------------------------------------------ */
/*  CallCard — premium stateful workflow dashboard                     */
/* ------------------------------------------------------------------ */

type CallStatus = "ringing" | "answering" | "qualifying" | "booked";

interface HeroCallEntry {
  initials: string;
  name: string;
  trade: string;
  issue: string;
  time: string;
  priority: "standard" | "emergency";
  revenue: number;
}

const HERO_CALLS: HeroCallEntry[] = [
  { initials: "MR", name: "Mike R.", trade: "HVAC", issue: "AC not cooling — emergency", time: "2:14 PM", priority: "emergency", revenue: 580 },
  { initials: "SP", name: "Sara P.", trade: "Plumbing", issue: "Furnace install quote", time: "10:02 AM", priority: "standard", revenue: 1200 },
  { initials: "JK", name: "James K.", trade: "Electrical", issue: "Breaker panel upgrade", time: "8:47 PM", priority: "standard", revenue: 2400 },
];

function CallCardWaveform() {
  const bars = [0.45, 0.9, 0.6, 1, 0.5, 0.75, 0.4];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2.5, height: 16 }} aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          style={{ width: 2.5, borderRadius: 2, background: C.accentGreenText, transformOrigin: "center", display: "block" }}
          animate={{ scaleY: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          initial={{ height: 16 }}
        />
      ))}
    </div>
  );
}

function CallCardAvatar({ initials, priority }: { initials: string; priority: "standard" | "emergency" }) {
  const accent = priority === "emergency" ? C.accentOrange : "rgba(255,255,255,0.18)";
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: priority === "emergency" ? "rgba(249,122,53,0.12)" : "rgba(255,255,255,0.05)",
      border: `1.5px solid ${accent}`,
      fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: 12,
      color: priority === "emergency" ? C.accentOrange : C.textBody,
      letterSpacing: 0.3,
    }}>
      {initials}
    </div>
  );
}

function CallCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const reducedMotion = useReducedMotion();
  const [activeRow, setActiveRow] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookedRows, setBookedRows] = useState<Set<number>>(new Set());

  // Orchestrate the workflow animation sequence
  useEffect(() => {
    if (reducedMotion || !isInView) {
      setBookedRows(new Set([0, 1, 2]));
      setTotalRevenue(HERO_CALLS.reduce((s, c) => s + c.revenue, 0));
      return;
    }
    let cancelled = false;
    const sequence = async () => {
      for (let i = 0; i < HERO_CALLS.length; i++) {
        if (cancelled) return;
        setActiveRow(i);
        setCallStatus("ringing");
        await new Promise(r => setTimeout(r, 900));
        if (cancelled) return;
        setCallStatus("answering");
        await new Promise(r => setTimeout(r, 700));
        if (cancelled) return;
        setCallStatus("qualifying");
        await new Promise(r => setTimeout(r, 900));
        if (cancelled) return;
        setCallStatus("booked");
        setBookedRows(prev => new Set(prev).add(i));
        setTotalRevenue(prev => prev + HERO_CALLS[i].revenue);
        await new Promise(r => setTimeout(r, 1200));
      }
      // Hold the final state for a moment then restart
      await new Promise(r => setTimeout(r, 3000));
      if (cancelled) return;
      setActiveRow(0);
      setCallStatus("ringing");
      setBookedRows(new Set());
      setTotalRevenue(0);
      sequence();
    };
    sequence();
    return () => { cancelled = true; };
  }, [reducedMotion, isInView]);

  const statusLabel: Record<CallStatus, string> = {
    ringing: "Incoming",
    answering: "Answering",
    qualifying: "Qualifying",
    booked: "Booked",
  };
  const statusColor: Record<CallStatus, string> = {
    ringing: C.accentOrange,
    answering: "#60A5FA",
    qualifying: "#A78BFA",
    booked: C.accentGreenText,
  };

  return (
    <motion.div
      ref={ref}
      className="fm-callcard"
      animate={reducedMotion ? {} : { y: [-4, 4] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      style={{ overflow: "hidden", position: "relative" }}
    >
      {/* Top gradient accent rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${C.accentOrange}, ${C.accentGreenText})`,
        borderRadius: "28px 28px 0 0",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentGreenText, display: "block", boxShadow: `0 0 8px ${C.accentGreenText}` }}
          />
          <span className="fm-mono" style={{ fontSize: 11, letterSpacing: 2, color: "rgba(184,191,204,0.7)", textTransform: "uppercase" }}>Live Call Line</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CallCardWaveform />
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(184,191,204,0.6)", fontFamily: "var(--font-outfit), sans-serif" }}>Listening</span>
        </div>
      </div>

      {/* Call rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {HERO_CALLS.map((call, i) => {
          const isActive = i === activeRow && !bookedRows.has(i);
          const isBooked = bookedRows.has(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0",
                borderTop: i === 0 ? "none" : `1px solid rgba(255,255,255,0.06)`,
                transition: "background 0.3s ease",
              }}
            >
              <CallCardAvatar initials={call.initials} priority={call.priority} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.textHeading }}>{call.name}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    padding: "1px 6px", borderRadius: 4,
                    background: call.priority === "emergency" ? "rgba(249,122,53,0.12)" : "rgba(255,255,255,0.06)",
                    color: call.priority === "emergency" ? C.accentOrange : "rgba(184,191,204,0.6)",
                    border: call.priority === "emergency" ? `1px solid rgba(249,122,53,0.25)` : `1px solid rgba(255,255,255,0.08)`,
                  }}>{call.trade}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(184,191,204,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {call.issue}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono, monospace)", color: "rgba(184,191,204,0.5)" }}>{call.time}</span>
                <AnimatePresence mode="wait">
                  {isBooked ? (
                    <motion.span
                      key="booked"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "3px 8px 3px 6px", borderRadius: 999,
                        background: "rgba(31,170,89,0.12)",
                        border: `1px solid rgba(31,170,89,0.3)`,
                        fontSize: 10.5, fontWeight: 700, color: C.accentGreenText,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 5" stroke={C.accentGreenText} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Booked
                    </motion.span>
                  ) : isActive ? (
                    <motion.span
                      key="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 10.5, fontWeight: 600,
                        color: statusColor[callStatus],
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      {statusLabel[callStatus]}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ fontSize: 10.5, color: "rgba(184,191,204,0.3)", fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      Queued
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer metrics strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          marginTop: 16, paddingTop: 14,
          borderTop: `1px solid rgba(255,255,255,0.07)`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "rgba(249,122,53,0.1)",
            border: "1px solid rgba(249,122,53,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l6-6 4 4 8-8" stroke={C.accentOrange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 7h6v6" stroke={C.accentOrange} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.textHeading, lineHeight: 1.25, fontFamily: "var(--font-outfit), sans-serif" }}>
              {bookedRows.size} job{bookedRows.size !== 1 ? "s" : ""} booked
            </div>
            <motion.div
              style={{ fontSize: 11, color: "rgba(184,191,204,0.6)", fontFamily: "var(--font-outfit), sans-serif" }}
              key={totalRevenue}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
            >
              {totalRevenue > 0 ? `≈ $${totalRevenue.toLocaleString()} pipeline` : "Waiting for calls…"}
            </motion.div>
          </div>
        </div>
        <div style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: 0.3,
          color: C.accentGreenText,
          background: "rgba(31,170,89,0.1)",
          border: "1px solid rgba(31,170,89,0.25)",
          padding: "4px 10px", borderRadius: 999,
          fontFamily: "var(--font-outfit), sans-serif",
        }}>AI ACTIVE</div>
      </motion.div>
    </motion.div>
  );
}

const HERO_COPY: Record<LandingMode, { eyebrow: string; headline: string[]; headlineItalic: string; sub: string }> = {
  main: {
    eyebrow: "THE AI FRONT OFFICE FOR THE TRADES",
    headline: ["Never miss a call "],
    headlineItalic: "again.",
    sub: "Foreman answers every call, qualifies the job, prices it, and books it into your calendar. It works 24/7. Pay when it books a job."
  },
  hvac: {
    eyebrow: "THE AI FRONT OFFICE FOR HVAC",
    headline: ["In a heat wave, every", "missed call is a lost "],
    headlineItalic: "install.",
    sub: "When the AC dies at 9 PM, the homeowner calls whoever answers first. Foreman answers every time, qualifies the job, gives a price range, and books it, even when you're on a roof."
  },
  plumbing: {
    eyebrow: "THE AI FRONT OFFICE FOR PLUMBERS",
    headline: ["The 2 AM burst pipe", "goes to whoever answers. Make it "],
    headlineItalic: "you.",
    sub: "Plumbing emergencies don't wait for business hours. Foreman answers instantly, qualifies the job, and books it, so the panicked homeowner calls you and stays with you."
  },
  electrical: {
    eyebrow: "FOR ELECTRICAL CONTRACTORS",
    headline: ["The AI front office", "for "],
    headlineItalic: "electricians.",
    sub: "Foreman answers every call, qualifies the issue (panel upgrades, outages, estimates), and books the job directly on your calendar."
  },
  restoration: {
    eyebrow: "FOR RESTORATION CONTRACTORS",
    headline: ["The AI front office", "for "],
    headlineItalic: "restoration.",
    sub: "Foreman answers every emergency call, captures insurance details, triages the issue, and books the assessment or dispatch."
  },
  "property-management": {
    eyebrow: "THE AI FRONT OFFICE FOR PROPERTY MANAGEMENT",
    headline: ["Every tenant call,", "answered and "],
    headlineItalic: "handled.",
    sub: "Your team is buried in maintenance calls. Foreman answers every one, triages routine from emergency, and books or dispatches the work order, day and night, fully branded as you."
  }
};

export function Hero({ mode = "main" }: { mode?: LandingMode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const reducedMotion = useReducedMotion();
  const content = HERO_COPY[mode] || HERO_COPY.main;

  return (
    <header id="top" ref={ref} style={{ background: C.bgPrimary, color: C.textHeading, padding: "80px 0 140px", position: "relative", overflow: "hidden" }}>
      {/* Primary radial glow — top right */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", top: -240, right: -200, width: 720, height: 720, y: yGlow, zIndex: 0,
          background: `radial-gradient(circle, ${C.accentOrange}20 0%, ${C.accentOrange}08 40%, transparent 70%)`,
        }}
        animate={reducedMotion ? {} : { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary glow — bottom left for depth */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", bottom: -100, left: -150, width: 480, height: 480, zIndex: 0,
          background: `radial-gradient(circle, rgba(31,170,89,0.08) 0%, transparent 70%)`,
        }}
        animate={reducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      {/* Subtle dot grid background */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
        }}
      />

      <div className="fm-wrap fm-hero-grid" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <motion.div className="fm-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {content.eyebrow}
          </motion.div>
          <h1 className="fm-h1" style={mode === "main" ? { fontFamily: '"Times New Roman", Times, serif' } : {}}>
            {content.headline.map((line, i) => (
              <motion.span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.4em", marginBottom: "-0.4em" }}>
                <motion.span
                  style={{ display: "inline-block", paddingBottom: "0.1em" }}
                  initial={{ y: "120%", rotate: reducedMotion ? 0 : 2 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                  {i === content.headline.length - 1 && (
                    <span className="fm-serif-italic" style={{ color: C.accentOrange, WebkitTextFillColor: C.accentOrange, position: "relative", display: "inline-block" }}>
                      {content.headlineItalic}
                    </span>
                  )}
                </motion.span>
              </motion.span>
            ))}
          </h1>
          <motion.p className="fm-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {content.sub}
          </motion.p>
          <motion.div className="fm-hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
            <MagneticButton href={CALENDLY_LINK} className="fm-btn fm-btn-primary">Book your free pilot</MagneticButton>
            <motion.a href="#how" className="fm-btn fm-btn-ghost" whileHover={reducedMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>See how it works</motion.a>
          </motion.div>
          <motion.div className="fm-hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {["No monthly fee during pilot", "Pay only per booking", "Live in 24 hours"].map((t) => (
              <span key={t}><Check /> {t}</span>
            ))}
          </motion.div>
        </div>
        <motion.div
          style={{ position: "relative" }}
          initial={{ opacity: 0, x: 40, rotate: reducedMotion ? 0 : 2, y: 20 }}
          animate={{ opacity: 1, x: 0, rotate: 0, y: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle glow bloom behind the card */}
          <div aria-hidden style={{
            position: "absolute", inset: -40, borderRadius: "50%",
            background: `radial-gradient(ellipse, ${C.accentOrange}12 0%, transparent 70%)`,
            zIndex: 0, pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <CallCard />
          </div>
          {!reducedMotion && (
            <motion.div
              className="fm-hero-technician"
              style={{ position: "absolute", zIndex: 10, filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.5))" }}
              animate={{ y: [-8, 8], rotate: [-2, 2] }}
              whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <DoodleTechnicianOnCall style={{ width: "100%", height: "auto" }} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
}
