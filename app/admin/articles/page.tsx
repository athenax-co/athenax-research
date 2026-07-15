"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useArticlesList, useDeleteArticle } from "@/features/articles";
import { ContentRow } from "@/components/Content";
import { cn } from "@/utils/lib";
import { ArticleStatus } from "@/enums";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-[#15803D10] text-[#15803D]",
  draft: "bg-[#E8A00010] text-[#E8A000]",
  archived: "bg-[#1c1c2710] text-muted",
};


export default function Page() {
  const { user, showToast } = useGlobal();
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | undefined>(undefined);
  const { data: articles = [], isLoading } = useArticlesList({ status: statusFilter }, { auth: true });
  const { mutate: deleteArticle } = useDeleteArticle();

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin/articles</div>
        <h1 className="mb-3 text-5xl">Articles</h1>
        <WindowCard label="ACCESS_DENIED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Admin access required.</p>
          <Link className="btn btn-outline" href="/admin">
            Back to Admin
          </Link>
        </WindowCard>
      </div>
    );
  }

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteArticle(id, {
      onSuccess: () => showToast(`Deleted: ${title.slice(0, 40)}`, "info"),
      onError: () => showToast("Delete failed.", "error"),
    });
  };

  const filters: { label: string; value: ArticleStatus | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Draft", value: ArticleStatus.DRAFT },
    { label: "Published", value: ArticleStatus.PUBLISHED },
    { label: "Archived", value: ArticleStatus.ARCHIVED },
  ];

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/admin/articles</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Link href="/admin" className="font-sans text-xs text-muted no-underline hover:text-ink">
            ← Admin
          </Link>
          <h1 className="mb-0 text-5xl">Articles</h1>
        </div>
        <Link href="/admin/articles/editor"  className={cn(buttonVariants({ size: "sm" }), "no-underline")}>
          + New Article
        </Link>
      </div>
      <p className="mb-0 text-[17px] text-muted">Manage editorial articles, white papers, and recaps.</p>
      <hr className="divider" />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map(({ label, value }) => (
          <Button
            key={label}
            size="sm"
            variant={statusFilter === value ? "ghost" : "outline"}
            className={statusFilter === value ? "bg-yellow" : undefined}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <WindowCard label="ARTICLES.SYS">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted">No articles found.</p>
        ) : (
          articles.map((article) => (
            <ContentRow
              key={article.id}
              item={article}
              kind="article"
              statusBadge={
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-wide",
                    STATUS_COLORS[article.status]
                  )}
                >
                  {article.status}
                </span>
              }
              actions={
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/articles/editor?id=${article.id}`} className="btn btn-outline btn-sm no-underline">
                    Edit →
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(article.id, article.title)}>
                    ✗
                  </Button>
                </div>
              }
            />
          ))
        )}
      </WindowCard>
    </div>
  );
}
