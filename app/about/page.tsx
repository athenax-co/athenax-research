import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";

export default function Page() {
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/about</div>
        <h1 className="mb-2 text-[48px]">About AthenaX</h1>
        <p className="mb-0 text-[17px] text-muted">The research and innovation engine of Web3.</p>
        <hr className="divider" />

        <div className="mb-11 grid grid-cols-2 gap-5.5">
          <WindowCard label="MISSION.TXT">
            <h3 className="mb-3.5 text-[22px]">Why We Exist</h3>
            <p className="mb-3.5 text-[15px] leading-[1.7] text-[#1C1C27]">
              The best blockchain research sits locked inside university labs, unread by the protocol teams that need it most. And the best protocol
              problems sit unlisted, unknown to the researchers who could solve them.
            </p>
            <p className="text-[15px] leading-[1.7] text-[#1C1C27]">
              AthenaX is the coordination layer between them. We fund open research, score it objectively, and turn the most validated ideas into
              funded startups.
            </p>
          </WindowCard>

          <WindowCard label="VALUES.TXT" bodyClass="window-body window-body-yellow">
            <h3 className="mb-3.5 text-[22px]">Principles</h3>
            {[
              ["Open by Default", "All research published under CC0. No paywalls. No rights reserved."],
              ["Proof of Work", "Reputation is earned through citations, peer reviews, and bounties — not credentials."],
              ["Public Goods First", "The network exists to produce knowledge, not to capture it."],
              ["Onchain Everything", "Funding, governance, and reputation flow onchain where possible."],
            ].map(([title, desc]) => (
              <div key={title} className="mb-3.5 last:mb-0">
                <div className="mb-0.75 text-sm font-bold">{title}</div>
                <div className="text-sm leading-normal text-muted">{desc}</div>
              </div>
            ))}
          </WindowCard>
        </div>

        <div className="mb-11">
          <h2 className="mb-1.5 text-[32px]">The Team</h2>
          <p className="mb-7 text-[15px] text-muted">AthenaX is built by a small, focused team.</p>
          <WindowCard label="TEAM.SYS" bodyClass="window-body window-body-cream">
            <div className="flex flex-wrap gap-3.5">
              {["Founder & CEO", "Research Lead", "Protocol Relations", "Engineering", "Design"].map((role) => (
                <div key={role} className="min-w-40 rounded-[10px] border-2 border-[#1C1C27] bg-white px-5 py-4">
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1C1C27] bg-yellow text-base font-bold">
                    ?
                  </div>
                  <div className="font-['Space_Mono',monospace] text-[10px] uppercase tracking-[0.06em] text-muted">{role}</div>
                </div>
              ))}
            </div>
          </WindowCard>
        </div>

        <WindowCard label="CONTACT.SYS" bodyClass="window-body window-body-blue">
          <h3 className="mb-3 text-[22px]">Get in Touch</h3>
          <div className="flex flex-wrap gap-3.5">
            <Link className="btn btn-primary" href="/sponsors/apply">
              Become a Sponsor →
            </Link>
            <Link className="btn btn-outline" href="/labs/apply">
              Join as a Lab →
            </Link>
            <Link className="btn btn-ghost" href="/cohort/apply">
              Apply to Cohort →
            </Link>
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
