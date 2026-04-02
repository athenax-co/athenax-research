import { DocSection } from "@/components/ui/Docs";
import WindowCard from "@/components/ui/WindowCard";

export default function Page() {
  return (
    <>
      <DocSection title="AthenaX Reputation Score">
        <p className="mb-4 text-[15px] leading-[1.7] text-[#1C1C27]">
          The ARS is a composite score calculated from six verified data points. It is immutable once computed for a given snapshot, and updates every
          24 hours.
        </p>
        <WindowCard label="ARS_WEIGHTS.SYS" bodyClass="window-body window-body-blue">
          {[
            ["Citations", "0.30", "Number of citations from indexed papers"],
            ["Peer Reviews", "0.25", "Number of completed peer reviews as reviewer"],
            ["Downloads", "0.15", "Capped at 20k downloads"],
            ["Votes", "0.15", "Community votes, capped at 2000"],
            ["Sponsor Endorsements", "0.10", "Direct endorsements from verified protocol sponsors"],
            ["Bounty Completions", "0.05", "Number of successfully completed bounties"],
          ].map(([label, weight, desc]) => (
            <div key={label} className="flex items-center gap-3 border-b border-b-[#D8D4CC] py-2.5 last:border-b-0">
              <div className="w-10 shrink-0 font-['Space_Mono',monospace] text-[13px] font-bold text-[#E8323C]">{weight}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-muted">{desc}</div>
              </div>
            </div>
          ))}
        </WindowCard>
      </DocSection>
    </>
  );
}
