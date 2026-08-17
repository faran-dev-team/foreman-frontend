/* eslint-disable @next/next/no-img-element */
"use client";

export type LandingMode = "main" | "hvac" | "plumbing" | "restoration" | "property-management" | "electrical";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import dynamic from "next/dynamic";
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
  DoodleRingingPhone,
  DoodleHouseCheck,
  DoodleClipboard,
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
  size = 32,
  width,
  bg = C.accentOrange,
  fg = C.bgPrimary,
}: {
  size?: number;
  width?: number | string;
  bg?: string;
  fg?: string;
}) {
  return <ForemanLogo size={size} width={width} bg={bg} fg={fg} />;
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
  return (
    <Component className={className} style={{ ...style, display: "inline-block" }}>
      {text}
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
/* ------------------------------------------------------------------
   Mobile detection: matches small screens AND coarse-pointer (touch)
   devices (tablets can be wide but still choke on blur/3D-transform).
------------------------------------------------------------------ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function TiltCard({ children, className, glowColor = "rgba(255,255,255,0.12)", style, animate, transition }: { children: React.ReactNode, className?: string, glowColor?: string, style?: React.CSSProperties, animate?: any, transition?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rx = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });
  const ry = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion || isMobile) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
    rx.set(((y - height / 2) / height) * -8);
    ry.set(((x - width / 2) / width) * 8);
  }, [reducedMotion, isMobile, mouseX, mouseY, rx, ry]);

  const handleMouseEnter = useCallback(() => { if (!isMobile) setIsHovered(true); }, [isMobile]);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  // Flat, zero-compositing-cost render path for touch devices.
  // perspective + preserve-3d forces each card onto its own GPU layer;
  // on mobile that stacks up fast — this path skips all of it.
  if (isMobile) {
    return (
      <div className={className} style={{ position: "relative", ...style }}>
        {children}
      </div>
    );
  }

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

/* ------------------------------------------------------------------ */
/*  Reusable: 3D Draggable & Rotatable Card                            */
/* ------------------------------------------------------------------ */
export function Interactive3DCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reducedMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);

  const rotX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotY = useSpring(0, { stiffness: 220, damping: 22 });

  const prevPos = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    setIsDragging(true);
    prevPos.current = { x: e.clientX, y: e.clientY };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch { }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || reducedMotion) return;
    const deltaX = e.clientX - prevPos.current.x;
    const deltaY = e.clientY - prevPos.current.y;

    currentRot.current.y += deltaX * 0.7;
    currentRot.current.x -= deltaY * 0.7;

    rotX.set(currentRot.current.x);
    rotY.set(currentRot.current.y);

    prevPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    currentRot.current = { x: 0, y: 0 };
    rotX.set(0);
    rotY.set(0);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { }
  };

  if (reducedMotion) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div style={{ perspective: 1000, width: "100%", height: "100%" }}>
      <motion.div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: "preserve-3d",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          height: "100%",
          ...style,
        }}
        whileTap={{ scale: 1.05 }}
        className={className}
      >
        <div style={{ transform: "translateZ(40px)", height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {children}
        </div>
      </motion.div>
    </div>
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
        <div className="fm-wrap fm-nav-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 54 : 64, transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)", transform: `scale(${scrolled ? 0.9 : 1})`, transformOrigin: "left center" }}><Logo size={32} /></div>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: 18, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
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

const CallCardWaveform = memo(function CallCardWaveform() {
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
});

const CallCardAvatar = memo(function CallCardAvatar({ initials, priority }: { initials: string; priority: "standard" | "emergency" }) {
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
});

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

