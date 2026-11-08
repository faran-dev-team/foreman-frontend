"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Transition for visitors who ask for reduced motion: jump straight to the end
 * state. Switch `transition` on useReducedMotion(), never `initial`: the server
 * can't know the preference, so a different `initial` breaks hydration.
 */
export const INSTANT = { duration: 0 } as const;

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? INSTANT : { duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */
export function MagneticLink({
  href,
  children,
  className = "gx-btn gx-btn-primary",
  style,
  external,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isExternal = external ?? href.startsWith("http");

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduced || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPos({ x: (e.clientX - (r.left + r.width / 2)) * 0.18, y: (e.clientY - (r.top + r.height / 2)) * 0.18 });
    },
    [reduced],
  );

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 160, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

/** Smooth in-page anchor scrolling that cooperates with Lenis + the sticky nav. */
export function useAnchorScroll(offset = -84) {
  const lenis = useLenis();
  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el as HTMLElement, { offset, duration: 1.3 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    },
    [lenis, offset],
  );
}

/* ------------------------------------------------------------------ */
/*  Type helpers                                                       */
/* ------------------------------------------------------------------ */
export function Kicker({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`gx-kicker${center ? " gx-kicker-center" : ""}`}>
      <span className="gx-kicker-dot" aria-hidden />
      {children}
    </div>
  );
}

/** Orange serif-italic accent used at the end of headlines. */
export function Accent({ children }: { children: React.ReactNode }) {
  return <em className="gx-accent">{children}</em>;
}

export function SectionHead({
  kicker,
  title,
  sub,
  align = "center",
  className = "",
}: {
  kicker: React.ReactNode;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal className={`gx-sechead gx-sechead-${align} ${className}`}>
      <Kicker center={align === "center"}>{kicker}</Kicker>
      {title && <h2 className="gx-h2">{title}</h2>}
      {sub && <p className="gx-lede">{sub}</p>}
    </Reveal>
  );
}

/** Arabic run (RTL, Arabic typeface). `display` uses the Kufi display face. */
export function Ar({
  children,
  display,
  className = "",
  style,
}: {
  children: React.ReactNode;
  display?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span lang="ar" dir="rtl" className={`${display ? "gx-ar-display" : "gx-ar"} ${className}`} style={style}>
      {children}
    </span>
  );
}

/** Urdu run (RTL, Nastaliq). */
export function Ur({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span lang="ur" dir="rtl" className={`gx-ur ${className}`} style={style}>
      {children}
    </span>
  );
}

export function Hi({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span lang="hi" className={`gx-hi ${className}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons not in lucide                                                */
/* ------------------------------------------------------------------ */
export function WhatsAppIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 7 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.9 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41" />
    </svg>
  );
}

export function CheckMark({ size = 16, className = "gx-check" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative: Gulf geometric lattice (8-point star / mashrabiya)     */
/* ------------------------------------------------------------------ */
export function GeoPattern({ id, opacity = 0.07, size = 84, className = "" }: { id: string; opacity?: number; size?: number; className?: string }) {
  const s = size;
  const c = s / 2;
  const h = s * 0.17; // square half-size
  const d = h * Math.SQRT2; // diamond radius
  return (
    <svg className={`gx-geo ${className}`} aria-hidden width="100%" height="100%">
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={`rgba(255,255,255,${opacity})`} strokeWidth="1">
            <rect x={c - h} y={c - h} width={h * 2} height={h * 2} />
            <path d={`M${c} ${c - d} L${c + d} ${c} L${c} ${c + d} L${c - d} ${c} Z`} />
            <path d={`M${c} 0 V${c - d} M${s} ${c} H${c + d} M${c} ${s} V${c + d} M0 ${c} H${c - d}`} />
            <path d={`M0 0 L${c - h} ${c - h} M${s} 0 L${c + h} ${c - h} M0 ${s} L${c - h} ${c + h} M${s} ${s} L${c + h} ${c + h}`} />
            <circle cx={c} cy={c} r={h * 0.42} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Decorative: abstract Gulf skyline silhouette                       */
/* ------------------------------------------------------------------ */
const SKYLINE: [number, number, number][] = [
  // [x, width, height] on a 1440 x 240 canvas
  [0, 46, 54], [46, 38, 82], [84, 60, 64], [144, 28, 118], [172, 52, 92], [224, 40, 70],
  [330, 44, 104], [374, 62, 76], [436, 30, 136], [466, 54, 98], [520, 36, 66], [556, 48, 112],
  [604, 70, 84], [674, 32, 150], [706, 58, 96], [764, 44, 72], [808, 40, 124], [848, 64, 88],
  [1010, 50, 108], [1060, 36, 142], [1096, 58, 90], [1154, 42, 120], [1196, 66, 78],
  [1262, 34, 132], [1296, 52, 94], [1348, 40, 70], [1388, 52, 100],
];

function skylinePath() {
  const H = 240;
  let d = `M0 ${H}`;
  for (const [x, w, h] of SKYLINE) {
    const top = H - h;
    const inset = Math.min(6, w * 0.12);
    d += ` L${x} ${H} L${x} ${top + 10} L${x + inset} ${top + 10} L${x + inset} ${top} L${x + w - inset} ${top} L${x + w - inset} ${top + 10} L${x + w} ${top + 10} L${x + w} ${H}`;
  }
  // Sail-shaped tower
  d += ` M250 ${H} L250 ${H - 160} Q 318 ${H - 120} 312 ${H} Z`;
  // Tapered needle tower with setbacks
  const cx = 950;
  d += ` M${cx - 36} ${H} L${cx - 36} ${H - 70} L${cx - 26} ${H - 70} L${cx - 26} ${H - 120} L${cx - 17} ${H - 120} L${cx - 17} ${H - 165} L${cx - 9} ${H - 165} L${cx - 9} ${H - 200} L${cx - 2} ${H - 200} L${cx} ${H - 238} L${cx + 2} ${H - 200} L${cx + 9} ${H - 200} L${cx + 9} ${H - 178} L${cx + 17} ${H - 178} L${cx + 17} ${H - 136} L${cx + 26} ${H - 136} L${cx + 26} ${H - 86} L${cx + 36} ${H - 86} L${cx + 36} ${H} Z`;
  return d + ` L1440 ${H} Z`;
}

const SKYLINE_D = skylinePath();

export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg className={`gx-skyline ${className}`} viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id="gx-skyline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(249,122,53,0.16)" />
          <stop offset="55%" stopColor="rgba(20,28,48,0.55)" />
          <stop offset="100%" stopColor="rgba(10,15,28,1)" />
        </linearGradient>
      </defs>
      <path d={SKYLINE_D} fill="url(#gx-skyline-fill)" fillRule="nonzero" />
    </svg>
  );
}
