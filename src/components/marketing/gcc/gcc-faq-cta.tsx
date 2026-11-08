"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, PhoneCall, PhoneMissed, Plus } from "lucide-react";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { HAS_WHATSAPP, WHATSAPP_PILOT_URL } from "@/lib/marketing/whatsapp";

import { FAQ, FINAL_CTA } from "./content";
import { Accent, EASE, GeoPattern, Kicker, MagneticLink, Reveal, WhatsAppIcon } from "./primitives";

export function GccFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="gx-section gx-faq">
      <div className="gx-wrap gx-faq-grid">
        <Reveal className="gx-faq-side">
          <Kicker>{FAQ.kicker}</Kicker>
          <h2 className="gx-h2">{FAQ.headline}</h2>
          <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-ghost">
            Book Your Free Pilot
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden />
          </MagneticLink>
        </Reveal>

        <div className="gx-faq-list">
          {FAQ.items.map((item, i) => {
            const isOpen = open === i;
            const id = `gx-faq-${i}`;
            return (
              <Reveal key={item.q} delay={i * 0.03}>
                <div className={`gx-faq-item${isOpen ? " is-open" : ""}`}>
                  <h3>
                    <button
                      type="button"
                      className="gx-faq-q"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span>{item.q}</span>
                      <span className="gx-faq-tog" aria-hidden>
                        <Plus size={18} strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={id}
                        role="region"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="gx-faq-a">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MissedStack() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setFlipped(true), reduced ? 0 : 1300);
    return () => clearTimeout(t);
  }, [inView, reduced]);

  return (
    <div className={`gx-missed${flipped ? " is-flipped" : ""}`} ref={ref} aria-hidden>
      {FINAL_CTA.missed.map((m, i) => (
        <motion.div
          key={m.t}
          className="gx-missed-card"
          style={{ zIndex: 10 - i, ["--i" as string]: i }}
          initial={reduced ? false : { opacity: 0, y: 24, rotate: i % 2 ? 2 : -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: EASE }}
        >
          <div className="gx-missed-face gx-missed-front">
            <span className="gx-missed-ic">
              <PhoneMissed size={16} strokeWidth={2.2} />
            </span>
            <span className="gx-missed-body">
              <b>{m.label}</b>
              <em>{m.meta}</em>
            </span>
            <span className="gx-missed-t">{m.t}</span>
          </div>
          <div className="gx-missed-face gx-missed-back">
            <span className="gx-missed-ic is-ok">
              <PhoneCall size={16} strokeWidth={2.2} />
            </span>
            <span className="gx-missed-body">
              <b>Answered by Foreman</b>
              <em>Booked · Technician briefed</em>
            </span>
            <span className="gx-missed-t">{m.t}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function GccFinalCta() {
  return (
    <section id="pilot" className="gx-section gx-final">
      <div className="gx-final-panel">
        <GeoPattern id="gx-final-geo" opacity={0.09} />
        <div className="gx-final-glow" aria-hidden />
        <div className="gx-final-grid">
          <Reveal className="gx-final-copy">
            <h2 className="gx-h2 gx-final-h">
              {FINAL_CTA.headlineLead} <Accent>{FINAL_CTA.headlineAccent}</Accent>
            </h2>
            <p className="gx-lede">{FINAL_CTA.copy}</p>
            <div className="gx-final-ctas">
              <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-primary gx-btn-lg">
                {FINAL_CTA.primary}
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
              </MagneticLink>
              {HAS_WHATSAPP && (
                <a href={WHATSAPP_PILOT_URL} target="_blank" rel="noopener noreferrer" className="gx-btn gx-btn-wa">
                  <WhatsAppIcon size={18} />
                  {FINAL_CTA.secondary}
                </a>
              )}
            </div>
          </Reveal>
          <MissedStack />
        </div>
      </div>
    </section>
  );
}
