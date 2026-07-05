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
  charcoal: "#0A0A0A",
  charcoal2: "#171717",
  charcoal3: "#050505",
  steel: "#737373",
  steelLight: "#A3A3A3",
  orange: "#F5A623",
  orangeDeep: "#D97706",
  concrete: "#121212",
  concrete2: "#262626",
  green: "#10B981",
  white: "#EDEDED",
};

/* ------------------------------------------------------------------ */
/*  Reusable: F-monogram logo                                          */
/* ------------------------------------------------------------------ */
function Logo({ size = 40, bg = C.orange, fg = C.charcoal }: { size?: number; bg?: string; fg?: string }) {
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
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.5, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: count-up number (animates when scrolled into view)       */
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
function TiltCard({ children, className, glowColor = "rgba(255,255,255,0.06)" }: { children: React.ReactNode, className?: string, glowColor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rx = useSpring(0, { damping: 20, stiffness: 300, mass: 0.5 });
  const ry = useSpring(0, { damping: 20, stiffness: 300, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
    rx.set(((y - height / 2) / height) * -12);
    ry.set(((x - width / 2) / width) * 12);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rx.set(0);
    ry.set(0);
  };
  
  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

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
      }}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
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
          transition={{ duration: 0.3 }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, transform: isHovered && !reducedMotion ? "translateZ(30px)" : "none", transition: "transform 0.3s" }}>
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
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function NavAuthLinks({
  className,
  onNavigate,
  renderDesktopItem,
}: {
  className: string;
  onNavigate?: () => void;
  renderDesktopItem?: (href: string, label: string) => React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobile();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fm-nav-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMobile}
        />
      )}

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.5)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid rgba(255,255,255,${scrolled ? 0.08 : 0})`,
          transition: "background .3s, border-color .3s",
        }}
      >
        <div
          className="fm-wrap fm-nav-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: scrolled ? 64 : 88,
            transition: "height 0.4s ease",
            gap: 16,
          }}
        >
          <a
            href="#top"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
            onClick={closeMobile}
          >
            <div style={{ transition: "transform 0.4s ease", transform: `scale(${scrolled ? 0.85 : 1})`, transformOrigin: "left center" }}>
              <Logo size={38} />
            </div>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: C.white,
                letterSpacing: "-0.5px",
              }}
            >
              Foreman
            </span>
          </a>

          <div className="fm-nav-desktop" onMouseLeave={() => setHoveredId(null)}>
            {NAV_SECTIONS.map((item) => (
              <a key={item.href} href={item.href} className="fm-navlink" onMouseEnter={() => setHoveredId(item.href)} style={{ position: "relative", padding: "8px 16px" }}>
                <span style={{ position: "relative", zIndex: 2 }}>{item.label}</span>
                {hoveredId === item.href && !reducedMotion && (
                  <motion.div layoutId="navHover" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", borderRadius: 999, zIndex: 1 }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
              </a>
            ))}
            <NavAuthLinks 
              className="fm-navlink" 
              renderDesktopItem={(href, label) => (
                <Link key={href} href={href} className="fm-navlink" onMouseEnter={() => setHoveredId(href)} style={{ position: "relative", padding: "8px 16px" }}>
                  <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
                  {hoveredId === href && !reducedMotion && (
                    <motion.div layoutId="navHover" style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.08)", borderRadius: 999, zIndex: 1 }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                  )}
                </Link>
              )}
            />
            <MagneticButton href="#pilot" className="fm-btn fm-btn-primary fm-nav-cta">
              Book a pilot call
            </MagneticButton>
          </div>

          <button
            type="button"
            className="fm-nav-toggle"
            aria-expanded={mobileOpen}
            aria-controls="fm-mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">
              {mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <NavMenuIcon open={mobileOpen} />
          </button>
        </div>

        <div
          id="fm-mobile-nav"
          className={`fm-nav-mobile${mobileOpen ? " fm-nav-mobile-open" : ""}`}
        >
          <div className="fm-wrap fm-nav-mobile-inner">
            {NAV_SECTIONS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="fm-nav-mobile-link"
                onClick={closeMobile}
              >
                {item.label}
              </a>
            ))}
            <NavAuthLinks
              className="fm-nav-mobile-link"
              onNavigate={closeMobile}
            />
            <a
              href="#pilot"
              className="fm-btn fm-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={closeMobile}
            >
              Book a pilot call
            </a>
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

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={reducedMotion ? {} : { scale: 1.04, boxShadow: "0 12px 34px rgba(245,166,35,0.4)" }}
      whileTap={{ scale: 0.97 }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.a>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yGrid = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const reducedMotion = useReducedMotion();

  return (
    <header id="top" ref={ref} style={{ background: C.charcoal, color: C.white, position: "relative", overflow: "hidden", padding: "120px 0 140px" }}>
      {/* 3D animated grid */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", inset: 0, top: "40%", y: yGrid, opacity: 0.08, zIndex: 0,
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          transform: "perspective(1000px) rotateX(70deg)",
          transformOrigin: "top center",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 70%, transparent)",
        }}
      />
      {/* moving glow */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute", top: -200, right: -180, width: 620, height: 620, y: yGlow, zIndex: 0,
          background: "radial-gradient(circle, rgba(245,166,35,0.15), transparent 70%)",
        }}
        animate={reducedMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="fm-wrap fm-hero-grid" style={{ position: "relative", zIndex: 2 }}>
        {/* left */}
        <div>
          <motion.div className="fm-eyebrow" style={{ color: C.orange }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            AI FRONT OFFICE FOR HVAC &amp; TRADES
          </motion.div>
          <h1 className="fm-h1">
            {["Never miss", "another "].map((line, i) => (
              <motion.span
                key={i}
                style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}
              >
                <motion.span
                  style={{ display: "inline-block" }}
                  initial={{ y: "120%", rotate: reducedMotion ? 0 : 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: [0.21, 0.5, 0.25, 1] }}
                >
                  {line}
                  {i === 1 && <span style={{ color: C.orange }}>job.</span>}
                </motion.span>
              </motion.span>
            ))}
          </h1>
          <motion.p className="fm-hero-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Foreman answers every missed call, qualifies the job, and books it into your calendar automatically. You only pay when we book you real work.
          </motion.p>
          <motion.div className="fm-hero-cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62 }}>
            <MagneticButton href="#pilot" className="fm-btn fm-btn-primary">
              Book your free pilot
            </MagneticButton>
            <motion.a href="#how" className="fm-btn fm-btn-ghost" whileHover={reducedMotion ? {} : { scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              See how it works
            </motion.a>
          </motion.div>
          <motion.div className="fm-hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {["No monthly fee during pilot", "Pay only per booking", "Live in 24 hours"].map((t) => (
              <span key={t}>
                <Check /> {t}
              </span>
            ))}
          </motion.div>
        </div>
        {/* right: live call card */}
        <motion.div initial={{ opacity: 0, x: 40, rotate: reducedMotion ? 0 : 3, y: 20 }} animate={{ opacity: 1, x: 0, rotate: 0, y: 0 }} transition={{ delay: 0.4, duration: 1, ease: [0.21, 0.5, 0.25, 1] }}>
          <CallCard />
        </motion.div>
      </div>
    </header>
  );
}

function CallCard() {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div 
      className="fm-callcard" 
      style={{
        background: "rgba(23,23,23,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
      }}
      animate={reducedMotion ? {} : { y: [-5, 5] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span className="fm-mono" style={{ fontSize: 12, letterSpacing: 2, color: C.steelLight }}>INCOMING CALLS</span>
        <motion.span className="fm-badge fm-badge-live" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }}>
          ● FOREMAN LIVE
        </motion.span>
      </div>
      {heroCalls.map((c, i) => (
        <motion.div
          key={i}
          className="fm-callrow"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 + i * 0.35, duration: 0.5 }}
        >
          <div className="fm-callic">
            <PhoneIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: C.white }}>{c.name}</div>
            <div style={{ fontSize: 13, color: C.steelLight }}>{c.sub}</div>
          </div>
          <motion.span
            className="fm-badge fm-badge-booked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 + i * 0.35, type: "spring", stiffness: 300 }}
          >
            BOOKED
          </motion.span>
        </motion.div>
      ))}
      <motion.div
        style={{ textAlign: "center", marginTop: 18, fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20, color: C.orange }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        3 jobs booked today
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  STAT BAR                                                           */
/* ================================================================== */
function StatBar() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const reducedMotion = useReducedMotion();

  const stats = [
    { render: () => <><CountUp to={30} />%</>, lbl: "of calls go unanswered", pre: "20-" },
    { render: () => <><CountUp to={8} suffix="K" /></>, lbl: "lost per missed job", pre: "$400-" },
    { render: () => "24/7", lbl: "Foreman never sleeps", pre: "" },
    { render: () => <CountUp to={50} prefix="$" />, lbl: "you pay per booking", pre: "" },
  ];
  return (
    <div ref={ref} style={{ background: C.charcoal2, color: C.white, padding: "64px 0", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.concrete2}`, borderBottom: `1px solid ${C.concrete2}` }}>
      {/* parallax background elements */}
      {!reducedMotion && (
         <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, y: yBg, opacity: 0.3, zIndex: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: "10%", left: "15%", width: 200, height: 200, background: "radial-gradient(circle, rgba(245,166,35,0.1), transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(16,185,129,0.05), transparent 70%)" }} />
         </motion.div>
      )}
      <div className="fm-wrap fm-statgrid" style={{ position: "relative", zIndex: 1 }}>
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{ textAlign: "center" }}>
              <div className="fm-statnum" style={{ color: C.orange }}>
                {s.pre}
                {s.render()}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.steelLight, marginTop: 4 }}>{s.lbl}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PROBLEM                                                            */
