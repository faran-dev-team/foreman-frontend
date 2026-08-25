'use client';
import { motion } from 'framer-motion';
import { C, MagneticButton } from '../foreman-landing';
import { TradeId } from './content';
import { CALENDLY_PILOT_URL as CALENDLY_LINK } from "@/lib/marketing/calendly";

export function CTASection({ tradeId }: { tradeId: TradeId }) {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center" style={{ background: C.bgPrimary }}>
      {/* Animated gradient bg */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${C.accentOrange}, transparent 60%)` }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h2 style={{
          fontFamily: 'var(--font-playfair), "Playfair Display", "Libre Baskerville", "Georgia", serif',
          fontSize: "clamp(32px, 5vw, 56px)",
          lineHeight: 1.15,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#FFFFFF",
          margin: "0 auto 16px",
        }}>
          Stop Missing Jobs.
        </h2>
        <p className="fm-secsub mb-10 text-xl" style={{ maxWidth: 600, margin: "0 auto 36px" }}>Let Foreman answer every call and book jobs while you sleep.</p>

        <div className="fm-hero-cta justify-center">
          <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-primary shadow-2xl">
            Book a Pilot Call
          </MagneticButton>
          <MagneticButton href="#demo" className="fm-btn fm-btn-ghost">
            See the Demo
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
