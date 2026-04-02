import Link from "next/link";
import { SEED_LAUNCHES } from "@/data/seed";
import WindowCard from "../ui/WindowCard";

const parseMillions = (value: string) => {
  const match = value.match(/\$([\d.]+)\s*([MK]?)/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2]?.toUpperCase();
  if (unit === "K") return amount / 1000;
  return amount;
};

const FoundersPage = () => {
  const founders = SEED_LAUNCHES.map((launch) => ({
    launch,
    founders: launch.founders,
    totalARS: launch.founders.reduce((sum, founder) => sum + founder.ars, 0) / launch.founders.length,
  })).sort((a, b) => b.totalARS - a.totalARS);

  const stats = [
    { label: "Founders on Platform", value: SEED_LAUNCHES.reduce((sum, launch) => sum + launch.founders.length, 0) },
    { label: "Total Funding Raised", value: `$${SEED_LAUNCHES.reduce((sum, launch) => sum + parseMillions(launch.funding), 0).toFixed(1)}M` },
    {
      label: "Avg. Founder ARS",
      value: (
        SEED_LAUNCHES.reduce(
          (sum, launch) => sum + launch.founders.reduce((founderTotal, founder) => founderTotal + founder.ars, 0) / launch.founders.length,
          0
        ) / SEED_LAUNCHES.length
      ).toFixed(1),
    },
    { label: "Sectors Represented", value: new Set(SEED_LAUNCHES.map((launch) => launch.sector)).size },
  ];

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/founders</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Founders</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>
          Research-backed founders who have launched products on AthenaX. Every founder is ARS-scored. Every product is grounded in indexed
          research.
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
        <WindowCard label="FOUNDER_DIRECTORY.SYS">
          {founders.map(({ launch, founders: founderList, totalARS }) => (
            <Link
              key={launch.id}
              href={`/launch/${launch.id}`}
              className="lb-row"
              style={{ cursor: "pointer", padding: "16px 18px", textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: "1.5px solid #1C1C27",
                  background: "#F9F5DC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              >
                {launch.name.charAt(0)}
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div className="lb-name">{founderList.map((founder) => founder.name).join(", ")}</div>
                  <span className="topic-pill" style={{ fontSize: 10, padding: "2px 8px" }}>
                    {launch.sector}
                  </span>
                  <span className="ftag" style={{ background: launch.stage === "Seed" ? "#D4EDDA" : "#EAF0F6", fontSize: 10 }}>
                    {launch.stage}
                  </span>
                </div>
                <div className="lb-meta">
                  {launch.name} · {launch.category} · {launch.funding}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  {founderList.map((founder) => (
                    <span key={founder.name} style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#6B6B7A" }}>
                      {founder.lab}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: "#E8323C" }}>ARS {totalARS.toFixed(1)}</div>
                <div style={{ fontSize: 11, color: "#6B6B7A", marginTop: 2 }}>avg score</div>
                <div style={{ fontSize: 11, color: "#6B6B7A", marginTop: 2 }}>▲ {launch.votes.toLocaleString()} votes</div>
              </div>
            </Link>
          ))}
        </WindowCard>
        <div style={{ marginTop: 22 }}>
          <WindowCard label="ARE_YOU_A_FOUNDER.SYS" bodyClass="window-body window-body-yellow">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, marginBottom: 6 }}>Launch Your Product on AthenaX</h3>
                <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6 }}>
                  ARS-scored researchers and cohort graduates can list research-backed products. Premier launches get investor intro blasts to 30+
                  Terminal subscribers.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                <Link href="/launch" className="btn btn-primary" style={{ textDecoration: "none" }}>
                  Browse Launches →
                </Link>
                <Link href="/apply-cohort" className="btn btn-outline" style={{ textDecoration: "none" }}>
                  Apply to Cohort
                </Link>
              </div>
            </div>
          </WindowCard>
        </div>
      </div>
    </div>
  );
};

export default FoundersPage;
