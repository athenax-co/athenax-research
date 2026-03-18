import { DocSection, DocsShell } from "../ui/Docs";
import WindowCard from "../ui/WindowCard";

const DocsGovernancePage = () => (
  <DocsShell current="docs-governance" title="Governance" subtitle="How decisions get made." fileTag="/root/docs/governance">
    <DocSection title="Governance Model">
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1C1C27", marginBottom: 16 }}>
        AthenaX uses an optimistic governance model inspired by NounsDAO. High-ARS researchers and verified sponsors have voting weight on protocol
        decisions.
      </p>
      <div className="grid-2" style={{ gap: 14 }}>
        {[
          { title: "Optimistic Execution", desc: "Proposals pass unless vetoed. Reduces coordination friction." },
          { title: "ARS-Weighted Voting", desc: "Voting weight is proportional to ARS score — not token holdings." },
          { title: "Sponsor Councils", desc: "Sponsors form councils with advisory rights, not veto power." },
          { title: "Builder Assembly", desc: "Cohort graduates form a builder assembly that votes on research tracks." },
        ].map((g) => (
          <WindowCard key={g.title} label={`GOV: ${g.title.toUpperCase().replace(/ /g, "_")}`}>
            <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6 }}>{g.desc}</p>
          </WindowCard>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

export default DocsGovernancePage;