/* ================================================================== */
function Problem() {
  const cards = [
    { icon: <PhoneOff />, t: "Voicemail loses them", p: "About 80% of callers hang up on voicemail and dial the next shop on Google. That job is gone before you even see the missed call." },
    { icon: <Clock />, t: "After-hours is dead air", p: "Emergencies do not wait for business hours. The AC dies at 9pm, they call three shops, and whoever picks up wins the job." },
    { icon: <Dollar />, t: "Unpaid invoices pile up", p: "Work you already did, sitting unpaid for 30, 60, 90 days, because nobody has time to chase it down." },
  ];
  return (
    <section style={{ background: C.concrete, padding: "96px 0" }} id="problem">
      <div className="fm-wrap">
        <Reveal className="fm-sechead">
          <div className="fm-eyebrow">THE QUIET KILLER IN THE TRADES</div>
          <h2 className="fm-h2">You cannot answer the phone with your hands in a furnace.</h2>
          <p className="fm-secsub">Every missed call is a job walking to your competitor. Here is what it is costing you.</p>
        </Reveal>
        <div className="fm-3grid">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <TiltCard className="fm-probcard" glowColor="rgba(245,166,35,0.08)">
                <div className="fm-probic">{c.icon}</div>
                <h3 className="fm-cardh3">{c.t}</h3>
                <p className="fm-cardp">{c.p}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* ------------------------------------------------------------------ */
/*  Z-Pattern Mockups                                                  */
/* ------------------------------------------------------------------ */
function IncomingCallMockup() {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ background: C.charcoal2, borderRadius: 24, padding: 32, border: `1px solid ${C.concrete2}`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", width: "100%", maxWidth: 400, margin: "0 auto", position: "relative", overflow: "hidden" }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.charcoal3, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>👤</div>
        <div style={{ color: C.white, fontSize: 24, fontWeight: 600 }}>Emergency AC Repair</div>
        <div style={{ color: C.steelLight, fontSize: 15, marginTop: 4 }}>Incoming Call...</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.15)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhoneOff size={28} />
        </div>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.15)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhoneIcon size={28} />
        </div>
      </div>
    </motion.div>
  );
}

