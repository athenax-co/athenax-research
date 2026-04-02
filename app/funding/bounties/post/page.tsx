"use client";

import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

const TOPICS = ["ZK Proofs", "DAO Governance", "DeFi", "Tokenomics", "AI Agents", "Protocol Economics", "Security", "Digital Nations"] as const;

export default function Page() {
  const { user, showToast } = useGlobal();
  const [form, setForm] = useState({ title: "", sponsor: "", reward: "", deadline: "", topic: "ZK Proofs" });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = () => {
    if (!user || user.role !== "sponsor") {
      showToast("Only sponsors can post bounties.", "error");
      return;
    }

    if (!form.title || !form.reward) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    showToast("Bounty posted! (Demo — not persisted)", "success");
  };

  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/bounties/post</div>
        <h1 className="mb-2 text-[42px]">Post a Bounty</h1>
        <p className="mb-0 text-base text-muted">Sponsors only. Define a research challenge and reward.</p>

        <hr className="divider" />

        <WindowCard label="NEW_BOUNTY.FORM">
          <div className="inp-group">
            <label className="inp-label">Bounty Title</label>
            <input className="inp" value={form.title} onChange={set("title")} placeholder="ZK proof optimization for…" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Sponsor Name</label>
            <input className="inp" value={form.sponsor} onChange={set("sponsor")} placeholder="Your protocol name" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Reward (USD)</label>
            <input className="inp" value={form.reward} onChange={set("reward")} placeholder="$25,000" />
          </div>

          <div className="inp-group">
            <label className="inp-label">Deadline</label>
            <input className="inp" type="date" value={form.deadline} onChange={set("deadline")} />
          </div>

          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {TOPICS.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary mt-2 flex w-full justify-center" onClick={submit}>
            Post Bounty →
          </button>
        </WindowCard>
      </div>
    </div>
  );
}
