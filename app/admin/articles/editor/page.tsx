"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useArticleById, useCreateArticle, useUpdateArticle, type ArticleOut } from "@/features/articles";
import { useCategories } from "@/hooks/queries/useReference";
import { ArticleType, ArticleStatus } from "@/enums";
import MarkdownEditor from "@/components/editor/MarkdownEditor";
import { cn } from "@/utils/lib";
import type { CategoryOut } from "@/types/reference";

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
  parentCategories: CategoryOut[];
  userName?: string;
  showToast: (text: string, type?: string) => void;
};

function ArticleEditorForm({ article, articleId, parentCategories, userName, showToast }: FormProps) {
  const router = useRouter();
  const { mutate: createArticle, isPending: creating } = useCreateArticle();
  const { mutate: updateArticle, isPending: updating } = useUpdateArticle();
  const isEdit = articleId != null;

  const [title, setTitle] = useState(() => article?.title ?? "");
  const [articleType, setArticleType] = useState<ArticleType>(() => article?.articleType ?? ArticleType.WHITEPAPER);
  const [content, setContent] = useState(() => article?.content ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(() => {
    const firstName = article?.categories?.[0];
    if (!firstName) return "";
    return parentCategories.find((c) => c.name === firstName)?.id ?? "";
  });
  const [publishedAt, setPublishedAt] = useState(() => toDatetimeLocal(article?.publishedAt));

  const isPending = creating || updating;
  const headingText = title.trim() || (isEdit ? "Edit Article" : "New Article");

  const submitWith = (targetStatus: ArticleStatus) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Title is required.", "error");
      return;
    }

    const data = {
      title: trimmedTitle,
      articleType,
      status: targetStatus,
      content: content || null,
      categoryIds: categoryId !== "" ? [categoryId] : [],
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };

    if (isEdit && articleId != null) {
      updateArticle(
        { id: articleId, data },
        {
          onSuccess: () => {
            showToast("Article updated.", "success");
            router.push("/admin/articles");
          },
          onError: (err) => showToast(err.message || "Update failed.", "error"),
        }
      );
    } else {
      createArticle(data, {
        onSuccess: () => {
          showToast("Article created.", "success");
          router.push("/admin/articles");
        },
        onError: (err) => showToast(err.message || "Create failed.", "error"),
      });
    }
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
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => submitWith(ArticleStatus.DRAFT)}
            disabled={isPending}
          >
            {creating || updating ? <span className="spinner" /> : "Save Draft"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => submitWith(ArticleStatus.PUBLISHED)}
            disabled={isPending}
          >
            {isPending ? <span className="spinner" /> : "Publish"}
          </button>
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
                  <div className={FIELD_LABEL}>Slug</div>
                  <div className="overflow-hidden rounded-lg border-2 border-[#D8D4CC] bg-cream px-4 py-2.5 text-[13px] text-muted">
                    {article?.slug ?? "—"}
                  </div>
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
                <label className={FIELD_LABEL}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                  className={FIELD_INPUT}
                >
                  <option value="">— None —</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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

            {isEdit && (
              <button
                type="button"
                className="btn btn-ghost btn-sm w-full justify-center text-muted"
                onClick={() => submitWith(ArticleStatus.ARCHIVED)}
                disabled={isPending}
              >
                Archive Article
              </button>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : undefined;
  const isEdit = id != null;

  const { user, showToast } = useGlobal();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const parentCategories = useMemo(
    () => categories.filter((c) => c.parentId === null && c.status === "approved"),
    [categories]
  );

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

  if (isEdit && (loadingArticle || loadingCategories)) {
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
      parentCategories={parentCategories}
      userName={user.name}
      showToast={showToast}
    />
  );
}
