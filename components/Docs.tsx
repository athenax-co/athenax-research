
// ═══════════════════════════════════════════════════════════
// DOCS SECTION
// ═══════════════════════════════════════════════════════════

import { SectionLabel, TerminalPanel, WindowCard } from "./AthenaX_v5 (10)";

const DOCS_NAV = [
  { id: "docs",                icon: "▣", label: "Overview",           desc: "What is AthenaX?" },
  { id: "docs-researchers",    icon: "◉", label: "For Researchers",    desc: "Profiles, papers, ARS" },
  { id: "docs-protocols",      icon: "◆", label: "For Protocols",      desc: "Sponsor research" },
  { id: "docs-builders",       icon: "◎", label: "For Builders",       desc: "Build from research" },
  { id: "docs-standards",      icon: "▤", label: "Research Standards", desc: "Guidelines & integrity" },
  { id: "docs-governance",     icon: "▦", label: "Governance",         desc: "Council & DAO" },
  { id: "docs-media",          icon: "▶", label: "Media & Reports",    desc: "Events, reports, digest" },
];

// Shared sidebar for all docs pages
const DocsSidebar = ({ current, setPage }: { current: string; setPage: (id: string) => void }) => (
  <div style={{ width: 220, flexShrink: 0 }}>
    <TerminalPanel title="DOCS_INDEX.sys" style={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {DOCS_NAV.map(item => {
          const active = current === item.id;
          return (
            <div key={item.id} onClick={() => setPage(item.id)}
              style={{
                padding: "8px 10px", borderRadius: 5, cursor: "pointer",
                background: active ? "rgba(230,54,54,0.12)" : "transparent",
                borderLeft: active ? "3px solid #E63636" : "3px solid transparent",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(31,41,55,0.06)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: active ? "#E63636" : "#1F2937", opacity: active ? 1 : 0.5 }}>{item.icon}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: active ? 700 : 500, fontSize: 12, letterSpacing: "0.02em" }}>{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(31,41,55,0.15)" }}>
        <div className="vt" style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.06em" }}>ATHENAX_OS v5.0</div>
        <div className="vt" style={{ fontSize: 12, opacity: 0.4, letterSpacing: "0.06em" }}>DOCS BUILD 001</div>
      </div>
    </TerminalPanel>
  </div>
);

// Shared docs shell
const DocsShell = ({ current, setPage, children, title, subtitle, fileTag }: { current: string; setPage: (id: string) => void; children: React.ReactNode; title: string; subtitle: string; fileTag: string }) => (
  <div className="page-enter">
    {/* Page header */}
    <div    style={{
        background: "#1F2937",
        color: "#FDFBF7",
        borderBottom: "2px solid #1F2937",
        padding: "64px 32px 56px",
      }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>DOCUMENTATION</SectionLabel>
        <h1 style={{ fontFamily: "'Londrina Solid',cursive", fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.0, marginBottom: 10, marginTop: 8 }}>{title}</h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, opacity: 0.7, maxWidth: 560 }}>{subtitle}</p>
      </div>
    </div>
    {/* Layout */}
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px", display: "flex", gap: 28, alignItems: "flex-start" }}>
      <DocsSidebar current={current} setPage={setPage} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <button onClick={() => setPage("docs")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'VT323',monospace", fontSize: 14, color: "#E63636", padding: 0 }}>DOCS/</button>
          <span className="vt" style={{ fontSize: 14, opacity: 0.45 }}>{fileTag}</span>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// Reusable doc section component
const DocSection = ({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) => (
  <WindowCard title={`${tag} — ${title.toUpperCase()}.md`} staticHover style={{ marginBottom: 20 }}>
    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, lineHeight: 1.8, color: "#1F2937" }}>
      {children}
    </div>
  </WindowCard>
);

// Reusable step row
export const DocStep = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
    <div style={{ width: 32, height: 32, background: "#E63636", border: "2px solid #1F2937", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "2px 2px 0 #1F2937" }}>
      <span style={{ fontFamily: "'Londrina Solid',cursive", fontSize: 16, color: "#FDFBF7", lineHeight: 1 }}>{n}</span>
    </div>
    <div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3, color: "#1F2937" }}>{title}</div>
      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, opacity: 0.65, lineHeight: 1.65 }}>{desc}</div>
    </div>
  </div>
);

// Reusable definition row
export const DocDef = ({ term, def }: { term: string; def: string }) => (
  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(31,41,55,0.08)", alignItems: "baseline" }}>
    <span className="vt" style={{ fontSize: 15, color: "#E63636", letterSpacing: "0.04em" }}>{term}</span>
    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, lineHeight: 1.65, opacity: 0.8 }}>{def}</span>
  </div>
);