function TranscriptMockup() {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ background: C.charcoal2, borderRadius: 24, padding: 24, border: `1px solid ${C.concrete2}`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", width: "100%", maxWidth: 400, margin: "0 auto" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: C.charcoal3, padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: "flex-start", color: C.steelLight, maxWidth: "80%", fontSize: 14 }}>
          Hi, my AC just started blowing warm air and I have a newborn at home.
        </div>
        <div style={{ background: "rgba(245,166,35,0.1)", border: `1px solid rgba(245,166,35,0.2)`, padding: "12px 16px", borderRadius: 16, borderBottomRightRadius: 4, alignSelf: "flex-end", color: C.orange, maxWidth: "80%", fontSize: 14 }}>
          I can definitely help with that. What is your address?
        </div>
        <div style={{ background: C.charcoal3, padding: "12px 16px", borderRadius: 16, borderBottomLeftRadius: 4, alignSelf: "flex-start", color: C.steelLight, maxWidth: "80%", fontSize: 14 }}>
          1234 Maple Street.
        </div>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ marginTop: 8, padding: 12, background: C.charcoal, borderRadius: 12, border: `1px solid ${C.concrete2}` }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.white, fontSize: 14 }}><Check size={16} o /> Name: Sarah Jenkins</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.white, fontSize: 14, marginTop: 4 }}><Check size={16} o /> Issue: No cool air</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.white, fontSize: 14, marginTop: 4 }}><Check size={16} o /> Priority: Emergency</div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CalendarMockup() {
  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ background: C.charcoal2, borderRadius: 24, padding: 24, border: `1px solid ${C.concrete2}`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", width: "100%", maxWidth: 400, margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ color: C.white, fontWeight: 600, fontSize: 18 }}>Tuesday, Aug 14</div>
        <div style={{ color: C.steelLight, fontSize: 14 }}>Today</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
        <div style={{ height: 60, background: C.charcoal3, borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", color: C.steelLight, fontSize: 14 }}>8:00 AM</div>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          viewport={{ once: true }}
          style={{ height: 80, background: "rgba(245,166,35,0.15)", borderLeft: `4px solid ${C.orange}`, borderRadius: 8, padding: "12px 16px" }}
        >
          <div style={{ color: C.white, fontWeight: 600, fontSize: 15 }}>Emergency AC Repair</div>
          <div style={{ color: C.orange, fontSize: 13, marginTop: 4 }}>9:00 AM • 1234 Maple St</div>
        </motion.div>
        <div style={{ height: 60, background: C.charcoal3, borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", color: C.steelLight, fontSize: 14 }}>11:00 AM</div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  HOW IT WORKS                                                       */
/* ================================================================== */
function How() {
  const steps = [
    { n: "1", t: "Answers instantly", p: "Every call picked up in seconds, 24/7, nights, weekends, whenever you cannot get to the phone.", mockup: <IncomingCallMockup /> },
    { n: "2", t: "Qualifies the caller", p: "Foreman finds out the job, the urgency, and the location, and answers questions like your best front-desk person.", mockup: <TranscriptMockup /> },
    { n: "3", t: "Books the job", p: "The job drops straight into your calendar, ready to go. No voicemail, no lost lead, no callbacks to chase.", mockup: <CalendarMockup /> },
  ];
  return (
    <section id="how" style={{ padding: "120px 0" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead" style={{ marginBottom: 100 }}>
          <div className="fm-eyebrow">MISSED CALL TO BOOKED JOB</div>
          <h2 className="fm-h2">How Foreman works</h2>
          <p className="fm-secsub">Three steps. Fully automatic. You keep working.</p>
        </Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 120 }}>
          {steps.map((s, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div key={i} className={`fm-z-row ${isEven ? "fm-z-reverse" : ""}`}>
                <div className="fm-z-text">
                  <Reveal delay={0.1}>
                    <div className="fm-stepnum" style={{ marginBottom: 24 }}>{s.n}</div>
                    <h3 className="fm-h2" style={{ fontSize: 32, marginBottom: 16 }}>{s.t}</h3>
                    <p className="fm-secsub" style={{ fontSize: 18, lineHeight: 1.6 }}>{s.p}</p>
                  </Reveal>
                </div>
                <div className="fm-z-mockup">
                  {s.mockup}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FEATURES                                                           */
/* ================================================================== */
function Features() {
  const feats = [
    { icon: <PhoneIcon o />, t: "Answers every call", p: "24/7 coverage so a missed call never turns into a missed job again." },
    { icon: <Calendar />, t: "Books into your calendar", p: "Qualified jobs land directly on your schedule, no back-and-forth, no double-booking." },
    { icon: <Dollar o />, t: "Chases unpaid invoices", p: "Automatic, polite follow-ups on overdue invoices so you get paid faster, without lifting a finger." },
    { icon: <Clock o />, t: "Works after hours", p: "Nights, weekends, holidays. Foreman catches the emergency calls competitors send to voicemail." },
    { icon: <Star />, t: "Sounds professional", p: "Calm, clear, and to the point, like your best front-desk hire, never rushed and never rude." },
    { icon: <Bolt />, t: "Live in 24 hours", p: "Simple setup, no new hardware. We plug into your existing number and you are capturing jobs by tomorrow." },
  ];
  return (
    <section id="features" style={{ background: C.charcoal, color: C.white, padding: "96px 0" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead">
          <div className="fm-eyebrow" style={{ color: C.orange }}>YOUR AI FRONT OFFICE</div>
          <h2 className="fm-h2">Everything a great receptionist does. Never off the clock.</h2>
          <p className="fm-secsub" style={{ color: C.steelLight }}>Built for the trades, not another generic chatbot.</p>
        </Reveal>
        <div className="fm-3grid">
          {feats.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <TiltCard className="fm-featcard" glowColor="rgba(16,185,129,0.08)">
                <div className="fm-featic">{f.icon}</div>
                <h3 className="fm-cardh3">{f.t}</h3>
                <p className="fm-cardp">{f.p}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  PRICING                                                            */
/* ================================================================== */
function Pricing() {
  const reducedMotion = useReducedMotion();
  const items = [
    "Free base for month 1, you only pay per booking during the pilot",
    "Every call answered, qualified and booked",
    "Automatic invoice follow-ups included",
    "Live in 24 hours, cancel anytime",
  ];
  return (
    <section id="pricing" style={{ background: C.concrete, padding: "96px 0" }}>
      <div className="fm-wrap">
        <Reveal className="fm-sechead">
          <div className="fm-eyebrow">PRICING THAT ONLY WINS WHEN YOU DO</div>
          <h2 className="fm-h2">You only pay when we book you a job.</h2>
          <p className="fm-secsub">No big upfront risk. No monthly gamble. Just booked jobs.</p>
        </Reveal>
        <Reveal>
          <motion.div className="fm-pricecard" whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="fm-priceglow" />
            {!reducedMotion && (
              <motion.div
                aria-hidden
                style={{
                  position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
                  background: "linear-gradient(60deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                  backgroundSize: "300% 100%"
                }}
                initial={{ backgroundPosition: "100% 0" }}
                whileInView={{ backgroundPosition: "-100% 0" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              />
            )}
            <div style={{ position: "relative", zIndex: 2 }}>
              <span className="fm-pricebadge">PILOT, LIMITED SPOTS</span>
              <div className="fm-pricemain">$500<span className="fm-priceper">/mo</span></div>
              <div className="fm-priceplus">plus $50 per booking</div>
              <ul className="fm-pricelist">
                {items.map((it, i) => (
                  <li key={i}><Check o /> <span>{it}</span></li>
                ))}
              </ul>
              <motion.a href="#pilot" className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center" }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Book your free pilot
              </motion.a>
              <div className="fm-pricenote">One $1,500 install pays for 30 bookings. If we do not book you, you do not pay.</div>
            </div>
          </motion.div>
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
    <section id="pilot" style={{ background: C.charcoal, color: C.white, padding: "160px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: 1000,
        height: 600,
        background: "radial-gradient(circle, rgba(245,166,35,0.08), transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div className="fm-wrap" style={{ position: "relative", zIndex: 1, maxWidth: 840 }}>
        <Reveal>
          <h2 className="fm-h2" style={{ fontSize: 56, letterSpacing: "-1.5px" }}>Ready to stop losing jobs to voicemail?</h2>
          <p className="fm-secsub" style={{ color: C.steelLight, margin: "24px auto 48px", fontSize: 20, lineHeight: 1.6, maxWidth: 640 }}>
            Grab one of our pilot spots. 15-minute call, no pressure. We will show you exactly what Foreman captures for a shop like yours.
          </p>
          <MagneticButton
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="fm-btn fm-btn-primary"
          >
            <span style={{ fontSize: 18, padding: "4px 16px" }}>Book your pilot call</span>
          </MagneticButton>
          <div style={{ marginTop: 32, fontFamily: "IBM Plex Mono, monospace", fontSize: 14, color: C.steelLight }}>
            or DM us &quot;PILOT&quot; on Instagram @foreman.ai_
          </div>
        </Reveal>
      </div>
    </section>
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
    <section id="faq" style={{ padding: "96px 0" }}>
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
                    <motion.span className="fm-faqtog" animate={{ rotate: isOpen ? 45 : 0 }}>+</motion.span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
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
/*  FOOTER                                                             */
/* ================================================================== */
function Footer() {
  return (
    <footer style={{ background: C.charcoal3, color: C.steelLight, padding: "56px 0 40px", borderTop: `1px solid ${C.concrete2}` }}>
      <div className="fm-wrap">
        <div className="fm-footinner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo size={36} />
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 18, color: C.white }}>Foreman</div>
              <div className="fm-mono" style={{ fontSize: 13 }}>Never miss another job.</div>
            </div>
          </div>
          <div className="fm-footlinks">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#pilot">Book a pilot</a>
          </div>
        </div>
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 13 }}>
          © 2026 Foreman, AI Front Office for HVAC &amp; Trades, a MeeTech Labs company
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */
function Check({ o }: { o?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
      <path d="M20 6L9 17l-5-5" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneIcon({ o }: { o?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" stroke={o ? C.orange : C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneOff() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M1 1l22 22M16.7 16.7A10.8 10.8 0 0112 18c-7 0-11-6-11-6a19.5 19.5 0 015.1-5.9m3.2-1.6A10.9 10.9 0 0112 4c7 0 11 6 11 6a19.4 19.4 0 01-2.2 3.2" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Clock({ o }: { o?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={C.orange} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Dollar({ o }: { o?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Calendar() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke={C.orange} strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke={C.orange} strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16l2 2 4-4" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Star() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" stroke={C.orange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function Bolt() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z" stroke={C.orange} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================================================== */
/*  PAGE                                                               */
/* ================================================================== */
export function ForemanLanding() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <main
        className="fm-landing"
        style={{
          fontFamily: "Inter, sans-serif",
          color: C.white,
          background: C.charcoal,
          overflowX: "hidden",
        }}
      >
        <Nav />
        <Hero />
        <StatBar />
        <Problem />
        <How />
        <Features />
        <Pricing />
        <FinalCTA />
        <FAQ />
        <Footer />
      </main>
    </ReactLenis>
  );
}
