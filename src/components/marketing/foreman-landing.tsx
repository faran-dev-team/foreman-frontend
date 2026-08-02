/* eslint-disable @next/next/no-img-element */
"use client";

export type LandingMode = "main" | "hvac" | "plumbing" | "restoration" | "property-management" | "electrical";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  useAnimationFrame,
  wrap,
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
  DoodleIntegrations,
  DoodleSunburst,
} from "./foreman-illustrations";

import { ForemanLogo, brand } from "@/lib/brand";

import "./foreman-landing.css";

const CALENDLY_LINK = CALENDLY_PILOT_URL;

const NAV_SECTIONS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
] as const;

/* ------------------------------------------------------------------ */
/*  Brand tokens (shared with owner dashboard via @/lib/brand)         */
/* ------------------------------------------------------------------ */
export const C = {
  navBg: "#8B96A6",
  bgPrimary: brand.carbon,
  bgCard: brand.carbonElevated,
  accentOrange: brand.orange,
  accentGreenText: brand.green,
  accentGreenBg: brand.greenBg,
  textBody: brand.textMuted,
  textHeading: "#FFFFFF",
  textEyebrow: brand.orange,
  borderPrimary: brand.border,
  footerBg: brand.carbonDeep,
};

/* ------------------------------------------------------------------ */
/*  Reusable: F-monogram logo                                          */
/* ------------------------------------------------------------------ */
export function Logo({
  size = 40,
  bg = C.accentOrange,
  fg = C.bgPrimary,
}: {
  size?: number;
  bg?: string;
  fg?: string;
}) {
  return <ForemanLogo size={size} bg={bg} fg={fg} />;
}

