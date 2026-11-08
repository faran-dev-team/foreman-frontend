"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BellRing, CalendarCheck, MapPin, Siren, Star } from "lucide-react";

import { HOW } from "./content";
import { Ar, CheckMark, EASE, Kicker, Reveal, Ur, WhatsAppIcon } from "./primitives";

/* ------------------------------ step visuals ------------------------------ */
function V1() {
  return (
    <div className="gx-sv gx-sv-langs">
      <span className="gx-sv-lang gx-sv-l1">
        <Ar>العربية</Ar>
      </span>
      <span className="gx-sv-lang gx-sv-l2">English</span>
      <span className="gx-sv-lang gx-sv-l3">
        <Ur>اردو</Ur>
      </span>
      <span className="gx-sv-cap">Switches when the caller does</span>
    </div>
  );
}

function V2() {
  return (
    <div className="gx-sv gx-sv-emergency">
      <span className="gx-sv-alert">
        <Siren size={14} strokeWidth={2.4} /> Gas smell reported
      </span>
      <div className="gx-sv-row">
        <span className="gx-sv-num">
          <b>997</b> Civil Defence
        </span>
        <span className="gx-sv-num">
          <b>998</b> Ambulance
        </span>
        <span className="gx-sv-num">
          <b>999</b> Police
        </span>
      </div>
      <span className="gx-sv-owner">
        <BellRing size={12} strokeWidth={2.4} /> Owner alerted
      </span>
    </div>
  );
}

function V3() {
  return (
    <div className="gx-sv gx-sv-price">
      <div className="gx-sv-receipt">
        <span>
          AC not cooling <em>· Villa · Al Barsha</em>
        </span>
        <span className="gx-sv-dots" />
        <span>Gas top-up + service</span>
        <b>AED 150 – 250</b>
      </div>
      <span className="gx-sv-cap">From your own price book</span>
    </div>
  );
}

function V4() {
  return (
    <div className="gx-sv gx-sv-cal">
      <span className="gx-sv-slot is-busy">09:00</span>
      <span className="gx-sv-slot is-booked">
        <CalendarCheck size={13} strokeWidth={2.4} /> 10:00 · Booked
      </span>
      <span className="gx-sv-slot is-busy">11:00</span>
      <span className="gx-sv-cap">Live availability · no double bookings</span>
    </div>
  );
}

function V5() {
  return (
    <div className="gx-sv gx-sv-wa">
      <div className="gx-sv-wa-bubble">
        <span className="gx-sv-wa-head">
          <WhatsAppIcon size={12} /> To Imran · <Ur>اردو</Ur>
        </span>
        <span className="gx-sv-wa-line">
          <MapPin size={12} strokeWidth={2.4} /> Al Barsha 1 · AC not cooling · Tomorrow 10:00
        </span>
      </div>
      <span className="gx-sv-accept">
        <CheckMark size={12} /> Accepted by technician
      </span>
    </div>
  );
}

function V6() {
  return (
    <div className="gx-sv gx-sv-confirm">
      <span className="gx-sv-msg">
        <WhatsAppIcon size={12} /> Booking confirmed · <Ar>العربية</Ar>
      </span>
      <span className="gx-sv-msg gx-sv-msg-dim">Reminder · 09:00 tomorrow</span>
      <span className="gx-sv-stars" aria-label="Review request">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={12} strokeWidth={0} fill="currentColor" />
        ))}
        <em>Review requested</em>
      </span>
    </div>
  );
}

const VISUALS = [V1, V2, V3, V4, V5, V6];

/* ------------------------------ headline ------------------------------ */
function KineticHeadline() {
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setLit((l) => (l + 1) % HOW.headline.length), 1100);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <h2 className="gx-h2 gx-kinetic" aria-label={HOW.headline.join(" ")}>
      {HOW.headline.map((w, i) => (
        <span key={w} aria-hidden className={i === lit ? "is-lit" : ""}>
          {w}
        </span>
      ))}
    </h2>
  );
}

export function GccHow() {
  const reduced = useReducedMotion();
  return (
    <section id="how" className="gx-section gx-how">
      <div className="gx-wrap">
        <Reveal className="gx-sechead gx-sechead-center">
          <Kicker center>{HOW.kicker}</Kicker>
          <KineticHeadline />
        </Reveal>

        <ol className="gx-steps">
          {HOW.steps.map((s, i) => {
            const Visual = VISUALS[i];
            return (
              <motion.li
                key={s.n}
                className={`gx-step${i === 1 ? " gx-step-alert" : ""}`}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: EASE }}
              >
                <div className="gx-step-top">
                  <span className="gx-step-n">{s.n}</span>
                  <span className="gx-step-rail" aria-hidden />
                  <span className="gx-step-t">{s.t}</span>
                </div>
                <div className="gx-step-visual" aria-hidden>
                  <Visual />
                </div>
                <h3 className="gx-h3">{s.title}</h3>
                <p>{s.body}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
