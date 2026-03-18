// ═══════════════════════════════════════════════════════════
// LAB PROFILE

import Link from "next/link";
import { SEED_PAPERS } from "@/data/seed";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const LabProfilePage = ({ lab }: { lab: any }) => {
  if (!lab) return null;
  const labPapers = SEED_PAPERS.filter((p) => p.lab === lab.name);
  const realCount = labPapers.length || lab.papers;
  return (
    <div>
      <div className="page-wrap section">
        <Link href="/labs" className="link-arrow" style={{ marginBottom: 20 }}>
          ← Back to Labs
        </Link>
        <div className="path-badge">/root/network/labs/{lab.id}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <h1 style={{ fontSize: 42 }}>{lab.name}</h1>
          <span className="ftag" style={{ background: lab.active ? "#D4EDDA" : "#F5DDE0" }}>
            {lab.active ? "Active" : "Inactive"}
          </span>
        </div>
        <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>{lab.focus}</p>
        <hr className="divider" />
        <div className="grid-2" style={{ gap: 22 }}>
          <div>
            <WindowCard label="LAB_OVERVIEW.SYS">
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{lab.description}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {lab.tags.map((t: string) => (
                  <span key={t} className="topic-pill">
                    {t}
                  </span>
                ))}
              </div>
              <hr className="divider-sm" />
              <div style={{ fontSize: 13, color: "#6B6B7A" }}>Partners: {lab.partners.join(", ")}</div>
            </WindowCard>
            <WindowCard label="RESEARCHERS.SYS" style={{ marginTop: 20 }}>
              {lab.researchers.map((r: string) => (
                <div key={r} className="lb-row">
                  <div className="lb-avatar">{r.charAt(0)}</div>
                  <div className="lb-name">{r}</div>
                </div>
              ))}
            </WindowCard>
          </div>
          <div>
            <WindowCard label="METRICS.SYS" style={{ marginBottom: 20 }}>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="stat-card">
                  <div className="stat-label">Papers Indexed</div>
                  <div className="stat-value">{realCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Researchers</div>
                  <div className="stat-value">{lab.researchers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Partners</div>
                  <div className="stat-value">{lab.partners.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Status</div>
                  <div className="stat-value" style={{ fontSize: 18, color: lab.active ? "#15803D" : "#E8323C" }}>
                    {lab.active ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            </WindowCard>
            <WindowCard label="LAB_PAPERS.SYS" bodyClass="window-body window-body-blue">
              {labPapers.length === 0 ? (
                <p style={{ color: "#6B6B7A", fontSize: 14 }}>No indexed papers yet.</p>
              ) : (
                labPapers.map((p) => (
                  <Link key={p.id} href={`/paper/${p.id}`}>
                    <div className="archive-row" style={{ marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div className="archive-title" style={{ fontSize: 14 }}>
                          {p.title}
                        </div>
                        <div className="archive-meta">
                          {p.year} // {p.topic}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
              {lab.active && (
                <Link
                  href="/cohorts"
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", marginTop: 12, justifyContent: "center", display: "inline-flex" }}
                >
                  View Open Cohorts →
                </Link>
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabProfilePage;
