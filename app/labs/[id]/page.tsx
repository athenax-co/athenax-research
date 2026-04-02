import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_LABS, SEED_PAPERS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lab = SEED_LABS.find((x) => x.id === id);

  if (!lab) {
    notFound();
  }

  const labPapers = SEED_PAPERS.filter((p) => p.lab === lab.name);
  const realCount = labPapers.length || lab.papers;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <Link href="/labs" className="link-arrow mb-5 inline-flex">
          &lt;- Back to Labs
        </Link>

        <div className="path-badge">/root/network/labs/{lab.id}</div>

        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-[42px] font-bold tracking-[-0.02em] text-ink">{lab.name}</h1>
          <span className={`ftag ${lab.active ? "bg-success" : "bg-[#F5DDE0]"}`}>{lab.active ? "Active" : "Inactive"}</span>
        </div>

        <p className="mb-0 text-[17px] text-muted">{lab.focus}</p>
        <hr className="divider" />

        <div className="grid gap-5.5 lg:grid-cols-2">
          <div>
            <WindowCard label="LAB_OVERVIEW.SYS">
              <p className="mb-5 text-[15px] leading-[1.7] text-ink">{lab.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {lab.tags.map((t: string) => (
                  <span key={t} className="topic-pill">
                    {t}
                  </span>
                ))}
              </div>
              <hr className="divider-sm" />
              <div className="text-[13px] text-muted">Partners: {lab.partners.join(", ")}</div>
            </WindowCard>

            <WindowCard label="RESEARCHERS.SYS" className="mt-5">
              {lab.researchers.map((r: string) => (
                <div key={r} className="lb-row">
                  <div className="lb-avatar">{r.charAt(0)}</div>
                  <div className="lb-name">{r}</div>
                </div>
              ))}
            </WindowCard>
          </div>

          <div>
            <WindowCard label="METRICS.SYS" className="mb-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="stat-card">
                  <div className="stat-label">Papers Indexed</div>
                  <div className="stat-value">{realCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Researchers</div>
                  <div className="stat-value">{lab.researchers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Partners</div>
                  <div className="stat-value">{lab.partners.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Status</div>
                  <div className={`text-[18px] font-bold ${lab.active ? "text-[#15803D]" : "text-danger"}`}>{lab.active ? "Online" : "Offline"}</div>
                </div>
              </div>
            </WindowCard>

            <WindowCard label="LAB_PAPERS.SYS" bodyClass="window-body window-body-blue">
              {labPapers.length === 0 ? (
                <p className="text-sm text-muted">No indexed papers yet.</p>
              ) : (
                labPapers.map((p) => (
                  <Link key={p.id} href={`/paper/${p.id}`} className="no-underline">
                    <div className="archive-row mb-2">
                      <div className="flex-1">
                        <div className="archive-title text-sm">{p.title}</div>
                        <div className="archive-meta">
                          {p.year} // {p.topic}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              {lab.active && (
                <Link href="/funding/cohorts" className="btn btn-primary btn-sm mt-3 inline-flex w-full justify-center">
                  View Open Cohorts -&gt;
                </Link>
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
