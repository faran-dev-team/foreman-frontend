'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { C } from "../landing/shared";
import { PhoneIncoming, Bot, FileCheck, CalendarCheck, CheckCircle2, Send, Hammer } from 'lucide-react';

const steps = [
  { title: "Incoming Call", desc: "Customer calls your main line.", icon: <PhoneIncoming size={24} /> },
  { title: "AI Answers", desc: "Foreman picks up in 0.2s.", icon: <Bot size={24} /> },
  { title: "Qualifies Lead", desc: "Determines the scope and urgency.", icon: <FileCheck size={24} /> },
  { title: "Books Job", desc: "Finds an open slot and schedules.", icon: <CalendarCheck size={24} /> },
  { title: "CRM Sync", desc: "Pushes data to ServiceTitan/Jobber.", icon: <CheckCircle2 size={24} /> },
  { title: "SMS Sent", desc: "Customer gets confirmation text.", icon: <Send size={24} /> },
  { title: "Crew Assigned", desc: "Tech is dispatched.", icon: <Hammer size={24} /> }
];

export function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-24" style={{ background: C.bgPrimary }} ref={containerRef}>
      <div className="max-w-[800px] mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
        <p className="text-lg text-gray-400">A completely automated workflow from ring to revenue.</p>
      </div>

      <div className="max-w-[600px] mx-auto relative px-6">
        {/* Track */}
        <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-1 -ml-px bg-white/5 rounded-full" />
        {/* Animated Fill */}
        <motion.div className="absolute left-10 md:left-1/2 top-0 w-1 -ml-px rounded-full origin-top" style={{ background: C.accentOrange, height }} />

        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={i} className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-1/2" />
              
              {/* Node */}
              <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full border-4 flex items-center justify-center z-10" style={{ background: C.bgPrimary, borderColor: C.accentOrange, color: C.accentOrange }}>
                {step.icon}
              </div>

              {/* Content */}
              <div className="ml-16 md:ml-0 md:w-1/2 md:px-8">
                <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="p-6 rounded-2xl border backdrop-blur-md" style={{ background: 'rgba(20,28,48,0.6)', borderColor: C.borderPrimary }}>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
