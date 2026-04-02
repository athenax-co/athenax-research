import WindowCard from "@/components/ui/WindowCard";

const REVENUE_STATS = [
  { label: "Year 1", value: "$1.84M" },
  { label: "Year 2", value: "$6.18M" },
  { label: "Year 3", value: "$18.6M" },
  { label: "CAGR", value: "218%" },
] as const;

const ECONOMICS_STATS = [
  { label: "Gross Margin", value: "78%" },
  { label: "EBITDA (Y3)", value: "48%" },
  { label: "Break-even", value: "Mo. 26" },
  { label: "EBITDA+", value: "Mo. 22" },
] as const;

const FUNDRAISE_ROUNDS = [
  { round: "Seed", amount: "$3M", use: "MVP + first 6 researchers + 2 sponsor pilots" },
  { round: "Series A", amount: "$12M", use: "Scale network, 3 regional hubs, full Terminal product" },
  { round: "Series B", amount: "$35–50M", use: "Global expansion, startup fund, protocol acquisitions" },
] as const;

const TARGET_INVESTORS = ["Paradigm", "a16z crypto", "Multicoin", "Electric Capital", "PL Ventures", "Variant Fund", "Delphi Digital"] as const;

export default function Page() {
  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/business-model</div>
      <h1 className="mb-2 text-5xl">Business Model</h1>
      <p className="text-[17px] text-muted">How AthenaX sustains itself and the network it powers.</p>

      <hr className="divider" />

      <div className="mb-11 grid grid-cols-1 gap-5.5 lg:grid-cols-2">
        <WindowCard label="REVENUE.SYS" bodyClass="window-body window-body-yellow">
          <h3 className="mb-4.5 text-[22px]">Revenue Projections</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {REVENUE_STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value text-xl">{stat.value}</div>
              </div>
            ))}
          </div>
        </WindowCard>

        <WindowCard label="MARGINS.SYS">
          <h3 className="mb-4.5 text-[22px]">Unit Economics</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ECONOMICS_STATS.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value text-xl">{stat.value}</div>
              </div>
            ))}
          </div>
        </WindowCard>
      </div>

      <WindowCard label="FUNDRAISE.SYS" bodyClass="window-body window-body-blue">
        <h3 className="mb-4 text-[22px]">Fundraising Roadmap</h3>
        <div className="flex flex-wrap gap-4">
          {FUNDRAISE_ROUNDS.map((round) => (
            <div key={round.round} className="min-w-50 flex-1 rounded-[10px] border-2 border-ink bg-white p-4">
              <div className="mb-1 font-mono text-[10px] tracking-[0.07em] text-muted">{round.round.toUpperCase()}</div>
              <div className="mb-1.5 text-2xl font-bold text-danger">{round.amount}</div>
              <div className="text-[13px] leading-5 text-muted">{round.use}</div>
            </div>
          ))}
        </div>
      </WindowCard>

      <div className="mt-5.5">
        <WindowCard label="INVESTOR_TARGETS.SYS">
          <h3 className="mb-3.5 text-xl">Target Investors</h3>
          <div className="flex flex-wrap gap-2">
            {TARGET_INVESTORS.map((investor) => (
              <span key={investor} className="ftag">
                {investor}
              </span>
            ))}
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
