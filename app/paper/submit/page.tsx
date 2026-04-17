"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import WindowCard from "@/components/ui/WindowCard";
import CategorySelector from "@/components/ui/CategorySelector";
import { useGlobal } from "@/components/GlobalProvider";
import { useMyPapers, useSubmitPaper, useUpdatePaper, FullScreenEditorDialog } from "@/features/papers";
import type { PaperOut, PaperSourceType } from "@/features/papers";
import { useProducts } from "@/features/products";
import { PaperStatus } from "@/enums";

const BlockNoteViewer = dynamic(() => import("@/components/editor/BlockNoteViewer"), { ssr: false });

const parseAsNullableInteger = {
  parse: (value: string) => (value === "" ? null : parseInt(value)),
  serialize: (value: number | null) => value?.toString() ?? "",
  defaultValue: null as number | null,
};

const SUBMIT_TYPES = ["new", "existing"] as const;
type SubmitType = (typeof SUBMIT_TYPES)[number];

const sourceTypeMap: Record<SubmitType, PaperSourceType> = {
  new: "editor",
  existing: "link",
};

const externalUrlSchema = z.string().trim().min(1, "External URL is required for linked papers.").pipe(z.url("Invalid URL."));

const paperSubmitSchema = z
  .object({
    sourceType: z.enum(["link", "editor"]),
    title: z.string().trim().min(1, "Paper title is required."),
    abstract: z.string().trim().min(1, "Abstract is required."),
    externalUrl: z.string().trim(),
    content: z.string(),
    categoryIds: z.array(z.number()),
    productId: z.number().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.sourceType !== "link") return;

    const result = externalUrlSchema.safeParse(value.externalUrl);
    if (!result.success) {
      ctx.addIssue({
        code: "custom",
        path: ["externalUrl"],
        message: result.error.issues[0]?.message ?? "Invalid external URL.",
      });
    }
  });

type PaperSubmitValues = z.infer<typeof paperSubmitSchema>;
type PaperSubmitField = "title" | "abstract" | "externalUrl";

const emptyForm = {
  title: "",
  abstract: "",
  externalUrl: "",
  content: "",
};

function getPaperDisplayStatus(paper: PaperOut) {
  return paper.status === PaperStatus.DRAFT ? PaperStatus.DRAFT : paper.verificationStatus;
}

function paperStatusClass(status: string) {
  if (status === "draft") return "bg-[#EAF0F6] text-ink";
  if (status === "approved") return "bg-success";
  if (status === "rejected") return "bg-red-100 text-[#E8323C]";
  return "bg-amber-100 text-ink";
}

function MyPapersCompact({ papers, isLoading }: { papers: PaperOut[]; isLoading: boolean }) {
  const recentPapers = papers.slice(0, 5);

  return (
    <WindowCard label="YOUR_PAPERS.SYS">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">DRAFTS AND SUBMISSIONS</div>
        <Link href="/dashboard" className="font-mono text-[11px] text-muted no-underline hover:underline">
          View dashboard →
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-[#E8E4DC]" />
          ))}
        </div>
      ) : recentPapers.length === 0 ? (
        <p className="mb-0 text-sm text-muted">No papers yet. Choose a submission path to start one.</p>
      ) : (
        recentPapers.map((paper) => {
          const status = getPaperDisplayStatus(paper);
          const href = status === PaperStatus.DRAFT ? `/paper/submit?draftId=${paper.id}` : `/paper/${paper.slug}`;

          return (
            <Link key={paper.id} href={href} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
              <div className="min-w-0 flex-1">
                <div className="archive-title text-sm">
                  {(paper.title?.length ?? 0) > 58 ? `${paper.title.slice(0, 58)}...` : paper.title || "Untitled"}
                </div>
                <div className="archive-meta">
                  {paper.sourceType === "editor" ? "Created on AthenaX" : "External paper"} · {new Date(paper.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <span className={`ftag shrink-0 text-[10px] ${paperStatusClass(status)}`}>{status}</span>
            </Link>
          );
        })
      )}
    </WindowCard>
  );
}

