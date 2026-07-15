import type { Metadata } from "next";
import { TextPage } from "@/components/marketing/text-page";

export const metadata: Metadata = {
  title: "Terms of Service | Foreman",
  description: "Terms of Service for Foreman, the AI front office for the trades.",
};

export default function TermsPage() {
  return (
    <TextPage title="Terms of Service" eyebrow="LEGAL">
      <p>Last updated: July 16, 2026</p>
      
      <p>
        These Terms govern your use of Foreman, a product of MeeTech LLC. By using the service
        you agree to them. If you are agreeing on behalf of a business, you confirm you are
        authorised to bind it.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>1. The service</h2>
      <p>
        Foreman is an AI powered front office for service businesses. It answers inbound calls,
        qualifies the job, checks your service area, provides price ranges, checks availability, books
        appointments into your calendar, sends SMS confirmations, follows up on invoices, and
        gives you a dashboard of every call and job. Features available depend on your plan and
        order form.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>2. Your account</h2>
      <p>
        Give us accurate information and keep it current. You are responsible for all activity under
        your account and for keeping credentials secure. Tell us at <strong>support@foremanai.tech</strong> if you
        suspect unauthorised access.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>3. Fees and billing</h2>
      <p>
        Your fees are set out in your order form and may include a one time setup fee, a recurring
        subscription fee, and usage based charges such as a fee per booked job or qualified intake.
        Fees are billed in advance unless your order form says otherwise and are non refundable
        except where the law requires. We may change pricing on renewal with reasonable prior
        notice.
      </p>
      <p>
        Where your plan includes usage based charges, the definition of a billable event is set out in
        your order form. If you believe an event was billed in error, contact us within thirty days and
        we will review it.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>4. Your responsibilities</h2>
      <p>
        <strong>(a) Call recording and consent.</strong> You are responsible for ensuring that recording and
        transcribing calls is lawful in every jurisdiction where you and your callers are located, and
        for obtaining any consent the law requires. Some jurisdictions require every party to a call to
        consent. Foreman plays a recording announcement, but legal compliance remains your
        responsibility.
      </p>
      <p>
        <strong>(b) Messaging.</strong> You are responsible for ensuring every SMS sent through the service
        complies with applicable law, including the Telephone Consumer Protection Act and
        equivalent rules, and that you have the consent needed to contact each recipient. Opt out
        requests must be honoured, and the service supports STOP handling for this purpose.
      </p>
      <p>
        <strong>(c) Accurate configuration.</strong> What Foreman tells your callers about your services, prices,
        availability, and service area comes from the information you give us. Keeping it accurate is
        your responsibility.
      </p>
      <p>
        <strong>(d) Regulated data.</strong> Unless we have agreed otherwise in writing, you must not use the
        service to collect or process protected health information or other data subject to sector
        specific regulation such as HIPAA.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>5. Acceptable use</h2>
      <p>
        You must not use the service to break the law, to harass, deceive, or defraud anyone, to
        send unlawful or unsolicited messages, to infringe intellectual property, to attempt to disrupt,
        probe, or reverse engineer the service, or to resell or white label it without our written
        agreement.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>6. The nature of an AI service</h2>
      <p>
        Foreman uses artificial intelligence. It can misunderstand a caller, make mistakes, or
        produce inaccurate output. In particular:
      </p>
      <ul>
        <li>Price information Foreman gives a caller is a range for guidance only. It is not a quote, an estimate, or a binding offer, and you are not bound by it.</li>
        <li>Foreman is a tool that supports your business. It is not a substitute for your professional judgement.</li>
        <li>You should review your calls, set escalation rules that suit your business, and use the live listen and take over controls we provide.</li>
      </ul>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>7. Availability</h2>
      <p>
        We work hard to keep the service available and reliable but do not guarantee uninterrupted
        operation. The service depends on third party providers including telephony, voice, and AI
        providers, and on your own systems, phone service, and calendar.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>8. Intellectual property</h2>
      <p>
        We own the service, our software, our models and configurations, and our brand. You own
        your business data and the content of your calls. You grant us the licence we need to
        operate, support, and improve the service for you, as described in our Privacy Policy.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>9. Confidentiality</h2>
      <p>
        Each of us will protect the other&#39;s confidential information and use it only as needed to
        perform under these Terms.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>10. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, we are not liable for indirect, incidental, special,
        consequential, or punitive damages, or for lost profits, revenue, data, or business
        opportunities, whether or not we were advised they were possible. Our total liability for all
        claims arising out of or relating to the service is limited to the fees you paid us in the twelve
        months before the claim arose.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>11. Indemnity</h2>
      <p>
        You will defend and indemnify MeeTech LLC against any claim arising from your breach of
        these Terms, your unlawful use of the service, or your failure to obtain any consent required
        from your callers or message recipients.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>12. Term and termination</h2>
      <p>
        Either of us may terminate as set out in your order form. We may suspend or terminate the
        service if you breach these Terms or use the service unlawfully. On termination we will make
        your data available for export for a reasonable period before deletion.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>13. Changes</h2>
      <p>
        We may update these Terms. If a change is material we will tell customers before it takes
        effect. Continuing to use the service after that means you accept the updated Terms.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>14. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, United States, without
        regard to its conflict of law rules. The state and federal courts located in Delaware have
        exclusive jurisdiction over any dispute arising out of or relating to these Terms or the service.
      </p>

      <h2 style={{ color: "#fff", fontSize: "1.5rem", marginTop: 24, marginBottom: 8, fontWeight: 700 }}>15. Contact</h2>
      <p>
        MeeTech LLC<br />
        [REGISTERED ADDRESS]<br />
        <strong>legal@foremanai.tech</strong>
      </p>
    </TextPage>
  );
}
