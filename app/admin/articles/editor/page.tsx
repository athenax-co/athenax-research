"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useArticleById, useCreateArticle, useUpdateArticle, type ArticleOut } from "@/features/articles";
import { useBroadcastsList } from "@/features/broadcasts";
import { ArticleType, ArticleStatus } from "@/enums";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { cn } from "@/utils/lib";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrafficLights,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";

const TYPE_OPTIONS = [
  { value: ArticleType.WHITEPAPER, label: "Whitepaper" },
  { value: ArticleType.LIVESTREAM, label: "Livestream" },
  { value: ArticleType.ROUNDTABLE, label: "Roundtable" },
];

const FIELD_LABEL = "mb-1.5 block font-['Space_Mono',monospace] text-[11px] font-bold uppercase tracking-[0.07em] text-muted";
const FIELD_INPUT =
  "w-full rounded-lg border-2 border-ink bg-white px-4 py-2.5 text-[15px] text-ink outline-none placeholder:text-muted/50 focus:shadow-[3px_3px_0_#1c1c27]";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not set";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const toDatetimeLocal = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

type FormProps = {
  article?: ArticleOut;
  articleId?: number;
  broadcastId?: number;
  userName?: string;
  showToast: (text: string, type?: string) => void;
};

function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (input.trim()) addTag(input);
  };

  return (
    <div className="flex min-h-10 flex-wrap gap-1.5 rounded-lg border-2 border-ink bg-white px-3 py-2 focus-within:shadow-[3px_3px_0_#1c1c27]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded bg-[#F0EDE6] px-2 py-0.5 font-['Space_Mono',monospace] text-[11px] font-bold tracking-wide text-ink"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 text-muted hover:text-ink leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={tags.length === 0 ? "Type a tag and press Enter or comma…" : ""}
        className="min-w-35 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-muted/50"
      />
    </div>
  );
}

