"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { C, Reveal, TiltCard } from "./shared";

// -- Step Components --
function StepCall({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#38BDF8" }}>1 INCOMING CALL</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={active ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : { scale: 1, opacity: 0.2 }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(56,189,248,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(56,189,248,0.3)", marginBottom: 24 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></svg>
        </motion.div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Unknown Caller</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "var(--font-mono, monospace)" }}>(512) 555-0198</div>
      </TiltCard>
    </div>
  );
}

function StepAnswer({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#A78BFA" }}>2 AI ANSWERS</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentOrange, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: 700 }}>F</div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Foreman</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, background: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, borderTopLeftRadius: 0 }}>
          &quot;Thank you for calling Elite Home Services. This is Alex. Are you calling about a new repair or an existing job?&quot;
        </p>
        {active && (
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} style={{ height: 2, background: "linear-gradient(90deg, transparent, #A78BFA, transparent)", marginTop: "auto" }} />
        )}
      </TiltCard>
    </div>
  );
}

function StepListen({ active }: { active: boolean }) {
  const bars = [0.4, 0.8, 0.5, 1, 0.6, 0.3];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#34D399" }}>3 LISTENING</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 40, height: 40 }}>
          {bars.map((b, i) => (
            <motion.div key={i} animate={active ? { scaleY: [b, b * 1.5, b] } : { scaleY: 0.2 }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }} style={{ width: 6, height: 40, background: "#34D399", borderRadius: 3, transformOrigin: "center" }} />
          ))}
        </div>
        <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", padding: "12px 20px", borderRadius: 12, color: "#34D399", fontSize: 13, textAlign: "center", fontStyle: "italic" }}>
          &quot;My AC just stopped blowing cold air and it&apos;s 95 degrees outside.&quot;
        </div>
      </TiltCard>
    </div>
  );
}

function StepQualification({ active }: { active: boolean }) {
  const fields = [
    { label: "Customer", value: "Verified" },
    { label: "Service", value: "HVAC Repair" },
    { label: "Issue", value: "No Cooling" },
    { label: "Priority", value: "Emergency" },
    { label: "Location", value: "Austin TX" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#60A5FA" }}>4 QUALIFICATION</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 18, color: "#fff", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16, marginBottom: 8 }}>Qualification</div>
        {fields.map((f, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: active ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.2}s` }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{f.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{f.value}</span>
              {active && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.2 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentGreenText} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></motion.svg>}
            </div>
          </div>
        ))}
        {active && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} style={{ marginTop: "auto", background: "rgba(31,170,89,0.1)", border: "1px solid rgba(31,170,89,0.2)", borderRadius: 8, padding: "10px", textAlign: "center", color: C.accentGreenText, fontWeight: 600, fontSize: 13 }}>
            Ready to Book
          </motion.div>
        )}
      </TiltCard>
    </div>
  );
}

function StepAppointment({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#FBBF24" }}>5 SUGGESTION</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <motion.div animate={active ? { scale: [0.9, 1], opacity: [0, 1] } : { opacity: 0.2 }} transition={{ duration: 0.5 }} style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(251,191,36,0.2)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
        </motion.div>
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Suggesting Time</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Cross-referencing availability for Austin, TX.</p>
        </div>
        {active && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ width: "100%", background: "#1a1a1f", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ color: "#FBBF24", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>FOUND SLOT</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>Today, 2:00 PM</div>
          </motion.div>
        )}
      </TiltCard>
    </div>
  );
}

function StepCalendar({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#8AB4F8" }}>6 CALENDAR</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(32,33,36,0.9)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid #3C4043", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <motion.div animate={active ? { rotateY: 360 } : {}} transition={{ duration: 0.8 }} style={{ width: 64, height: 64, borderRadius: 16, background: "#ffffff", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, boxShadow: "0 8px 16px rgba(0,0,0,0.3)" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="18" rx="4" fill="#ffffff" />
            <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3H2V8z" fill="#4285F4" />
            <text x="12" y="19" fill="#4285F4" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">31</text>
          </svg>
        </motion.div>
        <h3 style={{ fontSize: 16, color: "#9AA0A6", marginBottom: 12, fontWeight: 500 }}>Thursday</h3>
        <motion.div animate={active ? { scale: [0.9, 1.1, 1], color: ["#E8EAED", "#8AB4F8", "#E8EAED"] } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ fontSize: 36, color: "#E8EAED", fontWeight: 700, marginBottom: 8, letterSpacing: -1 }}>2:00 PM</motion.div>
        <span style={{ color: "#9AA0A6", fontSize: 13, marginBottom: 40 }}>May 16, 2024</span>
        <motion.div animate={{ opacity: active ? 1 : 0.2 }} style={{ background: "rgba(138,180,248,0.15)", border: "1px solid rgba(138,180,248,0.4)", padding: "10px 24px", borderRadius: 999, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#8AB4F8", fontSize: 14, fontWeight: 700 }}>Booked</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8AB4F8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </motion.div>
      </TiltCard>
    </div>
  );
}

function StepDispatch({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#38BDF8" }}>7 DISPATCH</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#0f172a", opacity: 0.5, zIndex: 0 }} />
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
          <path d="M 40 380 Q 100 250 180 200 T 240 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
          {active && (
            <motion.path
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 40 380 Q 100 250 180 200 T 240 60" fill="none" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round"
            />
          )}
        </svg>
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.8)", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>M</div>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Mike (Tech)</div>
                <div style={{ color: "#38BDF8", fontSize: 11, fontWeight: 500 }}>Assigned</div>
              </div>
            </div>
          </div>
          {active && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }} style={{ position: "absolute", top: 40, right: 30, background: "#fff", padding: "6px 12px", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", color: "#000", fontSize: 12, fontWeight: 700 }}>
              ETA 14m
            </motion.div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

function StepSMS({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#34D399" }}>8 SMS SENT</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        {active && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} style={{ background: "#1a1a1f", padding: 20, borderRadius: 20, borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 12px 24px rgba(0,0,0,0.3)" }}>
            <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              &quot;Hi Mike! Your HVAC repair is confirmed for today between 2-4 PM. Your tech is Mike. Reply YES to confirm.&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Delivered</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </motion.div>
        )}
        {active && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }} style={{ background: "#34D399", padding: "12px 20px", borderRadius: 20, borderBottomRightRadius: 4, alignSelf: "flex-end", boxShadow: "0 8px 16px rgba(52,211,153,0.3)" }}>
            <p style={{ color: "#000", fontSize: 14, fontWeight: 500, margin: 0 }}>YES</p>
          </motion.div>
        )}
      </TiltCard>
    </div>
  );
}

function StepCRM({ active }: { active: boolean }) {
  const steps = ["Customer Saved", "Estimate Generated", "Job Created"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#C084FC" }}>9 CRM UPDATED</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Housecall Pro</span>
        </div>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: active ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.3}s` }}>
            {active ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.3, type: "spring" }} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(192,132,252,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(192,132,252,0.4)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              </motion.div>
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
            )}
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{s}</span>
          </div>
        ))}
      </TiltCard>
    </div>
  );
}

