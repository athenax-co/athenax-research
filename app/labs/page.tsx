import Link from "next/link";
import { SEED_LABS, SEED_PAPERS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import { IconLabsSmall } from "@/components/Icons";

export default function Page() {
  const sorted = [...SEED_LABS].sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));
  const paperCount = (labName: string) => SEED_PAPERS.filter((p) => p.lab === labName).length;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <div className="path-badge">/root/network/labs</div>
        <h1 className="mb-2 text-5xl font-bold tracking-[-0.02em] text-ink">Research Labs</h1>
        <p className="text-[17px] text-muted">Partner institutions producing open research.</p>
        <hr className="divider" />

        <div className="grid gap-5.5 lg:grid-cols-2">
          {sorted.map((lab) => (
            <Link key={lab.id} href={`/labs/${lab.id}`} className="no-underline">
              <div className={`archive-row flex cursor-pointer flex-col items-start ${lab.active ? "opacity-100" : "opacity-55"}`}>
                <div className="flex w-full items-center gap-3">
                  <div className="archive-icon bg-[#EAF0F6]">
                    <IconLabsSmall />
                  </div>
                  <div className="flex-1">
                    <div className="archive-title">{lab.name}</div>
                    <div className="archive-meta">{lab.focus}</div>
                  </div>
                  <span className={`ftag ${lab.active ? "bg-success" : "bg-[#F5DDE0]"}`}>{lab.active ? "Active" : "Inactive"}</span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-2">
                  {lab.tags.map((t) => (
                    <span key={t} className="ftag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-[13px] text-muted">
                  {paperCount(lab.name) || lab.papers} papers indexed
                  {!lab.active && <span className="ml-2 font-semibold text-danger">. Not accepting new research</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-11">
          <WindowCard label="JOIN_NETWORK.SYS" bodyClass="window-body window-body-yellow">
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Is Your Lab on AthenaX?</h3>
            <p className="mb-4.5 text-[15px] leading-[1.6] text-muted">
              We partner with research labs worldwide. Apply to join the network - get access to protocol sponsors, bounty funding, and the builder
              cohort pipeline.
            </p>
            <Link href="/labs/apply" className="btn btn-primary inline-block">
              Apply as a Lab -&gt;
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
