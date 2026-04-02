// ═══════════════════════════════════════════════════════════
// NAVBAR

import { useState } from "react";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "launch", label: "Launch" },
  { id: "archive", label: "Research" },
  { id: "researchers", label: "Researchers" },
  { id: "network", label: "Companies" },
  // { id: "funding", label: "Funding" },
  { id: "terminal", label: "Terminal" },
  { id: "docs", label: "Docs" },
];

const PATH_MAP: Record<string, string> = {
  home: "/",
  launch: "/launch",
  archive: "/archive",
  researchers: "/researchers",
  network: "/companies",
  funding: "/funding",
  docs: "/docs",
  terminal: "/terminal",
};

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

const NAV_DESCRIPTIONS: Record<string, string> = {
  home: "Platform overview & latest research",
  launch: "Research-backed products across frontier tech",
  archive: "Papers, essays, and knowledge archive",
  researchers: "ARS-scored researcher directory",
  network: "Labs, universities, and researchers",
  funding: "Bounties, sponsors, and cohorts",
  terminal: "Research intelligence platform",
  docs: "Guides and protocol documentation",
};

const Logo = () => (
  <Link className="nav-logo" href="/" aria-label="Go to AthenaX home">
    <div className="size-8 bg-gray-900 rounded text-white flex items-center justify-center text-lg shadow-sm p-1">
      <img src="https://athenax.mypinx.store/Logo_Icon_White.png" alt="AthenaX Logo" width={200} height={100} className="size-7 object-contain" />
    </div>
    <span
      style={{
        fontFamily: "var(--font-londrina), cursive",
        fontSize: 32,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: "#1C1C27",
      }}
    >
      AthenaX
    </span>
  </Link>
);

type NavbarUser = {
  avatar: string;
  name: string;
} | null;

const Navbar = ({ current, user, onAuthClick }: { current: string; user: NavbarUser; onAuthClick: (action: string) => void }) => {
  const activeNav = getActiveNav(current);
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Logo />
        <div className="nav-links">
          {NAV_ITEMS.map((n) => (
            <div key={n.id} style={{ position: "relative" }} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}>
              <Link href={PATH_MAP[n.id]} className={`nav-link${activeNav === n.id ? " active" : ""}`}>
                {n.label}
              </Link>
              {hovered === n.id && activeNav !== n.id && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1C1C27",
                    color: "#F2EFE9",
                    fontSize: 11,
                    fontFamily: "'Space Mono',monospace",
                    letterSpacing: "0.04em",
                    padding: "5px 10px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    zIndex: 200,
                    pointerEvents: "none",
                  }}
                >
                  {NAV_DESCRIPTIONS[n.id]}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <Link className="btn btn-ghost btn-sm" href="/profile">
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#F5D94E",
                    border: "1.5px solid #1C1C27",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {user.avatar}
                </span>
                {user.name.split(" ")[0]}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={() => onAuthClick("logout")}>
                Out
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => onAuthClick("register")}>
                Join Network →
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onAuthClick("login")}>
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
