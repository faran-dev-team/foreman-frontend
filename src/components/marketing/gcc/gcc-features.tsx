"use client";

import {
  BadgeCheck,
  CalendarCheck,
  FileText,
  Headphones,
  MapPin,
  PhoneForwarded,
  Repeat,
  ScrollText,
  Server,
  Siren,
  UserCheck,
  Wallet,
} from "lucide-react";

import { FEATURES } from "./content";
import { Waveform } from "./live-call-console";
import { Accent, CheckMark, Reveal, SectionHead, WhatsAppIcon } from "./primitives";

type Id = (typeof FEATURES.items)[number]["id"];

const ICONS: Record<Id, React.ReactNode> = {
  ppb: <Wallet size={20} strokeWidth={2} />,
  dispatch: <UserCheck size={20} strokeWidth={2} />,
  amc: <ScrollText size={20} strokeWidth={2} />,
  emergency: <Siren size={20} strokeWidth={2} />,
  whatsapp: <WhatsAppIcon size={20} />,
  live: <Headphones size={20} strokeWidth={2} />,
  reports: <FileText size={20} strokeWidth={2} />,
  number: <PhoneForwarded size={20} strokeWidth={2} />,
  hosting: <Server size={20} strokeWidth={2} />,
  hire: <BadgeCheck size={20} strokeWidth={2} />,
};

function Art({ id }: { id: Id }) {
  switch (id) {
    case "ppb":
      return (
        <div className="gx-fa gx-fa-ppb">
          <div className="gx-fa-ppb-row">
            <span>No job booked</span>
            <b>AED 0</b>
          </div>
          <div className="gx-fa-ppb-row is-on">
            <span>
              <CalendarCheck size={13} strokeWidth={2.4} /> Job booked
            </span>
            <b>You pay</b>
          </div>
          <div className="gx-fa-ppb-strike">
            <span>Seat licences</span>
            <span>Per-minute fees</span>
          </div>
        </div>
      );
    case "dispatch":
      return (
        <div className="gx-fa gx-fa-dispatch">
          <span className="gx-fa-tech is-muted">
            Imran · <em>no response · 3 min</em>
          </span>
          <Repeat size={14} strokeWidth={2.4} className="gx-fa-swap" />
          <span className="gx-fa-tech is-ok">
            Bilal · <em>accepted</em> <CheckMark size={12} />
          </span>
        </div>
      );
    case "amc":
      return (
        <div className="gx-fa gx-fa-amc">
          <span>AMC · Villa 22</span>
          <div className="gx-fa-visits">
            <i className="is-used" />
            <i className="is-used" />
            <i />
            <i />
          </div>
          <em>2 of 4 included visits used</em>
        </div>
      );
    case "emergency":
      return (
        <div className="gx-fa gx-fa-em">
          <span>UAE</span>
          <span>KSA</span>
        </div>
      );
    case "whatsapp":
      return (
        <div className="gx-fa gx-fa-wa">
          <span className="gx-fa-wa-msg">
            Booking confirmed · Tomorrow 10:00 <i>✓✓</i>
          </span>
          <span className="gx-fa-wa-msg">
            Reminder: technician arriving at 10:00 <i>✓✓</i>
          </span>
          <span className="gx-fa-wa-msg">
            How did we do? ★★★★★ <i>✓✓</i>
          </span>
          <span className="gx-fa-sms">SMS fallback</span>
        </div>
      );
    case "live":
      return (
        <div className="gx-fa gx-fa-live">
          <Waveform bars={18} />
          <span className="gx-fa-take">Take over</span>
        </div>
      );
    case "reports":
      return (
        <div className="gx-fa gx-fa-pdf">
          <span className="gx-fa-pdf-doc">
            <b>PDF</b>
            <i />
            <i />
            <i />
          </span>
          <span>
            Weekly report
            <em>Calls · Bookings · AED · Languages</em>
          </span>
        </div>
      );
    case "number":
      return (
        <div className="gx-fa gx-fa-number">
          <span className="gx-fa-pill">Your number</span>
          <PhoneForwarded size={14} strokeWidth={2.4} />
          <span className="gx-fa-pill is-orange">Foreman</span>
          <span className="gx-fa-pill is-dim">Google Calendar</span>
          <span className="gx-fa-pill is-dim">CSV</span>
        </div>
      );
    case "hosting":
      return (
        <div className="gx-fa gx-fa-host">
          <span className="gx-fa-pin">
            <MapPin size={14} strokeWidth={2.4} /> UAE
          </span>
          <span className="gx-fa-pill is-dim">me-central-1</span>
          <span className="gx-fa-pill is-dim">KSA region available</span>
        </div>
      );
    case "hire":
      return null;
  }
}

export function GccFeatures() {
  return (
    <section id="features" className="gx-section gx-features">
      <div className="gx-wrap">
        <SectionHead
          kicker={FEATURES.kicker}
          title={
            <>
              {FEATURES.headlineLead} <Accent>{FEATURES.headlineAccent}</Accent>
            </>
          }
        />
        <div className="gx-bento">
          {FEATURES.items.map((f, i) => (
            <Reveal key={f.id} delay={(i % 4) * 0.05} className={`gx-bento-cell gx-bento-${f.id}`}>
              <article className={`gx-card gx-feature gx-feature-${f.id}`}>
                <div className="gx-feature-head">
                  <span className="gx-feature-ic">{ICONS[f.id]}</span>
                  <h3 className="gx-h3">{f.title}</h3>
                </div>
                <p>{f.body}</p>
                {"fine" in f && f.fine && <p className="gx-fine">{f.fine}</p>}
                <Art id={f.id} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
