"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import WindowCard from "@/components/ui/WindowCard";
import SEOMeta from "@/components/SEOMeta";
import { IconShare } from "@/components/Icons";
import { useGlobal } from "@/components/GlobalProvider";
import {
  useProductBySlug, useVoteProduct, useInterestProduct, useProducts,
  useComments, useCreateComment,
} from "@/features/products";
import type {
  ProductDetailOut, ProductMedia, TeamMemberOut, ProductVoice, Bounty, ProductComment,
} from "@/features/products";
import { useCategories } from "@/hooks/queries/useReference";

const LINK_LABELS: Record<string, string> = {
  website: "Website",
  github: "GitHub",
  twitter: "Twitter / X",
  docs: "Documentation",
  demo: "Demo",
  discord: "Discord",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  useCategories();
  const { data: apiProduct, isLoading } = useProductBySlug(id);
  const { data: allProductsData } = useProducts("approved");
  const { mutate: vote, isPending: voting } = useVoteProduct();
  const { mutate: interest, isPending: registeringInterest } = useInterestProduct();
  const apiProductId = apiProduct?.id ?? 0;
  const { data: comments = [] } = useComments(apiProductId);
  const { mutate: createComment } = useCreateComment(apiProductId);

  const shareLaunch = async (slug: string) => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const shareUrl = `${origin}/launch/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="page-wrap section animate-pulse">
        <div className="mb-6 h-8 w-40 rounded-full bg-[#E8E4DC]" />
        <div className="mb-8 flex gap-4">
          <div className="size-20 shrink-0 rounded-xl bg-[#E8E4DC]" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-9 w-56 rounded bg-[#E8E4DC]" />
            <div className="h-4 w-full rounded bg-[#E8E4DC]" />
            <div className="h-4 w-2/3 rounded bg-[#E8E4DC]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-64 rounded-xl bg-[#E8E4DC]" />
          <div className="space-y-4">
            <div className="h-40 rounded-xl bg-[#E8E4DC]" />
            <div className="h-24 rounded-xl bg-[#E8E4DC]" />
          </div>
        </div>
      </div>
    );
  }

  if (!apiProduct) {
    return (
      <div className="page-wrap section">
        <p>Launch not found.</p>
        <Link className="link-arrow" href="/launch">
          ← Back to Launch
        </Link>
      </div>
    );
  }

  const p: ProductDetailOut = apiProduct;
  const primaryCategory = p.categories[0]?.name ?? "Product";
  const isInvestor = (user?.role as string) === "investor";

  const similarProducts = (allProductsData?.items ?? [])
    .filter((item) => item.id !== p.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const hasGithub = p.links.some((l) => l.linkType === "github");

  const handleApiVote = () => {
    if (!user) {
      showToast("Sign in to upvote.", "error");
      return;
    }
    const newVoted = !p.voted;
    vote(
      { id: p.id, voted: newVoted },
      {
        onSuccess: () => showToast(newVoted ? `Upvoted ${p.name}!` : "Vote removed.", "success"),
        onError: () => showToast("Failed to vote. Please try again.", "error"),
      }
    );
  };

  const handleApiInterest = () => {
    if (!user) {
      showToast("Sign in to register interest.", "error");
      return;
    }
    if (!isInvestor) {
      showToast("Investor access required.", "error");
      return;
    }
    const newInterested = !p.interested;
    interest(
      { id: p.id, interested: newInterested },
      {
        onSuccess: () => showToast(newInterested ? "Investor interest registered. Founders will be notified." : "Interest removed.", "success"),
        onError: () => showToast("Failed to register interest. Please try again.", "error"),
      }
    );
  };

  const factRows = [
    p.categories.length > 0 ? { label: "Category", value: p.categories[0].name } : null,
    { label: "Status", value: "● Live Beta", isStatus: true },
    p.founded != null ? { label: "Founded", value: String(p.founded) } : null,
    { label: "Pricing", value: hasGithub ? "Open Source / Free" : p.funding != null ? `$${p.funding.toLocaleString()}` : "Free" },
    p.stage ? { label: "Stage", value: p.stage } : { label: "Stage", value: "Early Stage" },
  ].filter(Boolean) as { label: string; value: string; isStatus?: boolean }[];

  const links = p.links.map((l) => ({
    label: l.label ?? LINK_LABELS[l.linkType] ?? l.linkType,
    url: l.url,
  }));

  return (
    <div>
      <SEOMeta
        title={`${p.name} — ${primaryCategory} | AthenaX Launch`}
        description={`${p.name} launched on AthenaX.${p.description ? ` ${p.description.slice(0, 120)}` : ""}`}
        type="product"
      />

      <div className="page-wrap section" style={{ maxWidth: 1040 }}>
        {/* BREADCRUMB */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link
            href="/launch"
            className="inline-flex items-center rounded-full border border-ink bg-white px-4 py-1.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px"
          >
            ← Back to Launch
          </Link>
          <span className="rounded font-['Space_Mono',monospace] border border-ink bg-white px-3 py-1 text-[11px]">/root/launch/{p.slug}</span>
        </div>

        {/* HERO */}
        <div className="mb-8 grid grid-cols-[90px_1fr_auto] items-start gap-4 border-b border-b-[rgba(0,0,0,0.12)] pb-7 max-[640px]:grid-cols-[70px_1fr]">
          <Avatar className="size-[90px] shrink-0 rounded-xl overflow-visible border border-ink shadow-[3px_3px_0_#1a1a1a] max-[640px]:size-[70px]">
            <AvatarImage src={p.logo ?? undefined} alt={p.name} className="size-full object-contain" />
            <AvatarFallback className="rounded-xl bg-white text-4xl font-extrabold max-[640px]:text-3xl">{p.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h1 className="text-[36px] leading-none tracking-tight max-[640px]:text-[28px]">{p.name}</h1>
              {p.categories.length > 0 && (
                <span className="topic-pill text-[10px]">
                  {p.categories[0].name.toUpperCase()}
                </span>
              )}
              <span className="topic-pill bg-[#D7E9B5] text-[10px]">
                LIVE
              </span>
              {p.stage && (
                <span className="topic-pill bg-[#E8E4D9] text-[10px]">
                  {p.stage.toUpperCase()}
                </span>
              )}
              {hasGithub && (
                <span className="topic-pill bg-[#E8E4D9] text-[10px]">
                  OPEN SOURCE
                </span>
              )}
            </div>
            {p.description && <p className="mb-2 text-[15px] leading-[1.6] text-[#555] max-w-[600px]">{p.description}</p>}
            <div className="font-['Space_Mono',monospace] text-[11px] text-[#888] tracking-[0.02em]">
              {p.founded != null && <>founded {p.founded}</>}
              {p.founded != null && p.createdAt && <span className="mx-1 text-[#ccc]">·</span>}
              {p.createdAt && <>launched on athenax {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</>}
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2 pt-2 max-[640px]:col-span-2 max-[640px]:pt-0">
            <button
              onClick={handleApiVote}
              disabled={voting}
              className={`inline-flex items-center gap-1.5 rounded-full border border-ink px-4 py-2.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px ${p.voted ? "bg-[#D7E9B5]" : "bg-white"}`}
            >
              {p.voted ? "✓" : "☆"} {voting ? "…" : p.voted ? "Voted" : "Upvote"} · {p.voteCount.toLocaleString()}
            </button>
            <button
              onClick={() => shareLaunch(p.slug)}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-2.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px"
            >
              <IconShare size={13} /> Share
            </button>
          </div>
        </div>

        {/* BLOCK 1: ABOUT | GALLERY + LINKS */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* ABOUT.SYS */}
          <WindowCard label="ABOUT.SYS" className="md:row-span-2">
            <p className="mb-3 text-[15px] leading-[1.7]">{p.description ?? "No description provided."}</p>
            <p className="mb-8 text-[13px] italic text-[#555]">
              {hasGithub ? "Open source · available on GitHub" : "Compatible with leading developer tools and platforms."}
            </p>

            <div className="mb-8">
              {factRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between py-2.5 ${i < factRows.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}
                >
                  <span className="font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#888]">{row.label}</span>
                  <span className={`text-sm font-bold ${row.isStatus ? "text-[#639922]" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {p.backers.length > 0 && (
              <div>
                <div className="mb-2.5 font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#888]">Backers</div>
                <div className="flex flex-wrap gap-2">
                  {p.backers.map((b) => (
                    <span key={b.id} className="rounded-full border border-[rgba(0,0,0,0.15)] bg-white px-4 py-1.5 text-[13px] font-medium">
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </WindowCard>

          {/* GALLERY.SYS */}
          <WindowCard label="GALLERY.SYS" bodyClass="p-3">
            <GallerySection media={p.media} />
          </WindowCard>

          {/* LINKS.SYS */}
          <WindowCard label="LINKS.SYS" bodyClass="px-5 py-3">
            {links.length > 0 ? (
              links.map((l) => (
                <div key={l.label} className="flex items-baseline justify-between border-b border-b-[rgba(0,0,0,0.08)] py-2.5">
                  <span className="text-sm font-semibold">{l.label}</span>
                  <Link
                    href={l.url.startsWith("http") ? l.url : `https://${l.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-['Space_Mono',monospace] text-xs text-[#C4605C] no-underline hover:underline"
                  >
                    ↗ {l.url}
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-3 text-[13px] text-[#888]">No links provided.</p>
            )}

            {isInvestor && (
              <div className="mt-3 pt-3 border-t border-t-[rgba(0,0,0,0.08)]">
                <button
                  onClick={handleApiInterest}
                  disabled={registeringInterest}
                  className={`w-full rounded-full border border-ink px-4 py-2 text-[13px] font-semibold shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px ${p.interested ? "bg-[#D7E9B5]" : "bg-[#FFE14D]"}`}
                >
                  ★ {registeringInterest ? "Registering…" : p.interested ? "Interest Registered" : "Register Investor Interest"}
                </button>
                {p.interested && (
                  <div className="mt-1.5 text-center font-['Space_Mono',monospace] text-[10px] text-[#639922]">
                    {p.investorInterestCount} investor{p.investorInterestCount !== 1 ? "s" : ""} interested
                  </div>
                )}
              </div>
            )}
          </WindowCard>
        </div>

        {/* BLOCK 2: TEAM + VOICES */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <WindowCard label="TEAM.SYS">
            <TeamSection members={p.team} />
          </WindowCard>

          <WindowCard label="VOICES.SYS">
            <VoicesSection voices={p.voices} />
          </WindowCard>
        </div>

        {/* BLOCK 3: BOUNTIES */}
        <div className="mb-8">
          <WindowCard label="BOUNTIES.SYS" titleRight="ACTIVE BOUNTIES FOR THIS PROJECT">
            <BountiesSection bounties={p.bounties} />
          </WindowCard>
        </div>

        {/* BLOCK 4: DISCUSSION */}
        <DiscussionSection
          user={user}
          comments={comments}
          onPost={(text) => createComment(text)}
        />

        {/* LINKED PAPERS */}
        {p.papers && p.papers.length > 0 && (
          <div className="mt-8">
            <WindowCard label="RESEARCH.SYS">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] uppercase tracking-[0.06em] text-[#888]">
                Research Backing This Product
              </div>
              {p.papers.map((paper) => (
                <div key={paper.id} className="flex items-center justify-between border-b border-b-[rgba(0,0,0,0.08)] py-2.5">
                  <span className="text-sm font-medium">{paper.title}</span>
                  <Link
                    href={`/research/${paper.slug}`}
                    className="font-['Space_Mono',monospace] text-[11px] text-[#185FA5] no-underline hover:underline"
                  >
                    ↗ View
                  </Link>
                </div>
              ))}
            </WindowCard>
          </div>
        )}

        {/* SIMILAR PROJECTS */}
        {similarProducts.length > 0 && (
          <div className="mt-14 border-t border-t-[rgba(0,0,0,0.12)] pt-8">
            <div className="mb-4 font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.08em] text-[#888]">›_ similar projects</div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {similarProducts.map((s) => (
                <Link
                  key={s.id}
                  href={`/launch/${s.slug}`}
                  className="explore-card block rounded-xl border-2 border-[#1C1C27] bg-white p-[18px_22px] text-left text-inherit no-underline"
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 rounded-lg overflow-visible border border-ink">
                      <AvatarImage src={s.logo ?? undefined} alt={s.name} className="size-full object-contain" />
                      <AvatarFallback className="rounded-lg border border-[#D8D4CC] bg-paper text-base font-bold">
                        {s.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mb-0.75 text-[15px] font-bold">{s.name}</div>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {s.categories.map((c) => (
                      <span key={c.id} className="topic-pill px-2 py-0.5 text-[10px]">{c.name}</span>
                    ))}
                    {s.stage && <span className="ftag text-[10px]">{s.stage}</span>}
                  </div>
                  <div className="text-xs text-muted">{s.description}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GallerySection({ media }: { media: ProductMedia[] }) {
  const images = media.filter((m) => m.mediaType === "image").sort((a, b) => a.sortOrder - b.sortOrder);

  if (images.length === 0) {
    return (
      <div className="grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-1.5">
        <div className="row-span-2 flex aspect-auto min-h-[120px] items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          screenshot.png
        </div>
        <div className="flex aspect-[16/10] items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          02.png
        </div>
        <div className="flex aspect-[16/10] items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          03.png
        </div>
      </div>
    );
  }

  const shown = images.slice(0, 3);
  const extra = images.length - 3;

  return (
    <div className="grid grid-cols-[1.4fr_1fr] grid-rows-2 gap-1.5">
      <div className="row-span-2 min-h-[120px] overflow-hidden rounded border border-[rgba(0,0,0,0.08)]">
        <img src={shown[0].storageKey} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="aspect-[16/10] overflow-hidden rounded border border-[rgba(0,0,0,0.08)]">
        {shown[1] ? (
          <img src={shown[1].storageKey} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#E8E4D9] text-[10px] font-['Space_Mono',monospace] text-[#888]">02.png</div>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded border border-[rgba(0,0,0,0.08)]">
        {shown[2] ? (
          <img src={shown[2].storageKey} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#E8E4D9] text-[10px] font-['Space_Mono',monospace] text-[#888]">03.png</div>
        )}
        {extra > 0 && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-[rgba(0,0,0,0.5)] px-1.5 py-0.5 text-[9px] font-['Space_Mono',monospace] text-white">
            + {extra} more
          </span>
        )}
      </div>
    </div>
  );
}

const AVATAR_COLORS = ["#FFE14D", "#B5D8E9", "#E9C9B5", "#D4C5E2", "#C5DED4"];

function TeamSection({ members }: { members: TeamMemberOut[] }) {
  const [expanded, setExpanded] = useState(false);

  if (members.length === 0) {
    return <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No team members listed.</p>;
  }

  const shown = expanded ? members : members.slice(0, 3);
  const hiddenCount = members.length - 3;

  return (
    <>
      <div className={`overflow-hidden transition-all ${expanded ? "max-h-[600px] overflow-y-auto" : "max-h-[340px]"}`}>
        {shown.map((m, i) => (
          <div key={m.id} className={`flex items-center gap-3.5 py-3.5 ${i < shown.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink text-[14px] font-bold"
              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            >
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5 mb-0.5">
                <span className="text-sm font-bold">{m.name}</span>
                {m.roleLabel && <span className="font-['Space_Mono',monospace] text-[10px] text-[#888]">· {m.roleLabel}</span>}
              </div>
              {m.bioNote && <div className="truncate text-xs text-[#555] mb-0.5">{m.bioNote}</div>}
              {(m.twitterUrl || m.githubUrl) && (
                <div className="flex gap-2.5 font-['Space_Mono',monospace] text-[10px]">
                  {m.twitterUrl && (
                    <a href={m.twitterUrl.startsWith("http") ? m.twitterUrl : `https://${m.twitterUrl}`} target="_blank" rel="noreferrer" className="text-[#185FA5] hover:underline">
                      ↗ {m.twitterUrl}
                    </a>
                  )}
                  {m.githubUrl && (
                    <a href={m.githubUrl.startsWith("http") ? m.githubUrl : `https://${m.githubUrl}`} target="_blank" rel="noreferrer" className="text-[#185FA5] hover:underline">
                      ↗ {m.githubUrl}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {hiddenCount > 0 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 font-['Space_Mono',monospace] text-[11px] text-[#888] hover:text-[#1a1a1a]">
          {expanded ? "− show less" : `+ ${hiddenCount} more team members`}
        </button>
      )}
    </>
  );
}

function VoicesSection({ voices }: { voices: ProductVoice[] }) {
  const [expanded, setExpanded] = useState(false);

  if (voices.length === 0) {
    return <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No voices yet.</p>;
  }

  const shown = expanded ? voices : voices.slice(0, 2);

  return (
    <>
      <div className={`overflow-hidden transition-all ${expanded ? "max-h-[600px] overflow-y-auto" : "max-h-[310px]"}`}>
        {shown.map((v) => (
          <div key={v.id} className="mb-2.5 rounded-md border border-[rgba(0,0,0,0.08)] bg-[#FFFCEF] px-4 py-3.5 last:mb-0">
            <p className="text-[13px] italic leading-[1.55]">"{v.quote}"</p>
            <div className="mt-2 flex items-center justify-between font-['Space_Mono',monospace] text-[10px]">
              <span className="font-medium text-[#1a1a1a]">{v.authorName ?? v.authorHandle}</span>
              {v.sourceUrl && (
                <a href={v.sourceUrl} target="_blank" rel="noreferrer" className="text-[#185FA5] hover:underline">
                  ↗ open thread
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      {voices.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2.5 font-['Space_Mono',monospace] text-[11px] text-[#888] hover:text-[#1a1a1a]">
          {expanded ? "− show less" : `show ${voices.length - 2} more →`}
        </button>
      )}
    </>
  );
}

function BountiesSection({ bounties }: { bounties: Bounty[] }) {
  if (bounties.length === 0) {
    return <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No active bounties.</p>;
  }

  return (
    <>
      {bounties.map((b, i) => (
        <div
          key={b.id}
          className={`flex items-start justify-between py-3.5 ${i < bounties.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}
        >
          <div className="flex-1 min-w-0">
            <div className="mb-1 text-sm font-semibold">{b.title}</div>
            <div className="flex flex-wrap items-center gap-1.5 font-['Space_Mono',monospace] text-[10px] text-[#888]">
              {b.techLabel && (
                <span className="rounded border border-[rgba(0,0,0,0.12)] bg-[#FAFAF7] px-1.5 py-0.5 text-[9px]">
                  {b.techLabel}
                </span>
              )}
              <span className="capitalize">{b.status}</span>
            </div>
          </div>
          <a
            href={b.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-4 shrink-0 font-['Space_Mono',monospace] text-[15px] font-bold text-[#639922] hover:underline"
          >
            ${Number(b.rewardAmount).toLocaleString()}
          </a>
        </div>
      ))}
    </>
  );
}

function DiscussionSection({
  user,
  comments,
  onPost,
}: {
  user: any;
  comments: ProductComment[];
  onPost: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <WindowCard label="DISCUSSION.SYS">
      <div className="mb-4 font-['Space_Mono',monospace] text-[10px] uppercase tracking-[0.06em] text-[#888]">
        {comments.length} comments · developer & researcher discussion
      </div>

      {comments.length === 0 && (
        <p className="mb-4 font-['Space_Mono',monospace] text-[10px] text-[#888]">No comments yet. Be the first.</p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          className={`mb-2.5 rounded-lg bg-[#FFFCEF] px-4 py-3.5 ${c.pinned ? "border-l-[3px] border-l-[#E94842] rounded-l-none border border-[rgba(0,0,0,0.08)]" : "border border-[rgba(0,0,0,0.08)]"}`}
        >
          <div className="mb-2 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] font-['Space_Mono',monospace] text-[10px] font-semibold text-[#555]"
              style={{ background: AVATAR_COLORS[c.createdById % AVATAR_COLORS.length] }}
            >
              U
            </div>
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#888]">
              {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {c.pinned && (
              <span className="font-['Space_Mono',monospace] text-[9px] bg-[#FFE14D] border border-ink px-1.5 py-0.5 rounded font-semibold tracking-[0.05em]">
                PINNED
              </span>
            )}
          </div>
          <div className="text-sm leading-[1.55]">{c.text}</div>
        </div>
      ))}

      <div className="mt-4 border-t border-t-[rgba(0,0,0,0.08)] pt-4 flex items-center gap-2.5">
        {user ? (
          <>
            <input
              className="flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#FFFCEF] px-3.5 py-3 text-[13px] placeholder:text-[#aaa] focus:outline-none focus:border-ink"
              placeholder="Share your thoughts…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              disabled={!text.trim()}
              onClick={() => { onPost(text.trim()); setText(""); }}
              className="rounded-full border border-ink bg-white px-4 py-2.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px disabled:opacity-40"
            >
              Post
            </button>
          </>
        ) : (
          <p className="font-['Space_Mono',monospace] text-[10px] text-[#888]">Sign in to join the discussion.</p>
        )}
      </div>
    </WindowCard>
  );
}
