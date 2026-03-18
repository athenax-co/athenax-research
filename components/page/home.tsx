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
        <div className="grid-2" style={{ alignItems: "center", gap: 60 }}>
          <div>
            <div className="status-badge">
              <div className="status-dot" />
              <span>System Online</span>
            </div>
            <h1 style={{ fontSize: "clamp(44px,7vw,80px)", lineHeight: 1.0, marginBottom: 28 }}>
              The Research
              <br />
              Engine of <span style={{ color: "#E8323C" }}>Web3.</span>
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#1C1C27", marginBottom: 32, maxWidth: 480 }}>
              AthenaX connects universities, research labs, and protocol ecosystems to produce credentialed open research — then turns validated ideas
              into funded startups.
            </p>
            <p style={{ fontSize: 14, color: "#6B6B7A", marginBottom: 36, fontStyle: "italic" }}>
              Researchers get paid. Protocols get credibility. Ideas become companies.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/how-it-works" className="btn btn-primary" style={{ fontSize: 16, padding: "13px 28px", display: "inline-block" }}>
                How It Works →
              </Link>
              <Link href="/archive" className="btn btn-outline" style={{ fontSize: 16, padding: "13px 28px", display: "inline-block" }}>
                Research Archive
              </Link>
            </div>
          </div>
          <div>
            <WindowCard label="SYS_MONITOR">
              <div style={{ marginBottom: 20 }}>
                {[
                  { w: "72%", c: "#E8323C" },
                  { w: "45%", c: "#D8D4CC" },
                  { w: "88%", c: "#1C1C27" },
                  { w: "33%", c: "#D8D4CC" },
                  { w: "60%", c: "#E8323C" },
                ].map((l, i) => (
                  <div key={i} style={{ height: 7, width: l.w, background: l.c, borderRadius: 4, marginBottom: 7 }} />
                ))}
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="stat-card">
                  <div className="stat-label">Papers Published</div>
                  <div className="stat-value">420</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Treasury</div>
                  <div className="stat-value" style={{ fontSize: 20, color: "#15803D", fontStyle: "italic" }}>
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
                style={{
                  marginTop: 16,
                  padding: "10px 14px",
                  background: "#F2EFE9",
                  borderRadius: 8,
                  border: "1.5px solid #1C1C27",
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 11,
                  color: "#1C1C27",
                }}
              >
                <span style={{ color: "#4CAF50" }}>●</span> CURSOR: _&nbsp;&nbsp;EPOCH 420.69
              </div>
            </WindowCard>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ marginTop: 72 }}>
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
        <div style={{ marginTop: 72 }}>
          <div style={{ marginBottom: 8 }}>
            <div className="path-badge">/root/start</div>
          </div>
          <h2 style={{ fontSize: 36, marginBottom: 8 }}>Start Here.</h2>
          <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>Pick your path into the AthenaX network.</p>
          <hr className="divider" />
          <div className="grid-4">
            <WindowCard label="DIR: /RESEARCH">
              <div className="icon-tile icon-tile-blue">
                <IconLabs />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Explore Research</h3>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
                Browse papers, essays, and the full AthenaX knowledge archive.
              </p>
              <hr className="divider-sm" />
              <Link href="/archive" className="link-arrow" style={{ display: "inline-block" }}>
                Open Archive →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /TERMINAL" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow">
                <IconTerminal />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Research Terminal</h3>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
                Query the research graph. Protocol intelligence, ARS scores, trending topics.
              </p>
              <hr className="divider-sm" />
              <Link href="/terminal" className="link-arrow" style={{ display: "inline-block" }}>
                Open Terminal →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /BOUNTIES">
              <div className="icon-tile icon-tile-green">
                <IconBounties />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Open Bounties</h3>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
                Funded research challenges from protocol sponsors. Apply and get paid.
              </p>
              <hr className="divider-sm" />
              <Link href="/bounties" className="link-arrow" style={{ display: "inline-block" }}>
                View Bounties →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /COHORTS">
              <div className="icon-tile icon-tile-pink">
                <IconBuilders />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Join Builder Cohort</h3>
              <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
                Turn validated research into a funded startup with AthenaX backing.
              </p>
              <hr className="divider-sm" />
              <Link href="/apply-cohort" className="link-arrow" style={{ display: "inline-block" }}>
                Apply Now →
              </Link>
            </WindowCard>
          </div>
        </div>

        {/* Audience cards */}
        <div style={{ marginTop: 72 }}>
          <div style={{ marginBottom: 8 }}>
            <div className="path-badge">/root/platform</div>
          </div>
          <h2 style={{ fontSize: 36, marginBottom: 8 }}>Built for Three Audiences.</h2>
          <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>Researchers, protocols, and builders. All in one coordination layer.</p>
          <hr className="divider" />
          <div className="grid-3">
            <WindowCard label="DIR: /RESEARCHERS" bodyClass="window-body window-body-blue">
              <div className="icon-tile icon-tile-green">
                <IconResearchers />
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>For Researchers</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
                Funded cohort positions. AthenaX Reputation Scores. Direct access to protocol ecosystems.
              </p>
              <hr className="divider-sm" />
              <Link href="/apply-cohort" className="link-arrow" style={{ display: "inline-block" }}>
                Join as Researcher →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /PROTOCOLS" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow">
                <IconProtocols />
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>For Protocols</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
                Sponsor credentialed academic work. Open-access papers from top labs. Fund what matters.
              </p>
              <hr className="divider-sm" />
              <Link href="/bounties" className="link-arrow" style={{ display: "inline-block" }}>
                Sponsor Research →
              </Link>
            </WindowCard>
            <WindowCard label="DIR: /BUILDERS" bodyClass="window-body">
              <div className="icon-tile icon-tile-pink">
                <IconBuilders />
              </div>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>For Builders</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
                Take validated research through the builder pipeline into funded startups.
              </p>
              <hr className="divider-sm" />
              <Link href="/cohorts" className="link-arrow" style={{ display: "inline-block" }}>
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
