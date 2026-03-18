// ═══════════════════════════════════════════════════════════
// ABOUT PAGE

import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const AboutPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/about</div>
      <h1 style={{fontSize:48,marginBottom:8}}>About AthenaX</h1>
      <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>The research and innovation engine of Web3.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        <WindowCard label="MISSION.TXT">
          <h3 style={{fontSize:22,marginBottom:14}}>Why We Exist</h3>
          <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:14}}>The best blockchain research sits locked inside university labs, unread by the protocol teams that need it most. And the best protocol problems sit unlisted, unknown to the researchers who could solve them.</p>
          <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27"}}>AthenaX is the coordination layer between them. We fund open research, score it objectively, and turn the most validated ideas into funded startups.</p>
        </WindowCard>
        <WindowCard label="VALUES.TXT" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:14}}>Principles</h3>
          {[
            ["Open by Default","All research published under CC0. No paywalls. No rights reserved."],
            ["Proof of Work","Reputation is earned through citations, peer reviews, and bounties — not credentials."],
            ["Public Goods First","The network exists to produce knowledge, not to capture it."],
            ["Onchain Everything","Funding, governance, and reputation flow onchain where possible."],
          ].map(([title,desc])=>(
            <div key={title} style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{title}</div>
              <div style={{fontSize:14,color:"#6B6B7A",lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </WindowCard>
      </div>
      <div style={{marginBottom:44}}>
        <h2 style={{fontSize:32,marginBottom:6}}>The Team</h2>
        <p style={{fontSize:15,color:"#6B6B7A",marginBottom:28}}>AthenaX is built by a small, focused team.</p>
        <WindowCard label="TEAM.SYS" bodyClass="window-body window-body-cream">
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {["Founder & CEO","Research Lead","Protocol Relations","Engineering","Design"].map(role=>(
              <div key={role} style={{padding:"16px 20px",background:"#fff",border:"2px solid #1C1C27",borderRadius:10,minWidth:160}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#F5D94E",border:"2px solid #1C1C27",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,marginBottom:10}}>?</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6B6B7A",letterSpacing:"0.06em",textTransform:"uppercase"}}>{role}</div>
              </div>
            ))}
          </div>
        </WindowCard>
      </div>
      <WindowCard label="CONTACT.SYS" bodyClass="window-body window-body-blue">
        <h3 style={{fontSize:22,marginBottom:12}}>Get in Touch</h3>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={()=>setPage("sponsor-onboarding")}>Become a Sponsor →</button>
          <button className="btn btn-outline" onClick={()=>setPage("apply-lab")}>Join as a Lab →</button>
          <button className="btn btn-ghost" onClick={()=>setPage("apply-cohort")}>Apply to Cohort →</button>
        </div>
      </WindowCard>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

export default AboutPage;