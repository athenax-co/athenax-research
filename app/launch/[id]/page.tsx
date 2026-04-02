"use client";

import { use } from "react";
import Link from "next/link";
import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta, { toSlug } from "@/components/SEOMeta";
import { IconPaperSmall } from "@/components/Icons";
import { useGlobal } from "@/components/GlobalProvider";
import { useState } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  const launch = SEED_LAUNCHES.find((l) => l.id === id);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(launch?.votes || 0);

  if (!launch)
    return (
      <div className="page-wrap section">
        <p>Launch not found.</p>
        <Link className="link-arrow" href="/launch">
          ← Back to Launch
        </Link>
      </div>
    );

  const handleVote = () => {
    if (!user) {
      showToast("Sign in to upvote.", "error");
      return;
    }
    if (voted) {
      showToast("Already upvoted.", "info");
      return;
    }
    setVoted(true);
    setVoteCount((v) => v + 1);
    showToast(`Upvoted ${launch.name}!`, "success");
  };

  const linkedPapers = SEED_PAPERS.filter((p) => launch.papers.includes(p.title));

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title={`${launch.name} — ${launch.category} | AthenaX Launch`}
          description={`${launch.name} launched on AthenaX. Built by ARS-scored researchers. ${launch.desc.slice(0, 120)}`}
          type="product"
        />
        <Link className="link-arrow" href="/launch" style={{ marginBottom: 20 }}>
          ← Back to Launch
        </Link>
        <div className="path-badge" style={{ marginLeft: 12 }}>
          /root/launch/{toSlug(launch.name)}
        </div>

        <div className="mb-5 flex flex-wrap items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-[#1C1C27] bg-paper text-2xl font-bold">
            {launch.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <h1 className="mb-0 text-[36px]">{launch.name}</h1>
              <span className="topic-pill">{launch.category}</span>
              <span className="ftag" style={{ background: launch.stage === "Seed" ? "#D4EDDA" : "#EAF0F6" }}>
                {launch.stage}
              </span>
              <span className="ftag bg-paper font-bold text-[#15803D]">{launch.funding}</span>
            </div>
            <p className="text-base leading-[1.6] text-muted">{launch.desc}</p>
          </div>
          <div className="shrink-0 text-center">
            <button
              className={voted ? "btn btn-ghost" : "btn btn-outline"}
              style={{ ...(voted ? { background: "#D4EDDA" } : {}), flexDirection: "column", padding: "14px 22px" }}
              onClick={handleVote}
            >
              <div className="text-[22px] leading-none">▲</div>
              <div className="mt-1 font-['Space_Mono',monospace] text-sm font-bold text-[#E8323C]">{voteCount.toLocaleString()}</div>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, padding: "5px 10px" }}
              onClick={() => {
                navigator.clipboard && navigator.clipboard.writeText(`${launch.name} | athenax.io/launch/${toSlug(launch.name)}`);
                showToast("Link copied!", "success");
              }}
            >
              ⬡ Share
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="grid-2 gap-5.5">
          <div>
            <WindowCard label="RESEARCH_LINEAGE.SYS" className="mb-5.5">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">THIS PRODUCT IS BUILT ON</div>
              {linkedPapers.length > 0 ? (
                linkedPapers.map((p) => (
                  <Link href={`/paper/${p.id}`} key={p.id} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
                    <IconPaperSmall />
                    <div className="ml-2 flex-1">
                      <div className="archive-title text-[13px]">{p.title}</div>
                      <div className="archive-meta">
                        {p.year} // {p.topic} // {p.citations} cites
                      </div>
                    </div>
                    <span className="text-sm text-muted">→</span>
                  </Link>
                ))
              ) : (
                <p className="text-[13px] text-muted">Research lineage indexed. {launch.papers.join(", ")}</p>
              )}
            </WindowCard>

            <WindowCard label="ECOSYSTEM.SYS" bodyClass="window-body window-body-blue" className="mb-5.5">
              <div className="mb-3">
                <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">RESEARCH AREAS</div>
                <div className="flex flex-wrap gap-1.5">
                  {launch.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/terminal?q=${encodeURIComponent(`topic: ${t}`)}`}
                      className="topic-pill cursor-pointer border-none font-['Space_Grotesk',sans-serif] no-underline"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
              <hr className="divider-sm" />
              <div>
                <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INFRASTRUCTURE SPONSORS</div>
                <div className="flex flex-wrap gap-1.5">
                  {launch.sponsors.map((s) => (
                    <span key={s} className="ftag bg-white">
                      ✦ {s}
                    </span>
                  ))}
                </div>
              </div>
            </WindowCard>

            <WindowCard label="LINKS.SYS">
              {[
                { label: "GitHub Repository", url: launch.github, color: "#1C1C27" },
                { label: "Live Demo", url: launch.demo, color: "#E8323C" },
              ].map((l) => (
                <div key={l.label} className="flex items-center justify-between border-b border-b-[#D8D4CC] py-2.5">
                  <span className="text-sm font-semibold">{l.label}</span>
                  <a
                    href={`https://${l.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-['Space_Mono',monospace] text-xs"
                    style={{ color: l.color }}
                  >
                    ↗ {l.url}
                  </a>
                </div>
              ))}
            </WindowCard>
          </div>

          <div>
            <WindowCard label="FOUNDERS.SYS" className="mb-5.5">
              <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">ARS-VERIFIED FOUNDERS</div>
              {launch.founders.map((f) => (
                <Link href="/docs/researchers" key={f.name} className="lb-row cursor-pointer py-3 text-inherit no-underline">
                  <div className="lb-avatar h-10 w-10 text-[15px]">{f.name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="lb-name">{f.name}</div>
                    <div className="lb-meta">{f.lab}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-['Space_Mono',monospace] text-sm font-bold text-[#E8323C]">ARS {f.ars}</div>
                  </div>
                </Link>
              ))}
            </WindowCard>

            <WindowCard label="METRICS.SYS" className="mb-5.5">
              <div className="grid-2 gap-3">
                {[
                  { label: "Launch Votes", value: voteCount.toLocaleString() },
                  { label: "Funding", value: launch.funding },
                  { label: "Stage", value: launch.stage },
                  { label: "Founded", value: launch.founded },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value text-[18px]">{s.value}</div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="ACTIONS.SYS" bodyClass="window-body window-body-yellow">
              <div className="flex flex-col gap-2.5">
                <button
                  className="btn btn-primary justify-center"
                  onClick={() => {
                    showToast("Investor interest registered. Founders will be notified.", "success");
                  }}
                >
                  ★ Register Investor Interest
                </button>
                <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
                <Link className="btn btn-outline justify-center mt-1 no-underline" href="/network/talent">
                  Startup Marketplace →
                </Link>
                <Link className="btn btn-ghost btn-sm justify-center no-underline" href="/terminal">
                  Research in Terminal →
                </Link>
              </div>
            </WindowCard>

            <WindowCard label="DEVELOPER_ACTIVITY.SYS" className="mt-5" bodyClass="window-body window-body-blue">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">SINCE LAUNCH</div>
              {[
                { label: "Developer views", value: launch.devViews?.toLocaleString() || "—" },
                { label: "GitHub stars gained", value: `+${launch.githubStars || 0}` },
                { label: "Bookmarks", value: Math.floor((launch.votes || 0) * 0.4) },
                { label: "Discussion comments", value: launch.comments?.length || 0 },
              ].map((r) => (
                <div key={r.label} className="flex justify-between border-b border-b-[#D8D4CC] py-1.75 text-[13px]">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-['Space_Mono',monospace] font-bold">{r.value}</span>
                </div>
              ))}
              <a href={`https://${launch.github}`} target="_blank" rel="noreferrer" className="block mt-3">
                <button className="btn btn-outline btn-sm w-full justify-center">⌥ View on GitHub →</button>
              </a>
              <a href={`https://${launch.demo}`} target="_blank" rel="noreferrer">
                <button className="btn btn-primary btn-sm mt-2 w-full justify-center">↗ Try This Product →</button>
              </a>
            </WindowCard>

            <WindowCard label="TALENT_PIPELINE.SYS" className="mt-5">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">HIRING VIA ATHENAX</div>
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-muted">Open roles</span>
                <span className="font-['Space_Mono',monospace] font-bold">{launch.rolesOpen || 0}</span>
              </div>
              <div className="mb-3.5 flex justify-between text-[13px]">
                <span className="text-muted">Filled via AthenaX</span>
                <span className="font-['Space_Mono',monospace] font-bold text-[#15803D]">{launch.rolesFilledViaAthenaX || 0}</span>
              </div>
              <Link className="btn btn-outline btn-sm w-full justify-center no-underline" href="/network/talent">
                Browse All Startups →
              </Link>
              {user && (
                <button
                  className="btn btn-ghost btn-sm mt-1.5 w-full justify-center"
                  onClick={() => showToast("Joining team interest registered!", "success")}
                >
                  + Express Interest in Joining
                </button>
              )}
            </WindowCard>

            <WindowCard label="INVESTOR_SIGNALS.SYS" className="mt-5" bodyClass="window-body window-body-yellow">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INVESTOR ACTIVITY</div>
              <div className="mb-2 flex justify-between text-[13px]">
                <span className="text-muted">Interest registrations</span>
                <span className="font-['Space_Mono',monospace] font-bold text-[#E8323C]">{launch.investorRegs || 0}</span>
              </div>
              <div className="mb-3.5 flex justify-between text-[13px]">
                <span className="text-muted">Terminal subscribers watching</span>
                <span className="font-['Space_Mono',monospace] font-bold">{Math.floor((launch.investorRegs || 0) * 1.4)}</span>
              </div>
              <button
                className="btn btn-primary btn-sm w-full justify-center"
                onClick={() => showToast("Investor interest registered. Founders will be notified.", "success")}
              >
                ★ Register Investor Interest
              </button>
            </WindowCard>
          </div>
        </div>

        <div className="mt-8">
          <WindowCard label="DISCUSSION.SYS">
            <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
              {launch.comments?.length || 0} COMMENTS — DEVELOPER & RESEARCHER DISCUSSION
            </div>
            {(launch.comments || []).map((c, i) => (
              <div key={i} className="flex gap-3 border-b border-b-[#D8D4CC] py-3">
                <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1C1C27] bg-[#EAF0F6] text-[11px] font-bold">
                  {c.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="mb-1 font-['Space_Mono',monospace] text-xs text-muted">{c.user}</div>
                  <div className="text-sm leading-[1.6] text-[#1C1C27]">{c.text}</div>
                </div>
              </div>
            ))}
            {user ? (
              <div className="mt-3.5 flex gap-2">
                <input className="inp flex-1 py-2 px-3 text-[13px]" placeholder="Add a technical comment or question…" />
                <button className="btn btn-primary btn-sm" onClick={() => showToast("Comment posted!", "success")}>
                  Post
                </button>
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted">Sign in to join the discussion.</p>
            )}
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
