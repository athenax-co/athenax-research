import { useState } from "react";
import Footer from "../Footer";
import { IconBriefcaseSmall } from "../Icons";
import Modal from "../ui/Modal";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
// TALENT PAGE
// ═══════════════════════════════════════════════════════════

type Role = {
  id: string;
  title: string;
  org: string;
  type: string;
  stipend: string;
  topic: string;
  desc: string;
};

const TalentPage = ({
  setPage,
  user,
  showToast,
}: {
  setPage: (page: string) => void;
  user: any;
  showToast: (text: string, type: string) => void;
}) => {
  const roles: Role[] = [
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
  const types = ["All", "Fellowship", "Full-time", "Contract"];
  const [filter, setFilter] = useState("All");
  const [applying, setApplying] = useState<Role | null>(null);
  const [applyNote, setApplyNote] = useState("");
  const [openToWork, setOpenToWork] = useState(user?.openToWork || false);

  const filtered = filter === "All" ? roles : roles.filter((r) => r.type === filter);

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
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/network/talent</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Talent Marketplace</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>
          Roles and fellowships for vetted researchers. Free for protocol sponsors and AthenaX-incubated startups. External companies pay a placement
          fee on first-year compensation.
        </p>
        <hr className="divider" />

        {/* Open-to-work toggle for researchers */}
        {user?.role === "researcher" && (
          <WindowCard label="AVAILABILITY.SYS" bodyClass="window-body window-body-blue" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 17, marginBottom: 4 }}>Open to Opportunities</h3>
                <p style={{ fontSize: 14, color: "#6B6B7A" }}>When enabled, protocol teams can see your profile in talent searches.</p>
              </div>
              <button className={openToWork ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm"} onClick={toggleOpenToWork}>
                {openToWork ? "✓ Available — Turn Off" : "Set as Available →"}
              </button>
            </div>
          </WindowCard>
        )}

        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {types.map((t) => (
            <button
              key={t}
              className={filter === t ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={filter === t ? { background: "#F5D94E" } : {}}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.map((r) => (
          <div key={r.id} className="archive-row" style={{ flexDirection: "column", alignItems: "flex-start", cursor: "default" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, width: "100%" }}>
              <div className="archive-icon" style={{ background: "#EAF0F6", flexShrink: 0 }}>
                <IconBriefcaseSmall />
              </div>
              <div style={{ flex: 1 }}>
                <div className="archive-title">{r.title}</div>
                <div className="archive-meta">
                  {r.org} &nbsp;//&nbsp; {r.type} &nbsp;//&nbsp; {r.topic}
                </div>
                <p style={{ fontSize: 13, color: "#6B6B7A", marginTop: 6, lineHeight: 1.5 }}>{r.desc}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#15803D", marginBottom: 8 }}>{r.stipend}</div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (!user) {
                      showToast("Sign in to apply.", "error");
                      return;
                    }
                    setApplying(r);
                  }}
                >
                  Apply →
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* For protocols */}
        <div style={{ marginTop: 44 }}>
          <WindowCard label="POST_ROLE.SYS" bodyClass="window-body window-body-yellow">
            <h3 style={{ fontSize: 22, marginBottom: 10 }}>Hiring a Researcher?</h3>
            <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 4 }}>
              Post a role and reach ARS-verified researchers directly. Free for active protocol sponsors and AthenaX-incubated startups. External
              companies pay a placement fee on successful hire.
            </p>
            <p style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 18 }}>Average time-to-hire: 3 weeks. All candidates are ARS-scored.</p>
            <button className="btn btn-primary" onClick={() => setPage("sponsor-onboarding")}>
              Post a Role →
            </button>
          </WindowCard>
        </div>
      </div>

      {/* Apply modal */}
      {applying && (
        <Modal
          title={`APPLY: ${applying.title.toUpperCase()}`}
          onClose={() => {
            setApplying(null);
            setApplyNote("");
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{applying.title}</div>
            <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 12 }}>
              {applying.org} · {applying.type} · {applying.stipend}
            </div>
            <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6 }}>{applying.desc}</p>
          </div>
          <hr className="divider-sm" />
          <div className="inp-group">
            <label className="inp-label">Cover Note</label>
            <textarea
              className="inp"
              rows={4}
              value={applyNote}
              onChange={(e) => setApplyNote(e.target.value)}
              placeholder="Briefly describe your research background and why you're a fit…"
            />
          </div>
          <div style={{ fontSize: 12, color: "#6B6B7A", marginBottom: 14 }}>
            Your ARS score and published papers will be shared automatically with {applying.org}.
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={submitApply}>
            Submit Application →
          </button>
        </Modal>
      )}

      <Footer setPage={setPage} />
    </div>
  );
};

export default TalentPage;
