"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { ForemanLogo } from "@/lib/brand";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { HAS_WHATSAPP, WHATSAPP_PILOT_URL } from "@/lib/marketing/whatsapp";

import { NAV_LINKS, TOP_BAR } from "./content";
import { Ar, EASE, useAnchorScroll, WhatsAppIcon } from "./primitives";

const PILOT_URL = HAS_WHATSAPP ? WHATSAPP_PILOT_URL : CALENDLY_PILOT_URL;

function AuthLink({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const signedIn = mounted && isSignedIn;
  return (
    <Link href={signedIn ? "/dashboard" : "/sign-in"} className={className} onClick={onNavigate}>
      {signedIn ? "Dashboard" : "Sign In"}
    </Link>
  );
}

export function TopBar() {
  return (
    <div className="gx-topbar" role="note">
      <div className="gx-wrap gx-topbar-inner">
        <span className="gx-topbar-pulse" aria-hidden />
        <strong>{TOP_BAR.lead}</strong>
        <span className="gx-topbar-mid">{TOP_BAR.middle}</span>
        <span className="gx-topbar-tail">{TOP_BAR.tail}</span>
      </div>
    </div>
  );
}

export function PilotButton({ className = "gx-btn gx-btn-primary gx-btn-sm", label = "Book a Pilot", onClick }: { className?: string; label?: string; onClick?: () => void }) {
  return (
    <a href={PILOT_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {HAS_WHATSAPP && <WhatsAppIcon size={16} />}
      {label}
    </a>
  );
}

export function GccNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const reduced = useReducedMotion();
  const scrollTo = useAnchorScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the nav item for the section in view.
  useEffect(() => {
    if (!onHome) return;
    const navIds = new Set<string>(NAV_LINKS.map((l) => l.href.slice(1)));
    // Watch every top-level section so the highlight clears between linked ones.
    const els = Array.from(document.querySelectorAll<HTMLElement>(".gx-hero, .gx-section"));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (!visible) return;
        const id = (visible.target as HTMLElement).id;
        setActive(id && navIds.has(id) ? `#${id}` : null);
      },
      { rootMargin: "-40% 0px -59% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const linkHref = (href: string) => (onHome ? href : `/${href}`);
  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onHome) scrollTo(e, href);
    close();
  };

  return (
    <motion.nav
      className={`gx-nav${scrolled ? " is-scrolled" : ""}`}
      initial={reduced ? false : { y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      aria-label="Main"
    >
      <div className="gx-wrap gx-nav-inner">
        <Link href="/" className="gx-brand" aria-label="Foreman home">
          <ForemanLogo size={30} />
          <span>Foreman</span>
        </Link>

        <div className="gx-nav-links">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={linkHref(l.href)}
              onClick={(e) => onLink(e, l.href)}
              className={`gx-navlink${active === l.href ? " is-active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="gx-nav-actions">
          <Link href="/ar" className="gx-lang-switch" hrefLang="ar" lang="ar" aria-label="Arabic version">
            <Ar>العربية</Ar>
          </Link>
          <AuthLink className="gx-navlink gx-nav-auth" />
          <PilotButton />
          <button
            type="button"
            className="gx-nav-toggle"
            aria-expanded={open}
            aria-controls="gx-mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`gx-burger${open ? " is-open" : ""}`} aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="gx-mobile-nav" className={`gx-drawer${open ? " is-open" : ""}`}>
        <div className="gx-wrap gx-drawer-inner">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={linkHref(l.href)} onClick={(e) => onLink(e, l.href)} className="gx-drawer-link">
              {l.label}
              <ArrowRight size={18} aria-hidden />
            </a>
          ))}
          <AuthLink className="gx-drawer-link" onNavigate={close} />
          <Link href="/ar" className="gx-drawer-link" onClick={close} hrefLang="ar">
            <Ar>العربية</Ar>
            <ArrowRight size={18} aria-hidden />
          </Link>
          <PilotButton className="gx-btn gx-btn-primary gx-btn-block" onClick={close} />
        </div>
      </div>
    </motion.nav>
  );
}
