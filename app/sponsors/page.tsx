import Link from "next/link";
import { SEED_SPONSORS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";

const ROI_STATS = [
  { label: "Avg. Paper Downloads", value: "3,200", sub: "per sponsored paper" },
  { label: "Avg. Citations (12mo)", value: "84", sub: "across indexed papers" },
  { label: "Researcher Reach", value: "1,847", sub: "active network members" },
] as const;

const ROI_BENEFITS = [
  "Open-access papers under your brand",
  "ARS-verified researcher talent",
  "Real-time citation & download metrics",
  "Cohort co-branding",
  "Talent pipeline access",
  "Protocol Briefing newsletter spotlight",
] as const;

export default function Page() {
  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/network/sponsors</div>
      <h1 className="mb-2 text-5xl">Protocol Sponsors</h1>
      <p className="text-[17px] text-muted">Protocols funding the research that shapes their ecosystems.</p>

      <hr className="divider" />

      <div className="mb-11 grid grid-cols-1 gap-5.5 lg:grid-cols-2">
        {SEED_SPONSORS.map((sponsor) => (
          <WindowCard key={sponsor.name} label={`SPONSOR: ${sponsor.ticker}`}>
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-1 text-xl">{sponsor.name}</h3>
                <span className="ftag">{sponsor.category}</span>
              </div>

              <div className="text-right">
                <div className="text-[22px] font-bold text-danger">{sponsor.amount}</div>
                <div className="text-xs text-muted">{sponsor.programs} programs</div>
              </div>
            </div>

            <hr className="divider-sm" />
            <p className="text-sm leading-7 text-muted">{sponsor.why}</p>
          </WindowCard>
        ))}
      </div>

      <WindowCard label="SPONSOR_ROI.SYS" bodyClass="window-body window-body-blue" style={{ marginBottom: 22 }}>
        <h3 className="mb-4 text-[22px]">What Sponsors Get</h3>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROI_STATS.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value text-[22px]">{stat.value}</div>
              <div className="stat-sub">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {ROI_BENEFITS.map((benefit) => (
            <span key={benefit} className="ftag text-xs">
              ✓ {benefit}
            </span>
          ))}
        </div>
      </WindowCard>

      <WindowCard label="BECOME_SPONSOR.SYS" bodyClass="window-body window-body-yellow">
        <h3 className="mb-3 text-2xl">Ready to Sponsor?</h3>
        <p className="mb-5 text-[15px] leading-7 text-muted">
          Pilots start at $20K. Full research tracks from $100K. Cohort sponsorship from $250K. We&apos;ll match you to the right researchers within
          two weeks.
        </p>

        <Link className="btn btn-primary" href="/sponsors/apply">
          Start a Conversation →
        </Link>
      </WindowCard>
    </div>
  );
}