/* ================================================================== */
/*  WAVY TEXT COMPONENT (Nuwebu-style staggered character wave)      */
/* ================================================================== */
export function WavyText({
  text,
  className,
  style,
  waveHeight = 12,
  duration = 1.8,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  waveHeight?: number;
  duration?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        paddingTop: "14px",
        marginTop: "-14px",
        overflow: "visible",
        ...style,
      }}
    >
      {words.map((word, wordIndex) => {
        const letterOffset = words
          .slice(0, wordIndex)
          .reduce((acc, w) => acc + w.length + 1, 0);

        return (
          <span
            key={wordIndex}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              marginRight: "0.28em",
              paddingBottom: "4px",
            }}
          >
            {Array.from(word).map((char, charIndex) => {
              const totalIndex = letterOffset + charIndex;
              const delay = totalIndex * stagger;

              return (
                <span
                  key={charIndex}
                  className="fm-wavy-letter"
                  style={{
                    animationDuration: `${duration}s`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
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

function HeroWaterWavesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.05, once: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (isMobile || reducedMotion || !isInView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    // Cap pixel ratio at 1 — was unset (defaulted to native, up to 3× on phones)
    const dpr = 1;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    handleResize();

    let resizeTicking = false;
    const onResize = () => {
      if (!resizeTicking) {
        resizeTicking = true;
        requestAnimationFrame(() => { handleResize(); resizeTicking = false; });
      }
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let time = 0;
    let lastTs = 0;
    // Throttle to ~30 fps instead of 60 fps
    const FRAME_INTERVAL = 1000 / 30;

    const render = (ts: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (ts - lastTs < FRAME_INTERVAL) return;
      lastTs = ts;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      // Step doubled vs original since we run at half the frame rate
      time += 0.005;

      // Coarser grid — fewer sin/cos calls per frame
      const stepX = 30;
      const stepY = 24;
      const cols = Math.ceil(width / stepX) + 1;
      const rows = Math.ceil(height / stepY) + 1;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // Hoist linear gradient outside row loop to avoid per-frame GC churn
      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0, "rgb(56, 189, 248)");
      strokeGrad.addColorStop(0.5, "rgb(14, 165, 233)");
      strokeGrad.addColorStop(1, "rgb(168, 85, 247)");
      ctx.strokeStyle = strokeGrad;

      // Draw 3D liquid wave mesh
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = c * stepX;
          const y = r * stepY;

          // Harmonic 3D wave equations (identical visual, same coefficients)
          const wave1 = Math.sin(x * 0.01 + time * 2.2) * Math.cos(y * 0.008 + time * 1.8);
          const wave2 = Math.sin((x + y) * 0.007 - time * 1.9) * 0.7;
          const wave3 = Math.cos(x * 0.015 - y * 0.01 + time * 2.8) * 0.4;

          // Interactive mouse ripple distortion
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mouseRipple = 0;
          if (dist < 180) {
            mouseRipple = Math.sin(dist * 0.08 - time * 6) * ((180 - dist) / 180) * 28;
          }

          const elevation = (wave1 + wave2 + wave3) * 32 + mouseRipple;
          const depthRatio = y / height;
          const projX = x + Math.sin(time * 1.5 + y * 0.012) * (1 - depthRatio) * 10;
          const projY = y + elevation;

          if (c === 0) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }

        const normY = r / rows;
        ctx.globalAlpha = Math.min(0.4, Math.max(0.06, (1 - normY * 0.65) * 0.35 + 0.06));
        ctx.lineWidth = normY > 0.4 ? 1.6 : 1.1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Fewer sparkles, no per-sparkle shadowBlur (shadowBlur is GPU-expensive)
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 14; i++) {
        const sx = (Math.sin(i * 77 + time * 1.2) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 44 + time * 1.4) * 0.5 + 0.5) * height;
        ctx.globalAlpha = (Math.sin(time * 4 + i) * 0.5 + 0.5) * 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "58%",
          zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 60% at 50% 20%, rgba(56,189,248,0.10), transparent 70%)",
          maskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "58%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}

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
    <header id="top" ref={ref} style={{ background: "#050812", color: C.textHeading, padding: "60px 0 60px", position: "relative", overflow: "hidden" }}>
      {/* 3D Water Waves Background */}
      <WaterWavesBackground />
      {/* Primary radial glow — top right */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", top: -240, right: -200, width: 720, height: 720, y: yGlow, zIndex: 0,
          background: `radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)`,
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

      <div className="fm-wrap fm-hero-grid" style={{ position: "relative", zIndex: 3 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", width: "100%" }}>
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
                        initial={{ opacity: 1, y: "0%", rotateX: 0, scale: 1 }}
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
                        initial={{ opacity: 1, y: "0%", scale: 1, filter: "blur(0px)" }}
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
            style={{ marginBottom: 36 }}
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

          {/* Interactive Hero Video Bot Player with Play / Pause Controls */}
          {/* <HeroVideoBotPlayer /> */}
        </div>
      </div>
    </header>
  );
}

function HeroVideoBotPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const p = (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100;
    setProgress(isNaN(p) ? 0 : p);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        background: "rgba(10, 15, 28, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(249, 122, 53, 0.12)",
        maxWidth: 540,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Video Viewport */}
      <div
        onClick={togglePlay}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          cursor: "pointer",
          background: "#000000",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          <source src="/videos/foreman.mp4" type="video/mp4" />
          <source src="/videos/bg-trades.mp4" type="video/mp4" />
        </video>

        {/* Single Center Play Button Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.42)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F97A35 0%, #EA580C 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 28px rgba(249, 122, 53, 0.65), 0 0 20px rgba(249, 122, 53, 0.4)",
                  paddingLeft: 4,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Laser-thin progress bar */}
      <div style={{ width: "100%", height: 2.5, background: "rgba(255, 255, 255, 0.08)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #F97A35, #FFB020)",
            transition: "width 0.15s linear",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  DASHBOARD PREVIEW (landing only — renders real DashboardOverview)  */
/* ================================================================== */

const DashboardOverview = dynamic(
  () => import("@/components/dashboard/dashboard-overview").then((mod) => mod.DashboardOverview),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: 600, display: "flex", flexDirection: "column", gap: 16, padding: "28px 32px", background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
        <div style={{ height: 28, width: "25%", background: "rgba(255,255,255,0.08)", borderRadius: 6 }} />
        <div style={{ height: 110, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 8 }} />
        <div style={{ height: 320, width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: 8 }} />
      </div>
    ),
  }
);

function DashboardPreview() {
  const isMobile = useIsMobile();
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyFrameRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyFrameRef,
    offset: ["start 60px", "end end"],
  });

  useEffect(() => {
    if (isMobile) return; // skip scroll-sync entirely on mobile — no benefit, real cost
    const updateInnerScroll = (progress: number) => {
      if (scrollableRef.current) {
        const maxScroll = scrollableRef.current.scrollHeight - scrollableRef.current.clientHeight;
        if (maxScroll > 0) {
          // Internal dashboard scrolling starts the moment app.foreman.ai / dashboard touches the navbar
          const normalized = Math.min(1, Math.max(0, progress / 0.88));
          scrollableRef.current.scrollTop = normalized * maxScroll;
        }
      }
    };

    updateInnerScroll(scrollYProgress.get());
    const unsub = scrollYProgress.on("change", updateInnerScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && scrollableRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateInnerScroll(scrollYProgress.get());
      });
      resizeObserver.observe(scrollableRef.current);
      if (scrollableRef.current.firstElementChild) {
        resizeObserver.observe(scrollableRef.current.firstElementChild as HTMLElement);
      }
    }

    return () => {
      unsub();
      resizeObserver?.disconnect();
    };
  }, [scrollYProgress, isMobile]);

  return (
    <section
      ref={trackRef}
      style={{
        background: brand.carbon,
        position: "relative",
        minHeight: isMobile ? "auto" : "150vh",
        padding: "48px 0 0",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 450, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${brand.orange}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        {/* Eyebrow + headline scrolls naturally above the browser frame */}
        <div className="fm-sechead" style={{ marginBottom: 44, textAlign: "center", maxWidth: "100%" }}>
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
            Your shop&apos;s performance, live in one place.
          </h2>
          <p className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto" }}>
            Every call, booking, and dollar Foreman captures shows up here in real time.
          </p>
        </div>

        {/* Sticky browser frame — locks under the navbar when app.foreman.ai / dashboard touches top: 60px */}
        <div
          ref={stickyFrameRef}
          style={{
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "auto" : "60px",
            zIndex: 10,
            paddingBottom: "40px",
          }}
        >
          {/* Browser chrome frame */}
          <div
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

            {/* App layout: sidebar + main (with horizontal scrolling on mobile) */}
            <div style={{ display: "flex", background: "#F8FAFC", maxHeight: 640, height: 640, overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
              {/* Sidebar */}
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
                    { label: "Dashboard", active: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
                    { label: "Calls", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                    { label: "Jobs", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
                    { label: "Reports", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
                    { label: "Settings", active: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg> },
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

              {/* Dashboard content — scroll-synced to main page scroll with horizontal scrolling */}
              <div
                ref={scrollableRef}
                style={{ flex: 1, minWidth: 640, overflowY: "auto", overflowX: "auto", WebkitOverflowScrolling: "touch" }}
              >
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  </div>
                </div>

                {/* Actual DashboardOverview rendered inside */}
                <div style={{ padding: "28px 32px" }}>
                  <DashboardOverview preview />
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <motion.p
            style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: brand.textMuted }}
          >
            Real-time owner dashboard · calls, bookings, and revenue in one view
          </motion.p>
        </div>
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
  { id: "property-management", label: "Property Management", example: "Tenant locked out, dispatched maintenance" },
  { id: "law-firm", label: "Law Firms", example: "Accident inquiry, booked intake consultation Wed 10am" },
];

const TRADE_THEME_COLORS = [
  { id: "hvac", color: "#F97A35", rgb: "249, 122, 53" },        // HVAC - Orange
  { id: "plumbing", color: "#38BDF8", rgb: "56, 189, 248" },    // Plumbing - Sky Blue
  { id: "electrical", color: "#FACC15", rgb: "250, 204, 21" },  // Electrical - Gold Yellow
  { id: "roofing", color: "#A855F7", rgb: "168, 85, 247" },     // Roofing - Purple
  { id: "pest", color: "#34D399", rgb: "52, 211, 153" },        // Pest - Emerald Green
  { id: "garage", color: "#EC4899", rgb: "236, 72, 153" },      // Garage - Pink/Magenta
  { id: "restoration", color: "#EF4444", rgb: "239, 68, 68" },  // Restoration - Red
  { id: "property-management", color: "#6366F1", rgb: "99, 102, 241" }, // Property Management - Indigo
  { id: "law-firm", color: "#0EA5E9", rgb: "14, 165, 233" },    // Law Firm - Cyan/Sky
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
  hvac: <img src="/images/hvac.png" alt="HVAC" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  plumbing: <img src="/images/plumber.png" alt="Plumbing" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  electrical: <img src="/images/electrician.png" alt="Electrical" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  roofing: <img src="/images/roofing (2).png" alt="Roofing" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  pest: <img src="/images/pest.png" alt="Pest Control" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  garage: <img src="/images/garage.png" alt="Garage Door" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  restoration: <img src="/images/restoration.png" alt="Restoration" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  "property-management": <img src="/images/property.png" alt="Property Management" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />,
  "law-firm": <img src="/images/property.png" alt="Law Firms" width={40} height={40} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "contain" }} />
};

/* ================================================================== */
/*  INTERACTIVE CALL CARD (3D Tilt, Spotlight Glow, Spring Physics)   */
/* ================================================================== */
/* ================================================================== */
/*  INTERACTIVE CALL CARD (3D Circular Cone Stack, Spotlight Glow)   */
/* ================================================================== */
/*  TRADE SELECTOR & VERTICAL FLOW STACK                              */
/* ================================================================== */
const TRADE_FLOW_DATA = [
  {
    id: "hvac",
    label: "HVAC",
    lead: "New HVAC Lead",
    example: "AC blowing warm air, booked emergency repair 2pm",
    metric: "+18% booking rate",
    metricTop: "+24% peak answer rate",
    metricBottom: "-35% missed calls",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
      </svg>
    ),
  },
  {
    id: "plumbing",
    label: "Plumbing",
    lead: "New Plumbing Lead",
    example: "Leak in basement, booked emergency visit 3pm",
    metric: "⚡ Dispatched in 42s",
    metricTop: "+100% after-hours capture",
    metricBottom: "0 missed emergency calls",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
      </svg>
    ),
  },
  {
    id: "electrical",
    label: "Electrical",
    lead: "New Electrical Lead",
    example: "Breaker keeps tripping, booked estimate Wed 9am",
    metric: "★ $480 Estimate Booked",
    metricTop: "+32% estimate conversion",
    metricBottom: "Instant panel triage",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: "roofing",
    label: "Roofing",
    lead: "New Roofing Lead",
    example: "Missing shingles after storm, booked inspection Fri 10am",
    metric: "★ $1,850 Inspection Booked",
    metricTop: "+40% storm surge capture",
    metricBottom: "100% lead qualification",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "pest",
    label: "Pest Control",
    lead: "New Pest Control Lead",
    example: "Termite evidence found, booked treatment Mon 8am",
    metric: "✓ Perimeter Treatment Booked",
    metricTop: "+28% recurring plans",
    metricBottom: "Instant schedule routing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="14" x="8" y="6" rx="4" />
        <path d="m19 7-3 2M5 7l3 2M19 19l-3-2M5 19l3-2M20 13h-4M4 13h4M10 4l1 2M14 4l-1 2" />
      </svg>
    ),
  },
  {
    id: "garage",
    label: "Garage Door",
    lead: "New Garage Door Lead",
    example: "Spring broke, car stuck, booked emergency visit 4pm",
    metric: "⚡ Emergency Visit 4pm",
    metricTop: "+35% emergency dispatch",
    metricBottom: "Same-day spring repair",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16M4 20V8l8-4 8 4v12M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    id: "restoration",
    label: "Restoration",
    lead: "New Restoration Lead",
    example: "Water damage in basement, booked emergency dispatch",
    metric: "★ $2,400 Claim Captured",
    metricTop: "24/7 emergency intake",
    metricBottom: "Instant insurance prep",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3z" />
      </svg>
    ),
  },
  {
    id: "property-management",
    label: "Property Management",
    lead: "New Tenant Maintenance Lead",
    example: "Tenant AC failure, dispatched emergency HVAC tech",
    metric: "✓ Tech Dispatched Unit 4B",
    metricTop: "Automated work orders",
    metricBottom: "Owner notified via SMS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
      </svg>
    ),
  },
  {
    id: "law-firm",
    label: "Law Firms",
    lead: "New Legal Intake Lead",
    example: "Auto accident case, booked attorney consultation today 2pm",
    metric: "★ $1,500 Retainer Intake",
    metricTop: "Conflict check & screening",
    metricBottom: "Zero lost client calls",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M3 7l9-4 9 4M6 13l-3-6 6 0-3 6zM18 13l-3-6 6 0-3 6z" />
      </svg>
    ),
  },
];

export function TradeSelector() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 3.2 seconds continuously (resets on manual tab selection)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRADE_FLOW_DATA.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const total = TRADE_FLOW_DATA.length;
  const prevIndex = (activeIndex - 1 + total) % total;
  const currIndex = activeIndex;
  const nextIndex = (activeIndex + 1) % total;

  const prevTrade = TRADE_FLOW_DATA[prevIndex];
  const currTrade = TRADE_FLOW_DATA[currIndex];
  const nextTrade = TRADE_FLOW_DATA[nextIndex];

  return (
    <section
      className="fm-island"
      style={{ background: C.bgCard, padding: "52px 0 60px", zIndex: 3, position: "relative", overflow: "hidden" }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 450, background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,122,53,0.07) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 24, maxWidth: "100%", textAlign: "center" }}>
          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 4.8vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading
          }}>
            Knows your trade. Asks the right questions. Books the job.
          </h2>
        </Reveal>

        <Reveal delay={0.05} style={{ maxWidth: 860, margin: "0 auto 28px" }}>
          <div className="fm-cta-banner" style={{
            background: "rgba(14, 21, 38, 0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <h3 className="fm-cta-banner-text" style={{
              fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
              fontWeight: 400,
              color: C.textHeading,
              margin: 0,
              lineHeight: 1.3
            }}>
              Book a free call with our AI Consultant today.
            </h3>
            <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary fm-cta-banner-btn">
              Book a free call with our AI Consultant
            </MagneticButton>
          </div>
        </Reveal>

        {/* Trade Selector Pills Bar with Animated Gliding Capsule */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 38 }}>
            {TRADE_FLOW_DATA.map((t, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    position: "relative",
                    background: "transparent",
                    color: isActive ? C.accentOrange : "rgba(255, 255, 255, 0.65)",
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 13.5,
                    lineHeight: 1.2,
                    cursor: "pointer",
                    transition: "color 0.25s ease",
                    zIndex: 1,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTradePill"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(249, 122, 53, 0.12)",
                        border: "1px solid rgba(249, 122, 53, 0.5)",
                        borderRadius: 999,
                        boxShadow: "0 4px 16px rgba(249, 122, 53, 0.25)",
                        zIndex: -1,
                      }}
                    />
                  )}
                  {!isActive && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 999,
                        zIndex: -1,
                      }}
                    />
                  )}
                  {t.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Vertical Stack Flow Layout */}
        <Reveal delay={0.15}>
          <div
            style={{
              maxWidth: 820,
              margin: "0 auto",
              background: "rgba(14, 21, 38, 0.65)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 28,
              padding: "36px 32px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                gap: 0,
              }}
              className="flex-col sm:flex-row"
            >
              {/* Left Column: True Continuous 3D Cylindrical Revolving Wheel (Zero Jerk) */}
              <div
                style={{
                  position: "relative",
                  height: 236,
                  width: "100%",
                  maxWidth: 410,
                  perspective: 1100,
                  transformStyle: "preserve-3d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {TRADE_FLOW_DATA.map((trade, i) => {
                  const total = TRADE_FLOW_DATA.length;
                  let diff = i - activeIndex;
                  if (diff > total / 2) diff -= total;
                  if (diff < -total / 2) diff += total;

                  const isActive = diff === 0;
                  const isVisible = Math.abs(diff) <= 2;

                  return (
                    <motion.div
                      key={trade.id}
                      animate={{
                        y: diff * 80,
                        rotateX: -diff * 22,
                        scale: isActive ? 1 : (Math.abs(diff) === 1 ? 0.94 : 0.86),
                        opacity: isActive ? 1 : (Math.abs(diff) === 1 ? 0.42 : 0),
                        zIndex: 10 - Math.abs(diff),
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 28,
                        mass: 0.8,
                      }}
                      onClick={() => setActiveIndex(i)}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        background: isActive
                          ? "linear-gradient(180deg, rgba(14,21,38,0.96) 0%, rgba(10,15,28,0.98) 100%)"
                          : "linear-gradient(180deg, rgba(14,21,38,0.7) 0%, rgba(10,15,28,0.7) 100%)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderRadius: 20,
                        padding: "16px 20px",
                        minHeight: 76,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        boxShadow: isActive
                          ? "0 18px 45px rgba(0, 0, 0, 0.6), 0 0 24px rgba(249, 122, 53, 0.22)"
                          : "0 8px 24px rgba(0, 0, 0, 0.3)",
                        border: isActive
                          ? "1px solid rgba(249, 122, 53, 0.55)"
                          : "1px solid rgba(255, 255, 255, 0.06)",
                        cursor: isActive ? "default" : "pointer",
                        pointerEvents: isVisible ? "auto" : "none",
                        transformOrigin: diff < 0 ? "center bottom" : (diff > 0 ? "center top" : "center center"),
                        userSelect: "none",
                        transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: isActive ? "rgba(249, 122, 53, 0.12)" : "rgba(255, 255, 255, 0.04)",
                          border: isActive ? "1px solid rgba(249, 122, 53, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: isActive ? C.accentOrange : "rgba(255, 255, 255, 0.4)",
                          transition: "all 0.35s ease",
                        }}
                      >
                        {trade.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: isActive ? C.textHeading : "rgba(255, 255, 255, 0.75)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            transition: "color 0.35s ease",
                          }}
                        >
                          {trade.lead}
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: isActive ? C.textBody : "rgba(255, 255, 255, 0.38)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            transition: "color 0.35s ease",
                          }}
                        >
                          {trade.example}
                        </div>
                      </div>
                      <motion.span
                        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="fm-badge fm-badge-booked"
                        style={{ fontSize: 11, pointerEvents: "none" }}
                      >
                        BOOKED
                      </motion.span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Center: Glowing Flow Connecting Line with Ultra-Thin Radiant Shimmer Laser */}
              <div
                className="hidden sm:flex items-center justify-center"
                style={{
                  width: 72,
                  height: 1,
                  background: "rgba(255, 255, 255, 0.08)",
                  position: "relative",
                  margin: "0 6px",
                  overflow: "hidden",
                }}
              >
                {/* Base glow hairline */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, rgba(249,122,53,0.15) 0%, rgba(249,122,53,0.4) 50%, rgba(249,122,53,0.15) 100%)",
                  }}
                />

                {/* High-velocity radiant shimmer laser wave */}
                <motion.div
                  key={`laser-${currTrade.id}`}
                  animate={{
                    x: ["-100%", "220%"],
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "45%",
                    background: `linear-gradient(90deg, transparent 0%, ${C.accentOrange} 30%, #FFFFFF 65%, ${C.accentOrange} 90%, transparent 100%)`,
                    boxShadow: "0 0 6px rgba(249, 122, 53, 0.8), 0 0 2px #FFFFFF",
                  }}
                />
              </div>

              {/* Right Column: Outcomes & Metrics Stack (Tailored to active trade) */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 236,
                  padding: "6px 0",
                  minWidth: 200,
                }}
                className="mt-4 sm:mt-0 sm:pl-2"
              >
                {/* Top Active Metric */}
                <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.45)", fontWeight: 500, paddingLeft: 6 }}>
                  {currTrade.metricTop}
                </div>

                {/* Middle Highlighted Pill Badge (Dark Glass + Thin 1px Orange Border) */}
                <motion.div
                  key={`pill-wrap-${currTrade.id}`}
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  style={{
                    background: "linear-gradient(180deg, rgba(14,21,38,0.96) 0%, rgba(10,15,28,0.98) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    color: "#FFFFFF",
                    borderRadius: 999,
                    padding: "10px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    boxShadow: "0 14px 30px rgba(0, 0, 0, 0.5), 0 0 16px rgba(249, 122, 53, 0.2)",
                    border: "1px solid rgba(249, 122, 53, 0.55)",
                    width: "fit-content",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ color: C.accentOrange, display: "flex", alignItems: "center" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                    {currTrade.metric}
                  </span>
                </motion.div>

                {/* Bottom Active Metric */}
                <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.45)", fontWeight: 500, paddingLeft: 6 }}>
                  {currTrade.metricBottom}
                </div>
              </div>
            </div>
          </div>
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
  const pCopy = PROBLEM_COPY[mode] || PROBLEM_COPY.main;
  const reducedMotion = useReducedMotion();

  return (
    <section className="fm-island" style={{ background: C.bgPrimary, padding: "56px 0 0", zIndex: 4, position: "relative", overflow: "hidden" }}>
      {/* Subtle ambient background glow */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: 500, background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,122,53,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="fm-wrap" style={{ position: "relative", zIndex: 1 }}>
        <Reveal className="fm-sechead" style={{ marginBottom: 48, maxWidth: 840, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ color: C.accentOrange, letterSpacing: "0.14em", fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", marginBottom: 20, fontFamily: "var(--font-outfit), sans-serif" }}>
            {pCopy.eyebrow}
          </div>

          <h2 style={{
            fontFamily: '"Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 4.4vw, 54px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: C.textHeading,
            maxWidth: 780,
            margin: "0 auto 20px"
          }}>
            <ScrollTextReveal text={pCopy.headline} as="span" />
          </h2>

          <div style={{ maxWidth: 720, margin: "0 auto", fontSize: "clamp(15px, 1.8vw, 16.5px)", lineHeight: 1.6, color: "rgba(255, 255, 255, 0.7)" }}>
            <ScrollTextReveal text={pCopy.body} as="p" />
          </div>
        </Reveal>

        {/* Comparison Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "stretch", maxWidth: 960, margin: "0 auto" }}>
          <Reveal style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 28, padding: "48px 32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2 }}>
              <div style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.75)", fontWeight: 600, marginBottom: 16 }}>Missed calls without Foreman:</div>
              <div className="fm-statnum" style={{ fontSize: "clamp(48px, 6vw, 68px)", fontWeight: 800, color: "#B8BFCC" }}>40%</div>
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ position: "relative" }}>
            <div className="fm-hoverlift" style={{ background: C.accentOrange, borderRadius: 28, padding: "48px 32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2, boxShadow: "0 20px 40px rgba(242, 105, 28, 0.25)" }}>
              <div style={{ fontSize: 16, color: C.bgPrimary, fontWeight: 700, marginBottom: 16 }}>Missed calls:</div>
              <div className="fm-statnum" style={{ fontSize: "clamp(48px, 6vw, 68px)", fontWeight: 800, color: C.bgPrimary, position: "relative", display: "inline-block" }}>
                0%
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: "spring" }}
                  style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", width: "170%", height: "170%", pointerEvents: "none" }}
                >
                  <DoodleCircle style={{ width: "100%", height: "100%" }} />
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Animated Watermark Ribbon placed directly at the bottom of the cards */}
      <div style={{ width: "100%", overflow: "hidden", pointerEvents: "none", userSelect: "none", marginTop: "50px", paddingBottom: "16px", position: "relative", zIndex: 0 }}>
        <motion.div
          aria-hidden
          style={{
            whiteSpace: "nowrap",
            fontSize: "clamp(120px, 15vw, 175px)",
            fontWeight: 900,
            fontFamily: "var(--font-outfit), sans-serif",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.038)",
            display: "flex",
            width: "max-content",
          }}
          animate={reducedMotion ? {} : { x: ["0%", "-50%"] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        >
          <span>ANSWERED QUALIFIED BOOKED &nbsp; ANSWERED QUALIFIED BOOKED &nbsp; ANSWERED QUALIFIED BOOKED &nbsp;</span>
          <span>ANSWERED QUALIFIED BOOKED &nbsp; ANSWERED QUALIFIED BOOKED &nbsp; ANSWERED QUALIFIED BOOKED &nbsp;</span>
        </motion.div>
      </div>
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

function WidgetBilingual() {
  const reducedMotion = useReducedMotion();
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
  }, [phrases.length]);

  const current = phrases[langIndex];

  return (
    <div style={{
      marginTop: 12,
      padding: "16px 18px",
      borderRadius: 16,
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
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

function WidgetEmergency() {
  const reducedMotion = useReducedMotion();
  const [alertIndex, setAlertIndex] = useState(0);
  const alerts = [
    {
      code: "EMRG-04",
      category: "WATER DAMAGE",
      label: "Burst Pipe / Active Flooding",
      severity: "CRITICAL",
      dispatch: "Priority #1 Dispatch",
      type: "water"
    },
    {
      code: "CRIT-01",
      category: "FREEZE RISK",
      label: "No Heat / Sub-Zero Threat",
      severity: "CRITICAL",
      dispatch: "Priority #1 Dispatch",
      type: "freeze"
    },
    {
      code: "HAZ-99",
      category: "HAZMAT RISK",
      label: "Gas Smell / Furnace Leak",
      severity: "HIGH HAZARD",
      dispatch: "Priority #1 Dispatch",
      type: "gas"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [alerts.length]);

  const activeAlert = alerts[alertIndex];

  return (
    <div style={{
      marginTop: 12,
      padding: "14px 16px",
      borderRadius: 14,
      background: "rgba(10, 15, 28, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.5)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: 140,
      justifyContent: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Subtle top laser scan line */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "40%",
          height: 1.5,
          background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
          opacity: 0.9
        }}
      />

      {/* Telemetry Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ position: "relative", width: 8, height: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.span
              animate={reducedMotion ? {} : { scale: [1, 2.2], opacity: [0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid #EF4444",
                pointerEvents: "none"
              }}
            />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
          </div>
          <span className="fm-mono" style={{ fontSize: 10, fontWeight: 800, color: "#FCA5A5", letterSpacing: 1.2, textTransform: "uppercase" }}>
            EMERGENCY TRIAGE
          </span>
        </div>

        <div style={{
          fontSize: 9.5,
          fontWeight: 700,
          fontFamily: "monospace",
          color: "#EF4444",
          background: "rgba(239, 68, 68, 0.12)",
          padding: "2.5px 8px",
          borderRadius: 6,
          border: "1px solid rgba(239, 68, 68, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: 4
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          0.1s INSTANT
        </div>
      </div>

      {/* Dynamic Alert Banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAlert.code}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          style={{
            background: "rgba(18, 24, 38, 0.85)",
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(239, 68, 68, 0.25)",
            display: "flex",
            flexDirection: "column",
            gap: 7
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {activeAlert.type === "water" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                ) : activeAlert.type === "freeze" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2"><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M20 16l-4-4 4-4" /><path d="M4 8l4 4-4 4" /><path d="M16 4l-4 4-4-4" /><path d="M8 20l4-4 4 4" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2.2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                )}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 700, color: "#EF4444" }}>
                    {activeAlert.code}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.5 }}>
                    {activeAlert.category}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#FFFFFF", marginTop: 1 }}>
                  {activeAlert.label}
                </div>
              </div>
            </div>

            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#EF4444",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "monospace"
            }}>
              {activeAlert.severity}
            </span>
          </div>

          {/* Action dispatch status footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 10.5,
            background: "rgba(0, 0, 0, 0.3)",
            padding: "5px 8px",
            borderRadius: 6,
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#E2E8F0" }}>
              <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Action:</span>
              <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{activeAlert.dispatch}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#34D399", fontWeight: 700, fontSize: 10 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Owner Alerted
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WidgetSMS() {
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
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
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

function WidgetLiveAudio() {
  const reducedMotion = useReducedMotion();
  return (
    <div style={{
      marginTop: 12,
      padding: "16px 18px",
      borderRadius: 16,
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
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

function WidgetRevenue() {
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
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const basePcts = [30, 42, 55, 68, 78, 90, 100];

  return (
    <div style={{
      marginTop: 12,
      padding: "16px 18px",
      borderRadius: 16,
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
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

function WidgetReviews() {
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
      background: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
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
            key="review-quote"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            style={{ fontSize: 12, color: "#FFFFFF", fontStyle: "italic", background: "rgba(255,255,255,0.06)", padding: "8px 10px", borderRadius: 8, borderLeft: "3px solid #FACC15" }}
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

function FeatureGraphicWidget({ title }: { title: string }) {
  const t = title.toLowerCase();
  if (t.includes("english") || t.includes("spanish") || t.includes("bilingual")) {
    return <WidgetBilingual />;
  }
  if (t.includes("emergenc") || t.includes("triage") || t.includes("first")) {
    return <WidgetEmergency />;
  }
  if (t.includes("text") || t.includes("missed") || t.includes("volume")) {
    return <WidgetSMS />;
  }
  if (t.includes("listen") || t.includes("control") || t.includes("trained") || t.includes("details")) {
    return <WidgetLiveAudio />;
  }
  if (t.includes("money") || t.includes("dashboard") || t.includes("price")) {
    return <WidgetRevenue />;
  }
  return <WidgetReviews />;
}

function FlipFeatureCard({
  feat,
  index,
  onCardHover,
  onCardLeave
}: {
  feat: { title: string; desc: string; icon: any };
  index: number;
  onCardHover?: () => void;
  onCardLeave?: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fm-featcard-wrapper"
      onMouseEnter={() => {
        setIsFlipped(true);
        onCardHover?.();
      }}
      onMouseLeave={() => {
        setIsFlipped(false);
        onCardLeave?.();
      }}
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
        <div className="fm-featcard-face" style={{
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
            ? "0 24px 60px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.08)"
            : "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          transition: "border-color 300ms ease, box-shadow 300ms ease"
        }}>
          {/* Top Subtle Accent Line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)`
          }} />

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <motion.div
                animate={reducedMotion ? {} : { y: [-4, 4], rotate: [0, -4, 4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: index * 0.15 }}
                style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 10px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
                  color: C.accentOrange, display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <div style={{ filter: `drop-shadow(0 4px 12px ${C.accentOrange}60)` }}>{feat.icon}</div>
              </motion.div>

              <span className="fm-mono" style={{
                fontSize: 12, fontWeight: 900, letterSpacing: 1.5, color: "#E2E8F0",
                background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "5px 12px", borderRadius: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
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

        {/* BACK FACE OF CARD */}
        <div className="fm-featcard-face" style={{
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
          border: `1px solid rgba(249, 122, 53, 0.4)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 25px rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden"
        }}>
          {/* Top Subtle Accent Line */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)"
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
  const reducedMotion = useReducedMotion();
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Framer Motion spring physics cursor tracking
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const springX = useSpring(rawX, { stiffness: 420, damping: 28, mass: 0.12 });
  const springY = useSpring(rawY, { stiffness: 420, damping: 28, mass: 0.12 });

  const dotX = useSpring(rawX, { stiffness: 950, damping: 38, mass: 0.05 });
  const dotY = useSpring(rawY, { stiffness: 950, damping: 38, mass: 0.05 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    rawX.set(e.clientX - rect.left);
    rawY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => {
        setIsSectionHovered(false);
        setHoveredIndex(null);
      }}
      onMouseMove={handleMouseMove}
      className="fm-island"
      style={{
        background: C.bgCard,
        padding: "64px 0",
        zIndex: 7,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Dynamic Background Glow Effect on Section Mouse Move */}
      <motion.div
        style={{
          position: "absolute",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 1,
          opacity: isSectionHovered ? 1 : 0,
          transition: "opacity 300ms ease",
          filter: "blur(30px)"
        }}
      />

      {/* MINIMALIST SMALL FRAMER MOTION POINTER CIRCLE (CARD HOVER ONLY) */}
      <AnimatePresence>
        {hoveredIndex !== null && !reducedMotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 99,
            }}
          >
            {/* Minimalist Outer Ring (More Small) */}
            <motion.div
              style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                position: "absolute",
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  border: `1.5px solid ${C.accentOrange}`,
                  boxShadow: `0 0 12px ${C.accentOrange}60, inset 0 0 6px ${C.accentOrange}30`,
                  background: `radial-gradient(circle, ${C.accentOrange}20 0%, transparent 70%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </motion.div>

            {/* Precision Center Dot (A Little Bigger) */}
            <motion.div
              style={{
                x: dotX,
                y: dotY,
                translateX: "-50%",
                translateY: "-50%",
                position: "absolute",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: C.accentOrange,
                  boxShadow: `0 0 12px ${C.accentOrange}, 0 0 4px #FFFFFF`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
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
            {fCopy.headline}
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
                <FlipFeatureCard
                  feat={feat}
                  index={i}
                  onCardHover={() => setHoveredIndex(i)}
                  onCardLeave={() => setHoveredIndex(null)}
                />
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

function WaterWavesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1, once: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const mousePos = useRef({ x: -1000, y: -1000 });
  const aiSparkle = useRef({
    x: -200,
    y: -200,
    vx: 0,
    vy: 0,
    rotation: 0,
    trail: [] as { x: number; y: number; alpha: number; size: number }[],
  });

  useEffect(() => {
    if (isMobile || reducedMotion || !isInView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    // Cap DPR at 1 — was Math.min(devicePixelRatio, 2) which on phones means 2×
    // the canvas pixels to fill, doubling fill-rate cost.
    const dpr = 1;
    let width = 0;
    let height = 0;

    let resizeTicking = false;
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    const onResize = () => {
      if (!resizeTicking) {
        resizeTicking = true;
        window.requestAnimationFrame(() => {
          handleResize();
          resizeTicking = false;
        });
      }
    };

    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let time = 0;
    let lastTs = 0;
    // Throttle to ~30 fps on desktop too — the waves look identical at 30fps
    const FRAME_INTERVAL = 1000 / 30;

    const render = (ts: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (ts - lastTs < FRAME_INTERVAL) return;
      lastTs = ts;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      // Step doubled vs original since we run at half the frame rate
      time += 0.005;

      // Coarser grid — fewer sin/cos calls per frame, same visual character
      const stepX = 32;
      const stepY = 26;
      const cols = Math.ceil(width / stepX) + 1;
      const rows = Math.ceil(height / stepY) + 1;

      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0, "rgba(56, 189, 248, 0.35)");
      strokeGrad.addColorStop(0.5, "rgba(14, 165, 233, 0.55)");
      strokeGrad.addColorStop(1, "rgba(168, 85, 247, 0.45)");
      ctx.strokeStyle = strokeGrad;

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const x = c * stepX;
          const y = r * stepY;

          const wave1 = Math.sin(x * 0.01 + time * 2.2) * Math.cos(y * 0.008 + time * 1.8);
          const wave2 = Math.sin((x + y) * 0.007 - time * 1.9) * 0.7;
          const wave3 = Math.cos(x * 0.015 - y * 0.01 + time * 2.8) * 0.4;

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let mouseRipple = 0;
          if (dist < 180) {
            mouseRipple = Math.sin(dist * 0.08 - time * 6) * ((180 - dist) / 180) * 26;
          }

          const elevation = (wave1 + wave2 + wave3) * 36 + mouseRipple;
          const depthRatio = y / height;
          const projX = x + Math.sin(time * 1.5 + y * 0.012) * (1 - depthRatio) * 10;
          const projY = y + elevation;

          if (c === 0) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }

        const normY = r / rows;
        ctx.globalAlpha = Math.min(0.45, Math.max(0.08, (1 - normY * 0.7) * 0.4 + 0.08));
        ctx.lineWidth = normY > 0.4 ? 1.8 : 1.2;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Sparkles: no per-particle shadowBlur (shadowBlur is GPU-expensive)
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 12; i++) {
        const sx = (Math.sin(i * 77 + time * 1.2) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 44 + time * 1.4) * 0.5 + 0.5) * height;
        ctx.globalAlpha = (Math.sin(time * 4 + i) * 0.5 + 0.5) * 0.55;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const isHovering = mx > 0 && mx < width && my > 0 && my < height;

      if (isHovering) {
        const star = aiSparkle.current;
        if (star.x < 0 || star.y < 0) {
          star.x = mx + 30;
          star.y = my + 30;
        }

        const fdx = mx - star.x;
        const fdy = my - star.y;
        const fdist = Math.sqrt(fdx * fdx + fdy * fdy);

        if (fdist > 8) {
          const targetSpeed = Math.min(7, fdist * 0.1);
          const angle = Math.atan2(fdy, fdx);
          star.vx += (Math.cos(angle) * targetSpeed - star.vx) * 0.14;
          star.vy += (Math.sin(angle) * targetSpeed - star.vy) * 0.14;
        } else {
          star.vx *= 0.82;
          star.vy *= 0.82;
        }

        star.x += star.vx;
        star.y += star.vy;
        star.rotation += 0.06;

        if (Math.hypot(star.vx, star.vy) > 0.5) {
          star.trail.push({
            x: star.x + (Math.random() - 0.5) * 10,
            y: star.y + (Math.random() - 0.5) * 10,
            alpha: 0.9,
            size: Math.random() * 3 + 1.5,
          });
        }
        if (star.trail.length > 12) star.trail.shift();

        star.trail.forEach((p) => {
          p.alpha -= 0.05;
          if (p.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = "#38BDF8";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#38BDF8";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });

        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.rotation);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#38BDF8";
        ctx.globalAlpha = 0.98;

        const outerR = 18;
        const innerR = 4.5;

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const starGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
        starGrad.addColorStop(0, "#FFFFFF");
        starGrad.addColorStop(0.4, "#38BDF8");
        starGrad.addColorStop(1, "#A855F7");

        ctx.fillStyle = starGrad;
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        aiSparkle.current.x = -200;
        aiSparkle.current.y = -200;
        aiSparkle.current.trail = [];
      }

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, isMobile, reducedMotion]);

  if (isMobile || reducedMotion) {
    return (
      <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.22) 0%, rgba(15, 23, 42, 0.98) 65%, rgba(5, 8, 18, 1) 100%)"
        }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Deep Ocean Liquid Radial Gradient (Full Height) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.28) 0%, rgba(15, 23, 42, 0.98) 65%, rgba(5, 8, 18, 1) 100%)"
        }}
      />

      {/* Floating 3D Caustics Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.65, 0.3],
          x: [0, 60, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.1) 55%, transparent 75%)",
          filter: "blur(65px)"
        }}
      />

      <motion.div
        animate={{
          scale: [1.25, 0.95, 1.3],
          opacity: [0.25, 0.6, 0.25],
          x: [0, -60, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(124, 58, 237, 0.08) 55%, transparent 75%)",
          filter: "blur(75px)"
        }}
      />

      {/* 3D Water Waves Liquid Tide Flowing Up on Scroll Down & Receding Down on Scroll Up */}
      <motion.div
        initial={{ clipPath: "inset(98% 0% 0% 0%)", opacity: 0 }}
        animate={isInView ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : { clipPath: "inset(98% 0% 0% 0%)", opacity: 0 }}
        transition={{ duration: 4.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </motion.div>
    </div>
  );
}

function FinalCTA({ mode = "main" }: { mode?: LandingMode }) {
  const content = CTA_COPY[mode] || CTA_COPY.main;

  return (
    <section id="pilot" style={{ background: "#050812", padding: "80px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <WaterWavesBackground />
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
            {content.headline}
          </h2>
          <p className="fm-secsub" style={{ maxWidth: 600, margin: "0 auto", marginTop: 16 }}>
            {content.sub}
          </p>
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
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/76.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/86.jpg",
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
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
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

/* ================================================================== */
/*  3D TESTIMONIAL FAN CAROUSEL (Fanned 3D Deck with Ambient Glow)    */
/* ================================================================== */
const Testimonial3DCard = memo(function Testimonial3DCard({
  item,
  isCenter,
  xOffset,
  yOffset,
  scale,
  rotateY,
  rotateZ,
  opacity,
  zIndex,
  isPaused,
  onClick,
}: {
  item: typeof TESTIMONIALS[0];
  isCenter: boolean;
  xOffset: number;
  yOffset: number | number[];
  scale: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
  zIndex: number;
  isPaused: boolean;
  onClick: () => void;
}) {
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${spotlightX}px ${spotlightY}px, rgba(255, 255, 255, 0.08), transparent 80%)`;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCenter) return;
    const rect = e.currentTarget.getBoundingClientRect();
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        x: xOffset,
        y: yOffset,
        scale: scale,
        rotateY: rotateY,
        rotateZ: rotateZ,
        opacity: opacity,
        zIndex: zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 22,
        mass: 0.8,
      }}
      whileHover={isCenter ? { scale: 1.02, y: -6 } : { scale: scale * 1.03 }}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: 350,
        minHeight: 270,
        padding: "24px 22px 20px",
        borderRadius: 18,
        background: `linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(10, 15, 28, 0.98) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${isCenter ? "rgba(249, 122, 53, 0.45)" : "rgba(249, 122, 53, 0.16)"}`,
        boxShadow: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
        filter: isCenter ? "none" : "blur(0.5px)",
        overflow: "hidden",
      }}
    >
      {/* Sleek Top Progress Bar Pill */}
      <div
        style={{
          position: "relative",
          zIndex: 15,
          width: 120,
          height: 1.5,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: 999,
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        {isCenter && (
          <motion.div
            key={item.author}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3.5,
              ease: "linear",
            }}
            style={{
              height: "100%",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.accentOrange}, #FFA466)`,
              boxShadow: "none",
            }}
          />
        )}
      </div>

      {/* Dynamic Cursor Spotlight Glow Effect */}
      {isCenter && (
        <motion.div
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: -1,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 300ms ease",
            background: spotlightBg,
            zIndex: 1,
          }}
        />
      )}

      {/* Quote Body */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center" }}>
        <p
          style={{
            color: "#E2E8F0",
            fontSize: 14.5,
            lineHeight: 1.55,
            fontWeight: 400,
            margin: 0,
            fontFamily: "var(--font-outfit), sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;{item.quote} {item.highlight}&rdquo;
        </p>
      </div>

      {/* Author & Role Footer */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src={item.avatarUrl}
          alt={item.author}
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          style={{
            width: 44,
            height: 44,
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "none",
            flexShrink: 0,
          }}
        />
        <div>
          <h4
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: 15,
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {item.author}
          </h4>
          <p
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 400,
              color: "#94A3B8",
              fontSize: 11.5,
              margin: "2px 0 0",
            }}
          >
            {item.title} &bull; {item.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

function Testimonials3DFanDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(false);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    setIsPaused(false);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ position: "relative", width: "100%", maxWidth: 1100, margin: "0 auto 40px", padding: "20px 0" }}
    >
      {/* 3D Container Stage */}
      <div
        style={{
          position: "relative",
          height: 360,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: 1200,
          perspectiveOrigin: "50% 50%",
        }}
      >
        {TESTIMONIALS.map((item, i) => {
          let offset = i - activeIndex;
          const total = TESTIMONIALS.length;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          const xOffset = offset * 280;
          const scale = isCenter ? 1 : 0.85 - Math.abs(offset) * 0.05;
          const rotateY = 0;
          const rotateZ = 0;
          const opacity = isCenter ? 1 : Math.max(0.3, 0.65 - (Math.abs(offset) - 1) * 0.35);
          const zIndex = 30 - Math.abs(offset) * 10;
          const yOffset = isCenter ? [-25, 0] : 15;

          return (
            <Testimonial3DCard
              key={i}
              item={item}
              isCenter={isCenter}
              xOffset={xOffset}
              yOffset={yOffset}
              scale={scale}
              rotateY={rotateY}
              rotateZ={rotateZ}
              opacity={opacity}
              zIndex={zIndex}
              isPaused={isPaused}
              onClick={() => handleCardClick(i)}
            />
          );
        })}
      </div>

      {/* Sleek Thin Numbered Bar Controls: 01 ── 02 ─ 03 ─ 04 ─ 05 ─ 06 ─ */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginTop: 24 }}>
        {TESTIMONIALS.map((_, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? C.textHeading : "rgba(255, 255, 255, 0.4)",
                  fontFamily: "var(--font-outfit), sans-serif",
                  transition: "color 0.3s ease",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div
                style={{
                  width: isActive ? 36 : 14,
                  height: 2,
                  borderRadius: 999,
                  background: isActive ? C.accentOrange : "rgba(255, 255, 255, 0.15)",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3), ...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

  return (
    <section id="testimonials" className="fm-island" style={{ background: C.bgCard, padding: "72px 0 88px", zIndex: 7, overflow: "hidden", position: "relative" }}>
      {/* Background glow ambiance */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 400, background: `radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)`, filter: "blur(60px)", pointerEvents: "none" }} />

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
            Trusted by trade owners who build America.
          </h2>
          <p style={{ color: C.textBody, fontSize: 18, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            See how HVAC, plumbing, electrical, and restoration contractors turn missed calls into booked revenue every single day.
          </p>
        </Reveal>

        {/* 3D Fanned Testimonial Card Stack */}
        <Testimonials3DFanDeck />
      </div>

      {/* 
      <InfiniteDraggableMarquee items={row1} baseSpeed={-0.6} style={{ marginBottom: 20 }} />
      <InfiniteDraggableMarquee items={row2} baseSpeed={0.6} />
      */}
    </section>
  );
}

const TestimonialCard = memo(function TestimonialCard({ item }: { item: typeof TESTIMONIALS[0] }) {
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
              <img src={item.avatarUrl} alt={item.author} width={34} height={34} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
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
});

function InteractiveEyeballs({
  isHovered,
  mousePos,
  containerRect,
}: {
  isHovered: boolean;
  mousePos: { x: number; y: number };
  containerRect: DOMRect | null;
}) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeRotate, setEyeRotate] = useState(0);
  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const centerX = (containerRect?.width || 800) / 2;
  const centerY = (containerRect?.height || 200) / 2;

  const diffX = -(mousePos.x - centerX);
  const diffY = mousePos.y - centerY;
  const distance = Math.hypot(diffX, diffY) || 1;

  const maxShiftX = 8;
  const maxShiftY = 4;
  const shiftX = (diffX / Math.max(distance, 80)) * maxShiftX;
  const shiftY = (diffY / Math.max(distance, 80)) * maxShiftY;

  // Inverted Gaze rotation on mouse movement
  useEffect(() => {
    const deltaX = mousePos.x - prevPos.current.x;
    const targetRotate = Math.max(-25, Math.min(25, -deltaX * 2.5));
    setEyeRotate(targetRotate);
    prevPos.current = mousePos;
  }, [mousePos]);

  return (
    <motion.div
      animate={{
        opacity: isHovered ? 1 : 0,
        scale: isHovered ? (isBlinking ? 0.9 : 1) : 0.3,
        scaleY: isBlinking ? 0.05 : 1,
        rotate: eyeRotate,
        x: mousePos.x - 34,
        y: mousePos.y - 14,
      }}
      transition={{
        x: { type: "spring", stiffness: 550, damping: 28, mass: 0.35 },
        y: { type: "spring", stiffness: 550, damping: 28, mass: 0.35 },
        rotate: { type: "spring", stiffness: 350, damping: 20 },
        scaleY: { duration: 0.12 },
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        zIndex: 20,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.6))",
      }}
    >
      {/* Left Vertical Roundy Oval Eyeball */}
      <div
        style={{
          width: 22,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 35% 35%, #ffffff 0%, #e2e8f0 70%, #cbd5e1 100%)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ x: shiftX, y: shiftY }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          style={{
            width: 12,
            height: 14,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #1e293b 0%, #020617 85%)",
            border: `1px solid ${C.accentOrange}`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#000" }} />
          <div style={{ position: "absolute", top: 1, right: 2, width: 2.5, height: 2.5, borderRadius: "50%", background: "#ffffff" }} />
        </motion.div>
      </div>

      {/* Right Vertical Roundy Oval Eyeball */}
      <div
        style={{
          width: 22,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at 35% 35%, #ffffff 0%, #e2e8f0 70%, #cbd5e1 100%)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.5)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ x: shiftX, y: shiftY }}
          transition={{ type: "spring", stiffness: 450, damping: 22 }}
          style={{
            width: 12,
            height: 14,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #1e293b 0%, #020617 85%)",
            border: `1px solid ${C.accentOrange}`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#000" }} />
          <div style={{ position: "absolute", top: 1, right: 2, width: 2.5, height: 2.5, borderRadius: "50%", background: "#ffffff" }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ForemanWordmarkSection({ yText, opacityText, scaleText }: { yText: any; opacityText: any; scaleText: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRect || containerRef.current.getBoundingClientRect();
    if (!containerRect) setContainerRect(rect);
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        marginTop: 44,
        marginBottom: 32,
        borderTop: `1px solid ${C.borderPrimary}`,
        borderBottom: `1px solid ${C.borderPrimary}`,
        overflow: "hidden",
        padding: "60px 16px 44px",
        background: "rgba(255,255,255,0.012)",
        cursor: isHovered ? "none" : "default",
        userSelect: "none",
      }}
    >
      {/* Glowing backlight beam — subtle orange light shining through */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "140%",
          background: `radial-gradient(ellipse at center, rgba(249,122,53,0.12) 0%, rgba(249,122,53,0.03) 55%, transparent 75%)`,
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />

      <motion.div
        style={{
          y: yText,
          opacity: opacityText,
          scale: scaleText,
          transformOrigin: "bottom center",
          textAlign: "center",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(60px, 18vw, 270px)",
            lineHeight: 0.92,
            paddingBottom: 10,
            letterSpacing: "-0.045em",
            background: `linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.3) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 30px rgba(249,122,53,0.18)) drop-shadow(0 10px 25px rgba(0,0,0,0.4))",
          }}
        >
          FOREMAN
        </span>
      </motion.div>

      {/* Interactive Eyeballs with Dynamic Pupil Movement & Blinking */}
      <InteractiveEyeballs isHovered={isHovered} mousePos={mousePos} containerRect={containerRect} />
    </div>
  );
}

/* ================================================================== */
/*  FOOTER                                                             */
/* ================================================================== */
export function Footer({ hideIntegrations = false }: { hideIntegrations?: boolean }) {
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const yText = useTransform(scrollYProgress, [0.1, 0.95], [140, 0]);
  const opacityText = useTransform(scrollYProgress, [0.1, 0.95], [0.05, 1]);
  const scaleText = useTransform(scrollYProgress, [0.1, 0.95], [0.85, 1]);

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
    <footer
      ref={footerRef}
      style={{
        background: C.footerBg,
        color: C.textBody,
        paddingTop: 80,
        paddingBottom: 24,
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${C.borderPrimary}`,
      }}
    >

      {/* Background glow effects */}
      <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 1000, height: 400, background: `radial-gradient(ellipse at top, rgba(255,255,255,0.03), transparent 70%)`, pointerEvents: "none" }} />

      {/* Massive FOREMAN Background Text Watermark — Centered Above in Footer */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(80px, 20vw, 290px)",
            lineHeight: 0.85,
            letterSpacing: "-0.045em",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          FOREMAN
        </span>
      </div>

      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 60, marginBottom: 80, justifyContent: "space-between" }}>

          {/* Brand Column */}
          <div style={{ flex: "2 1 300px", paddingRight: 40 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, textDecoration: "none" }}>
              <Logo size={32} />
              <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: 20, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
            </Link>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textBody, marginBottom: 32, maxWidth: 360 }}>
              The AI front office built exclusively for the trades. We answer the phone, qualify the lead, and book the job directly into your calendar so you can focus on the work.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { id: "x", url: "https://x.com" },
                { id: "linkedin", url: "https://www.linkedin.com/company/foremanaii/?viewAsMember=true" },
                { id: "instagram", url: "https://www.instagram.com/foreman.ai_?igsh=MTVyampxZHo1OTJqNQ==" }
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
      </div>

      {/* Bottom Bar inside fm-wrap */}
      <div className="fm-wrap" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ paddingTop: 12, paddingBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ fontSize: 14, color: C.textBody, fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Foreman Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================== */
/*  PERSISTENT WIDGET                                                  */
/* ================================================================== */
function PersistentWidget() {
  return null;
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
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" stroke={o ? C.accentOrange : C.accentGreenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: `radial-gradient(ellipse at 50% -50%, rgba(255,255,255,0.05), transparent 70%)` }} />

      <div className="max-w-[1000px] mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="rounded-3xl border p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: C.bgCard, borderColor: C.borderPrimary }}
        >
          {/* Subtle noise texture or inner glow */}
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 60%)` }} />

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
              Pricing that only wins when you do.
            </h2>
            <div className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12">
              Foreman is priced to your business and only charges when it delivers. Most clients start with a pilot, so you can see exactly what it captures before you commit. You only pay when Foreman books you real work.
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
  const [open, setOpen] = useState<number | null>(null);
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
            <ScrollTextReveal text="Questions, Answered" as="span" />
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

// ------------------------------------------------------------------
// CINEMATIC WORKFLOW TRADE CONFIGURATION
// ------------------------------------------------------------------
interface WorkflowTradeItem {
  service: string;
  issue: string;
  caller: string;
  avatar: string;
  phone: string;
  location: string;
  tech: string;
  techInitial: string;
  smsConfirm: string;
  smsTracking: string;
  crmApp: string;
  revenue: string;
}

const WORKFLOW_TRADE_DATA: Record<string, WorkflowTradeItem> = {
  hvac: {
    service: "HVAC Repair",
    issue: "No Cooling",
    caller: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    phone: "+1 (512) 849-2041",
    location: "Austin TX",
    tech: "Mike (Tech)",
    techInitial: "M",
    smsConfirm: "Hi Mike! Your HVAC repair is confirmed for today between 2-4 PM. Your tech is Mike.",
    smsTracking: "Great! Tech Mike will send live tracking when en route.",
    crmApp: "Housecall Pro",
    revenue: "+$650",
  },
  plumbing: {
    service: "Emergency Plumbing",
    issue: "Basement Pipe Leak",
    caller: "Sarah Miller",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    phone: "+1 (512) 692-4118",
    location: "Austin TX",
    tech: "Dave (Plumber)",
    techInitial: "D",
    smsConfirm: "Hi Sarah! Your plumbing visit is confirmed for today between 2-4 PM. Your tech is Dave.",
    smsTracking: "Great! Tech Dave is dispatched with leak repair kit.",
    crmApp: "ServiceTitan",
    revenue: "+$520",
  },
  electrical: {
    service: "Electrical Repair",
    issue: "Breaker Tripping",
    caller: "Robert Davis",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    phone: "+1 (512) 731-9032",
    location: "Austin TX",
    tech: "Alex (Electrician)",
    techInitial: "A",
    smsConfirm: "Hi Robert! Your electrical inspection is confirmed for today between 2-4 PM. Your electrician is Alex.",
    smsTracking: "Great! Tech Alex will arrive with panel diagnostics equipment.",
    crmApp: "Jobber",
    revenue: "+$480",
  },
  roofing: {
    service: "Roof Inspection",
    issue: "Storm Shingle Damage",
    caller: "Emily Clark",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    phone: "+1 (512) 554-1290",
    location: "Austin TX",
    tech: "Carlos (Roofer)",
    techInitial: "C",
    smsConfirm: "Hi Emily! Your roof inspection is confirmed for today between 2-4 PM. Your inspector is Carlos.",
    smsTracking: "Great! Inspector Carlos will provide a drone roof damage report.",
    crmApp: "AccuLynx",
    revenue: "+$1,850",
  },
  pest: {
    service: "Pest Treatment",
    issue: "Termite Activity",
    caller: "Brian Kelly",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    phone: "+1 (512) 388-7612",
    location: "Austin TX",
    tech: "Sam (Exterminator)",
    techInitial: "S",
    smsConfirm: "Hi Brian! Your pest treatment is confirmed for today between 2-4 PM. Your specialist is Sam.",
    smsTracking: "Great! Specialist Sam is en route with perimeter treatment gear.",
    crmApp: "FieldRoutes",
    revenue: "+$420",
  },
  garage: {
    service: "Garage Door Repair",
    issue: "Broken Torsion Spring",
    caller: "Karen White",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    phone: "+1 (512) 419-8803",
    location: "Austin TX",
    tech: "Jason (Tech)",
    techInitial: "J",
    smsConfirm: "Hi Karen! Your garage door repair is confirmed for today between 2-4 PM. Your tech is Jason.",
    smsTracking: "Great! Tech Jason is bringing high-cycle replacement springs.",
    crmApp: "Housecall Pro",
    revenue: "+$390",
  },
  restoration: {
    service: "Water Restoration",
    issue: "Flooded Crawlspace",
    caller: "David Wilson",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    phone: "+1 (512) 902-3341",
    location: "Austin TX",
    tech: "Chris (Lead Tech)",
    techInitial: "C",
    smsConfirm: "Hi David! Emergency restoration crew is dispatched for 2:00 PM. Crew lead is Chris.",
    smsTracking: "Great! Crew lead Chris is on the way with industrial extractors.",
    crmApp: "Encircle",
    revenue: "+$2,400",
  },
  "property-management": {
    service: "Maintenance Dispatch",
    issue: "Tenant AC Failure",
    caller: "Jennifer Taylor",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    phone: "+1 (512) 670-2294",
    location: "Austin TX",
    tech: "Mark (Maintenance)",
    techInitial: "M",
    smsConfirm: "Hi Jennifer! Maintenance dispatch confirmed for Unit 4B at 2:00 PM. Tech is Mark.",
    smsTracking: "Great! Tech Mark is en route with work order #4819.",
    crmApp: "AppFolio",
    revenue: "+$350",
  },
  "law-firm": {
    service: "Legal Intake",
    issue: "Auto Accident Consultation",
    caller: "Marcus Evans",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    phone: "+1 (512) 819-4502",
    location: "Austin TX",
    tech: "Sarah (Attorney)",
    techInitial: "S",
    smsConfirm: "Hi Marcus! Consultation confirmed for today at 2:00 PM with Attorney Sarah.",
    smsTracking: "Great! Attorney Sarah is preparing your case evaluation file.",
    crmApp: "Clio",
    revenue: "+$1,500",
  },
};

/* ================================================================== */
/*  CINEMATIC WORKFLOW (S-CURVE)                                      */
/* ================================================================== */
export function CinematicWorkflow({ tradeId = "hvac" }: { tradeId?: string }) {
  const data = WORKFLOW_TRADE_DATA[tradeId] || WORKFLOW_TRADE_DATA.hvac;
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
      <div style={{ position: "absolute", top: "20%", left: "30%", width: "40%", height: 600, background: "radial-gradient(ellipse, rgba(167,139,250,0.04) 0%, transparent 60%)", filter: "blur(80px)", pointerEvents: "none" }} />

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
            style={{ pathLength: activeProgress }}
          />
        </svg>

        {/* Mobile Vertical Pipeline */}
        <div className="fm-cinematic-line-mobile">
          <motion.div
            style={{ width: "100%", height: "100%", background: C.accentOrange, transformOrigin: "top", scaleY: activeProgress }}
          />
        </div>

        {/* 3x3 Grid Layout */}
        <div className="fm-cinematic-grid">
          <div className="fm-cinematic-step step1"><StepPhone active={step >= 1} data={data} /></div>
          <div className="fm-cinematic-step step2"><StepAI active={step >= 2} listens={step >= 3} /></div>
          <div className="fm-cinematic-step step4"><StepQualification active={step >= 4} data={data} /></div>

          <div ref={row2Ref} className="fm-cinematic-step step5"><StepAppointment active={step >= 5} data={data} /></div>
          <div className="fm-cinematic-step step6"><StepCalendar active={step >= 6} /></div>
          <div className="fm-cinematic-step step7"><StepDispatch active={step >= 7} data={data} /></div>

          <div ref={row3Ref} className="fm-cinematic-step step8"><StepSMS active={step >= 8} data={data} /></div>
          <div className="fm-cinematic-step step9"><StepCRM active={step >= 9} data={data} /></div>
          <div className="fm-cinematic-step step10"><StepRevenue active={step >= 10} data={data} /></div>
        </div>

      </div>
    </section>
  );
}

// ------------------------------------------------------------------
// STEP COMPONENTS (Strict 8px Grid System & Alignment)
// ------------------------------------------------------------------

function StepPhone({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accentOrange }}>1 INCOMING CALL</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: `1px solid ${active ? "rgba(249,122,53,0.35)" : "rgba(255,255,255,0.08)"}`, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "none", position: "relative" }}>

        {/* Status Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(249,122,53,0.1)", border: "1px solid rgba(249,122,53,0.25)", padding: "4px 10px", borderRadius: 999, marginBottom: 2 }}>
          <motion.div animate={active ? { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accentOrange }} />
          <span style={{ color: C.accentOrange, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5 }}>INCOMING CALL</span>
        </div>

        {/* Caller Avatar */}
        <motion.div animate={active ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(96,165,250,0.5)", overflow: "hidden", background: "#1E293B", alignSelf: "center", margin: "12px auto" }}>
          <img src={data.avatar} alt={data.caller} width={52} height={52} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", aspectRatio: "1 / 1", objectFit: "cover" }} />
        </motion.div>

        {/* Caller Information */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 2, fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>{data.caller}</h3>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginBottom: 8, fontFamily: "monospace" }}>{data.phone}</p>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.3)", padding: "3.5px 12px", borderRadius: 999, marginTop: 4, marginBottom: 8 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
            <span style={{ color: "#60A5FA", fontSize: 11, fontWeight: 600 }}>{data.service}</span>
          </div>
        </div>

        {/* Live Audio Equalizer */}
        {active ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 16, margin: "2px 0" }}>
            {[0.4, 0.9, 0.6, 1, 0.5, 0.8, 0.3, 0.7].map((h, i) => (
              <motion.div key={i} animate={{ scaleY: [0.3, h, 0.3] }} transition={{ duration: 0.6, delay: i * 0.08, repeat: Infinity }} style={{ width: 2.5, height: 16, background: C.accentOrange, borderRadius: 2 }} />
            ))}
          </div>
        ) : (
          <div style={{ height: 16 }} />
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, opacity: active ? 1 : 0.5, transition: "opacity 0.3s", marginTop: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 3.41l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1="23" y1="1" x2="1" y2="23" /></svg>
          </div>
          <motion.div animate={active ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }} style={{ width: 40, height: 40, borderRadius: "50%", background: C.accentGreenText, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
          </motion.div>
        </div>

      </TiltCard>
    </div>
  );
}

function StepAI({ active, listens }: { active: boolean, listens: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#A78BFA" }}>
        {listens ? "3 AI LISTENS" : "2 AI ANSWERS"}
      </motion.div>
      <div style={{ width: 240, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 176, height: 176, display: "flex", alignItems: "center", justifyContent: "center" }}>

          {/* Core Glow */}
          <motion.div
            animate={active ? { scale: listens ? [1, 1.25, 1] : [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: listens ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.5) 0%, rgba(167,139,250,0) 70%)", filter: "blur(16px)" }}
          />

          {/* Orbiting particles when listening */}
          {listens && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#fff", position: "absolute", top: 12, left: "50%", boxShadow: "0 0 6px #fff" }} />
            </motion.div>
          ))}

          {/* 8px Grid Sized Central Orb (80px = 10 * 8) */}
          <motion.div
            animate={active ? { scale: [1, 1.05, 1] } : { scale: 0.9, opacity: 0.5 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #3B2A6B, #1A1235)", border: "1.5px solid rgba(167,139,250,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, boxShadow: "inset 0 0 16px rgba(167,139,250,0.3)" }}
          >
            {listens ? (
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} animate={{ scaleY: [0.4, 1.4, 0.4] }} transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} style={{ width: 3, height: 16, background: "#fff", borderRadius: 2 }} />
                ))}
              </div>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.5"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /></svg>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function StepQualification({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  const fields = [
    { label: "Customer", value: "Verified" },
    { label: "Service", value: data.service },
    { label: "Issue", value: data.issue },
    { label: "Priority", value: "Emergency" },
    { label: "Location", value: data.location }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#60A5FA" }}>4 QUALIFICATION</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        <div>
          <div style={{ fontSize: 16, color: "#fff", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 8, marginBottom: 12, fontFamily: "var(--font-outfit), sans-serif" }}>Qualification</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fields.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: active ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.2}s` }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{f.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{f.value}</span>
                  {active && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.2 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accentGreenText} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></motion.svg>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {active ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} style={{ marginTop: 16, background: "rgba(31,170,89,0.1)", border: "1px solid rgba(31,170,89,0.25)", borderRadius: 10, padding: 10, textAlign: "center", color: C.accentGreenText, fontWeight: 600, fontSize: 12, boxShadow: "0 4px 12px rgba(31,170,89,0.15)" }}>
            Ready to Book
          </motion.div>
        ) : (
          <div style={{ marginTop: 16, height: 38 }} />
        )}
      </TiltCard>
    </div>
  );
}

function StepAppointment({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#FBBF24" }}>5 SUGGESTION</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        {/* 48px Badge (6 * 8) */}
        <motion.div animate={active ? { scale: [0.9, 1], opacity: [0, 1] } : { opacity: 0.2 }} transition={{ duration: 0.5 }} style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(251,191,36,0.2)", alignSelf: "center", margin: "8px auto 4px auto" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 8px" }}>
          <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6, fontFamily: "var(--font-outfit), sans-serif", textAlign: "center" }}>Suggesting Time</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.4, margin: 0, textAlign: "center" }}>Cross-referencing availability for {data.location}.</p>
        </div>
        {active && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ width: "100%", background: "#151928", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", marginTop: 12, marginBottom: 4, textAlign: "center" }}>
            <div style={{ color: "#FBBF24", fontSize: 11, fontWeight: 600, marginBottom: 4, textAlign: "center" }}>FOUND SLOT</div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500, textAlign: "center" }}>Today, 2:00 PM</div>
          </motion.div>
        )}
      </TiltCard>
    </div>
  );
}

function StepCalendar({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#8AB4F8" }}>6 CALENDAR</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        {/* 48px Badge (6 * 8) */}
        <motion.div animate={active ? { rotateY: 360 } : {}} transition={{ duration: 0.8 }} style={{ width: 48, height: 48, borderRadius: 12, background: "#ffffff", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: "0 6px 12px rgba(0,0,0,0.3)", alignSelf: "center", margin: "0 auto 12px auto" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="18" rx="4" fill="#ffffff" />
            <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3H2V8z" fill="#4285F4" />
            <text x="12" y="19" fill="#4285F4" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">31</text>
          </svg>
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h3 style={{ fontSize: 14, color: "#9AA0A6", marginBottom: 4, fontWeight: 500, textAlign: "center" }}>Thursday</h3>
          <motion.div animate={active ? { scale: [0.9, 1.1, 1], color: ["#E8EAED", "#8AB4F8", "#E8EAED"] } : {}} transition={{ duration: 0.5, delay: 0.3 }} style={{ fontSize: 28, color: "#E8EAED", fontWeight: 700, marginBottom: 4, letterSpacing: -1, textAlign: "center" }}>2:00 PM</motion.div>
          <span style={{ color: "#9AA0A6", fontSize: 12, marginBottom: 16, textAlign: "center" }}>May 16, 2024</span>
        </div>

        <motion.div animate={{ opacity: active ? 1 : 0.2 }} style={{ background: "rgba(138,180,248,0.15)", border: "1px solid rgba(138,180,248,0.4)", padding: "8px 20px", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, alignSelf: "center" }}>
          <span style={{ color: "#8AB4F8", fontSize: 12, fontWeight: 700 }}>Booked</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8AB4F8" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </motion.div>
      </TiltCard>
    </div>
  );
}

function StepDispatch({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#38BDF8" }}>7 DISPATCH</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        {/* Map Background Simulation */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#0f172a", opacity: 0.5, zIndex: 0 }} />
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
          <path d="M 30 300 Q 80 200 150 150 T 200 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" strokeLinecap="round" />
          {active && (
            <motion.path
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M 30 300 Q 80 200 150 150 T 200 40" fill="none" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round"
            />
          )}
        </svg>

        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(15,23,42,0.85)", padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* 24px Avatar Badge */}
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11 }}>{data.techInitial}</div>
              <div>
                <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{data.tech}</div>
                <div style={{ color: "#38BDF8", fontSize: 10, fontWeight: 500 }}>Assigned</div>
              </div>
            </div>
          </div>

          {active && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }} style={{ position: "absolute", top: 24, right: 16, background: "#fff", padding: "4px 8px", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", color: "#000", fontSize: 11, fontWeight: 700 }}>
              ETA 14m
            </motion.div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

function StepSMS({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#34D399" }}>8 SMS SENT</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        {active && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} style={{ background: "#151928", padding: 10, borderRadius: 14, borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }}>
            <p style={{ color: "#fff", fontSize: 11, lineHeight: 1.35, margin: 0 }}>
              &quot;{data.smsConfirm}&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5 }}>Delivered</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </motion.div>
        )}
        {active && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }} style={{ background: "#34D399", padding: "6px 14px", borderRadius: 14, borderBottomRightRadius: 4, alignSelf: "flex-end", boxShadow: "0 6px 12px rgba(52,211,153,0.3)", marginTop: 8, marginBottom: 8 }}>
            <p style={{ color: "#000", fontSize: 11, fontWeight: 600, margin: 0 }}>YES</p>
          </motion.div>
        )}
        {active && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }} style={{ background: "#151928", padding: 10, borderRadius: 14, borderBottomLeftRadius: 4, border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 6px 16px rgba(0,0,0,0.3)", marginTop: 8 }}>
            <p style={{ color: "#fff", fontSize: 11, lineHeight: 1.35, margin: 0 }}>
              &quot;{data.smsTracking}&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 4 }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5 }}>Delivered</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </motion.div>
        )}
      </TiltCard>
    </div>
  );
}