/* ------------------------------------------------------------------ */
/*  Reusable: scroll-reveal wrapper                                    */
/* ------------------------------------------------------------------ */
export function Reveal({
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
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: scroll-driven word-by-word text reveal                  */
/* ------------------------------------------------------------------ */
function ScrollWord({ word, range, progress }: { word: string; range: [number, number]; progress: any }) {
  const opacity = useTransform(progress, range, [0.15, 1.0]);
  return (
    <span style={{ position: "relative", display: "inline-block", marginRight: "0.28em" }}>
      <motion.span style={{ opacity }}>{word}</motion.span>
    </span>
  );
}

export function ScrollTextReveal({
  text,
  className,
  style,
  as: Component = "div",
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: any;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.40"],
  });

  const words = text.split(" ");

  return (
    <Component ref={containerRef} className={className} style={{ ...style, display: "inline-block" }}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <ScrollWord key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
      })}
    </Component>
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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
    rx.set(((y - height / 2) / height) * -8);
    ry.set(((x - width / 2) / width) * 8);
  }, [reducedMotion, mouseX, mouseY, rx, ry]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

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
      {renderDesktopItem ? renderDesktopItem("/dashboard", "Dashboard") : <Link href="/dashboard" className={className} onClick={onNavigate}>Dashboard</Link>}
    </>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const router = useRouter();

  const handleScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") || href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.startsWith("/#") ? href.slice(1) : href;
      if (targetId === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", targetId);
        closeMobile();
        return;
      }
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", targetId);
        closeMobile();
      } else {
        router.push("/" + targetId);
        closeMobile();
      }
    }
  }, [closeMobile, router]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
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
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)", transform: `scale(${scrolled ? 0.85 : 1})`, transformOrigin: "left center" }}><Logo size={38} /></div>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: 22, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
          </Link>
          <div className="fm-nav-desktop" onMouseLeave={() => setHoveredId(null)}>
            {NAV_SECTIONS.map((item) => (
              <a key={item.href} href={item.href} className="fm-navlink" onMouseEnter={() => setHoveredId(item.href)} onClick={(e) => handleScrollTo(e, item.href)} style={{ position: "relative", padding: "8px 16px" }}>
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
            <MagneticButton href={CALENDLY_LINK} className="fm-btn fm-btn-primary fm-nav-cta">Book a pilot call</MagneticButton>
          </div>
          <button type="button" className="fm-nav-toggle" aria-expanded={mobileOpen} aria-controls="fm-mobile-nav" onClick={() => setMobileOpen((open) => !open)}>
            <span className="sr-only">{mobileOpen ? "Close navigation menu" : "Open navigation menu"}</span>
            <NavMenuIcon open={mobileOpen} />
          </button>
        </div>
        <div id="fm-mobile-nav" className={`fm-nav-mobile${mobileOpen ? " fm-nav-mobile-open" : ""}`}>
          <div className="fm-wrap fm-nav-mobile-inner">
            {NAV_SECTIONS.map((item) => <a key={item.href} href={item.href} className="fm-nav-mobile-link" onClick={(e) => handleScrollTo(e, item.href)}>{item.label}</a>)}
            <NavAuthLinks className="fm-nav-mobile-link" onNavigate={closeMobile} />
            <a href={CALENDLY_LINK} className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={closeMobile}>Book a pilot call</a>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

/* ================================================================== */
/*  HERO                                                               */
/* ================================================================== */
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

export function MagneticButton({ children, href, className, target, rel, style }: { children: React.ReactNode, href: string, className?: string, target?: string, rel?: string, style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  const handleMouse = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  }, [reducedMotion]);
  const reset = useCallback(() => setPosition({ x: 0, y: 0 }), []);

  return (
    <motion.a
      ref={ref} href={href} target={target} rel={rel} className={className}
      animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse} onMouseLeave={reset}
      whileHover={reducedMotion ? {} : { scale: 1.04, boxShadow: "0 14px 38px rgba(242,105,28,0.38)" }} whileTap={{ scale: 0.97 }}
      style={{ position: "relative", ...style }}
    >
      {children}
    </motion.a>
  );
}

function CallCard() {
  const reducedMotion = useReducedMotion();
  const [activeRow, setActiveRow] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus>("ringing");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookedRows, setBookedRows] = useState<Set<number>>(new Set());

  // Orchestrate the workflow animation sequence
  useEffect(() => {
    if (reducedMotion) {
      setBookedRows(new Set([0, 1, 2]));
      setTotalRevenue(HERO_CALLS.reduce((s, c) => s + c.revenue, 0));
      return;
    }
    let cancelled = false;
    const sequence = async () => {
      // Stagger reveal each row with the full workflow
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
  }, [reducedMotion]);

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

function Hero({ mode = "main" }: { mode?: LandingMode }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const reducedMotion = useReducedMotion();
  const content = HERO_COPY[mode] || HERO_COPY.main;

  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <header id="top" ref={ref} style={{ background: C.bgPrimary, color: C.textHeading, padding: "60px 0 60px", position: "relative", overflow: "hidden" }}>
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
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="fm-hero-headline-link"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            style={{ position: "relative", display: "inline-block" }}
          >
            <h1 className="fm-h1" style={mode === "main" ? { fontFamily: '"Playfair Display", "Times New Roman", serif' } : {}}>
              {content.headline.map((line, i) => {
                const words = line.trim().split(" ");
                return (
                  <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.3em", marginBottom: "-0.3em" }}>
                    {words.map((w, wIdx) => (
                      <motion.span
                        key={wIdx}
                        style={{ display: "inline-block", marginRight: "0.28em", transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0, y: "100%", rotateX: reducedMotion ? 0 : -25, scale: 0.95 }}
                        animate={{ opacity: 1, y: "0%", rotateX: 0, scale: 1 }}
                        transition={{
                          duration: 0.95,
                          delay: 0.12 + (i * 0.15) + (wIdx * 0.08),
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        {w}
                      </motion.span>
                    ))}
                    {i === content.headline.length - 1 && (
                      <motion.span
                        initial={{ opacity: 0, y: "100%", scale: 0.85, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: "0%", scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.1, delay: 0.12 + (i * 0.15) + (words.length * 0.08), ease: [0.16, 1, 0.3, 1] }}
                        className="fm-serif-italic"
                        style={{
                          color: C.accentOrange,
                          WebkitTextFillColor: C.accentOrange,
                          position: "relative",
                          display: "inline-block",
                          filter: "drop-shadow(0 0 24px rgba(249,122,53,0.5))"
                        }}
                      >
                        {content.headlineItalic}
                      </motion.span>
                    )}
                  </span>
                );
              })}
            </h1>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="fm-headline-hover-badge-centered"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: cursorPos.x,
                    y: cursorPos.y,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.3 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    zIndex: 50,
                  }}
                >
                  <span>Request a Demo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </a>
          <motion.p className="fm-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            {content.sub}
          </motion.p>
          <motion.div className="fm-hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
            <MagneticButton href={CALENDLY_LINK} className="fm-btn fm-btn-primary">Book your free pilot</MagneticButton>
            <motion.a href="#how" className="fm-btn fm-btn-ghost" whileHover={reducedMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>See how it works</motion.a>
          </motion.div>
          <motion.div
            className="fm-hero-trust"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {["No monthly fee during pilot", "Pay only per booking", "Live in 24 hours"].map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88 + i * 0.08, duration: 0.45 }}
              >
                <Check /> {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/*  DASHBOARD PREVIEW (landing only — renders real DashboardOverview)  */
/* ================================================================== */

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      style={{
        background: brand.carbon,
        padding: "80px 0 96px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 450, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${brand.orange}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        {/* Eyebrow + headline */}
        <Reveal className="fm-sechead" style={{ marginBottom: 48, textAlign: "center", maxWidth: "100%" }}>
          <div className="fm-eyebrow">OWNER DASHBOARD</div>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            maxWidth: 750,
            margin: "0 auto 16px",
          }}>
            <ScrollTextReveal text="Your shop's performance, live in one place." as="span" />
          </h2>
          <div className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto" }}>
            <ScrollTextReveal text="Every call, booking, and dollar Foreman captures shows up here in real time." as="p" />
          </div>
        </Reveal>

        {/* Browser chrome frame */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            border: `1px solid ${brand.border}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Mac-style top bar */}
          <div style={{
            borderBottom: `1px solid ${brand.border}`,
            padding: "11px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(5,8,15,0.9)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#F87171", flexShrink: 0 }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FBBF24", flexShrink: 0 }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#34D399", flexShrink: 0 }} />
            <div style={{ flex: 1, margin: "0 16px", height: 24, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", letterSpacing: "0.03em" }}>app.foreman.ai / dashboard</span>
            </div>
            <div style={{ width: 36, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
          </div>

          {/* App layout: sidebar + main */}
          <div style={{ display: "flex", background: "#F4F6F9", maxHeight: 640, overflow: "hidden" }}>
            {/* Sidebar (matches real dashboard-shell.tsx sidebar) */}
            <div style={{
              width: 256, flexShrink: 0,
              background: brand.carbon,
              borderRight: `1px solid ${brand.border}`,
              display: "flex", flexDirection: "column",
            }}>
              {/* Logo */}
              <div style={{ padding: "18px 20px 16px", borderBottom: `1px solid ${brand.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: brand.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                    <rect x="30" y="26" width="16" height="52" rx="2.5" fill={brand.carbon} />
                    <rect x="30" y="26" width="44" height="16" rx="2.5" fill={brand.carbon} />
                    <rect x="30" y="49" width="32" height="14" rx="2.5" fill={brand.carbon} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: brand.orange, textTransform: "uppercase" }}>Foreman</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Owner Dashboard</div>
                </div>
              </div>
              {/* Nav items */}
              <div style={{ padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { label: "Dashboard", active: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
                  { label: "Calls", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> },
                  { label: "Jobs", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
                  { label: "Reports", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
                  { label: "Settings", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8,
                    background: item.active ? `${brand.orange}20` : "transparent",
                    color: item.active ? brand.orange : brand.textMuted,
                    fontSize: 13, fontWeight: item.active ? 600 : 400,
                    cursor: "default",
                  }}>
                    <span style={{ color: item.active ? brand.orange : brand.textMuted }}>{item.icon}</span>
                    {item.label}
                    {item.active && <div style={{ width: 3, height: 18, borderRadius: 2, background: brand.orange, marginLeft: "auto" }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard content — render the REAL component */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              {/* Top header bar (matches dashboard-shell.tsx header) */}
              <div style={{
                position: "sticky", top: 0, zIndex: 10,
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 32px",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(203,213,225,0.8)",
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: brand.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 100 100" fill="none">
                    <rect x="30" y="26" width="16" height="52" rx="2.5" fill={brand.carbon} />
                    <rect x="30" y="26" width="44" height="16" rx="2.5" fill={brand.carbon} />
                    <rect x="30" y="49" width="32" height="14" rx="2.5" fill={brand.carbon} />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: "#64748B" }}>Foreman Launch+ · Owner portal</span>
                {/* Notification bell */}
                <div style={{ marginLeft: "auto", width: 32, height: 32, borderRadius: 8, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
              </div>

              {/* Actual DashboardOverview rendered inside */}
              <div style={{ padding: "28px 32px" }}>
                <DashboardOverview preview />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: brand.textMuted }}
        >
          Real-time owner dashboard · calls, bookings, and revenue in one view
        </motion.p>
      </div>
    </section>
  );
}
/*  TRADE SELECTOR ROW                                                 */
/* ================================================================== */
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

const NICHE_DETAILS: Record<string, { problemHeadline: string, problemBody: string, features: string[], ctaText: string }> = {
  hvac: {
    problemHeadline: "You can't answer with your hands in a furnace.",
    problemBody: "In a heat wave the calls never stop, and neither do the missed ones. Foreman answers every time, gives a price range, and books it straight into your calendar.",
    features: ["Detects emergencies like 'no cooling'", "Gives price ranges without over-committing", "Texts back missed callers instantly"],
    ctaText: "Book your free HVAC pilot"
  },
  plumbing: {
    problemHeadline: "You're under a sink, not by the phone.",
    problemBody: "Burst pipes and backups hit at 2 AM. Whoever answers wins the job. Foreman catches every call so nothing slips away.",
    features: ["Emergency triage for floods & burst pipes", "Prices leaks, clogs, and water heaters", "24/7 bilingual coverage"],
    ctaText: "Book your free plumbing pilot"
  },
  electrical: {
    problemHeadline: "First to answer wins the job.",
    problemBody: "When a homeowner has no power, they don't leave a voicemail. Foreman answers every call, qualifies the issue, and books the job.",
    features: ["Prioritizes outages and sparking panels", "Prices panel upgrades and troubleshooting", "Instant alerts on dangerous jobs"],
    ctaText: "Book your free electrical pilot"
  },
  restoration: {
    problemHeadline: "A missed call is a five-figure loss.",
    problemBody: "Water and fire jobs go to whoever picks up first. Miss the call and a huge job is gone. Foreman answers when no one is at the desk.",
    features: ["Instant answer on every emergency", "Immediate alerts on major water/fire jobs", "Gathers insurance-relevant info"],
    ctaText: "Book your free restoration pilot"
  },
  "property-management": {
    problemHeadline: "Hundreds of units. Endless calls.",
    problemBody: "Every leak, lockout, and broken AC is a call. Foreman answers every one, triages routine from emergency, and books the work order.",
    features: ["White-labeled with your brand & voice", "Smart triage based on your rules", "Portfolio-wide call dashboard"],
    ctaText: "Book a white-label demo"
  },
  roofing: {
    problemHeadline: "Missing shingles means massive volume.",
    problemBody: "After a storm, your phone rings off the hook. Voicemail loses callers to the next roofer. Foreman captures every single lead.",
    features: ["Handles storm-surge call volume", "Qualifies insurance vs out-of-pocket", "Books inspections directly"],
    ctaText: "Book your free roofing pilot"
  },
  pest: {
    problemHeadline: "Pests don't wait, and neither do callers.",
    problemBody: "When a homeowner sees a termite, they want help immediately. Foreman answers instantly and schedules the treatment.",
    features: ["Qualifies the type of pest problem", "Prices standard treatments", "Books the initial inspection"],
    ctaText: "Book your free pest pilot"
  },
  garage: {
    problemHeadline: "A trapped car is an emergency.",
    problemBody: "When a spring breaks, the customer needs it fixed now. Foreman catches every panic call and dispatches your tech.",
    features: ["Emergency triage for trapped cars", "Prices spring and opener repairs", "Instant booking and confirmation"],
    ctaText: "Book your free garage pilot"
  },
  "law-firm": {
    problemHeadline: "Never lose a high-value case to a missed call.",
    problemBody: "A single missed intake can mean a significant lost case. Foreman answers 24/7, qualifies the matter against your criteria, and books the consultation.",
    features: ["24/7 Intake Answering", "Case Qualification", "Consultation Booking"],
    ctaText: "Book your free law firm pilot"
  }
};

const tradeIconMap: Record<string, React.ReactNode> = {
  hvac: <img src="/images/hvac.png" alt="HVAC" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  plumbing: <img src="/images/plumber.png" alt="Plumbing" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  electrical: <img src="/images/electrician.png" alt="Electrical" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  roofing: <img src="/images/roofing (2).png" alt="Roofing" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  pest: <img src="/images/pest.png" alt="Pest Control" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  garage: <img src="/images/garage.png" alt="Garage Door" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  restoration: <img src="/images/restoration.png" alt="Restoration" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  "property-management": <img src="/images/property.png" alt="Property Management" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
  "law-firm": <img src="/images/property.png" alt="Law Firms" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
};

export function TradeSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const activeTrade = TRADES[activeIndex];
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRADES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "28px 0 56px", zIndex: 3 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 40, maxWidth: "100%" }}>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading
          }}>
            <ScrollTextReveal text="Knows your trade. Asks the right questions. Books the job." as="span" />
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
            <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary fm-cta-banner-btn">
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
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  STAT COMPARISON BLOCK                                              */
/* ================================================================== */
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

function StatComparison({ mode = "main" }: { mode?: LandingMode }) {
  const reducedMotion = useReducedMotion();
  const pCopy = PROBLEM_COPY[mode] || PROBLEM_COPY.main;

  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "28px 0", zIndex: 4, overflow: "hidden" }}>

      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 64, maxWidth: 900 }}>
          <div className="fm-eyebrow">{pCopy.eyebrow}</div>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 4.8vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            marginBottom: 20
          }}>
            <ScrollTextReveal text={pCopy.headline} as="span" />
          </h2>
          <div className="fm-secsub" style={{ maxWidth: 700, margin: "0 auto" }}>
            <ScrollTextReveal text={pCopy.body} as="p" />
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch", maxWidth: 1000, margin: "0 auto" }}>
          <Reveal style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 16, color: C.textBody, fontWeight: 600, marginBottom: 12 }}>Missed calls without Foreman:</div>
              <div className="fm-statnum" style={{ color: C.textBody }}>40%</div>
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.accentOrange, borderRadius: 28, padding: 48, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div style={{ fontSize: 16, color: C.bgPrimary, fontWeight: 600, marginBottom: 12 }}>Missed calls:</div>
              <div className="fm-statnum" style={{ color: C.bgPrimary, position: "relative", display: "inline-block" }}>
                0%
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", width: "170%", height: "170%", pointerEvents: "none" }}
                >
                  <DoodleCircle style={{ width: "100%", height: "100%" }} />
                </motion.div>
              </div>
            </div>
            {!reducedMotion && (
              <div
                className="fm-zero-img"
                style={{ position: "absolute", zIndex: 3, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}
              >
                <img src="/images/zero.png" alt="Zero" loading="lazy" decoding="async" style={{ width: "100%", height: "auto" }} />
              </div>
            )}
          </Reveal>
        </div>


      </div>

      {/* Optional faint scrolling ribbon */}
      <motion.div
        aria-hidden
        style={{
          marginTop: 16,
          whiteSpace: "nowrap", fontSize: "clamp(60px, 15vw, 160px)", fontWeight: 900,
          color: "rgba(255,255,255,0.02)", pointerEvents: "none"
        }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        ANSWERED QUALIFIED BOOKED ANSWERED QUALIFIED BOOKED
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/*  ANNOTATED PROOF SECTION                                            */
/* ================================================================== */
const PROOF_COPY: Record<LandingMode, { eyebrow: string; headline: string; sub: string }> = {
  main: { eyebrow: "MISSED CALL TO BOOKED JOB IN UNDER A MINUTE", headline: "1. Answers. 2. Qualifies. 3. Books.", sub: "Foreman doesn't just take messages. It qualifies the caller and puts them on your schedule." },
  hvac: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for HVAC", sub: "Answers instantly, qualifies and prices the job, then books and confirms." },
  plumbing: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for plumbing", sub: "Answers instantly, qualifies the job and flags emergencies, then books and confirms." },
  electrical: { eyebrow: "MISSED CALL TO BOOKED JOB", headline: "How Foreman works for electrical", sub: "Answers instantly, qualifies the job and flags emergencies like sparking panels, then books and confirms." },
  restoration: { eyebrow: "EMERGENCY CALL TO BOOKED ASSESSMENT", headline: "How Foreman works for restoration", sub: "Answers instantly, captures details and triages the emergency, then books and alerts your team." },
  "property-management": { eyebrow: "TENANT CALL TO HANDLED WORK ORDER", headline: "How Foreman works for property management", sub: "Answers every call, triages the issue based on your escalation rules, then books or dispatches." }
};

function AnnotatedProof({ mode = "main" }: { mode?: LandingMode }) {
  const pCopy = PROOF_COPY[mode] || PROOF_COPY.main;
  return (
    <section className="fm-island" style={{ position: "relative", background: C.bgCard, padding: "36px 0", zIndex: 5 }}>
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
              <ScrollTextReveal text={pCopy.headline} as="span" />
            </h2>
          </div>
          <div className="fm-secsub">
            <ScrollTextReveal text={pCopy.sub} as="p" />
          </div>
        </Reveal>

        <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto", padding: "40px 0" }}>
          {/* Central Animated Timeline Line */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "rgba(255,255,255,0.05)", transform: "translateX(-50%)", zIndex: 0 }}>
            <motion.div
              style={{ width: "100%", height: 120, background: `linear-gradient(to bottom, transparent, ${C.accentOrange}, transparent)` }}
              animate={{ y: [-100, 1000] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Step 1: Answers */}
          <div className="fm-timeline-row left">
            <Reveal className="fm-timeline-content" style={{ position: "relative" }}>
              <div className="fm-callcard fm-hoverlift" style={{ background: `${C.accentOrange}15`, border: `1px solid ${C.accentOrange}30` }}>
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
                <motion.div animate={{ y: [-5, 5] }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
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
                <motion.div animate={{ y: [-5, 5] }} transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}>
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
                  <div className="fm-callic" style={{ background: "transparent" }}><DoodleFace /></div>
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
                <motion.div animate={{ y: [-5, 5] }} transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}>
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

/* ================================================================== */
/*  INTEGRATIONS ROW                                                   */
/* ================================================================== */
function IntegrationsRow() {
  const reducedMotion = useReducedMotion();
  const logos = [
    { name: "Google Calendar", iconUrl: "https://cdn.simpleicons.org/googlecalendar" },
    { name: "ServiceTitan", iconUrl: "https://www.google.com/s2/favicons?sz=64&domain=servicetitan.com" },
    { name: "Jobber", iconUrl: "https://www.google.com/s2/favicons?sz=64&domain=getjobber.com" },
    { name: "QuickBooks", iconUrl: "https://cdn.simpleicons.org/quickbooks" },
    { name: "Twilio", iconUrl: "https://www.twilio.com/favicon.ico" }
  ];
  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "48px 0", zIndex: 6, overflow: "hidden" }}>
      <div style={{ textAlign: "center" }}>
        <Reveal style={{ position: "relative" }}>
          <style dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:wght@400;700&display=swap');
            
            @keyframes fm-roller {
              0% { offset-distance: 0%; }
              100% { offset-distance: 100%; }
            }
            .fm-roller-pill {
              position: absolute;
              top: 0; left: 0;
              offset-rotate: auto;
              animation: fm-roller 25s linear infinite;
            }
            .fm-roller-track {
              position: relative;
              height: 250px;
              width: 100%;
              margin: 0 auto;
              overflow: hidden;
              z-index: 1;
            }
          `}} />

          <div style={{ marginBottom: 64, position: "relative" }}>
            <h2 style={{
              fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: C.textHeading,
              position: "relative",
              display: "inline-block"
            }}>
              <span className="fm-sunburst-wrapper">
                <DoodleSunburst />
              </span>
              <ScrollTextReveal text="Plays nice with your tools" as="span" />
            </h2>
          </div>

          <div className="fm-roller-track">
            {[...logos, ...logos, ...logos, ...logos].map((logo, i, arr) => (
              <div
                key={i}
                className="fm-logopill fm-roller-pill"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.borderPrimary}`,
                  borderRadius: 999,
                  padding: "14px 30px",
                  color: C.textHeading,
                  fontWeight: 600,
                  fontSize: 17,
                  whiteSpace: "nowrap",
                  offsetPath: "path('M -200 125 C 50 65, 450 185, 800 125 C 1050 65, 1450 185, 1800 125 C 2050 65, 2450 185, 2800 125 C 3050 65, 3450 185, 3800 125 C 4050 65, 4450 185, 4800 125')",
                  animationDelay: `-${i * (25 / arr.length)}s`,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",

                  boxSizing: "border-box"
                }}
              >
                <img src={logo.iconUrl} alt={logo.name} width="24" height="24" loading="lazy" decoding="async" style={{ display: "block", borderRadius: "4px" }} />
                <span>{logo.name}</span>
              </div>
            ))}
          </div>

          {!reducedMotion && (
            <div className="fm-integration-illustration" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", zIndex: 0 }}>
              <motion.div
                style={{ width: 320, opacity: 0.9, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))" }}
                animate={{ y: [-8, 8] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <DoodleIntegrations style={{ width: "100%", height: "auto" }} />
              </motion.div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}


/* ================================================================== */
/*  ADVANCED FEATURES GRID                                             */
/* ================================================================== */
const FEATURES_COPY: Record<LandingMode, { eyebrow: string; headline: string; feats: { title: string, desc: string, icon: any }[] }> = {
  main: {
    eyebrow: "NOT ANOTHER ANSWERING SERVICE", headline: "A full front office, not a voicemail box.",
    feats: [
      { title: "Speaks English and Spanish", desc: "Serves your entire customer base automatically, no callers lost to a language barrier.", icon: <Globe /> },
      { title: "Detects emergencies", desc: "Flags 'no heat,' 'flooding,' 'gas smell' and prioritizes them with instant alerts.", icon: <Bolt /> },
      { title: "Texts back missed callers", desc: "If someone hangs up before booking, Foreman sends them a booking link in seconds.", icon: <MessageSquare /> },
      { title: "You listen live and take over", desc: "Jump into any call from your phone. You are always in control of your front desk.", icon: <Headphones /> },
      { title: "Shows you the money", desc: "A live dashboard of exactly how much revenue Foreman captured that you would have lost.", icon: <Dollar /> },
      { title: "Grows your reviews", desc: "After each job, it asks happy customers for a 5-star review, so more calls come in.", icon: <Star /> }
    ]
  },
  hvac: {
    eyebrow: "NOT ANOTHER ANSWERING SERVICE", headline: "A full front office, tuned for HVAC.",
    feats: [
      { title: "Detects emergencies", desc: "'No cooling' in a heat wave or 'no heat' in winter gets prioritized, with instant alerts.", icon: <Bolt /> },
      { title: "Prices the job", desc: "Gives ranges for tune-ups, repairs, and installs without over-committing to an exact quote.", icon: <Dollar /> },
      { title: "Speaks English and Spanish", desc: "Never lose a caller to a language barrier.", icon: <Globe /> },
      { title: "Texts back missed callers", desc: "If someone hangs up before booking, Foreman sends a booking link in seconds.", icon: <MessageSquare /> },
      { title: "Shows you the money", desc: "A live dashboard of the exact revenue Foreman captured that you would have lost.", icon: <Dollar /> },
      { title: "Grows your reviews", desc: "After each job, it asks happy customers for a 5-star review, so more calls come in.", icon: <Star /> },
      { title: "You stay in control", desc: "Listen to any call live and take over from your phone, anytime.", icon: <Headphones /> }
    ]
  },
  plumbing: {
    eyebrow: "NOT ANOTHER ANSWERING SERVICE", headline: "A full front office, tuned for plumbing.",
    feats: [
      { title: "Emergency triage", desc: "Floods, burst pipes, and no-water calls get prioritized, with instant owner alerts on big jobs.", icon: <Bolt /> },
      { title: "Prices the job", desc: "Ranges for leaks, clogs, water heaters, and installs without over-committing.", icon: <Dollar /> },
      { title: "Speaks English and Spanish", desc: "Never lose a caller to a language barrier.", icon: <Globe /> },
      { title: "Texts back missed callers", desc: "Sends a booking link to anyone who couldn't get through.", icon: <MessageSquare /> },
      { title: "Shows you the money", desc: "A live dashboard of the revenue Foreman captured for you.", icon: <Dollar /> },
      { title: "Grows your reviews", desc: "Asks happy customers for a 5-star review after each job.", icon: <Star /> },
      { title: "You stay in control", desc: "Listen live and take over any call from your phone.", icon: <Headphones /> }
    ]
  },
  restoration: {
    eyebrow: "NOT ANOTHER ANSWERING SERVICE", headline: "A full front office, built for speed.",
    feats: [
      { title: "Built to be first", desc: "Instant answer on every emergency, day or night. The fastest response wins the job, and Foreman never misses.", icon: <Bolt /> },
      { title: "Emergency-first handling", desc: "Immediate owner alerts on major water and fire jobs.", icon: <Headphones /> },
      { title: "Captures the details", desc: "Gathers insurance-relevant information up front.", icon: <Globe /> },
      { title: "Texts back missed callers", desc: "Sends a link to anyone who couldn't get through.", icon: <MessageSquare /> },
      { title: "Speaks English and Spanish", desc: "Serves your entire service area.", icon: <Globe /> },
      { title: "Shows you the money", desc: "A dashboard of every emergency captured and its value.", icon: <Dollar /> }
    ]
  },
  electrical: {
    eyebrow: "NOT ANOTHER ANSWERING SERVICE", headline: "A full front office, tuned for electrical.",
    feats: [
      { title: "Emergency triage", desc: "Outages and sparking panels get prioritized, with instant owner alerts on dangerous jobs.", icon: <Bolt /> },
      { title: "Prices the job", desc: "Ranges for panel upgrades, EV chargers, and troubleshooting without over-committing.", icon: <Dollar /> },
      { title: "Speaks English and Spanish", desc: "Never lose a caller to a language barrier.", icon: <Globe /> },
      { title: "Texts back missed callers", desc: "Sends a booking link to anyone who couldn't get through.", icon: <MessageSquare /> },
      { title: "Shows you the money", desc: "A live dashboard of the revenue Foreman captured for you.", icon: <Dollar /> },
      { title: "Grows your reviews", desc: "Asks happy customers for a 5-star review after each job.", icon: <Star /> },
      { title: "You stay in control", desc: "Listen live and take over any call from your phone.", icon: <Headphones /> }
    ]
  },
  "property-management": {
    eyebrow: "BUILT FOR PORTFOLIOS", headline: "A white-label front office for your whole portfolio.",
    feats: [
      { title: "Handles high volume", desc: "Answers every call across every unit and property, no matter how many come in at once.", icon: <MessageSquare /> },
      { title: "Smart triage", desc: "Routine vs emergency, using rules you set. Urgent issues get dispatched immediately.", icon: <Bolt /> },
      { title: "Fully white-labeled", desc: "Your brand, your number, your voice. Tenants never know it's us.", icon: <Globe /> },
      { title: "Custom-trained", desc: "Built on your properties, policies, vendors, and escalation paths.", icon: <Headphones /> },
      { title: "Portfolio-wide dashboard", desc: "Every call answered, categorized, and logged in one place.", icon: <Dollar /> },
      { title: "Bilingual", desc: "Serves your entire tenant base in English and Spanish.", icon: <Globe /> }
    ]
  }
};

function FeatureGraphicWidget({ title }: { title: string }) {
  const t = title.toLowerCase();
  const reducedMotion = useReducedMotion();

  // 1. Bilingual Support Animation
  if (t.includes("english") || t.includes("spanish") || t.includes("bilingual")) {
    const [langIndex, setLangIndex] = useState(0);
    const phrases = [
      { lang: "ES", text: "“Hola, mi aire acondicionado echa aire caliente. ¿Tienen servicio de emergencia hoy?”" },
      { lang: "EN", text: "“Hello, my AC is blowing warm air. Do you have emergency repair technicians today?”" }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setLangIndex((prev) => (prev + 1) % phrases.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

    const current = phrases[langIndex];

    return (
      <div style={{
        marginTop: 12,
        padding: "16px 18px",
        borderRadius: 16,
        background: "rgba(15, 23, 42, 0.85)",
        border: `1px solid ${C.accentOrange}60`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 124,
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8,
              background: current.lang === "EN" ? C.accentOrange : "rgba(255,255,255,0.08)",
              color: "#FFFFFF", transition: "all 300ms ease"
            }}>EN</span>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8,
              background: current.lang === "ES" ? C.accentOrange : "rgba(255,255,255,0.08)",
              color: "#FFFFFF", transition: "all 300ms ease"
            }}>ES</span>
          </div>
          {/* Animated voice soundwave */}
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {[10, 18, 12, 22, 14, 8].map((h, idx) => (
              <motion.span
                key={idx}
                animate={reducedMotion ? {} : { height: [6, h, 6] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.1, repeatType: "reverse" }}
                style={{ width: 3, borderRadius: 3, background: C.accentOrange }}
              />
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.lang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            style={{ fontSize: 13, fontStyle: "italic", color: "#F8FAFC", background: "rgba(255,255,255,0.06)", padding: "12px", borderRadius: 10, borderLeft: `3px solid ${C.accentOrange}` }}
          >
            {current.text}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 2. Emergency Detection Siren & Triage Animation
  if (t.includes("emergenc") || t.includes("triage") || t.includes("first")) {
    const [alertIndex, setAlertIndex] = useState(0);
    const alerts = [
      { label: "NO HEAT IN WINTER", status: "Priority #1 Dispatch", icon: "🔥", code: "CRIT-01", tag: "FREEZE RISK" },
      { label: "GAS SMELL IN BASEMENT", status: "Priority #1 Dispatch", icon: "⚠️", code: "HAZ-99", tag: "HAZMAT LEAK" },
      { label: "BURST PIPE / FLOODING", status: "Priority #1 Dispatch", icon: "🌊", code: "EMRG-04", tag: "WATER DAMAGE" }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setAlertIndex((prev) => (prev + 1) % alerts.length);
      }, 2800);
      return () => clearInterval(interval);
    }, []);

    const activeAlert = alerts[alertIndex];

    return (
      <div style={{
        marginTop: 12,
        padding: "16px 18px",
        borderRadius: 18,
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(153, 27, 27, 0.12) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(239, 68, 68, 0.65)",
        boxShadow: "0 12px 32px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 140,
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle animated laser sweep across top */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: 2,
            background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
            opacity: 0.8
          }}
        />

        {/* Header Bar with Pulsing Beacon & High-Tech Pill */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Multi-ring Siren Radar Pulse */}
            <div style={{ position: "relative", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.span
                animate={reducedMotion ? {} : { scale: [1, 2.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1px solid #EF4444",
                  pointerEvents: "none"
                }}
              />
              <motion.span
                animate={reducedMotion ? {} : { scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #FF6B6B 0%, #EF4444 100%)",
                  boxShadow: "0 0 12px #EF4444, 0 0 4px #FCA5A5"
                }}
              />
            </div>

            <span className="fm-mono" style={{ fontSize: 11, fontWeight: 900, color: "#FCA5A5", letterSpacing: 1.2, textTransform: "uppercase" }}>
              EMERGENCY TRIAGE SIREN
            </span>
          </div>

          <motion.div
            animate={reducedMotion ? {} : { scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.5,
              color: "#FFFFFF",
              background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
              padding: "4px 10px",
              borderRadius: 20,
              border: "1px solid rgba(254, 202, 202, 0.4)",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            <span style={{ fontSize: 10 }}>⚡</span> 0.1s INSTANT
          </motion.div>
        </div>

        {/* Dynamic Alert Banner with 3D Glass Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAlert.code}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(239, 68, 68, 0.45)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Glowing Alarm Icon Box */}
                <motion.div
                  animate={reducedMotion ? {} : { rotate: [-4, 4, -4], scale: [1, 1.08, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(239,68,68,0.4) 0%, rgba(185,28,28,0.2) 100%)",
                    border: "1px solid rgba(239,68,68,0.7)",
                    boxShadow: "0 0 14px rgba(239,68,68,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16
                  }}
                >
                  🚨
                </motion.div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="fm-mono" style={{ fontSize: 9, fontWeight: 900, color: "#EF4444", background: "rgba(239,68,68,0.2)", padding: "1px 5px", borderRadius: 4, border: "1px solid rgba(239,68,68,0.4)" }}>
                      {activeAlert.code}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#FCA5A5", textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {activeAlert.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#FFFFFF", marginTop: 2, letterSpacing: "-0.01em" }}>
                    {activeAlert.icon} {activeAlert.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Action dispatch status footer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11,
              background: "rgba(0, 0, 0, 0.4)",
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.08)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#F8FAFC" }}>
                <span style={{ color: "#FCA5A5", fontWeight: 800 }}>Action:</span>
                <span style={{ color: "#EF4444", fontWeight: 900 }}>{activeAlert.status}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#4ADE80", fontWeight: 800, fontSize: 10 }}>
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3], x: [0, 2, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ display: "inline-block" }}
                >
                  📲 ➔
                </motion.span>
                Owner Alerted
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 3. Texts back missed callers (Live SMS Typing & Delivery)
  if (t.includes("text") || t.includes("missed") || t.includes("volume")) {
    const [step, setStep] = useState<"CALL" | "TYPING" | "SENT">("CALL");

    useEffect(() => {
      const timer1 = setTimeout(() => setStep("TYPING"), 1000);
      const timer2 = setTimeout(() => setStep("SENT"), 2500);
      const timer3 = setTimeout(() => setStep("CALL"), 5500);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, [step]);

    return (
      <div style={{
        marginTop: 12,
        padding: "16px 18px",
        borderRadius: 16,
        background: "rgba(59, 130, 246, 0.15)",
        border: "1px solid rgba(59, 130, 246, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 124,
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#93C5FD" }}>💬 AUTO-SMS RECOVERY</span>
          {step === "SENT" && <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 800 }}>Delivered ✓✓</span>}
        </div>
        <AnimatePresence mode="wait">
          {step === "CALL" && (
            <motion.div key="call" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#F8FAFC", background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>📞</motion.span>
              <span>Caller hung up before booking...</span>
            </motion.div>
          )}
          {step === "TYPING" && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#93C5FD", background: "rgba(0,0,0,0.3)", padding: "8px 10px", borderRadius: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span>Foreman SMS Bot typing</span>
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.6 }}>• • •</motion.span>
            </motion.div>
          )}
          {step === "SENT" && (
            <motion.div key="sent" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#FFFFFF", background: "rgba(15, 23, 42, 0.85)", padding: "10px 12px", borderRadius: 10, borderLeft: `3px solid ${C.accentOrange}` }}>
              📲 “Hi! Sorry we missed your call. Tap here to book emergency repair: foreman.app/b/hvac”
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 4. Live Audio & Control (Dancing Equalizer & Call Waveform)
  if (t.includes("listen") || t.includes("control") || t.includes("trained") || t.includes("details")) {
    return (
      <div style={{
        marginTop: 12,
        padding: "16px 18px",
        borderRadius: 16,
        background: "rgba(16, 185, 129, 0.15)",
        border: "1px solid rgba(16, 185, 129, 0.4)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 124,
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#6EE7B7", display: "flex", alignItems: "center", gap: 6 }}>
            <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            LIVE AUDIO STREAM
          </span>
          <span style={{ fontSize: 10, color: "#A7F3D0", fontWeight: 800 }}>01:42 LIVE</span>
        </div>
        {/* Dancing 10-bar equalizer */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "center", height: 28, background: "rgba(0,0,0,0.3)", padding: "4px 12px", borderRadius: 8 }}>
          {[14, 24, 10, 28, 18, 22, 12, 26, 16, 20].map((h, idx) => (
            <motion.span
              key={idx}
              animate={reducedMotion ? {} : { height: [4, h, 4] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.08, repeatType: "reverse" }}
              style={{ width: 4, borderRadius: 4, background: "#10B981" }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <div style={{ flex: 1, fontSize: 11, fontWeight: 800, background: "rgba(16,185,129,0.3)", color: "#A7F3D0", padding: "6px", borderRadius: 8, textAlign: "center" }}>
            🎧 Listening Live
          </div>
          <div style={{ flex: 1, fontSize: 11, fontWeight: 800, background: C.accentOrange, color: "#FFFFFF", padding: "6px", borderRadius: 8, textAlign: "center", boxShadow: "0 4px 12px rgba(249,122,53,0.4)" }}>
            ⚡ Take Over
          </div>
        </div>
      </div>
    );
  }

  // 5. Dynamic Money Counter & Gradual Growth Bar Animation
  if (t.includes("money") || t.includes("dashboard") || t.includes("price")) {
    const [val, setVal] = useState(1400);
    const [activeBarCount, setActiveBarCount] = useState(1);

    useEffect(() => {
      const interval = setInterval(() => {
        setVal((prev) => {
          if (prev >= 28400) {
            setActiveBarCount(1);
            return 1400;
          }
          const nextVal = prev + Math.floor(Math.random() * 2000 + 1500);
          const nextBars = Math.min(7, Math.ceil((nextVal / 28400) * 7));
          setActiveBarCount(nextBars);
          return nextVal;
        });
      }, 1200); // Smooth gradual 1.2s growth pace
      return () => clearInterval(interval);
    }, []);

    const basePcts = [30, 42, 55, 68, 78, 90, 100];

    return (
      <div style={{
        marginTop: 12,
        padding: "16px 18px",
        borderRadius: 16,
        background: "rgba(249, 122, 53, 0.15)",
        border: `1px solid ${C.accentOrange}60`,
        boxShadow: `0 0 25px ${C.accentOrange}30`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 124,
        justifyContent: "center"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 800 }}>REVENUE CAPTURED</div>
            <motion.div
              key={val}
              initial={{ opacity: 0.6, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" }}
            >
              +${val.toLocaleString()}
            </motion.div>
          </div>
          <motion.div
            key={`pill-${val}`}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ fontSize: 11, fontWeight: 800, color: C.accentOrange, background: "rgba(249,122,53,0.25)", padding: "6px 12px", borderRadius: 20, border: `1px solid ${C.accentOrange}60`, boxShadow: `0 0 12px ${C.accentOrange}30` }}
          >
            ▲ +{activeBarCount * 6}% Jobs
          </motion.div>
        </div>

        {/* Gradual Smooth Bar Growth */}
        <div style={{ position: "relative", height: 36, display: "flex", alignItems: "flex-end", gap: 5, padding: "0 4px" }}>
          {basePcts.map((pct, idx) => {
            const isLit = idx < activeBarCount;
            const isLeadingBar = idx === activeBarCount - 1;

            return (
              <div key={idx} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                <motion.div
                  animate={{
                    height: isLit ? `${pct}%` : "12%",
                    opacity: isLit ? 1 : 0.18
                  }}
                  transition={{
                    height: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.6, ease: "easeInOut" }
                  }}
                  style={{
                    width: "100%",
                    borderRadius: 4,
                    background: isLeadingBar
                      ? `linear-gradient(180deg, #FF9D54 0%, ${C.accentOrange} 100%)`
                      : isLit
                        ? `linear-gradient(180deg, ${C.accentOrange} 0%, rgba(249,122,53,0.4) 100%)`
                        : "rgba(255,255,255,0.08)",
                    boxShadow: isLeadingBar
                      ? `0 0 12px ${C.accentOrange}A0`
                      : isLit
                        ? `0 0 6px ${C.accentOrange}40`
                        : "none"
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 6. Grows your reviews (Interactive 5-Star Engine & Review Pop-in)
  const [starsCount, setStarsCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setStarsCount((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      marginTop: 12,
      padding: "16px 18px",
      borderRadius: 16,
      background: "rgba(250, 204, 21, 0.12)",
      border: "1px solid rgba(250, 204, 21, 0.5)",
      boxShadow: "0 8px 24px rgba(250, 204, 21, 0.15)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: 124,
      justifyContent: "center"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((s) => {
            const isLit = s <= starsCount;
            return (
              <motion.span
                key={s}
                animate={isLit ? { scale: [0.7, 1.3, 1], opacity: 1 } : { scale: 1, opacity: 0.2 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: 18,
                  color: isLit ? "#FACC15" : "#94A3B8",
                  filter: isLit ? "drop-shadow(0 0 6px rgba(250,204,21,0.8))" : "none",
                  display: "inline-block"
                }}
              >
                ★
              </motion.span>
            );
          })}
        </div>
        <motion.span
          key={starsCount}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: 10, fontWeight: 900, color: "#FACC15", background: "rgba(250,204,21,0.2)", border: "1px solid rgba(250,204,21,0.4)", padding: "3px 9px", borderRadius: 999 }}
        >
          {starsCount}.0 STAR RATING
        </motion.span>
      </div>

      <AnimatePresence mode="wait">
        {starsCount === 5 ? (
          <motion.div
            key="review-full"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 12, color: "#FFFFFF", background: "rgba(0,0,0,0.35)", padding: "10px 12px", borderRadius: 10, borderLeft: "3px solid #FACC15" }}
          >
            “Foreman sent a review text right after the job. Captured 18 new 5-star reviews this week!”
          </motion.div>
        ) : (
          <motion.div
            key="review-building"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 11, color: "#CBD5E1", fontStyle: "italic", padding: "6px 2px" }}
          >
            Collecting verified 5-star post-job reviews automatically...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlipFeatureCard({ feat, index }: { feat: { title: string; desc: string; icon: any }; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fm-featcard-wrapper"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      whileHover={reducedMotion ? {} : { y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        perspective: 1200,
        height: 350,
        position: "relative",
        cursor: "pointer"
      }}
    >
      <motion.div
        animate={{ rotateY: isFlipped && !reducedMotion ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d"
        }}
      >
        {/* FRONT FACE OF CARD (FRAMELESS GLASS) */}
        <div style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: `linear-gradient(135deg, rgba(20,28,48,0.92) 0%, rgba(10,15,28,0.96) 100%)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "36px 30px",
          borderRadius: 24,
          border: `1px solid rgba(249, 122, 53, 0.35)`,
          boxShadow: isFlipped
            ? "0 24px 60px rgba(0,0,0,0.6)"
            : "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          transition: "border-color 300ms ease, box-shadow 300ms ease"
        }}>
          {/* Top Neon Accent Line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${C.accentOrange}, transparent)`
          }} />

          {/* Glowing Ambient Light Sphere */}
          <div style={{
            position: "absolute", top: "-25%", right: "-25%", width: "200px", height: "200px",
            background: `radial-gradient(circle, ${C.accentOrange}25 0%, transparent 70%)`,
            pointerEvents: "none", borderRadius: "50%", filter: "blur(10px)"
          }} />

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <motion.div
                animate={reducedMotion ? {} : { y: [-4, 4], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: index * 0.15 }}
                style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: `linear-gradient(135deg, ${C.accentOrange}35 0%, ${C.accentOrange}10 100%)`,
                  border: `1px solid ${C.accentOrange}70`,
                  boxShadow: `0 10px 24px -4px ${C.accentOrange}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  color: C.accentOrange, display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <div style={{ filter: `drop-shadow(0 4px 12px ${C.accentOrange}80)` }}>{feat.icon}</div>
              </motion.div>

              <span className="fm-mono" style={{
                fontSize: 12, fontWeight: 900, letterSpacing: 1.5, color: C.accentOrange,
                background: "rgba(249,122,53,0.15)", border: `1px solid ${C.accentOrange}40`,
                padding: "5px 12px", borderRadius: 999, boxShadow: `0 4px 12px ${C.accentOrange}20`
              }}>
                0{index + 1}
              </span>
            </div>

            <h3 style={{ fontSize: 23, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 12, color: "#FFFFFF", lineHeight: 1.3 }}>
              {feat.title}
            </h3>

            <p style={{ fontSize: 15, color: "#A0AEC0", margin: 0, lineHeight: 1.65 }}>
              {feat.desc}
            </p>
          </div>
        </div>

        {/* BACK FACE OF CARD (HIGH-CONTRAST NEON DEMO) */}
        <div style={{
          position: "absolute",
          inset: 0,
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: `linear-gradient(135deg, rgba(26,36,58,0.98) 0%, rgba(12,18,32,0.99) 100%)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "24px",
          borderRadius: 24,
          border: `1px solid ${C.accentOrange}`,
          boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 35px ${C.accentOrange}45`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden"
        }}>
          {/* Top Neon Accent Line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: C.accentOrange, boxShadow: `0 0 10px ${C.accentOrange}`
          }} />

          {/* Minimalist Live Functional Animation Component */}
          <FeatureGraphicWidget title={feat.title} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdvancedFeatures({ mode = "main" }: { mode?: LandingMode }) {
  const fCopy = FEATURES_COPY[mode] || FEATURES_COPY.main;

  return (
    <section id="features" className="fm-island" style={{ background: C.bgCard, padding: "64px 0", zIndex: 7 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 40, textAlign: "center", maxWidth: "100%" }}>
          <div className="fm-eyebrow" style={{ display: "inline-block" }}>{fCopy.eyebrow}</div>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(36px, 5vw, 52px)",
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            marginTop: 16
          }}>
            <ScrollTextReveal text={fCopy.headline} as="span" />
          </h2>
        </Reveal>

        {/* Interactive 3D Flip Feature Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
          <AnimatePresence mode="popLayout">
            {fCopy.feats.map((feat, i) => (
              <motion.div
                key={feat.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <FlipFeatureCard feat={feat} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FINAL CTA                                                          */
/* ================================================================== */
const CTA_COPY: Record<LandingMode, { headline: string; sub: string; button: string }> = {
  main: {
    headline: "Stop paying for a phone that loses you jobs.",
    sub: "Start a free pilot. See exactly what Foreman captures for a shop like yours in the first week.",
    button: "Book your free pilot"
  },
  hvac: {
    headline: "Stop missing the peak-season installs.",
    sub: "Start your free pilot and see how many jobs Foreman captures on the first hot weekend.",
    button: "Book your free HVAC pilot"
  },
  plumbing: {
    headline: "Stop losing the midnight emergencies.",
    sub: "Start your free pilot and let Foreman answer the next burst pipe call while you sleep.",
    button: "Book your free plumbing pilot"
  },
  restoration: {
    headline: "Be the first to answer, every time.",
    sub: "Start your free pilot and see how many five-figure jobs you were missing overnight.",
    button: "Book your free restoration pilot"
  },
  electrical: {
    headline: "Stop losing the midnight emergencies.",
    sub: "Start your free pilot and let Foreman answer the next outage call while you sleep.",
    button: "Book your free electrical pilot"
  },
  "property-management": {
    headline: "Handle every tenant call automatically.",
    sub: "Start a white-label demo to see how Foreman manages routine and emergency calls for your portfolio.",
    button: "Book a white-label demo"
  }
};

function FinalCTA({ mode = "main" }: { mode?: LandingMode }) {
  const content = CTA_COPY[mode] || CTA_COPY.main;

  return (
    <section id="pilot" style={{ background: C.bgPrimary, padding: "48px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "100%", maxWidth: 1000, height: 600,
        background: `radial-gradient(circle, ${C.accentOrange}25, transparent 70%)`,
        pointerEvents: "none", zIndex: 0
      }} />
      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(36px, 5.5vw, 64px)",
            lineHeight: 1.12,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading
          }}>
            <ScrollTextReveal text={content.headline} as="span" />
          </h2>
          <div className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto", marginTop: 16 }}>
            <ScrollTextReveal text={content.sub} as="p" />
          </div>
          <div className="fm-hero-cta" style={{ justifyContent: "center", marginTop: 40 }}>
            <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary">
              {content.button}
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
/*  TESTIMONIALS SECTION                                              */
/* ================================================================== */
const TESTIMONIALS = [
  {
    quote: "Captured 14 emergency heatwave calls while crew was out on jobs.",
    highlight: "Booked $18,400 in revenue we used to lose to voicemail.",
    author: "Dave Miller",
    title: "Founder, Apex HVAC Services",
    location: "Austin, TX",
    trade: "HVAC",
    metric: "+$18,400",
    metricLabel: "1st Weekend Revenue",
    initials: "DM",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  },
  {
    quote: "2 AM burst pipe calls used to go straight to our competitors.",
    highlight: "Foreman triages and dispatches emergencies before I wake up.",
    author: "Marcus Vance",
    title: "Owner, Vance & Sons Plumbing",
    location: "Chicago, IL",
    trade: "Plumbing",
    metric: "0 Missed",
    metricLabel: "Emergency Dispatches",
    initials: "MV",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  },
  {
    quote: "Our missed call rate dropped from 35% to zero instantly.",
    highlight: "Homeowners are blown away by how fast and professional it sounds.",
    author: "Carlos Reyes",
    title: "Master Electrician, Reyes Electric",
    location: "Miami, FL",
    trade: "Electrical",
    metric: "100%",
    metricLabel: "Call Answer Rate",
    initials: "CR",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  },
  {
    quote: "In water damage restoration, speed is everything.",
    highlight: "Booked two $12k mold & water mitigation assessments in 48 hrs.",
    author: "Sarah Jenkins",
    title: "Operations Director, NextGen Restoration",
    location: "Denver, CO",
    trade: "Restoration",
    metric: "+$24,000",
    metricLabel: "First 48 Hours",
    initials: "SJ",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  },
  {
    quote: "Paid for itself on day one with emergency garage door calls.",
    highlight: "Books spring replacements before homeowners even hang up.",
    author: "Jason Rodriguez",
    title: "Owner, Titan Overhead Doors",
    location: "Phoenix, AZ",
    trade: "Garage Doors",
    metric: "< 10 sec",
    metricLabel: "Emergency Dispatch",
    initials: "JR",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  },
  {
    quote: "Storm emergency calls were completely overwhelming us.",
    highlight: "Handled 80+ calls in an afternoon and booked 34 inspections.",
    author: "Brett Callahan",
    title: "Managing Partner, Shield Roofing",
    location: "Dallas, TX",
    trade: "Roofing",
    metric: "34 Jobs",
    metricLabel: "Inspections Scheduled",
    initials: "BC",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    bgGradient: "linear-gradient(135deg, rgba(249,122,53,0.25), rgba(20,28,48,0.8))",
    glow: "249,122,53",
  }
];

function InfiniteDraggableMarquee({ items, baseSpeed = -0.5, style }: { items: typeof TESTIMONIALS; baseSpeed?: number; style?: React.CSSProperties }) {
  const reducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 400, damping: 40, mass: 0.15 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleWidth, setSingleWidth] = useState(0);

  useEffect(() => {
    if (trackRef.current) {
      setSingleWidth(trackRef.current.scrollWidth / 2);
    }
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (!isDragging && !reducedMotion) {
      const moveBy = baseSpeed * (delta / 16);
      rawX.set(rawX.get() + moveBy);
    }
  });

  const wrappedX = useTransform(smoothX, (v) => {
    if (!singleWidth) return "0px";
    const wrapped = wrap(-singleWidth, 0, v);
    return `${wrapped}px`;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onMouseMove={handleMouseMove}
      className="fm-testimonial-marquee-wrapper"
      style={{ ...style, touchAction: "none", position: "relative", cursor: "none", overflow: "hidden" }}
    >
      <motion.div
        ref={trackRef}
        drag="x"
        style={{ x: wrappedX, display: "flex", gap: 24, width: "max-content", cursor: "none" }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={(_, info) => {
          rawX.set(rawX.get() + info.delta.x);
        }}
      >
        {items.map((item, idx) => (
          <TestimonialCard key={`m-${idx}`} item={item} />
        ))}
      </motion.div>

      {/* Hover Badge matching Request a Demo style */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="fm-headline-hover-badge-centered"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: isDragging ? 1.08 : 1,
              x: cursorPos.x,
              y: cursorPos.y - 30,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.3 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 50,
            }}
          >
            <span>{isDragging ? "Scroll" : "Drag"}</span>
            <span style={{ fontSize: 14 }}>{isDragging ? "✊" : "🖐️"}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TestimonialsSection() {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

  return (
    <section id="testimonials" className="fm-island" style={{ background: C.bgCard, padding: "72px 0 88px", zIndex: 7, overflow: "hidden", position: "relative" }}>
      {/* Background glow ambiance */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: `radial-gradient(ellipse, ${C.accentOrange}12 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 48, maxWidth: "100%", textAlign: "center" }}>
          <div className="fm-eyebrow">REAL CONTRACTOR RESULTS</div>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            marginBottom: 16
          }}>
            <ScrollTextReveal text="Trusted by trade owners who build America." as="span" />
          </h2>
          <div style={{ color: C.textBody, fontSize: 18, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            <ScrollTextReveal text="See how HVAC, plumbing, electrical, and restoration contractors turn missed calls into booked revenue every single day." as="p" />
          </div>
        </Reveal>
      </div>

      {/* Marquee Track 1 (Infinite Draggable Loop) */}
      <InfiniteDraggableMarquee items={row1} baseSpeed={-0.6} style={{ marginBottom: 20 }} />

      {/* Marquee Track 2 (Reverse Infinite Draggable Loop) */}
      <InfiniteDraggableMarquee items={row2} baseSpeed={0.6} />
    </section>
  );
}

function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [hovering, setHovering] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * 10;
    const rx = (0.5 - py) * 6;
    setTilt({ rx, ry, mx: px * 100, my: py * 100 });
  }

  return (
    <motion.div
      ref={ref}
      whileHover={{
        scale: 1.04,
        rotate: 1,
        cursor: "none",
        transition: { type: "spring", stiffness: 350, damping: 22 }
      }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
      }}
      className="tcard select-none"
      style={{
        "--glow": item.glow,
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${hovering ? 10 : 0}px)`,
      } as React.CSSProperties}
    >
      {/* animated gradient border ring */}
      <div className="tcard-ring pointer-events-none" />

      {/* cursor-tracking spotlight */}
      <div
        className="tcard-spot pointer-events-none"
        style={{
          background: `radial-gradient(280px circle at ${tilt.mx}% ${tilt.my}%, rgba(${item.glow},0.20), transparent 70%)`,
          opacity: hovering ? 1 : 0,
        }}
      />

      <div className="tcard-inner pointer-events-none">
        {/* Card Header: Trade Pill & Star Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: `rgb(${item.glow})`,
            background: `rgba(${item.glow}, 0.12)`,
            border: `1px solid rgba(${item.glow}, 0.35)`,
            padding: "3px 10px",
            borderRadius: 999,
            boxShadow: `0 2px 8px rgba(${item.glow}, 0.12)`
          }}>
            {item.trade}
          </span>
          <div className="tcard-stars" style={{ display: "flex", gap: 2, background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
            {Array.from({ length: item.rating }).map((_, i) => (
              <span key={i} className="tcard-star" style={{ transitionDelay: `${i * 30}ms` }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97A35" style={{ filter: "drop-shadow(0 0 4px rgba(249,122,53,0.8))" }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {/* Hero Metric Banner Box - Compact */}
        <div style={{
          marginBottom: 12,
          background: "rgba(15, 23, 42, 0.65)",
          padding: "10px 14px",
          borderRadius: 14,
          border: `1px solid rgba(${item.glow}, 0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {item.metric}
            </div>
            <div className="fm-mono" style={{ fontSize: 10, fontWeight: 800, color: `rgb(${item.glow})`, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
              {item.metricLabel}
            </div>
          </div>
        </div>

        {/* Concise Quote */}
        <p style={{ color: "#E2E8F0", fontSize: 13, lineHeight: 1.45, fontWeight: 500, margin: "0 0 10px" }}>
          &ldquo;{item.quote}&rdquo;
        </p>

        {/* Author Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: "auto" }}>
          <div className="tcard-avatar" style={{ background: item.bgGradient, width: 34, height: 34, borderRadius: "50%", border: `1.5px solid rgba(${item.glow}, 0.5)` }}>
            <div className="tcard-avatar-ring" />
            {item.avatarUrl ? (
              <img src={item.avatarUrl} alt={item.author} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              item.initials
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 4 }}>
              <span>{item.author}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accentOrange}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.title} • {item.location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
export function Footer({ hideIntegrations = false }: { hideIntegrations?: boolean }) {
  const router = useRouter();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") || href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.startsWith("/#") ? href.slice(1) : href;
      if (targetId === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", targetId);
        return;
      }
      const el = document.querySelector(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", targetId);
      } else {
        router.push("/" + targetId);
      }
    }
  };

  return (
    <footer style={{ background: C.footerBg, color: C.textBody, paddingTop: 60, paddingBottom: 60, position: "relative", overflow: "hidden", borderTop: `1px solid ${C.borderPrimary}` }}>

      {/* Background glow effects */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1000, height: 400, background: `radial-gradient(ellipse at top, ${C.accentOrange}10, transparent 70%)`, pointerEvents: "none" }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 60, marginBottom: 80, justifyContent: "space-between" }}>

          {/* Brand Column */}
          <div style={{ flex: "2 1 300px", paddingRight: 40 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, textDecoration: "none" }}>
              <Logo size={36} />
              <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: 26, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
            </Link>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textBody, marginBottom: 32, maxWidth: 360 }}>
              The AI front office built exclusively for the trades. We answer the phone, qualify the lead, and book the job directly into your calendar so you can focus on the work.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { id: "x", url: "https://x.com" },
                { id: "linkedin", url: "https://linkedin.com" },
                { id: "instagram", url: "https://www.instagram.com/foreman.ai_?igsh=c2J0M2pxcWNlbjM2" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.id}
                  whileHover={{ scale: 1.1, y: -2, borderColor: C.accentOrange, color: C.accentOrange }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: C.bgCard, border: `1px solid ${C.borderPrimary}`, color: C.textBody, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {social.id === "x" && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>}
                  {social.id === "linkedin" && <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>}
                  {social.id === "instagram" && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: 16 }}>
            <h4 style={{ color: C.textHeading, fontWeight: 700, fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>Product</h4>
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how" },
              { label: "Pricing", href: "#pricing" },
              { label: "Integrations", href: "#integrations" },
              { label: "Book a Pilot", href: CALENDLY_LINK }
            ].filter(link => !(hideIntegrations && link.label === "Integrations")).map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                whileHover={{ x: 4, color: C.accentOrange }}
                style={{ fontSize: 15, color: C.textBody, textDecoration: "none", transition: "color 0.2s", fontWeight: 500, alignSelf: "flex-start" }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: 16 }}>
            <h4 style={{ color: C.textHeading, fontWeight: 700, fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>Trades</h4>
            {TRADES.map((trade) => (
              <motion.a
                key={trade.id}
                href={`/${trade.id}`}
                whileHover={{ x: 4, color: C.accentOrange }}
                style={{ fontSize: 15, color: C.textBody, textDecoration: "none", transition: "color 0.2s", fontWeight: 500, alignSelf: "flex-start" }}
              >
                {trade.label}
              </motion.a>
            ))}
          </div>

          <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: 16 }}>
            <h4 style={{ color: C.textHeading, fontWeight: 700, fontSize: 14, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1.5 }}>Company</h4>
            {[
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Sign In", href: "/sign-in" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Privacy Policy", href: "/privacy" }
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ x: 4, color: C.accentOrange }}
                style={{ fontSize: 15, color: C.textBody, textDecoration: "none", transition: "color 0.2s", fontWeight: 500, alignSelf: "flex-start" }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: `1px solid ${C.borderPrimary}`, paddingTop: 32, paddingBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24, position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 14, color: C.textBody, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Foreman Inc. All rights reserved.
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.accentGreenText, background: `${C.accentGreenBg}40`, padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.accentGreenText}40`, cursor: "pointer" }}
          >
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.accentGreenText, boxShadow: `0 0 8px ${C.accentGreenText}` }} />
            All systems operational
          </motion.div>
        </div>
      </div>

      {/* Oversized low-opacity wordmark graphic */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", opacity: 0.025, pointerEvents: "none", userSelect: "none", position: "absolute", bottom: -20, left: 0, zIndex: 0 }}>
        <svg viewBox="0 0 1000 200" style={{ width: "100%", height: "auto", maxWidth: "1600px", overflow: "visible" }} aria-hidden>
          <text x="50%" y="78%" textAnchor="middle" fill={C.textHeading} style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 900, fontSize: "220px", letterSpacing: "-0.04em" }}>
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
export function Check({ o }: { o?: boolean }) {
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
function Globe() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke={C.accentOrange} strokeWidth="2" />
      <ellipse cx="12" cy="12" rx="4" ry="10" stroke={C.accentOrange} strokeWidth="2" />
      <path d="M2 12h20" stroke={C.accentOrange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function MessageSquare() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={C.accentOrange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function Headphones() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={C.accentOrange} strokeWidth="2" strokeLinecap="round" />
      <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4zM3 19a2 2 0 0 0 2 2h1v-6H3v4z" stroke={C.accentOrange} strokeWidth="2" />
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
/*  PRICING                                                            */
/* ================================================================== */
export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-16 relative" style={{ background: C.bgPrimary }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: `radial-gradient(ellipse at 50% -50%, ${C.accentOrange}, transparent 70%)` }} />

      <div className="max-w-[1000px] mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: C.bgCard, borderColor: C.borderPrimary }}
        >
          {/* Subtle noise texture or inner glow */}
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 50%, ${C.accentOrange}, transparent 60%)` }} />

          <div className="relative z-10">
            <h2 style={{
              fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
              fontSize: "clamp(32px, 4.8vw, 56px)",
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              marginBottom: "1.5rem"
            }}>
              <ScrollTextReveal text="Pricing that only wins when you do." as="span" />
            </h2>
            <div className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12">
              <ScrollTextReveal text="Foreman is priced to your business and only charges when it delivers. Most clients start with a pilot, so you can see exactly what it captures before you commit. You only pay when Foreman books you real work." as="p" />
            </div>

            <div className="flex flex-col items-center justify-center">
              <MagneticButton href={CALENDLY_LINK} className="fm-btn fm-btn-primary" style={{ padding: "16px 32px", fontSize: "18px" }}>
                Book your free pilot
              </MagneticButton>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium tracking-wide">
                <span>Custom to your business</span>
                <span style={{ color: C.borderPrimary }}>&bull;</span>
                <span>Live in 24 hours</span>
                <span style={{ color: C.borderPrimary }}>&bull;</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FAQ                                                                */
/* ================================================================== */
const FAQ_COPY: Record<LandingMode, { q: string; a: string }[]> = {
  main: [
    { q: "Is it a robot talking to my customers?", a: "It sounds like your best front-desk person, calm, clear, and to the point. It never wastes a caller's time, and it never sends anyone to voicemail. You can also give it your shop's name and tone so it sounds like your team." },
    { q: "Can I listen to calls or step in?", a: "Yes. Listen to any call live from your phone and take over instantly. You are always in control." },
    { q: "Does it really speak Spanish?", a: "Fluently. It handles calls in English and Spanish automatically, so you never lose a caller to a language barrier." },
    { q: "How much does it cost?", a: "Foreman is priced custom to your business and only charges when it delivers. Most clients start with a pilot, so you can see exactly what it captures before you commit." },
    { q: "I already have voicemail or an answering service.", a: "Voicemail loses about 80% of callers. Answering services take a message and hand it back to you. Foreman qualifies the job and books it into your calendar. That is the difference between a note and a booked job." },
    { q: "How long does setup take?", a: "You're live in about 24 hours. No new hardware, we connect to your existing number." },
    { q: "What happens after hours?", a: "That's when Foreman shines. Nights, weekends, and holidays are prime emergency hours, and it answers all of them." }
  ],
  hvac: [
    { q: "Sounds like a robot?", a: "It sounds like your best front-desk hire, calm and clear, and it never sends anyone to voicemail." },
    { q: "Don't trust AI with your customers?", a: "Listen to any call live and take over from your phone. You're always in control." },
    { q: "What about after hours?", a: "That's when Foreman shines. Nights and weekends are prime emergency hours, and it works all of them." }
  ],
  plumbing: [
    { q: "Sounds like a robot?", a: "It sounds like your best front-desk hire, and it never sends anyone to voicemail." },
    { q: "Don't trust AI with your customers?", a: "Listen live and take over from your phone. You're always in control." },
    { q: "What about after hours?", a: "That's when Foreman shines. Emergencies are prime plumbing hours, and it works all of them." }
  ],
  restoration: [
    { q: "Sounds like a robot?", a: "It sounds like a calm, professional dispatcher, and it never sends an emergency to voicemail." },
    { q: "Don't trust AI with emergencies?", a: "You're alerted instantly on major jobs and can take over any call live." },
    { q: "What about the middle of the night?", a: "That's exactly when Foreman wins you jobs your competitors miss." }
  ],
  electrical: [
    { q: "Sounds like a robot?", a: "It sounds like your best front-desk hire, and it never sends anyone to voicemail." },
    { q: "Don't trust AI with your customers?", a: "Listen live and take over from your phone. You're always in control." },
    { q: "What about after hours?", a: "That's when Foreman shines. Emergencies are prime electrical hours, and it works all of them." }
  ],
  "property-management": [
    { q: "Will tenants know it's AI?", a: "It's fully white-labeled with your brand and voice, and it handles calls professionally, around the clock." },
    { q: "Can we control what it does?", a: "You set the escalation rules. You're alerted on emergencies and can take over any call." },
    { q: "What about our systems?", a: "We custom-integrate and train Foreman on your properties, vendors, and processes." }
  ]
};

export function FAQ({ mode = "main" }: { mode?: LandingMode }) {
  const qa = FAQ_COPY[mode] || FAQ_COPY.main;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="fm-island" style={{ background: C.bgCard, padding: "32px 0", zIndex: 8 }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead">
          <div className="fm-eyebrow">STRAIGHT ANSWERS</div>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 4.8vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            marginBottom: "18px"
          }}>
            <ScrollTextReveal text="Questions, answered" as="span" />
          </h2>
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
/*  SCROLL TO TOP BUTTON                                               */
/* ================================================================== */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 90,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: C.accentOrange,
            color: C.bgPrimary,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(249,122,53,0.4)",
            cursor: "pointer",
          }}
          aria-label="Scroll to top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ================================================================== */
/*  CINEMATIC WORKFLOW (S-CURVE)                                      */
/* ================================================================== */
function CinematicWorkflow() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const autoProgress = useMotionValue(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 85%"]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    let ticking = false;
    const onResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkMobile();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (reducedMotion || isMobile || !isInView) return;
    let isActive = true;

    const runSequence = async () => {
      await new Promise(r => setTimeout(r, 1000));

      for (let i = 1; i <= 10; i++) {
        if (!isActive) return;
        setStep(i);

        // Auto-scroll logic
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // Only auto-scroll if the user is actively viewing this section
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (i === 5 && row2Ref.current) {
              row2Ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            } else if (i === 8 && row3Ref.current) {
              row3Ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        }

        // Animate the pipeline progress
        animate(autoProgress, i / 10, { type: "spring", stiffness: 60, damping: 20 });

        await new Promise(r => setTimeout(r, 1800));
      }
    };

    runSequence();

    return () => { isActive = false; };
  }, [reducedMotion, isInView, isMobile, autoProgress]);

  // Sync mobile step with scroll
  useEffect(() => {
    if (!isMobile) return;
    return scrollYProgress.on("change", (v) => {
      setStep(Math.min(10, Math.max(0, Math.ceil(v * 10))));
    });
  }, [isMobile, scrollYProgress]);

  const activeProgress = isMobile ? scrollYProgress : autoProgress;

  return (
    <section ref={containerRef} className="fm-island" style={{ background: C.bgPrimary, padding: "48px 0", position: "relative", overflow: "hidden", display: "flex", justifyContent: "center" }}>
      {/* Background Ambience */}
      <div style={{ position: "absolute", top: "20%", left: "30%", width: "40%", height: 600, background: "radial-gradient(ellipse, rgba(167,139,250,0.08) 0%, transparent 60%)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "40%", height: 600, background: `radial-gradient(circle, ${C.accentOrange}0A 0%, transparent 60%)`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div className="fm-cinematic-container">

        {/* The S-Curve SVG Pipeline */}
        <svg className="fm-cinematic-svg" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
          {/* Base Track */}
          <path
            d="M 140 210 L 860 210 A 80 80 0 0 1 940 290 L 940 650 A 80 80 0 0 1 860 730 L 140 730 A 80 80 0 0 0 60 810 L 60 1170 A 80 80 0 0 0 140 1250 L 860 1250"
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"
          />
          {/* Animated Pulse */}
          <motion.path
            d="M 140 210 L 860 210 A 80 80 0 0 1 940 290 L 940 650 A 80 80 0 0 1 860 730 L 140 730 A 80 80 0 0 0 60 810 L 60 1170 A 80 80 0 0 0 140 1250 L 860 1250"
            fill="none" stroke={C.accentOrange} strokeWidth="4"
            style={{ pathLength: activeProgress, filter: "drop-shadow(0 0 8px rgba(249,122,53,0.8))" }}
          />
        </svg>

        {/* Mobile Vertical Pipeline */}
        <div className="fm-cinematic-line-mobile">
          <motion.div
            style={{ width: "100%", height: "100%", background: C.accentOrange, transformOrigin: "top", scaleY: activeProgress, filter: "drop-shadow(0 0 8px rgba(249,122,53,0.8))" }}
          />
        </div>

        {/* 3x3 Grid Layout */}
        <div className="fm-cinematic-grid">
          <div className="fm-cinematic-step step1"><StepPhone active={step >= 1} /></div>
          <div className="fm-cinematic-step step2"><StepAI active={step >= 2} listens={step >= 3} /></div>
          <div className="fm-cinematic-step step4"><StepQualification active={step >= 4} /></div>

          <div ref={row2Ref} className="fm-cinematic-step step5"><StepAppointment active={step >= 5} /></div>
          <div className="fm-cinematic-step step6"><StepCalendar active={step >= 6} /></div>
          <div className="fm-cinematic-step step7"><StepDispatch active={step >= 7} /></div>

          <div ref={row3Ref} className="fm-cinematic-step step8"><StepSMS active={step >= 8} /></div>
          <div className="fm-cinematic-step step9"><StepCRM active={step >= 9} /></div>
          <div className="fm-cinematic-step step10"><StepRevenue active={step >= 10} /></div>
        </div>

      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// STEP COMPONENTS
// ------------------------------------------------------------------

function StepPhone({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accentOrange }}>1 INCOMING CALL</motion.div>
      <TiltCard style={{ width: 280, height: 420, background: "#0a0a0c", borderRadius: 36, border: "6px solid #1a1a1f", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}>
        <motion.span animate={active ? { opacity: [1, 0.4, 1] } : { opacity: 0.4 }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: C.accentOrange, fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Incoming Call</motion.span>
        <h3 style={{ fontSize: 20, color: "#fff", marginBottom: 4, fontWeight: 600 }}>Mike Johnson</h3>
        <span style={{ color: "#60A5FA", fontSize: 13, marginBottom: 32, fontWeight: 500 }}>HVAC Repair</span>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#222", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.1)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </div>

        {active && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 20, opacity: 1 }} style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 3 }}>
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }} style={{ width: 3, height: 20, background: C.accentOrange, borderRadius: 2 }} />
            ))}
          </motion.div>
        )}

        <div style={{ display: "flex", gap: 32, opacity: active ? 1 : 0.5, transition: "opacity 0.3s" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(239,68,68,0.3)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          </div>
          <motion.div animate={active ? { y: [-2, 2] } : {}} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} style={{ width: 56, height: 56, borderRadius: "50%", background: C.accentGreenText, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 16px rgba(31,170,89,0.3)` }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </motion.div>
        </div>
      </TiltCard>
    </div>
  );
}

function StepAI({ active, listens }: { active: boolean, listens: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 40 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#A78BFA" }}>
        {listens ? "3 AI LISTENS" : "2 AI ANSWERS"}
      </motion.div>
      <div style={{ position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Core Glow */}
        <motion.div
          animate={active ? { scale: listens ? [1, 1.4, 1] : [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: listens ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.6) 0%, rgba(167,139,250,0) 70%)", filter: "blur(20px)" }}
        />

        {/* Orbiting particles when listening */}
        {listens && [...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", position: "absolute", top: 20, left: "50%", boxShadow: "0 0 10px #fff" }} />
          </motion.div>
        ))}

        {/* Central Orb */}
        <motion.div
          animate={active ? { scale: [1, 1.05, 1] } : { scale: 0.9, opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #3B2A6B, #1A1235)", border: "2px solid rgba(167,139,250,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "inset 0 0 20px rgba(167,139,250,0.3)" }}
        >
          {listens ? (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} animate={{ scaleY: [0.4, 1.5, 0.4] }} transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} style={{ width: 4, height: 24, background: "#fff", borderRadius: 2 }} />
              ))}
            </div>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>
          )}
        </motion.div>

      </div>
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
        {/* Map Background Simulation */}
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

        {/* Glow */}
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

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export function ForemanLanding({ mode = "main" }: { mode?: LandingMode }) {
  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 2, syncTouch: true, smoothWheel: true }}>
      <main
        className="fm-landing"
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          color: C.textHeading,
          background: C.navBg,
          overflowX: "clip",
        }}
      >
        <Nav />
        <Hero mode={mode} />
        <DashboardPreview />
        <div id={mode === "main" ? "how" : undefined}>
          <CinematicWorkflow />
        </div>
        {mode === "main" && <TradeSelector />}
        <StatComparison mode={mode} />
        <div id={mode !== "main" ? "how" : undefined}>
          <AnnotatedProof mode={mode} />
        </div>
        <div id="integrations">
          <IntegrationsRow />
        </div>
        <div id="features">
          <AdvancedFeatures mode={mode} />
        </div>
        <TestimonialsSection />
        <FinalCTA mode={mode} />
        <Pricing />
        <FAQ mode={mode} />
        <Footer />
        <PersistentWidget />
        <ScrollToTopButton />
      </main>
    </ReactLenis>
  );
}