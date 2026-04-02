"use client";

import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

const TRACKS = ["AI Agents", "DAO Governance", "Protocol Economics", "Tokenomics", "DeFi Systems", "Digital Nations"] as const;

export default function Page() {
  const { user, showToast } = useGlobal();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", track: "AI Agents", why: "", project: "" });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = () => {
    if (!form.why || !form.project) {
      showToast("Please complete all fields.", "error");
      return;
    }

    showToast("Application submitted! (Demo)", "success");
  };

  return (
    <div className="section page-wrap page-wrap-narrow-sm">
      <div className="path-badge">/root/cohort/apply</div>
      <h1 className="mb-2 text-[42px]">Apply to AthenaX</h1>
      <p className="mb-0 text-base text-muted">Researchers, builders, and cohort applicants.</p>

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
            {TRACKS.map((track) => (
              <option key={track}>{track}</option>
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

        <button className="btn btn-primary mt-2 flex w-full justify-center" onClick={submit}>
          Submit Application →
        </button>
      </WindowCard>
    </div>
  );
}
