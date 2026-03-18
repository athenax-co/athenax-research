// ═══════════════════════════════════════════════════════════
// DIGEST / NEWSLETTER PAGE

import { NEWSLETTERS, SEED_MEDIA } from "@/data/seed";
import NewsletterCard from "../ui/NewsletterCard";
import { MediaIcon } from "../Icons";
import Link from "next/link";

// ═══════════════════════════════════════════════════════════
const DigestPage = ({ user }: { user: any }) => {
  const pastIssues = SEED_MEDIA.filter((m) => m.type === "Essay" || m.type === "Log").slice(0, 4);

  return (
    <div>
      <div className="page-wrap section section-stack-lg">
        <div className="section-heading">
          <div className="path-badge">/root/digest</div>
          <h1 style={{ fontSize: 48, marginBottom: 0 }}>Research Digest</h1>
          <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>Weekly dispatches from the AthenaX network. No noise, just signal.</p>
          <hr className="divider" />
        </div>

        {/* Subscription cards */}
        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 style={{ fontSize: 28, marginBottom: 0 }}>Choose Your Lists</h2>
            <p style={{ fontSize: 15, color: "#6B6B7A", marginBottom: 0 }}>Subscribe to one or all three. Unsubscribe any time.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {NEWSLETTERS.map((nl) => (
              <NewsletterCard key={nl.id} nl={nl} email={user?.email || ""} />
            ))}
          </div>
        </div>

        {/* Past issues */}
        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 style={{ fontSize: 28, marginBottom: 0 }}>Past Issues</h2>
            <p style={{ fontSize: 15, color: "#6B6B7A", marginBottom: 0 }}>The archive. Everything is CC0.</p>
          </div>
          {pastIssues.map((item) => (
            <Link key={item.id} href={`/media/${item.id}`} className="archive-row" style={{ textDecoration: "none", color: "inherit" }}>
              <MediaIcon type={item.type} />
              <div style={{ flex: 1 }}>
                <div className="archive-title">{item.title}</div>
                <div className="archive-meta">
                  {item.date} &nbsp;//&nbsp; {item.type}
                </div>
              </div>
              <span style={{ color: "#6B6B7A", fontSize: 18 }}>→</span>
            </Link>
          ))}
          <div style={{ marginTop: 16 }}>
            <Link href="/archive" className="link-arrow" style={{ display: "inline-block" }}>
              View Full Archive →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigestPage;
