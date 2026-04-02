// ═══════════════════════════════════════════════════════════
// NETWORK PAGE
import Link from "next/link";
import WindowCard from "../ui/WindowCard";
import { IconBuilders, IconLabs, IconResearchers, IconSponsors, IconTalent, IconUniversities } from "../Icons";

// ═══════════════════════════════════════════════════════════
const NetworkPage = () => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/companies</div>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Research Network</h1>
      <p style={{ fontSize: 17, color: "#6B6B7A" }}>Universities, labs, and companies across frontier technology.</p>
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
            Institutional partnerships with the world&apos;s leading research-focused universities.
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
            AI companies, infrastructure providers, and venture investors sponsoring the research that shapes the global AI stack.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/sponsors">
            Open Directory →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /RESEARCHERS" bodyClass="window-body window-body-yellow">
          <div className="icon-tile icon-tile-yellow">
            <IconResearchers />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Researcher Directory</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Browse ARS-scored researchers by topic and lab. Filter by cohort eligibility and hiring status.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/researchers">
            Browse Researchers →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /FOUNDERS" bodyClass="window-body">
          <div className="icon-tile icon-tile-pink">
            <IconBuilders />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Founders</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            ARS-scored founders who have launched research-backed products. Browse by sector, ARS score, and funding stage.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/founders">
            Browse Founders →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /INVESTORS">
          <div className="icon-tile icon-tile-green">
            <IconSponsors />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Investors</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Venture investors and funds using Terminal to discover pre-formation founders early.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/investors">
            Browse Investors →
          </Link>
        </WindowCard>
        <WindowCard label="DIR: /STARTUPS" bodyClass="window-body">
          <div className="icon-tile icon-tile-pink">
            <IconTalent />
          </div>
          <h3 style={{ fontSize: 22, marginBottom: 10 }}>Startup Marketplace</h3>
          <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 20 }}>
            Companies, products, protocols, and infrastructure. Each listing shows research lineage, launch history, and open roles.
          </p>
          <hr className="divider-sm" />
          <Link className="link-arrow" href="/technology">
            Browse Companies →
          </Link>
        </WindowCard>
      </div>
    </div>
  </div>
);

export default NetworkPage;
