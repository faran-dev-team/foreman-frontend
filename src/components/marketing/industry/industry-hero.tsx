'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { C, MagneticButton } from '../foreman-landing';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { TradeId, INDUSTRY_CONTENT } from './content';
import { CALENDLY_PILOT_URL as CALENDLY_LINK } from "@/lib/marketing/calendly";

export function HeroSection({ tradeId }: { tradeId: TradeId }) {
  const content = INDUSTRY_CONTENT[tradeId];
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: C.bgPrimary }}>
      {/* Premium Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${C.accentOrange}20, transparent 70%)` }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${C.accentGreenBg}40, transparent 70%)` }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'linear-gradient(to bottom, black, transparent)' }} />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Left Copy */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border" style={{ borderColor: C.accentOrange, background: `${C.accentOrange}15`, color: C.accentOrange }}>
            <Zap size={14} className="fill-current" />
            <span className="text-xs font-bold tracking-widest uppercase">{content.heroBadge}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6" style={{ color: C.textHeading, lineHeight: 1.1 }}>
            {content.heroHeadline}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto lg:mx-0" style={{ color: C.textBody, lineHeight: 1.6 }}>
            {content.heroSub}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <MagneticButton href="#demo" className="fm-btn fm-btn-primary px-8 py-4 text-lg w-full sm:w-auto shadow-[0_0_40px_rgba(249,122,53,0.3)]">
              See the Demo <ArrowRight size={18} className="ml-2" />
            </MagneticButton>
            <MagneticButton href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="fm-btn fm-btn-ghost px-8 py-4 text-lg w-full sm:w-auto">
              Book a Pilot Call
            </MagneticButton>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm" style={{ color: C.textBody }}>
            <div className="flex items-center gap-2"><ShieldCheck size={16} color={C.accentGreenText} /> No credit card required</div>
            <div className="flex items-center gap-2"><Star size={16} color={C.accentOrange} className="fill-current" /> 5.0 on G2</div>
          </motion.div>
        </div>

        {/* Right Illustration/Interactive UI */}
        <div className="flex-1 w-full relative h-[500px]">
          <motion.div
            animate={reducedMotion ? {} : { y: [-10, 10] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl border flex flex-col overflow-hidden shadow-2xl"
            style={{ background: C.bgCard, borderColor: C.borderPrimary }}
          >
            {/* Fake UI Header */}
            <div className="h-12 border-b flex items-center px-4 gap-2" style={{ borderColor: C.borderPrimary, background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>

            {/* Animated Cards inside the UI */}
            <div className="p-6 flex flex-col gap-4 relative overflow-hidden h-full">
              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }} className="p-4 rounded-xl border flex items-center gap-4" style={{ background: C.bgPrimary, borderColor: C.borderPrimary }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.accentOrange}20`, color: C.accentOrange }}><Zap size={18} /></div>
                <div>
                  <div className="text-sm font-bold text-white">Incoming Call: Emergency</div>
                  <div className="text-xs text-gray-400">AI Answering in 0.2s...</div>
                </div>
              </motion.div>

              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.5, type: "spring" }} className="p-4 rounded-xl border flex items-center gap-4 ml-8" style={{ background: `${C.accentGreenBg}40`, borderColor: `${C.accentGreenText}40` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.accentGreenText}20`, color: C.accentGreenText }}><ShieldCheck size={18} /></div>
                <div>
                  <div className="text-sm font-bold text-white">Job Qualified</div>
                  <div className="text-xs text-green-400">High-value lead identified.</div>
                </div>
              </motion.div>

              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border shadow-lg" style={{ background: C.accentOrange, borderColor: 'rgba(255,255,255,0.2)' }}>
                <div className="text-white font-bold mb-1">Appointment Booked!</div>
                <div className="text-orange-100 text-sm">Tomorrow @ 9:00 AM • CRM Synced</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
