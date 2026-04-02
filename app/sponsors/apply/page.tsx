"use client";

import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

type SponsorFormState = {
  org: string;
  contact: string;
  email: string;
  model: string;
  budget: string;
  focus: string;
  why: string;
};

export default function Page() {
  const { user, showToast } = useGlobal();

  const [form, setForm] = useState<SponsorFormState>({
    org: user?.organization || "",
    contact: user?.name || "",
    email: user?.email || "",
    model: "Sponsored Program",
    budget: "",
    focus: "",
    why: "",
  });

  const set = (k: keyof SponsorFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
  };

  const submit = () => {
    if (!form.org || !form.email || !form.why) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    showToast("Sponsorship enquiry submitted! We'll be in touch within 48 hours.", "success");
  };

  return (
    <div className="section page-wrap page-wrap-narrow-sm">
      <div className="path-badge">/root/sponsors/apply</div>
      <h1 className="mb-2 text-[42px]">Become a Sponsor</h1>
      <p className="mb-0 text-base text-muted">Fund credentialed research. Get academic credibility. Access top talent.</p>

      <hr className="divider" />

      <WindowCard label="SPONSOR_ENQUIRY.FORM">
        <div className="inp-group">
          <label className="inp-label">Protocol / Organisation *</label>
          <input className="inp" value={form.org} onChange={set("org")} placeholder="e.g. Scroll, Aztec, Starknet" />
        </div>

        <div className="inp-group">
          <label className="inp-label">Contact Name *</label>
          <input className="inp" value={form.contact} onChange={set("contact")} placeholder="Your name" />
        </div>

        <div className="inp-group">
          <label className="inp-label">Email *</label>
          <input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="you@protocol.io" />
        </div>

        <div className="inp-group">
          <label className="inp-label">Funding Model</label>
          <select className="inp" value={form.model} onChange={set("model")}>
            <option>Sponsored Program</option>
            <option>Research Bounty</option>
            <option>Cohort Sponsor</option>
            <option>Pilot ($20K–50K)</option>
          </select>
        </div>

        <div className="inp-group">
          <label className="inp-label">Estimated Budget</label>
          <input className="inp" value={form.budget} onChange={set("budget")} placeholder="e.g. $50,000" />
        </div>

        <div className="inp-group">
          <label className="inp-label">Research Focus Area</label>
          <input className="inp" value={form.focus} onChange={set("focus")} placeholder="e.g. ZK proofs, DAO governance, tokenomics" />
        </div>

        <div className="inp-group">
          <label className="inp-label">Why do you want to sponsor research? *</label>
          <textarea
            className="inp"
            rows={3}
            value={form.why}
            onChange={set("why")}
            placeholder="What problem are you trying to solve or understand?"
          />
        </div>

        <div className="mb-4 rounded-lg border border-[#D8D4CC] bg-cream px-3.5 py-3 text-[13px] text-muted">
          Typical turnaround: 48-hour response, 2-week scoping call, 30-day pilot launch.
        </div>

        <button className="btn btn-primary flex w-full justify-center" onClick={submit}>
          Submit Enquiry →
        </button>
      </WindowCard>
    </div>
  );
}
