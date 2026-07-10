"use client";

/* ================================================================== */
/*  foreman-illustrations.tsx                                           */
/*                                                                      */
/*  Premium editorial illustration system â€” dark-native.               */
/*  Designed for use on #0A0F1C and #141C30 dark backgrounds.          */
/*  Inspired by: Wispr Flow, Linear, Arc, Slack, Dropbox.              */
/*                                                                      */
/*  API unchanged â€” all exports, names, and props preserved.           */
/* ================================================================== */

import React from "react";

/* ------------------------------------------------------------------ */
/*  Design tokens (matched to landing page brand)                      */
/* ------------------------------------------------------------------ */
const C = {
  orange:      "#F97A35",
  orangeLight: "#FFB27A",
  orangeDim:   "rgba(249,122,53,0.15)",
  green:       "#1FAA59",
  greenDim:    "rgba(31,170,89,0.15)",
  navy:        "#0A0F1C",
  card:        "#141C30",
  slate:       "#1E2A42",
  white:       "#FFFFFF",
  offWhite:    "rgba(255,255,255,0.85)",
  dim:         "rgba(255,255,255,0.35)",
  dimmer:      "rgba(255,255,255,0.15)",
  purple:      "#D7B5FF",
  purpleDim:   "rgba(215,181,255,0.2)",
  sky:         "#89D4F5",
  skyDim:      "rgba(137,212,245,0.15)",
  yellow:      "#FFE066",
  skin:        "#F5B888",
  skinDark:    "#E09060",
};

type IllustrationProps = {
  className?: string;
  style?: React.CSSProperties;
};

/* ================================================================== */
/*  SharedDefs â€” gradients, filters, keyframe animations               */
/*  Each SVG renders its own <SharedDefs /> so IDs stay in scope.      */
/* ================================================================== */
function SharedDefs() {
  return (
    <defs>
      {/* â”€â”€ Gradients â”€â”€ */}
      <linearGradient id="g-orange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#FFB27A" />
        <stop offset="100%" stopColor="#F97A35" />
      </linearGradient>

      <linearGradient id="g-orangeV" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#FFD4A8" />
        <stop offset="100%" stopColor="#F97A35" stopOpacity="0.6" />
      </linearGradient>

      <linearGradient id="g-green" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#2DD87A" />
        <stop offset="100%" stopColor="#1FAA59" />
      </linearGradient>

      <linearGradient id="g-card" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#1E2A42" />
        <stop offset="100%" stopColor="#141C30" />
      </linearGradient>

      <linearGradient id="g-skin" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#FFD5B0" />
        <stop offset="100%" stopColor="#E09060" />
      </linearGradient>

      <linearGradient id="g-sky" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#C8F0FF" />
        <stop offset="100%" stopColor="#89D4F5" />
      </linearGradient>

      <linearGradient id="g-purple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#EDD9FF" />
        <stop offset="100%" stopColor="#D7B5FF" />
      </linearGradient>

      <linearGradient id="g-slate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#2A3A5A" />
        <stop offset="100%" stopColor="#1E2A42" />
      </linearGradient>

      {/* â”€â”€ Filters â”€â”€ */}
      {/* Soft drop shadow for floating effect */}
      <filter id="f-shadow" x="-25%" y="-15%" width="150%" height="160%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.55" />
      </filter>

      <filter id="f-shadowSm" x="-25%" y="-15%" width="150%" height="150%">
        <feDropShadow dx="0" dy="4" stdDeviation="7"  floodColor="#000000" floodOpacity="0.45" />
      </filter>

      {/* Orange glow */}
      <filter id="f-glowOrange" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feFlood floodColor="#F97A35" floodOpacity="0.4" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Green glow */}
      <filter id="f-glowGreen" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feFlood floodColor="#1FAA59" floodOpacity="0.45" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Soft general glow â€” proper bloom: blur then merge over source */}
      <filter id="f-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* â”€â”€ CSS Animations â”€â”€
           Guard: only inject once even when multiple SVGs are on the same page.
           The empty :where() prevents specificity issues with fm-landing animation reset. */}
      <style>{`
        @keyframes il-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes il-floatSlow {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes il-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
        @keyframes il-pulseSlow {
          0%,100% { opacity:0.8; }
          50%      { opacity:0.3; }
        }
        @keyframes il-spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes il-wiggle {
          0%,100% { transform: rotate(-5deg); }
          50%      { transform: rotate(5deg); }
        }
        @keyframes il-bounce {
          0%,100% { transform: translateY(0); }
          38%      { transform: translateY(-9px); }
          58%      { transform: translateY(-4px); }
        }
        @keyframes il-blink {
          0%,88%,100% { transform: scaleY(1); }
          93%          { transform: scaleY(0.08); }
        }
        @keyframes il-ringPulse {
          0%   { transform:scale(1);   opacity:0.7; }
          100% { transform:scale(1.8); opacity:0; }
        }
        @keyframes il-barPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.3; }
        }
        /* Using :where() keeps specificity at 0 so fm-landing overrides still work.
           prefers-reduced-motion handled by the existing fm-landing CSS rule. */
        :where(.il-float)     { animation: il-float     3.2s ease-in-out infinite; }
        :where(.il-floatSlow) { animation: il-floatSlow 4.4s ease-in-out infinite; }
        :where(.il-pulse)     { animation: il-pulse     2.1s ease-in-out infinite; }
        :where(.il-pulseSlow) { animation: il-pulseSlow 3.5s ease-in-out infinite; }
        :where(.il-spinSlow)  { animation: il-spinSlow  9s   linear        infinite; transform-origin:50% 50%; }
        :where(.il-wiggle)    { animation: il-wiggle    2.4s ease-in-out infinite; transform-origin:50% 100%; }
        :where(.il-bounce)    { animation: il-bounce    1.7s ease-in-out infinite; }
        :where(.il-blink)     { animation: il-blink     4s   ease-in-out infinite; transform-origin:50% 50%; }
        :where(.il-ringPulse) { animation: il-ringPulse 1.6s ease-out   infinite; }
        :where(.il-bp1)       { animation: il-barPulse  1.3s ease-in-out infinite 0s; }
        :where(.il-bp2)       { animation: il-barPulse  1.3s ease-in-out infinite 0.22s; }
        :where(.il-bp3)       { animation: il-barPulse  1.3s ease-in-out infinite 0.44s; }
      `}</style>
    </defs>
  );
}

