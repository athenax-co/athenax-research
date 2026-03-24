// ═══════════════════════════════════════════════════════════
// HOME PAGE

import { Suspense } from "react";
import Link from "next/link";
import { IconBounties, IconBuilders, IconLabs, IconProtocols, IconResearchers, IconTerminal } from "../Icons";
import WindowCard from "../ui/WindowCard";
import { HomeArchiveSection, HomeArchiveSectionLoading } from "./home-archive-section";

const StatCard = ({ label, value, sub = "" }: { label: string; value: string; sub?: string }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

// ═══════════════════════════════════════════════════════════
const HomePage = () => {
  return (
    <div>
      <div className="page-wrap section">
        {/* Hero */}
        <div className="grid-2 items-center gap-[60px]">
          <div>
            <div className="status-badge">
              <div className="status-dot" />
              <span>System Online</span>
            </div>
            <h1 className="text-[clamp(44px,7vw,80px)] leading-[1.0] mb-7">
              The Research
              <br />
              Engine of <span className="text-[#E8323C]">Web3.</span>
            </h1>
            <p className="text-lg leading-relaxed text-[#1C1C27] mb-8 max-w-[480px]">
              AthenaX connects universities, research labs, and protocol ecosystems to produce credentialed open research — then turns validated ideas
              into funded startups.
            </p>
            <p className="text-sm text-[#6B6B7A] mb-9 italic">
              Researchers get paid. Protocols get credibility. Ideas become companies.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/how-it-works" className="btn btn-primary text-base py-3.5 px-7 inline-block">
                How It Works →
              </Link>
              <Link href="/archive" className="btn btn-outline text-base py-3.5 px-7 inline-block">
                Research Archive
              </Link>
            </div>
          </div>
          <div>
            <WindowCard label="SYS_MONITOR">
              <div className="mb-5">
                {[
                  { w: "72%", c: "#E8323C" },
                  { w: "45%", c: "#D8D4CC" },
                  { w: "88%", c: "#1C1C27" },
                  { w: "33%", c: "#D8D4CC" },
                  { w: "60%", c: "#E8323C" },
                ].map((l, i) => (
                  <div key={i} className="h-[7px] rounded" style={{ width: l.w, backgroundColor: l.c, marginBottom: 7 }} />
                ))}
              </div>
              <div className="grid-2 gap-3">
                <div className="stat-card">
                  <div className="stat-label">Papers Published</div>
                  <div className="stat-value">420</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Treasury</div>
                  <div className="stat-value text-lg text-[#15803D] italic">
                    Active
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Researchers</div>
                  <div className="stat-value">1,847</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Prize Pool</div>
                  <div className="stat-value">$2.4M</div>
                </div>
              </div>
              <div
                className="mt-4 py-2.5 px-3.5 bg-[#F2EFE9] rounded-lg border-[1.5px] border-[#1C1C27] font-mono text-xs text-[#1C1C27]"
              >
                <span className="text-[#4CAF50]">●</span> CURSOR: _&nbsp;&nbsp;EPOCH 420.69
              </div>
            </WindowCard>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-[72px]">
          <div className="grid-4">
            {[
              { label: "Active Cohorts", value: "12" },
              { label: "Partner Labs", value: "34" },
              { label: "Total Sponsors", value: "6" },
              { label: "Papers Published", value: "420" },
            ].map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>

        {/* START HERE */}
        <div className="mt-[72px]">
          <div className="mb-2">
            <div className="path-badge">/root/start</div>
          </div>
          <h2 className="text-4xl mb-2">Start Here.</h2>
          <p className="text-[17px] text-[#6B6B7A] mb-0">Pick your path into the AthenaX network.</p>
          <hr className="divider" />
          <div className="grid-4">
            <WindowCard label="DIR: /RESEARCH">
              <div className="icon-tile icon-tile-blue">
                <IconLabs />
              </div>
              <h3 className="text-lg mb-2">Explore Research</h3>
              <p className="text-sm text-[#6B6B7A] leading-relaxed mb-4">
                Browse papers, essays, and the full AthenaX knowledge archive.
              </p>
              <hr className="divider-sm" />
              <Link href="/archive" className="link-arrow inline-block">
                Open Archive →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /TERMINAL" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow">
                <IconTerminal />
              </div>
              <h3 className="text-lg mb-2">Research Terminal</h3>
              <p className="text-sm text-[#6B6B7A] leading-relaxed mb-4">
                Query the research graph. Protocol intelligence, ARS scores, trending topics.
              </p>
              <hr className="divider-sm" />
              <Link href="/terminal" className="link-arrow inline-block">
                Open Terminal →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /BOUNTIES">
              <div className="icon-tile icon-tile-green">
                <IconBounties />
              </div>
              <h3 className="text-lg mb-2">Open Bounties</h3>
              <p className="text-sm text-[#6B6B7A] leading-relaxed mb-4">
                Funded research challenges from protocol sponsors. Apply and get paid.
              </p>
              <hr className="divider-sm" />
              <Link href="/bounties" className="link-arrow inline-block">
                View Bounties →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /COHORTS">
              <div className="icon-tile icon-tile-pink">
                <IconBuilders />
              </div>
              <h3 className="text-lg mb-2">Join Builder Cohort</h3>
              <p className="text-sm text-[#6B6B7A] leading-relaxed mb-4">
                Turn validated research into a funded startup with AthenaX backing.
              </p>
              <hr className="divider-sm" />
              <Link href="/apply-cohort" className="link-arrow inline-block">
                Apply Now →
              </Link>
            </WindowCard>
          </div>
        </div>

        {/* Audience cards */}
        <div className="mt-[72px]">
          <div className="mb-2">
            <div className="path-badge">/root/platform</div>
          </div>
          <h2 className="text-4xl mb-2">Built for Three Audiences.</h2>
          <p className="text-[17px] text-[#6B6B7A] mb-0">Researchers, protocols, and builders. All in one coordination layer.</p>
          <hr className="divider" />
          <div className="grid-3">
            <WindowCard label="DIR: /RESEARCHERS" bodyClass="window-body window-body-blue">
              <div className="icon-tile icon-tile-green">
                <IconResearchers />
              </div>
              <h3 className="text-[22px] mb-2.5">For Researchers</h3>
              <p className="text-[15px] text-[#6B6B7A] leading-relaxed mb-5">
                Funded cohort positions. AthenaX Reputation Scores. Direct access to protocol ecosystems.
              </p>
              <hr className="divider-sm" />
              <Link href="/apply-cohort" className="link-arrow inline-block">
                Join as Researcher →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /PROTOCOLS" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow">
                <IconProtocols />
              </div>
              <h3 className="text-[22px] mb-2.5">For Protocols</h3>
              <p className="text-[15px] text-[#6B6B7A] leading-relaxed mb-5">
                Sponsor credentialed academic work. Open-access papers from top labs. Fund what matters.
              </p>
              <hr className="divider-sm" />
              <Link href="/bounties" className="link-arrow inline-block">
                Sponsor Research →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /BUILDERS" bodyClass="window-body">
              <div className="icon-tile icon-tile-pink">
                <IconBuilders />
              </div>
              <h3 className="text-[22px] mb-2.5">For Builders</h3>
              <p className="text-[15px] text-[#6B6B7A] leading-relaxed mb-5">
                Take validated research through the builder pipeline into funded startups.
              </p>
              <hr className="divider-sm" />
              <Link href="/cohorts" className="link-arrow inline-block">
                Join as Builder →
              </Link>
            </WindowCard>
          </div>
        </div>

        {/* Recent Archive */}
        <Suspense fallback={<HomeArchiveSectionLoading />}>
          <HomeArchiveSection />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;
