// ═══════════════════════════════════════════════════════════
// ICON REGISTRY — /components/icons.jsx
// All product icons as pure SVG. Consistent 24×24 viewBox,
// 2px stroke, round joins/caps — matches Lucide visual language.
// Container sizing/colors stay in .icon-tile CSS (unchanged).
// ═══════════════════════════════════════════════════════════

// Research Labs — flask / beaker silhouette
const IconLabs = ({ size = 26, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6" />
    <path d="M10 3v6l-5.2 9.1A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-2.9L14 9V3" />
    <path d="M7.4 15h9.2" />
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

const IconNotification = ({ size = 18, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconAdmin = ({ size = 18, color = "#E8323C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="m5.64 5.64 1.41 1.41" />
    <path d="m16.95 16.95 1.41 1.41" />
    <path d="m5.64 18.36 1.41-1.41" />
    <path d="m16.95 7.05 1.41-1.41" />
  </svg>
);

const IconSponsorDashboard = ({ size = 18, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 18 10 12 16 6 10 12 4Z" />
    <path d="M12 8.5 13.5 10 12 11.5 10.5 10 12 8.5Z" />
  </svg>
);

const IconDashboardGrid = ({ size = 18, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="5" width="6" height="6" />
    <rect x="13" y="5" width="6" height="6" />
    <rect x="5" y="13" width="6" height="6" />
    <rect x="13" y="13" width="6" height="6" />
  </svg>
);

const IconShare = ({ size = 16, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5 15.4 17.5" />
    <path d="M15.4 6.5 8.6 10.5" />
  </svg>
);

const IconMore = ({ size = 15, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="5" cy="12" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="19" cy="12" r="1.75" />
  </svg>
);

const IconEdit = ({ size = 13, color = "#6B6B7A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="m16.5 3.5 4 4L7 21l-4 1 1-4 12.5-14.5Z" />
  </svg>
);

const IconTrash = ({ size = 13, color = "#E8323C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6v14H5V6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const IconPackageSmall = ({ size = 14, color = "#6B6B7A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 2 8 4v12l-8 4-8-4V6l8-4Z" />
    <path d="m4 6 8 4 8-4" />
    <path d="M12 10v12" />
  </svg>
);

const IconArrowUpRight = ({ size = 12, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const IconFileTextSmall = ({ size = 11, color = "#6B6B7A" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h8" />
    <path d="M8 9h2" />
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

import { ArticleTypeIcon } from "@/components/ui/ArticleMeta";

const ContentIcon = ({ kind, articleType }: { kind: string; articleType?: string }) => {
  if (kind === "article" && articleType) {
    return (
      <div className="archive-icon" style={{ background: "transparent" }}>
        <ArticleTypeIcon type={articleType} size={22} />
      </div>
    );
  }
  return (
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
};

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

const IconX = ({ size = 28, color = "#1C1C27" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 4l11.733 16h4.267l-11.733 -16l-4.267 0" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const IconDiscord = ({ size = 28, color = "#1C1C27" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
    <path d="M7 16.5c3.5 1 6.5 1 10 0" />
  </svg>
);

const IconYouTube = ({ size = 28, color = "#1C1C27" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" />
  </svg>
);

const IconInstagram = ({ size = 16, color = "#1C1C27" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
  >
    <path d="M11 0H5a5 5 0 0 0-5 5v6a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zm3.5 11c0 1.93-1.57 3.5-3.5 3.5H5c-1.93 0-3.5-1.57-3.5-3.5V5c0-1.93 1.57-3.5 3.5-3.5h6c1.93 0 3.5 1.57 3.5 3.5v6z" />
    <path d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6.5A2.503 2.503 0 0 1 5.5 8c0-1.379 1.122-2.5 2.5-2.5s2.5 1.121 2.5 2.5c0 1.378-1.122 2.5-2.5 2.5z" />
    <circle cx="12.3" cy="3.7" r=".533" />
  </svg>
);

const IconLinkedIn = ({ size = 28, color = "#1C1C27" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 11v5" />
    <path d="M8 8v.01" />
    <path d="M12 16v-5" />
    <path d="M16 16v-3a2 2 0 1 0 -4 0" />
    <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
  </svg>
);

const IconGithub = ({ size = 28, color = "#1C1C27" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.204 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.579.688.481A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
);

// Events — calendar
const IconEvents = ({ size = 24, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

// Gallery — image frame
const IconGallery = ({ size = 24, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="16" rx="2" />
    <circle cx="9" cy="9.5" r="1.6" />
    <path d="M20.5 15.5l-5-5-9.5 9.5" />
  </svg>
);

// Roadmap — route
const IconRoadmap = ({ size = 24, color = "#1C1C27" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="5.5" cy="18" r="2" />
    <circle cx="18.5" cy="6" r="2" />
    <path d="M7.5 18h6a3 3 0 0 0 0-6h-3a3 3 0 0 1 0-6h6" />
  </svg>
);

// External link — ↗
const IconExternal = ({ size = 16, color = "currentColor", className }: { size?: number; color?: string; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17L17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

export {
  IconEvents,
  IconGallery,
  IconRoadmap,
  IconExternal,
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
  IconNotification,
  IconAdmin,
  IconSponsorDashboard,
  IconDashboardGrid,
  IconShare,
  IconMore,
  IconEdit,
  IconTrash,
  IconPackageSmall,
  IconArrowUpRight,
  IconFileTextSmall,
  MediaIcon,
  ContentIcon,
  AthenaXMark,
  IconX,
  IconDiscord,
  IconYouTube,
  IconLinkedIn,
  IconInstagram,
  IconGithub,
};

export default Icon;
