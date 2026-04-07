"use client";

import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { useGlobal } from "@/components/GlobalProvider";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import CategorySelector from "@/components/ui/CategorySelector";
import { submitProduct } from "@/api/product";
import { ProductStage, QualityBadge } from "@/enums";
import { useCategories } from "@/hooks/queries/useReference";
import { useProducts } from "@/hooks/queries/useProduct";

export default function Page() {
  const { user, showToast } = useGlobal();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts("approved");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [timeTab, setTimeTab] = useState("all");
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [submitForm, setSubmitForm] = useState({
    name: "",
    url: "",
    stage: ProductStage.SEED as string,
    description: "",
    github: "",
    funding: "",
    founded: String(new Date().getFullYear()),
    qualityBadge: QualityBadge.RESEARCH_BASED as string,
  });

  const TIME_TABS = [
    ["all", "All"],
    ["week", "This Week"],
    ["month", "This Month"],
  ];

  const filtered = (filter === "All" ? products : products.filter((p) => p.categories.some((c) => c.name === filter))).sort((a, b) => {
    if (sortBy === "votes") return b.voteCount - a.voteCount;
    if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.voteCount - a.voteCount;
  });

  const submitLaunch = async () => {
    if (!submitForm.name || !submitForm.url) {
      showToast("Product name and URL are required.", "error");
      return;
    }
    try {
      await submitProduct({
        name: submitForm.name,
        stage: submitForm.stage,
        funding: Number(submitForm.funding) || 0,
        founded: Number(submitForm.founded) || new Date().getFullYear(),
        description: submitForm.description,
        qualityBadge: submitForm.qualityBadge,
        github: submitForm.github || undefined,
        demo: submitForm.url,
        categoryIds: selectedCategoryIds,
      });
      showToast(`${submitForm.name} launch submitted! We'll review within 48 hours.`, "success");
      setShowSubmit(false);
    } catch {
      showToast("Failed to submit launch. Please try again.", "error");
    }
  };

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title="AthenaX Launch — Research-Backed Products Across Frontier Technology"
          description="Discover research-backed products across AI, robotics, biotech, crypto, and infrastructure. Every founder is ARS-scored. Every product is grounded in indexed research."
        />
        <div className="path-badge">/root/launch</div>

        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="mb-1 text-[48px]">AthenaX Launch</h1>
            <span className="status-badge mb-0">
              <div className="status-dot" />
              {products.length} Products Listed
            </span>
          </div>
          <button
            className="btn btn-primary self-start hidden sm:inline-flex"
            onClick={() => {
              if (!user) {
                showToast("Sign in to submit a launch.", "error");
                return;
              }
              setShowSubmit(true);
            }}
          >
            + Submit Your Product
          </button>
        </div>

        <p className="mb-0 text-[17px] text-muted">
          Research-backed products launching across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate. Every founder is
          ARS-scored. Every product is grounded in indexed research.
        </p>
        <button
          className="btn btn-primary w-full justify-center mt-4 sm:hidden"
          onClick={() => {
            if (!user) {
              showToast("Sign in to submit a launch.", "error");
              return;
            }
            setShowSubmit(true);
          }}
        >
          + Submit Your Product
        </button>
        <hr className="divider" />

        <div className="mb-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            { label: "Launches This Month", value: products.length },
            { label: "Total Funding Raised", value: "$18.4M" },
            { label: "Avg. Founder ARS", value: "7.3" },
            { label: "Investor Intros Made", value: "142" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value text-[20px]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2 border-b-2 border-b-[#1C1C27] pb-2.5">
          {TIME_TABS.map(([k, l]) => (
            <button
              key={k}
              className={timeTab === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={timeTab === k ? { background: "#F5D94E" } : {}}
              onClick={() => setTimeTab(k)}
            >
              {l} {k === "all" ? `(${products.length})` : ""}
            </button>
          ))}
          <span className="ml-auto self-center font-['Space_Mono',monospace] text-xs text-muted">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {[{ id: 0, name: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              className={`shrink-0 ${filter === c.name ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}`}
              style={filter === c.name ? { background: "#F5D94E" } : {}}
              onClick={() => setFilter(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {filtered.map((product) => (
          <div key={product.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5">
            <div className="flex flex-wrap gap-5">
              <div className="min-w-65 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="mb-0 text-[21px]">
                    <Link href={`/launch/${product.slug}`} className="cursor-pointer text-inherit no-underline">
                      {product.name}
                    </Link>
                  </h3>
                  {(product.categories ?? []).map((c) => (
                    <span key={c.id} className="topic-pill">
                      {c.name}
                    </span>
                  ))}
                  {product.qualityBadge && <span className="ftag bg-[#EAF0F6] text-[10px]">{product.qualityBadge}</span>}
                </div>
                <p className="mb-2.5 text-[13px] leading-[1.6] text-[#1C1C27]">{product.description}</p>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-['Space_Mono',monospace] text-xs font-bold text-[#E8323C]">▲ {product.voteCount.toLocaleString()}</span>
                  <span className="text-xs text-muted">★ {product.bookmarkCount}</span>
                  <span className="text-xs text-muted">Founded {product.founded}</span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col justify-start gap-1.5 w-full sm:min-w-30 sm:w-auto">
                <span className="ftag bg-[#EAF0F6] text-center text-[11px]">
                  {product.stage} · ${product.funding.toLocaleString()}
                </span>
                <div className="flex gap-1.5 sm:flex-col">
                  <Link href={`/launch/${product.slug}`} className="btn btn-primary btn-sm flex-1 justify-center no-underline">
                    View →
                  </Link>
                  <BookmarkButton user={user} launch={product} showToast={showToast} size="sm" useApi initialBookmarked={product.bookmarked} />
                </div>
              </div>
            </div>
          </div>
        ))}

        <WindowCard label="LAUNCH_TIERS.SYS" className="mt-7">
          <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">LAUNCH PROMOTION TIERS</div>
          <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              {
                tier: "Standard",
                price: "Free",
                highlight: false,
                perks: ["Public listing", "ARS badge", "Archive indexing", "Research lineage display"],
              },
              {
                tier: "Verified",
                price: "$2,000",
                highlight: false,
                perks: ["Everything in Standard", "Featured 48 hours", "Researcher network blast", "Slug: /launch/your-product"],
              },
              {
                tier: "Premier",
                price: "$7,500",
                highlight: true,
                perks: ["Everything in Verified", "Investor intro email blast", "Terminal featured slot", "Cohort alumni spotlight"],
              },
              {
                tier: "Homepage",
                price: "$15,000",
                highlight: false,
                perks: ["Everything in Premier", "Homepage placement 7 days", "Newsletter promotion", "Weekly Digest feature"],
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-[10px] border-2 border-[#1C1C27] p-4"
                style={{
                  background: t.highlight ? "#F9F5DC" : "#fff",
                  boxShadow: t.highlight ? "3px 3px 0 #1C1C27" : "none",
                }}
              >
                <div className="mb-1 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">{t.tier.toUpperCase()}</div>
                <div className="mb-3" style={{ fontSize: 22, fontWeight: 700, color: t.highlight ? "#E8323C" : "#1C1C27" }}>
                  {t.price}
                </div>
                {t.perks.map((p) => (
                  <div key={p} className="mb-1.25 flex items-start gap-1.5 text-xs">
                    <span className="shrink-0 font-bold text-[#4CAF50]">✓</span>
                    {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center md:justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!user) {
                  showToast("Sign in to submit a launch.", "error");
                  return;
                }
                setShowSubmit(true);
              }}
            >
              Submit Your Launch →
            </button>
          </div>
        </WindowCard>

        {showSubmit && (
          <Modal title="SUBMIT_LAUNCH.SYS" onClose={() => setShowSubmit(false)}>
            <div className="inp-group">
              <label className="inp-label">Product Name</label>
              <input
                className="inp"
                value={submitForm.name}
                onChange={(e) => setSubmitForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. AxonOS"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Product URL / Demo</label>
              <input
                className="inp"
                value={submitForm.url}
                onChange={(e) => setSubmitForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://yourproduct.com"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">GitHub Repository</label>
              <input
                className="inp"
                value={submitForm.github}
                onChange={(e) => setSubmitForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="github.com/you/repo"
              />
            </div>
            <div className="flex gap-3">
              <div className="inp-group flex-1">
                <label className="inp-label">Stage</label>
                <select className="inp" value={submitForm.stage} onChange={(e) => setSubmitForm((f) => ({ ...f, stage: e.target.value }))}>
                  {Object.values(ProductStage).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="inp-group flex-1">
                <label className="inp-label">Quality Badge</label>
                <select
                  className="inp"
                  value={submitForm.qualityBadge}
                  onChange={(e) => setSubmitForm((f) => ({ ...f, qualityBadge: e.target.value }))}
                >
                  {Object.values(QualityBadge).map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="inp-group flex-1">
                <label className="inp-label">Funding Raised ($)</label>
                <input
                  className="inp"
                  type="number"
                  min={0}
                  value={submitForm.funding}
                  onChange={(e) => setSubmitForm((f) => ({ ...f, funding: e.target.value }))}
                  placeholder="e.g. 500000"
                />
              </div>
              <div className="inp-group flex-1">
                <label className="inp-label">Founded (Year)</label>
                <input
                  className="inp"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={submitForm.founded}
                  onChange={(e) => setSubmitForm((f) => ({ ...f, founded: e.target.value }))}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
            <div className="inp-group">
              <label className="inp-label">One-line Description</label>
              <input
                className="inp"
                value={submitForm.description}
                onChange={(e) => setSubmitForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What does your product do?"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Categories</label>
              <CategorySelector onChangeIds={setSelectedCategoryIds} />
            </div>
            {/* <div className="mb-3.5 text-xs text-muted">Quality requirement: ARS-scored founder, indexed research paper, or cohort graduate.</div> */}
            <button className="btn btn-primary w-full justify-center" onClick={submitLaunch}>
              Submit Launch →
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}
