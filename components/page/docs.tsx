"use client";
import Link from "next/link";
import { DOCS_NAV, DocSection, DocsShell, DocStep } from "../ui/Docs";

const DocsHomePage = () => (
  <DocsShell current="docs" title="Documentation" subtitle="Everything you need to know about AthenaX." fileTag="/root/docs">
    <DocSection title="What is AthenaX?">
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1C1C27", marginBottom: 14 }}>
        AthenaX is a research coordination network that connects academic researchers, protocol sponsors, and builders in a single flywheel. Research
        gets funded. Ideas get built. Protocols get credibility.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["Researchers", "Protocol Sponsors", "Builders"].map((a) => (
          <span key={a} className="ftag">
            {a}
          </span>
        ))}
      </div>
    </DocSection>
    <DocSection title="Quick Start">
      <DocStep n={1} title="Choose your role" desc="Are you a researcher, protocol sponsor, or builder? Each has a different onboarding path." />
      <DocStep n={2} title="Create an account" desc="Sign up and verify your affiliation — university, lab, or protocol." />
      <DocStep n={3} title="Start contributing" desc="Submit papers, apply for bounties, or join a cohort." />
      <DocStep n={4} title="Build reputation" desc="Your ARS score grows with each paper, review, citation, and bounty completion." />
    </DocSection>
    <DocSection title="Explore Docs">
      <div className="grid-2" style={{ gap: 14 }}>
        {DOCS_NAV.slice(1).map((d) => (
          <Link key={d.id} href={`/${d.id}`} className="archive-row" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            <div className="archive-title" style={{ fontSize: 14 }}>
              {d.label}
            </div>
          </Link>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

export default DocsHomePage;
