"use client";

import { useState } from "react";
import { SEED_PAPERS } from "@/data/seed";
import { useProductStats } from "@/hooks/queries/useProduct";
import { cn } from "@/utils/lib";

type ItemTone = "live" | "coming" | "building" | "data" | "network" | "vision";

type RoadmapItem = {
  id: string;
  title: string;
  desc: string;
  status: string;
  tone: ItemTone;
  unlocks: string;
  why: string;
  primary?: boolean;
};

type RoadmapSection = {
  sysLabel: string;
  tag: string;
  tagTone: ItemTone;
  bodyClassName?: string;
  items: RoadmapItem[];
};

const toneClasses: Record<ItemTone, string> = {
  live: "text-[#15803D] bg-[#D4EDDA] border-[#15803D]",
  coming: "text-ink bg-[#EAF0F6] border-[#9AA5B1]",
  building: "text-ink bg-[#F9F5DC] border-[#BFA93B]",
  data: "text-ink bg-[#F9F5DC] border-[#BFA93B]",
  network: "text-ink bg-[#F9F5DC] border-[#BFA93B]",
  vision: "text-ink bg-cream border-[#D8D4CC]",
};

const sectionTagClasses: Record<ItemTone, string> = {
  live: "text-[#15803D] bg-[#D4EDDA] border-[#15803D]",
  coming: "text-ink bg-[#EAF0F6] border-ink",
  building: "text-ink bg-[#F9F5DC] border-ink",
  data: "text-ink bg-[#F9F5DC] border-ink",
  network: "text-ink bg-[#F9F5DC] border-ink",
  vision: "text-ink bg-cream border-ink",
};

