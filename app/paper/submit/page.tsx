"use client";

import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

const TOPICS = [
  "ZK Proofs",
  "DAO Governance",
  "DeFi",
  "Tokenomics",
  "AI Agents",
  "Protocol Economics",
  "Security",
  "Digital Nations",
  "Consensus",
  "Privacy",
] as const;

export default function Page() {
  const { user, showToast } = useGlobal();
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    topic: "ZK Proofs",
    coauthors: "",
    university: user?.university || "",
    lab: user?.lab || "",
    year: new Date().getFullYear(),
    file: "",
  });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = () => {
    if (!user) {
      showToast("Sign in to submit a paper.", "error");
      return;
    }

    if (!form.title || !form.abstract) {
      showToast("Title and abstract are required.", "error");
      return;
    }

    showToast("Paper submitted for peer review! You'll hear back within 14 days.", "success");
  };

  if (!user) {
    return (
      <div>
        <div className="page-wrap section">
          <div className="path-badge">/root/paper/submit</div>
          <h1 className="mb-4 text-[42px]">Submit a Paper</h1>
          <p className="mb-6 text-[17px] text-muted">You need to be signed in as a researcher to submit.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-wrap page-wrap-narrow-md section">
        <div className="path-badge">/root/paper/submit</div>
        <h1 className="mb-2 text-[42px]">Submit a Paper</h1>
        <p className="mb-0 text-base text-muted">Open-access. Peer-reviewed. ARS-scored on acceptance.</p>

        <hr className="divider" />

        <WindowCard label="PAPER_SUBMISSION.FORM">
          <div className="inp-group">
            <label className="inp-label">Paper Title *</label>
            <input className="inp" value={form.title} onChange={set("title")} placeholder="A descriptive, full title" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Abstract *</label>
            <textarea
              className="inp"
              rows={5}
              value={form.abstract}
              onChange={set("abstract")}
              placeholder="250–500 words. Summarise the problem, method, and key findings."
            />
          </div>

          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {TOPICS.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="grid-2 gap-4">
            <div className="inp-group">
              <label className="inp-label">University / Institution</label>
              <input className="inp" value={form.university} onChange={set("university")} placeholder="MIT, Oxford…" />
            </div>
            <div className="inp-group">
              <label className="inp-label">Research Lab</label>
              <input className="inp" value={form.lab} onChange={set("lab")} placeholder="Your lab or group" />
            </div>
          </div>

          <div className="inp-group">
            <label className="inp-label">Co-Authors (optional)</label>
            <input className="inp" value={form.coauthors} onChange={set("coauthors")} placeholder="Full names, comma-separated" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Publication Year</label>
            <input className="inp" type="number" value={form.year} onChange={set("year")} min="2020" max="2030" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Paper File (PDF link or arXiv URL)</label>
            <input className="inp" value={form.file} onChange={set("file")} placeholder="https://arxiv.org/abs/…" />
          </div>

          <div className="mb-4 rounded-lg border border-[#D8D4CC] bg-cream px-3.5 py-3 text-[13px] leading-7 text-muted">
            Submitted papers enter a 14-day blind peer review. Accepted papers are published open-access and immediately contribute to your ARS score.
            All work is CC0.
          </div>

          <button className="btn btn-primary flex w-full justify-center" onClick={submit}>
            Submit for Review →
          </button>
        </WindowCard>
      </div>
    </div>
  );
}