// ── 1. DOCS HOME (Overview) ──────────────────────────────────
export const DocsHomePage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs" setPage={setPage}
    title="AthenaX Documentation"
    subtitle="Everything you need to know about the AthenaX Research Operating System."
    fileTag="README.md"
  >
    <DocSection title="What is AthenaX?" tag="01">
      <p style={{ marginBottom: 14 }}>
        <strong>AthenaX</strong> is the research and innovation engine of Web3. It is a coordination platform that connects university research labs, individual researchers, Web3 protocols, and builders into a single open research economy.
      </p>
      <p style={{ marginBottom: 14 }}>
        AthenaX operates as a research operating system — providing the infrastructure for publishing research, validating quality, funding programs, and incubating startups from validated academic work.
      </p>
      <TerminalPanel title="MISSION_STATEMENT.sys" style={{ marginTop: 16 }}>
        <div><span className="term-green">$</span> <span className="term-yellow">mission</span></div>
        <div style={{ marginTop: 8, opacity: 0.85 }}>Credentialed open research, openly funded, openly built.</div>
        <div style={{ marginTop: 6, opacity: 0.6 }}>Every paper is a potential protocol. Every protocol funds the next paper.</div>
      </TerminalPanel>
    </DocSection>

    <DocSection title="The AthenaX Mission" tag="02">
      <p style={{ marginBottom: 16 }}>AthenaX exists to solve three interconnected problems in Web3 research:</p>
      <DocStep n={1} title="Credibility gap" desc="Web3 lacks credentialed, peer-reviewed research. AthenaX provides the infrastructure for rigorous academic publication with ARS reputation scoring." />
      <DocStep n={2} title="Funding gap" desc="Researchers have no direct channel to Web3 capital. AthenaX creates sponsored research programs where protocols fund specific research agendas." />
      <DocStep n={3} title="Commercialisation gap" desc="Great research never becomes products. AthenaX's builder pipeline turns validated research into funded startups through structured cohorts." />
    </DocSection>

    <DocSection title="The Research Pipeline" tag="03">
      <p style={{ marginBottom: 16 }}>Every piece of research in AthenaX follows the same five-stage pipeline:</p>
      <DocStep n={1} title="RESEARCH — Academic Production" desc="University labs and independent researchers produce Web3-relevant research papers, submitted through the AthenaX platform." />
      <DocStep n={2} title="VALIDATE — Peer Review + ARS" desc="Community peer review and the AthenaX Reputation Score (ARS) system validate quality and build researcher reputation on-chain." />
      <DocStep n={3} title="FUND — Protocol Sponsorship" desc="Web3 foundations and protocols sponsor funded research cohorts. AthenaX earns a 10–20% platform coordination fee." />
      <DocStep n={4} title="BUILD — Builder Cohorts" desc="Validated research is matched with builders for 6-month incubation programs. Ideas become protocols and products." />
      <DocStep n={5} title="LAUNCH — Ecosystem Impact" desc="Deployed protocols, trained researchers, funded startups, and open datasets enter the broader Web3 ecosystem." />
    </DocSection>

    <DocSection title="The AthenaX Ecosystem" tag="04">
      <p style={{ marginBottom: 14 }}>AthenaX serves four distinct participant types, each with a specific role in the research economy:</p>
      <DocDef term="RESEARCHERS" def="University faculty, PhD researchers, and independent academics who produce and peer-review research. They earn ARS reputation scores, cohort stipends, and bounty rewards." />
      <DocDef term="PROTOCOLS" def="Web3 foundations and DAOs that sponsor research programs, post bounties, and recruit from the AthenaX talent marketplace." />
      <DocDef term="BUILDERS" def="Developers and entrepreneurs who discover validated research ideas and join cohorts to build products, protocols, and startups." />
      <DocDef term="LABS" def="University research labs that partner with AthenaX to publish, get funded, and connect their researchers to Web3 opportunities." />
      <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-sm" onClick={() => setPage("docs-researchers")}>Researcher Guide →</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setPage("docs-protocols")}>Protocol Guide →</button>
        <button className="btn btn-secondary btn-sm" onClick={() => setPage("docs-builders")}>Builder Guide →</button>
      </div>
    </DocSection>
  </DocsShell>
);

