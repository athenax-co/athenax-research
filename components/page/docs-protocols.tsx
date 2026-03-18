import { DocSection, DocsShell, DocStep } from "../ui/Docs";

const DocsProtocolsPage = () => (
  <DocsShell current="docs-protocols" title="For Protocols" subtitle="Fund research that matters." fileTag="/root/docs/protocols">
    <DocSection title="How Protocols Participate">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Protocols fund research tracks, post bounties, sponsor cohorts, and access the Research Terminal. You get credentialed academic work on your protocol's specific research needs.</p>
      <DocStep n={1} title="Choose a funding model" desc="Sponsored programs, one-off bounties, or cohort sponsorship. Mix and match."/>
      <DocStep n={2} title="Define research scope" desc="Work with AthenaX to design a research track that addresses your protocol's needs."/>
      <DocStep n={3} title="Fund and monitor" desc="Track paper progress, ARS scores, and download metrics in real time."/>
      <DocStep n={4} title="Receive deliverables" desc="Open-access papers published under your protocol's sponsorship. Real academic credibility."/>
    </DocSection>
    <DocSection title="Pricing">
      <div className="grid-2" style={{gap:14}}>
        {[{name:"Pilot",price:"$20K–50K",desc:"90-day research pilot. One topic. 3–5 researchers."},{name:"Track",price:"$100K–300K",desc:"6-month full research track. Lab partnership."},{name:"Cohort Sponsor",price:"$250K+",desc:"Co-brand an entire Builder Cohort cycle."}].map(p=>(
          <div key={p.name} className="stat-card">
            <div className="stat-label">{p.name}</div>
            <div className="stat-value" style={{fontSize:20,color:"#E8323C",marginBottom:6}}>{p.price}</div>
            <div style={{fontSize:13,color:"#6B6B7A"}}>{p.desc}</div>
          </div>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

export default DocsProtocolsPage;