'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { C } from '../foreman-landing';
import { TradeId, INDUSTRY_CONTENT } from './content';

export function MathSection({ tradeId }: { tradeId: TradeId }) {
  const content = INDUSTRY_CONTENT[tradeId];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24" style={{ background: C.footerBg }}>
      <div className="max-w-[1000px] mx-auto px-6" ref={ref}>
        {/* Top: Headline and Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
            {content.mathHeadline}
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            {content.mathBody}
          </p>
        </motion.div>

        {/* Bottom: Stat Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border p-8 relative overflow-hidden"
          style={{ background: C.bgCard, borderColor: C.borderPrimary }}
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${C.accentOrange}, transparent 70%)` }} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-gray-800">
            {content.statBar.map((stat: string, i: number) => (
              <div key={i} className={`flex-1 ${i !== 0 ? 'pt-6 md:pt-0 md:pl-6' : ''}`}>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: C.accentOrange, boxShadow: `0 0 8px ${C.accentOrange}` }} />
                  <span className="text-gray-300 font-medium text-lg leading-snug">{stat}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