// ── 2. FOR RESEARCHERS ───────────────────────────────────────
export const DocsResearchersPage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-researchers" setPage={setPage}
    title="For Researchers"
    subtitle="How to publish research, build reputation, and earn funding through AthenaX."
    fileTag="RESEARCHERS.md"
  >
    <DocSection title="Creating a Researcher Profile" tag="01">
      <p style={{ marginBottom: 14 }}>Your researcher profile is your identity in the AthenaX ecosystem. It displays your published papers, ARS score, institutional affiliation, and research specialisations.</p>
      <DocStep n={1} title="Register an account" desc="Create an account at AthenaX and select 'Researcher' as your role during onboarding." />
      <DocStep n={2} title="Complete your profile" desc="Add your institutional affiliation, ORCID identifier, research specialisations, and a brief bio." />
      <DocStep n={3} title="Connect your lab" desc="If your institution is a partner lab, link your profile to receive institutional verification and co-authored paper credit." />
      <DocStep n={4} title="Start building ARS" desc="Submit your first paper for peer review to begin accumulating your AthenaX Reputation Score." />
    </DocSection>

    <DocSection title="Submitting Research Papers" tag="02">
      <p style={{ marginBottom: 14 }}>AthenaX accepts original research in all Web3-relevant fields including cryptography, mechanism design, distributed systems, tokenomics, DeFi, and governance.</p>
      <DocStep n={1} title="Prepare your manuscript" desc="Format your paper according to AthenaX Research Standards. Include an abstract, methodology, results, and bibliography." />
      <DocStep n={2} title="Submit via platform" desc="Use the Submit Paper form (accessible from your Dashboard). Upload your PDF and fill in metadata: title, abstract, topic tags, co-authors." />
      <DocStep n={3} title="Initial triage" desc="AthenaX editors conduct a 48-hour triage to confirm the paper meets minimum standards before entering peer review." />
      <DocStep n={4} title="Peer review opens" desc="Your paper enters open peer review. Community researchers with relevant ARS scores can submit structured reviews." />
      <DocStep n={5} title="Revision cycle" desc="Address reviewer feedback. Papers may go through up to two revision rounds before acceptance or rejection." />
      <DocStep n={6} title="Publication" desc="Accepted papers are published to the AthenaX Archive with a permanent DOI and open-access licence." />
    </DocSection>

    <DocSection title="The ARS Reputation System" tag="03">
      <p style={{ marginBottom: 14 }}>The <strong>AthenaX Reputation Score (ARS)</strong> is a composite metric from 0–10 that measures a researcher's credibility, contribution, and impact within the platform.</p>
      <TerminalPanel title="ARS_FORMULA.sys">
        <div className="term-green">$ ars --formula</div>
        <div style={{ marginTop: 10, fontFamily: "'VT323',monospace", fontSize: 15, lineHeight: 1.9 }}>
          <div><span className="term-yellow">citations</span>      × 0.30</div>
          <div><span className="term-yellow">peer_reviews</span>   × 0.25</div>
          <div><span className="term-yellow">downloads</span>      × 0.15  <span className="term-dim">(capped 20)</span></div>
          <div><span className="term-yellow">votes</span>          × 0.15  <span className="term-dim">(capped 20)</span></div>
          <div><span className="term-yellow">sponsor_endorsements</span> × 0.10</div>
          <div><span className="term-yellow">bounty_completions</span>   × 0.05</div>
          <div style={{ marginTop: 8, borderTop: "1px solid rgba(31,41,55,0.2)", paddingTop: 8 }}>
            <span className="term-green">MAX SCORE: 10.0</span>
          </div>
        </div>
      </TerminalPanel>
      <div style={{ marginTop: 16 }}>
        <DocDef term="ARS ≥ 8.0" def="Elite researcher. Eligible for Research Council nomination and lead cohort positions." />
        <DocDef term="ARS 5.0–7.9" def="Senior researcher. Eligible to peer-review all paper types and lead bounty teams." />
        <DocDef term="ARS 2.0–4.9" def="Active researcher. Can peer-review papers in your specialisation and participate in cohorts." />
        <DocDef term="ARS < 2.0" def="New researcher. Build score by submitting papers, completing peer reviews, and earning citations." />
      </div>
    </DocSection>

    <DocSection title="Peer Review Process" tag="04">
      <p style={{ marginBottom: 14 }}>AthenaX uses an open, scored peer review system. Reviews are public, attributed, and contribute to your own ARS score.</p>
      <DocStep n={1} title="Find papers to review" desc="Browse the Archive for papers in your specialisation. Papers awaiting review are marked with a REVIEW OPEN badge." />
      <DocStep n={2} title="Submit a structured review" desc="Reviews must include: summary assessment, methodology evaluation, significance rating (1–5), and specific revision requests." />
      <DocStep n={3} title="Earn review credit" desc="Each accepted peer review adds to your ARS score under the peer_reviews component. High-quality reviews are endorsed by editors." />
    </DocSection>

    <DocSection title="Participating in Bounties" tag="05">
      <p style={{ marginBottom: 14 }}>Research bounties are open research challenges posted by Web3 protocols with attached prize pools. Any researcher can claim and complete a bounty.</p>
      <DocStep n={1} title="Browse the Bounty Marketplace" desc="Filter by topic, prize pool size, deadline, and sponsor. Bounties range from literature reviews ($500) to original research ($50,000+)." />
      <DocStep n={2} title="Claim a bounty" desc="Submit a brief proposal explaining your approach. If accepted by the sponsor, the bounty is assigned to you." />
      <DocStep n={3} title="Deliver and earn" desc="Submit your completed research by the deadline. On sponsor acceptance, funds are released from escrow to your account." />
    </DocSection>
  </DocsShell>
);

