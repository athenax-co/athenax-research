import { subscriberSvc } from "@/utils/lib";
import { useState } from "react";
import { _globalShowToast } from "./AthenaX_Reborn";

export const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = () => {
    if (!email.includes("@")) {
      _globalShowToast("Enter a valid email.", "error");
      return;
    }
    const r = subscriberSvc.subscribe(email.trim(), "weekly-digest");
    if (r.error) {
      _globalShowToast("Already subscribed!", "info");
    } else {
      setDone(true);
      _globalShowToast("Subscribed to the Weekly Digest!", "success");
    }
  };
  return (
    <div style={{ borderBottom: "1px solid #D8D4CC", paddingBottom: 40, marginBottom: 40 }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Weekly Research Digest</div>
          <div style={{ fontSize: 14, color: "#6B6B7A" }}>Top AI papers, bounties, and cohort news — every Monday.</div>
        </div>
        {done ? (
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#15803D", letterSpacing: "0.05em" }}>✓ YOU'RE IN</div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <input
              className="inp"
              style={{ width: 240, padding: "9px 14px", fontSize: 14 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <button className="btn btn-primary btn-sm" onClick={submit}>
              Subscribe →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = ({ setPage }: { setPage: (page: string) => void }) => (
  <footer className="footer" style={{ paddingTop: 0 }}>
    <div style={{ paddingTop: 48 }}>
      <FooterSubscribe />{" "}
    </div>
    <div className="footer-inner">
      <div>
        <div className="footer-brand">AthenaX</div>
        <div className="footer-tagline">Where New Products Begin.</div>
      </div>
      <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
        <div>
          <div className="footer-col-label">Research</div>
          <button className="footer-link" onClick={() => setPage("archive")}>
            Archive
          </button>
          <button className="footer-link" onClick={() => setPage("leaderboard")}>
            Leaderboard
          </button>
          <button className="footer-link" onClick={() => setPage("submit-paper")}>
            Submit a Paper
          </button>
          <button className="footer-link" onClick={() => setPage("bounties")}>
            Bounties
          </button>
          <button className="footer-link" onClick={() => setPage("cohorts")}>
            Cohorts
          </button>
          <button className="footer-link" onClick={() => setPage("launch")}>
            Launch
          </button>
        </div>
        <div>
          <div className="footer-col-label">Network</div>
          <button className="footer-link" onClick={() => setPage("researchers")}>
            Researchers
          </button>
          <button className="footer-link" onClick={() => setPage("labs")}>
            Labs
          </button>
          <button className="footer-link" onClick={() => setPage("universities")}>
            Universities
          </button>
          <button className="footer-link" onClick={() => setPage("sponsors")}>
            Sponsors
          </button>
          <button className="footer-link" onClick={() => setPage("technology")}>
            Companies
          </button>
        </div>
        <div>
          <div className="footer-col-label">Resources</div>
          <button className="footer-link" onClick={() => setPage("docs")}>
            Docs
          </button>
          <button className="footer-link" onClick={() => setPage("digest")}>
            Newsletter
          </button>
          <button className="footer-link" onClick={() => setPage("how-it-works")}>
            How It Works
          </button>
          <button className="footer-link" onClick={() => setPage("about")}>
            About
          </button>
          <button className="footer-link" onClick={() => setPage("business-model")}>
            Business Model
          </button>
        </div>
      </div>
    </div>
    <div className="footer-legal">CC0 /// NO RIGHTS RESERVED /// OPEN SOURCE</div>
  </footer>
);

export default Footer;
