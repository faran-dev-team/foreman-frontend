'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { C } from '../foreman-landing';
import { TradeId, INDUSTRY_CONTENT } from './content';
import { Sparkles, CheckCircle, Calendar, Globe, RotateCcw, Brain } from 'lucide-react';

export function FeatureGrid({ tradeId }: { tradeId: TradeId }) {
  const content = INDUSTRY_CONTENT[tradeId];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const icons = [Sparkles, CheckCircle, Calendar, Globe, RotateCcw, Brain];

  return (
    <section className="py-24" style={{ background: C.bgPrimary }} ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="fm-sechead mb-16 text-center">
          <h2 style={{
            fontFamily: 'var(--font-playfair), "Playfair Display", "Libre Baskerville", "Georgia", serif',
            fontSize: "clamp(32px, 5vw, 56px)",
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            margin: "0 auto 16px",
          }}>
            Everything You Need
          </h2>
          <p className="fm-secsub">Purpose-built features for service businesses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.map((feat: any, i: number) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="p-6 rounded-2xl border backdrop-blur-lg group transition-all"
                style={{ background: 'rgba(20,28,48,0.4)', borderColor: C.borderPrimary }}
              >
                <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${C.accentOrange}, #ef4444)` }}>
                  <Icon color="white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
