"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import WindowCard from "@/components/ui/WindowCard";
import CategorySelector from "@/components/ui/CategorySelector";
import { useGlobal } from "@/components/GlobalProvider";
import { useSubmitPaper } from "@/hooks/queries/usePaper";
import { useProducts } from "@/hooks/queries/useProduct";
import type { PaperSourceType } from "@/types/paper";
import { PaperStatus } from "@/enums";
import { FullScreenEditorDialog } from "@/components/editor/FullScreenEditorDialog";

const BlockNoteViewer = dynamic(() => import("@/components/editor/BlockNoteViewer"), { ssr: false });

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

export default function Page() {
  const { user, showToast } = useGlobal();
  const router = useRouter();
  const { mutateAsync: submitPaper, isPending: submitting } = useSubmitPaper();
  const { data: products } = useProducts("approved");

  const [sourceType, setSourceType] = useState<PaperSourceType>("link");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    externalUrl: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<Record<PaperSubmitField, string>>>({});

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
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
    try {
      await submitPaper({
        title: values.title,
        sourceType: values.sourceType,
        status,
        externalUrl: values.sourceType === "link" ? values.externalUrl : undefined,
        abstract: values.abstract,
        content: values.sourceType === "editor" ? values.content || undefined : undefined,
        categoryIds: values.categoryIds,
        productId: values.productId,
      });
      if (status === PaperStatus.PUBLISHED) {
        showToast("Paper submitted for review.", "success");
        router.push("/archive");
      } else {
        showToast("Paper saved as draft.", "success");
        router.push("/dashboard");
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

  return (
    <div>
      <div className="page-wrap page-wrap-narrow-md section">
        <div className="path-badge">/root/paper/submit</div>
        <h1 className="mb-2 text-[42px]">Submit a Paper</h1>
        <p className="mb-0 text-base text-muted">Open-access. Community-voted. Reviewed by admins before publishing.</p>

        <hr className="divider" />

        <WindowCard label="PAPER_SUBMISSION.FORM">
          <div className="inp-group">
            <label className="inp-label">Paper Type</label>
            <select
              className="inp"
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value as PaperSourceType);
                setErrors((prev) => ({ ...prev, externalUrl: undefined }));
              }}
            >
              <option value="link">Link / arXiv / DOI</option>
              <option value="editor">Write on Platform</option>
            </select>
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
              <input className="inp" value={form.externalUrl} onChange={set("externalUrl")} placeholder="https://arxiv.org/abs/… or DOI link" />
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
              placeholder="250–500 words. Summarise the problem, method, and key findings."
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
            <CategorySelector onChangeIds={setCategoryIds} />
          </div>

          <div className="mb-4 rounded-lg border border-[#D8D4CC] bg-cream px-3.5 py-3 text-[13px] leading-7 text-muted">
            Submitted papers enter an admin review queue. Once approved, they will appear publicly on the Papers page and contribute to community
            rankings.
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline flex-1 justify-center" onClick={() => submit(PaperStatus.DRAFT)} disabled={submitting}>
              Save as Draft
            </button>
            <button className="btn btn-primary flex-1 justify-center" onClick={() => submit(PaperStatus.PUBLISHED)} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit for Review →"}
            </button>
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