function StepCRM({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  const steps = ["Customer Saved", "Estimate Generated", "Job Created"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#C084FC" }}>9 CRM UPDATED</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "var(--font-outfit), sans-serif" }}>{data.crmApp}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: active ? 1 : 0.2, transition: `opacity 0.4s ${i * 0.3}s` }}>
              {active ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.3, type: "spring" }} style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(192,132,252,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(192,132,252,0.4)" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </motion.div>
              ) : (
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
              )}
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 500 }}>{s}</span>
            </div>
          ))}
        </div>
      </TiltCard>
    </div>
  );
}

function StepRevenue({ active, data }: { active: boolean; data: WorkflowTradeItem }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <motion.div animate={{ opacity: active ? 1 : 0.4 }} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#F97A35" }}>10 COMPLETED</motion.div>
      <TiltCard style={{ width: 240, height: 320, background: "rgba(10,15,28,0.92)", backdropFilter: "blur(20px)", borderRadius: 24, border: "1px solid rgba(249,122,53,0.25)", padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.45)" }}>

        {/* Glow */}
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} style={{ position: "absolute", top: "50%", left: "50%", width: 140, height: 140, background: "radial-gradient(circle, rgba(249,122,53,0.15) 0%, transparent 70%)", transform: "translate(-50%, -50%)", zIndex: 0 }} />
        )}

        {/* 48px Currency Badge (6 * 8) */}
        <motion.div animate={active ? { scale: [0.9, 1.1, 1] } : {}} transition={{ duration: 0.6 }} style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, rgba(249,122,53,0.3), rgba(249,122,53,0.05))", border: "1px solid rgba(249,122,53,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, alignSelf: "center", margin: "0 auto 16px auto" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97A35" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        </motion.div>

        <h3 style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: 500, zIndex: 1, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>Job Completed</h3>

        {active ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring" }} style={{ fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 4, letterSpacing: -1.5, zIndex: 1, textAlign: "center" }}>
            {data.revenue}
          </motion.div>
        ) : (
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.1)", fontWeight: 700, marginBottom: 4, letterSpacing: -1.5, zIndex: 1, textAlign: "center" }}>$0</div>
        )}
      </TiltCard>
    </div>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export function ForemanLanding({ mode = "main" }: { mode?: LandingMode }) {
  const isMobile = useIsMobile();
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
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        syncTouch: false,
        smoothWheel: !isMobile,
      }}
    >
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
        <div id="how">
          <AnnotatedProof mode={mode} />
        </div>
        <div id="integrations">
          <IntegrationsRow />
        </div>
        {mode === "main" && <TradeSelector />}
        <StatComparison mode={mode} />
        <div id="features">
          <AdvancedFeatures mode={mode} />
        </div>
        <TestimonialsSection />
        {/* <FinalCTA mode={mode} /> */}
        {/* <Pricing /> */}
        <FAQ mode={mode} />
        <Footer />
        <PersistentWidget />
        <ScrollToTopButton />
      </main>
    </ReactLenis>
  );
}