const sections: RoadmapSection[] = [
  {
    sysLabel: "LIVE_NOW.SYS",
    tag: "Live",
    tagTone: "live",
    items: [
      {
        id: "lf",
        primary: true,
        title: "Launch feed",
        desc: "Browse research-backed products across 7 frontier technology sectors.",
        status: "Live",
        tone: "live",
        unlocks: "The core discovery experience. Every product listed is research-backed and founder-submitted.",
        why: "The feed is the product. Everything else is built to support what appears here.",
      },
      {
        id: "pd",
        title: "Product detail pages",
        desc: "Full product pages with description, founders, links, and community discussion.",
        status: "Live",
        tone: "live",
        unlocks: "Deep product context - who built it, what it does, where to try it.",
        why: "Discovery is useless without depth. Every launch has a full dedicated page.",
      },
      {
        id: "vc",
        title: "Vote, comment, bookmark",
        desc: "Upvote products, leave comments, and save what matters to you.",
        status: "Live",
        tone: "live",
        unlocks: "Community signal. Votes determine ranking. Comments surface insight.",
        why: "Real engagement drives real discovery. Signal from the community is the ranking system.",
      },
      {
        id: "sp",
        title: "Submit your product",
        desc: "Founders submit directly. Products go live after review.",
        status: "Live",
        tone: "live",
        unlocks: "Any research-backed founder can get their product in front of this audience.",
        why: "Supply and demand. More quality submissions leads to a better feed for everyone.",
      },
      {
        id: "ra",
        title: "Research archive",
        desc: `${SEED_PAPERS.length} indexed papers across frontier technology.`,
        status: "Live",
        tone: "live",
        unlocks: "The knowledge layer behind the products. Papers that products are built on.",
        why: "Context matters. Research archive connects products back to their scientific foundations.",
      },
      {
        id: "me",
        title: "Media and essays",
        desc: "AthenaX perspective on frontier tech - essays and research commentary.",
        status: "Live",
        tone: "live",
        unlocks: "Editorial context around what is being built and why it matters.",
        why: "Products need narrative. Media gives the ecosystem a voice.",
      },
    ],
  },
  {
    sysLabel: "COMING_NEXT.SYS",
    tag: "Next",
    tagTone: "coming",
    bodyClassName: "window-body window-body-cream",
    items: [
      {
        id: "rp",
        primary: true,
        title: "Researcher profiles",
        desc: "Named researchers with lab affiliations and publications linked to every product they founded.",
        status: "Coming",
        tone: "coming",
        unlocks: "Credibility context on every product card. Who built this and what have they published?",
        why: "The single most requested feature. Turns anonymous launches into credible founder stories.",
      },
      {
        id: "bd",
        title: "Better discovery",
        desc: "Smarter search, richer sector filters, and topic-specific feeds.",
        status: "Coming",
        tone: "coming",
        unlocks: "Find exactly what you are looking for instead of browsing the full feed.",
        why: "As the launch count grows, navigation needs to scale with it.",
      },
      {
        id: "ff",
        title: "Follow and feed",
        desc: "Follow topics and founders. Get a personalised launch and research feed.",
        status: "Coming",
        tone: "coming",
        unlocks: "Retention. Users who follow topics and founders return daily.",
        why: "A personalised feed makes the platform habitual, not occasional.",
      },
    ],
  },
  {
    sysLabel: "IN_DEVELOPMENT.SYS",
    tag: "Building",
    tagTone: "building",
    items: [
      {
        id: "rt",
        primary: true,
        title: "Research Terminal",
        desc: "Investor intelligence layer - track which researchers are founding companies.",
        status: "Building",
        tone: "building",
        unlocks: "Subscription product for investors. Query by lab, topic, or credential velocity.",
        why: "The highest-value surface on the platform. Institutional subscribers pay $500-$50K/month for early founder signals.",
      },
      {
        id: "ars",
        title: "ARS credentialing",
        desc: "Academic reputation scores based on citations, peer reviews, and publications.",
        status: "Data layer",
        tone: "data",
        unlocks: "A portable credibility score for every researcher. Verifiable, not self-reported.",
        why: "Needs real publication data to activate. Currently a preview signal and will become the core trust layer.",
      },
      {
        id: "bm",
        title: "Bounty marketplace",
        desc: "Companies post funded research challenges. Credentialed researchers apply and earn.",
        status: "Building",
        tone: "building",
        unlocks: "Revenue stream and ecosystem flywheel. Companies fund research, researchers earn, platform takes 10%.",
        why: "Creates a direct economic loop between companies who need research and researchers who produce it.",
      },
      {
        id: "bc",
        title: "Builder cohorts",
        desc: "12-week incubation program converting researchers into funded founders.",
        status: "Building",
        tone: "building",
        unlocks: "$150-250K per team. 5-8% equity. Graduates become the best-performing launches on the feed.",
        why: "The cohort is both a product and proof-of-concept. Cohort graduates demonstrate the AthenaX model works.",
      },
      {
        id: "lu",
        title: "Labs and universities",
        desc: "Institutional index of partner research labs and universities.",
        status: "Network",
        tone: "network",
        unlocks: "Links researchers to their institutions, papers to their labs, products to their origins.",
        why: "Institutional trust. A product from MIT CSAIL means something different than a product from nowhere.",
      },
    ],
  },
  {
    sysLabel: "VISION.SYS",
    tag: "Long-term",
    tagTone: "vision",
    bodyClassName: "window-body window-body-cream",
    items: [
      {
        id: "vrc",
        primary: true,
        title: "Verified research credentials",
        desc: "Every researcher has a portable reputation score - verified, on-chain, permanent.",
        status: "Vision",
        tone: "vision",
        unlocks: "A credential system that follows researchers from academia into industry into investment.",
        why: "The most durable moat in the platform. Years of citation data create a signal competitors cannot replicate overnight.",
      },
      {
        id: "vai",
        title: "AI intelligence layer",
        desc: "Auto-summarised research, smart signal detection, pre-formation founder radar.",
        status: "Vision",
        tone: "vision",
        unlocks: "The platform thinks ahead of its users. Surfaces founders before they announce, papers before they trend.",
        why: "The intelligence layer is what separates AthenaX from a directory.",
      },
      {
        id: "vdao",
        title: "DAO governance",
        desc: "Community ownership, on-chain funding, and public goods infrastructure.",
        status: "Vision",
        tone: "vision",
        unlocks: "The platform becomes owned by the researchers and builders who create its value.",
        why: "NounsDAO proved that on-chain governance can coordinate $100M+ in public goods. AthenaX applies that model to research.",
      },
      {
        id: "vos",
        title: "Where New Products Begin",
        desc: "Every product. Every founder. Every breakthrough - discovered here first.",
        status: "Vision",
        tone: "vision",
        unlocks: "The full AthenaX OS. Research-to-product-to-capital in one system.",
        why: "The end state is a platform where every serious frontier technology product has a home and every serious investor has a subscription.",
      },
    ],
  },
];

