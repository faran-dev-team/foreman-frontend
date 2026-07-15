"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { C, Logo } from "./shared";

export function PersistentWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 24, left: 24, zIndex: 90, fontFamily: "var(--font-outfit), sans-serif" }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              position: "absolute", bottom: 72, left: 0, width: 280,
              background: C.bgCard, border: `1px solid ${C.borderPrimary}`, borderRadius: 16,
              padding: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accentGreenText, boxShadow: `0 0 8px ${C.accentGreenText}` }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textHeading }}>AI Operator Online</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "transparent", border: "none", color: C.textBody, cursor: "pointer", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <p style={{ fontSize: 13, color: C.textBody, marginBottom: 16, lineHeight: 1.5 }}>
              Want to hear Foreman in action? Book a pilot and we&apos;ll set up a live number for you to call.
            </p>
            <a
              href={CALENDLY_PILOT_URL}
              style={{
                display: "block", width: "100%", textAlign: "center",
                background: C.accentOrange, color: C.textHeading, textDecoration: "none",
                padding: "10px 0", borderRadius: 8, fontSize: 14, fontWeight: 600,
              }}
            >
              Book Pilot
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: C.bgCard, border: `1px solid ${C.borderPrimary}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          color: C.accentOrange,
        }}
        aria-label="Toggle AI Assistant Widget"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </motion.button>
    </div>
  );
}

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  
  // Optimized scroll listener via framer-motion instead of unthrottled window event
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 500);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#top"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 90,
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
            border: `1px solid rgba(255,255,255,0.1)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", textDecoration: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
          }}
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export function Footer() {
  return (
    <footer style={{ background: C.footerBg, padding: "80px 0 40px", borderTop: `1px solid ${C.borderPrimary}` }}>
      <div className="fm-wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 64, marginBottom: 80 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Logo size={32} />
            <span style={{ fontSize: 20, fontWeight: 800, color: C.textHeading, letterSpacing: "-0.5px" }}>Foreman</span>
          </div>
          <p style={{ color: C.textBody, fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>
            The AI front office for the trades. Answer every call, qualify every job, and book directly into your calendar.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: C.textHeading, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Industries</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><Link href="/hvac" className="fm-footer-link">HVAC</Link></li>
            <li><Link href="/plumbing" className="fm-footer-link">Plumbing</Link></li>
            <li><Link href="/electrical" className="fm-footer-link">Electrical</Link></li>
            <li><Link href="/restoration" className="fm-footer-link">Restoration</Link></li>
            <li><Link href="/property-management" className="fm-footer-link">Property Management</Link></li>
            <li><Link href="/garage" className="fm-footer-link">Garage Door</Link></li>
            <li><Link href="/pest" className="fm-footer-link">Pest Control</Link></li>
            <li><Link href="/roofing" className="fm-footer-link">Roofing</Link></li>
            <li><Link href="/law-firm" className="fm-footer-link">Law Firms</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 style={{ color: C.textHeading, fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Company</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><a href="#how" className="fm-footer-link">How it Works</a></li>
            <li><a href="#features" className="fm-footer-link">Features</a></li>
            <li><a href="#pricing" className="fm-footer-link">Pricing</a></li>
            <li><Link href="/sign-in" className="fm-footer-link">Sign In</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="fm-wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: `1px solid ${C.borderPrimary}`, color: "rgba(184,191,204,0.5)", fontSize: 13, gap: 16 }}>
        <div>&copy; {new Date().getFullYear()} Foreman AI Inc. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
