import Link from "next/link";
import { SEED_INVESTORS, SEED_LAUNCHES } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";

export default function Page() {
  const stats = [
    { label: "Terminal Subscribers", value: SEED_INVESTORS.length },
    { label: "Investor Intros Made", value: SEED_INVESTORS.reduce((sum, investor) => sum + investor.intros, 0) },
    { label: "Portfolio Launches", value: SEED_INVESTORS.reduce((sum, investor) => sum + investor.portfolio.length, 0) },
    { label: "Sectors Covered", value: new Set(SEED_INVESTORS.flatMap((investor) => investor.sectors)).size },
  ];

  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/investors</div>
      <h1 className="mb-2 text-5xl">Investors</h1>
      <p className="text-[17px] text-muted">
        Venture investors and funds using AthenaX Terminal to discover pre-formation founders and track ARS-velocity signals before the market does.
      </p>

      <hr className="divider" />

      <div className="mb-8 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value text-xl">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5.5 lg:grid-cols-2">
        {SEED_INVESTORS.map((investor) => (
          <WindowCard key={investor.id} label={`INVESTOR: ${investor.name.split(" ")[0].toUpperCase()}`}>
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <h3 className="mb-1 text-[19px]">{investor.name}</h3>
                <span className="ftag">{investor.type}</span>
                {investor.terminalSub && <span className="ftag ml-1.5 bg-yellow">Terminal Subscriber</span>}
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[18px] font-bold text-danger">{investor.aum}</div>
                <div className="text-[11px] text-muted">AUM</div>
              </div>
            </div>

            <p className="mb-3 text-[13px] leading-7 text-muted">{investor.focus}</p>

            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {investor.sectors.map((sector) => (
                <span key={sector} className="topic-pill px-2 py-0.5 text-[10px]">
                  {sector}
                </span>
              ))}
            </div>

            <hr className="divider-sm" />

            <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-muted">PORTFOLIO LAUNCHES</div>
            <div className="flex flex-wrap gap-2">
              {investor.portfolio.map((name) => {
                const launch = SEED_LAUNCHES.find((entry) => entry.name === name);
                return launch ? (
                  <Link key={name} href={`/launch/${launch.id}`} className="ftag border border-ink text-inherit no-underline">
                    {name} ↗
                  </Link>
                ) : (
                  <span key={name} className="ftag">
                    {name}
                  </span>
                );
              })}
            </div>

            <div className="mt-2.5 font-mono text-xs text-muted">{investor.intros} founder intros via AthenaX</div>
          </WindowCard>
        ))}
      </div>

      <WindowCard label="TERMINAL_ACCESS.SYS" bodyClass="window-body window-body-yellow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="mb-1.5 text-[20px]">Join as an Investor</h3>
            <p className="max-w-120 text-sm leading-7 text-muted">
              Subscribe to AthenaX Terminal to track ARS velocity signals, get alerts when founders you follow launch products, and access the full
              citation graph across frontier research.
            </p>
          </div>

          <Link href="/terminal" className="btn btn-primary no-underline">
            Open Terminal →
          </Link>
        </div>
      </WindowCard>
    </div>
  );
}
