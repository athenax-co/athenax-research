
// ═══════════════════════════════════════════════════════════
// NEWSLETTER CARD — reusable sub/unsub widget

import { subscriberSvc } from "@/utils/lib";
import { _globalShowToast } from "../AthenaX_Reborn";
import WindowCard from "./WindowCard";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════
const NewsletterCard = ({ nl, email }: { nl: any; email: string }) => {
  const [subbed, setSubbed] = useState(() => email ? subscriberSvc.isSubscribed(email, nl.id) : false);
  const [localEmail, setLocalEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    const addr = email || localEmail.trim();
    if (!addr || !addr.includes("@")) { _globalShowToast("Enter a valid email.", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      if (subbed) {
        subscriberSvc.unsubscribe(addr, nl.id);
        setSubbed(false);
        _globalShowToast(`Unsubscribed from ${nl.name}.`, "info");
      } else {
        const r = subscriberSvc.subscribe(addr, nl.id);
        if (r.error) { _globalShowToast(r.error, "error"); }
        else { setSubbed(true); _globalShowToast(`Subscribed to ${nl.name}!`, "success"); }
      }
      setLoading(false);
    }, 350);
  };

  return (
    <WindowCard label={`NEWSLETTER: ${nl.id.toUpperCase()}`} bodyClass={subbed ? "window-body window-body-yellow" : "window-body"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14}}>
        <div>
          <h3 style={{fontSize:20,marginBottom:4}}>{nl.name}</h3>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:10}}>{nl.freq.toUpperCase()}</div>
          <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{nl.desc}</p>
        </div>
        {subbed && (
          <div style={{flexShrink:0,background:"#D4EDDA",border:"1.5px solid #1C1C27",borderRadius:999,padding:"4px 12px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
            ✓ SUBSCRIBED
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {nl.tags.map((t: string) => <span key={t} className="ftag">{t}</span>)}
        <span className="ftag" style={{marginLeft:"auto",color:"#6B6B7A"}}>{(nl.count + (subbed ? 1 : 0)).toLocaleString()} readers</span>
      </div>
      <hr className="divider-sm"/>
      {!email && !subbed && (
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input className="inp" style={{flex:1,padding:"9px 12px",fontSize:13}} value={localEmail}
            onChange={e=>setLocalEmail(e.target.value)} placeholder="your@email.com"
            onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
      )}
      <button
        className={subbed ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
        style={{justifyContent:"center"}}
        onClick={handle} disabled={loading}>
        {loading ? <span className="spinner"/> : subbed ? "Unsubscribe" : "Subscribe →"}
      </button>
    </WindowCard>
  );
};

export default NewsletterCard;