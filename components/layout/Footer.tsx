"use client";

import { subscriberSvc } from "@/utils/lib";
import { useState } from "react";
import Link from "next/link";
import { _globalShowToast } from "@/components/GlobalProvider";
import { Button } from "@/components/ui/button";

const NAV_COLS = [
  {
    label: "Discover",
    links: [
      { href: "/launch", text: "Launch Feed" },
      { href: "/archive", text: "Research Archive" },
      { href: "/leaderboard", text: "Leaderboard", disabled: true },
      { href: "/roadmap", text: "Roadmap" },
    ],
  },
  {
    label: "Submit",
    links: [
      { href: "/launch", text: "Submit Product" },
      { href: "/paper/submit", text: "Submit a Paper" },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/about", text: "About" },
      { href: "/how-it-works", text: "How It Works" },
      { href: "/digest", text: "Newsletter" },
    ],
  },
];

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
    <div className="border-b border-[#D8D4CC] pb-10 mb-10">
      <div className="max-w-7xl mx-auto px-10 flex items-center justify-between gap-8 flex-wrap">
        <div>
          <div className="font-bold text-[17px] mb-1">Weekly Research Digest</div>
          <div className="text-sm text-muted">Top AI papers, bounties, and cohort news — every Monday.</div>
        </div>
        {done ? (
          <div className="font-mono text-xs text-green-700 tracking-[0.05em]">✓ YOU&apos;RE IN</div>
        ) : (
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 shrink-0">
            <input
              className="inp w-full sm:w-60! py-2.25! px-3.5! text-sm!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <Button size="sm" className="w-full sm:w-auto" onClick={submit}>
              Subscribe →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-cream border-t-2 border-ink pt-0 pb-7 mt-25">
      <div className="pt-12">
        <FooterSubscribe />
      </div>
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-start gap-10 flex-wrap">
        <div>
          <div className="text-[26px] font-bold text-ink mb-2">AthenaX</div>
          <div className="text-sm text-ink leading-relaxed">Where New Products Begin.</div>
        </div>
        <div className="flex gap-14 flex-wrap">
          {NAV_COLS.map((col) => (
            <div key={col.label}>
              <div className="text-[10px] font-bold tracking-widest uppercase text-ink mb-3.5">{col.label}</div>
              {col.links.map((link) =>
                link.disabled ? (
                  <span key={link.href} className="block text-sm text-muted mb-2.25 cursor-not-allowed" aria-disabled="true">
                    {link.text}
                  </span>
                ) : (
                  <Link key={link.href} href={link.href} className="block text-sm text-ink mb-2.25 hover:text-danger">
                    {link.text}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-10 font-mono text-[11px] text-muted text-center mt-11 pt-5.5 border-t border-[#D8D4CC] tracking-[0.04em]">
        CC0 /// NO RIGHTS RESERVED /// OPEN SOURCE
      </div>
    </footer>
  );
};

export default Footer;
