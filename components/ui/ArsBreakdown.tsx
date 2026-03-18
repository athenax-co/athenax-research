// ═══════════════════════════════════════════════════════════
// ARS BREAKDOWN

import { calcARS } from "@/lib/db-helper";

// ═══════════════════════════════════════════════════════════
const ArsBreakdown = ({ r }: { r: any }) => {
  const comps = [
    {label:"Citations",            weight:0.30, value:r.citations||0,           max:null},
    {label:"Peer Reviews",         weight:0.25, value:r.peerReviews||0,          max:null},
    {label:"Downloads",            weight:0.15, value:Math.min((r.downloads||0)/1000,20), max:20},
    {label:"Votes",                weight:0.15, value:Math.min((r.votes||0)/100,20),      max:20},
    {label:"Sponsor Endorsements", weight:0.10, value:r.sponsorEndorsements||0,  max:null},
    {label:"Bounty Completions",   weight:0.05, value:r.bountyCompletions||0,    max:null},
  ];
  const ars = calcARS(r);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:"0.06em",color:"#6B6B7A"}}>ARS SCORE</span>
        <span style={{fontSize:28,fontWeight:700,color:"#E8323C"}}>{ars}</span>
      </div>
      <div className="ars-bar-bg" style={{marginBottom:18}}><div className="ars-bar-fill" style={{width:`${(ars/10)*100}%`}}/></div>
      {comps.map(c=>{
        const contrib = parseFloat((c.value*c.weight).toFixed(2));
        return (
          <div key={c.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #D8D4CC",fontSize:13}}>
            <span style={{color:"#6B6B7A"}}>{c.label}</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontWeight:700}}>+{contrib}</span>
          </div>
        );
      })}
      <div style={{fontSize:11,color:"#6B6B7A",marginTop:12,fontFamily:"'Space Mono',monospace",letterSpacing:"0.04em"}}>
        FORMULA: citations×0.30 + peerReviews×0.25 + downloads×0.15 + votes×0.15 + endorsements×0.10 + bounties×0.05
      </div>
    </div>
  );
};

export default ArsBreakdown;