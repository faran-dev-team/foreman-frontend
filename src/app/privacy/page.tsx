import type { Metadata } from "next";
import { TextPage } from "@/components/marketing/text-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Foreman",
  description: "Privacy Policy for Foreman, the AI front office for the trades.",
};

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy Policy" eyebrow="LEGAL">
      <p>Last updated: July 16, 2026</p>
      
      <p>
        Foreman is a product of MeeTech LLC (&quot;Foreman&quot;, &quot;we&quot;, &quot;us&quot;). This policy explains what
        information we collect, how we use it, and the choices you have.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>1. Who this covers</h2>
      <p>
        <strong>Customers:</strong> businesses that use Foreman to answer and book their calls.<br />
        <strong>Callers:</strong> people who call a business that uses Foreman.
      </p>
      <p>
        If you are a caller and want your information corrected or removed, contact the business you
        called, or write to <strong>privacy@foremanai.tech</strong>.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>2. Information we collect</h2>
      <p>
        <strong>From customers:</strong> name, business name, email, phone number, billing details, your services
        and price ranges, service area, business hours, calendar connection, technician availability,
        escalation rules, dashboard activity, log data, device and browser information.
      </p>
      <p>
        <strong>From calls Foreman handles:</strong> audio recordings and transcripts, caller phone number, name,
        service address, the nature of the job, appointment details, and SMS messages sent and
        received including confirmations, reminders, missed call text backs, and invoice follow ups.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>3. How we use it</h2>
      <p>
        To answer calls, qualify jobs, check your service area, provide price ranges, check
        availability, book appointments, send confirmations, and escalate to a human where your
        rules require it. To show your calls, jobs, transcripts, and captured revenue in your
        dashboard. To send SMS on your behalf. To maintain reliability, accuracy, and safety,
        including audit logs and error monitoring. To provide support. To meet legal and tax
        obligations.
      </p>
      <p>
        We do not sell personal information, and we do not use the content of your calls to train third
        party AI models.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>4. Call recording and consent</h2>
      <p>
        Foreman records and transcribes calls so customers can review what was said, so jobs are
        booked accurately, and so there is an audit trail of what the AI did.
      </p>
      <p>
        Recording laws vary. Some jurisdictions, including several US states, require every party to
        a call to consent before it can be recorded. Foreman announces at the start of a call that the
        call may be recorded.
      </p>
      <p>
        Customers are responsible for ensuring that recording calls is lawful where they and their
        callers are located, and for obtaining any consent the law requires. See our Terms of Service.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>5. Service providers</h2>
      <p>
        We use a small number of trusted providers who process information only to perform
        services for us, under confidentiality and data protection obligations: Twilio for telephony and
        SMS, Retell AI for voice conversation handling, OpenAI for language understanding, Google
        for calendar integration, Sentry for error monitoring, and our cloud hosting and payment
        providers.
      </p>
      <p>
        An up to date subprocessor list is available at <strong>privacy@foremanai.tech</strong>.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>6. When we share</h2>
      <p>
        Only with the customer whose calls we handle, with the service providers above, where
        required by law or to protect the rights and safety of any person, and in connection with a
        merger or sale of assets with notice.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>7. Retention</h2>
      <p>
        We keep recordings, transcripts, and related records while your account is active, and
        afterwards only as long as needed for legal, accounting, or dispute resolution purposes.
        Request deletion of specific records at <strong>privacy@foremanai.tech</strong>.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>8. Security</h2>
      <p>
        Encryption in transit, access controls, server side guardrails, complete audit logging of every
        AI action, and continuous monitoring. No system is completely secure, but we work
        constantly to protect what you trust us with.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>9. Your rights</h2>
      <p>
        Depending on where you live you may have the right to access, correct, delete, or export
        your personal information, to object to or restrict processing, and to withdraw consent.
        Residents of California and certain other jurisdictions may have additional rights, including
        the right not to be treated differently for exercising them. Write to <strong>privacy@foremanai.tech</strong>
        and we will respond within the time the law requires.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>10. International transfers</h2>
      <p>
        MeeTech LLC operates internationally. Information may be processed in countries other than
        your own, including the United States, the United Arab Emirates, and Pakistan. Where the
        law requires it, we put appropriate safeguards in place.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>11. Children</h2>
      <p>
        Foreman is a service for businesses. It is not directed to children and we do not knowingly
        collect information from them.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>12. Changes</h2>
      <p>
        We may update this policy. We will post the updated version here and change the date
        above. Material changes will be communicated to customers directly.
      </p>
    </TextPage>
  );
}
