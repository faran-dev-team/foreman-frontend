"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, PhoneIncoming, ThermometerSun, UserCheck } from "lucide-react";

import { SAMPLE_CALL } from "./content";
import { Ar, CheckMark, EASE, Ur, WhatsAppIcon } from "./primitives";

/*
 * Phases: 0 ringing · 1 answered · 2 caller typing · 3 caller line ·
 * 4 agent typing · 5 agent line · 6 dispatched · 7 booked · 8 WhatsApp sent
 */
const PHASE_MS = [1300, 700, 1000, 1500, 1100, 1700, 750, 750, 4200];
const PHASE_CLOCK = ["00:00", "00:03", "00:05", "00:11", "00:14", "00:38", "01:30", "01:41", "01:52"];
const FINAL = PHASE_MS.length - 1;

export function Waveform({ bars = 9, active = true, className = "" }: { bars?: number; active?: boolean; className?: string }) {
  return (
    <span className={`gx-wave${active ? " is-active" : ""} ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <i key={i} style={{ animationDelay: `${(i % 5) * 0.11}s` }} />
      ))}
    </span>
  );
}

function Typing({ side }: { side: "caller" | "agent" }) {
  return (
    <motion.div
      className={`gx-bubble-row gx-${side}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="gx-typing" aria-hidden>
        <i />
        <i />
        <i />
      </div>
    </motion.div>
  );
}

function Bubble({ side, ar, gloss, showGloss }: { side: "caller" | "agent"; ar: string; gloss: string; showGloss: boolean }) {
  return (
    <motion.div
      className={`gx-bubble-row gx-${side}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <span className="gx-bubble-who">{side === "agent" ? "Foreman" : "Customer"}</span>
      <div className="gx-bubble">
        <Ar className="gx-bubble-ar">{ar}</Ar>
        {showGloss && <span className="gx-bubble-gloss">{gloss}</span>}
      </div>
    </motion.div>
  );
}

const STEP_ICONS = {
  dispatch: <UserCheck size={15} strokeWidth={2.2} />,
  booked: <CalendarCheck size={15} strokeWidth={2.2} />,
  whatsapp: <WhatsAppIcon size={15} />,
} as const;

export function LiveCallConsole({
  showGloss = true,
  restartKey = 0,
  className = "",
}: {
  showGloss?: boolean;
  /** Change this value to replay the call from the start. */
  restartKey?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) {
      setPhase(FINAL);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let p = 0;
    setPhase(0);
    const tick = () => {
      if (cancelled) return;
      timer = setTimeout(() => {
        p = p >= FINAL ? 0 : p + 1;
        setPhase(p);
        tick();
      }, PHASE_MS[p]);
    };
    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced, restartKey]);

  const speaking = phase === 2 || phase === 4;

  return (
    <div className={`gx-console ${className}`} dir="ltr" role="img" aria-label="Example call: a customer in Dubai reports, in Gulf Arabic, that the AC is not cooling. Foreman books a technician for tomorrow at 10 AM, briefs Tech Imran in Urdu, records AED 250 booked, and sends a WhatsApp confirmation.">
      <div className="gx-console-sheen" aria-hidden />

      <div className="gx-console-head">
        <span className="gx-live">
          <i aria-hidden />
          Live
        </span>
        <span className="gx-console-title">Inbound call · Dubai</span>
        <span className="gx-console-weather">
          <ThermometerSun size={14} strokeWidth={2.2} aria-hidden />
          21:14 · 46°C
        </span>
      </div>

      <div className="gx-console-caller">
        <div className={`gx-caller-avatar${phase === 0 ? " is-ringing" : ""}`}>
          <PhoneIncoming size={18} strokeWidth={2.2} aria-hidden />
        </div>
        <div className="gx-caller-id">
          <span className="gx-caller-num">+971 50 ••• 4412</span>
          <span className="gx-caller-meta">Al Barsha · AC &amp; HVAC</span>
        </div>
        <div className="gx-caller-right">
          <AnimatePresence mode="wait">
            {phase === 0 ? (
              <motion.span key="ring" className="gx-chip gx-chip-ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Ringing…
              </motion.span>
            ) : (
              <motion.span key="lang" className="gx-chip gx-chip-lang" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <Ar>العربية</Ar> · Gulf
              </motion.span>
            )}
          </AnimatePresence>
          <span className="gx-console-timer">{PHASE_CLOCK[phase]}</span>
        </div>
      </div>

      <div className="gx-transcript">
        <AnimatePresence>
          {phase === 0 && (
            <motion.div key="wait" className="gx-transcript-wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Waveform bars={14} />
              <span>Incoming call · answering now</span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>{phase === 2 && <Typing key="t1" side="caller" />}</AnimatePresence>
        {phase >= 3 && <Bubble side="caller" ar={SAMPLE_CALL.caller.ar} gloss={SAMPLE_CALL.caller.gloss} showGloss={showGloss} />}
        <AnimatePresence>{phase === 4 && <Typing key="t2" side="agent" />}</AnimatePresence>
        {phase >= 5 && <Bubble side="agent" ar={SAMPLE_CALL.agent.ar} gloss={SAMPLE_CALL.agent.gloss} showGloss={showGloss} />}
      </div>

      <ul className="gx-console-steps">
        {SAMPLE_CALL.system.map((s, i) => {
          const done = phase >= 6 + i;
          return (
            <li key={s.key} className={done ? "is-done" : ""}>
              <span className={`gx-step-ic gx-step-ic-${s.key}`}>{STEP_ICONS[s.key]}</span>
              <span className="gx-step-label">{s.label}</span>
              <span className="gx-step-meta">
                {s.key === "dispatch" ? (
                  <>
                    Briefed in <Ur>اردو</Ur>
                  </>
                ) : (
                  s.meta
                )}
              </span>
              <span className="gx-step-tick" aria-hidden>
                <CheckMark size={12} className="" />
              </span>
            </li>
          );
        })}
      </ul>

      <div className="gx-console-foot">
        <Waveform bars={7} active={speaking || phase < 6} />
        <span>{phase >= FINAL ? "Handled in 01:52 · Technician accepted" : "Foreman is on the call"}</span>
      </div>
    </div>
  );
}
