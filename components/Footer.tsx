"use client";

import { subscriberSvc } from "@/utils/lib";
import { useState } from "react";
import Link from "next/link";
import { _globalShowToast } from "./GlobalProvider";

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
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#15803D", letterSpacing: "0.05em" }}>✓ YOU&apos;RE IN</div>
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

const Footer = () => {
  return (
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
            <Link href="/archive" className="footer-link">
              Archive
            </Link>
            <Link href="/leaderboard" className="footer-link">
              Leaderboard
            </Link>
            <Link href="/paper/submit" className="footer-link">
              Submit a Paper
            </Link>
            <Link href="/funding/bounties" className="footer-link">
              Bounties
            </Link>
            <Link href="/funding/cohorts" className="footer-link">
              Cohorts
            </Link>
            <Link href="/launch" className="footer-link">
              Launch
            </Link>
          </div>
          <div>
            <div className="footer-col-label">Network</div>
            <Link href="/researchers" className="footer-link">
              Researchers
            </Link>
            <Link href="/labs" className="footer-link">
              Labs
            </Link>
            <Link href="/network/universities" className="footer-link">
              Universities
            </Link>
            <Link href="/sponsors" className="footer-link">
              Sponsors
            </Link>
            <Link href="/startups" className="footer-link">
              Companies
            </Link>
          </div>
          <div>
            <div className="footer-col-label">Resources</div>
            <Link href="/docs" className="footer-link">
              Docs
            </Link>
            <Link href="/digest" className="footer-link">
              Newsletter
            </Link>
            <Link href="/how-it-works" className="footer-link">
              How It Works
            </Link>
            <Link href="/about" className="footer-link">
              About
            </Link>
            <Link href="/business-model" className="footer-link">
              Business Model
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-legal">CC0 /// NO RIGHTS RESERVED /// OPEN SOURCE</div>
    </footer>
  );
};

export default Footer;
