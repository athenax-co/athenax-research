export default function Loading() {
  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/archive</div>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>The Archive</h1>
      <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>Artifacts, learnings, and broadcasts.</p>
      <hr className="divider" />

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          style={{
            border: "2px solid #1C1C27",
            borderRadius: 12,
            background: "#fff",
            padding: "16px 18px",
            marginBottom: 12,
          }}
        >
          <div style={{ height: 16, width: `${78 - index * 8}%`, background: "#D8D4CC", borderRadius: 4, marginBottom: 10 }} />
          <div style={{ height: 12, width: `${44 + index * 8}%`, background: "#ECE9E1", borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}