// ── 3. FOR PROTOCOLS ─────────────────────────────────────────
export const DocsProtocolsPage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-protocols" setPage={setPage}
    title="For Protocols"
    subtitle="How Web3 foundations and DAOs fund research, recruit talent, and engage with AthenaX."
    fileTag="PROTOCOLS.md"
  >
    <DocSection title="Sponsoring Research Programs" tag="01">
      <p style={{ marginBottom: 14 }}>Protocols can sponsor funded research cohorts — structured 6-month programs where a team of AthenaX researchers investigate a specific problem defined by the sponsor.</p>
      <DocStep n={1} title="Define your research agenda" desc="Work with the AthenaX team to scope a research question or program area — e.g. 'MEV resistance mechanisms' or 'zkEVM performance benchmarking'." />
      <DocStep n={2} title="Set budget and milestones" desc="Agree on a total program budget (typically $100K–$500K), milestone schedule, and deliverables. AthenaX retains a 10–20% platform fee." />
      <DocStep n={3} title="Funds into escrow" desc="Sponsor deposits funds into AthenaX-managed escrow. Funds release on milestone verification, not in advance." />
      <DocStep n={4} title="Researcher matching" desc="AthenaX sources and vets researchers from partner labs. Sponsors approve the final cohort composition." />
      <DocStep n={5} title="Program runs" desc="Monthly progress reports, interim peer review, and final paper publication. All output is open-access by default." />
      <DocStep n={6} title="Publication & attribution" desc="All papers are published with clear sponsor attribution. Sponsors receive a research summary deck and data rights (non-exclusive)." />
    </DocSection>

    <DocSection title="Posting Research Bounties" tag="02">
      <p style={{ marginBottom: 14 }}>Bounties are the fastest way to commission research. Define a question, set a prize, and the AthenaX researcher community competes to answer it.</p>
      <DocStep n={1} title="Post a bounty" desc="Use the Post a Bounty form. Define: research question, deliverable format, prize pool, deadline, and acceptance criteria." />
      <DocStep n={2} title="Review proposals" desc="Researchers submit brief proposals within the first week. You review and select the best team or individual to pursue the bounty." />
      <DocStep n={3} title="Delivery and payment" desc="On submission, you review and either accept (releasing escrow) or request revisions (one round allowed). AthenaX mediates disputes." />
      <TerminalPanel title="BOUNTY_TYPES.sys" style={{ marginTop: 16 }}>
        <div className="term-green">$ bounty --list-types</div>
        <div style={{ marginTop: 8, lineHeight: 2 }}>
          <div><span className="term-yellow">LITERATURE_REVIEW</span>   <span className="term-dim">$500 – $5K    / 2–4 weeks</span></div>
          <div><span className="term-yellow">TECHNICAL_REPORT</span>    <span className="term-dim">$2K – $20K    / 4–8 weeks</span></div>
          <div><span className="term-yellow">ORIGINAL_RESEARCH</span>   <span className="term-dim">$10K – $100K+ / 8–16 weeks</span></div>
          <div><span className="term-yellow">AUDIT_REVIEW</span>        <span className="term-dim">$5K – $50K    / 2–6 weeks</span></div>
          <div><span className="term-yellow">DATA_ANALYSIS</span>       <span className="term-dim">$1K – $15K    / 2–6 weeks</span></div>
        </div>
      </TerminalPanel>
    </DocSection>

    <DocSection title="Recruiting Researchers" tag="03">
      <p style={{ marginBottom: 14 }}>AthenaX's Talent Marketplace gives protocols direct access to vetted, ARS-scored researchers for full-time roles, grants, advisory positions, and fellowships.</p>
      <DocStep n={1} title="Post a role" desc="List your open position in the Talent Marketplace — specify role type, compensation, ARS minimum, and required specialisations." />
      <DocStep n={2} title="Browse profiles" desc="Search researcher profiles by ARS score, institution, specialisation, and publication history. Request introductions via the platform." />
      <DocStep n={3} title="Sponsor a fellowship" desc="Create a named fellowship program attached to your protocol. Fellows receive a stipend and produce open research on your behalf." />
    </DocSection>

    <DocSection title="Joining Research Cohorts" tag="04">
      <p style={{ marginBottom: 14 }}>Rather than running an independent program, protocols can join existing AthenaX cohorts as co-sponsors or research partners.</p>
      <DocDef term="CO-SPONSOR" def="Share funding responsibilities with another protocol on a joint research cohort. Split costs, share attribution." />
      <DocDef term="RESEARCH PARTNER" def="Provide non-financial support (datasets, engineering access, advisory) to an existing cohort in exchange for attribution and early access to findings." />
      <DocDef term="OBSERVER" def="Join a cohort as an observer — receive full progress reports and final publications without sponsorship obligations." />
      <div style={{ marginTop: 18 }}>
        <button className="btn btn-primary btn-sm" onClick={() => setPage("sponsors")}>View Sponsorship Options →</button>
      </div>
    </DocSection>
  </DocsShell>
);

