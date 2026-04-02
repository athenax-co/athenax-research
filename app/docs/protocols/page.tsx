import { DocSection, DocStep } from "@/components/ui/Docs";

export default function Page() {
  return (
    <>
      <DocSection title="How Protocols Participate">
        <p className="mb-4 text-[15px] leading-[1.7] text-[#1C1C27]">
          Protocols fund research tracks, post bounties, sponsor cohorts, and access the Research Terminal. You get credentialed academic work on your
          protocol's specific research needs.
        </p>
        <DocStep n={1} title="Choose a funding model" desc="Sponsored programs, one-off bounties, or cohort sponsorship. Mix and match." />
        <DocStep n={2} title="Define research scope" desc="Work with AthenaX to design a research track that addresses your protocol's needs." />
        <DocStep n={3} title="Fund and monitor" desc="Track paper progress, ARS scores, and download metrics in real time." />
        <DocStep
          n={4}
          title="Receive deliverables"
          desc="Open-access papers published under your protocol's sponsorship. Real academic credibility."
        />
      </DocSection>

      <DocSection title="Pricing">
        <div className="grid gap-3.5 md:grid-cols-3">
          {[
            { name: "Pilot", price: "$20K–50K", desc: "90-day research pilot. One topic. 3–5 researchers." },
            { name: "Track", price: "$100K–300K", desc: "6-month full research track. Lab partnership." },
            { name: "Cohort Sponsor", price: "$250K+", desc: "Co-brand an entire Builder Cohort cycle." },
          ].map((item) => (
            <div key={item.name} className="stat-card">
              <div className="stat-label">{item.name}</div>
              <div className="mb-1.5 text-[20px] font-bold text-[#E8323C]">{item.price}</div>
              <div className="text-[13px] text-muted">{item.desc}</div>
            </div>
          ))}
        </div>
      </DocSection>
    </>
  );
}