export default function Page() {
  const { user, showToast } = useGlobal();
  const router = useRouter();
  const [draftId, setDraftId] = useQueryState("draftId", parseAsNullableInteger);
  const [submitType, setSubmitType] = useQueryState("type", parseAsStringLiteral(SUBMIT_TYPES));
  const { mutateAsync: submitPaper, isPending: submittingNew } = useSubmitPaper();
  const { mutateAsync: updatePaper, isPending: updatingDraft } = useUpdatePaper();
  const { data: products } = useProducts("approved");
  const { data: myPapers = [], isLoading: loadingMyPapers } = useMyPapers();

  const draftPaper = useMemo(
    () => (draftId && Number.isFinite(draftId) ? myPapers.find((paper) => paper.id === draftId) : undefined),
    [draftId, myPapers]
  );
  const editingDraftId = draftPaper?.status === PaperStatus.DRAFT ? draftPaper.id : null;

  const sourceType: PaperSourceType = submitType ? sourceTypeMap[submitType] : "link";

  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [editorOpen, setEditorOpen] = useState(false);
  const [hydratedDraftId, setHydratedDraftId] = useState<number | null>(null);
  const [missingDraftNotified, setMissingDraftNotified] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<PaperSubmitField, string>>>({});

  const submitting = submittingNew || updatingDraft;

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!draftId || !Number.isFinite(draftId)) return;

    if (loadingMyPapers || hydratedDraftId === draftId) return;

    const invalidReason = !draftPaper
      ? "Draft not found in your papers."
      : draftPaper.status !== PaperStatus.DRAFT
        ? "Only drafts can be edited from this page."
        : null;

    if (invalidReason || !draftPaper) {
      if (missingDraftNotified !== draftId) {
        showToast(invalidReason ?? "Draft not found in your papers.", "error");
        setMissingDraftNotified(draftId);
      }
      setSubmitType(null);
      setDraftId(null);
      return;
    }

    setSubmitType(draftPaper.sourceType === "editor" ? "new" : "existing");
    setCategoryIds(draftPaper.categoryIds ?? []);
    setProductId(draftPaper.productId ?? undefined);
    setForm({
      title: draftPaper.title ?? "",
      abstract: draftPaper.abstract ?? "",
      externalUrl: draftPaper.externalUrl ?? "",
      content: draftPaper.content ?? "",
    });
    setErrors({});
    setHydratedDraftId(draftId);
  }, [draftId, draftPaper, hydratedDraftId, loadingMyPapers, missingDraftNotified, showToast, setDraftId, setSubmitType]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const startNew = (type: SubmitType) => {
    setSubmitType(type);
    setDraftId(null);
    setCategoryIds([]);
    setProductId(undefined);
    setForm(emptyForm);
    setErrors({});
    setHydratedDraftId(null);
  };

  const goBack = () => {
    setSubmitType(null);
    setDraftId(null);
  };

  const validate = (): PaperSubmitValues | null => {
    const result = paperSubmitSchema.safeParse({
      ...form,
      sourceType,
      categoryIds,
      productId,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<PaperSubmitField, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if ((field === "title" || field === "abstract" || field === "externalUrl") && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
      showToast(result.error.issues[0]?.message ?? "Please check the paper details.", "error");
      return null;
    }

    setErrors({});
    return result.data;
  };

  const submit = async (status: PaperStatus) => {
    if (!user) {
      showToast("Sign in to submit a paper.", "error");
      return;
    }
    const values = validate();
    if (!values) return;

    const payload = {
      title: values.title,
      status,
      externalUrl: values.sourceType === "link" ? values.externalUrl : undefined,
      abstract: values.abstract,
      content: values.sourceType === "editor" ? values.content || undefined : undefined,
      categoryIds: values.categoryIds,
      productId: values.productId,
    };

    try {
      if (editingDraftId) {
        await updatePaper({ id: editingDraftId, data: payload });
      } else {
        await submitPaper({
          ...payload,
          sourceType: values.sourceType,
        });
      }

      if (status === PaperStatus.PUBLISHED) {
        showToast("Paper submitted for review.", "success");
        router.push("/dashboard");
      } else {
        showToast(editingDraftId ? "Draft updated." : "Paper saved as draft.", "success");
        goBack();
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to submit paper.", "error");
    }
  };

  if (!user) {
    return (
      <div>
        <div className="page-wrap section">
          <div className="path-badge">/root/paper/submit</div>
          <h1 className="mb-4 text-[42px]">Submit a Paper</h1>
          <p className="mb-6 text-[17px] text-muted">You need to be signed in as a researcher to submit.</p>
        </div>
      </div>
    );
  }

  const formTitle = editingDraftId ? "Edit Draft" : submitType === "new" ? "Create Paper Here" : "Submit Existing Paper";

  return (
    <div>
      <div className="page-wrap page-wrap-narrow-md section">
        <div className="path-badge">/root/paper/submit</div>
        <h1 className="mb-2 text-[42px]">Submit a Paper</h1>
        <p className="mb-0 text-base text-muted">Open-access. Community-voted. Reviewed by admins before publishing.</p>

        <hr className="divider" />

        {!submitType ? (
          <div className="space-y-5">
            <WindowCard label="PAPER_SUBMISSION.START">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="min-h-36 cursor-pointer rounded-lg border-2 border-ink bg-yellow p-4 text-left shadow-[3px_3px_0_#1C1C27] transition-all duration-100 hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#1C1C27]"
                  onClick={() => startNew("new")}
                >
                  <div className="mb-2 text-[17px] font-bold text-ink">Create paper here</div>
                  <p className="mb-0 text-[13px] leading-6 text-muted">Draft directly in the AthenaX editor and submit it for review when ready.</p>
                </button>
                <button
                  type="button"
                  className="min-h-36 cursor-pointer rounded-lg border-2 border-ink bg-white p-4 text-left shadow-[3px_3px_0_#1C1C27] transition-all duration-100 hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#1C1C27]"
                  onClick={() => startNew("existing")}
                >
                  <div className="mb-2 text-[17px] font-bold text-ink">Submit existing paper</div>
                  <p className="mb-0 text-[13px] leading-6 text-muted">
                    Share an arXiv, DOI, or external paper link with metadata for the review queue.
                  </p>
                </button>
              </div>
            </WindowCard>

            <MyPapersCompact papers={myPapers} isLoading={loadingMyPapers} />
          </div>
        ) : (
          <WindowCard label="PAPER_SUBMISSION.FORM">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="mb-0 text-[24px] leading-tight">{formTitle}</h2>
              <button type="button" className="btn btn-outline btn-sm" onClick={goBack}>
                ← Back
              </button>
            </div>

            <div className="inp-group">
              <label className="inp-label">Paper Title *</label>
              <input className="inp" value={form.title} onChange={set("title")} placeholder="A descriptive, full title" />
              {errors.title && <div className="inp-error">{errors.title}</div>}
            </div>

            {products && products.length > 0 && (
              <div className="inp-group">
                <label className="inp-label">Link to Product </label>
                <select className="inp" value={productId ?? ""} onChange={(e) => setProductId(e.target.value ? Number(e.target.value) : undefined)}>
                  <option value="">None</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {sourceType === "link" && (
              <div className="inp-group">
                <label className="inp-label">External URL *</label>
                <input className="inp" value={form.externalUrl} onChange={set("externalUrl")} placeholder="https://arxiv.org/abs/... or DOI link" />
                {errors.externalUrl && <div className="inp-error">{errors.externalUrl}</div>}
              </div>
            )}

            <div className="inp-group">
              <label className="inp-label">Abstract *</label>
              <textarea
                className="inp"
                rows={5}
                value={form.abstract}
                onChange={set("abstract")}
                placeholder="250-500 words. Summarise the problem, method, and key findings."
              />
              {errors.abstract && <div className="inp-error">{errors.abstract}</div>}
            </div>

            {sourceType === "editor" && (
              <div className="inp-group">
                <div className="flex items-center justify-between">
                  <label className="inp-label mb-0">Paper Content </label>
                  {form.content && <span className="text-xs text-muted">Content added</span>}
                </div>
                <button
                  type="button"
                  className="group relative mt-1 min-h-32 w-full overflow-hidden rounded-lg border-2 border-ink bg-white px-3 py-2 text-left text-ink focus-visible:outline-none focus-visible:shadow-[3px_3px_0_#1c1c27] before:pointer-events-none before:absolute before:inset-0 before:z-1 before:bg-ink/20 before:opacity-0 before:transition-opacity hover:before:opacity-100 focus-visible:before:opacity-100 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-1 after:h-8 after:bg-linear-to-b after:from-white/0 after:to-white"
                  onClick={() => setEditorOpen(true)}
                >
                  <span className="absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Click to view
                  </span>

                  <div className="w-full">
                    {form.content ? (
                      <div className="pointer-events-none max-h-24 overflow-hidden text-[15px] font-normal leading-6">
                        <BlockNoteViewer content={form.content} />
                      </div>
                    ) : (
                      <div className="space-y-1 text-muted">
                        <p className="leading-6">No platform content yet.</p>
                        <p className="text-sm leading-6">Start drafting your paper in the editor.</p>
                      </div>
                    )}
                  </div>
                </button>
                <FullScreenEditorDialog
                  open={editorOpen}
                  onOpenChange={setEditorOpen}
                  value={form.content}
                  onChange={(json) => setForm((prev) => ({ ...prev, content: json }))}
                />
              </div>
            )}

            <div className="inp-group">
              <label className="inp-label">Categories </label>
              <CategorySelector selectedIds={categoryIds} onChangeIds={setCategoryIds} />
            </div>

            <div className="mb-4 rounded-lg border border-[#D8D4CC] bg-cream px-3.5 py-3 text-[13px] leading-7 text-muted">
              Submitted papers enter an admin review queue. Once approved, they will appear publicly on the Papers page and contribute to community
              rankings.
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="btn btn-outline flex-1 justify-center" onClick={() => submit(PaperStatus.DRAFT)} disabled={submitting}>
                {submitting ? "Saving..." : "Save as Draft"}
              </button>
              <button className="btn btn-primary flex-1 justify-center" onClick={() => submit(PaperStatus.PUBLISHED)} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit for Review →"}
              </button>
            </div>
          </WindowCard>
        )}
      </div>
    </div>
  );
}
