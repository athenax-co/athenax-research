"use client";

import { subscriberSvc } from "@/utils/lib";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { _globalShowToast, useGlobal } from "@/components/GlobalProvider";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/layout/BrandLogo";
import { IconDiscord, IconInstagram, IconLinkedIn, IconX, IconYouTube } from "../Icons";

const NAV_COLS = [
  {
    label: "Discover",
    links: [
      { href: "/launch", text: "Launch" },
      { href: "/archive", text: "Research" },
      { href: "/leaderboard", text: "Leaderboard", disabled: true },
      { href: "/roadmap", text: "Roadmap" },
    ],
  },
  {
    label: "Submit",
    links: [
      { href: "/launch?submit", text: "Submit Product" },
      { href: "/paper/submit", text: "Submit a Paper", disabled: true },
    ],
  },
  {
    label: "Company",
    links: [
      { href: "/about", text: "About", disabled: true },
      { href: "/how-it-works", text: "How It Works", disabled: true },
      { href: "/digest", text: "Research Digest", disabled: true },
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
          <div className="font-bold text-[17px] mb-1">Weekly Newsletter</div>
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

const SOCIAL_LINKS = [
  { href: "https://x.com/athenax_co", label: "X", Icon: IconX },
  { href: "https://discord.com/invite/RURu4tTjHZ", label: "Discord", Icon: IconDiscord },
  { href: "https://www.youtube.com/@AthenaX_co", label: "YouTube", Icon: IconYouTube },
  { href: "https://www.linkedin.com/company/athenaxco/", label: "LinkedIn", Icon: IconLinkedIn },
  { href: "https://www.instagram.com/athenax_co/", label: "Instagram", Icon: IconInstagram, size: 20 },
];

const FooterSubmitLink = ({ href, text }: { href: string; text: string }) => {
  const { openSubmitProductModal } = useGlobal();

  if (href === "/launch?submit") {
    return (
      <button
        onClick={() => openSubmitProductModal()}
        className="block text-sm text-ink mb-2.25 hover:text-danger text-left cursor-pointer"
      >
        {text}
      </button>
    );
  }

  return (
    <Link href={href} className="block text-sm text-ink mb-2.25 hover:text-danger">
      {text}
    </Link>
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
          <BrandLogo className="mb-2" wordmarkClassName="text-[26px]" />
          <div className="text-sm text-ink leading-relaxed">Where New Products Begin.</div>
          <div className="flex items-center gap-4 mt-4">
            {SOCIAL_LINKS.map((social) => {
              const IconComponent = social.Icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-danger transition-colors"
                  aria-label={social.label}
                >
                  <IconComponent size={social.size ?? 24} />
                </Link>
              );
            })}
          </div>
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
                  <FooterSubmitLink key={link.href} href={link.href} text={link.text} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-7xl text-[10px] mx-auto px-10 font-sans text-muted flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10 mt-11 pt-5.5 border-t border-[#D8D4CC] tracking-[0.04em]">
        <span>CC0 /// NO RIGHTS RESERVED /// OPEN SOURCE</span>
        <div className="flex items-center gap-1.5">
          <span className="uppercase">Powered by</span>
          <Link href="https://nouns.wtf/" target="_blank" rel="noopener noreferrer">
            <Image src="https://athenax.mypinx.store/Noggles.png" alt="Noggles" width={56} height={16} className="h-4 w-auto" />
          </Link>
          {/* <span className="uppercase">Nouns</span> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