const RoadmapItemCard = ({ item, isOpen, onToggle }: { item: RoadmapItem; isOpen: boolean; onToggle: () => void }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full cursor-pointer rounded-[10px] border-[1.5px] text-left transition-all duration-100",
        "hover:-translate-x-px hover:-translate-y-px hover:shadow-[2px_2px_0_#1C1C27]",
        isOpen
          ? "border-ink bg-white px-4.5 py-4 shadow-[4px_4px_0_#1C1C27] -translate-x-px -translate-y-px"
          : cn("border-[#D8D4CC] bg-cream", item.primary ? "px-4.5 py-4" : "px-4 py-3.25")
      )}
      aria-expanded={isOpen}
      aria-controls={`roadmap-item-${item.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className={cn("mb-0.75 font-bold text-ink", item.primary ? "text-[15px]" : "text-sm")}>{item.title}</div>
          <div className="text-xs leading-normal text-muted">{item.desc}</div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "inline-block rounded-md border-[1.5px] px-2.25 py-0.75 font-['Space_Mono',monospace] text-[10px] font-semibold uppercase tracking-[0.05em]",
              toneClasses[item.tone]
            )}
          >
            {item.status}
          </span>
          <span
            className={cn(
              "inline-block font-['Space_Mono',monospace] text-[11px] text-muted transition-transform duration-150",
              isOpen && "rotate-90"
            )}
          >
            ›
          </span>
        </div>
      </div>

      {isOpen && (
        <div id={`roadmap-item-${item.id}`} className="mt-3.5 border-t border-[#D8D4CC] pt-3.5">
          <div className="mb-2.5">
            <div className="mb-1.25 font-['Space_Mono',monospace] text-[9px] uppercase tracking-[0.08em] text-muted">What it unlocks</div>
            <div className="text-[13px] leading-[1.6] text-ink">{item.unlocks}</div>
          </div>
          <div>
            <div className="mb-1.25 font-['Space_Mono',monospace] text-[9px] uppercase tracking-[0.08em] text-muted">Why it matters</div>
            <div className="text-[13px] leading-[1.6] text-ink">{item.why}</div>
          </div>
        </div>
      )}
    </button>
  );
};

const RoadmapSectionCard = ({
  section,
  open,
  onToggle,
}: {
  section: RoadmapSection;
  open: Record<string, boolean>;
  onToggle: (id: string) => void;
}) => {
  return (
    <div className="window-card mb-4">
      <div className="window-titlebar">
        <div className="dot dot-r" />
        <div className="dot dot-y" />
        <div className="dot dot-g" />
        <span className="titlebar-label">{section.sysLabel}</span>
        <span
          className={cn(
            "ml-auto inline-block rounded-md border-[1.5px] px-2.25 py-0.5 font-['Space_Mono',monospace] text-[10px] font-semibold uppercase tracking-[0.05em]",
            sectionTagClasses[section.tagTone]
          )}
        >
          {section.tag}
        </span>
      </div>
      <div className={section.bodyClassName ?? "window-body"}>
        <div className="flex flex-col gap-2">
          {section.items.map((item) => (
            <RoadmapItemCard key={item.id} item={item} isOpen={Boolean(open[item.id])} onToggle={() => onToggle(item.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function RoadmapPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({ lf: true });
  const { data: productStats } = useProductStats();

  const toggle = (key: string) => {
    setOpen((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/roadmap</div>

      <div className="mb-3 flex flex-wrap items-center gap-3.5">
        <h1 className="text-[clamp(36px,5vw,52px)] leading-none">What We&apos;re Building</h1>
        <span className="inline-flex items-center gap-1.75 rounded-full border-[1.5px] border-ink bg-success px-3.25 py-1 font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.07em] text-ink">
          <span className="size-1.75 shrink-0 rounded-full bg-[#4CAF50] animate-pulse" />
          Live
        </span>
      </div>

      <p className="mb-0 max-w-135 text-[17px] leading-[1.65] text-muted">
        AthenaX launches with real products, real research, and real media. Click any item to expand it.
      </p>

      <hr className="divider" />

      <div className="mb-10 grid overflow-hidden rounded-xl border-2 border-ink bg-white shadow-[4px_4px_0_#1C1C27] md:grid-cols-4">
        {[
          { label: "Products live", val: (productStats?.releases.total ?? null) },
          { label: "Research papers", val: 18 },
          { label: "Sectors", val: 8 },
          { label: "Submissions", val: "Open" },
        ].map((stat, index, array) => (
          <div key={stat.label} className={cn("px-5 py-4", "border-[#D8D4CC]", index < array.length - 1 && "border-b md:border-b-0 md:border-r")}>
            <div className="mb-1.25 font-['Space_Mono',monospace] text-[9px] uppercase tracking-widest text-muted">{stat.label}</div>
            <div className="text-[22px] font-bold text-ink">{stat.val ?? "-"}</div>
          </div>
        ))}
      </div>

      {sections.map((section) => (
        <RoadmapSectionCard key={section.sysLabel} section={section} open={open} onToggle={toggle} />
      ))}
    </div>
  );
}
