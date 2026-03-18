// ═══════════════════════════════════════════════════════════
// MEDIA DETAIL PAGE

import Link from "next/link";
import { SEED_MEDIA } from "@/data/seed";
import WindowCard from "../ui/WindowCard";
import { MediaIcon } from "../Icons";

// ═══════════════════════════════════════════════════════════
const MediaPage = ({ mediaId }: { mediaId: string }) => {
  const item = SEED_MEDIA.find((m) => m.id === mediaId);
  if (!item)
    return (
      <div className="page-wrap section">
        <p>Not found.</p>
      </div>
    );
  return (
    <div>
      <div className="page-wrap section">
        <Link href="/archive" className="link-arrow" style={{ marginBottom: 20, marginRight: 12 }}>
          ← Back to Archive
        </Link>
        <div className="path-badge">/root/archive/{item.slug}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <MediaIcon type={item.type} />
          <span className="topic-pill">{item.type}</span>
          <span style={{ fontSize: 13, color: "#6B6B7A", fontFamily: "'Space Mono',monospace" }}>{item.date}</span>
        </div>
        <h1 style={{ fontSize: 42, marginBottom: 28 }}>{item.title}</h1>
        {item.type === "Video" && (
          <div
            style={{
              marginBottom: 28,
              background: "#1C1C27",
              borderRadius: 14,
              border: "2px solid #1C1C27",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "5px 5px 0 #1C1C27",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 20,12 8,19" fill="white" />
                </svg>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
                CLICK TO PLAY (DEMO)
              </div>
            </div>
          </div>
        )}
        <WindowCard label={`${item.type.toUpperCase()}_CONTENT.TXT`}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1C1C27" }}>{item.body}</p>
        </WindowCard>
      </div>
    </div>
  );
};

export default MediaPage;
