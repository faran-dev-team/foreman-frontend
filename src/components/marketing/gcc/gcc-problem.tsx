"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, PhoneOff, ThermometerSun, X } from "lucide-react";

import { PROBLEM } from "./content";
import { Ar, CheckMark, EASE, Hi, Kicker, Reveal, Ur } from "./primitives";

function Greeting({ g, i }: { g: (typeof PROBLEM.greetings)[number]; i: number }) {
  const text =
    g.lang === "ar" ? <Ar display>{g.text}</Ar> : g.lang === "ur" ? <Ur>{g.text}</Ur> : g.lang === "hi" ? <Hi>{g.text}</Hi> : g.text;
  return (
    <span className={`gx-greet gx-greet-${i}`}>
      <span className="gx-greet-text">{text}</span>
      <span className="gx-greet-name">{g.name}</span>
    </span>
  );
}

function LanguagesVisual() {
  return (
    <div className="gx-pv gx-pv-langs" aria-hidden>
      {PROBLEM.greetings.map((g, i) => (
        <Greeting key={g.lang} g={g} i={i} />
      ))}
      <span className="gx-pv-receptionist">
        <X size={12} strokeWidth={3} /> Receptionist: 2 languages · 1 shift
      </span>
    </div>
  );
}

function TechnicianVisual() {
  return (
    <div className="gx-pv gx-pv-tech" aria-hidden>
      <div className="gx-pv-node">
        <span className="gx-pv-role">Customer</span>
        <span className="gx-pv-say">
          <Ar>المكيف ما يبرّد</Ar>
        </span>
      </div>
      <div className="gx-pv-link">
        <span className="gx-pv-broken">
          <span>
            <PhoneOff size={12} strokeWidth={2.4} /> 2nd call?
          </span>
        </span>
        <span className="gx-pv-fixed">
          <span>
            Foreman <ArrowRight size={12} strokeWidth={2.6} />
          </span>
        </span>
      </div>
      <div className="gx-pv-node gx-pv-node-tech">
        <span className="gx-pv-role">Technician</span>
        <span className="gx-pv-say">
          Brief in <Ur>اردو</Ur>
          <CheckMark size={13} />
        </span>
      </div>
    </div>
  );
}

// Illustrative shape of after-hours demand in July (no absolute values shown).
const HOURLY = [22, 15, 10, 7, 6, 7, 11, 18, 27, 33, 37, 41, 45, 47, 49, 52, 56, 62, 71, 81, 91, 100, 84, 52];

function SummerVisual() {
  const reduced = useReducedMotion();
  return (
    <div className="gx-pv gx-pv-summer" aria-hidden>
      <div className="gx-pv-summer-top">
        <span className="gx-chip gx-chip-heat">
          <ThermometerSun size={13} strokeWidth={2.4} /> July · 46°C
        </span>
        <span className="gx-pv-peak-label">Peak ≈ 9 PM</span>
      </div>
      <div className="gx-bars">
        <span className="gx-bars-office" style={{ left: `${(8 / 24) * 100}%`, width: `${(10 / 24) * 100}%` }}>
          <em>Office open</em>
        </span>
        {HOURLY.map((h, i) => {
          const after = i < 8 || i >= 18;
          return (
            <motion.i
              key={i}
              className={`${after ? "is-after" : ""}${i === 21 ? " is-peak" : ""}`}
              initial={reduced ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.025, ease: EASE }}
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>
      <div className="gx-bars-axis">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>12 AM</span>
      </div>
    </div>
  );
}

const VISUALS = { languages: LanguagesVisual, technicians: TechnicianVisual, summer: SummerVisual } as const;

export function GccProblem() {
  return (
    <section className="gx-section gx-problem" aria-labelledby="gx-problem-title">
      <div className="gx-wrap">
        <Reveal className="gx-problem-head">
          <Kicker center>{PROBLEM.kicker}</Kicker>
          <h2 id="gx-problem-title" className="sr-only">
            Why maintenance companies in the Gulf miss jobs
          </h2>
        </Reveal>
        <div className="gx-problem-grid">
          {PROBLEM.cards.map((c, i) => {
            const Visual = VISUALS[c.id as keyof typeof VISUALS];
            return (
              <Reveal key={c.id} delay={i * 0.08} className="gx-problem-cell">
                <article className="gx-card gx-problem-card">
                  <Visual />
                  <div className="gx-problem-body">
                    <span className="gx-problem-n">0{i + 1}</span>
                    <h3 className="gx-h3">{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
