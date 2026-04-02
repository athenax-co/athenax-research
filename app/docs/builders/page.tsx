import { DocSection, DocStep } from "@/components/ui/Docs";

export default function Page() {
  return (
    <>
      <DocSection title="The Builder Pipeline">
        <p className="mb-4 text-[15px] leading-[1.7] text-[#1C1C27]">
          Builders take validated research from the AthenaX archive and turn it into protocol-ready products. Each cohort runs 12 weeks with
          structured support, sponsor access, and prize pools.
        </p>
        <DocStep n={1} title="Browse Research" desc="Find validated papers with high ARS scores in your technical area." />
        <DocStep n={2} title="Apply to a Cohort" desc="Submit a product concept based on existing AthenaX research." />
        <DocStep n={3} title="Build in public" desc="12-week intensive. Weekly demos. Sponsor feedback." />
        <DocStep n={4} title="Launch" desc="Graduate with distribution, funding, and community." />
      </DocSection>

      <DocSection title="What You Get">
        <div className="flex flex-wrap gap-2">
          {[
            "$20K stipend",
            "Protocol introductions",
            "Legal wrapper",
            "Community distribution",
            "12 weeks mentorship",
            "Pitch day",
            "Equity-free grants",
          ].map((item) => (
            <span key={item} className="ftag">
              {item}
            </span>
          ))}
        </div>
      </DocSection>
    </>
  );
}
