// ═══════════════════════════════════════════════════════════
// SPONSORS PAGE

import { useState } from "react";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const SponsorOnboardingPage = ({ setPage, user, showToast }: { setPage: (page: string) => void; user: any; showToast: (text: string, type: string) => void }) => {
  const [form,setForm] = useState({org:user?.organization||"",contact:user?.name||"",email:user?.email||"",model:"Sponsored Program",budget:"",focus:"",why:""});
  const set = (k: string) => (e: { target: { value: any; }; }) => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.org||!form.email||!form.why){showToast("Please fill in all required fields.","error");return;}
    showToast("Sponsorship enquiry submitted! We'll be in touch within 48 hours.","success");
    setPage("sponsors");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/sponsor/apply</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Become a Sponsor</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Fund credentialed research. Get academic credibility. Access top talent.</p>
        <hr className="divider"/>
        <WindowCard label="SPONSOR_ENQUIRY.FORM">
          <div className="inp-group"><label className="inp-label">Protocol / Organisation *</label><input className="inp" value={form.org} onChange={set("org")} placeholder="e.g. Scroll, Aztec, Starknet"/></div>
          <div className="inp-group"><label className="inp-label">Contact Name *</label><input className="inp" value={form.contact} onChange={set("contact")} placeholder="Your name"/></div>
          <div className="inp-group"><label className="inp-label">Email *</label><input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="you@protocol.io"/></div>
          <div className="inp-group">
            <label className="inp-label">Funding Model</label>
            <select className="inp" value={form.model} onChange={set("model")}>
              <option>Sponsored Program</option>
              <option>Research Bounty</option>
              <option>Cohort Sponsor</option>
              <option>Pilot ($20K–50K)</option>
            </select>
          </div>
          <div className="inp-group"><label className="inp-label">Estimated Budget</label><input className="inp" value={form.budget} onChange={set("budget")} placeholder="e.g. $50,000"/></div>
          <div className="inp-group"><label className="inp-label">Research Focus Area</label><input className="inp" value={form.focus} onChange={set("focus")} placeholder="e.g. ZK proofs, DAO governance, tokenomics"/></div>
          <div className="inp-group"><label className="inp-label">Why do you want to sponsor research? *</label><textarea className="inp" rows={3} value={form.why} onChange={set("why")} placeholder="What problem are you trying to solve or understand?"/></div>
          <div style={{background:"#F2EFE9",border:"1.5px solid #D8D4CC",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#6B6B7A",marginBottom:16}}>
            Typical turnaround: 48-hour response, 2-week scoping call, 30-day pilot launch.
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Submit Enquiry →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default SponsorOnboardingPage;