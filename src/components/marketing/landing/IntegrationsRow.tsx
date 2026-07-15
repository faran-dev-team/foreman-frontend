"use client";

import Image from "next/image";
import { C, Reveal } from "./shared";
import { DoodleIntegrations } from "../foreman-illustrations";

const integrations = [
  { name: "ServiceTitan", src: "/images/servicetitan.png" },
  { name: "Housecall Pro", src: "/images/housecall-pro.png" },
  { name: "Jobber", src: "/images/jobber.png" },
  { name: "Workiz", src: "/images/workiz.png" },
  { name: "FieldEdge", src: "/images/fieldedge.png" },
  { name: "Buildium", src: "/images/buildium.png" },
  { name: "AppFolio", src: "/images/appfolio.png" },
  { name: "GHL", src: "/images/ghl.png" }
];

export function IntegrationsRow() {
  return (
    <section className="fm-island" style={{ background: C.bgCard, padding: "80px 0", borderTop: `1px solid ${C.borderPrimary}` }}>
      <div className="fm-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <div className="fm-eyebrow" style={{ marginBottom: 16 }}>WORKS WITH YOUR TOOLS</div>
          <h2 className="fm-h2" style={{ fontSize: 32, marginBottom: 24 }}>
            Direct integration with the software you already use.
          </h2>
          <div className="fm-integration-illustration" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <DoodleIntegrations style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }} />
          </div>
        </Reveal>

        <div className="fm-marquee-container" style={{ position: "relative" }}>
          {/* Gradient masks for smooth fading at edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${C.bgCard}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${C.bgCard}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
          
          <div className="fm-marquee-content" style={{ willChange: "transform" }}>
            {[...integrations, ...integrations].map((img, i) => (
              <div
                key={i}
                style={{
                  width: 140, height: 60, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${C.borderPrimary}`,
                  padding: 16, position: "relative"
                }}
              >
                <Image src={img.src} alt={img.name} fill style={{ objectFit: "contain", padding: 12 }} sizes="140px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
