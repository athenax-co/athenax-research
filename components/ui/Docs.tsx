import Footer from "../Footer";

export const DOCS_NAV = [
  { id: "docs", label: "Overview" },
  { id: "docs-researchers", label: "For Researchers" },
  { id: "docs-protocols", label: "For Protocols" },
  { id: "docs-builders", label: "For Builders" },
  { id: "docs-standards", label: "ARS Standards" },
  { id: "docs-governance", label: "Governance" },
  { id: "docs-media", label: "Media Kit" },
];

const DocsSidebar = ({ current, setPage }: { current: string; setPage: (id: string) => void }) => (
  <div className="docs-sidebar">
    <div
      style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: 10,
        letterSpacing: "0.08em",
        color: "#6B6B7A",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      Documentation
    </div>
    {DOCS_NAV.map((item) => (
      <button key={item.id} className={`docs-sidebar-link${current === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
        {item.label}
      </button>
    ))}
  </div>
);

const DocsShell = ({
  current,
  setPage,
  children,
  title,
  subtitle,
  fileTag,
}: {
  current: string;
  setPage: (id: string) => void;
  children: React.ReactNode;
  title: string;
  subtitle: string;
  fileTag: string;
}) => (
  <div>
    <div className="page-wrap section">
      <div style={{ marginBottom: 18 }}>
        {fileTag && <div className="path-badge">{fileTag}</div>}
        <h1 style={{ fontSize: 42, marginBottom: 6 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 17, color: "#6B6B7A" }}>{subtitle}</p>}
      </div>
      <hr className="divider" />
      <div className="docs-layout">
        <DocsSidebar current={current} setPage={setPage} />
        <div className="docs-content">{children}</div>
      </div>
    </div>
    <Footer setPage={setPage} />
  </div>
);

const DocSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 36 }}>
    <h3 style={{ fontSize: 22, marginBottom: 14, paddingBottom: 10, borderBottom: "2px solid #1C1C27" }}>{title}</h3>
    {children}
  </div>
);

const DocStep = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "#F5D94E",
        border: "2px solid #1C1C27",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
      }}
    >
      {n}
    </div>
    <div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6 }}>{desc}</div>
    </div>
  </div>
);

export { DocsShell, DocSection, DocStep };
