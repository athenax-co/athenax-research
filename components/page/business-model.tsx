// ═══════════════════════════════════════════════════════════
// BUSINESS MODEL PAGE

import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const BusinessModelPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/business-model</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Business Model</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>How AthenaX sustains itself and the network it powers.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        <WindowCard label="REVENUE.SYS" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:18}}>Revenue Projections</h3>
          <div className="grid-2" style={{gap:12}}>
            {[{label:"Year 1",value:"$1.84M"},{label:"Year 2",value:"$6.18M"},{label:"Year 3",value:"$18.6M"},{label:"CAGR",value:"218%"}].map(s=>(
              <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:20}}>{s.value}</div></div>
            ))}
          </div>
        </WindowCard>
        <WindowCard label="MARGINS.SYS">
          <h3 style={{fontSize:22,marginBottom:18}}>Unit Economics</h3>
          <div className="grid-2" style={{gap:12}}>
            {[{label:"Gross Margin",value:"78%"},{label:"EBITDA (Y3)",value:"48%"},{label:"Break-even",value:"Mo. 26"},{label:"EBITDA+",value:"Mo. 22"}].map(s=>(
              <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:20}}>{s.value}</div></div>
            ))}
          </div>
        </WindowCard>
      </div>
      <WindowCard label="FUNDRAISE.SYS" bodyClass="window-body window-body-blue">
        <h3 style={{fontSize:22,marginBottom:16}}>Fundraising Roadmap</h3>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[{round:"Seed",amount:"$3M",use:"MVP + first 6 researchers + 2 sponsor pilots"},{round:"Series A",amount:"$12M",use:"Scale network, 3 regional hubs, full Terminal product"},{round:"Series B",amount:"$35–50M",use:"Global expansion, startup fund, protocol acquisitions"}].map(r=>(
            <div key={r.round} style={{flex:1,minWidth:200,padding:"16px",background:"#fff",border:"2px solid #1C1C27",borderRadius:10}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:4}}>{r.round.toUpperCase()}</div>
              <div style={{fontSize:24,fontWeight:700,color:"#E8323C",marginBottom:6}}>{r.amount}</div>
              <div style={{fontSize:13,color:"#6B6B7A",lineHeight:1.5}}>{r.use}</div>
            </div>
          ))}
        </div>
      </WindowCard>
      <div style={{marginTop:22}}>
        <WindowCard label="INVESTOR_TARGETS.SYS">
          <h3 style={{fontSize:20,marginBottom:14}}>Target Investors</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Paradigm","a16z crypto","Multicoin","Electric Capital","PL Ventures","Variant Fund","Delphi Digital"].map(i=>(
              <span key={i} className="ftag">{i}</span>
            ))}
          </div>
        </WindowCard>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

export default BusinessModelPage;