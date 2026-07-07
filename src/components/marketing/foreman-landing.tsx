"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import {
  DoodleTechnicianOnCall,
  DoodleHardHat,
  DoodleRingingPhone,
  DoodleWrenchGear,
  DoodleHouseCheck,
  DoodleServiceVan,
  DoodleClipboard,
  DoodleThumbsUp,
  DoodleSignalBars,
  DoodleQuestion,
  NicheHVAC,
  NichePlumbing,
  NicheElectrical,
  NicheRoofing,
  NichePest,
  NicheGarage,
  NicheLocksmith,
  NicheAppliance,
} from "./foreman-illustrations";

import "./foreman-landing.css";

const CALENDLY_LINK = CALENDLY_PILOT_URL;

const NAV_SECTIONS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
] as const;

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const C = {
  navBg: "#8B96A6",
  bgPrimary: "#0A0F1C",
  bgCard: "#141C30",
  accentOrange: "#F97A35",
  accentGreenText: "#1FAA59",
  accentGreenBg: "#163C2A",
  textBody: "#B8BFCC",
  textHeading: "#FFFFFF",
  textEyebrow: "#F97A35",
  borderPrimary: "rgba(255,255,255,0.08)",
  footerBg: "#05080F",
};

/* ------------------------------------------------------------------ */
/*  Reusable: F-monogram logo                                          */
/* ------------------------------------------------------------------ */
function Logo({ size = 40, bg = C.accentOrange, fg = C.bgPrimary }: { size?: number; bg?: string; fg?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <rect width="100" height="100" rx="24" fill={bg} />
      <rect x="30" y="26" width="16" height="52" rx="2.5" fill={fg} />
      <rect x="30" y="26" width="44" height="16" rx="2.5" fill={fg} />
      <rect x="30" y="49" width="32" height="14" rx="2.5" fill={fg} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: scroll-reveal wrapper                                    */
/* ------------------------------------------------------------------ */
function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: count-up number                                          */
/* ------------------------------------------------------------------ */
function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: Tilt Card with Glow                                      */
/* ------------------------------------------------------------------ */
function TiltCard({ children, className, glowColor = "rgba(255,255,255,0.12)", style, animate, transition }: { children: React.ReactNode, className?: string, glowColor?: string, style?: React.CSSProperties, animate?: any, transition?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rx = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });
  const ry = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
    rx.set(((y - height / 2) / height) * -8);
    ry.set(((x - width / 2) / width) * 8);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rx.set(0);
    ry.set(0);
  };

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        ...style
      }}
      animate={animate}
      transition={transition || { type: "spring", stiffness: 250, damping: 24 }}
      whileHover={reducedMotion ? {} : { scale: 1.015 }}
    >
      {!reducedMotion && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            zIndex: 0,
            pointerEvents: "none",
            background,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%", transform: isHovered && !reducedMotion ? "translateZ(16px)" : "none", transition: "transform 0.4s cubic-bezier(0.25,1,0.5,1)" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  NAV                                                                */
/* ================================================================== */
function NavMenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {open ? (
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

function NavAuthLinks({ className, onNavigate, renderDesktopItem }: { className: string; onNavigate?: () => void; renderDesktopItem?: (href: string, label: string) => React.ReactNode; }) {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !isSignedIn) {
    return (
      <>
        {renderDesktopItem ? renderDesktopItem("/sign-in", "Sign in") : <Link href="/sign-in" className={className} onClick={onNavigate}>Sign in</Link>}
        {renderDesktopItem ? renderDesktopItem("/sign-up", "Sign up") : <Link href="/sign-up" className={className} onClick={onNavigate}>Sign up</Link>}
      </>
    );
  }

  return (
    <>
      {renderDesktopItem ? renderDesktopItem("/calls", "Dashboard") : <Link href="/calls" className={className} onClick={onNavigate}>Dashboard</Link>}
    </>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeMobile(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {mobileOpen && <button type="button" className="fm-nav-backdrop" aria-label="Close navigation menu" onClick={closeMobile} />}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(14, 21, 38, 0.92)" : "rgba(14, 21, 38, 0.5)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid rgba(255,255,255,${scrolled ? 0.08 : 0})`,
          transition: "background .4s cubic-bezier(0.16,1,0.3,1), border-color .4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="fm-wrap fm-nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 64 : 88, transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)", gap: 16 }}>
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={closeMobile}>
            <div style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)", transform: `scale(${scrolled ? 0.85 : 1})`, transformOrigin: "left center" }}><Logo size={38} /></div>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 22, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
          </a>
          <div className="fm-nav-desktop" onMouseLeave={() => setHoveredId(null)}>
            {NAV_SECTIONS.map((item) => (
              <a key={item.href} href={item.href} className="fm-navlink" onMouseEnter={() => setHoveredId(item.href)} style={{ position: "relative", padding: "8px 16px" }}>
                <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
                {hoveredId === item.href && !reducedMotion && <motion.div layoutId="navHover" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", borderRadius: 999, zIndex: 1 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              </a>
            ))}
            <NavAuthLinks
              className="fm-navlink"
              renderDesktopItem={(href, label) => (
                <Link key={href} href={href} className="fm-navlink" onMouseEnter={() => setHoveredId(href)} style={{ position: "relative", padding: "8px 16px" }}>
                  <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
                  {hoveredId === href && !reducedMotion && <motion.div layoutId="navHover" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", borderRadius: 999, zIndex: 1 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                </Link>
              )}
            />
            <MagneticButton href="#pilot" className="fm-btn fm-btn-primary fm-nav-cta">Book a pilot call</MagneticButton>
          </div>
          <button type="button" className="fm-nav-toggle" aria-expanded={mobileOpen} aria-controls="fm-mobile-nav" onClick={() => setMobileOpen((open) => !open)}>
            <span className="sr-only">{mobileOpen ? "Close navigation menu" : "Open navigation menu"}</span>
            <NavMenuIcon open={mobileOpen} />
          </button>
        </div>
        <div id="fm-mobile-nav" className={`fm-nav-mobile${mobileOpen ? " fm-nav-mobile-open" : ""}`}>
          <div className="fm-wrap fm-nav-mobile-inner">
            {NAV_SECTIONS.map((item) => <a key={item.href} href={item.href} className="fm-nav-mobile-link" onClick={closeMobile}>{item.label}</a>)}
            <NavAuthLinks className="fm-nav-mobile-link" onNavigate={closeMobile} />
            <a href="#pilot" className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={closeMobile}>Book a pilot call</a>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
const heroCalls = [
  { name: "Mike \u2014 AC not cooling", sub: "Answered, qualified, booked Thu 2pm" },
  { name: "Sara \u2014 furnace install quote", sub: "Answered, qualified, booked Fri 10am" },
  { name: "After-hours call, 8:47pm", sub: "Answered while you were off the clock" },
];

function MagneticButton({ children, href, className, target, rel }: { children: React.ReactNode, href: string, className?: string, target?: string, rel?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref} href={href} target={target} rel={rel} className={className}
      animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse} onMouseLeave={reset}
      whileHover={reducedMotion ? {} : { scale: 1.04, boxShadow: "0 14px 38px rgba(242,105,28,0.38)" }} whileTap={{ scale: 0.97 }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.a>
  );
}

function CallCard() {
  const reducedMotion = useReducedMotion();
  return (
    <TiltCard
      className="fm-callcard"
      animate={reducedMotion ? {} : { y: [-5, 5] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span className="fm-mono" style={{ fontSize: 12, letterSpacing: 2, color: C.textBody }}>INCOMING CALLS</span>
        <motion.span className="fm-badge fm-badge-live" animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          ● FOREMAN LIVE
        </motion.span>
      </div>
      {heroCalls.map((c, i) => (
        <motion.div
          key={i}
          className="fm-callrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="fm-callic">
            <PhoneIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>{c.name}</div>
            <div style={{ fontSize: 13, color: C.textBody }}>{c.sub}</div>
          </div>
          <motion.span
            className="fm-badge fm-badge-booked"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: [0.9, 1.05, 1] }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i + 0.2, duration: 0.4 }}
          >
            BOOKED
          </motion.span>
        </motion.div>
      ))}
      <motion.div
        style={{ textAlign: "center", marginTop: 18, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 20, color: C.accentOrange, position: "relative" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.5, type: "spring" }}
          style={{ position: "absolute", top: -30, right: 30 }}
        >
          <DoodleArrow style={{ transform: "rotate(45deg) scaleX(-1)" }} />
        </motion.div>
        3 jobs booked today
      </motion.div>
    </TiltCard>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const reducedMotion = useReducedMotion();

  return (
    <header id="top" ref={ref} style={{ background: C.bgPrimary, color: C.textHeading, padding: "160px 0 140px", position: "relative", overflow: "hidden" }}>
      {/* moving glow */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", top: -200, right: -180, width: 620, height: 620, y: yGlow, zIndex: 0,
          background: "radial-gradient(circle, rgba(242,105,28,0.15), transparent 70%)",
        }}
        animate={reducedMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="fm-wrap fm-hero-grid" style={{ position: "relative", zIndex: 2 }}>
        <div>
          <motion.div className="fm-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            AI FRONT OFFICE FOR HVAC &amp; TRADES
          </motion.div>
          <h1 className="fm-h1">
            {["Never miss", "another "].map((line, i) => (
              <motion.span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.4em", marginBottom: "-0.4em" }}>
                <motion.span
                  style={{ display: "inline-block", paddingBottom: "0.1em" }}
                  initial={{ y: "120%", rotate: reducedMotion ? 0 : 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                  {i === 1 && (
                    <span className="fm-serif-italic" style={{ color: C.accentOrange, WebkitTextFillColor: C.accentOrange, position: "relative", display: "inline-block" }}>
                      job.
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{ position: "absolute", bottom: -8, left: -10, width: "120%", zIndex: -1 }}
                      >
                        <DoodleUnderline style={{ width: "100%", height: "auto" }} />
                      </motion.div>
                    </span>
                  )}
                </motion.span>
              </motion.span>
            ))}
          </h1>
          <motion.p className="fm-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Foreman answers every missed call, qualifies the job, and books it into your calendar automatically. You only pay when we book you real work.
          </motion.p>
          <motion.div className="fm-hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
            <MagneticButton href="#pilot" className="fm-btn fm-btn-primary">Book your free pilot</MagneticButton>
            <motion.a href="#how" className="fm-btn fm-btn-ghost" whileHover={reducedMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>See how it works</motion.a>
          </motion.div>
          <motion.div className="fm-hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {["No monthly fee during pilot", "Pay only per booking", "Live in 24 hours"].map((t) => (
              <span key={t}><Check /> {t}</span>
            ))}
          </motion.div>
        </div>
        <motion.div style={{ position: "relative" }} initial={{ opacity: 0, x: 40, rotate: reducedMotion ? 0 : 3, y: 20 }} animate={{ opacity: 1, x: 0, rotate: 0, y: 0 }} transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          <CallCard />
          {!reducedMotion && (
            <motion.div
              style={{ position: "absolute", bottom: -45, right: -65, width: 150, zIndex: 10, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }}
              animate={{ y: [-10, 10], rotate: [-3, 3] }}
              whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <DoodleTechnicianOnCall style={{ width: "100%", height: "auto" }} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
}

/* ================================================================== */
/*  TRADE SELECTOR ROW                                                 */
/* ================================================================== */
const TRADES = [
  { id: "hvac", label: "HVAC", example: "AC blowing warm air, booked emergency repair 2pm" },
  { id: "plumbing", label: "Plumbing", example: "Leak in basement, booked emergency visit 3pm" },
  { id: "electrical", label: "Electrical", example: "Breaker keeps tripping, booked estimate Wed 9am" },
  { id: "roofing", label: "Roofing", example: "Missing shingles after storm, booked inspection Fri 10am" },
  { id: "pest", label: "Pest Control", example: "Termite evidence found, booked treatment Mon 8am" },
  { id: "garage", label: "Garage Door", example: "Spring broke, car stuck, booked emergency visit 4pm" },
  { id: "locksmith", label: "Locksmith", example: "Locked out of house, booked immediate dispatch" },
  { id: "appliance", label: "Appliance Repair", example: "Fridge not cooling, booked repair Thu 1pm" },
];

const tradeIconMap: Record<string, React.ReactNode> = {
  hvac: <NicheHVAC />,
  plumbing: <NichePlumbing />,
  electrical: <NicheElectrical />,
  roofing: <NicheRoofing />,
  pest: <NichePest />,
  garage: <NicheGarage />,
  locksmith: <NicheLocksmith />,
  appliance: <NicheAppliance />
};

function TradeSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTrade = TRADES[activeIndex];
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRADES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleManualSelect = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "96px 0", zIndex: 3 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 40 }}>
          <motion.div
            style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
            animate={{ y: [-5, 5] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <DoodleQuestion style={{ filter: "drop-shadow(0 15px 20px rgba(0,0,0,0.25))" }} />
          </motion.div>
          <div className="fm-eyebrow">BUILT FOR YOUR TRADE</div>
          <h2 className="fm-h2" style={{ fontSize: 40 }}>Answers the questions you would ask.</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 48 }}>
            {TRADES.map((t, index) => {
              const isActive = t.id === activeTrade.id;
              return (
                <motion.button
                  key={t.id}
                  onClick={() => handleManualSelect(index)}
                  whileHover={reducedMotion ? {} : { scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  style={{
                    background: isActive ? C.accentOrange : "transparent",
                    color: isActive ? C.textHeading : C.textBody,
                    border: `1px solid ${isActive ? C.accentOrange : C.borderPrimary}`,
                    borderRadius: 999,
                    padding: "10px 20px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "background 300ms cubic-bezier(0.16,1,0.3,1), color 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {t.label}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2} style={{ maxWidth: 500, margin: "0 auto", position: "relative", height: 160, perspective: 1000 }}>
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

                <AnimatePresence>
                  {isFront && !reducedMotion && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 10 }}
                      exit={{ opacity: 0, scale: 0, rotate: 45 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.5, delay: 0.2 }}
                      style={{ position: "absolute", top: -30, right: -30, width: 70, height: 70, zIndex: 10, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }}
                    >
                      {tradeIconMap[trade.id]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  STAT COMPARISON BLOCK                                              */
/* ================================================================== */
function StatComparison() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "96px 0", zIndex: 4 }}>
      {/* Optional faint scrolling ribbon */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", top: "40%", left: 0, right: 0,
          whiteSpace: "nowrap", fontSize: "160px", fontWeight: 900,
          color: "rgba(255,255,255,0.02)", pointerEvents: "none", zIndex: 0
        }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        ANSWERED QUALIFIED BOOKED ANSWERED QUALIFIED BOOKED
      </motion.div>

      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}>
          <Reveal style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 16, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Missed calls without Foreman:</div>
              <div className="fm-statnum" style={{ color: C.textBody }}>~40%</div>
            </div>
            {!reducedMotion && (
              <motion.div
                style={{ position: "absolute", top: -65, left: -45, width: 110, zIndex: 3, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" }}
                animate={{ rotate: [-6, 6], y: [-5, 5] }}
                whileHover={{ scale: 1.12, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <DoodleRingingPhone style={{ width: "100%", height: "auto" }} />
              </motion.div>
            )}
          </Reveal>
          <Reveal delay={0.1} style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.accentOrange, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 16, color: C.bgPrimary, fontWeight: 600, marginBottom: 12 }}>Missed calls with Foreman:</div>
              <div className="fm-statnum" style={{ color: C.bgPrimary, position: "relative", display: "inline-block" }}>
                0%
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "140%", height: "140%", pointerEvents: "none" }}
                >
                  <DoodleCircle style={{ width: "100%", height: "100%" }} />
                </motion.div>
              </div>
            </div>
            {!reducedMotion && (
              <motion.div
                style={{ position: "absolute", bottom: -45, right: -35, width: 100, zIndex: 3, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}
                animate={{ rotate: [-10, 10], y: [-4, 4] }}
                whileHover={{ scale: 1.12, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <DoodleWrenchGear style={{ width: "100%", height: "auto" }} />
              </motion.div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  ANNOTATED PROOF SECTION                                            */
/* ================================================================== */
function AnnotatedProof() {
  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "120px 0", zIndex: 5 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 80 }}>
          <div className="fm-eyebrow">SEE IT IN ACTION</div>
          <h2 className="fm-h2">Every detail handled.</h2>
          <p className="fm-secsub">Foreman doesn't just take messages. It qualifies the caller and puts them on your schedule.</p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 80, alignItems: "center" }}>
          {/* Card 1 */}
          <Reveal style={{ position: "relative", width: "100%", maxWidth: 500 }}>
            <div className="fm-callcard fm-hoverlift" style={{ background: C.bgPrimary }}>
              <div className="fm-callrow">
                <div className="fm-callic" style={{ background: "transparent" }}><DoodleFace /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>John Doe</div>
                  <div style={{ fontSize: 13, color: C.textBody }}>Furnace blowing cold air, verified address 123 Main St</div>
                </div>
              </div>
            </div>
            {/* Callout Bubble */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 10 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              style={{ position: "absolute", top: -20, right: -40, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10 }}
            >
              Auto-qualified in 40s!
            </motion.div>
          </Reveal>

          {/* Card 2 */}
          <Reveal delay={0.1} style={{ position: "relative", width: "100%", maxWidth: 500 }}>
            <div className="fm-callcard fm-hoverlift" style={{ background: C.bgPrimary }}>
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
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              whileInView={{ scale: 1, opacity: 1, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              style={{ position: "absolute", bottom: -20, left: -40, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10, display: "flex", alignItems: "center" }}
            >
              <div style={{ position: "absolute", top: -30, left: -20, width: 50, height: 50, filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.3))" }}>
                <DoodleHouseCheck style={{ width: "100%", height: "100%" }} />
              </div>
              <span style={{ marginLeft: 30 }}>Synced to your calendar!</span>
            </motion.div>
          </Reveal>

          {/* Card 3 */}
          <Reveal delay={0.2} style={{ position: "relative", width: "100%", maxWidth: 500 }}>
            <div className="fm-callcard fm-hoverlift" style={{ background: C.bgPrimary }}>
              <div className="fm-callrow">
                <div className="fm-callic" style={{ background: "transparent" }}><DoodleFace /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: C.textHeading }}>Unknown Caller</div>
                  <div style={{ fontSize: 13, color: C.textBody }}>Emergency pipe burst at 8:47 PM</div>
                </div>
                <span className="fm-badge fm-badge-booked">BOOKED</span>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: 5 }}
              whileInView={{ scale: 1, opacity: 1, rotate: -4 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: "spring" }}
              whileHover={{ scale: 1.08, rotate: 0 }}
              style={{ position: "absolute", top: -20, right: -40, background: C.accentOrange, color: C.bgPrimary, padding: "8px 24px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "4px solid white", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 10 }}
            >
              Recovered at 8:47pm!
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  INTEGRATIONS ROW                                                   */
/* ================================================================== */
function IntegrationsRow() {
  const reducedMotion = useReducedMotion();
  const logos = ["Google Calendar", "ServiceTitan", "Jobber", "QuickBooks", "Twilio"];
  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "96px 0", zIndex: 6, overflow: "hidden" }}>
      <div style={{ textAlign: "center" }}>
        <Reveal style={{ position: "relative" }}>
          <div className="fm-eyebrow" style={{ marginBottom: 48 }}>PLAYS NICE WITH YOUR TOOLS</div>

          <div className="fm-marquee-container" style={{ position: "relative", zIndex: 1 }}>
            <div className="fm-marquee-content">
              {[...logos, ...logos, ...logos].map((logo, i) => (
                <div key={i} className="fm-logopill" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 999, padding: "16px 32px", color: C.textHeading, fontWeight: 600, fontSize: 18, flexShrink: 0, whiteSpace: "nowrap" }}>
                  {logo}
                </div>
              ))}
            </div>
          </div>

          {!reducedMotion && (
            <div style={{ position: "relative", width: "100%", height: 150, marginTop: 40 }}>
              <motion.div
                style={{ position: "absolute", bottom: 0, left: -300, width: 260, zIndex: 0, opacity: 0.8, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))" }}
                animate={{ x: [0, "calc(100vw + 600px)"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                <DoodleServiceVan style={{ width: "100%", height: "auto" }} />
              </motion.div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  DISPATCH / TEAM SECTION                                            */
/* ================================================================== */
function DispatchSection() {
  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "96px 0", zIndex: 7 }}>
      <div className="fm-wrap">
        <Reveal>
          <div className="fm-hoverlift" style={{ background: C.accentGreenBg, borderRadius: 32, padding: "64px 48px", textAlign: "center", border: `1px solid ${C.accentGreenText}`, position: "relative", overflow: "hidden" }}>
            <motion.div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, position: "relative", zIndex: 1 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ rotate: [-3, 3] }}
                whileHover={{ scale: 1.12, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <DoodleClipboard style={{ marginBottom: 16, filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.3))" }} />
              </motion.div>
              <h2 className="fm-h2" style={{ color: C.textHeading, margin: 0 }}>Your whole crew, always in the loop</h2>
            </motion.div>
            <p className="fm-secsub" style={{ color: C.accentGreenText, maxWidth: 600, margin: "0 auto", fontWeight: 500 }}>
              Dispatch sees every booked job in real time. Techs get the address and notes automatically sent to their phones. No more messy text threads or lost sticky notes.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  SOCIAL PROOF                                                       */
/* ================================================================== */
function SocialProof() {
  return (
    <section style={{ background: C.bgPrimary, padding: "80px 0", borderTopLeftRadius: 48, borderTopRightRadius: 48, marginTop: -48, position: "relative", zIndex: 8 }}>
      <div className="fm-wrap">
        <Reveal style={{ textAlign: "center", borderTop: `1px solid ${C.borderPrimary}`, borderBottom: `1px solid ${C.borderPrimary}`, padding: "40px 0" }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: C.textBody, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Star /> Trusted by trade businesses answering every call, every time. <Star />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FINAL CTA                                                          */
/* ================================================================== */
function FinalCTA() {
  return (
    <section id="pilot" style={{ background: C.bgPrimary, padding: "160px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "100%", maxWidth: 1000, height: 600,
        background: "radial-gradient(circle, rgba(242,105,28,0.1), transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />
      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <motion.div
            style={{ display: "flex", justifyContent: "center", marginBottom: 24, transformOrigin: "bottom center" }}
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [-6, 6], y: [-3, 3] }}
              whileHover={{ scale: 1.14, rotate: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <DoodleThumbsUp style={{ filter: "drop-shadow(0 15px 25px rgba(242,105,28,0.25))" }} />
            </motion.div>
          </motion.div>
          <h2 className="fm-h2" style={{ fontSize: 56 }}>Ready to stop missing jobs?</h2>
          <div className="fm-hero-cta" style={{ justifyContent: "center", marginTop: 40 }}>
            <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary">
              Book your free pilot
            </MagneticButton>
            <motion.a href="#how" className="fm-btn fm-btn-ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              See how it works
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
  return (
    <footer style={{ background: C.footerBg, color: C.textBody, paddingTop: 80, position: "relative", overflow: "hidden" }}>
      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 80 }}>
          <div className="fm-footlinks" style={{ gap: 32 }}>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/sign-in">Sign in</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
      {/* Oversized low-opacity wordmark graphic */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", opacity: 0.04, pointerEvents: "none", userSelect: "none", padding: "0 24px 20px" }}>
        <svg viewBox="0 0 1000 200" style={{ width: "100%", height: "auto", maxWidth: "1400px", overflow: "visible" }} aria-hidden>
          <text x="50%" y="78%" textAnchor="middle" fill={C.textHeading} style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "190px", letterSpacing: "-0.04em" }}>
            FOREMAN
          </text>
        </svg>
      </div>
    </footer>
  );
}

/* ================================================================== */
/*  PERSISTENT WIDGET                                                  */
/* ================================================================== */
function PersistentWidget() {
  return (
    <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 90 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 999, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.3)", cursor: "pointer" }}
      >
        <motion.div
          animate={{ y: [-2, 2] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <DoodleSignalBars style={{ width: 24, height: 18 }} />
        </motion.div>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.textHeading, letterSpacing: 0.5 }}>Foreman Live</span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function Check({ o }: { o?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" stroke={C.accentOrange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon({ o }: { o?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" stroke={C.accentGreenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneOff() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M1 1l22 22M16.7 16.7A10.8 10.8 0 0112 18c-7 0-11-6-11-6a19.5 19.5 0 015.1-5.9m3.2-1.6A10.9 10.9 0 0112 4c7 0 11 6 11 6a19.4 19.4 0 01-2.2 3.2" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Clock({ o }: { o?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={C.accentOrange} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Dollar({ o }: { o?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
function Star() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" stroke={C.accentOrange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function Bolt() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z" stroke={C.accentOrange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Doodles                                                            */
/* ------------------------------------------------------------------ */
function DoodleArrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="40" height="40" viewBox="0 0 100 100" fill="none" aria-hidden>
      <path d="M10 90 Q 40 50 85 20 M 60 15 L 88 18 L 80 45" stroke={C.accentOrange} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DoodleCircle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="120" height="120" viewBox="0 0 100 100" fill="none" aria-hidden>
      <path d="M50,10 C75,12 92,30 88,55 C85,80 60,95 35,88 C10,82 5,55 15,30 C20,15 35,5 55,12" stroke={C.accentOrange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DoodleUnderline({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="100" height="20" viewBox="0 0 100 20" fill="none" aria-hidden>
      <path d="M5 15 Q 25 5 50 15 T 95 10" stroke={C.accentOrange} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function DoodleFace({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="32" height="32" viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="45" stroke={C.accentGreenText} strokeWidth="6" fill={C.bgPrimary} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="35" cy="40" r="4" fill={C.accentGreenText} />
      <circle cx="65" cy="40" r="4" fill={C.accentGreenText} />
      <path d="M35 65 Q 50 80 65 65" stroke={C.accentGreenText} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function StickerSparkle({ style, className }: { style?: React.CSSProperties, className?: string }) {
  return (
    <svg style={style} className={className} width="120" height="120" viewBox="0 0 100 100" fill="none">
      <path d="M50 5 L55 40 L90 45 L55 50 L50 85 L45 50 L10 45 L45 40 Z" fill={C.accentOrange} stroke="#FFF" strokeWidth="6" strokeLinejoin="round" />
      <path d="M20 15 L22 25 L32 27 L22 29 L20 39 L18 29 L8 27 L18 25 Z" fill={C.accentGreenText} stroke="#FFF" strokeWidth="4" strokeLinejoin="round" />
      <path d="M80 80 L81 87 L88 88 L81 89 L80 96 L79 89 L72 88 L79 87 Z" fill={C.accentGreenText} stroke="#FFF" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function StickerGraph({ style, className }: { style?: React.CSSProperties, className?: string }) {
  return (
    <svg style={style} className={className} width="120" height="120" viewBox="0 0 100 100" fill="none">
      <rect x="10" y="10" width="80" height="80" rx="20" fill={C.accentGreenBg} stroke="#FFF" strokeWidth="6" />
      <path d="M25 65 L45 45 L60 55 L80 30" stroke={C.accentOrange} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M80 30 L65 30 M80 30 L80 45" stroke={C.accentOrange} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StickerEye({ style, className }: { style?: React.CSSProperties, className?: string }) {
  return (
    <svg style={style} className={className} width="140" height="80" viewBox="0 0 100 60" fill="none">
      <path d="M10 30 Q 50 -10 90 30 Q 50 70 10 30 Z" fill={C.accentOrange} stroke="#FFF" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="50" cy="30" r="12" fill="#FFF" />
      <circle cx="50" cy="30" r="6" fill={C.bgPrimary} />
    </svg>
  );
}

/* ================================================================== */
/*  FAQ                                                                */
/* ================================================================== */
function FAQ() {
  const qa = [
    { q: "Is it a robot talking to my customers?", a: "It sounds like your best front-desk person, calm, clear, and to the point. It never wastes your customer's time, and it never sends anyone to voicemail. A great answered call beats a missed one every time." },
    { q: "How much does it really cost?", a: "$500 per month for the system, plus $50 each time we book you a real, paying job. During the pilot the base is free, so you only pay per booking and see it work with zero risk. One $1,500 install pays for 30 bookings." },
    { q: "I already have voicemail or an answering service.", a: "Voicemail loses about 80% of callers. Answering services just take a message and hand it back to you. Foreman actually qualifies the job and books it into your calendar. That is the difference between a note and a booked job." },
    { q: "How long does setup take?", a: "You are live in about 24 hours. No new hardware. We connect to your existing business number and Foreman starts answering right away." },
    { q: "What trades do you work with?", a: "HVAC, plumbing, electrical, roofing, garage doors, appliance repair, and other home-services trades. If your business runs on inbound calls, Foreman fits." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="fm-island" style={{ background: C.bgCard, padding: "96px 0", zIndex: 8 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead">
          <div className="fm-eyebrow">STRAIGHT ANSWERS</div>
          <h2 className="fm-h2">Questions, answered</h2>
        </Reveal>
        <div className="fm-faqlist">
          {qa.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div className="fm-faqitem" onClick={() => setOpen(isOpen ? null : i)}>
                  <div className="fm-faqq">
                    <span>{item.q}</span>
                    <motion.span className="fm-faqtog" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>+</motion.span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="fm-faqa">{item.a}</p>
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

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export function ForemanLanding() {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.6, smoothWheel: true }}>
      <main
        className="fm-landing"
        style={{
          fontFamily: "Inter, sans-serif",
          color: C.textHeading,
          background: C.navBg,
          overflowX: "hidden",
        }}
      >
        <Nav />
        <Hero />
        <TradeSelector />
        <StatComparison />
        <AnnotatedProof />
        <IntegrationsRow />
        <DispatchSection />
        <SocialProof />
        <FinalCTA />
        <FAQ />
        <Footer />
        <PersistentWidget />
      </main>
    </ReactLenis>
  );
}