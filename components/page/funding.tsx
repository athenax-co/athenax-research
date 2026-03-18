// ═══════════════════════════════════════════════════════════
// FUNDING PAGE

import Footer from "../Footer";
import { IconBounties, IconCohortFees, IconSponsoredPrograms, IconStartupEquity, IconTalentPlacement, IconTerminal } from "../Icons";
import WindowCard from "../ui/WindowCard";

// Funding page icon lookup — maps label key → icon component
const FUNDING_ICONS = {
  SPONSORED_PROGRAMS: IconSponsoredPrograms,
  BOUNTIES: IconBounties,
  COHORT_FEES: IconCohortFees,
  TERMINAL_SUBS: IconTerminal,
  TALENT_PLACEMENT: IconTalentPlacement,
  STARTUP_EQUITY: IconStartupEquity,
};

// ═══════════════════════════════════════════════════════════
const FundingPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/funding</div>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Research Funding Engine</h1>
      <p style={{ fontSize: 17, color: "#6B6B7A" }}>How money flows through AthenaX.</p>
      <hr className="divider" />
      <div className="grid-3" style={{ gap: 20, marginBottom: 44 }}>
        {[
          {
            label: "SPONSORED_PROGRAMS",
            title: "Sponsored Programs",
            pct: "45%",
            desc: "Protocols fund multi-month research tracks. Researchers get grants. Papers get published. Both win.",
          },
          {
            label: "BOUNTIES",
            title: "Research Bounties",
            pct: "25%",
            desc: "One-off challenges posted by sponsors. Open to all ARS-verified researchers. Fast capital for fast ideas.",
          },
          {
            label: "COHORT_FEES",
            title: "Builder Cohort Fees",
            pct: "15%",
            desc: "Sponsors pay to participate in Builder Cohorts. Access to pre-vetted research and builder talent.",
          },
          {
            label: "TERMINAL_SUBS",
            title: "Terminal Subscriptions",
            pct: "10%",
            desc: "VCs and protocol BD teams subscribe for access to the Research Terminal and private digests.",
          },
          {
            label: "TALENT_PLACEMENT",
            title: "Talent Placement",
            pct: "3%",
            desc: "Fee when researchers are placed in protocol roles via the Talent Marketplace.",
          },
          {
            label: "STARTUP_EQUITY",
            title: "Startup Equity",
            pct: "5–8%",
            desc: "AthenaX takes a 5–8% equity stake in cohort-incubated startups. Long-term upside aligned with the network.",
          },
        ].map((s) => {
          const FundingIcon = FUNDING_ICONS[s.label as keyof typeof FUNDING_ICONS];
          return (
            <WindowCard key={s.label} label={`>_ ${s.label}`}>
              <div className="icon-tile icon-tile-yellow">{FundingIcon && <FundingIcon />}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ fontSize: 18 }}>{s.title}</h3>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: "#E8323C" }}>{s.pct}</span>
              </div>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6 }}>{s.desc}</p>
            </WindowCard>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => setPage("bounties")}>
          View Bounties →
        </button>
        <button className="btn btn-outline" onClick={() => setPage("business-model")}>
          Business Model
        </button>
      </div>
    </div>
    <Footer setPage={setPage} />
  </div>
);

export default FundingPage;
