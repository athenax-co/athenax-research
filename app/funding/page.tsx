import Link from "next/link";
import { IconBounties, IconCohortFees, IconSponsoredPrograms, IconStartupEquity, IconTalentPlacement, IconTerminal } from "@/components/Icons";
import WindowCard from "@/components/ui/WindowCard";

const FUNDING_ICONS = {
  SPONSORED_PROGRAMS: IconSponsoredPrograms,
  BOUNTIES: IconBounties,
  COHORT_FEES: IconCohortFees,
  TERMINAL_SUBS: IconTerminal,
  TALENT_PLACEMENT: IconTalentPlacement,
  STARTUP_EQUITY: IconStartupEquity,
};

const FUNDING_STREAMS = [
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
] as const;

export default function Page() {
  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/funding</div>
      <h1 className="mb-2 text-5xl">Research Funding Engine</h1>
      <p className="text-[17px] text-muted">How money flows through AthenaX.</p>

      <hr className="divider" />

      <div className="mb-11 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FUNDING_STREAMS.map((stream) => {
          const FundingIcon = FUNDING_ICONS[stream.label];

          return (
            <WindowCard key={stream.label} label={`>_ ${stream.label}`}>
              <div className="icon-tile icon-tile-yellow">{FundingIcon && <FundingIcon />}</div>

              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="text-lg">{stream.title}</h3>
                <span className="font-mono text-base font-bold text-[#E8323C]">{stream.pct}</span>
              </div>

              <p className="text-sm leading-7 text-muted">{stream.desc}</p>
            </WindowCard>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Link className="btn btn-primary" href="/funding/bounties">
          View Bounties →
        </Link>
        <Link className="btn btn-outline" href="/business-model">
          Business Model
        </Link>
      </div>
    </div>
  );
}
