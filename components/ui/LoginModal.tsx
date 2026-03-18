// ═══════════════════════════════════════════════════════════
// LOGIN MODAL

import { useState } from "react";
import Modal from "./Modal";
import { authSvc } from "@/lib/db-helper";

// ═══════════════════════════════════════════════════════════
const LoginModal = ({ onClose, onSuccess, showToast }: { onClose: () => void; onSuccess: (user: any) => void; showToast: (message: string, type: string) => void }) => {
  const [email,setEmail] = useState("");
  const [pw,setPw] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const submit = () => {
    if(!email||!pw){setError("Please fill in all fields.");return;}
    setLoading(true); setError("");
    setTimeout(()=>{
      const r=authSvc.login(email,pw); setLoading(false);
      if(r.error){setError(r.error);return;}
      onSuccess(r.user); onClose(); showToast(`Welcome back, ${r.user.name.split(" ")[0]}!`,"success");
    },400);
  };

  return (
    <Modal title="SIGN_IN.SYS" onClose={onClose}>
      <div className="inp-group">
        <label className="inp-label">Email</label>
        <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" onKeyDown={e=>e.key==="Enter"&&submit()}/>
      </div>
      <div className="inp-group">
        <label className="inp-label">Password</label>
        <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>
      </div>
      {error && <div className="inp-error">{error}</div>}
      <button className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={submit} disabled={loading}>
        {loading ? <span className="spinner"/> : "Sign In →"}
      </button>
      <hr className="divider-sm" style={{margin:"18px 0 12px"}}/>
      <div style={{fontSize:11,color:"#6B6B7A",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:"0.04em"}}>DEMO ACCOUNTS</div>
      {authSvc.DEMO_ACCOUNTS.map(a=>(
        <button key={a.email} className="btn btn-ghost btn-sm" style={{width:"100%",marginBottom:6,justifyContent:"flex-start",fontSize:12}}
          onClick={()=>{setEmail(a.email);setPw(a.password);}}>
          {a.label}
        </button>
      ))}
    </Modal>
  );
};

export default LoginModal;