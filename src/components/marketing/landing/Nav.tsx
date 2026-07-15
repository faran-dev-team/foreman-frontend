

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { C, Logo, MagneticButton } from "./shared";

const CALENDLY_LINK = CALENDLY_PILOT_URL;

const NAV_SECTIONS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
] as const;

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

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  // Optimized scroll listener via framer-motion
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const closeMobile = useCallback(() => setMobileOpen(false), []);

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
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: 22, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
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
            <MagneticButton href={CALENDLY_LINK} className="fm-btn fm-btn-primary fm-nav-cta">Book a pilot call</MagneticButton>
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
            <a href={CALENDLY_LINK} className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={closeMobile}>Book a pilot call</a>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
