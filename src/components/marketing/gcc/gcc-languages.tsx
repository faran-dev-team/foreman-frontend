"use client";

import { ArrowLeftRight, ClipboardList, Pilcrow } from "lucide-react";

import { ForemanLogo } from "@/lib/brand";

import { LANGUAGES } from "./content";
import { Accent, Ar, CheckMark, Hi, Reveal, SectionHead, Ur } from "./primitives";

function MergeVisual() {
  return (
    <div className="gx-merge" role="img" aria-label="Two callers say the same thing in Roman Urdu and Gulf Arabic; Foreman turns both into one service request: AC not working.">
      <svg className="gx-merge-lines" viewBox="0 0 600 260" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="gx-merge-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="#F97A35" />
          </linearGradient>
        </defs>
        <path d="M150 62 C 230 62, 240 130, 300 130" className="gx-merge-path" />
        <path d="M150 198 C 230 198, 240 130, 300 130" className="gx-merge-path" />
        <path d="M300 130 L 450 130" className="gx-merge-path gx-merge-out" />
        <path d="M150 62 C 230 62, 240 130, 300 130" className="gx-merge-flow" />
        <path d="M150 198 C 230 198, 240 130, 300 130" className="gx-merge-flow gx-merge-flow-b" />
        <path d="M300 130 L 450 130" className="gx-merge-flow gx-merge-flow-c" />
      </svg>

      <div className="gx-merge-in gx-merge-in-a">
        <span className="gx-merge-tag">Roman Urdu</span>
        <span className="gx-merge-say">“{LANGUAGES.mixed.romanUrdu}”</span>
      </div>
      <div className="gx-merge-in gx-merge-in-b">
        <span className="gx-merge-tag">Gulf Arabic</span>
        <span className="gx-merge-say">
          <Ar>{LANGUAGES.mixed.gulfArabic}</Ar>
        </span>
      </div>

      <div className="gx-merge-core">
        <span className="gx-merge-pulse" aria-hidden />
        <ForemanLogo size={44} />
      </div>

      <div className="gx-merge-out-card">
        <span className="gx-merge-tag">
          <ClipboardList size={12} strokeWidth={2.4} aria-hidden /> One ticket
        </span>
        <b>{LANGUAGES.mixed.result}</b>
        <span className="gx-merge-ok">
          <CheckMark size={12} /> Same job, two languages
        </span>
      </div>
    </div>
  );
}

function Glyph({ id }: { id: string }) {
  if (id === "ar") return <Ar className="gx-glyph-ar">ع</Ar>;
  if (id === "en") return <span className="gx-glyph-en">Aa</span>;
  if (id === "ur")
    return (
      <span className="gx-glyph-ur">
        <Ur>اردو</Ur>
        <Hi>हिंदी</Hi>
      </span>
    );
  if (id === "mixed") return <ArrowLeftRight size={24} strokeWidth={2} />;
  return <Pilcrow size={24} strokeWidth={2} style={{ transform: "scaleX(-1)" }} />;
}

function MixedBody() {
  return (
    <>
      Understands natural combinations such as <q className="gx-q">AC kaam nahi kar raha</q> and{" "}
      <q className="gx-q">
        <Ar>الـ AC ما يشتغل</Ar>
      </q>{" "}
      and processes both as the same service request.
    </>
  );
}

export function GccLanguages() {
  return (
    <section id="languages" className="gx-section gx-languages">
      <div className="gx-wrap">
        <div className="gx-lang-top">
          <SectionHead
            align="left"
            kicker={LANGUAGES.kicker}
            title={
              <>
                {LANGUAGES.headlineLead} <Accent>{LANGUAGES.headlineAccent}</Accent>
              </>
            }
          />
          <Reveal delay={0.1} className="gx-lang-visual">
            <MergeVisual />
          </Reveal>
        </div>

        <div className="gx-lang-grid">
          {LANGUAGES.cards.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06} className={`gx-lang-cell gx-lang-cell-${c.id}`}>
              <article className="gx-card gx-lang-card">
                <span className="gx-glyph" aria-hidden>
                  <Glyph id={c.id} />
                </span>
                <h3 className="gx-h3">{c.title}</h3>
                <p>{c.id === "mixed" ? <MixedBody /> : c.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="gx-smallprint">{LANGUAGES.smallPrint}</p>
      </div>
    </section>
  );
}
