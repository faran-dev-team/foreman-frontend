'use client';
import { motion } from 'framer-motion';
import { C, MagneticButton } from "../landing/shared";
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
        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Stop Missing Jobs.</h2>
        <p className="text-xl text-gray-300 mb-10">Let Foreman answer every call and book jobs while you sleep.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn px-10 py-5 text-lg font-bold rounded-full text-white shadow-2xl transition-transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${C.accentOrange}, #ef4444)` }}>
            Book a Pilot Call
          </MagneticButton>
          <MagneticButton href="#demo" className="fm-btn px-10 py-5 text-lg font-bold rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md">
            See the Demo
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
