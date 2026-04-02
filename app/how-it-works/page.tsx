import WindowCard from "@/components/ui/WindowCard";

export default function Page() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <div className="path-badge">/root/how-it-works</div>
        <h1 className="mb-3 text-5xl font-bold tracking-[-0.02em] text-ink">How AthenaX Works</h1>
        <p className="mb-0 max-w-160 text-lg leading-[1.6] text-muted">
          AthenaX is the coordination layer between academic research and protocol ecosystem development. Ideas enter as papers and exit as protocols,
          products, and companies.
        </p>
        <hr className="divider" />

        <div className="mb-11 grid gap-5.5 lg:grid-cols-2">
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
              desc: "Top research enters Builder Cohorts - structured programs where developers turn validated ideas into protocol-ready products.",
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
              <h3 className="mb-2.5 text-xl font-bold tracking-[-0.02em] text-ink">{s.title}</h3>
              <p className="text-[15px] leading-[1.6] text-muted">{s.desc}</p>
            </WindowCard>
          ))}
        </div>

        <WindowCard label="FLYWHEEL.SYS" bodyClass="window-body window-body-yellow">
          <h3 className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-ink">The AthenaX Flywheel</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
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
              <span key={s} className="flex items-center gap-2">
                <span className="ftag">{s}</span>
                {i < 7 && <span className="text-muted">-&gt;</span>}
              </span>
            ))}
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
