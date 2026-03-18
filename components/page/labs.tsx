// ═══════════════════════════════════════════════════════════
// LABS PAGE

import { SEED_LABS, SEED_PAPERS } from "@/data/seed";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";
import { IconLabsSmall } from "../Icons";

// ═══════════════════════════════════════════════════════════
const LabsPage = ({ setPage, setSelectedLab }: { setPage: (page: string) => void; setSelectedLab: (lab: any) => void }) => {
  const sorted = [...SEED_LABS].sort((a,b) => (b.active?1:0)-(a.active?1:0));
  // Compute real paper counts from SEED_PAPERS
  const paperCount = (labName: string) => SEED_PAPERS.filter(p=>p.lab===labName).length;
  return (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network/labs</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Research Labs</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>Partner institutions producing open research.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22}}>
        {sorted.map(lab=>(
          <div key={lab.id} className="archive-row" style={{flexDirection:"column",alignItems:"flex-start",cursor:"pointer",opacity:lab.active?1:0.55}} onClick={()=>{setSelectedLab(lab);setPage("lab-profile");}}>
            <div style={{display:"flex",alignItems:"center",gap:12,width:"100%"}}>
              <div className="archive-icon" style={{background:"#EAF0F6"}}><IconLabsSmall/></div>
              <div style={{flex:1}}>
                <div className="archive-title">{lab.name}</div>
                <div className="archive-meta">{lab.focus}</div>
              </div>
              <span className={`ftag`} style={{background:lab.active?"#D4EDDA":"#F5DDE0"}}>{lab.active?"Active":"Inactive"}</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
              {lab.tags.map(t=><span key={t} className="ftag">{t}</span>)}
            </div>
            <div style={{fontSize:13,color:"#6B6B7A",marginTop:8}}>
              {paperCount(lab.name) || lab.papers} papers indexed
              {!lab.active && <span style={{marginLeft:8,color:"#E8323C",fontWeight:600}}>· Not accepting new research</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:44}}>
        <WindowCard label="JOIN_NETWORK.SYS" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:10}}>Is Your Lab on AthenaX?</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:18}}>We partner with research labs worldwide. Apply to join the network — get access to protocol sponsors, bounty funding, and the builder cohort pipeline.</p>
          <button className="btn btn-primary" onClick={()=>setPage("apply-lab")}>Apply as a Lab →</button>
        </WindowCard>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
  );
};

export default LabsPage;