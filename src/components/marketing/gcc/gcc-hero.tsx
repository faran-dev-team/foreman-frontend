"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeftRight, ArrowRight, Pause, Play } from "lucide-react";

import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { SAMPLE_CALL_AUDIO_URL } from "@/lib/marketing/sample-call";

import { HERO, LANGUAGE_CHIPS } from "./content";
import { LiveCallConsole } from "./live-call-console";
import { Ar, CheckMark, EASE, INSTANT, GeoPattern, Hi, MagneticLink, Skyline, Ur } from "./primitives";

export function LanguageChips({ includeSwitch = true }: { includeSwitch?: boolean }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((a) => (a + 1) % LANGUAGE_CHIPS.length), 1800);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="gx-chips" aria-label="Languages: Arabic, English, Urdu and Hindi">
      {LANGUAGE_CHIPS.map((c, i) => (
        <span key={c.label} className={`gx-langchip${active === i ? " is-active" : ""}`}>
          {c.script === "ar" && <Ar>{c.label}</Ar>}
          {c.script === "en" && c.label}
          {c.script === "ur" && (
            <>
              <Ur>{c.label}</Ur>
              <span className="gx-langchip-sep">/</span>
              <Hi>{"suffix" in c ? c.suffix : ""}</Hi>
            </>
          )}
        </span>
      ))}
      {includeSwitch && (
        <span className="gx-langchip gx-langchip-switch">
          <ArrowLeftRight size={13} strokeWidth={2.4} aria-hidden />
          Switches Mid-Call
        </span>
      )}
    </div>
  );
}

/** "Hear a Sample Call" — plays the sample audio and replays the console. */
function SampleCallButton({ onPlay }: { onPlay: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = async () => {
    if (!audioRef.current) {
      const a = new Audio(SAMPLE_CALL_AUDIO_URL);
      a.preload = "auto";
      a.addEventListener("timeupdate", () => setProgress(a.duration ? a.currentTime / a.duration : 0));
      a.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(0);
      });
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("play", () => setPlaying(true));
      audioRef.current = a;
    }
    const a = audioRef.current;
    if (a.paused) {
      if (a.currentTime === 0) onPlay();
      try {
        await a.play();
      } catch {
        setPlaying(false);
      }
    } else {
      a.pause();
    }
  };

  const R = 15;
  const CIRC = 2 * Math.PI * R;

  return (
    <button type="button" className={`gx-btn gx-btn-ghost gx-sample${playing ? " is-playing" : ""}`} onClick={toggle} aria-pressed={playing}>
      <span className="gx-sample-ic" aria-hidden>
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={R} className="gx-sample-track" />
          <circle cx="18" cy="18" r={R} className="gx-sample-ring" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)} />
        </svg>
        {playing ? <Pause size={14} strokeWidth={2.6} /> : <Play size={14} strokeWidth={2.6} />}
      </span>
      <span>
        {playing ? "Playing Sample Call" : HERO.secondaryCta}
        <span className="gx-sample-meta"> ({HERO.secondaryCtaMeta})</span>
      </span>
    </button>
  );
}

export function TrustLine({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`gx-trust ${className}`}>
      {items.map((t) => (
        <li key={t}>
          <CheckMark size={15} />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function HeroBackdrop({ id }: { id: string }) {
  return (
    <div className="gx-hero-bg" aria-hidden>
      <GeoPattern id={id} opacity={0.075} />
      <div className="gx-hero-glow gx-hero-glow-a" />
      <div className="gx-hero-glow gx-hero-glow-b" />
      <div className="gx-hero-sun" />
      <Skyline />
    </div>
  );
}

export function GccHero() {
  const reduced = useReducedMotion();
  const [replay, setReplay] = useState(0);
  const fade = (delay: number) =>
    ({
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: reduced ? INSTANT : { duration: 0.8, delay, ease: EASE },
    });

  return (
    <header id="top" className="gx-hero">
      <HeroBackdrop id="gx-hero-geo" />

      <div className="gx-wrap gx-hero-grid">
        <div className="gx-hero-copy">
          <motion.div className="gx-kicker gx-hero-kicker" {...fade(0.05)}>
            <span className="gx-kicker-dot" aria-hidden />
            {HERO.kicker}
          </motion.div>

          <motion.h1 className="gx-h1" {...fade(0.12)}>
            {HERO.headlineLead} <em className="gx-accent gx-accent-glow">{HERO.headlineAccent}</em>
          </motion.h1>

          <motion.p className="gx-hero-ar" {...fade(0.22)}>
            <Ar display>{HERO.arabicSub}</Ar>
          </motion.p>

          <motion.p className="gx-hero-sub" {...fade(0.3)}>
            {HERO.sub}
          </motion.p>

          <motion.div {...fade(0.38)}>
            <LanguageChips />
          </motion.div>

          <motion.div className="gx-hero-ctas" {...fade(0.46)}>
            <MagneticLink href={CALENDLY_PILOT_URL} className="gx-btn gx-btn-primary gx-btn-lg">
              {HERO.primaryCta}
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
            </MagneticLink>
            <SampleCallButton onPlay={() => setReplay((r) => r + 1)} />
          </motion.div>

          <motion.div {...fade(0.56)}>
            <TrustLine items={HERO.trust} />
          </motion.div>
        </div>

        <motion.div
          className="gx-hero-visual"
          initial={{ opacity: 0, y: 30, rotateX: 6 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={reduced ? INSTANT : { duration: 1.1, delay: 0.3, ease: EASE }}
        >
          <div className="gx-hero-orbit" aria-hidden>
            <span className="gx-orbit-chip gx-orbit-a">
              <Ar>العربية</Ar>
            </span>
            <span className="gx-orbit-chip gx-orbit-b">English</span>
            <span className="gx-orbit-chip gx-orbit-c">
              <Ur>اردو</Ur>
            </span>
          </div>
          <LiveCallConsole restartKey={replay} />
        </motion.div>
      </div>
    </header>
  );
}