function ArticleEditorForm({ article, articleId, broadcastId, userName, showToast }: FormProps) {
  const router = useRouter();
  const { mutate: createArticle, isPending: creating } = useCreateArticle();
  const { mutate: updateArticle, isPending: updating } = useUpdateArticle();
  const isEdit = articleId != null;

  const { data: broadcasts = [] } = useBroadcastsList(undefined, { auth: true });
  const [selectedBroadcastId, setSelectedBroadcastId] = useState<number | null>(
    () => (isEdit ? (article?.broadcastId ?? null) : (broadcastId ?? null))
  );

  const [title, setTitle] = useState(() => article?.title ?? "");
  const [slug, setSlug] = useState(() => article?.slug ?? "");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [articleType, setArticleType] = useState<ArticleType>(() => article?.articleType ?? ArticleType.WHITEPAPER);
  const [content, setContent] = useState(() => article?.content ?? "");
  const [tags, setTags] = useState<string[]>(() => article?.tags ?? []);
  const [publishedAt, setPublishedAt] = useState(() => toDatetimeLocal(article?.publishedAt));

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ArticleStatus | null>(null);

  const isPending = creating || updating;
  const headingText = title.trim() || (isEdit ? "Edit Article" : "New Article");
  const currentStatus = article?.status;

  const draftLabel = !isEdit
    ? "Save Draft"
    : currentStatus === ArticleStatus.DRAFT
    ? "Update Draft"
    : "Save as Draft";

  const publishLabel = !isEdit
    ? "Publish"
    : currentStatus === ArticleStatus.PUBLISHED
    ? "Update"
    : currentStatus === ArticleStatus.ARCHIVED
    ? "Republish"
    : "Publish";

  const submitWith = (targetStatus: ArticleStatus) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Title is required.", "error");
      return;
    }

    const slugChanged = isEdit && slug !== (article?.slug ?? "");

    const baseData = {
      title: trimmedTitle,
      articleType,
      status: targetStatus,
      content: content || null,
      tags,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      ...(slugChanged ? { slug } : {}),
    };

    setPendingAction(targetStatus);
    setSlugError(null);

    const onSuccess = (msg: string) => (updated: ArticleOut) => {
      setPendingAction(null);
      setSlug(updated.slug);
      showToast(msg, "success");
      router.push("/admin/articles");
    };
    const onError = (msg: string) => (err: Error) => {
      setPendingAction(null);
      if (err.message && /slug/i.test(err.message)) {
        setSlugError(err.message);
        return;
      }
      showToast(err.message || msg, "error");
    };

    if (isEdit && articleId != null) {
      updateArticle(
        { id: articleId, data: { ...baseData, broadcastId: selectedBroadcastId } },
        { onSuccess: onSuccess("Article updated."), onError: onError("Update failed.") }
      );
    } else {
      createArticle(
        { ...baseData, ...(selectedBroadcastId != null ? { broadcastId: selectedBroadcastId } : {}) },
        { onSuccess: onSuccess("Article created."), onError: onError("Create failed.") }
      );
    }
  };

  const handleArchive = () => setArchiveOpen(true);

  const confirmArchive = () => {
    setArchiveOpen(false);
    submitWith(ArticleStatus.ARCHIVED);
  };

  return (
    <>
      {/* Floating action bar */}
      <div className="sticky top-17 z-40 flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] bg-paper px-5 py-3">
        <Link href="/admin/articles" className="font-mono text-xs text-muted no-underline hover:underline">
          ← Articles
        </Link>
        <span className="h-3 w-px bg-[#D8D4CC]" />
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{headingText}</p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isEdit && currentStatus !== ArticleStatus.ARCHIVED && (
            <>
              <Button variant="ghost" size="sm" className="text-muted" onClick={handleArchive} disabled={isPending}>
                {pendingAction === ArticleStatus.ARCHIVED ? <span className="spinner" /> : "Archive"}
              </Button>
              <span className="h-3 w-px bg-[#D8D4CC]" />
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => submitWith(ArticleStatus.DRAFT)} disabled={isPending}>
            {pendingAction === ArticleStatus.DRAFT ? <span className="spinner" /> : draftLabel}
          </Button>
          <Button size="sm" onClick={() => submitWith(ArticleStatus.PUBLISHED)} disabled={isPending}>
            {pendingAction === ArticleStatus.PUBLISHED ? <span className="spinner" /> : publishLabel}
          </Button>
        </div>
      </div>

      <div className="page-wrap section">

        <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Main column */}
          <div className="min-w-0 space-y-6">
            <div className="space-y-2">
              <label className={FIELD_LABEL}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title"
                maxLength={255}
                className={FIELD_INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL}>Content</label>
              <MarkdownEditor value={content} onChange={setContent} minHeight="min-h-[32rem]" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:border-l lg:border-[#D8D4CC] lg:pl-8">
            <div className="rounded-xl border-2 border-ink bg-white p-5 space-y-4">
              <div className="font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                Settings
              </div>

              {isEdit && (
                <div>
                  <label className={FIELD_LABEL}>Slug</label>
                  <textarea
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.replace(/\n/g, ""));
                      if (slugError) setSlugError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    rows={1}
                    placeholder="article-slug"
                    className={cn(
                      "block w-full resize-none rounded-lg border-2 border-[#D8D4CC] bg-cream px-4 py-2.5 text-[13px] leading-snug text-muted outline-none break-all focus:border-ink focus:text-ink focus:shadow-[3px_3px_0_#1c1c27]",
                      slugError && "border-red-600 text-red-600",
                    )}
                    style={{ wordBreak: "break-all" }}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                  />
                  {slugError && <p className="mt-1 text-[11px] text-red-600">{slugError}</p>}
                </div>
              )}

              <div>
                <label className={FIELD_LABEL}>Type</label>
                <select
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value as ArticleType)}
                  className={FIELD_INPUT}
                >
                  {TYPE_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={FIELD_LABEL}>Broadcast</label>
                <select
                  value={selectedBroadcastId ?? ""}
                  onChange={(e) => setSelectedBroadcastId(e.target.value ? Number(e.target.value) : null)}
                  className={FIELD_INPUT}
                >
                  <option value="">None (standalone)</option>
                  {broadcasts.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={FIELD_LABEL}>Tags</label>
                <TagInput tags={tags} onChange={setTags} />
                <p className="mt-1 text-[11px] text-muted">Press Enter or comma to add.</p>
              </div>

              <div>
                <label className={FIELD_LABEL}>Publish Date</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className={cn(FIELD_INPUT, "text-[14px]")}
                />
                <p className="mt-1 text-[11px] text-muted">Leave blank to use current time when publishing.</p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-[#D8D4CC] bg-cream p-5 space-y-3 text-[13px] text-muted">
              <div className="font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                Info
              </div>
              <div>
                <div className={FIELD_LABEL}>Created By</div>
                <div className="text-ink">{article?.creatorName ?? userName ?? "Current admin"}</div>
              </div>
              {isEdit && (
                <>
                  <div>
                    <div className={FIELD_LABEL}>Status</div>
                    <div className="text-ink capitalize">{article?.status ?? "—"}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Created</div>
                    <div className="text-ink">{formatDateTime(article?.createdAt)}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Last Modified</div>
                    <div className="text-ink">{formatDateTime(article?.updatedAt)}</div>
                  </div>
                </>
              )}
            </div>

          </aside>
        </div>
      </div>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTrafficLights />
            <DialogTitle>Archive Article</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <p className="text-[15px] text-ink">
              Archive <span className="font-semibold">&ldquo;{headingText}&rdquo;</span>?
            </p>
            <p className="mt-1.5 text-[13px] text-muted">
              It will be removed from public view. You can republish it at any time.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose className={buttonVariants({ variant: "outline", size: "sm", className: "text-xs h-9" })}>Cancel</DialogClose>
            <Button size="sm" onClick={confirmArchive} disabled={isPending}>
              {pendingAction === ArticleStatus.ARCHIVED ? <span className="spinner" /> : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : undefined;
  const isEdit = id != null;
  const broadcastIdParam = searchParams.get("broadcastId");
  const broadcastId = broadcastIdParam ? Number(broadcastIdParam) : undefined;

  const { user, showToast } = useGlobal();
  const { data: article, isLoading: loadingArticle } = useArticleById(id);

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin/articles/editor</div>
        <h1 className="mb-3 text-5xl">Editor</h1>
        <div className="rounded-xl border-2 border-ink bg-paper p-7">
          <p className="mb-4 text-[15px]">Admin access required.</p>
          <Link className={cn(buttonVariants({ variant: "outline" }), "no-underline")} href="/admin">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  if (isEdit && loadingArticle) {
    return (
      <div className="page-wrap section animate-pulse">
        <div className="mb-8 h-4 w-48 rounded bg-[#E8E4DC]" />
        <div className="h-8 w-64 rounded bg-[#E8E4DC]" />
      </div>
    );
  }

  return (
    <ArticleEditorForm
      article={article}
      articleId={id}
      broadcastId={broadcastId}
      userName={user.name}
      showToast={showToast}
    />
  );
}
