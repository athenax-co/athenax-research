import { DocSection, DocsShell, DocStep } from "../ui/Docs";


const DocsBuilderPage = () => (
  <DocsShell current="docs-builders" title="For Builders" subtitle="Turn research into products." fileTag="/root/docs/builders">
    <DocSection title="The Builder Pipeline">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Builders take validated research from the AthenaX archive and turn it into protocol-ready products. Each cohort runs 12 weeks with structured support, sponsor access, and prize pools.</p>
      <DocStep n={1} title="Browse Research" desc="Find validated papers with high ARS scores in your technical area."/>
      <DocStep n={2} title="Apply to a Cohort" desc="Submit a product concept based on existing AthenaX research."/>
      <DocStep n={3} title="Build in public" desc="12-week intensive. Weekly demos. Sponsor feedback."/>
      <DocStep n={4} title="Launch" desc="Graduate with distribution, funding, and community."/>
    </DocSection>
    <DocSection title="What You Get">
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["$20K stipend","Protocol introductions","Legal wrapper","Community distribution","12 weeks mentorship","Pitch day","Equity-free grants"].map(b=><span key={b} className="ftag">{b}</span>)}
      </div>
    </DocSection>
  </DocsShell>
);

export default DocsBuilderPage;