import { DocSection } from "@/components/ui/Docs";
import WindowCard from "@/components/ui/WindowCard";

export default function Page() {
  return (
    <>
      <DocSection title="Governance Model">
        <p className="mb-4 text-[15px] leading-[1.7] text-[#1C1C27]">
          AthenaX uses an optimistic governance model inspired by NounsDAO. High-ARS researchers and verified sponsors have voting weight on protocol
          decisions.
        </p>
        <div className="grid gap-3.5 md:grid-cols-2">
          {[
            { title: "Optimistic Execution", desc: "Proposals pass unless vetoed. Reduces coordination friction." },
            { title: "ARS-Weighted Voting", desc: "Voting weight is proportional to ARS score — not token holdings." },
            { title: "Sponsor Councils", desc: "Sponsors form councils with advisory rights, not veto power." },
            { title: "Builder Assembly", desc: "Cohort graduates form a builder assembly that votes on research tracks." },
          ].map((item) => (
            <WindowCard key={item.title} label={`GOV: ${item.title.toUpperCase().replace(/ /g, "_")}`}>
              <p className="text-sm leading-[1.6] text-muted">{item.desc}</p>
            </WindowCard>
          ))}
        </div>
      </DocSection>
    </>
  );
}
