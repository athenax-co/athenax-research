// ═══════════════════════════════════════════════════════════
// POST BOUNTY PAGE

import { useState } from "react";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const PostBountyPage = ({ setPage, user, showToast }: { setPage: (page: string) => void; user: any; showToast: (text: string, type: string) => void }) => {
  const [form,setForm] = useState({title:"",sponsor:"",reward:"",deadline:"",topic:"ZK Proofs"});
  const set = (k: string) => (e: { target: { value: any; }; }) => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!user||user.role!=="sponsor"){showToast("Only sponsors can post bounties.","error");return;}
    if(!form.title||!form.reward){showToast("Please fill in all fields.","error");return;}
    showToast("Bounty posted! (Demo — not persisted)","success"); setPage("bounties");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/funding/post-bounty</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Post a Bounty</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Sponsors only. Define a research challenge and reward.</p>
        <hr className="divider"/>
        <WindowCard label="NEW_BOUNTY.FORM">
          <div className="inp-group"><label className="inp-label">Bounty Title</label><input className="inp" value={form.title} onChange={set("title")} placeholder="ZK proof optimization for…"/></div>
          <div className="inp-group"><label className="inp-label">Sponsor Name</label><input className="inp" value={form.sponsor} onChange={set("sponsor")} placeholder="Your protocol name"/></div>
          <div className="inp-group"><label className="inp-label">Reward (USD)</label><input className="inp" value={form.reward} onChange={set("reward")} placeholder="$25,000"/></div>
          <div className="inp-group"><label className="inp-label">Deadline</label><input className="inp" type="date" value={form.deadline} onChange={set("deadline")}/></div>
          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {["ZK Proofs","DAO Governance","DeFi","Tokenomics","AI Agents","Protocol Economics","Security","Digital Nations"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={submit}>Post Bounty →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default PostBountyPage;