"use client";

import Link from "next/link";
import { useQueryState, parseAsString } from "nuqs";
import { ContentListState, ContentRow } from "@/components/Content";
import { useArticlesList } from "@/features/articles";
import { ArticleType, BroadcastType } from "@/enums";
import { useBroadcastsList } from "@/features/broadcasts";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "articles", label: "Articles" },
  { id: "broadcast", label: "Broadcast" },
] as const;

const TYPE_FILTERS: { value: ArticleType | null; label: string }[] = [
  { value: null, label: "All" },
  { value: ArticleType.WHITEPAPER, label: "Whitepaper" },
  { value: ArticleType.LIVESTREAM, label: "Livestream" },
  { value: ArticleType.ROUNDTABLE, label: "Roundtable" },
];

const BROADCAST_FILTERS: { value: BroadcastType | null; label: string }[] = [
  { value: null, label: "All" },
  { value: BroadcastType.WHITEPAPER, label: "Whitepaper" },
  { value: BroadcastType.LIVESTREAM, label: "Livestream" },
  { value: BroadcastType.ROUNDTABLE, label: "Roundtable" },
];

const ArchivePage = () => {
  const [tab, setTab] = useQueryState("tab", parseAsString.withDefault("articles"));
  const [typeFilter, setTypeFilter] = useQueryState("type", parseAsString);
  const [broadcastFilter, setBroadcastFilter] = useQueryState("btype", parseAsString);

  const activeType = (typeFilter as ArticleType | null) ?? null;
  const activeBroadcastType = (broadcastFilter as BroadcastType | null) ?? null;

  const { data: items = [], isLoading, isError } = useArticlesList({ articleType: activeType ?? undefined });
  const {
    data: broadcasts = [],
    isLoading: broadcastsLoading,
    isError: broadcastsError,
  } = useBroadcastsList(activeBroadcastType ? { broadcastType: activeBroadcastType } : undefined);

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/research</div>
        <h1 className="mb-2 text-[48px]">Research</h1>
        <p className="text-[17px] text-muted">Artifacts, learnings, and broadcasts.</p>
        <hr className="divider" />

        <div className="mb-5 flex items-center gap-2 border-b-2 border-b-[#1C1C27] pb-2.5 flex-wrap">
          {TABS.map(({ id, label }) => (
            <Button
              key={id}
              variant={tab === id ? "ghost" : "outline"}
              size="sm"
              className={tab === id ? "bg-yellow" : ""}
              onClick={() => {
                setTab(id);
                setTypeFilter(null);
                setBroadcastFilter(null);
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        {tab === "articles" && (
          <>
            <div className="mb-6 flex flex-wrap gap-1.5">
              {TYPE_FILTERS.map(({ value, label }) => (
                <Button
                  key={label}
                  variant={activeType === value ? "ghost" : "outline"}
                  size="xs"
                  className={activeType === value ? "bg-yellow" : ""}
                  onClick={() => setTypeFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {items.length > 0 ? (
              items.map((item) => (
                <Link key={item.slug} href={`/archive/${item.slug}`}>
                  <ContentRow item={item} kind="article" onClick={() => {}} />
                </Link>
              ))
            ) : (
              <ContentListState
                loading={isLoading}
                error={isError ? "Could not load content right now." : ""}
                emptyText={
                  activeType === ArticleType.WHITEPAPER ? "No whitepapers available yet." :
                  activeType === ArticleType.LIVESTREAM ? "No livestreams available yet." :
                  activeType === ArticleType.ROUNDTABLE ? "No roundtables available yet." :
                  "No articles available yet."
                }
              />
            )}
          </>
        )}

        {tab === "broadcast" && (
          <div>
            <div className="mb-6 flex flex-wrap gap-1.5">
              {BROADCAST_FILTERS.map(({ value, label }) => (
                <Button
                  key={label}
                  variant={activeBroadcastType === value ? "ghost" : "outline"}
                  size="xs"
                  className={activeBroadcastType === value ? "bg-yellow" : ""}
                  onClick={() => setBroadcastFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
            {broadcasts.length === 0 ? (
              <ContentListState
                loading={broadcastsLoading}
                error={broadcastsError ? "Could not load broadcasts right now." : ""}
                emptyText={
                  activeBroadcastType === BroadcastType.WHITEPAPER ? "No whitepaper readings available yet." :
                  activeBroadcastType === BroadcastType.LIVESTREAM ? "No live streams available yet." :
                  activeBroadcastType === BroadcastType.ROUNDTABLE ? "No roundtables available yet." :
                  "No broadcast videos available yet."
                }
              />
            ) : (
              <div>
                {broadcasts.map((item) => (
                  <Link key={item.id} href={`/archive/broadcast/${item.slug}`} className="no-underline">
                    <ContentRow item={item} kind="broadcast" onClick={() => {}} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