// ── 4. FOR BUILDERS ──────────────────────────────────────────
export const DocsBuilderPage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-builders" setPage={setPage}
    title="For Builders"
    subtitle="How to discover research, join cohorts, and build the next Web3 startup from validated academic work."
    fileTag="BUILDERS.md"
  >
    <DocSection title="The Builder Pipeline" tag="01">
      <p style={{ marginBottom: 14 }}>AthenaX treats research as a startup factory. Every paper in the Archive represents a validated hypothesis — a business opportunity waiting for a builder to execute it.</p>
      <TerminalPanel title="BUILDER_PIPELINE.sys">
        <div className="term-green">$ pipeline --status</div>
        <div style={{ marginTop: 10, lineHeight: 2.0 }}>
          <div><span className="term-yellow">[RESEARCH]</span>  Academic paper published + peer reviewed</div>
          <div><span style={{ color: "#E63636" }}>    ↓</span></div>
          <div><span className="term-yellow">[VALIDATED]</span> ARS score ≥ 5.0, citation threshold met</div>
          <div><span style={{ color: "#E63636" }}>    ↓</span></div>
          <div><span className="term-yellow">[AVAILABLE]</span> Appears in Builder Opportunities feed</div>
          <div><span style={{ color: "#E63636" }}>    ↓</span></div>
          <div><span className="term-yellow">[COHORT]</span>    Builder applies, cohort funded by sponsor</div>
          <div><span style={{ color: "#E63636" }}>    ↓</span></div>
          <div><span className="term-green">[LAUNCH]</span>    Protocol / product / company deployed</div>
        </div>
      </TerminalPanel>
    </DocSection>

    <DocSection title="Discovering Research Ideas" tag="02">
      <p style={{ marginBottom: 14 }}>The AthenaX Archive contains hundreds of peer-reviewed papers across DeFi, cryptography, governance, infrastructure, and more — each a potential startup idea.</p>
      <DocStep n={1} title="Browse the Archive" desc="Filter papers by topic, ARS score, sponsor interest, and commercial viability tag. Highly-cited papers with sponsor interest are prime builder targets." />
      <DocStep n={2} title="Check Builder Opportunities" desc="The Builders page aggregates open builder slots — specific papers or research clusters that sponsors have pre-committed to fund as cohorts." />
      <DocStep n={3} title="Use the Research Terminal" desc="Query the research database directly. Search by keyword, author, institution, or topic. Export reading lists for deep research sprints." />
      <DocStep n={4} title="Talk to researchers" desc="Contact the original paper authors through the platform. Many researchers want to collaborate with builders on commercialising their work." />
    </DocSection>

    <DocSection title="Joining Builder Cohorts" tag="03">
      <p style={{ marginBottom: 14 }}>Builder cohorts are 6-month structured programs where a small team (typically 2–5 people) takes a validated research paper from idea to deployed protocol or product.</p>
      <DocStep n={1} title="Find an open cohort" desc="Browse active and upcoming cohorts on the Cohorts page. Each listing shows the research focus, funding amount, sponsor, and team requirements." />
      <DocStep n={2} title="Submit an application" desc="Apply with: your background, relevant experience, a brief product vision, and how you plan to commercialise the research." />
      <DocStep n={3} title="Selection and onboarding" desc="AthenaX and the sponsoring protocol review applications. Selected teams receive cohort funding, access to the original research authors, and AthenaX infrastructure support." />
      <DocStep n={4} title="Build for 6 months" desc="Monthly check-ins with AthenaX and the sponsor. Access to researcher mentorship, co-working infrastructure, and legal/token advisory." />
      <DocStep n={5} title="Demo and launch" desc="Final cohort demo day. Teams present to sponsors, investors, and the broader ecosystem. Successful teams proceed to funding and deployment." />
    </DocSection>

    <DocSection title="What Builders Receive" tag="04">
      <DocDef term="COHORT STIPEND"    def="$5,000–$15,000/month per team member during the cohort, funded by the sponsoring protocol." />
      <DocDef term="RESEARCH ACCESS"   def="Direct access to the original paper authors for technical consultation throughout the cohort." />
      <DocDef term="LEGAL SUPPORT"     def="Token structure advisory, entity formation guidance, and open-source licensing support." />
      <DocDef term="INVESTOR INTROS"   def="AthenaX facilitates introductions to Web3 VCs and protocol treasuries at demo day." />
      <DocDef term="BRAND ASSOCIATION" def="AthenaX-incubated projects carry platform credibility, peer-review provenance, and academic citation backing." />
      <div style={{ marginTop: 18 }}>
        <button className="btn btn-primary btn-sm" onClick={() => setPage("cohorts")}>Browse Open Cohorts →</button>
      </div>
    </DocSection>
  </DocsShell>
);

