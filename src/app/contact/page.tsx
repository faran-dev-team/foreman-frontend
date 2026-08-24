"use client";

import { TextPage } from "@/components/marketing/text-page";
import { MagneticButton } from "@/components/marketing/foreman-landing";
import { CALENDLY_PILOT_URL } from "@/lib/marketing/calendly";
import { useState } from "react";
import { C } from "@/components/marketing/foreman-landing";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <TextPage title="Talk to us." eyebrow="CONTACT">
      <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.8)", marginBottom: 40, marginTop: -16 }}>
        Whether you want a pilot, a white label build for your portfolio, or you just have a
        question, we will get back to you fast.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
        
        {/* Left Column: Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Card 1 */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 12, fontWeight: 600 }}>Book a pilot</h3>
            <p style={{ marginBottom: 24, fontSize: "0.95rem" }}>
              The fastest way to see Foreman work for your business. Fifteen minutes, no pressure, no
              monthly fee during the pilot.
            </p>
            <MagneticButton href={CALENDLY_PILOT_URL} className="fm-btn fm-btn-primary" style={{ display: "inline-flex", width: "auto" }}>Book your free pilot</MagneticButton>
          </div>

          {/* Card 2 */}
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 32, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
            <h3 style={{ color: "#fff", fontSize: "1.25rem", marginBottom: 12, fontWeight: 600 }}>Sales and partnerships</h3>
            <p style={{ marginBottom: 16, fontSize: "0.95rem" }}>
              For pilots, white label builds, and portfolio deals.
            </p>
            <a href="mailto:sales@foremanai.tech" style={{ color: C.accentOrange, fontWeight: 600, textDecoration: "none", wordBreak: "break-all" }}>sales@foremanai.tech</a>
          </div>

          {/* Card 3 & 4 Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: 8, fontWeight: 600 }}>Support</h3>
              <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>For customers who need a hand.</p>
              <a href="mailto:support@foremanai.tech" style={{ color: C.accentGreenText, fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", wordBreak: "break-all" }}>support@foremanai.tech</a>
            </div>
            
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 24, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
              <h3 style={{ color: "#fff", fontSize: "1.1rem", marginBottom: 8, fontWeight: 600 }}>General enquiries</h3>
              <p style={{ marginBottom: 12, fontSize: "0.9rem" }}>Anything else.</p>
              <a href="mailto:hello@foremanai.tech" style={{ color: "#60A5FA", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", wordBreak: "break-all" }}>hello@foremanai.tech</a>
            </div>
          </div>
          
          <div style={{ marginTop: 16, padding: "0 8px", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
            <p style={{ marginBottom: 8 }}>
              <strong>Social:</strong>{" "}
              <a href="https://x.com/foremanai_?s=11" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline", marginRight: 12 }}>X @foremanai_</a>
              <a href="https://www.instagram.com/foreman.ai_?igsh=MTVyampxZHo1OTJqNQ==" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline", marginRight: 12 }}>Instagram @foreman.ai_</a>
              <a href="https://www.linkedin.com/company/foremanaii/?viewAsMember=true" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}>LinkedIn</a>
            </p>
            <p><strong>Company:</strong> Foreman is a project of MeeTech LLC.<br/>MeeTech LLC<br/>30 N Gould St # 43982, Sheridan, WY 82801</p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div style={{ background: "rgba(10,15,28,0.5)", padding: 40, borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(31,170,89,0.1)", border: `1px solid ${C.accentGreenText}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.accentGreenText} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: 12, fontWeight: 600 }}>Thanks.</h3>
              <p>We will get back to you within one business day.</p>
              <button onClick={() => setStatus("idle")} style={{ marginTop: 24, background: "transparent", border: "none", color: C.accentOrange, fontWeight: 600, cursor: "pointer" }}>Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label htmlFor="name" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#fff" }}>Name *</label>
                <input id="name" required style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", outline: "none" }} />
              </div>
              
              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#fff" }}>Email *</label>
                <input id="email" type="email" required style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", outline: "none" }} />
              </div>

              <div>
                <label htmlFor="businessName" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#fff" }}>Business name</label>
                <input id="businessName" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", outline: "none" }} />
              </div>

              <div>
                <label htmlFor="trade" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#fff" }}>Trade</label>
                <select id="trade" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", outline: "none", appearance: "none" }}>
                  <option value="" style={{ background: "#0A0F1C", color: "#fff" }}>Select a trade...</option>
                  <option value="hvac" style={{ background: "#0A0F1C", color: "#fff" }}>HVAC</option>
                  <option value="plumbing" style={{ background: "#0A0F1C", color: "#fff" }}>Plumbing</option>
                  <option value="restoration" style={{ background: "#0A0F1C", color: "#fff" }}>Restoration</option>
                  <option value="electrical" style={{ background: "#0A0F1C", color: "#fff" }}>Electrical</option>
                  <option value="roofing" style={{ background: "#0A0F1C", color: "#fff" }}>Roofing</option>
                  <option value="pest-control" style={{ background: "#0A0F1C", color: "#fff" }}>Pest Control</option>
                  <option value="garage-door" style={{ background: "#0A0F1C", color: "#fff" }}>Garage Door</option>
                  <option value="property-management" style={{ background: "#0A0F1C", color: "#fff" }}>Property Management</option>
                  <option value="other" style={{ background: "#0A0F1C", color: "#fff" }}>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: "#fff" }}>Message *</label>
                <textarea id="message" required rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "1rem", outline: "none", resize: "vertical" }} />
              </div>

              {status === "error" && (
                <div style={{ color: "#EF4444", fontSize: "0.9rem", background: "rgba(239,68,68,0.1)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                  That did not send. Please try again, or email us at hello@foremanai.tech.
                </div>
              )}

              <button type="submit" disabled={status === "submitting"} className="fm-btn fm-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: status === "submitting" ? 0.7 : 1 }}>
                {status === "submitting" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </TextPage>
  );
}