/* ================================================================== */
/*  DoodleTechnicianOnCall — Premium AI Workflow Badge                  */
/*  Shows the core Foreman system: call → AI → book. Isometric-        */
/*  tilted card with a headset glyph, orbiting workflow nodes, live     */
/*  pulse rings, and a subtle data-flow path. Dark-native, brand        */
/*  orange/green palette, no cartoon imagery.                           */
/* ================================================================== */
export function DoodleTechnicianOnCall({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="180" height="180" viewBox="0 0 180 180" fill="none" aria-hidden>
      <SharedDefs />

      {/* Ground shadow */}
      <ellipse cx="90" cy="170" rx="52" ry="8" fill="black" opacity="0.35" />

      <g className="il-float">
        {/* Outer faint orbit track */}
        <circle cx="90" cy="86" r="68" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" strokeDasharray="4 8" />

        {/* Pulse rings — "system is live" */}
        <circle cx="90" cy="86" r="50" stroke={C.orange} strokeWidth="1.5" opacity="0.18" fill="none" className="il-ringPulse" />
        <circle
          cx="90" cy="86" r="50" stroke={C.orange} strokeWidth="1.5" opacity="0.12" fill="none"
          className="il-ringPulse"
          style={{ animationDelay: "1.1s" }}
        />

        {/* ── Workflow node connector lines ── */}
        {/* Phone → center */}
        <line x1="90" y1="26" x2="90" y2="52" stroke="rgba(249,122,53,0.25)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        {/* AI center → Calendar */}
        <line x1="146" y1="62" x2="120" y2="68" stroke="rgba(31,170,89,0.2)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        {/* center → SMS */}
        <line x1="140" y1="112" x2="118" y2="104" stroke="rgba(137,212,245,0.2)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
        {/* center → CRM */}
        <line x1="40" y1="112" x2="62" y2="104" stroke="rgba(215,181,255,0.2)" strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />

        {/* ── Orbiting workflow nodes ── */}
        {/* Node: Phone (top — incoming call) */}
        <g className="il-pulse" style={{ animationDelay: "0s" }}>
          <rect x="72" y="10" width="36" height="26" rx="8" fill="rgba(10,15,28,0.9)" stroke="rgba(249,122,53,0.5)" strokeWidth="1.5" />
          {/* Phone glyph */}
          <path d="M83 16 q0-2 2-2h8q2 0 2 2v14q0 2-2 2h-8q-2 0-2-2z" stroke={C.orange} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <line x1="90" y1="28" x2="90" y2="29" stroke={C.orange} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Node: Calendar/booked (top right) */}
        <g className="il-pulse" style={{ animationDelay: "0.4s" }}>
          <rect x="138" y="48" width="34" height="28" rx="8" fill="rgba(10,15,28,0.9)" stroke="rgba(31,170,89,0.45)" strokeWidth="1.5" />
          {/* Calendar glyph */}
          <rect x="145" y="55" width="20" height="14" rx="3" stroke={C.green} strokeWidth="1.3" fill="none" />
          <line x1="145" y1="59" x2="165" y2="59" stroke={C.green} strokeWidth="1.2" />
          <line x1="150" y1="55" x2="150" y2="53" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="160" y1="55" x2="160" y2="53" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" />
          {/* Check mark */}
          <path d="M149 63.5l2.5 2.5 5-5" stroke={C.green} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Node: SMS / notification (bottom right) */}
        <g className="il-pulse" style={{ animationDelay: "0.8s" }}>
          <rect x="132" y="99" width="36" height="26" rx="8" fill="rgba(10,15,28,0.9)" stroke="rgba(137,212,245,0.35)" strokeWidth="1.5" />
          {/* Chat bubble glyph */}
          <path d="M140 105 q0-2 2-2h16q2 0 2 2v8q0 2-2 2h-8l-4 4v-4h-4q-2 0-2-2z" stroke={C.sky} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
          <line x1="143" y1="109" x2="155" y2="109" stroke={C.sky} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="143" y1="112" x2="151" y2="112" stroke={C.sky} strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Node: CRM (bottom left) */}
        <g className="il-pulse" style={{ animationDelay: "1.2s" }}>
          <rect x="10" y="99" width="36" height="26" rx="8" fill="rgba(10,15,28,0.9)" stroke="rgba(215,181,255,0.35)" strokeWidth="1.5" />
          {/* Database glyph */}
          <ellipse cx="28" cy="107" rx="9" ry="3.5" stroke={C.purple} strokeWidth="1.3" fill="none" />
          <line x1="19" y1="107" x2="19" y2="117" stroke={C.purple} strokeWidth="1.3" />
          <line x1="37" y1="107" x2="37" y2="117" stroke={C.purple} strokeWidth="1.3" />
          <ellipse cx="28" cy="117" rx="9" ry="3.5" stroke={C.purple} strokeWidth="1.3" fill="none" />
          <path d="M19 112 q9 3.5 18 0" stroke={C.purple} strokeWidth="1" fill="none" />
        </g>

        {/* ── Central badge card (isometric tilt) ── */}
        <g transform="rotate(-5 90 86)">
          {/* Card shadow layer */}
          <rect x="44" y="48" width="92" height="82" rx="20" fill="rgba(0,0,0,0.4)" transform="translate(3, 5)" />
          {/* Main card */}
          <rect x="44" y="48" width="92" height="82" rx="20" fill="url(#g-slate)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" filter="url(#f-shadow)" />
          {/* Inset bevel top highlight */}
          <path d="M56 56 Q90 50 124 56" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Subtle interior rule */}
          <line x1="44" y1="74" x2="136" y2="74" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* Center orange plate */}
          <rect x="62" y="60" width="56" height="56" rx="14" fill="url(#g-orange)" filter="url(#f-glowOrange)" />

          {/* Headset glyph — clean, confident, professional */}
          {/* Arc (headband) */}
          <path d="M76 90 a14 14 0 0 1 28 0" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Left earpiece */}
          <rect x="72" y="88" width="7" height="12" rx="3.5" fill="white" opacity="0.95" />
          {/* Right earpiece */}
          <rect x="101" y="88" width="7" height="12" rx="3.5" fill="white" opacity="0.95" />
          {/* Boom mic */}
          <path d="M109 100 v3 a7 7 0 0 1-7 7 h-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Mic tip dot */}
          <circle cx="96" cy="110" r="2" fill="white" opacity="0.7" />
        </g>

        {/* Status chip — bottom right of card */}
        <g transform="translate(98, 134)">
          <rect width="46" height="22" rx="11" fill="rgba(10,15,28,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" filter="url(#f-shadowSm)" />
          <circle cx="12" cy="11" r="3.5" fill={C.green} className="il-pulse" />
          {/* Equalizer bars */}
          <rect x="22" y="7" width="2.5" height="8"  rx="1.25" fill="rgba(255,255,255,0.5)"  className="il-bp1" />
          <rect x="27" y="5" width="2.5" height="12" rx="1.25" fill="rgba(255,255,255,0.65)" className="il-bp2" />
          <rect x="32" y="8" width="2.5" height="6"  rx="1.25" fill="rgba(255,255,255,0.5)"  className="il-bp3" />
          <rect x="37" y="6" width="2.5" height="10" rx="1.25" fill="rgba(255,255,255,0.6)"  className="il-bp2" />
        </g>
      </g>

      {/* Restrained ambient accents */}
      <circle cx="14" cy="30" r="3" fill={C.orange} opacity="0.35" />
      <circle cx="162" cy="148" r="3" fill={C.green} opacity="0.35" />
      <circle cx="158" cy="34" r="2" fill={C.sky} opacity="0.4" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleServiceVan                                                    */
