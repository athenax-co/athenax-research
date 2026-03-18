export default function Loading() {
  return (
    <div>
      <div className="page-wrap section section-stack-md">
        <div className="link-arrow" style={{ marginBottom: 0, pointerEvents: "none" }}>
          ← Back to Research
        </div>

        <div className="path-badge">/root/research/...</div>

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: index === 0 ? 20 : 14,
              width: index === 0 ? "65%" : `${96 - index * 10}%`,
              background: index === 0 ? "#D8D4CC" : "#ECE9E1",
              borderRadius: 4,
              marginBottom: 14,
            }}
          />
        ))}
      </div>
    </div>
  );
}
