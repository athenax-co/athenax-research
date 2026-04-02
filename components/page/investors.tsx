import Link from "next/link";
import { SEED_INVESTORS, SEED_LAUNCHES } from "@/data/seed";
import WindowCard from "../ui/WindowCard";

const InvestorsPage = () => {
  const stats = [
    { label: "Terminal Subscribers", value: SEED_INVESTORS.length },
    { label: "Investor Intros Made", value: SEED_INVESTORS.reduce((sum, investor) => sum + investor.intros, 0) },
    { label: "Portfolio Launches", value: SEED_INVESTORS.reduce((sum, investor) => sum + investor.portfolio.length, 0) },
    { label: "Sectors Covered", value: new Set(SEED_INVESTORS.flatMap((investor) => investor.sectors)).size },
  ];

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/investors</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Investors</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>
          Venture investors and funds using AthenaX Terminal to discover pre-formation founders and track ARS-velocity signals before the market does.
        </p>
        <hr className="divider" />
        <div className="grid-4" style={{ gap: 14, marginBottom: 32 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ fontSize: 20 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
        <div className="grid-2" style={{ gap: 22, marginBottom: 22 }}>
          {SEED_INVESTORS.map((investor) => (
            <WindowCard key={investor.id} label={`INVESTOR: ${investor.name.split(" ")[0].toUpperCase()}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 19, marginBottom: 4 }}>{investor.name}</h3>
                  <span className="ftag">{investor.type}</span>
                  {investor.terminalSub && (
                    <span className="ftag" style={{ background: "#F5D94E", marginLeft: 6 }}>
                      Terminal Subscriber
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#E8323C" }}>{investor.aum}</div>
                  <div style={{ fontSize: 11, color: "#6B6B7A" }}>AUM</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 12 }}>{investor.focus}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {investor.sectors.map((sector) => (
                  <span key={sector} className="topic-pill" style={{ fontSize: 10, padding: "2px 8px" }}>
                    {sector}
                  </span>
                ))}
              </div>
              <hr className="divider-sm" />
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 8 }}>
                PORTFOLIO LAUNCHES
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {investor.portfolio.map((name) => {
                  const launch = SEED_LAUNCHES.find((entry) => entry.name === name);
                  return launch ? (
                    <Link
                      key={name}
                      href={`/launch/${launch.id}`}
                      className="ftag"
                      style={{ cursor: "pointer", border: "1.5px solid #1C1C27", textDecoration: "none", color: "inherit" }}
                    >
                      {name} ↗
                    </Link>
                  ) : (
                    <span key={name} className="ftag">
                      {name}
                    </span>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "#6B6B7A", fontFamily: "'Space Mono',monospace" }}>
                {investor.intros} founder intros via AthenaX
              </div>
            </WindowCard>
          ))}
        </div>
        <WindowCard label="TERMINAL_ACCESS.SYS" bodyClass="window-body window-body-yellow">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Join as an Investor</h3>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, maxWidth: 480 }}>
                Subscribe to AthenaX Terminal to track ARS velocity signals, get alerts when founders you follow launch products, and access the full
                citation graph across frontier research.
              </p>
            </div>
            <Link href="/terminal" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Open Terminal →
            </Link>
          </div>
        </WindowCard>
      </div>
    </div>
  );
};

export default InvestorsPage;