/*  Cartoon van â€” dark card body, orange stripe, glowing headlights    */
/* ================================================================== */
export function DoodleServiceVan({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="220" height="140" viewBox="0 0 220 140" fill="none" aria-hidden>
      <SharedDefs />

      {/* ground shadow */}
      <ellipse cx="110" cy="132" rx="88" ry="9" fill="black" opacity="0.5" />

      <g className="il-floatSlow">
        {/* â”€â”€ Van body â”€â”€ */}
        <path d="M14 96 V56 Q14 42 30 42 H128 L164 68 H202 Q210 68 210 80 V96 Z"
          fill="url(#g-slate)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" filter="url(#f-shadow)" />

        {/* orange side stripe */}
        <path d="M14 74 H160 L168 84 H14 Z" fill="url(#g-orange)" opacity="0.9" />

        {/* windshield */}
        <path d="M128 42 L164 68 H128 Z"
          fill="url(#g-sky)" opacity="0.45" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M134 50 L158 66" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />

        {/* side windows */}
        <rect x="28" y="48" width="44" height="28" rx="9" fill="url(#g-sky)" opacity="0.35" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="80" y="48" width="40" height="28" rx="9" fill="url(#g-sky)" opacity="0.35" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        {/* window glints */}
        <path d="M34 53 L40 53" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        <path d="M86 53 L92 53" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.45" />

        {/* door divider */}
        <path d="M76 42 V96" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" />

        {/* â”€â”€ Wheels â”€â”€ */}
        <circle cx="54"  cy="98" r="22" fill={C.navy} stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
        <circle cx="54"  cy="98" r="14" fill="#0E1520" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <circle cx="54"  cy="98" r="6"  fill={C.orange} filter="url(#f-glowOrange)" />

        <circle cx="170" cy="98" r="22" fill={C.navy} stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
        <circle cx="170" cy="98" r="14" fill="#0E1520" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <circle cx="170" cy="98" r="6"  fill={C.orange} filter="url(#f-glowOrange)" />

        {/* wheel spokes */}
        <path d="M54 84 V112 M40 98 H68" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />
        <path d="M170 84 V112 M156 98 H184" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" />

        {/* logo badge */}
        <circle cx="110" cy="82" r="10" fill={C.orange} filter="url(#f-glowOrange)" />
        <path d="M106 82 L109 85 L116 78" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* headlight */}
        <rect x="202" y="72" width="8" height="18" rx="4" fill={C.yellow} opacity="0.9" filter="url(#f-glow)" />
        {/* tail light */}
        <rect x="10" y="72" width="7" height="18" rx="3.5" fill="#FF5555" opacity="0.85" />

        {/* van body shine */}
        <path d="M24 58 Q110 48 190 58" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.1" fill="none" />
      </g>

      {/* â”€â”€ Motion lines â”€â”€ */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <path d="M0 78 H14" stroke={C.orange} strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
        <path d="M0 88 H12" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        <path d="M2 68 H14" stroke={C.orange} strokeWidth="2"   strokeLinecap="round" opacity="0.25" />
      </g>

      {/* accent sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.6s" }}>
        <circle cx="208" cy="42" r="4" fill={C.green} opacity="0.65" />
        <circle cx="214" cy="52" r="2" fill={C.green} opacity="0.45" />
      </g>
      <circle cx="18"  cy="38" r="2.5" fill={C.purple}      opacity="0.5" />
      <circle cx="202" cy="30" r="2"   fill={C.orangeLight} opacity="0.5" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleRingingPhone                                                  */
/*  Modern smartphone â€” dark body, glowing orange notification,        */
/*  pulse rings, bouncing                                               */
/* ================================================================== */
export function DoodleRingingPhone({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="140" height="140" viewBox="0 0 200 200" fill="none" aria-hidden>
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="85" cy="70" r="22" />
        </clipPath>
      </defs>
      
      {/* Floor Shadow */}
      <ellipse cx="100" cy="175" rx="55" ry="10" fill="#EADDF4" />

      {/* Tilted Phone Group */}
      <g transform="translate(100, 95) rotate(-12) translate(-100, -95)" className="il-floatSlow">
        
        {/* Left Buttons */}
        <path d="M 40 50 L 32 50 L 32 70 L 40 70 Z" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 40 80 L 32 80 L 32 100 L 40 100 Z" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />

        {/* Phone Body Base */}
        <rect x="40" y="20" width="90" height="150" rx="15" fill="#EADDF4" stroke="#111" strokeWidth="6" strokeLinejoin="round" />
        
        {/* Screen Base */}
        <rect x="46" y="26" width="78" height="138" rx="10" fill="#FFFBF0" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
        
        {/* Notch */}
        <rect x="65" y="26" width="40" height="12" rx="6" fill="#111" />

        {/* Avatar Area */}
        <circle cx="85" cy="70" r="22" fill="#EADDF4" stroke="#111" strokeWidth="5" />
        <g clipPath="url(#avatar-clip)">
          <circle cx="85" cy="62" r="8" fill="#FFFBF0" stroke="#111" strokeWidth="4" />
          <path d="M 60 90 C 60 75, 110 75, 110 90 Z" fill="#FFFBF0" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
        </g>
        <circle cx="85" cy="70" r="22" fill="none" stroke="#111" strokeWidth="5" />

        {/* Text Lines */}
        <line x1="62" y1="105" x2="108" y2="105" stroke="#111" strokeWidth="5" strokeLinecap="round" />
        <line x1="68" y1="116" x2="102" y2="116" stroke="#B3B3B3" strokeWidth="5" strokeLinecap="round" />

        {/* Green Accept Button */}
        <circle cx="65" cy="140" r="14" fill="#70A653" stroke="#111" strokeWidth="4" />
        {/* Green button icon (tilted receiver) */}
        <path d="M 59 144 C 57 136, 67 134, 71 136" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
        
        {/* Orange Decline Button */}
        <circle cx="105" cy="140" r="14" fill="#F89235" stroke="#111" strokeWidth="4" />
        {/* Orange button icon (horizontal receiver) */}
        <path d="M 98 140 C 98 135, 112 135, 112 140" fill="none" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Ringing Waves Left */}
      <g stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" className="il-pulseSlow">
        <path d="M 40 120 C 30 130, 30 150, 40 160" />
        <path d="M 30 125 C 20 135, 20 145, 30 155" />
      </g>
      
      {/* Ringing Waves Right */}
      <g stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" className="il-pulseSlow" style={{ animationDelay: "0.2s" }}>
        <path d="M 150 110 C 160 120, 160 140, 150 150" />
        <path d="M 160 115 C 170 125, 170 135, 160 145" />
      </g>

      {/* Orange Sunbursts Left */}
      <g stroke="#F89235" strokeWidth="5" strokeLinecap="round" className="il-pulseSlow" style={{ animationDelay: "0.4s" }}>
        <line x1="45" y1="80" x2="28" y2="90" />
        <line x1="42" y1="58" x2="25" y2="62" />
        <line x1="55" y1="38" x2="40" y2="30" />
      </g>
      
      {/* Orange Sunbursts Right */}
      <g stroke="#F89235" strokeWidth="5" strokeLinecap="round" className="il-pulseSlow" style={{ animationDelay: "0.6s" }}>
        <line x1="135" y1="40" x2="152" y2="25" />
        <line x1="145" y1="60" x2="168" y2="52" />
        <line x1="148" y1="82" x2="168" y2="88" />
      </g>

    </svg>
  );
}

/* ================================================================== */
/*  DoodleHardHat                                                       */
/*  Construction helmet â€” orange gradient dome, green check badge      */
/* ================================================================== */
export function DoodleHardHat({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="130" height="110" viewBox="0 0 130 110" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="65" cy="104" rx="44" ry="8" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* dome */}
        <path d="M14 68 Q12 28 65 22 Q118 28 116 68 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" filter="url(#f-shadow)" />

        {/* dome highlights */}
        <path d="M36 44 Q65 30 94 44" stroke="rgba(255,255,255,0.3)" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M46 36 Q65 28 84 36" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* brim */}
        <rect x="8" y="65" width="114" height="13" rx="6.5"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />

        {/* center vent ridge */}
        <path d="M65 22 V68" stroke="rgba(255,255,255,0.2)" strokeWidth="3" strokeLinecap="round" />

        {/* side vents */}
        <rect x="24" y="51" width="20" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />
        <rect x="86" y="51" width="20" height="9" rx="4.5" fill="rgba(255,255,255,0.12)" />

        {/* size-adjust strap */}
        <rect x="44" y="78" width="42" height="13" rx="6.5"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <path d="M58 84 H72" stroke={C.orange} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />

        {/* â”€â”€ Green check badge â”€â”€ */}
        <circle cx="98" cy="86" r="22"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" filter="url(#f-glowGreen)" />
        <path d="M88 86 L95 93 L108 79" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <circle cx="10" cy="20" r="4.5" fill={C.orange} opacity="0.6" />
        <circle cx="18" cy="12" r="2.5" fill={C.orange} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.7s" }}>
        <circle cx="120" cy="18" r="3.5" fill={C.green} opacity="0.6" />
        <circle cx="126" cy="28" r="2"   fill={C.green} opacity="0.45" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.4s" }}>
        <path d="M14 90 L16 84 L18 90 L24 92 L18 94 L16 100 L14 94 L8 92 Z" fill={C.purple} opacity="0.5" />
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  DoodleClipboard                                                     */
/*  Rounded clipboard â€” dark card body, orange clip,                   */
/*  green checks, pencil detail                                         */
/* ================================================================== */
export function DoodleClipboard({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="140" height="170" viewBox="0 0 200 200" fill="none" aria-hidden>
      {/* Board Group with rotation */}
      <g transform="rotate(-6 100 100) translate(0, 5)" className="il-floatSlow">
        {/* Board Background */}
        <rect x="40" y="30" width="100" height="130" rx="12" fill="#EADDF4" stroke="#111" strokeWidth="5" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.3))" />
        
        {/* Paper */}
        <rect x="50" y="45" width="80" height="110" rx="8" fill="#FFFBF0" stroke="#111" strokeWidth="5" />
        
        {/* Checkboxes */}
        <g stroke="#111" strokeWidth="5" fill="#FFFBF0">
           <rect x="60" y="55" width="14" height="14" rx="3" />
           <rect x="60" y="77" width="14" height="14" rx="3" />
           <rect x="60" y="99" width="14" height="14" rx="3" />
           <rect x="60" y="121" width="14" height="14" rx="3" />
        </g>

        {/* Lines */}
        <g stroke="#111" strokeWidth="5" strokeLinecap="round">
           <line x1="84" y1="62" x2="114" y2="62" />
           <line x1="84" y1="84" x2="120" y2="84" />
           <line x1="84" y1="106" x2="122" y2="106" />
           <line x1="84" y1="128" x2="114" y2="128" />
        </g>

        {/* Purple Checkmarks */}
        <g stroke="#9161D3" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <polyline points="63,62 67,66 77,50" />
           <polyline points="63,84 67,88 77,72" />
        </g>

        {/* Orange Clip Base */}
        <path d="M 65 45 L 65 35 A 10 10 0 0 1 75 25 L 80 25 L 80 15 A 10 10 0 0 1 100 15 L 100 25 L 105 25 A 10 10 0 0 1 115 35 L 115 45 Z" fill="#F89235" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="90" cy="18" r="4" fill="#FFFBF0" stroke="#111" strokeWidth="4" />

        {/* Pen Strapped to Right */}
        <g transform="translate(135, 55) rotate(15)">
           <path d="M6 -5 L14 -5 L14 5 L6 5 Z" fill="#FFFBF0" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
           <path d="M4 5 L16 5 L16 15 L4 15 Z" fill="#F89235" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
           <path d="M2 15 L18 15 L18 90 L10 105 L2 90 Z" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
           <path d="M2 90 L18 90 L10 105 Z" fill="#111" />
           <path d="M18 25 L24 25 L24 60 L18 60" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Outer Accents */}
      <g stroke="#F89235" strokeWidth="4" strokeLinecap="round" fill="none" className="il-pulseSlow">
        <line x1="30" y1="70" x2="16" y2="76" />
        <line x1="32" y1="88" x2="12" y2="88" />
        <line x1="32" y1="106" x2="16" y2="112" />
        <path d="M 160 145 C 168 145, 172 150, 166 155 C 160 160, 168 165, 166 170" />
      </g>
      
      <g stroke="#111" strokeWidth="4" strokeLinecap="round" className="il-pulseSlow" style={{ animationDelay: "1s" }}>
        <line x1="140" y1="40" x2="148" y2="25" />
        <line x1="150" y1="52" x2="162" y2="38" />
        <line x1="155" y1="68" x2="170" y2="58" />
      </g>
      
      <line x1="45" y1="180" x2="155" y2="170" stroke="#111" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleIntegrations                                                */
/*  App nodes syncing data to a central hub, representing tools       */
/* ================================================================== */
export function DoodleIntegrations({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="220" height="150" viewBox="0 0 220 150" fill="none" aria-hidden>
      
      {/* Floor Shadow */}
      <ellipse cx="110" cy="140" rx="70" ry="10" fill="#EADDF4" />

      {/* Connections */}
      <g stroke="#111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10" className="il-pulseSlow">
        {/* Left to Center */}
        <path d="M 50 60 Q 60 100 90 110" />
        {/* Top to Center */}
        <path d="M 110 40 L 110 90" />
        {/* Right to Center */}
        <path d="M 170 60 Q 160 100 130 110" />
      </g>
      
      {/* Moving data packets (dots) */}
      <g stroke="#111" strokeWidth="3" className="il-pulse">
        <circle cx="68" cy="88" r="5" fill="#70A653" />
        <circle cx="110" cy="65" r="5" fill="#EADDF4" />
        <circle cx="152" cy="88" r="5" fill="#F89235" />
      </g>

      {/* Central Hub */}
      <g transform="translate(110, 115) translate(-110, -115)" className="il-floatSlow">
        <rect x="80" y="85" width="60" height="60" rx="14" fill="#FFFBF0" stroke="#111" strokeWidth="5" />
        <circle cx="110" cy="115" r="16" fill="#F89235" stroke="#111" strokeWidth="5" />
        <circle cx="110" cy="115" r="6" fill="#FFFBF0" stroke="#111" strokeWidth="4" />
        <path d="M 90 135 L 100 135 M 120 135 L 130 135" stroke="#111" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
      </g>

      {/* Left Node (Calendar) */}
      <g transform="translate(45, 50) translate(-45, -50)" className="il-floatSlow" style={{ animationDelay: "0.2s" }}>
        <rect x="25" y="30" width="40" height="40" rx="10" fill="#FFFBF0" stroke="#111" strokeWidth="5" />
        <path d="M 25 42 L 65 42" stroke="#111" strokeWidth="5" />
        <rect x="33" y="24" width="6" height="12" rx="3" fill="#F89235" stroke="#111" strokeWidth="4" />
        <rect x="51" y="24" width="6" height="12" rx="3" fill="#F89235" stroke="#111" strokeWidth="4" />
        <rect x="33" y="50" width="10" height="10" rx="3" fill="#EADDF4" />
        <rect x="47" y="50" width="10" height="10" rx="3" fill="#EADDF4" />
      </g>

      {/* Top Node (Gear) */}
      <g transform="translate(110, 20) translate(-110, -20)" className="il-floatSlow" style={{ animationDelay: "0.7s" }}>
        <rect x="90" y="0" width="40" height="40" rx="10" fill="#FFFBF0" stroke="#111" strokeWidth="5" />
        <circle cx="110" cy="20" r="10" fill="#EADDF4" stroke="#111" strokeWidth="5" />
        <circle cx="110" cy="20" r="3" fill="#FFFBF0" stroke="#111" strokeWidth="4" />
        <path d="M 110 5 L 110 10 M 110 30 L 110 35 M 95 20 L 100 20 M 120 20 L 125 20" stroke="#111" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Right Node (Message) */}
      <g transform="translate(175, 50) translate(-175, -50)" className="il-floatSlow" style={{ animationDelay: "0.4s" }}>
        <rect x="155" y="30" width="40" height="40" rx="10" fill="#FFFBF0" stroke="#111" strokeWidth="5" />
        <path d="M 163 48 Q 163 38 175 38 Q 187 38 187 48 Q 187 58 178 58 L 173 64 L 173 58 Q 163 58 163 48 Z" fill="#EADDF4" stroke="#111" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 169 48 L 181 48" stroke="#111" strokeWidth="4" strokeLinecap="round" />
      </g>
      
      {/* Accents & Sparkles */}
      <g stroke="#F89235" strokeWidth="4" strokeLinecap="round" className="il-pulseSlow">
        <line x1="20" y1="30" x2="12" y2="22" />
        <line x1="15" y1="50" x2="5" y2="50" />
      </g>
      <g stroke="#EADDF4" strokeWidth="4" strokeLinecap="round" className="il-pulseSlow" style={{ animationDelay: "0.2s" }}>
        <line x1="85" y1="10" x2="75" y2="5" />
        <line x1="135" y1="10" x2="145" y2="5" />
      </g>
      <g stroke="#F89235" strokeWidth="4" strokeLinecap="round" className="il-pulseSlow" style={{ animationDelay: "0.4s" }}>
        <line x1="195" y1="40" x2="205" y2="35" />
        <line x1="190" y1="65" x2="200" y2="75" />
      </g>
      
      <g stroke="#111" strokeWidth="4" strokeLinecap="round" className="il-pulseSlow">
        <path d="M 20 110 L 20 120 M 15 115 L 25 115" />
        <path d="M 200 115 L 200 125 M 195 120 L 205 120" style={{ animationDelay: "0.6s" }} />
      </g>

    </svg>
  );
}

/* ================================================================== */
/*  DoodleWrenchGear                                                    */
/*  Large orange wrench + dark spinning gear â€” mechanical but cute     */
/* ================================================================== */
export function DoodleWrenchGear({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="130" height="130" viewBox="0 0 130 130" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="65" cy="124" rx="40" ry="7" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* â”€â”€ Spinning gear â”€â”€ */}
        <g className="il-spinSlow" style={{ transformOrigin: "88px 42px" }}>
          {[0,45,90,135,180,225,270,315].map((angle, i) => (
            <rect key={i} x="83" y="15" width="10" height="14" rx="4"
              fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"
              transform={`rotate(${angle} 88 42)`} />
          ))}
          <circle cx="88" cy="42" r="24" fill="url(#g-slate)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
          <circle cx="88" cy="42" r="12" fill={C.orange} stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-glowOrange)" />
          <circle cx="88" cy="42" r="5"  fill="rgba(255,255,255,0.5)" />
          {/* gear detail lines */}
          <path d="M88 30 V54 M76 42 H100" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* â”€â”€ Wrench â”€â”€ */}
        <g className="il-wiggle" style={{ transform: "rotate(-38deg)", transformOrigin: "50px 74px" }}>
          {/* handle */}
          <rect x="38" y="56" width="24" height="72" rx="12"
            fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
          {/* grip lines */}
          <path d="M42 88 H58" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 98 H58" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 108 H58" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
          {/* wrench head */}
          <path d="M26 42 Q24 20 40 16 Q52 14 56 24 L56 34 L64 34 L64 52 L56 52 Q52 60 40 58 Q24 54 26 42 Z"
            fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
          {/* jaw gap detail */}
          <path d="M56 24 L56 34" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 34 L64 52" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
          {/* nut shape */}
          <path d="M36 28 L42 26 L48 28 L48 38 L42 40 L36 38 Z"
            fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        </g>
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <circle cx="8"  cy="26" r="4.5" fill={C.orange} opacity="0.6" />
        <circle cx="14" cy="16" r="2.5" fill={C.orange} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.6s" }}>
        <circle cx="120" cy="94" r="4" fill={C.green} opacity="0.65" />
        <circle cx="126" cy="104" r="2" fill={C.green} opacity="0.45" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.9s" }}>
        <path d="M14 116 L16 110 L18 116 L24 118 L18 120 L16 126 L14 120 L8 118 Z" fill={C.purple} opacity="0.5" />
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  DoodleSunburst                                                      */
/*  Hand-drawn radiating sunburst rays                                  */
/* ================================================================== */
export function DoodleSunburst({ className, style, color = "#F97A35" }: IllustrationProps & { color?: string }) {
  return (
    <svg className={className} style={style} width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
      <g stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.9" className="il-wiggle">
        <line x1="32" y1="88" x2="20" y2="98" />
        <line x1="25" y1="65" x2="10" y2="70" />
        <line x1="30" y1="40" x2="18" y2="28" />
        <line x1="45" y1="25" x2="38" y2="10" />
        <line x1="65" y1="20" x2="68" y2="5" />
        <line x1="85" y1="30" x2="98" y2="20" />
        <line x1="95" y1="50" x2="112" y2="55" />
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  DoodleHouseCheck                                                    */
/*  Friendly house â€” dark card body, orange roof, glowing green badge  */
/* ================================================================== */
export function DoodleHouseCheck({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="140" height="140" viewBox="0 0 200 200" fill="none" aria-hidden>
      <g transform="translate(5, 10)">
        
        {/* Smoke */}
        <path d="M 136 10 C 136 -5, 150 -10, 156 -5 C 165 2, 145 10, 145 0 C 145 -10, 160 -15, 166 -20" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" className="il-floatSlow" />

        {/* Chimney */}
        <g className="il-floatSlow">
          <rect x="125" y="15" width="22" height="40" fill="#FFFBF0" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
          <rect x="121" y="12" width="30" height="10" rx="3" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
        </g>
        
        {/* House Body */}
        <path d="M 35 170 L 35 85 L 90 30 L 145 85 L 145 170 Z" fill="#FFFBF0" stroke="#111" strokeWidth="5" strokeLinejoin="round" className="il-floatSlow" />
        
        {/* Roof */}
        <g className="il-floatSlow">
          <path d="M 20 100
                   L 86 34 Q 90 30 94 34
                   L 160 100
                   A 12 12 0 0 0 176 84
                   L 98 6 Q 90 -2 82 6
                   L 4 84
                   A 12 12 0 0 0 20 100 Z" fill="#F89235" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
                   
          {/* Roof Highlights */}
          <g stroke="#FFFBF0" strokeWidth="4" strokeLinecap="round">
            <line x1="28" y1="84" x2="38" y2="74" />
            <line x1="46" y1="66" x2="80" y2="32" />
          </g>
        </g>

        {/* Door & Window */}
        <g className="il-floatSlow">
          <path d="M 50 170 L 50 105 A 10 10 0 0 1 60 95 L 70 95 A 10 10 0 0 1 80 105 L 80 170 Z" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
          <circle cx="72" cy="140" r="3.5" fill="#111" />
          
          <rect x="95" y="95" width="35" height="35" rx="6" fill="#EADDF4" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
          <line x1="95" y1="112.5" x2="130" y2="112.5" stroke="#111" strokeWidth="5" />
          <line x1="112.5" y1="95" x2="112.5" y2="130" stroke="#111" strokeWidth="5" />
          
          <rect x="90" y="132" width="45" height="6" rx="3" fill="#FFFBF0" stroke="#111" strokeWidth="5" strokeLinejoin="round" />
        </g>
        
        {/* Bush */}
        <path d="M 125 170 
                 A 12 12 0 0 1 135 145
                 A 16 16 0 0 1 165 145
                 A 14 14 0 0 1 180 160
                 A 10 10 0 0 1 182 170 Z" fill="#111" stroke="#111" strokeWidth="4" strokeLinejoin="round" className="il-floatSlow" />
                 
        {/* Ground & Grass */}
        <g className="il-floatSlow">
          <line x1="20" y1="170" x2="185" y2="170" stroke="#111" strokeWidth="5" strokeLinecap="round" />
          <path d="M 25 170 L 21 158 M 32 170 L 35 162" stroke="#111" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Accents (Sunburst) */}
        <g stroke="#111" strokeWidth="5" strokeLinecap="round" className="il-pulseSlow">
          <line x1="18" y1="66" x2="28" y2="69" />
          <line x1="24" y1="46" x2="34" y2="54" />
          <line x1="40" y1="28" x2="45" y2="42" />
        </g>
      </g>
    </svg>
  );
}

/* ================================================================== */
/*  DoodleToolbox                                                       */
/*  Orange toolbox â€” hammer, wrench, screwdriver sticking out          */
/* ================================================================== */
export function DoodleToolbox({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="80" cy="114" rx="62" ry="8" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* â”€â”€ Tools poking out â”€â”€ */}
        {/* hammer */}
        <g style={{ transform: "rotate(-18deg)", transformOrigin: "38px 54px" }}>
          <rect x="31" y="18" width="14" height="40" rx="7"
            fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
          <rect x="18" y="10" width="38" height="20" rx="9"
            fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
          <rect x="20" y="12" width="34" height="16" rx="7" fill={C.orange} opacity="0.18" />
        </g>
        {/* wrench */}
        <g style={{ transform: "rotate(8deg)", transformOrigin: "80px 28px" }}>
          <rect x="74" y="4" width="12" height="52" rx="6"
            fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <circle cx="80" cy="8" r="12" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <circle cx="80" cy="8" r="6"  fill={C.orange} filter="url(#f-glowOrange)" />
        </g>
        {/* screwdriver */}
        <g style={{ transform: "rotate(14deg)", transformOrigin: "116px 42px" }}>
          <rect x="113" y="8" width="8" height="48" rx="4"
            fill={C.yellow} stroke="rgba(255,255,255,0.25)" strokeWidth="2" opacity="0.85" />
          <rect x="111" y="8" width="12" height="24" rx="5"
            fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <rect x="115" y="52" width="4" height="14" rx="2"
            fill={C.navy} stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        </g>

        {/* â”€â”€ Box body â”€â”€ */}
        <rect x="10" y="54" width="140" height="58" rx="16"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" filter="url(#f-shadow)" />

        {/* rivet accents */}
        <circle cx="26" cy="72" r="5.5" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <circle cx="26" cy="94" r="5.5" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <circle cx="134" cy="72" r="5.5" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <circle cx="134" cy="94" r="5.5" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

        {/* clasp divider */}
        <rect x="10" y="74" width="140" height="10" fill="rgba(0,0,0,0.22)" />

        {/* clasp buckle */}
        <rect x="60" y="68" width="40" height="22" rx="10"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        <circle cx="80" cy="79" r="6" fill={C.orange} filter="url(#f-glowOrange)" />

        {/* handle */}
        <path d="M52 54 V40 Q52 26 64 26 H96 Q108 26 108 40 V54"
          fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 54 V40 Q52 26 64 26 H96 Q108 26 108 40 V54"
          fill="none" stroke="url(#g-card)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

        {/* box shine */}
        <path d="M20 62 Q80 56 140 62" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <circle cx="4"  cy="32" r="4.5" fill={C.green} opacity="0.6" />
        <circle cx="0"  cy="42" r="2.5" fill={C.green} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.6s" }}>
        <circle cx="156" cy="30" r="4" fill={C.orange} opacity="0.6" />
        <circle cx="160" cy="40" r="2" fill={C.orange} opacity="0.4" />
      </g>
      <circle cx="150" cy="108" r="2.5" fill={C.purple} opacity="0.5" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleThumbsUp                                                      */
/*  Cartoon thumbs up â€” skin-tone hand, orange sleeve, star sparkles   */
/* ================================================================== */
export function DoodleThumbsUp({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="120" height="130" viewBox="0 0 120 130" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="60" cy="126" rx="42" ry="8" fill="black" opacity="0.45" />

      <g className="il-bounce">
        {/* fist body */}
        <rect x="36" y="70" width="50" height="46" rx="16"
          fill="url(#g-skin)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" filter="url(#f-shadow)" />
        
        {/* thumb */}
        <path d="M38 78 C20 78 20 44 32 36 C44 28 52 40 52 52 L52 70 Z"
          fill="url(#g-skin)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinejoin="round" />
        
        {/* thumb fingernail/detail */}
        <ellipse cx="40" cy="40" rx="6" ry="8" fill="rgba(255,255,255,0.15)" transform="rotate(15 40 40)" />
        <path d="M30 58 Q28 48 38 42" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* knuckle lines */}
        <path d="M44 80 Q60 76 76 80" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M44 92 Q60 88 76 92" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M44 104 Q60 100 76 104" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* sleeve */}
        <rect x="32" y="106" width="58" height="22" rx="11"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <path d="M40 113 H82" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 120 H82" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* â”€â”€ Star sparkles â”€â”€ */}
      <g className="il-pulse" style={{ animationDelay: "0s" }}>
        <path d="M94 22 L96 14 L98 22 L106 24 L98 26 L96 34 L94 26 L86 24 Z"
          fill={C.orange} filter="url(#f-glowOrange)" opacity="0.9" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.4s" }}>
        <path d="M12 44 L14 37 L16 44 L23 46 L16 48 L14 55 L12 48 L5 46 Z"
          fill={C.green} filter="url(#f-glowGreen)" opacity="0.85" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.7s" }}>
        <path d="M102 72 L104 66 L106 72 L113 74 L106 76 L104 82 L102 76 L95 74 Z"
          fill={C.purple} opacity="0.75" />
      </g>
      <circle cx="8"   cy="92" r="3"   fill={C.sky}    opacity="0.55" />
      <circle cx="112" cy="40" r="2.5" fill={C.yellow} opacity="0.6" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleSignalBars                                                    */
/*  Animated signal arcs â€” orange glow, pulsing                        */
/* ================================================================== */
export function DoodleSignalBars({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="100" height="80" viewBox="0 0 100 80" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="50" cy="76" rx="42" ry="5" fill="black" opacity="0.35" />

      {/* base arc */}
      <path d="M8 68 Q8 8 50 8 Q92 8 92 68"
        stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* animated arcs */}
      <path d="M18 66 Q18 20 50 20 Q82 20 82 66"
        stroke="url(#g-orange)" strokeWidth="5.5" fill="none" strokeLinecap="round"
        opacity="0.35" className="il-bp1" />
      <path d="M30 66 Q30 32 50 32 Q70 32 70 66"
        stroke="url(#g-orange)" strokeWidth="6.5" fill="none" strokeLinecap="round"
        opacity="0.65" className="il-bp2" />
      <path d="M42 66 Q42 44 50 44 Q58 44 58 66"
        stroke="url(#g-orange)" strokeWidth="8" fill="none" strokeLinecap="round"
        className="il-bp3" filter="url(#f-glowOrange)" />

      {/* center glow dot */}
      <circle cx="50" cy="68" r="10" fill="url(#g-orange)" filter="url(#f-glowOrange)" className="il-pulse" />
      <circle cx="50" cy="68" r="5"  fill="white" opacity="0.85" />

      {/* outer ring pulse */}
      <circle cx="50" cy="68" r="18" stroke={C.orange} strokeWidth="3" opacity="0.3" className="il-ringPulse" />

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.3s" }}>
        <circle cx="8"  cy="16" r="4" fill={C.green} opacity="0.65" />
        <circle cx="4"  cy="26" r="2" fill={C.green} opacity="0.45" />
      </g>
      <circle cx="94" cy="18" r="3"   fill={C.orange}      opacity="0.55" />
      <circle cx="98" cy="10" r="2"   fill={C.orangeLight} opacity="0.45" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleQuestion                                                      */
/*  Two speech bubbles â€” orange question, green answer                 */
/* ================================================================== */
export function DoodleQuestion({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="75" cy="116" rx="58" ry="6" fill="black" opacity="0.4" />

      <g className="il-floatSlow">
        {/* â”€â”€ Large orange bubble â”€â”€ */}
        <rect x="30" y="8" width="112" height="72" rx="22"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" filter="url(#f-shadow)" />
        {/* bubble shine */}
        <path d="M44 20 Q70 12 120 20" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* bubble tail */}
        <path d="M56 80 L44 104 L74 80 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" />

        {/* â”€â”€ Question mark â”€â”€ */}
        <path d="M80 26 C80 18 98 18 98 32 C98 46 88 46 88 58"
          stroke="rgba(255,255,255,0.95)" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="88" cy="70" r="6.5" fill="rgba(255,255,255,0.95)" />

        {/* â”€â”€ Small green bubble â”€â”€ */}
        <rect x="8" y="68" width="62" height="44" rx="16"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" filter="url(#f-glowGreen)" />
        <path d="M34 112 L22 124 L46 112 Z"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" />
        {/* check in green bubble */}
        <path d="M22 90 L30 98 L50 78" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <circle cx="16" cy="12" r="4.5" fill={C.purple} opacity="0.65" />
        <circle cx="10" cy="4"  r="2.5" fill={C.purple} opacity="0.45" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.6s" }}>
        <circle cx="142" cy="92" r="3.5" fill={C.green} opacity="0.6" />
        <circle cx="148" cy="82" r="2"   fill={C.green} opacity="0.45" />
      </g>
      <circle cx="148" cy="12" r="3"   fill={C.orange}      opacity="0.55" />
      <circle cx="6"   cy="56" r="2.5" fill={C.orange}      opacity="0.45" />
    </svg>
  );
}

/* ================================================================== */
/*  â”€â”€â”€ NICHE TRADE ILLUSTRATION ICONS â”€â”€â”€                             */
/*  Miniature editorial illustrations â€” dark-native.                   */
/*  Rendered at 70px Ã— 70px in the trade selector animation.           */
/* ================================================================== */

/* â”€â”€ NicheHVAC â”€â”€ snowflake + AC unit */
export function NicheHVAC({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      {/* bg blob */}
      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* AC unit box */}
      <rect x="10" y="26" width="60" height="34" rx="12"
        fill="url(#g-slate)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* grille lines */}
      <path d="M20 33 V52 M30 33 V52 M40 33 V52 M50 33 V52 M60 33 V52"
        stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
      {/* vent slot */}
      <rect x="14" y="52" width="52" height="6" rx="3" fill={C.orange} opacity="0.5" />

      {/* â”€â”€ Snowflake â”€â”€ */}
      <g className="il-spinSlow" style={{ transformOrigin: "40px 40px" }}>
        <path d="M40 22 V58 M24 31 L56 49 M24 49 L56 31"
          stroke={C.sky} strokeWidth="4" strokeLinecap="round" />
        <path d="M40 22 L36 27 M40 22 L44 27" stroke={C.sky} strokeWidth="3" strokeLinecap="round" />
        <path d="M40 58 L36 53 M40 58 L44 53" stroke={C.sky} strokeWidth="3" strokeLinecap="round" />
        <path d="M24 31 L28 35 M24 31 L27 36" stroke={C.sky} strokeWidth="2" strokeLinecap="round" />
        <path d="M56 49 L52 45 M56 49 L53 44" stroke={C.sky} strokeWidth="2" strokeLinecap="round" />
      </g>
      <circle cx="40" cy="40" r="7" fill="white" stroke={C.sky} strokeWidth="2" />

      {/* air puff lines */}
      <path d="M12 66 Q20 62 28 66 Q36 70 44 66" stroke={C.sky} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" className="il-pulse" />
      <path d="M24 73 Q32 69 40 73 Q48 77 56 73" stroke={C.sky} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" className="il-pulse" style={{ animationDelay: "0.4s" }} />

      {/* orange indicator */}
      <circle cx="64" cy="18" r="7" fill={C.orange} filter="url(#f-glowOrange)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
    </svg>
  );
}

/* â”€â”€ NichePlumbing â”€â”€ pipe + bouncing water drop + wrench */
export function NichePlumbing({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* pipe */}
      <path d="M16 32 H34 Q40 32 40 38 V52 Q40 58 46 58 H66"
        stroke="url(#g-slate)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 32 H34 Q40 32 40 38 V52 Q40 58 46 58 H66"
        stroke="rgba(255,255,255,0.3)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 32 H34 Q40 32 40 38 V52 Q40 58 46 58 H66"
        stroke={C.sky} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      {/* end caps */}
      <rect x="12" y="25" width="8" height="14" rx="4" fill={C.navy} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <rect x="64" y="52" width="8" height="14" rx="4" fill={C.navy} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />

      {/* water drop */}
      <g className="il-bounce" style={{ animationDelay: "0.3s" }}>
        <path d="M60 12 C60 12 52 24 52 30 C52 35.5 55.6 39 60 39 C64.4 39 68 35.5 68 30 C68 24 60 12 60 12 Z"
          fill={C.sky} opacity="0.9" stroke="rgba(255,255,255,0.25)" strokeWidth="2" filter="url(#f-shadowSm)" />
        <ellipse cx="57" cy="26" rx="3" ry="5" fill="rgba(255,255,255,0.45)" transform="rotate(-20 57 26)" />
      </g>

      {/* wrench */}
      <g style={{ transform: "rotate(45deg)", transformOrigin: "24px 58px" }}>
        <rect x="18" y="54" width="12" height="26" rx="6" fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="12" y="50" width="24" height="12" rx="6" fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <circle cx="24" cy="56" r="4" fill="rgba(255,255,255,0.2)" />
      </g>
    </svg>
  );
}

/* â”€â”€ NicheElectrical â”€â”€ lightning bolt + glow */
export function NicheElectrical({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* glow blob */}
      <ellipse cx="40" cy="40" rx="24" ry="28" fill={C.yellow} opacity="0.08" className="il-pulseSlow" />

      {/* lightning bolt */}
      <path d="M47 8 L22 44 H41 L33 72 L58 36 H39 L47 8 Z"
        fill={C.yellow} stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" filter="url(#f-shadow)" opacity="0.95" />
      {/* bolt inner highlight */}
      <path d="M44 16 L28 42 H43" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* plug prongs */}
      <rect x="29" y="62" width="10" height="12" rx="5" fill={C.navy} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" className="il-pulse" />
      <rect x="43" y="62" width="10" height="12" rx="5" fill={C.navy} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" className="il-pulse" style={{ animationDelay: "0.25s" }} />

      {/* sparkle accents */}
      <g className="il-pulse" style={{ animationDelay: "0.3s" }}>
        <circle cx="14" cy="18" r="4.5" fill={C.orange} opacity="0.65" />
        <circle cx="10" cy="28" r="2.5" fill={C.orange} opacity="0.45" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.7s" }}>
        <circle cx="66" cy="16" r="4" fill={C.yellow} opacity="0.75" />
        <circle cx="72" cy="24" r="2" fill={C.yellow} opacity="0.55" />
      </g>
    </svg>
  );
}

/* â”€â”€ NicheRoofing â”€â”€ house roof + hammer + sun */
export function NicheRoofing({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* house walls */}
      <rect x="20" y="52" width="40" height="22" rx="6"
        fill="url(#g-slate)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* door */}
      <rect x="32" y="60" width="16" height="14" rx="4"
        fill="url(#g-card)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

      {/* roof */}
      <path d="M8 54 L40 12 L72 54 Z"
        fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" filter="url(#f-shadow)" />
      {/* shingle lines */}
      <path d="M18 48 Q40 28 62 48" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 52 Q40 32 66 52" stroke="rgba(255,255,255,0.15)" strokeWidth="2"   strokeLinecap="round" fill="none" />
      <path d="M26 38 Q40 24 54 38" stroke="rgba(255,255,255,0.28)" strokeWidth="3"   strokeLinecap="round" fill="none" />

      {/* hammer */}
      <g className="il-wiggle" style={{ transform: "rotate(-32deg) translate(6px,-8px)", transformOrigin: "60px 60px" }}>
        <rect x="56" y="52" width="10" height="24" rx="5" fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="48" y="46" width="26" height="14" rx="6" fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="50" y="48" width="22" height="10" rx="4" fill={C.orange} opacity="0.2" />
      </g>

      {/* sun */}
      <circle cx="64" cy="20" r="9" fill={C.yellow} opacity="0.8" filter="url(#f-glow)" className="il-pulse" />
      <circle cx="64" cy="20" r="5" fill={C.yellow} />
    </svg>
  );
}

/* â”€â”€ NichePest â”€â”€ green shield + defeated bug */
export function NichePest({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* shield */}
      <path d="M40 8 L67 18 V44 Q67 66 40 74 Q13 66 13 44 V18 Z"
        fill="url(#g-green)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" filter="url(#f-glowGreen)" />
      <path d="M40 14 L61 22 V44 Q61 62 40 68 Q19 62 19 44 V22 Z"
        fill="url(#g-green)" opacity="0.35" />
      <path d="M28 22 Q40 16 52 22" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* bug body */}
      <ellipse cx="40" cy="44" rx="9" ry="12" fill={C.navy} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <circle cx="40" cy="30" r="6.5" fill={C.navy} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      {/* antennae */}
      <path d="M37 25 Q32 18 27 16" stroke={C.navy} strokeWidth="3" strokeLinecap="round" />
      <path d="M43 25 Q48 18 53 16" stroke={C.navy} strokeWidth="3" strokeLinecap="round" />
      <circle cx="27" cy="15" r="3.5" fill={C.orange} filter="url(#f-glowOrange)" />
      <circle cx="53" cy="15" r="3.5" fill={C.orange} filter="url(#f-glowOrange)" />
      {/* legs */}
      <path d="M31 40 L22 36 M31 45 L22 45 M31 50 L22 54" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M49 40 L58 36 M49 45 L58 45 M49 50 L58 54" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round" />
      {/* X defeated mark */}
      <path d="M32 36 L48 56 M32 56 L48 36" stroke={C.orange} strokeWidth="5" strokeLinecap="round" filter="url(#f-glowOrange)" />
    </svg>
  );
}

/* â”€â”€ NicheGarage â”€â”€ garage door + car peek */
export function NicheGarage({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* garage walls */}
      <rect x="10" y="20" width="60" height="52" rx="8"
        fill="url(#g-slate)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

      {/* gable roof */}
      <path d="M6 22 L40 4 L74 22 Z"
        fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" />

      {/* garage door */}
      <rect x="16" y="34" width="48" height="36" rx="6"
        fill="url(#g-card)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* panel lines */}
      <path d="M16 46 H64" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 56 H64" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
      {/* handle */}
      <rect x="33" y="63" width="14" height="5" rx="2.5"
        fill={C.orange} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" filter="url(#f-glowOrange)" />

      {/* car peek */}
      <path d="M20 74 Q24 62 40 62 Q56 62 60 74 Z"
        fill={C.orange} opacity="0.85" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <path d="M26 64 Q32 56 48 56 Q56 56 60 64"
        fill={C.sky} opacity="0.35" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* headlights */}
      <circle cx="24" cy="70" r="4.5" fill={C.yellow} filter="url(#f-glow)" className="il-pulse" />
      <circle cx="56" cy="70" r="4.5" fill={C.yellow} filter="url(#f-glow)" className="il-pulse" style={{ animationDelay: "0.3s" }} />

      {/* green indicator dot */}
      <circle cx="64" cy="12" r="6" fill={C.green} filter="url(#f-glowGreen)" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
    </svg>
  );
}