function StepRevenue({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#F97A35" }}>10 COMPLETED</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "rgba(16,18,27,0.8)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(249,122,53,0.2)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ position: "absolute", top: "50%", left: "50%", width: 200, height: 200, background: "radial-gradient(circle, rgba(249,122,53,0.15) 0%, transparent 70%)", transform: "translate(-50%, -50%)", zIndex: 0 }} />
        )}
        <motion.div animate={active ? { scale: [0.9, 1.1, 1] } : {}} transition={{ duration: 0.6 }} style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, rgba(249,122,53,0.3), rgba(249,122,53,0.05))", border: "1px solid rgba(249,122,53,0.5)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32, zIndex: 1 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F97A35" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        </motion.div>
        <h3 style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 12, fontWeight: 500, zIndex: 1, textTransform: "uppercase", letterSpacing: 1 }}>Job Completed</h3>
        {active ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }} style={{ fontSize: 48, color: "#fff", fontWeight: 700, marginBottom: 8, letterSpacing: -2, zIndex: 1 }}>
            +$650
          </motion.div>
        ) : (
          <div style={{ fontSize: 48, color: "rgba(255,255,255,0.1)", fontWeight: 700, marginBottom: 8, letterSpacing: -2, zIndex: 1 }}>$0</div>
        )}
      </TiltCard>
    </div>
  );
}

export function CinematicWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // We only care about progress between 10% and 90% roughly, map it nicely
    // If it's outside, it stays 0 or 1.
    // To match original behavior where 0 is at top and 1 is at bottom of viewport.
    setScrollProgress(latest);
  });

  // Path data for the winding workflow line
  const pathData = "M 140 210 L 300 210 C 380 210 380 340 300 340 L -20 340 C -100 340 -100 470 -20 470 L 300 470 C 380 470 380 600 300 600 L -20 600 C -100 600 -100 730 -20 730 L 140 730";
  const pathLength = 2600;

  // Derive active index based on scroll progress
  // Scale scroll progress to focus heavily on the center
  const scaledProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) * 1.5));
  const activeIndex = Math.min(9, Math.floor(scaledProgress * 10));

  return (
    <section ref={containerRef} style={{ background: "#0a0f1c", padding: "120px 0 200px", position: "relative", overflow: "hidden" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 120 }}>
          <div className="fm-eyebrow">THE LIFE OF A LEAD</div>
          <h2 className="fm-h2" style={{ fontSize: 48, marginBottom: 24 }}>Everything happens automatically.</h2>
          <p className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto" }}>
            Scroll to see exactly what happens behind the scenes from the moment the phone rings to the moment you get paid.
          </p>
        </Reveal>

        <div className="fm-cinematic-container">
          {!reducedMotion && (
            <svg className="fm-cinematic-svg" style={{ position: "absolute", top: 0, left: 140, width: "calc(100% - 280px)", height: "100%", zIndex: 0, pointerEvents: "none", overflow: "visible" }}>
              <path d={pathData} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d={pathData}
                fill="none" stroke={C.accentOrange} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength - scaledProgress * pathLength}
                style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
              />
            </svg>
          )}

          <div className="fm-cinematic-line-mobile" />

          <div className="fm-cinematic-grid">
            <div className="fm-cinematic-step step1"><StepCall active={activeIndex >= 0} /></div>
            <div className="fm-cinematic-step step2"><StepAnswer active={activeIndex >= 1} /></div>
            <div className="fm-cinematic-step step4"><StepListen active={activeIndex >= 2} /></div>
            
            <div className="fm-cinematic-step step7"><StepCalendar active={activeIndex >= 5} /></div>
            <div className="fm-cinematic-step step6"><StepAppointment active={activeIndex >= 4} /></div>
            <div className="fm-cinematic-step step5"><StepQualification active={activeIndex >= 3} /></div>
            
            <div className="fm-cinematic-step step8"><StepDispatch active={activeIndex >= 6} /></div>
            <div className="fm-cinematic-step step9"><StepSMS active={activeIndex >= 7} /></div>
            <div className="fm-cinematic-step step10"><StepRevenue active={activeIndex >= 9} /></div>
          </div>
          {/* Missing Step CRM (8) visually originally to fit 3x3 grid, but we keep the logic clean. */}
        </div>
      </div>
    </section>
  );
}
