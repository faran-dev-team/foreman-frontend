"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { DoodleQuestion } from "../foreman-illustrations";
import { C, Reveal, MagneticButton } from "./shared";

const TRADES = [
  { id: "hvac", label: "HVAC", example: "AC blowing warm air, booked emergency repair 2pm" },
  { id: "plumbing", label: "Plumbing", example: "Leak in basement, booked emergency visit 3pm" },
  { id: "electrical", label: "Electrical", example: "Breaker keeps tripping, booked estimate Wed 9am" },
  { id: "roofing", label: "Roofing", example: "Missing shingles after storm, booked inspection Fri 10am" },
  { id: "pest", label: "Pest Control", example: "Termite evidence found, booked treatment Mon 8am" },
  { id: "garage", label: "Garage Door", example: "Spring broke, car stuck, booked emergency visit 4pm" },
  { id: "restoration", label: "Restoration", example: "Water damage, booked emergency dispatch" },
  { id: "property-management", label: "Property Mgmt", example: "Tenant locked out, dispatched maintenance" },
  { id: "law-firm", label: "Law Firms", example: "Accident inquiry, booked intake consultation Wed 10am" },
];

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" stroke={C.accentGreenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tradeIconMap: Record<string, React.ReactNode> = {
  hvac: <Image src="/images/hvac.png" alt="HVAC" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" priority />,
  plumbing: <Image src="/images/plumber.png" alt="Plumbing" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  electrical: <Image src="/images/electrician.png" alt="Electrical" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  roofing: <Image src="/images/roofing (2).png" alt="Roofing" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  pest: <Image src="/images/pest.png" alt="Pest Control" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  garage: <Image src="/images/garage.png" alt="Garage Door" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  restoration: <Image src="/images/restoration.png" alt="Restoration" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  "property-management": <Image src="/images/property.png" alt="Property Management" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />,
  "law-firm": <Image src="/images/property.png" alt="Law Firms" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" />
};

export function TradeSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const activeTrade = TRADES[activeIndex];
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    // Only auto-play if in viewport to save CPU
    if (!isAutoPlaying || !isInView) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRADES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isInView]);

  return (
    <section ref={ref} className="fm-island" style={{ background: C.bgCard, padding: "40px 0", zIndex: 3 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 40 }}>
          <motion.div
            style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
            animate={isInView && !reducedMotion ? { y: [-5, 5] } : {}}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <DoodleQuestion style={{ filter: "drop-shadow(0 15px 20px rgba(0,0,0,0.25))" }} />
          </motion.div>
          <div className="fm-eyebrow">BUILT FOR YOUR TRADE</div>
          <h2 className="fm-h2" style={{ fontSize: 40 }}>
            Knows your trade. Asks the right questions. Books the job.
          </h2>
        </Reveal>

        <Reveal delay={0.05} style={{ maxWidth: 900, margin: "0 auto 48px" }}>
          <div className="fm-cta-banner" style={{
            background: `linear-gradient(135deg, rgba(249,122,53,0.15) 0%, rgba(20,28,48,0.8) 100%)`,
            border: `1px solid rgba(249,122,53,0.3)`,
            borderRadius: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <h3 className="fm-cta-banner-text" style={{ fontWeight: 700, color: C.textHeading, margin: 0, lineHeight: 1.3 }}>
              Book a free call with our AI Consultant today.
            </h3>
            <MagneticButton href={CALENDLY_PILOT_URL} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary fm-cta-banner-btn">
              Book a free call with our AI Consultant
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            {TRADES.map((t, index) => {
              const isActive = t.id === activeTrade.id;
              return (
                <Link key={t.id} href={`/${t.id}`} passHref legacyBehavior>
                  <motion.a
                    onMouseEnter={() => { setActiveIndex(index); setIsAutoPlaying(false); }}
                    whileHover={reducedMotion ? {} : { scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    style={{
                      background: isActive ? C.accentOrange : "transparent",
                      color: isActive ? C.textHeading : C.textBody,
                      border: `1px solid ${isActive ? C.accentOrange : C.borderPrimary}`,
                      borderRadius: 999,
                      padding: "10px 20px",
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "background 300ms cubic-bezier(0.16,1,0.3,1), color 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {t.label}
                  </motion.a>
                </Link>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="fm-trade-card-container" style={{ maxWidth: 500, position: "relative", perspective: 1000 }}>
          {TRADES.map((trade, i) => {
            const distance = (i - activeIndex + TRADES.length) % TRADES.length;
            const isFront = distance === 0;
            const isVisible = distance < 3;
            // The card that just exited is at the end of the line (TRADES.length - 1)
            const isExiting = distance === TRADES.length - 1;

            return (
              <motion.div
                key={trade.id}
                className="fm-callcard"
                style={{
                  position: "absolute",
                  width: "100%",
                  top: 0,
                  left: 0,
                  background: C.bgPrimary,
                  transformOrigin: "top center",
                  zIndex: isExiting ? 10 : 10 - distance,
                  pointerEvents: isFront ? "auto" : "none",
                }}
                initial={false}
                animate={{
                  y: isExiting ? -40 : (isVisible ? distance * 15 : 30),
                  scale: isExiting ? 1.05 : (isVisible ? 1 - distance * 0.05 : 0.85),
                  opacity: isExiting ? 0 : (isVisible ? 1 - distance * 0.2 : 0),
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="fm-mono" style={{ fontSize: 12, letterSpacing: 2, color: C.textBody }}>INCOMING CALLS</span>
                </div>
                <div className="fm-callrow">
                  <div className="fm-callic"><PhoneIcon /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>New {trade.label} Lead</div>
                    <div style={{ fontSize: 13, color: C.textBody }}>{trade.example}</div>
                  </div>
                  <span className="fm-badge fm-badge-booked">BOOKED</span>
                </div>
              </motion.div>
            );
          })}

          <div className="fm-trade-img-left" style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.45))", position: "absolute" }}>
            <Image src="/images/foreman.png" alt="Foreman" fill style={{ objectFit: "contain" }} sizes="(max-width: 768px) 110px, 200px" priority />
          </div>

          <div className="fm-trade-img-right" style={{ filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.45))", position: "absolute" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrade.id}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -15 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              >
                {tradeIconMap[activeTrade.id]}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