/* â”€â”€ NicheLocksmith â”€â”€ padlock + shackle + wiggling key */
export function NicheLocksmith({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* lock body */}
      <rect x="18" y="38" width="44" height="34" rx="10"
        fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-shadow)" />
      <path d="M24 46 H56" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />

      {/* keyhole */}
      <circle cx="40" cy="52" r="8" fill={C.orange} stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-glowOrange)" />
      <circle cx="40" cy="52" r="4" fill="rgba(0,0,0,0.4)" />
      <path d="M37 57 H43 L42 67 H38 Z" fill={C.orange} />
      <path d="M37 57 H43 L42 67 H38 Z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinejoin="round" />

      {/* shackle */}
      <path d="M24 40 V26 Q24 12 40 12 Q56 12 56 26 V40"
        fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 40 V26 Q24 12 40 12 Q56 12 56 26 V40"
        fill="none" stroke="url(#g-orange)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* key */}
      <g className="il-wiggle" style={{ transform: "rotate(-35deg)", transformOrigin: "64px 58px" }}>
        <circle cx="64" cy="52" r="9" fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" filter="url(#f-glowOrange)" />
        <circle cx="64" cy="52" r="4.5" fill="rgba(255,255,255,0.25)" />
        <rect x="60" y="59" width="8" height="22" rx="4" fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="60" y="69" width="11" height="5" rx="2.5" fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <rect x="60" y="76" width="9"  height="5" rx="2.5" fill="url(#g-orange)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      </g>
    </svg>
  );
}

