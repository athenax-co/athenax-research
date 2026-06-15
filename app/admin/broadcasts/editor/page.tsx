"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useBroadcastById, useCreateBroadcast, useUpdateBroadcast, type BroadcastOut } from "@/features/broadcasts";
import { BroadcastType, BroadcastStatus } from "@/enums";
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
  { value: BroadcastType.WHITEPAPER, label: "Whitepaper" },
  { value: BroadcastType.LIVESTREAM, label: "Livestream" },
  { value: BroadcastType.ROUNDTABLE, label: "Roundtable" },
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
  broadcast?: BroadcastOut;
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

function BroadcastEditorForm({ broadcast, broadcastId, userName, showToast }: FormProps) {
  const router = useRouter();
  const { mutate: createBroadcast, isPending: creating } = useCreateBroadcast();
  const { mutate: updateBroadcast, isPending: updating } = useUpdateBroadcast();
  const isEdit = broadcastId != null;

  const [title, setTitle] = useState(() => broadcast?.title ?? "");
  const [slug, setSlug] = useState(() => broadcast?.slug ?? "");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [broadcastType, setBroadcastType] = useState<BroadcastType>(() => broadcast?.broadcastType ?? BroadcastType.LIVESTREAM);
  const [embedUrl, setEmbedUrl] = useState(() => broadcast?.embedUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(() => broadcast?.thumbnailUrl ?? "");
  const [description, setDescription] = useState(() => broadcast?.description ?? "");
  const [tags, setTags] = useState<string[]>(() => broadcast?.tags ?? []);
  const [originDate, setOriginDate] = useState(() => toDatetimeLocal(broadcast?.originDate));

  const [archiveOpen, setArchiveOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<BroadcastStatus | null>(null);

  const isPending = creating || updating;
  const headingText = title.trim() || (isEdit ? "Edit Broadcast" : "New Broadcast");
  const currentStatus = broadcast?.status;

  const draftLabel = !isEdit
    ? "Save Draft"
    : currentStatus === BroadcastStatus.DRAFT
    ? "Update Draft"
    : "Save as Draft";

  const publishLabel = !isEdit
    ? "Publish"
    : currentStatus === BroadcastStatus.PUBLISHED
    ? "Update"
    : currentStatus === BroadcastStatus.ARCHIVED
    ? "Republish"
    : "Publish";

  const submitWith = (targetStatus: BroadcastStatus) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showToast("Title is required.", "error");
      return;
    }

    const slugChanged = isEdit && slug !== (broadcast?.slug ?? "");

    const data = {
      title: trimmedTitle,
      broadcastType,
      status: targetStatus,
      embedUrl: embedUrl.trim() || null,
      thumbnailUrl: thumbnailUrl.trim() || null,
      description: description.trim() || null,
      tags,
      originDate: originDate ? new Date(originDate).toISOString() : null,
      ...(slugChanged ? { slug } : {}),
    };

    setPendingAction(targetStatus);
    setSlugError(null);

    const onSuccess = (msg: string) => (updated: BroadcastOut) => {
      setPendingAction(null);
      setSlug(updated.slug);
      showToast(msg, "success");
      router.push("/admin/broadcasts");
    };
    const onError = (msg: string) => (err: Error) => {
      setPendingAction(null);
      if (err.message && /slug/i.test(err.message)) {
        setSlugError(err.message);
        return;
      }
      showToast(err.message || msg, "error");
    };

    if (isEdit && broadcastId != null) {
      updateBroadcast(
        { id: broadcastId, data },
        { onSuccess: onSuccess("Broadcast updated."), onError: onError("Update failed.") }
      );
    } else {
      createBroadcast(data, {
        onSuccess: onSuccess("Broadcast created."),
        onError: onError("Create failed."),
      });
    }
  };

  const confirmArchive = () => {
    setArchiveOpen(false);
    submitWith(BroadcastStatus.ARCHIVED);
  };

  return (
    <>
      <div className="sticky top-17 z-40 flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] bg-paper px-5 py-3">
        <Link href="/admin/broadcasts" className="font-mono text-xs text-muted no-underline hover:underline">
          ← Broadcasts
        </Link>
        <span className="h-3 w-px bg-[#D8D4CC]" />
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">{headingText}</p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {isEdit && currentStatus !== BroadcastStatus.ARCHIVED && (
            <>
              <Button variant="ghost" size="sm" className="text-muted" onClick={() => setArchiveOpen(true)} disabled={isPending}>
                {pendingAction === BroadcastStatus.ARCHIVED ? <span className="spinner" /> : "Archive"}
              </Button>
              <span className="h-3 w-px bg-[#D8D4CC]" />
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => submitWith(BroadcastStatus.DRAFT)} disabled={isPending}>
            {pendingAction === BroadcastStatus.DRAFT ? <span className="spinner" /> : draftLabel}
          </Button>
          <Button size="sm" onClick={() => submitWith(BroadcastStatus.PUBLISHED)} disabled={isPending}>
            {pendingAction === BroadcastStatus.PUBLISHED ? <span className="spinner" /> : publishLabel}
          </Button>
        </div>
      </div>

      <div className="page-wrap section">
        <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <div className="space-y-2">
              <label className={FIELD_LABEL}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Broadcast title"
                maxLength={255}
                className={FIELD_INPUT}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL}>Embed URL</label>
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className={FIELD_INPUT}
              />
              <p className="text-[11px] text-muted">YouTube watch or embed URL. Leave blank if no video.</p>
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Broadcast description or summary…"
                rows={6}
                className={cn(FIELD_INPUT, "resize-y leading-relaxed")}
              />
            </div>
          </div>

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
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                    rows={1}
                    placeholder="broadcast-slug"
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
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value as BroadcastType)}
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
                <label className={FIELD_LABEL}>Thumbnail URL</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className={FIELD_INPUT}
                />
              </div>

              <div>
                <label className={FIELD_LABEL}>Origin Date</label>
                <input
                  type="datetime-local"
                  value={originDate}
                  onChange={(e) => setOriginDate(e.target.value)}
                  className={cn(FIELD_INPUT, "text-[14px]")}
                />
                <p className="mt-1 text-[11px] text-muted">When the broadcast originally aired.</p>
              </div>


              <div>
                <label className={FIELD_LABEL}>Tags</label>
                <TagInput tags={tags} onChange={setTags} />
                <p className="mt-1 text-[11px] text-muted">Press Enter or comma to add.</p>
              </div>
            </div>

            {isEdit && (
              <div className="rounded-xl border-2 border-ink bg-white p-5 space-y-3">
                <div className="font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Article
                </div>
                {broadcast?.article ? (
                  <>
                    <div>
                      <div className="text-[13px] font-medium text-ink leading-snug">{broadcast.article.title}</div>
                      <div className="mt-0.5 text-[11px] capitalize text-muted">{broadcast.article.status}</div>
                    </div>
                    <Link
                      href={`/admin/articles/editor?id=${broadcast.article.slug}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline w-full justify-center text-xs")}
                    >
                      Edit Article
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] text-muted">No article linked.</p>
                    {broadcastId != null && (
                      <Link
                        href={`/admin/articles/editor?broadcastId=${broadcastId}`}
                        className={cn(buttonVariants({ size: "sm" }), "no-underline w-full justify-center text-xs")}
                      >
                        + Create Article
                      </Link>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="rounded-xl border-2 border-[#D8D4CC] bg-cream p-5 space-y-3 text-[13px] text-muted">
              <div className="font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                Info
              </div>
              <div>
                <div className={FIELD_LABEL}>Created By</div>
                <div className="text-ink">{broadcast?.creatorName ?? userName ?? "Current admin"}</div>
              </div>
              {isEdit && (
                <>
                  <div>
                    <div className={FIELD_LABEL}>Status</div>
                    <div className="text-ink capitalize">{broadcast?.status ?? "—"}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Created</div>
                    <div className="text-ink">{formatDateTime(broadcast?.createdAt)}</div>
                  </div>
                  <div>
                    <div className={FIELD_LABEL}>Last Modified</div>
                    <div className="text-ink">{formatDateTime(broadcast?.updatedAt)}</div>
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
            <DialogTitle>Archive Broadcast</DialogTitle>
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
              {pendingAction === BroadcastStatus.ARCHIVED ? <span className="spinner" /> : "Archive"}
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

  const { user, showToast } = useGlobal();
  const { data: broadcast, isLoading: loadingBroadcast } = useBroadcastById(id);

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin/broadcasts/editor</div>
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

  if (isEdit && loadingBroadcast) {
    return (
      <div className="page-wrap section animate-pulse">
        <div className="mb-8 h-4 w-48 rounded bg-[#E8E4DC]" />
        <div className="h-8 w-64 rounded bg-[#E8E4DC]" />
      </div>
    );
  }

  return (
    <BroadcastEditorForm
      broadcast={broadcast}
      broadcastId={id}
      userName={user.name}
      showToast={showToast}
    />
  );
}
