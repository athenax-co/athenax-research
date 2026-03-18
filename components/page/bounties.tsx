// ═══════════════════════════════════════════════════════════
// BOUNTIES PAGE

import { SEED_BOUNTIES } from "@/data/seed";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";
import { useState } from "react";
import { DB_KEYS, dbNow, dbRead, dbUid, dbWrite } from "@/lib/db-helper";

// ═══════════════════════════════════════════════════════════
const BountiesPage = ({ setPage, user, showToast }: { setPage: (page: string) => void; user: any; showToast: (message: string, type: string) => void }) => {
  const [applying,setApplying] = useState(null);
  const handleApply = (b: { id: any; title: any; sponsor?: string; reward?: string; deadline?: string; applicants?: number; topic?: string; status?: string; }) => {
    if(!user){showToast("Sign in to apply for bounties.","error");return;}
    setApplying(b.id);
    setTimeout(()=>{
      const apps=dbRead(DB_KEYS.APPLICATIONS);
      const exists=apps.find((a: { userId: any; bountyId: any; })=>a.userId===user.id&&a.bountyId===b.id);
      if(exists){showToast("Already applied.","info");setApplying(null);return;}
      dbWrite(DB_KEYS.APPLICATIONS,[...apps,{id:dbUid("app"),userId:user.id,bountyId:b.id,status:"pending",appliedAt:dbNow()}]);
      showToast(`Applied for: ${b.title}`,"success"); setApplying(null);
    },500);
  };
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/funding/bounties</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Open Bounties</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Open research challenges posted by protocol sponsors.</p>
        <hr className="divider"/>
        <div style={{display:"flex",gap:22,flexDirection:"column"}}>
          {SEED_BOUNTIES.map(b=>(
            <WindowCard key={b.id} label={`BOUNTY: ${b.id}`} bodyClass="window-body window-body-blue">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
                <div>
                  <h3 style={{fontSize:20,marginBottom:6}}>{b.title}</h3>
                  <div style={{display:"flex",gap:8}}>
                    <span className="topic-pill">{b.topic}</span>
                    <span className="ftag">{b.sponsor}</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:28,fontWeight:700,color:"#E8323C"}}>{b.reward}</div>
                  <div style={{fontSize:12,color:"#6B6B7A"}}>Deadline: {b.deadline}</div>
                </div>
              </div>
              <hr className="divider-sm"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:"#6B6B7A"}}>{b.applicants} applicants</span>
                <button className="btn btn-primary btn-sm" onClick={()=>handleApply(b)} disabled={applying===b.id}>
                  {applying===b.id?<span className="spinner"/>:"Apply →"}
                </button>
              </div>
            </WindowCard>
          ))}
        </div>
        <div style={{marginTop:44}}>
          <WindowCard label="POST_BOUNTY.SYS" bodyClass="window-body window-body-yellow">
            <h3 style={{fontSize:22,marginBottom:10}}>Post a Bounty</h3>
            <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:18}}>Protocols post research challenges. Researchers compete. Best work gets funded.</p>
            <button className="btn btn-primary" onClick={()=>setPage("post-bounty")}>Post a Bounty →</button>
          </WindowCard>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default BountiesPage;