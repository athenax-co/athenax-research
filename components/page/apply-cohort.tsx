// ═══════════════════════════════════════════════════════════
// APPLY COHORT PAGE

import { useState } from "react";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const ApplyCohortPage = ({ user, showToast }: { user: any; showToast: (text: string, type: string) => void }) => {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", track: "AI Agents", why: "", project: "" });
  const set = (k: string) => (e: { target: { value: any } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.why || !form.project) {
      showToast("Please complete all fields.", "error");
      return;
    }
    showToast("Application submitted! (Demo)", "success");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/apply</div>
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>Apply to AthenaX</h1>
        <p style={{ fontSize: 16, color: "#6B6B7A", marginBottom: 0 }}>Researchers, builders, and cohort applicants.</p>
        <hr className="divider" />
        <WindowCard label="APPLICATION.FORM">
          <div className="inp-group">
            <label className="inp-label">Full Name</label>
            <input className="inp" value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Email</label>
            <input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="jane@university.edu" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Research Track</label>
            <select className="inp" value={form.track} onChange={set("track")}>
              {["AI Agents", "DAO Governance", "Protocol Economics", "Tokenomics", "DeFi Systems", "Digital Nations"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="inp-group">
            <label className="inp-label">Project Idea</label>
            <textarea className="inp" rows={3} value={form.project} onChange={set("project")} placeholder="What are you building?" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Why AthenaX?</label>
            <textarea className="inp" rows={3} value={form.why} onChange={set("why")} placeholder="Why do you want to join?" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} onClick={submit}>
            Submit Application →
          </button>
        </WindowCard>
      </div>
    </div>
  );
};

export default ApplyCohortPage;
