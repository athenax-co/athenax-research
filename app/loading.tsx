export default function Loading() {
  return (
    <div className="page-wrap section" style={{ minHeight: "55vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6B6B7A" }}>
        <span className="spinner" />
      </div>
    </div>
  );
}
