import Link from "next/link";

export default function Page() {
  const title = "Placeholder";
  const description = "Page coming soon.";

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <h1 className="mb-3 text-5xl font-bold tracking-[-0.02em] text-ink">{title}</h1>
        <p className="mb-7 text-[17px] text-muted">{description}</p>
        <Link className="btn btn-outline" href="/">
          &lt;- Back to Home
        </Link>
      </div>
    </div>
  );
}
