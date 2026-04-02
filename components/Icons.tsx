// ═══════════════════════════════════════════════════════════
// ICON REGISTRY — /components/icons.jsx
// All product icons as pure SVG. Consistent 24×24 viewBox,
// 2px stroke, round joins/caps — matches Lucide visual language.
// Container sizing/colors stay in .icon-tile CSS (unchanged).
// ═══════════════════════════════════════════════════════════

// Research Labs — flask / beaker silhouette
const IconLabs = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6" />
    <path d="M9 3v6l-4 9a1 1 0 0 0 .9 1.45h12.2A1 1 0 0 0 21 18l-4-9V3" />
    <line x1="6.5" y1="14" x2="17.5" y2="14" />
  </svg>
);

// Universities — columned building / institution
const IconUniversities = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M3 10h18" />
    <path d="M5 10V6l7-3 7 3v4" />
    <rect x="5" y="10" width="4" height="11" />
    <rect x="10" y="10" width="4" height="11" />
    <rect x="15" y="10" width="4" height="11" />
  </svg>
);

// Protocol Sponsors — network nodes / hexagonal links
const IconSponsors = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <line x1="12" y1="7" x2="5" y2="17" />
    <line x1="12" y1="7" x2="19" y2="17" />
    <line x1="7" y1="19" x2="17" y2="19" />
  </svg>
);

// Talent Marketplace — person with upward arrow / pipeline
const IconTalent = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
    <path d="M16 18l3-3 3 3" />
    <line x1="19" y1="21" x2="19" y2="15" />
  </svg>
);

// Researchers (home page) — graduation cap / diploma
const IconResearchers = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
  </svg>
);

// Protocols (home page) — circuit / hex node
const IconProtocols = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 19.5 6 19.5 14 12 18 4.5 14 4.5 6" />
    <line x1="12" y1="2" x2="12" y2="18" />
    <line x1="4.5" y1="6" x2="19.5" y2="14" />
    <line x1="19.5" y1="6" x2="4.5" y2="14" />
  </svg>
);

// Builders (home page) — wrench + code bracket
const IconBuilders = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="2 2" />
  </svg>
);

// Sponsored Programs — document + dollar / contract
const IconSponsoredPrograms = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
  </svg>
);

// Research Bounties — target crosshair
const IconBounties = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" fill={color} />
    <line x1="12" y1="2" x2="12" y2="7" />
    <line x1="12" y1="17" x2="12" y2="22" />
    <line x1="2" y1="12" x2="7" y2="12" />
    <line x1="17" y1="12" x2="22" y2="12" />
  </svg>
);

// Builder Cohort Fees — layered stages / pipeline
const IconCohortFees = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 12l10 5 10-5" />
    <path d="M2 17l10 5 10-5" />
  </svg>
);

// Terminal Subscriptions — terminal prompt / monitor
const IconTerminal = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="8 9 4 12 8 15" />
    <line x1="12" y1="15" x2="20" y2="15" />
  </svg>
);

// Talent Placement — person + checkmark / confirmed hire
const IconTalentPlacement = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <polyline points="16 11 17.5 13 21 10" />
  </svg>
);

// Startup Equity — chart trending up / investment growth
const IconStartupEquity = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

// Labs row icon (small, 42×42 archive-icon context) — same flask
const IconLabsSmall = ({ color = "#1C1C27" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6" />
    <path d="M9 3v6l-4 9a1 1 0 0 0 .9 1.45h12.2A1 1 0 0 0 21 18l-4-9V3" />
    <line x1="6.5" y1="14" x2="17.5" y2="14" />
  </svg>
);

// Talent row icon (small, 42×42 archive-icon context)
const IconTalentSmall = ({ color = "#1C1C27" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4" />
    <path d="M16 18l3-3 3 3" />
    <line x1="19" y1="21" x2="19" y2="15" />
  </svg>
);

// Paper document icon (small, used in profile page)
const IconPaperSmall = ({ color = "#1C1C27" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
  </svg>
);

// Briefcase icon (small, used in talent page rows)
const IconBriefcaseSmall = ({ color = "#1C1C27" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="8" y1="14" x2="16" y2="14" />
  </svg>
);

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, className = "" }) => {
  const icons: Record<string, React.ReactElement> = {
    terminal: <path d="M4 17l6-6-6-6M12 19h8" />,
    folder: <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />,
    file: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
    play: <path d="M5 3l14 9-14 9V3z" />,
    arrow: <path d="M5 12h14M12 5l7 7-7 7" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    x: <path d="M18 6L6 18M6 6l12 12" />,
    check: <path d="M20 6L9 17l-5-5" />,
    sparkle: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] || icons.sparkle}
    </svg>
  );
};

const MediaIcon = ({ type }: { type: string }) => {
  if (type === "Video")
    return (
      <div className="archive-icon" style={{ background: "#EAF0F6" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polygon points="5,3 13,8 5,13" fill="#1C1C27" />
        </svg>
      </div>
    );
  if (type === "Log")
    return (
      <div className="archive-icon" style={{ background: "#1C1C27" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <text x="2" y="12" fontSize="11" fill="#F2EFE9" fontFamily="monospace">
            &gt;_
          </text>
        </svg>
      </div>
    );
  // Essay / default
  return (
    <div className="archive-icon" style={{ background: "#F9F5DC" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="1" stroke="#1C1C27" strokeWidth="1.5" />
        <line x1="5" y1="5" x2="11" y2="5" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="11" x2="9" y2="11" stroke="#1C1C27" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

const ContentIcon = ({ kind }: { kind: string }) => (
  <div className="archive-icon" style={{ background: kind === "research" ? "#EAF0F6" : "#F9F5DC" }}>
    {kind === "research" ? (
      <IconLabsSmall />
    ) : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="1" stroke="#1C1C27" strokeWidth="1.5" />
        <line x1="5" y1="5" x2="11" y2="5" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="11" x2="9" y2="11" stroke="#1C1C27" strokeWidth="1.2" />
      </svg>
    )}
  </div>
);

const AthenaXMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="28" rx="6" fill="#1C1C27" />
    <path
      d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14C21 17.866 17.866 21 14 21C10.134 21 7 17.866 7 14Z"
      stroke="#F2EFE9"
      strokeWidth="2"
    />
    <path d="M10 14C10 12.343 11.343 11 13 11H15C16.657 11 18 12.343 18 14C18 15.657 16.657 17 15 17H13C11.343 17 10 15.657 10 14Z" fill="#F5D94E" />
  </svg>
);

export {
  IconLabs,
  IconUniversities,
  IconSponsors,
  IconTalent,
  IconResearchers,
  IconProtocols,
  IconBuilders,
  IconSponsoredPrograms,
  IconBounties,
  IconCohortFees,
  IconTerminal,
  IconTalentPlacement,
  IconStartupEquity,
  IconLabsSmall,
  IconTalentSmall,
  IconPaperSmall,
  IconBriefcaseSmall,
  MediaIcon,
  ContentIcon,
  AthenaXMark,
};

export default Icon;
