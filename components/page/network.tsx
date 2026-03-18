// ═══════════════════════════════════════════════════════════
// NETWORK PAGE
import Link from "next/link";
import WindowCard from "../ui/WindowCard";
import { IconLabs, IconSponsors, IconTalent, IconUniversities } from "../Icons";

// ═══════════════════════════════════════════════════════════
const NetworkPage = () => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network</div>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Research Network</h1>
      <p style={{ fontSize: 17, color: "#6B6B7A" }}>Universities, labs, and protocol ecosystems.</p>
      <hr className="divider" />
      <div className="grid-2" style={{ gap: 22, marginBottom: 44 }}>
        <WindowCard label="DIR: /LABS" bodyClass="window-body window-body-blue">
          <div className="icon-tile icon-tile-blue">
            <IconLabs />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Research Labs</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Partner labs producing credentialed open research. From MIT DCI to EF Research.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/labs">
            Open Directory →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /UNIVERSITIES" bodyClass="window-body window-body-yellow">
          <div className="icon-tile icon-tile-yellow">
            <IconUniversities />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Universities</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Institutional partnerships with the world's leading crypto-research universities.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/universities">
            Open Directory →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /SPONSORS" bodyClass="window-body">
          <div className="icon-tile icon-tile-green">
            <IconSponsors />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Protocol Sponsors</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Protocols funding the research that shapes their ecosystems.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/sponsors">
            Open Directory →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /TALENT" bodyClass="window-body">
          <div className="icon-tile icon-tile-pink">
            <IconTalent />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Talent Marketplace</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Roles and fellowships. Match researchers with protocol teams.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/talent">
            Open Directory →
          </Link>
        </WindowCard>
      </div>
    </div>
  </div>
);

export default NetworkPage;
