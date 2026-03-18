// ═══════════════════════════════════════════════════════════
// APPLY AS LAB PAGE

import { useState } from "react";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const ApplyLabPage = ({ showToast }: { showToast: (text: string, type: string) => void }) => {
  const [form, setForm] = useState({ name: "", focus: "", university: "", contact: "", email: "", why: "", url: "" });
  const set = (k: string) => (e: { target: { value: any } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.email || !form.why) {
      showToast("Please fill all required fields.", "error");
      return;
    }
    showToast("Lab application submitted! We'll review and respond within one week.", "success");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/network/labs/apply</div>
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>Apply as a Research Lab</h1>
        <p style={{ fontSize: 16, color: "#6B6B7A", marginBottom: 0 }}>
          Join the AthenaX partner network. Get access to protocol sponsors, bounty funding, and the builder cohort pipeline.
        </p>
        <hr className="divider" />
        <WindowCard label="LAB_APPLICATION.FORM">
          <div className="inp-group">
            <label className="inp-label">Lab Name *</label>
            <input className="inp" value={form.name} onChange={set("name")} placeholder="e.g. Berkeley RDI" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Research Focus *</label>
            <input className="inp" value={form.focus} onChange={set("focus")} placeholder="e.g. Applied cryptography and ZK systems" />
          </div>
          <div className="inp-group">
            <label className="inp-label">University / Institution *</label>
            <input className="inp" value={form.university} onChange={set("university")} placeholder="e.g. UC Berkeley" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Primary Contact *</label>
            <input className="inp" value={form.contact} onChange={set("contact")} placeholder="Name of lab director or PI" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Email *</label>
            <input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="contact@lab.edu" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Lab Website</label>
            <input className="inp" value={form.url} onChange={set("url")} placeholder="https://yourlab.edu" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Why join AthenaX? *</label>
            <textarea
              className="inp"
              rows={3}
              value={form.why}
              onChange={set("why")}
              placeholder="What research are you working on and how would the network benefit your lab?"
            />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={submit}>
            Submit Application →
          </button>
        </WindowCard>
      </div>
    </div>
  );
};

export default ApplyLabPage;
