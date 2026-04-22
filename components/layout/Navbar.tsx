"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/lib";
import { NavAuthDesktop, NavAuthMobile, NavAuthMobileShortcut } from "@/components/layout/NavAuthButtons";
import BrandLogo from "@/components/layout/BrandLogo";

// ═══════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home", label: "Home", description: "Platform overview & latest research", href: "/" },
  { id: "launch", label: "Launch", description: "Research-backed products across frontier tech", href: "/launch" },
  { id: "archive", label: "Research", description: "Papers, essays, and knowledge archive", href: "/archive" },
  { id: "roadmap", label: "Roadmap", description: "What AthenaX is building now and next", href: "/roadmap" },
  // { id: "researchers", label: "Researchers", description: "ARS-scored researcher directory", href: "/researchers" },
  // { id: "network", label: "Companies", description: "Labs, universities, and researchers", href: "/companies" },
  // { id: "funding", label: "Funding", description: "Bounties, sponsors, and cohorts", href: "/funding" },
  // { id: "terminal", label: "Terminal", description: "Research intelligence platform", href: "/terminal" },
  // { id: "docs", label: "Docs", description: "Guides and protocol documentation", href: "/docs" },
];

const getPageKeyFromPathname = (pathname: string): string => {
  const segment = pathname.split("/")[1] || "home";
  return segment === "" ? "home" : segment;
};

const getActiveNav = (current: string) => {
  const page = current.startsWith("/") ? getPageKeyFromPathname(current) : current;

  if (["home", "business-model", "about", "dashboard", "sponsor"].includes(page)) return "home";
  if (["archive", "paper", "leaderboard", "reports", "roundtables", "digest"].includes(page)) return "archive";
  if (["roadmap", "how-it-works"].includes(page)) return "roadmap";
  if (["researchers"].includes(page)) return "researchers";
  if (["network", "companies", "labs", "lab-profile", "universities", "sponsors", "talent", "investors", "founders", "technology"].includes(page))
    return "network";
  if (["funding", "bounties", "post-bounty", "cohorts", "cohort"].includes(page)) return "funding";
  if (["terminal"].includes(page)) return "terminal";
  if (page.startsWith("docs")) return "docs";
  return page;
};

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="flex flex-col justify-center items-center w-5 h-5 gap-2">
    <span className={cn("block h-1 w-5 bg-ink rounded transition-all duration-200", open && "translate-y-2 rotate-45")} />
    <span className={cn("block h-1 w-5 bg-ink rounded transition-all duration-200", open && "opacity-0")} />
    <span className={cn("block h-1 w-5 bg-ink rounded transition-all duration-200", open && "-translate-y-2 -rotate-45")} />
  </div>
);

const Navbar = () => {
  const pathname = usePathname();
  const activeNav = getActiveNav(pathname);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-100 bg-cream border-b-2 border-ink h-17 flex items-center">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-5 md:px-10">
          <BrandLogo badge="beta" />

          {/* Desktop nav */}
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

          {/* Desktop auth */}
          <NavAuthDesktop />

          {/* Mobile: auth shortcut + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <NavAuthMobileShortcut />
            <button className="btn btn-ghost btn-sm px-2.5" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-17 z-99 bg-cream border-t-2 border-ink overflow-y-auto">
          <div className="px-5 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.id}
                href={n.href || `/${n.id === "home" ? "" : n.id}`}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex flex-col px-4 py-3.5 rounded-xl border-2 transition-all duration-100 no-underline",
                  activeNav === n.id ? "bg-yellow border-ink shadow-[3px_3px_0_#1C1C27]" : "border-transparent hover:border-ink/20 hover:bg-ink/5"
                )}
              >
                <span className="text-[16px] font-semibold text-ink">{n.label}</span>
              </Link>
            ))}

            <NavAuthMobile onCloseAction={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
