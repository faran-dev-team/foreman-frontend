"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Cable, Database, History, Lock, Mic, Moon, PhoneOff, Receipt, Server } from "lucide-react";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";

import { FM, TRUST } from "./content";
import { CheckMark, EASE, Kicker, MagneticLink, Reveal, SectionHead } from "./primitives";

const CAP_ICONS = [<Cable key="a" size={18} strokeWidth={2} />, <Lock key="b" size={18} strokeWidth={2} />, <Receipt key="c" size={18} strokeWidth={2} />];

function NightLog() {
  const reduced = useReducedMotion();
  return (
    <div className="gx-nightlog">
      <div className="gx-nightlog-head">
        <span className="gx-nightlog-moon">
          <Moon size={16} strokeWidth={2.2} aria-hidden />
        </span>
        <div>
          <b>Overflow line · Residential community</b>
          <span>02:07 · August · Contact centre closed</span>
        </div>
        <span className="gx-live gx-live-sm">
          <i aria-hidden /> On
        </span>
      </div>
      <ol className="gx-nightlog-list">
        {FM.log.map((e, i) => (
          <motion.li
            key={e.t}
            initial={reduced ? false : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.35, ease: EASE }}
          >
            <span className="gx-nightlog-t">{e.t}</span>
            <span className="gx-nightlog-dot" aria-hidden>
              <CheckMark size={11} className="" />
            </span>
            <span className="gx-nightlog-body">
              <b>{e.label}</b>
              <em>{e.meta}</em>
            </span>
          </motion.li>
        ))}
      </ol>
      <div className="gx-nightlog-foot">
        <Database size={13} strokeWidth={2.2} aria-hidden /> Audit log · every call and action recorded
      </div>
    </div>
  );
}

export function GccFm() {
  return (
    <section id="fm" className="gx-section gx-fm">
      <div className="gx-wrap gx-fm-grid">
        <Reveal className="gx-fm-copy">
          <Kicker>{FM.kicker}</Kicker>
          <h2 className="gx-h2">{FM.headline}</h2>
          {FM.copy.map((p) => (
            <p key={p} className="gx-lede">
              {p}
            </p>
          ))}
          <ul className="gx-fm-caps">
            {FM.capabilities.map((c, i) => (
              <li key={c.title}>
                <span className="gx-fm-cap-ic">{CAP_ICONS[i]}</span>
                <span>
                  <b>{c.title}</b>
                  {c.body}
                </span>
              </li>
            ))}
          </ul>
          <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-primary">
            {FM.cta}
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </MagneticLink>
        </Reveal>
        <Reveal delay={0.12} className="gx-fm-visual">
          <NightLog />
        </Reveal>
      </div>
    </section>
  );
}

const TRUST_ICONS: Record<string, React.ReactNode> = {
  disclosure: <Mic size={20} strokeWidth={2} />,
  residency: <Server size={20} strokeWidth={2} />,
  audit: <History size={20} strokeWidth={2} />,
  outbound: <PhoneOff size={20} strokeWidth={2} />,
};

export function GccTrust() {
  return (
    <section id="trust" className="gx-section gx-trust-sec">
      <div className="gx-wrap">
        <SectionHead kicker={TRUST.kicker} title={TRUST.headline} />
        <div className="gx-trust-grid">
          {TRUST.items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.07} className="gx-trust-cell">
              <div className="gx-trust-item">
                <span className="gx-trust-ic">{TRUST_ICONS[t.id]}</span>
                <p>{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
