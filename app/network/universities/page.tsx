import WindowCard from "@/components/ui/WindowCard";

const UNIVERSITIES = [
  { name: "MIT", country: "USA", labs: 2, focus: "Digital currencies, AI agents" },
  { name: "Stanford", country: "USA", labs: 1, focus: "Blockchain protocols, cryptography" },
  { name: "Oxford", country: "UK", labs: 1, focus: "Governance, internet & society" },
  { name: "ETH Zurich", country: "CH", labs: 1, focus: "Consensus, formal verification" },
  { name: "Imperial College", country: "UK", labs: 1, focus: "Applied protocol engineering" },
  { name: "Harvard", country: "USA", labs: 1, focus: "Digital currency, economics" },
  { name: "Columbia", country: "USA", labs: 1, focus: "EVM, developer tooling" },
  { name: "Caltech", country: "USA", labs: 1, focus: "Distributed systems" },
] as const;

export default function Page() {
  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/network/universities</div>
      <h1 className="mb-2 text-5xl">Universities</h1>
      <p className="text-[17px] text-muted">Institutional academic partners.</p>

      <hr className="divider" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {UNIVERSITIES.map((university) => (
          <WindowCard key={university.name} label={`UNI: ${university.name.toUpperCase()}`}>
            <h3 className="mb-1.5 text-[20px]">{university.name}</h3>
            <div className="mb-3 text-[13px] text-muted">
              {university.country} · {university.labs} lab{university.labs > 1 ? "s" : ""}
            </div>
            <p className="text-sm leading-6 text-ink">{university.focus}</p>
          </WindowCard>
        ))}
      </div>
    </div>
  );
}
