"use client";

/* ================================================================== */
/*  foreman-illustrations.tsx                                           */
/*                                                                      */
/*  Premium editorial illustration system — dark-native.               */
/*  Designed for use on #0A0F1C and #141C30 dark backgrounds.          */
/*  Inspired by: Wispr Flow, Linear, Arc, Slack, Dropbox.              */
/*                                                                      */
/*  API unchanged — all exports, names, and props preserved.           */
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
/*  SharedDefs — gradients, filters, keyframe animations               */
/*  Each SVG renders its own <SharedDefs /> so IDs stay in scope.      */
/* ================================================================== */
function SharedDefs() {
  return (
    <defs>
      {/* ── Gradients ── */}
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

      {/* ── Filters ── */}
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

      {/* Soft general glow — proper bloom: blur then merge over source */}
      <filter id="f-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* ── CSS Animations ──
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
/*  DoodleTechnicianOnCall                                              */
/*  Smiling cartoon technician — dark-native, orange helmet,           */
/*  phone in hand, speech bubble, cream outline on dark bg.            */
/* ================================================================== */
export function DoodleTechnicianOnCall({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden>
      <SharedDefs />

      {/* ground shadow */}
      <ellipse cx="80" cy="155" rx="48" ry="8" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* ── Torso ── */}
        <path d="M50 120 Q46 104 50 96 Q60 86 80 86 Q100 86 110 96 Q114 104 110 120 Q100 138 80 140 Q60 138 50 120 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" filter="url(#f-shadow)" />
        {/* shirt detail */}
        <path d="M64 90 Q80 100 96 90" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* logo patch */}
        <rect x="72" y="104" width="16" height="12" rx="4" fill={C.navy} opacity="0.6" />
        <path d="M75 110 L78 113 L83 107" stroke={C.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* ── Left arm / phone ── */}
        <path d="M50 100 Q34 110 30 122 Q28 130 38 134"
          fill="none" stroke="url(#g-skin)" strokeWidth="15" strokeLinecap="round" />
        <path d="M50 100 Q34 110 30 122 Q28 130 38 134"
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />

        {/* Phone handset */}
        <rect x="18" y="116" width="22" height="32" rx="5" fill="url(#g-card)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <rect x="21" y="120" width="16" height="22" rx="2" fill="url(#g-sky)" opacity="0.6" />
        <rect x="21" y="120" width="16" height="22" rx="2" fill="url(#g-orangeV)" opacity="0.35" />
        <circle cx="29" cy="143" r="2" fill="rgba(255,255,255,0.5)" />

        {/* ── Right arm ── */}
        <path d="M110 100 Q126 110 130 120 Q132 130 124 134"
          fill="none" stroke="url(#g-skin)" strokeWidth="15" strokeLinecap="round" />
        <path d="M110 100 Q126 110 130 120 Q132 130 124 134"
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />

        {/* ── Head ── */}
        <ellipse cx="80" cy="58" rx="30" ry="32"
          fill="url(#g-skin)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-shadow)" />
        {/* ear */}
        <ellipse cx="50" cy="60" rx="6" ry="9" fill="url(#g-skin)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <ellipse cx="110" cy="60" rx="6" ry="9" fill="url(#g-skin)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        {/* ── Hard hat ── */}
        <path d="M46 60 Q44 26 80 22 Q116 26 114 60 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinejoin="round" />
        <rect x="42" y="58" width="76" height="11" rx="5.5"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {/* hat highlight stripe */}
        <path d="M52 52 Q80 44 108 52" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M62 38 Q80 30 98 38" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* center fin */}
        <path d="M80 22 V62" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" />

        {/* ── Eyes — dark irises blink, white shines stay fixed ── */}
        <g className="il-blink">
          <ellipse cx="68" cy="64" rx="5.5" ry="6.5" fill={C.navy} />
          <ellipse cx="92" cy="64" rx="5.5" ry="6.5" fill={C.navy} />
        </g>
        {/* shines outside blink group so they don't disappear mid-blink */}
        <circle cx="70" cy="61" r="2"   fill="rgba(255,255,255,0.9)" />
        <circle cx="94" cy="61" r="2"   fill="rgba(255,255,255,0.9)" />
        {/* pupil micro-dot for depth */}
        <circle cx="69" cy="65" r="1.5" fill="rgba(0,0,0,0.55)" />
        <circle cx="93" cy="65" r="1.5" fill="rgba(0,0,0,0.55)" />

        {/* ── Nose ── */}
        <path d="M78 72 Q80 76 82 72" stroke={C.skinDark} strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* ── Smile — use skinDark; navy on warm-skin tone is invisible ── */}
        <path d="M68 78 Q80 90 92 78" stroke="rgba(160,90,40,0.7)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* cheeks */}
        <ellipse cx="60" cy="76" rx="7" ry="5" fill="#FF8080" opacity="0.32" />
        <ellipse cx="100" cy="76" rx="7" ry="5" fill="#FF8080" opacity="0.32" />

        {/* ── Speech bubble ── */}
        <rect x="96" y="14" width="54" height="36" rx="14"
          fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-shadowSm)" />
        <path d="M106 50 L100 64 L122 50 Z"
          fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinejoin="round" />
        {/* lines in bubble */}
        <path d="M108 26 H138" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M108 34 H128" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" />
        {/* phone icon in bubble */}
        <rect x="108" y="22" width="10" height="18" rx="3" fill="none" stroke={C.orange} strokeWidth="2" />
        <rect x="111" y="35" width="4" height="3" rx="1" fill={C.orange} opacity="0.6" />
      </g>

      {/* ── Floating accent dots ── */}
      <g className="il-pulse" style={{ animationDelay: "0.3s" }}>
        <circle cx="14" cy="36" r="4" fill={C.orange} opacity="0.6" />
        <circle cx="8"  cy="46" r="2" fill={C.orange} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.8s" }}>
        <circle cx="150" cy="88" r="3.5" fill={C.green} opacity="0.7" />
        <circle cx="156" cy="78" r="2"   fill={C.green} opacity="0.5" />
      </g>
      {/* sparkle stars */}
      <g className="il-pulse" style={{ animationDelay: "0.5s" }}>
        <path d="M146 18 L148 12 L150 18 L156 20 L150 22 L148 28 L146 22 L140 20 Z" fill={C.orange} opacity="0.55" />
      </g>
      <circle cx="16" cy="108" r="2"   fill={C.purple} opacity="0.5" />
      <circle cx="148" cy="46" r="2"   fill={C.sky}    opacity="0.5" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleServiceVan                                                    */
/*  Cartoon van — dark card body, orange stripe, glowing headlights    */
/* ================================================================== */
export function DoodleServiceVan({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="220" height="140" viewBox="0 0 220 140" fill="none" aria-hidden>
      <SharedDefs />

      {/* ground shadow */}
      <ellipse cx="110" cy="132" rx="88" ry="9" fill="black" opacity="0.5" />

      <g className="il-floatSlow">
        {/* ── Van body ── */}
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

        {/* ── Wheels ── */}
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

      {/* ── Motion lines ── */}
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
/*  Modern smartphone — dark body, glowing orange notification,        */
/*  pulse rings, bouncing                                               */
/* ================================================================== */
export function DoodleRingingPhone({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="110" height="130" viewBox="0 0 110 130" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="55" cy="126" rx="28" ry="6" fill="black" opacity="0.45" />

      {/* pulse rings */}
      <circle cx="55" cy="62" r="34" stroke={C.orange} strokeWidth="3" opacity="0.4" className="il-ringPulse" />
      <circle cx="55" cy="62" r="34" stroke={C.orange} strokeWidth="2" opacity="0.3" className="il-ringPulse" style={{ animationDelay: "0.6s" }} />

      <g className="il-bounce">
        {/* phone body */}
        <rect x="22" y="14" width="66" height="110" rx="17"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" filter="url(#f-shadow)" />

        {/* screen bg */}
        <rect x="28" y="26" width="54" height="86" rx="11" fill="#0A1628" />
        {/* screen shimmer */}
        <rect x="28" y="26" width="54" height="86" rx="11" fill="url(#g-orangeV)" opacity="0.12" />

        {/* dynamic island / notch */}
        <rect x="38" y="19" width="28" height="9" rx="4.5" fill="#050A14" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
        <circle cx="60" cy="23" r="2.5" fill="#111827" />

        {/* home indicator */}
        <rect x="40" y="117" width="28" height="4" rx="2" fill="rgba(255,255,255,0.3)" />

        {/* ── Notification card ── */}
        <rect x="30" y="46" width="50" height="40" rx="10" fill="url(#g-slate)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        {/* orange icon circle */}
        <circle cx="44" cy="66" r="9" fill="url(#g-orange)" filter="url(#f-glowOrange)" />
        <path d="M40 66 L43 69 L48 61" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* text lines */}
        <path d="M56 60 H74" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M56 68 H70" stroke="rgba(255,255,255,0.25)" strokeWidth="2"   strokeLinecap="round" />
        <path d="M56 75 H66" stroke="rgba(255,255,255,0.18)" strokeWidth="2"   strokeLinecap="round" />

        {/* ── Call button ── */}
        <rect x="30" y="94" width="50" height="16" rx="8" fill="url(#g-green)" />
        {/* phone icon on button */}
        <path d="M42 102 Q44 98 46 100 Q47 102 45 104 Q48 107 51 106 Q53 104 55 105 Q57 107 54 110 Q50 112 46 108 Q42 106 42 102 Z"
          fill="white" opacity="0.9" />
        <path d="M62 100 H72" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M62 106 H68" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* ── Side buttons ── */}
        <rect x="14" y="46" width="8" height="20" rx="4" fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="14" y="70" width="8" height="14" rx="4" fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="88" y="54" width="8" height="22" rx="4" fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.1s" }}>
        <circle cx="8"  cy="24" r="4" fill={C.orange} opacity="0.6" />
        <circle cx="14" cy="15" r="2" fill={C.orange} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.5s" }}>
        <circle cx="102" cy="22" r="3.5" fill={C.green} opacity="0.65" />
        <circle cx="108" cy="32" r="2"   fill={C.green} opacity="0.45" />
      </g>
      <circle cx="6"  cy="76" r="2.5" fill={C.purple} opacity="0.55" />
      <circle cx="104" cy="80" r="2"  fill={C.sky}    opacity="0.55" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleHardHat                                                       */
/*  Construction helmet — orange gradient dome, green check badge      */
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

        {/* ── Green check badge ── */}
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
/*  Rounded clipboard — dark card body, orange clip,                   */
/*  green checks, pencil detail                                         */
/* ================================================================== */
export function DoodleClipboard({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="140" height="170" viewBox="0 0 140 170" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="70" cy="165" rx="50" ry="8" fill="black" opacity="0.45" />

      <g className="il-floatSlow">
        {/* board body */}
        <rect x="14" y="20" width="112" height="138" rx="18"
          fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-shadow)" />
        {/* inner paper */}
        <rect x="20" y="26" width="100" height="126" rx="14" fill="rgba(255,255,255,0.04)" />

        {/* orange clip */}
        <rect x="42" y="8"  width="56" height="24" rx="10"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
        {/* clip fastener */}
        <rect x="54" y="4"  width="32" height="14" rx="7"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        {/* clip holes */}
        <circle cx="64" cy="11" r="3" fill="rgba(0,0,0,0.3)" />
        <circle cx="76" cy="11" r="3" fill="rgba(0,0,0,0.3)" />

        {/* ── Check items ── */}
        {/* row 1 — checked */}
        <rect x="30" y="54" width="22" height="22" rx="7"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-glowGreen)" />
        <path d="M34 65 L39 70 L51 58" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 65 H108" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />

        {/* row 2 — checked */}
        <rect x="30" y="82" width="22" height="22" rx="7"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-glowGreen)" />
        <path d="M34 93 L39 98 L51 86" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 93 H108" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />

        {/* row 3 — unchecked */}
        <rect x="30" y="110" width="22" height="22" rx="7"
          fill="rgba(255,255,255,0.05)" stroke={C.orange} strokeWidth="2.5" />
        <path d="M60 121 H96" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round" />

        {/* row 4 — unchecked faded */}
        <rect x="30" y="132" width="22" height="18" rx="7"
          fill="rgba(255,255,255,0.03)" stroke="rgba(249,122,53,0.45)" strokeWidth="2" />
        <path d="M60 141 H86" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" strokeLinecap="round" />

        {/* ── Pencil ── */}
        <g className="il-wiggle" style={{ transformOrigin: "118px 148px" }}>
          <path d="M104 128 L122 146 Q124 148 122 150 L118 154 Q116 156 114 154 L96 136 Z"
            fill={C.yellow} stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M100 132 L118 150" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" />
          <path d="M96 136 L90 158 L114 154 Z"
            fill={C.navy} stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="100" cy="156" r="4" fill="#FF6666" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </g>

        {/* board shine */}
        <path d="M22 32 Q70 26 118 32" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.4s" }}>
        <circle cx="8"  cy="44" r="4" fill={C.green} opacity="0.6" />
        <circle cx="4"  cy="54" r="2" fill={C.green} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.8s" }}>
        <circle cx="134" cy="28" r="3.5" fill={C.orange}      opacity="0.6" />
        <circle cx="138" cy="38" r="2"   fill={C.orangeLight} opacity="0.45" />
      </g>
      <circle cx="16" cy="158" r="2.5" fill={C.purple} opacity="0.5" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleWrenchGear                                                    */
/*  Large orange wrench + dark spinning gear — mechanical but cute     */
/* ================================================================== */
export function DoodleWrenchGear({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="130" height="130" viewBox="0 0 130 130" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="65" cy="124" rx="40" ry="7" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* ── Spinning gear ── */}
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

        {/* ── Wrench ── */}
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
/*  DoodleHouseCheck                                                    */
/*  Friendly house — dark card body, orange roof, glowing green badge  */
/* ================================================================== */
export function DoodleHouseCheck({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="140" height="140" viewBox="0 0 140 140" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="70" cy="133" rx="56" ry="9" fill="black" opacity="0.45" />

      <g className="il-floatSlow">
        {/* ── Walls ── */}
        <rect x="22" y="72" width="96" height="60" rx="10"
          fill="url(#g-slate)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" filter="url(#f-shadow)" />

        {/* ── Roof ── */}
        <path d="M10 76 L70 18 L130 76 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" />
        {/* shingle lines */}
        <path d="M28 64 Q70 34 112 64" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M18 72 Q70 38 122 72" stroke="rgba(255,255,255,0.15)" strokeWidth="2"   strokeLinecap="round" fill="none" />
        {/* roof highlight */}
        <path d="M34 50 Q70 30 106 50" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* chimney */}
        <rect x="92" y="22" width="14" height="24" rx="4"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        {/* smoke puffs */}
        <circle cx="99" cy="12" r="6" fill="rgba(255,255,255,0.1)" className="il-pulseSlow" />
        <circle cx="107" cy="8" r="4" fill="rgba(255,255,255,0.07)" className="il-pulseSlow" style={{ animationDelay: "0.5s" }} />

        {/* ── Left window ── */}
        <rect x="28" y="80" width="32" height="28" rx="8"
          fill="url(#g-sky)" opacity="0.25" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <path d="M44 80 V108" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 94 H60"  stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        {/* window sill */}
        <rect x="24" y="106" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
        {/* window glow */}
        <rect x="30" y="82" width="12" height="10" rx="3" fill={C.yellow} opacity="0.12" />

        {/* ── Door ── */}
        <rect x="58" y="96" width="24" height="36" rx="8"
          fill="url(#g-card)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <circle cx="76" cy="116" r="3.5" fill={C.orange} filter="url(#f-glowOrange)" />

        {/* ── Right window ── */}
        <rect x="80" y="80" width="32" height="28" rx="8"
          fill="url(#g-sky)" opacity="0.25" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <path d="M96 80 V108"  stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        <path d="M80 94 H112" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
        <rect x="80" y="106" width="36" height="5" rx="2.5" fill="rgba(255,255,255,0.18)" />
        <rect x="82" y="82" width="12" height="10" rx="3" fill={C.yellow} opacity="0.12" />

        {/* ── Check badge ── */}
        <circle cx="112" cy="64" r="24"
          fill="url(#g-green)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" filter="url(#f-glowGreen)" />
        <path d="M101 64 L109 72 L124 54" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* sparkles */}
      <g className="il-pulse" style={{ animationDelay: "0.3s" }}>
        <circle cx="6"  cy="42" r="4.5" fill={C.orange} opacity="0.6" />
        <circle cx="2"  cy="52" r="2.5" fill={C.orange} opacity="0.4" />
      </g>
      <g className="il-pulse" style={{ animationDelay: "0.7s" }}>
        <circle cx="132" cy="110" r="3.5" fill={C.green} opacity="0.6" />
      </g>
      <circle cx="136" cy="30" r="3" fill={C.purple} opacity="0.5" />
    </svg>
  );
}

/* ================================================================== */
/*  DoodleToolbox                                                       */
/*  Orange toolbox — hammer, wrench, screwdriver sticking out          */
/* ================================================================== */
export function DoodleToolbox({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="160" height="120" viewBox="0 0 160 120" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="80" cy="114" rx="62" ry="8" fill="black" opacity="0.45" />

      <g className="il-float">
        {/* ── Tools poking out ── */}
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

        {/* ── Box body ── */}
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
/*  Cartoon thumbs up — skin-tone hand, orange sleeve, star sparkles   */
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

      {/* ── Star sparkles ── */}
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
/*  Animated signal arcs — orange glow, pulsing                        */
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
/*  Two speech bubbles — orange question, green answer                 */
/* ================================================================== */
export function DoodleQuestion({ className, style }: IllustrationProps) {
  return (
    <svg className={className} style={style} width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden>
      <SharedDefs />

      <ellipse cx="75" cy="116" rx="58" ry="6" fill="black" opacity="0.4" />

      <g className="il-floatSlow">
        {/* ── Large orange bubble ── */}
        <rect x="30" y="8" width="112" height="72" rx="22"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" filter="url(#f-shadow)" />
        {/* bubble shine */}
        <path d="M44 20 Q70 12 120 20" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* bubble tail */}
        <path d="M56 80 L44 104 L74 80 Z"
          fill="url(#g-orange)" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinejoin="round" />

        {/* ── Question mark ── */}
        <path d="M80 26 C80 18 98 18 98 32 C98 46 88 46 88 58"
          stroke="rgba(255,255,255,0.95)" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="88" cy="70" r="6.5" fill="rgba(255,255,255,0.95)" />

        {/* ── Small green bubble ── */}
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
/*  ─── NICHE TRADE ILLUSTRATION ICONS ───                             */
/*  Miniature editorial illustrations — dark-native.                   */
/*  Rendered at 70px × 70px in the trade selector animation.           */
/* ================================================================== */

/* ── NicheHVAC ── snowflake + AC unit */
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

      {/* ── Snowflake ── */}
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

/* ── NichePlumbing ── pipe + bouncing water drop + wrench */
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

/* ── NicheElectrical ── lightning bolt + glow */
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

/* ── NicheRoofing ── house roof + hammer + sun */
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

/* ── NichePest ── green shield + defeated bug */
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

/* ── NicheGarage ── garage door + car peek */
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

/* ── NicheLocksmith ── padlock + shackle + wiggling key */
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

/* ── NicheAppliance ── washing machine + spinning drum + sparkles */
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