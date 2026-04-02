import Link from "next/link";
import { DOCS_NAV } from "@/lib/docs-nav";
import { DocSection, DocStep } from "@/components/ui/Docs";

export default function Page() {
  return (
    <>
      <DocSection title="What is AthenaX?">
        <p className="mb-3.5 text-[15px] leading-[1.7] text-[#1C1C27]">
          AthenaX is a research coordination network that connects academic researchers, protocol sponsors, and builders in a single flywheel.
          Research gets funded. Ideas get built. Protocols get credibility.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {["Researchers", "Protocol Sponsors", "Builders"].map((item) => (
            <span key={item} className="ftag">
              {item}
            </span>
          ))}
        </div>
      </DocSection>

      <DocSection title="Quick Start">
        <DocStep n={1} title="Choose your role" desc="Are you a researcher, protocol sponsor, or builder? Each has a different onboarding path." />
        <DocStep n={2} title="Create an account" desc="Sign up and verify your affiliation — university, lab, or protocol." />
        <DocStep n={3} title="Start contributing" desc="Submit papers, apply for bounties, or join a cohort." />
        <DocStep n={4} title="Build reputation" desc="Your ARS score grows with each paper, review, citation, and bounty completion." />
      </DocSection>

      <DocSection title="Explore Docs">
        <div className="grid gap-3.5 md:grid-cols-2">
          {DOCS_NAV.slice(1).map((item) => (
            <Link key={item.id} href={item.href} className="archive-row cursor-pointer no-underline text-inherit">
              <div className="archive-title text-sm">{item.label}</div>
            </Link>
          ))}
        </div>
      </DocSection>
    </>
  );
}