// ── 5. RESEARCH STANDARDS ────────────────────────────────────
export const DocsStandardsPage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-standards" setPage={setPage}
    title="Research Standards"
    subtitle="Submission rules, peer review guidelines, citation requirements, and research integrity standards."
    fileTag="STANDARDS.md"
  >
    <DocSection title="Paper Submission Rules" tag="01">
      <p style={{ marginBottom: 14 }}>All papers submitted to AthenaX must meet the following baseline requirements before entering peer review:</p>
      <DocDef term="ORIGINAL WORK"    def="The paper must report original research not previously published in a peer-reviewed venue. Preprints are acceptable if not yet formally published." />
      <DocDef term="WORD COUNT"       def="Minimum 4,000 words (excluding references). Maximum 25,000 words. Shorter technical notes (1,500–4,000 words) may be submitted as Research Notes." />
      <DocDef term="ABSTRACT"         def="300–500 words. Must include: background, research question, methodology, key findings, and implications." />
      <DocDef term="METHODOLOGY"      def="All empirical claims must be accompanied by a reproducible methodology section. Code and datasets must be linked or deposited." />
      <DocDef term="REFERENCES"       def="Minimum 15 references for full papers. Use APA 7th edition format. Self-citations must not exceed 25% of total references." />
      <DocDef term="TOPIC RELEVANCE"  def="Research must be relevant to Web3, decentralised systems, cryptography, tokenomics, digital governance, or adjacent fields." />
    </DocSection>

    <DocSection title="Peer Review Process" tag="02">
      <p style={{ marginBottom: 14 }}>AthenaX operates a double-open peer review system: both reviewer identities and review content are public after publication.</p>
      <DocStep n={1} title="Reviewer eligibility" desc="To review a paper, you must have an ARS score ≥ 2.0 and at least one published specialisation tag matching the paper's topic." />
      <DocStep n={2} title="Review structure" desc="Reviews must use the AthenaX structured template: Summary (100–200 words), Strengths (3+ points), Weaknesses (3+ points), Verdict (Accept / Minor Revision / Major Revision / Reject), and Score (1–5)." />
      <DocStep n={3} title="Review timeline" desc="Reviewers have 14 days to submit a review after claiming a paper. Missed deadlines forfeit the review slot and do not affect ARS." />
      <DocStep n={4} title="Editor adjudication" desc="Papers with conflicting reviewer verdicts (e.g., one Accept, one Reject) are escalated to an AthenaX senior editor for adjudication." />
      <DocStep n={5} title="Appeals" desc="Authors may appeal a rejection within 14 days by submitting a structured rebuttal. Appeals are reviewed by a panel of three Research Council members." />
    </DocSection>

    <DocSection title="Citation Requirements" tag="03">
      <p style={{ marginBottom: 14 }}>AthenaX enforces citation integrity as a core platform standard. The following rules apply to all published papers:</p>
      <DocDef term="FORMAT"          def="APA 7th edition for all references. DOI links required where available. arXiv preprints must include arXiv ID." />
      <DocDef term="SELF-CITATION"   def="Authors may not self-cite more than 25% of a paper's total references. Violations result in editorial review." />
      <DocDef term="ATHENAX PAPERS"  def="Papers that build on previously published AthenaX research must cite those papers. The platform automatically flags missing citations during submission." />
      <DocDef term="DATA SOURCES"    def="All datasets used must be cited with a persistent identifier (DOI, URL, or platform reference). Proprietary data must be disclosed." />
      <DocDef term="AI ASSISTANCE"   def="Use of AI writing assistance must be disclosed in an Author Contributions statement. AI systems may not be listed as co-authors." />
    </DocSection>

    <DocSection title="Research Integrity Standards" tag="04">
      <p style={{ marginBottom: 14 }}>AthenaX enforces research integrity through both automated and community-based mechanisms.</p>
      <DocDef term="PLAGIARISM"      def="All submissions are run through automated plagiarism detection. Papers with >15% similarity to existing published work are rejected automatically." />
      <DocDef term="DATA FABRICATION" def="Fabrication or manipulation of research data results in immediate paper retraction, ARS score reset to 0, and permanent platform ban." />
      <DocDef term="CONFLICTS"       def="All authors must declare financial conflicts of interest, including token holdings, grant relationships, or employment by entities referenced in the paper." />
      <DocDef term="RETRACTIONS"     def="Papers may be retracted by author request, editorial decision, or Research Council vote. Retracted papers remain indexed but are clearly marked." />
      <DocDef term="DISPUTE PROCESS" def="Research integrity disputes are handled by the AthenaX Research Council. Accused parties have 21 days to submit a response before a Council vote." />
      <TerminalPanel title="INTEGRITY_STATUS.sys" style={{ marginTop: 16 }}>
        <div className="term-green">$ integrity --platform-stats</div>
        <div style={{ marginTop: 8, lineHeight: 1.9 }}>
          <div><span className="term-yellow">papers_reviewed_this_quarter:</span>  127</div>
          <div><span className="term-yellow">plagiarism_flags:</span>               3  <span className="term-dim">(all rejected)</span></div>
          <div><span className="term-yellow">active_integrity_reviews:</span>       1</div>
          <div><span className="term-yellow">retractions_all_time:</span>           0</div>
          <div style={{ marginTop: 6 }}><span className="term-green">STATUS: CLEAN</span></div>
        </div>
      </TerminalPanel>
    </DocSection>
  </DocsShell>
);

