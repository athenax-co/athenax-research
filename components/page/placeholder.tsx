import Link from "next/link";

const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div>
    <div className="page-wrap section">
      <h1 style={{ fontSize: 48, marginBottom: 12 }}>{title}</h1>
      <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 28 }}>{description}</p>
      <Link className="btn btn-outline" href="/">
        ← Back to Home
      </Link>
    </div>
  </div>
);

export default PlaceholderPage;