/* â”€â”€ NicheAppliance â”€â”€ washing machine + spinning drum + sparkles */
export function NicheAppliance({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden>
      <SharedDefs />

      <rect x="4" y="4" width="72" height="72" rx="22" fill="url(#g-card)" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />

      {/* machine body */}
      <rect x="12" y="14" width="56" height="58" rx="12"
        fill="url(#g-slate)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" filter="url(#f-shadow)" />

      {/* control panel */}
      <rect x="16" y="18" width="48" height="16" rx="6"
        fill="url(#g-card)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      {/* knob */}
      <circle cx="28" cy="26" r="5.5" fill={C.orange} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" filter="url(#f-glowOrange)" />
      <circle cx="28" cy="26" r="2.5" fill="rgba(255,255,255,0.35)" />
      {/* indicator dots */}
      <circle cx="44" cy="24" r="2.5" fill={C.green} opacity="0.85" className="il-pulse" filter="url(#f-glowGreen)" />
      <circle cx="52" cy="24" r="2.5" fill={C.green} opacity="0.5"  className="il-pulse" style={{ animationDelay: "0.3s" }} />
      <circle cx="60" cy="24" r="2.5" fill="rgba(255,255,255,0.2)" />

      {/* porthole */}
      <circle cx="40" cy="52" r="20" fill="url(#g-sky)" opacity="0.2" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
      <circle cx="40" cy="52" r="14" fill={C.navy} opacity="0.9" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      {/* spinning drum */}
      <g className="il-spinSlow" style={{ transformOrigin: "40px 52px" }}>
        <path d="M40 40 V64 M28 52 H52 M31 43 L49 61 M31 61 L49 43"
          stroke={C.sky} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      </g>
      <circle cx="40" cy="52" r="6" fill={C.sky} opacity="0.35" />
      {/* porthole seal */}
      <circle cx="40" cy="52" r="20" stroke={C.orange} strokeWidth="2.5" strokeDasharray="4 5" opacity="0.35" fill="none" />

      {/* sparkle stars */}
      <g className="il-pulse" style={{ animationDelay: "0.2s" }}>
        <path d="M66 10 L68 4 L70 10 L76 12 L70 14 L68 20 L66 14 L60 12 Z"
          fill={C.purple} opacity="0.75" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.6s" }}>
        <path d="M10 64 L12 58 L14 64 L20 66 L14 68 L12 74 L10 68 L4 66 Z"
          fill={C.orange} opacity="0.6" filter="url(#f-glowOrange)" />
      </g>
    </svg>
  );
}
