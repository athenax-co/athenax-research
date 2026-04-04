"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/lib";
import { useGlobal } from "@/components/GlobalProvider";

// ═══════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home", label: "Home", description: "Platform overview & latest research", href: "/" },
  { id: "launch", label: "Launch", description: "Research-backed products across frontier tech", href: "/launch" },
  { id: "archive", label: "Research", description: "Papers, essays, and knowledge archive", href: "/archive" },
  { id: "researchers", label: "Researchers", description: "ARS-scored researcher directory", href: "/researchers" },
  { id: "network", label: "Companies", description: "Labs, universities, and researchers", href: "/companies" },
  // { id: "funding", label: "Funding", description: "Bounties, sponsors, and cohorts", href: "/funding" },
  { id: "terminal", label: "Terminal", description: "Research intelligence platform", href: "/terminal" },
  { id: "docs", label: "Docs", description: "Guides and protocol documentation", href: "/docs" },
];

const getPageKeyFromPathname = (pathname: string): string => {
  const segment = pathname.split("/")[1] || "home";
  return segment === "" ? "home" : segment;
};

const getActiveNav = (current: string) => {
  const page = current.startsWith("/") ? getPageKeyFromPathname(current) : current;

  if (["home", "how-it-works", "business-model", "about"].includes(page)) return "home";
  if (["archive", "paper", "leaderboard", "reports", "roundtables", "digest"].includes(page)) return "archive";
  if (["researchers"].includes(page)) return "researchers";
  if (["network", "companies", "labs", "lab-profile", "universities", "sponsors", "talent", "investors", "founders", "technology"].includes(page))
    return "network";
  if (["funding", "bounties", "post-bounty", "cohorts", "cohort"].includes(page)) return "funding";
  if (["terminal"].includes(page)) return "terminal";
  if (page.startsWith("docs")) return "docs";
  return page;
};

const Logo = () => (
  <Link className="flex items-center gap-2.5 font-bold text-[18px] text-ink no-underline" href="/" aria-label="Go to AthenaX home">
    <div className="size-8 bg-gray-900 rounded text-white flex items-center justify-center text-lg shadow-sm p-1">
      <img src="https://athenax.mypinx.store/Logo_Icon_White.png" alt="AthenaX Logo" width={200} height={100} className="size-7 object-contain" />
    </div>
    <span className="text-[32px] leading-none tracking-[-0.02em] text-ink" style={{ fontFamily: "var(--font-londrina), cursive" }}>
      AthenaX
    </span>
  </Link>
);

const Navbar = () => {
  const { user, handleAuthClick } = useGlobal();
  const pathname = usePathname();
  const activeNav = getActiveNav(pathname);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-100 bg-cream border-b-2 border-ink h-17 flex items-center">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-10">
        <Logo />
        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((n) => (
            <div key={n.id} className="relative" onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}>
              <Link
                href={n.href || `/${n.id === "home" ? "" : n.id}`}
                className={cn(
                  "px-4 py-2 text-[15px] font-medium text-ink rounded-full transition-all duration-100",
                  activeNav === n.id
                    ? "bg-yellow border-2 border-ink font-semibold shadow-[2px_2px_0_#1C1C27] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_#1C1C27]"
                    : "hover:bg-ink/7"
                )}
              >
                {n.label}
              </Link>
              {hovered === n.id && activeNav !== n.id && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-ink text-cream text-[11px] font-['Space_Mono',monospace] tracking-[0.04em] px-2 py-1 rounded-md whitespace-nowrap z-200 pointer-events-none">
                  {n.description}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link className="btn btn-ghost btn-sm" href="/profile">
                <span className="size-5 rounded-full bg-yellow border-[1.5px] border-ink inline-flex items-center justify-center text-[11px] font-bold">
                  {user.avatar}
                </span>
                {user.name.split(" ")[0]}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={() => handleAuthClick("logout")}>
                Out
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => handleAuthClick("register")}>
                Join Network →
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => handleAuthClick("login")}>
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
