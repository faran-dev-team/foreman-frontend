"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CalendarCheck,
  FileDown,
  Headphones,
  LayoutDashboard,
  Phone,
  Settings,
  Share2,
  TrendingUp,
  Users,
} from "lucide-react";

import { ForemanLogo } from "@/lib/brand";

import { DASHBOARD, SAMPLE_CALL } from "./content";
import { Waveform } from "./live-call-console";
import { Accent, Ar, CheckMark, Reveal, SectionHead, WhatsAppIcon } from "./primitives";

function useCount(to: number, run: boolean, duration = 1.6) {
  const reduced = useReducedMotion();
  // Start at 0 on both server and client; the effect below sets the final
  // number for reduced-motion visitors (doing it here breaks hydration).
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run || reduced) {
      if (reduced) setV(to);
      return;
    }
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [run, to, duration, reduced]);
  return v;
}

function Tile({ tile, run }: { tile: (typeof DASHBOARD.tiles)[number]; run: boolean }) {
  const v = useCount(tile.value, run);
  const shown =
    tile.format === "percent"
      ? `${Math.round(v)}%`
      : tile.format === "aed"
        ? `AED ${Math.round(v).toLocaleString("en-US")}`
        : Math.round(v).toLocaleString("en-US");
  return (
    <div className={`gx-dtile gx-dtile-${tile.key}`}>
      <span className="gx-dtile-label">{tile.label}</span>
      <span className="gx-dtile-value">{shown}</span>
      <span className="gx-dtile-delta">
        <TrendingUp size={12} strokeWidth={2.6} aria-hidden /> {tile.delta}
      </span>
    </div>
  );
}

function LanguageTile({ run }: { run: boolean }) {
  return (
    <div className="gx-dtile gx-dtile-lang">
      <span className="gx-dtile-label">Jobs by Language</span>
      <div className="gx-langbar" role="img" aria-label="Arabic 46%, English 31%, Urdu 23%">
        {DASHBOARD.languageSplit.map((l) => (
          <span key={l.key} className={`gx-langbar-seg gx-seg-${l.key}`} style={{ width: run ? `${l.value}%` : "0%" }} />
        ))}
      </div>
      <ul className="gx-langlegend">
        {DASHBOARD.languageSplit.map((l) => (
          <li key={l.key}>
            <i className={`gx-seg-${l.key}`} />
            {l.label}
            <b>{l.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SIDEBAR = [
  { label: "Overview", Icon: LayoutDashboard, active: true },
  { label: "Calls", Icon: Phone },
  { label: "Jobs", Icon: CalendarCheck },
  { label: "Technicians", Icon: Users },
  { label: "Reports", Icon: BarChart3 },
  { label: "Settings", Icon: Settings },
];

export function GccDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section id="dashboard" className="gx-section gx-dashboard">
      <div className="gx-dashboard-glow" aria-hidden />
      <div className="gx-wrap">
        <SectionHead
          kicker={DASHBOARD.kicker}
          title={
            <>
              Your Entire Business Performance, <Accent>Live and in One Place.</Accent>
            </>
          }
          sub={DASHBOARD.copy}
        />

        <Reveal y={40}>
          <div className="gx-browser" ref={ref}>
            <div className="gx-browser-bar">
              <span className="gx-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="gx-url">app.foremanai.tech/dashboard</span>
              <span className="gx-live gx-live-sm">
                <i aria-hidden /> Live
              </span>
            </div>

            <div className="gx-app">
              <aside className="gx-app-side" aria-hidden>
                <div className="gx-app-brand">
                  <ForemanLogo size={28} />
                  <div>
                    <b>Foreman</b>
                    <span>Owner dashboard</span>
                  </div>
                </div>
                {SIDEBAR.map(({ label, Icon, active }) => (
                  <span key={label} className={`gx-app-nav${active ? " is-active" : ""}`}>
                    <Icon size={15} strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </aside>

              <div className="gx-app-main">
                <div className="gx-app-top">
                  <div>
                    <span className="gx-app-eyebrow">Overview · This week</span>
                    <h3 className="gx-app-title">Your Company · Dubai</h3>
                  </div>
                  <div className="gx-app-top-actions">
                    <span className="gx-app-btn">
                      <FileDown size={14} strokeWidth={2.2} aria-hidden /> Weekly report · PDF
                    </span>
                    <span className="gx-app-btn gx-app-btn-dark">
                      <Share2 size={14} strokeWidth={2.2} aria-hidden /> Share with partner
                    </span>
                  </div>
                </div>

                <div className="gx-dtiles">
                  {DASHBOARD.tiles.map((t) => (
                    <Tile key={t.key} tile={t} run={inView} />
                  ))}
                  <LanguageTile run={inView} />
                </div>

                <div className="gx-app-grid">
                  <div className="gx-app-card gx-app-live">
                    <div className="gx-app-card-head">
                      <span className="gx-app-card-title">
                        <span className="gx-live gx-live-sm gx-live-light">
                          <i aria-hidden /> Live call
                        </span>
                        +971 50 ••• 4412 · Al Barsha
                      </span>
                      <span className="gx-app-card-actions">
                        <span className="gx-app-pill">
                          <Headphones size={13} strokeWidth={2.2} aria-hidden /> Listen
                        </span>
                        <span className="gx-app-pill gx-app-pill-orange">Take over</span>
                      </span>
                    </div>
                    <Waveform bars={28} className="gx-wave-light" />
                    <div className="gx-app-transcript">
                      <div className="gx-tline">
                        <span className="gx-tline-who">Caller (Arabic)</span>
                        <p>
                          <Ar>{SAMPLE_CALL.caller.ar}</Ar>
                        </p>
                        <span className="gx-tline-gloss">{SAMPLE_CALL.caller.gloss}</span>
                      </div>
                      <div className="gx-tline gx-tline-agent">
                        <span className="gx-tline-who">Foreman (Arabic)</span>
                        <p>
                          <Ar>{SAMPLE_CALL.agent.ar}</Ar>
                        </p>
                        <span className="gx-tline-gloss">{SAMPLE_CALL.agent.gloss}</span>
                      </div>
                    </div>
                    <div className="gx-app-system">
                      <span className="gx-app-system-label">System</span>
                      <span className="gx-sys">
                        <CheckMark size={12} /> Dispatched to Tech Imran (briefed in Urdu)
                      </span>
                      <span className="gx-sys">
                        <CheckMark size={12} /> Booked AED 250
                      </span>
                      <span className="gx-sys gx-sys-wa">
                        <WhatsAppIcon size={12} /> WhatsApp Confirmation Sent
                      </span>
                    </div>
                  </div>

                  <div className="gx-app-card gx-app-bookings">
                    <div className="gx-app-card-head">
                      <span className="gx-app-card-title">Recent bookings</span>
                      <span className="gx-app-muted">Today</span>
                    </div>
                    <ul>
                      {DASHBOARD.bookings.map((b) => (
                        <li key={b.area}>
                          <div>
                            <b>{b.issue}</b>
                            <span>
                              {b.area} · {b.time}
                            </span>
                          </div>
                          <div className="gx-booking-right">
                            <b>AED {b.value}</b>
                            <span className="gx-techchip">
                              {b.tech} · {b.techLang}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="gx-recovered">
                      <span>Recovered after hours</span>
                      <b>118 calls · AED 31,900</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="gx-caption">Illustrative dashboard · calls, bookings, dirhams and languages in one view</p>
        </Reveal>
      </div>
    </section>
  );
}
