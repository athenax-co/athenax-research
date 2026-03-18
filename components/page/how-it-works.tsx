// ═══════════════════════════════════════════════════════════
// HOW IT WORKS

import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const HowItWorksPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/how-it-works</div>
      <h1 style={{ fontSize: 48, marginBottom: 12 }}>How AthenaX Works</h1>
      <p style={{ fontSize: 18, color: "#6B6B7A", maxWidth: 640, lineHeight: 1.6, marginBottom: 0 }}>
        AthenaX is the coordination layer between academic research and protocol ecosystem development. Ideas enter as papers and exit as protocols,
        products, and companies.
      </p>
      <hr className="divider" />

      <div className="grid-2" style={{ gap: 22, marginBottom: 44 }}>
        {[
          {
            step: "01",
            label: "RESEARCH",
            title: "Academic Research",
            desc: "Researchers submit papers through the AthenaX network. Labs produce open-access research, funded by protocol sponsors and AthenaX grants.",
          },
          {
            step: "02",
            label: "VALIDATE",
            title: "Peer Review + ARS",
            desc: "Papers undergo peer review. The AthenaX Reputation Score (ARS) is computed from citations, downloads, reviews, votes, endorsements, and bounty completions.",
          },
          {
            step: "03",
            label: "FUND",
            title: "Protocol Funding",
            desc: "Sponsors post bounties. Protocols fund specific research tracks. Grants flow directly to validated researchers and labs.",
          },
          {
            step: "04",
            label: "BUILD",
            title: "Builder Cohorts",
            desc: "Top research enters Builder Cohorts — structured programs where developers turn validated ideas into protocol-ready products.",
          },
          {
            step: "05",
            label: "LAUNCH",
            title: "Ecosystem Impact",
            desc: "Cohort graduates launch with distribution, community, and backing. Research becomes infrastructure. Ideas become protocols.",
          },
          {
            step: "06",
            label: "REPEAT",
            title: "Flywheel",
            desc: "New protocols become sponsors. Researchers get reputation. The network compounds. Every cycle makes the next one stronger.",
          },
        ].map((s) => (
          <WindowCard key={s.step} label={`>_ STEP_${s.step}: ${s.label}`}>
            <h3 style={{ fontSize: 20, marginBottom: 10 }}>{s.title}</h3>
            <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6 }}>{s.desc}</p>
          </WindowCard>
        ))}
      </div>

      <WindowCard label="FLYWHEEL.SYS" bodyClass="window-body window-body-yellow">
        <h3 style={{ fontSize: 22, marginBottom: 16 }}>The AthenaX Flywheel</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          {[
            "Research Submitted",
            "Peer Reviewed",
            "ARS Computed",
            "Sponsor Matched",
            "Bounty Funded",
            "Builder Cohort",
            "Protocol Launched",
            "New Sponsor Joins",
          ].map((s, i) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="ftag">{s}</span>
              {i < 7 && <span style={{ color: "#6B6B7A" }}>→</span>}
            </span>
          ))}
        </div>
      </WindowCard>
    </div>
    <Footer setPage={setPage} />
  </div>
);

export default HowItWorksPage;