// ── 6. GOVERNANCE ────────────────────────────────────────────
export const DocsGovernancePage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-governance" setPage={setPage}
    title="Governance"
    subtitle="How AthenaX is governed today, and the path toward decentralised community governance."
    fileTag="GOVERNANCE.md"
  >
    <DocSection title="The Research Council" tag="01">
      <p style={{ marginBottom: 14 }}>The AthenaX Research Council is the primary academic governance body. It is composed of senior researchers (ARS ≥ 8.0) elected by the platform community on an annual basis.</p>
      <DocDef term="SIZE"          def="9 members. 6 elected by the researcher community, 3 appointed by AthenaX for domain expertise." />
      <DocDef term="TERM"          def="12-month terms. Maximum 3 consecutive terms. Elections held in January each year." />
      <DocDef term="RESPONSIBILITIES" def="Editorial policy, peer review standards, integrity dispute adjudication, paper appeals, and ARS formula governance." />
      <DocDef term="COMPENSATION"  def="Council members receive a quarterly honorarium funded by AthenaX platform revenues." />
      <DocDef term="TRANSPARENCY"  def="All Council votes and decisions are published in the public Research Council log, accessible from the Archive." />
    </DocSection>

    <DocSection title="Platform Moderation" tag="02">
      <p style={{ marginBottom: 14 }}>Day-to-day platform moderation is handled by the AthenaX core team, with escalation pathways to the Research Council for academic matters.</p>
      <DocStep n={1} title="Content moderation" desc="The AthenaX team reviews all flagged content within 48 hours. Flags can be raised by any registered user via the report button on any paper, review, or profile." />
      <DocStep n={2} title="Dispute escalation" desc="User disputes that cannot be resolved by the moderation team within 7 days are escalated to the Research Council for binding arbitration." />
      <DocStep n={3} title="Appeals process" desc="Platform decisions (account suspension, paper rejection) can be appealed within 14 days via the Appeals form in your Dashboard settings." />
      <DocStep n={4} title="Transparency reports" desc="AthenaX publishes a quarterly Moderation Transparency Report detailing the number of flags, decisions, and outcomes." />
    </DocSection>

    <DocSection title="Future DAO Governance" tag="03">
      <p style={{ marginBottom: 14 }}>AthenaX is designed to progressively decentralise governance toward a fully on-chain DAO model. The current roadmap:</p>
      <TerminalPanel title="DAO_ROADMAP.sys">
        <div className="term-green">$ dao --roadmap</div>
        <div style={{ marginTop: 10, lineHeight: 2.0 }}>
          <div><span className="term-yellow">PHASE_1 [CURRENT]</span>  Centralised + Research Council hybrid</div>
          <div><span className="term-dim">    ↓ Token generation event</span></div>
          <div><span className="term-yellow">PHASE_2 [2026]</span>     ARS-weighted on-chain voting on editorial policy</div>
          <div><span className="term-dim">    ↓ Treasury migration</span></div>
          <div><span className="term-yellow">PHASE_3 [2027]</span>     Full DAO — fee parameters, cohort approval, grants</div>
          <div><span className="term-dim">    ↓ Constitution ratified</span></div>
          <div><span className="term-green">PHASE_4 [2028+]</span>    Researcher-governed research economy</div>
        </div>
      </TerminalPanel>
      <div style={{ marginTop: 16 }}>
        <DocDef term="GOVERNANCE TOKEN" def="AthenaX will issue a governance token ($ARS) to active researchers, protocol sponsors, and early contributors. Token distribution weighted by platform ARS score." />
        <DocDef term="VOTING RIGHTS"    def="Token holders vote on: fee parameters, Research Council composition, cohort program approval, and Treasury grant allocations." />
        <DocDef term="TREASURY"         def="Platform fees (10–20% of sponsored program value) accumulate in a community Treasury governed by token holders from Phase 3 onwards." />
      </div>
    </DocSection>

    <DocSection title="Code of Conduct" tag="04">
      <p style={{ marginBottom: 14 }}>All AthenaX participants — researchers, sponsors, builders, and community members — agree to the following conduct standards:</p>
      <DocDef term="INTEGRITY"     def="All contributions — papers, reviews, bounties, code — must be original and accurately attributed." />
      <DocDef term="RESPECT"       def="Professional conduct in all platform interactions. Harassment, discrimination, or targeted abuse results in immediate suspension." />
      <DocDef term="TRANSPARENCY"  def="Conflicts of interest must be disclosed. Financial relationships with referenced entities must appear in paper disclosures." />
      <DocDef term="OPENNESS"      def="Research funded through AthenaX programs must be published open-access. Exceptions require Research Council approval." />
    </DocSection>
  </DocsShell>
);

