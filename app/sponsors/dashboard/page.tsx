"use client";

import Link from "next/link";
import { useGlobal } from "@/components/GlobalProvider";
import WindowCard from "@/components/ui/WindowCard";
import { SEED_BOUNTIES, SEED_LAUNCHES, SEED_SPONSORS } from "@/data/seed";

export default function Page() {
  const { user } = useGlobal();

  if (!user || !["sponsor", "admin"].includes(user.role)) {
    return (
      <div className="page-wrap section">
        <WindowCard label="ACCESS.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-3.5 text-[15px]">Sponsor or company account required.</p>
          <Link className="btn btn-outline btn-sm" href="/sponsors/apply">
            Apply to Sponsor →
          </Link>
        </WindowCard>
      </div>
    );
  }

  const sponsorName = user.organization || user.name;
  const myBounties = SEED_BOUNTIES.filter((b) => b.sponsor === sponsorName);
  const myLaunches = SEED_LAUNCHES.filter((l) => l.sponsors.some((s) => s.includes(sponsorName.split(" ")[0])));
  const sponsor = SEED_SPONSORS.find((s) => s.name.toLowerCase().includes(sponsorName.split(" ")[0].toLowerCase())) || SEED_SPONSORS[0];

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/sponsor/dashboard</div>
      <h1 className="mb-2 text-5xl">Sponsor Dashboard</h1>
      <p className="text-[17px] text-muted">Your research programs, bounties, launch analytics, and hiring pipeline.</p>
      <hr className="divider" />

      <div className="grid-4 mb-7 gap-3.5">
        {[
          { label: "Research Programs", value: sponsor.programs },
          { label: "Total Committed", value: sponsor.amount },
          { label: "Active Bounties", value: myBounties.length },
          { label: "Products Launched", value: Math.max(myLaunches.length, 1) },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value text-xl">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 gap-5.5">
        <div>
          <WindowCard label="RESEARCH_PROGRAMS.SYS" className="mb-5.5">
            <div className="mb-3 font-mono text-[10px] tracking-[0.06em] text-muted">ACTIVE PROGRAMS</div>
            <p className="mb-3.5 text-sm leading-[1.6] text-muted">{sponsor.why}</p>
            <div className="mb-3.5 flex flex-wrap gap-2">
              {["Research sponsorship", "ARS researcher access", "Bounty posting", "Launch co-branding"].map((b) => (
                <span key={b} className="ftag text-[11px]">
                  ✓ {b}
                </span>
              ))}
            </div>
            <Link className="btn btn-outline btn-sm" href="/sponsors/apply">
              Manage Programs →
            </Link>
          </WindowCard>

          <WindowCard label="ACTIVE_BOUNTIES.SYS" className="mb-5.5">
            {myBounties.length === 0 ? (
              <div>
                <p className="mb-3 text-[13px] text-muted">No active bounties. Post a research challenge to engage ARS-scored researchers.</p>
                <Link className="btn btn-primary btn-sm" href="/funding/bounties/post">
                  Post a Bounty →
                </Link>
              </div>
            ) : (
              myBounties.map((b) => (
                <div key={b.id} className="border-b border-[#D8D4CC] py-2.5">
                  <div className="mb-1 text-[13px] font-semibold">{b.title.slice(0, 55)}…</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="ftag bg-success text-[11px]">{b.status}</span>
                    <span className="ftag text-[11px]">{b.reward}</span>
                    <span className="ftag text-[11px]">{b.applicants} applicants</span>
                  </div>
                </div>
              ))
            )}
          </WindowCard>
        </div>

        <div>
          <WindowCard label="LAUNCH_ANALYTICS.SYS" className="mb-5.5" bodyClass="window-body window-body-blue">
            <div className="mb-3 font-mono text-[10px] tracking-[0.06em] text-muted">PRODUCTS LAUNCHED VIA SPONSORSHIP</div>
            {(myLaunches.length > 0 ? myLaunches : SEED_LAUNCHES.slice(0, 2)).map((l) => (
              <Link key={l.id} href={`/launch/${l.id}`} className="block border-b border-[#D8D4CC] py-2.5 no-underline text-inherit">
                <div className="mb-1 text-[13px] font-semibold">{l.name}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="ftag text-[11px]">▲ {l.votes}</span>
                  <span className="ftag bg-[#EAF0F6] text-[11px]">views {l.devViews?.toLocaleString()}</span>
                  <span className="ftag bg-success text-[11px]">investors {l.investorRegs}</span>
                </div>
              </Link>
            ))}
          </WindowCard>

          <WindowCard label="TALENT_PIPELINE.SYS" bodyClass="window-body window-body-yellow">
            <div className="mb-3 font-mono text-[10px] tracking-[0.06em] text-muted">HIRING ACTIVITY</div>
            {[
              { label: "Researchers reached", value: "847" },
              { label: "Applications received", value: "23" },
              { label: "Interviews scheduled", value: "6" },
              { label: "Hires via AthenaX", value: "2" },
            ].map((m) => (
              <div key={m.label} className="flex justify-between border-b border-[#D8D4CC] py-2 text-[13px]">
                <span className="text-muted">{m.label}</span>
                <span className="font-mono font-bold">{m.value}</span>
              </div>
            ))}
            <Link className="btn btn-outline btn-sm mt-3" href="/network/talent">
              Browse Researchers →
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
