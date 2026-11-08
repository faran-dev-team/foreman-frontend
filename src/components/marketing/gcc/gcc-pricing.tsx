"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";

import { PRICING, type PricingPlan } from "./content";
import { Accent, CheckMark, EASE, INSTANT, MagneticLink, Reveal, SectionHead } from "./primitives";

function PlanCard({ plan, i }: { plan: PricingPlan; i: number }) {
  const L = PRICING.rowLabels;
  return (
    <Reveal delay={i * 0.08} className="gx-plan-cell">
      <article className={`gx-plan${plan.featured ? " is-featured" : ""}`}>
        {plan.featured && <span className="gx-plan-glow" aria-hidden />}
        <header className="gx-plan-head">
          <h3>{plan.name}</h3>
          <span className={`gx-plan-region${plan.featured ? " is-featured" : ""}`}>{plan.region}</span>
        </header>

        <div className="gx-plan-price">
          <span className="gx-plan-cur">{plan.currency}</span>
          <span className="gx-plan-amt">{plan.monthly}</span>
          <span className="gx-plan-per">/ month</span>
        </div>
        <p className="gx-plan-note">{plan.monthlyNote}</p>

        <dl className="gx-plan-rows">
          <div>
            <dt>{plan.id === "pilot" ? "Each Booked Job" : L.perJob}</dt>
            <dd>
              <b>
                {plan.currency} {plan.perJob}
              </b>
            </dd>
          </div>
          <div>
            <dt>{L.cap}</dt>
            <dd>{plan.cap}</dd>
          </div>
          <div>
            <dt>{L.languages}</dt>
            <dd>{plan.languages}</dd>
          </div>
          <div>
            <dt>{L.setup}</dt>
            <dd>
              <CheckMark size={14} /> {plan.setup}
            </dd>
          </div>
        </dl>
      </article>
    </Reveal>
  );
}

function CostComparison() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const { receptionist: r, foreman: f } = PRICING.comparison;
  const ratio = f.amount / r.amount;

  return (
    <Reveal className="gx-compare">
      <div className="gx-compare-bars" ref={ref}>
        <div className="gx-compare-row">
          <div className="gx-compare-label">
            <span>{r.label}</span>
            <b>{r.display}</b>
          </div>
          <div className="gx-compare-track">
            <motion.span
              className="gx-compare-fill is-grey"
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={reduced ? INSTANT : { duration: 1.2, ease: EASE }}
            />
          </div>
          <ul className="gx-compare-meta">
            {r.meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="gx-compare-row is-foreman">
          <div className="gx-compare-label">
            <span>{f.label}</span>
            <b>{f.display}</b>
          </div>
          <div className="gx-compare-track">
            <motion.span
              className="gx-compare-fill"
              initial={{ width: 0 }}
              animate={inView ? { width: `${ratio * 100}%` } : {}}
              transition={reduced ? INSTANT : { duration: 1.2, delay: 0.25, ease: EASE }}
            />
            <span className="gx-compare-callout" style={{ left: `${ratio * 100}%` }}>
              ≈ {Math.round(ratio * 100)}%
            </span>
          </div>
          <ul className="gx-compare-meta">
            {f.meta.map((m) => (
              <li key={m}>
                <CheckMark size={12} /> {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="gx-compare-line">{PRICING.comparison.line}</p>
    </Reveal>
  );
}

export function GccPricing() {
  return (
    <section id="pricing" className="gx-section gx-pricing">
      <div className="gx-pricing-glow" aria-hidden />
      <div className="gx-wrap">
        <SectionHead
          kicker={PRICING.kicker}
          title={
            <>
              {PRICING.headlineLead} <Accent>{PRICING.headlineAccent}</Accent>
            </>
          }
        />

        <div className="gx-plans">
          {PRICING.plans.map((p, i) => (
            <PlanCard key={p.id} plan={p} i={i} />
          ))}
        </div>

        <p className="gx-plan-notes">{PRICING.notes}</p>

        <CostComparison />

        <div className="gx-center">
          <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-primary gx-btn-lg">
            {PRICING.cta}
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
