"use client";

import { useState } from "react";
import Link from "next/link";
import { IconBriefcaseSmall } from "@/components/Icons";
import Modal from "@/components/ui/Modal";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

type Role = {
  id: string;
  title: string;
  org: string;
  type: string;
  stipend: string;
  topic: string;
  desc: string;
};

const ROLES: Role[] = [
  {
    id: "r1",
    title: "Research Fellow",
    org: "Ethereum Foundation",
    type: "Fellowship",
    stipend: "$6K/mo",
    topic: "Protocol Economics",
    desc: "Six-month fellowship working directly with EF Research on consensus economics and validator incentive design.",
  },
  {
    id: "r2",
    title: "ZK Engineer",
    org: "EigenLayer",
    type: "Full-time",
    stipend: "$180K/yr",
    topic: "ZK Proofs",
    desc: "Build and audit ZK proof systems for EigenLayer's restaking infrastructure. Requires ARS 6.0+.",
  },
  {
    id: "r3",
    title: "DAO Governance Lead",
    org: "Arbitrum",
    type: "Contract",
    stipend: "$50K/6mo",
    topic: "DAO Governance",
    desc: "Design and implement governance improvements for Arbitrum DAO based on AthenaX-indexed research.",
  },
  {
    id: "r4",
    title: "Research Scientist",
    org: "Uniswap Foundation",
    type: "Fellowship",
    stipend: "$5K/mo",
    topic: "DeFi",
    desc: "Research MEV, cross-chain liquidity, and AMM design. Work published open-access via AthenaX.",
  },
  {
    id: "r5",
    title: "Protocol Economist",
    org: "Mantle",
    type: "Full-time",
    stipend: "$160K/yr",
    topic: "Tokenomics",
    desc: "Design tokenomics and incentive systems for Mantle's L2 ecosystem. Prior research output required.",
  },
];

const TYPES = ["All", "Fellowship", "Full-time", "Contract"] as const;

export default function Page() {
  const { user, showToast } = useGlobal();
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");
  const [applying, setApplying] = useState<Role | null>(null);
  const [applyNote, setApplyNote] = useState("");
  const [openToWork, setOpenToWork] = useState(user?.openToWork || false);

  const filtered = filter === "All" ? ROLES : ROLES.filter((role) => role.type === filter);

  const submitApply = () => {
    if (!applying) return;
    showToast(`Application sent for: ${applying.title}`, "success");
    setApplying(null);
    setApplyNote("");
  };

  const toggleOpenToWork = () => {
    if (!user) {
      showToast("Sign in to set your availability.", "error");
      return;
    }

    const next = !openToWork;
    setOpenToWork(next);
    showToast(next ? "You're now visible to protocol hiring teams." : "Removed from talent listings.", "success");
  };

  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/network/talent</div>
      <h1 className="mb-2 text-5xl">Talent Marketplace</h1>
      <p className="text-[17px] text-muted">
        Roles and fellowships for vetted researchers. Free for protocol sponsors and AthenaX-incubated startups. External companies pay a placement
        fee on first-year compensation.
      </p>

      <hr className="divider" />

      {user?.role === "researcher" && (
        <WindowCard label="AVAILABILITY.SYS" bodyClass="window-body window-body-blue" className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="mb-1 text-[17px]">Open to Opportunities</h3>
              <p className="text-sm text-muted">When enabled, protocol teams can see your profile in talent searches.</p>
            </div>
            <button className={openToWork ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} onClick={toggleOpenToWork}>
              {openToWork ? "✓ Available — Turn Off" : "Set as Available →"}
            </button>
          </div>
        </WindowCard>
      )}

      <div className="mb-7 flex flex-wrap gap-2">
        {TYPES.map((type) => (
          <button
            key={type}
            className={filter === type ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4.5">
        {filtered.map((role) => (
          <div key={role.id} className="archive-row cursor-default flex-col items-start">
            <div className="flex w-full items-start gap-3.5">
              <div className="archive-icon shrink-0 bg-[#eaf0f6]">
                <IconBriefcaseSmall />
              </div>
              <div className="flex-1">
                <div className="archive-title">{role.title}</div>
                <div className="archive-meta">
                  {role.org} &nbsp;//&nbsp; {role.type} &nbsp;//&nbsp; {role.topic}
                </div>
                <p className="mt-1.5 text-[13px] leading-6 text-muted">{role.desc}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="mb-2 text-[15px] font-bold text-[#15803D]">{role.stipend}</div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (!user) {
                      showToast("Sign in to apply.", "error");
                      return;
                    }
                    setApplying(role);
                  }}
                >
                  Apply →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-11">
        <WindowCard label="POST_ROLE.SYS" bodyClass="window-body window-body-yellow">
          <h3 className="mb-2.5 text-[22px]">Hiring a Researcher?</h3>
          <p className="mb-1 text-[15px] leading-7 text-muted">
            Post a role and reach ARS-verified researchers directly. Free for active protocol sponsors and AthenaX-incubated startups. External
            companies pay a placement fee on successful hire.
          </p>
          <p className="mb-4.5 text-[13px] text-muted">Average time-to-hire: 3 weeks. All candidates are ARS-scored.</p>
          <Link className="btn btn-primary no-underline" href="/sponsors/apply">
            Post a Role →
          </Link>
        </WindowCard>
      </div>

      {applying && (
        <Modal
          title={`APPLY: ${applying.title.toUpperCase()}`}
          onClose={() => {
            setApplying(null);
            setApplyNote("");
          }}
        >
          <div className="mb-4">
            <div className="mb-1 text-[15px] font-semibold">{applying.title}</div>
            <div className="mb-3 text-[13px] text-muted">
              {applying.org} · {applying.type} · {applying.stipend}
            </div>
            <p className="text-sm leading-6 text-muted">{applying.desc}</p>
          </div>

          <hr className="divider-sm" />

          <div className="inp-group">
            <label className="inp-label">Cover Note</label>
            <textarea
              className="inp"
              rows={4}
              value={applyNote}
              onChange={(event) => setApplyNote(event.target.value)}
              placeholder="Briefly describe your research background and why you're a fit…"
            />
          </div>

          <div className="mb-3.5 text-xs text-muted">Your ARS score and published papers will be shared automatically with {applying.org}.</div>

          <button className="btn btn-primary flex w-full justify-center" onClick={submitApply}>
            Submit Application →
          </button>
        </Modal>
      )}
    </div>
  );
}