// ── 7. MEDIA & REPORTS ───────────────────────────────────────
export const DocsMediaPage = ({ setPage }: { setPage: (id: string) => void }) => (
  <DocsShell current="docs-media" setPage={setPage}
    title="Media & Reports"
    subtitle="Research reports, roundtable discussions, live events, and the weekly Research Digest."
    fileTag="MEDIA.md"
  >
    <DocSection title="AthenaX Research Reports" tag="01">
      <p style={{ marginBottom: 16 }}>Research Reports are long-form whitepapers and sector analyses produced by the AthenaX editorial team and partner labs. They synthesise multiple papers into actionable insights for protocols and builders.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          { title: "DeFi Security Landscape 2025",    tag: "SECURITY",    status: "PUBLISHED" },
          { title: "zkEVM Benchmarking Report",       tag: "INFRASTRUCTURE", status: "PUBLISHED" },
          { title: "Cross-chain Governance Survey",   tag: "GOVERNANCE",  status: "PUBLISHED" },
          { title: "MEV Research Compendium Vol.3",   tag: "MECHANISM",   status: "FORTHCOMING" },
          { title: "Stablecoin Mechanisms Review",    tag: "TOKENOMICS",  status: "PUBLISHED" },
          { title: "Validator Economics 2025",        tag: "ECONOMICS",   status: "DRAFT" },
        ].map(r => (
          <div key={r.title} onClick={() => setPage("reports")}
            style={{ border: "2px solid #1F2937", borderRadius: 7, padding: "14px", cursor: "pointer", boxShadow: "3px 3px 0 #1F2937", background: "#FDFBF7" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "5px 5px 0 #1F2937"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "3px 3px 0 #1F2937"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span className={r.status === "PUBLISHED" ? "tag-green" : r.status === "DRAFT" ? "tag" : "tag-yellow"} style={{ fontSize: 10 }}>{r.status}</span>
              <span className="tag" style={{ fontSize: 9 }}>{r.tag}</span>
            </div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 13, color: "#1F2937", lineHeight: 1.4 }}>{r.title}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }} onClick={() => setPage("reports")}>View All Reports →</button>
    </DocSection>

    <DocSection title="Roundtable Discussions" tag="02">
      <p style={{ marginBottom: 14 }}>AthenaX Roundtables are moderated academic debates between researchers on contested questions in Web3. Each roundtable produces a published summary and structured position statements.</p>
      <DocDef term="FORMAT"      def="3–6 researchers debate a defined thesis. Moderated by an AthenaX editor. 90-minute recorded session + written summary." />
      <DocDef term="FREQUENCY"   def="Two roundtables per month. Topics sourced from community proposals and Research Council recommendations." />
      <DocDef term="PARTICIPATION" def="Researchers with ARS ≥ 4.0 may apply to participate. Protocols may sponsor a roundtable on a topic relevant to their ecosystem." />
      <DocDef term="ARCHIVE"     def="All roundtable recordings, transcripts, and summaries are permanently archived and freely accessible." />
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setPage("roundtables")}>Browse Roundtables →</button>
    </DocSection>

    <DocSection title="AthenaX Live" tag="03">
      <p style={{ marginBottom: 14 }}>AthenaX Live is the platform's live event infrastructure — hosting research presentations, protocol AMAs, cohort demo days, and community town halls.</p>
      <DocDef term="RESEARCH PRESENTATIONS" def="Weekly 30-minute researcher presentations of newly published papers. Open to all registered users." />
      <DocDef term="PROTOCOL AMAS"         def="Monthly Q&A sessions with sponsoring protocols. Researchers and community members submit questions in advance." />
      <DocDef term="DEMO DAYS"             def="Quarterly cohort demo days. Builder teams present their progress to sponsors, investors, and the community." />
      <DocDef term="TOWN HALLS"            def="Bi-annual all-hands community meetings covering platform updates, governance votes, and ecosystem news." />
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={() => setPage("live")}>View Upcoming Events →</button>
    </DocSection>

    <DocSection title="Research Digest Newsletter" tag="04">
      <p style={{ marginBottom: 14 }}>The AthenaX Research Digest is a weekly newsletter summarising the most important papers, bounties, cohort news, and ecosystem developments. Published every Monday.</p>
      <DocDef term="FREQUENCY"   def="Weekly, every Monday 08:00 UTC." />
      <DocDef term="CONTENT"     def="Top 5 papers of the week, new bounties, cohort updates, protocol announcements, and upcoming events." />
      <DocDef term="AUDIENCE"    def="12,000+ subscribers across researchers, protocol teams, builders, and investors." />
      <DocDef term="ARCHIVE"     def="All past issues available in the Digest archive. Fully searchable." />
      <TerminalPanel title="DIGEST_SUBSCRIBE.sys" style={{ marginTop: 16 }}>
        <div className="term-green">$ digest --subscribe</div>
        <div style={{ marginTop: 8, opacity: 0.75 }}>Subscribe to the weekly Research Digest from the Digest page.</div>
        <div style={{ marginTop: 8 }}>
          <button className="btn btn-primary btn-sm" onClick={() => setPage("digest")}>Subscribe to Digest →</button>
        </div>
      </TerminalPanel>
    </DocSection>
  </DocsShell>
);