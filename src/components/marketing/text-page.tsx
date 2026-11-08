"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { C } from "./foreman-landing";
import { GCC_FONT_VARS } from "./gcc/fonts";
import { GccFooter } from "./gcc/gcc-footer";
import { GccNav, TopBar } from "./gcc/gcc-nav";

import "./foreman-landing.css";
import "./gcc/gcc.css";

export function TextPage({ children, title, eyebrow }: { children: React.ReactNode, title?: string, eyebrow?: string }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 2, syncTouch: true, smoothWheel: true }}>
      <main
        className={`fm-landing gx ${GCC_FONT_VARS}`}
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          color: C.textHeading,
          background: C.bgPrimary,
          overflowX: "clip",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar />
        <GccNav />

        <div style={{ background: C.bgPrimary, color: C.textHeading, padding: "120px 0 140px", position: "relative", overflow: "hidden", flex: 1 }}>
          <div className="fm-wrap" style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
            {(title || eyebrow) && (
              <div style={{ marginBottom: 48 }}>
                {eyebrow && <div className="fm-eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
                {title && <h1 className="fm-h1" style={{ fontSize: "3rem", lineHeight: 1.1 }}>{title}</h1>}
              </div>
            )}

            <div style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: C.textBody,
              display: "flex",
              flexDirection: "column",
              gap: 24
            }}>
              {children}
            </div>
          </div>
        </div>

        <GccFooter />
      </main>
    </ReactLenis>
  );
}
