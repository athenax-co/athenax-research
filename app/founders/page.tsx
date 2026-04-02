import Link from "next/link";
import { SEED_LAUNCHES } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";

const parseMillions = (value: string) => {
  const match = value.match(/\$([\d.]+)\s*([MK]?)/i);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2]?.toUpperCase();

  if (unit === "K") return amount / 1000;
  return amount;
};

export default function Page() {
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
    <div className="section page-wrap">
      <div className="path-badge">/root/founders</div>
      <h1 className="mb-2 text-5xl">Founders</h1>
      <p className="text-[17px] text-muted">
        Research-backed founders who have launched products on AthenaX. Every founder is ARS-scored. Every product is grounded in indexed research.
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

      <WindowCard label="FOUNDER_DIRECTORY.SYS">
        {founders.map(({ launch, founders: founderList, totalARS }) => (
          <Link
            key={launch.id}
            href={`/launch/${launch.id}`}
            className="lb-row flex cursor-pointer items-start px-4.5 py-4 text-inherit no-underline"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#1C1C27] bg-paper text-base font-bold">
              {launch.name.charAt(0)}
            </div>

            <div className="ml-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="lb-name">{founderList.map((founder) => founder.name).join(", ")}</div>
                <span className="topic-pill px-2 py-0.5 text-[10px]">{launch.sector}</span>
                <span className={`ftag text-[10px] ${launch.stage === "Seed" ? "bg-success" : "bg-[#EAF0F6]"}`}>{launch.stage}</span>
              </div>

              <div className="lb-meta">
                {launch.name} · {launch.category} · {launch.funding}
              </div>

              <div className="mt-1 flex flex-wrap gap-1.5">
                {founderList.map((founder) => (
                  <span key={founder.name} className="font-mono text-[11px] text-muted">
                    {founder.lab}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="font-mono text-sm font-bold text-[#E8323C]">ARS {totalARS.toFixed(1)}</div>
              <div className="mt-0.5 text-[11px] text-muted">avg score</div>
              <div className="mt-0.5 text-[11px] text-muted">▲ {launch.votes.toLocaleString()} votes</div>
            </div>
          </Link>
        ))}
      </WindowCard>

      <div className="mt-5.5">
        <WindowCard label="ARE_YOU_A_FOUNDER.SYS" bodyClass="window-body window-body-yellow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="mb-1.5 text-xl">Launch Your Product on AthenaX</h3>
              <p className="max-w-2xl text-sm leading-7 text-muted">
                ARS-scored researchers and cohort graduates can list research-backed products. Premier launches get investor intro blasts to 30+
                Terminal subscribers.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2">
              <Link href="/launch" className="btn btn-primary no-underline">
                Browse Launches →
              </Link>
              <Link href="/cohort/apply" className="btn btn-outline no-underline">
                Apply to Cohort
              </Link>
            </div>
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
