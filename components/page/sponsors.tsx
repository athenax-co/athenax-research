import { SEED_SPONSORS } from "@/data/seed";
import WindowCard from "../ui/WindowCard";
import Footer from "../Footer";

const SponsorsPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network/sponsors</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Protocol Sponsors</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>Protocols funding the research that shapes their ecosystems.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        {SEED_SPONSORS.map(s=>(
          <WindowCard key={s.name} label={`SPONSOR: ${s.ticker}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <h3 style={{fontSize:20,marginBottom:4}}>{s.name}</h3>
                <span className="ftag">{s.category}</span>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:700,color:"#E8323C"}}>{s.amount}</div>
                <div style={{fontSize:12,color:"#6B6B7A"}}>{s.programs} programs</div>
              </div>
            </div>
            <hr className="divider-sm"/>
            <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{s.why}</p>
          </WindowCard>
        ))}
      </div>

      {/* Sponsor ROI panel */}
      <WindowCard label="SPONSOR_ROI.SYS" bodyClass="window-body window-body-blue" style={{marginBottom:22}}>
        <h3 style={{fontSize:22,marginBottom:16}}>What Sponsors Get</h3>
        <div className="grid-3" style={{gap:16,marginBottom:20}}>
          {[
            {label:"Avg. Paper Downloads",value:"3,200",sub:"per sponsored paper"},
            {label:"Avg. Citations (12mo)",value:"84",   sub:"across indexed papers"},
            {label:"Researcher Reach",    value:"1,847", sub:"active network members"},
          ].map(s=><div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:22}}>{s.value}</div><div className="stat-sub">{s.sub}</div></div>)}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Open-access papers under your brand","ARS-verified researcher talent","Real-time citation & download metrics","Cohort co-branding","Talent pipeline access","Protocol Briefing newsletter spotlight"].map(b=>(
            <span key={b} className="ftag" style={{fontSize:12}}>✓ {b}</span>
          ))}
        </div>
      </WindowCard>

      <WindowCard label="BECOME_SPONSOR.SYS" bodyClass="window-body window-body-yellow">
        <h3 style={{fontSize:24,marginBottom:12}}>Ready to Sponsor?</h3>
        <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Pilots start at $20K. Full research tracks from $100K. Cohort sponsorship from $250K. We'll match you to the right researchers within two weeks.</p>
        <button className="btn btn-primary" onClick={()=>setPage("sponsor-onboarding")}>Start a Conversation →</button>
      </WindowCard>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

export default SponsorsPage;