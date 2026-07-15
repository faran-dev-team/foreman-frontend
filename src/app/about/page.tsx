import type { Metadata } from "next";
import { TextPage } from "@/components/marketing/text-page";
import { MagneticButton } from "@/components/marketing/foreman-landing";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";

export const metadata: Metadata = {
  title: "About Us | Foreman",
  description: "We built the front office the trades actually needed.",
};

export default function AboutPage() {
  return (
    <TextPage title="We built the front office the trades actually needed." eyebrow="ABOUT FOREMAN">
      <p>
        Every service business runs on its phone. And every service business loses money on it.
      </p>
      <p>
        The owner is on a roof, under a sink, or in a crawlspace. The phone rings. It goes to
        voicemail. The caller does not leave a message. They call the next name on Google. That
        job is gone, and the owner never even knows it existed.
      </p>
      <p>
        Roughly one in four calls to a service business goes unanswered. In peak season it is
        worse. Every one of those calls was a job.
      </p>
      <p>
        We built Foreman to end that.
      </p>
      <p>
        Foreman answers every call, day or night, in English or Spanish. It understands what the
        caller needs, checks your service area, gives a price range, finds a slot, and books the job
        straight into your calendar. It texts back the ones who hang up. It flags the emergencies.
        Then it shows you exactly how much revenue it captured that you would otherwise have lost.
      </p>
      <p>
        No voicemail. No missed jobs. No front desk to hire.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.75rem", marginTop: 40, marginBottom: 16, fontWeight: 700 }}>Built by operators, not just engineers.</h2>
      <p>
        Foreman is a project of MeeTech LLC, a technology company building AI products for real
        businesses, with teams working across the United States, the United Arab Emirates, and
        Pakistan.
      </p>
      <p>
        We are a small team that ships fast and stays close to the people who use what we build.
        Every feature in Foreman exists because a business owner told us they needed it. The
        bilingual calling, the emergency triage, the live listen and take over, the revenue dashboard:
        none of that came from a roadmap meeting. It came from owners telling us what was costing
        them money.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.75rem", marginTop: 40, marginBottom: 24, fontWeight: 700 }}>What we believe.</h2>
      
      <h3 style={{ color: "#fff", fontSize: "1.25rem", marginTop: 16, marginBottom: 8, fontWeight: 600 }}>We only win when you win.</h3>
      <p>
        Foreman is priced so that it charges when it delivers you real work. If it is not booking you
        jobs, it is not doing its job.
      </p>
      
      <h3 style={{ color: "#fff", fontSize: "1.25rem", marginTop: 16, marginBottom: 8, fontWeight: 600 }}>Speed is the product.</h3>
      <p>
        The first business to answer usually gets the call. Everything we build is designed around
        answering instantly and booking fast.
      </p>

      <h3 style={{ color: "#fff", fontSize: "1.25rem", marginTop: 16, marginBottom: 8, fontWeight: 600 }}>You stay in control.</h3>
      <p>
        Foreman is your front office, not a black box. Listen to any call live, take over whenever you
        want, and see everything it did and why it did it.
      </p>

      <div style={{ marginTop: 60, padding: 40, background: "rgba(255,255,255,0.03)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "2rem", marginBottom: 16, fontWeight: 700 }}>See what Foreman captures for your business.</h2>
        <p style={{ fontSize: "1.125rem", marginBottom: 32 }}>Start a free pilot and watch what it books in the first week.</p>
        <MagneticButton href={CALENDLY_PILOT_URL} className="fm-btn fm-btn-primary" style={{ margin: "0 auto" }}>Book your free pilot</MagneticButton>
      </div>
    </TextPage>
  );
}
