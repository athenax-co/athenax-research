// ═══════════════════════════════════════════════════════════
// UNIVERSITIES PAGE

import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const UniversitiesPage = ({ setPage }: { setPage: (page: string) => void }) => {
  const unis = [
    {name:"MIT",            country:"USA",     labs:2, focus:"Digital currencies, AI agents"},
    {name:"Stanford",       country:"USA",     labs:1, focus:"Blockchain protocols, cryptography"},
    {name:"Oxford",         country:"UK",      labs:1, focus:"Governance, internet & society"},
    {name:"ETH Zurich",     country:"CH",      labs:1, focus:"Consensus, formal verification"},
    {name:"Imperial College",country:"UK",     labs:1, focus:"Applied protocol engineering"},
    {name:"Harvard",        country:"USA",     labs:1, focus:"Digital currency, economics"},
    {name:"Columbia",       country:"USA",     labs:1, focus:"EVM, developer tooling"},
    {name:"Caltech",        country:"USA",     labs:1, focus:"Distributed systems"},
  ];
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/network/universities</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Universities</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Institutional academic partners.</p>
        <hr className="divider"/>
        <div className="grid-3" style={{gap:20}}>
          {unis.map(u=>(
            <WindowCard key={u.name} label={`UNI: ${u.name.toUpperCase()}`}>
              <h3 style={{fontSize:20,marginBottom:6}}>{u.name}</h3>
              <div style={{fontSize:13,color:"#6B6B7A",marginBottom:12}}>{u.country} · {u.labs} lab{u.labs>1?"s":""}</div>
              <p style={{fontSize:14,color:"#1C1C27",lineHeight:1.5}}>{u.focus}</p>
            </WindowCard>
          ))}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default UniversitiesPage;