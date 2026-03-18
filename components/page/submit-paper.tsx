// ═══════════════════════════════════════════════════════════
// SUBMIT PAPER PAGE

import { useState } from "react";
import WindowCard from "../ui/WindowCard";
import Footer from "../Footer";

// ═══════════════════════════════════════════════════════════
const SubmitPaperPage = ({ setPage, user, showToast }: { setPage: (page: string) => void; user: any; showToast: (text: string, type: string) => void }) => {
  const [form,setForm] = useState({title:"",abstract:"",topic:"ZK Proofs",coauthors:"",university:user?.university||"",lab:user?.lab||"",year:new Date().getFullYear(),file:""});
  const set = (k: string) => (e: { target: { value: any; }; }) => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!user){showToast("Sign in to submit a paper.","error");return;}
    if(!form.title||!form.abstract){showToast("Title and abstract are required.","error");return;}
    showToast("Paper submitted for peer review! You'll hear back within 14 days.","success");
    setPage("archive");
  };
  if(!user) return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/submit</div>
        <h1 style={{fontSize:42,marginBottom:16}}>Submit a Paper</h1>
        <p style={{fontSize:17,color:"#6B6B7A",marginBottom:24}}>You need to be signed in as a researcher to submit.</p>
        <button className="btn btn-primary" onClick={()=>setPage("home")}>← Back to Home</button>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-md section">
        <div className="path-badge">/root/submit</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Submit a Paper</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Open-access. Peer-reviewed. ARS-scored on acceptance.</p>
        <hr className="divider"/>
        <WindowCard label="PAPER_SUBMISSION.FORM">
          <div className="inp-group"><label className="inp-label">Paper Title *</label><input className="inp" value={form.title} onChange={set("title")} placeholder="A descriptive, full title"/></div>
          <div className="inp-group"><label className="inp-label">Abstract *</label><textarea className="inp" rows={5} value={form.abstract} onChange={set("abstract")} placeholder="250–500 words. Summarise the problem, method, and key findings."/></div>
          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {["ZK Proofs","DAO Governance","DeFi","Tokenomics","AI Agents","Protocol Economics","Security","Digital Nations","Consensus","Privacy"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid-2" style={{gap:16}}>
            <div className="inp-group"><label className="inp-label">University / Institution</label><input className="inp" value={form.university} onChange={set("university")} placeholder="MIT, Oxford…"/></div>
            <div className="inp-group"><label className="inp-label">Research Lab</label><input className="inp" value={form.lab} onChange={set("lab")} placeholder="Your lab or group"/></div>
          </div>
          <div className="inp-group"><label className="inp-label">Co-Authors (optional)</label><input className="inp" value={form.coauthors} onChange={set("coauthors")} placeholder="Full names, comma-separated"/></div>
          <div className="inp-group"><label className="inp-label">Publication Year</label><input className="inp" type="number" value={form.year} onChange={set("year")} min="2020" max="2030"/></div>
          <div className="inp-group">
            <label className="inp-label">Paper File (PDF link or arXiv URL)</label>
            <input className="inp" value={form.file} onChange={set("file")} placeholder="https://arxiv.org/abs/…"/>
          </div>
          <div style={{background:"#F2EFE9",border:"1.5px solid #D8D4CC",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#6B6B7A",marginBottom:16,lineHeight:1.6}}>
            Submitted papers enter a 14-day blind peer review. Accepted papers are published open-access and immediately contribute to your ARS score. All work is CC0.
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Submit for Review →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default SubmitPaperPage;