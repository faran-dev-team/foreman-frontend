"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  animate,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";

export type LandingMode = "main" | "hvac" | "plumbing" | "restoration" | "property-management" | "electrical";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
export const C = {
  navBg: "#8B96A6",
  bgPrimary: "#0A0F1C",
  bgCard: "#141C30",
  accentOrange: "#F97A35",
  accentGreenText: "#1FAA59",
  accentGreenBg: "#163C2A",
  textBody: "#B8BFCC",
  textHeading: "#FFFFFF",
  textEyebrow: "#F97A35",
  borderPrimary: "rgba(255,255,255,0.08)",
  footerBg: "#05080F",
};

/* ------------------------------------------------------------------ */
/*  Reusable: F-monogram logo                                          */
/* ------------------------------------------------------------------ */
export const Logo = React.memo(function Logo({ size = 40, bg = C.accentOrange, fg = C.bgPrimary }: { size?: number; bg?: string; fg?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <rect width="100" height="100" rx="24" fill={bg} />
      <rect x="30" y="26" width="16" height="52" rx="2.5" fill={fg} />
      <rect x="30" y="26" width="44" height="16" rx="2.5" fill={fg} />
      <rect x="30" y="49" width="32" height="14" rx="2.5" fill={fg} />
    </svg>
  );
});

export function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 8, marginTop: 2 }}>
      <path d="M20 6L9 17l-5-5" stroke={C.accentGreenText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: scroll-reveal wrapper                                    */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: count-up number                                          */
/* ------------------------------------------------------------------ */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: Tilt Card with Glow                                      */
/* ------------------------------------------------------------------ */
export function TiltCard({ children, className, glowColor = "rgba(255,255,255,0.12)", style, animate, transition }: { children: React.ReactNode, className?: string, glowColor?: string, style?: React.CSSProperties, animate?: any, transition?: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Cache bounding rect to prevent layout thrashing
  const bounds = useRef({ left: 0, top: 0, width: 0, height: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rx = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });
  const ry = useSpring(0, { damping: 25, stiffness: 250, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;
    const { left, top, width, height } = bounds.current;
    if (width === 0) return; // Not initialized
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
    rx.set(((y - height / 2) / height) * -8);
    ry.set(((x - width / 2) / width) * 8);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (ref.current) {
      bounds.current = ref.current.getBoundingClientRect();
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    rx.set(0);
    ry.set(0);
  };

  const background = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        ...style
      }}
      animate={animate}
      transition={transition || { type: "spring", stiffness: 250, damping: 24 }}
      whileHover={reducedMotion ? {} : { scale: 1.015 }}
    >
      {!reducedMotion && (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            zIndex: 0,
            pointerEvents: "none",
            background,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%", transform: isHovered && !reducedMotion ? "translateZ(16px)" : "none", transition: "transform 0.4s cubic-bezier(0.25,1,0.5,1)" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable: Magnetic Button                                          */
/* ------------------------------------------------------------------ */
export const MagneticButton = React.memo(function MagneticButton({ children, href, className, target, rel, style }: { children: React.ReactNode, href: string, className?: string, target?: string, rel?: string, style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const bounds = useRef({ width: 0, height: 0, left: 0, top: 0 });

  const handleMouseEnter = () => {
    if (ref.current) {
      bounds.current = ref.current.getBoundingClientRect();
    }
  };

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || bounds.current.width === 0) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = bounds.current;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };
  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref} href={href} target={target} rel={rel} className={className}
      animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouse} 
      onMouseLeave={reset}
      whileHover={reducedMotion ? {} : { scale: 1.04, boxShadow: "0 14px 38px rgba(242,105,28,0.38)" }} whileTap={{ scale: 0.97 }}
      style={{ position: "relative", ...style }}
    >
      {children}
    </motion.a>
  );
});
