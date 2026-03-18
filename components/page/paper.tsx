// ═══════════════════════════════════════════════════════════
// PAPER PAGE

import { SEED_PAPERS } from "@/data/seed";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";
import { MediaIcon } from "../Icons";
import ArsBreakdown from "../ui/ArsBreakdown";
import { useEffect, useState } from "react";

// ═══════════════════════════════════════════════════════════
const PaperPage = ({ paperId, setPage, user, showToast }: { paperId: string; setPage: (page: string) => void; user: any; showToast: Function }) => {
  const paper = SEED_PAPERS.find((p) => p.id === paperId);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  useEffect(() => {
    if (paper) setVoteCount(paper.votes);
  }, [paperId]);
  if (!paper)
    return (
      <div className="page-wrap section">
        <p>Paper not found.</p>
      </div>
    );

  const handleVote = () => {
    if (!user) {
      showToast("Sign in to vote.", "error");
      return;
    }
    if (voted) {
      showToast("Already voted.", "info");
      return;
    }
    setVoted(true);
    setVoteCount((v) => v + 1);
    showToast("Vote recorded!", "success");
  };

  return (
    <div>
      <div className="page-wrap section">
        <button className="link-arrow" onClick={() => setPage("archive")} style={{ marginBottom: 20 }}>
          ← Back to Archive
        </button>
        <div className="path-badge">/root/archive/{paper.id}</div>
        <h1 style={{ fontSize: 36, marginBottom: 16, letterSpacing: "-0.02em" }}>{paper.title}</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          <button
            className="topic-pill"
            style={{ cursor: "pointer", border: "none", fontFamily: "'Space Grotesk',sans-serif" }}
            onClick={() => setPage(`terminal:topic:${paper.topic}`)}
          >
            {paper.topic}
          </button>
          <span className="ftag">{paper.year}</span>
          <span className="ftag">{paper.lab}</span>
          <span className="ftag">{paper.university}</span>
        </div>
        <div className="grid-2" style={{ gap: 22 }}>
          <WindowCard label="ABSTRACT.TXT">
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1C1C27" }}>{paper.abstract}</p>
            <hr className="divider-sm" />
            <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 16 }}>Authors: {paper.authors.join(", ")}</div>
            <button
              className={voted ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              onClick={handleVote}
              style={voted ? { background: "#D4EDDA" } : {}}
            >
              {voted ? "✓ Voted" : "▲ Upvote"} &nbsp;·&nbsp; {voteCount.toLocaleString()}
            </button>
          </WindowCard>
          <div>
            <WindowCard label="METRICS.SYS" style={{ marginBottom: 20 }}>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="stat-card">
                  <div className="stat-label">Citations</div>
                  <div className="stat-value">{paper.citations}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Downloads</div>
                  <div className="stat-value">{paper.downloads.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Peer Reviews</div>
                  <div className="stat-value">{paper.peerReviews}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Review Score</div>
                  <div className="stat-value" style={{ color: "#E8323C" }}>
                    {paper.reviewScore}
                  </div>
                </div>
              </div>
            </WindowCard>
            <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow">
              <ArsBreakdown
                r={{
                  citations: paper.citations,
                  peerReviews: paper.peerReviews || 0,
                  downloads: paper.downloads,
                  votes: paper.votes,
                  sponsorEndorsements: 2,
                  bountyCompletions: 1,
                }}
              />
            </WindowCard>
          </div>
        </div>

        {/* Related research */}
        {(() => {
          const sameTopic = SEED_PAPERS.filter((p) => p.id !== paper.id && p.topic === paper.topic);
          const sameLab = SEED_PAPERS.filter((p) => p.id !== paper.id && p.lab === paper.lab && p.topic !== paper.topic);
          const related = [...sameTopic, ...sameLab].slice(0, 4);
          if (related.length === 0) return null;
          return (
            <div style={{ marginTop: 36 }}>
              <WindowCard label="RELATED_RESEARCH.SYS" bodyClass="window-body window-body-blue">
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                  PAPERS ON SAME TOPIC OR FROM SAME LAB
                </div>
                {related.map((p) => (
                  <div key={p.id} className="archive-row" onClick={() => setPage(`paper:${p.id}`)}>
                    <MediaIcon type="Essay" />
                    <div style={{ flex: 1 }}>
                      <div className="archive-title">{p.title}</div>
                      <div className="archive-meta">
                        {p.year} // {p.topic} // {p.lab}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#E8323C" }}>{p.citations}</div>
                      <div style={{ fontSize: 10, color: "#6B6B7A" }}>cites</div>
                    </div>
                  </div>
                ))}
              </WindowCard>
            </div>
          );
        })()}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

export default PaperPage;
