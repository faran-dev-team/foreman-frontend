"use client";

import { ReactLenis } from "@studio-freight/react-lenis";
import { Nav, Footer, C } from "./foreman-landing";

import "./foreman-landing.css";

export function TextPage({ children, title, eyebrow }: { children: React.ReactNode, title?: string, eyebrow?: string }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, wheelMultiplier: 1, touchMultiplier: 2, syncTouch: true, smoothWheel: true }}>
      <main
        className="fm-landing"
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          color: C.textHeading,
          background: C.navBg,
          overflowX: "clip",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />
        
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

        <Footer />
      </main>
    </ReactLenis>
  );
}
