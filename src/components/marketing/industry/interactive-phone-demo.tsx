'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { C } from "../landing/shared";
import { Phone } from 'lucide-react';

import { TradeId, INDUSTRY_CONTENT } from './content';

export function PhoneDemoSection({ tradeId }: { tradeId: TradeId }) {
  const [activeMsg, setActiveMsg] = useState(0);
  const messages = INDUSTRY_CONTENT[tradeId].demoMessages;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMsg((prev) => (prev < messages.length ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <section id="demo" className="py-32 relative" style={{ background: C.bgCard }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0F1C] pointer-events-none" />
      
      <div className="max-w-[1000px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Hear the AI in Action</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto md:mx-0">
            It sounds like a human, reasons like your best dispatcher, and never drops a call. Experience a live simulation.
          </p>
          <button className="px-6 py-3 rounded-full text-white font-bold flex items-center gap-2 mx-auto md:mx-0 transition-transform hover:scale-105" style={{ background: C.accentGreenBg, border: `1px solid ${C.accentGreenText}` }}>
            <Phone size={18} /> Play Audio Demo
          </button>
        </div>

        <div className="flex-1 w-full max-w-[360px] mx-auto">
          {/* Phone Frame */}
          <div className="rounded-[40px] border-[8px] border-gray-800 bg-[#0A0F1C] h-[600px] relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-20" />
            
            {/* Header */}
            <div className="pt-10 pb-4 px-6 border-b border-gray-800 bg-gray-900/50 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: C.accentOrange }}>
                <Bot size={24} color="white" />
              </div>
              <div className="text-white font-bold">Foreman AI</div>
              <div className="text-green-400 text-xs">01:24</div>
            </div>

            {/* Chat Area */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[480px]">
              <AnimatePresence>
                {messages.slice(0, activeMsg).map((m: { sender: string; text: string }, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.sender === 'ai' ? 'bg-gray-800 text-white rounded-tl-sm' : 'bg-orange-500 text-white self-end rounded-tr-sm'}`}
                  >
                    {m.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeMsg < messages.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-75" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce delay-150" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inline Bot icon since lucide-react might not be imported properly in above block
const Bot = ({ size, color }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
