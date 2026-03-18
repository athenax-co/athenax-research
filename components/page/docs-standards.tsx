import { DocSection, DocsShell } from "../ui/Docs";
import WindowCard from "../ui/WindowCard";

const DocsStandardsPage = () => (
  <DocsShell current="docs-standards" title="ARS Standards" subtitle="How reputation is calculated." fileTag="/root/docs/ars-standards">
    <DocSection title="AthenaX Reputation Score">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>The ARS is a composite score calculated from six verified data points. It is immutable once computed for a given snapshot, and updates every 24 hours.</p>
      <WindowCard label="ARS_WEIGHTS.SYS" bodyClass="window-body window-body-blue">
        {[["Citations","0.30","Number of citations from indexed papers"],["Peer Reviews","0.25","Number of completed peer reviews as reviewer"],["Downloads","0.15","Capped at 20k downloads"],["Votes","0.15","Community votes, capped at 2000"],["Sponsor Endorsements","0.10","Direct endorsements from verified protocol sponsors"],["Bounty Completions","0.05","Number of successfully completed bounties"]].map(([label,weight,desc])=>(
          <div key={label} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #D8D4CC",alignItems:"center"}}>
            <div style={{width:40,fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,color:"#E8323C"}}>{weight}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{label}</div><div style={{fontSize:12,color:"#6B6B7A"}}>{desc}</div></div>
          </div>
        ))}
      </WindowCard>
    </DocSection>
  </DocsShell>
);

export default DocsStandardsPage;