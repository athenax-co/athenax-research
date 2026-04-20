"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WindowCard from "@/components/ui/WindowCard";
import CategorySelector from "@/components/ui/CategorySelector";
import { useGlobal } from "@/components/GlobalProvider";
import { useSubmitPaper } from "@/hooks/queries/usePaper";
import { useProducts } from "@/hooks/queries/useProduct";
import type { PaperSourceType } from "@/types/paper";
import { PaperStatus } from "@/enums";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { user, showToast, handleAuthClick } = useGlobal();
  const router = useRouter();
  const { mutateAsync: submitPaper, isPending: submitting } = useSubmitPaper();
  const { data: products } = useProducts("approved");

  const [sourceType, setSourceType] = useState<PaperSourceType>("link");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [productId, setProductId] = useState<number | undefined>(undefined);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    externalUrl: "",
    content: "",
  });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const validate = () => {
    if (!form.title) {
      showToast("Paper title is required.", "error");
      return false;
    }
    if (!form.abstract) {
      showToast("Abstract is required.", "error");
      return false;
    }
    if (sourceType === "link" && !form.externalUrl) {
      showToast("External URL is required for linked papers.", "error");
      return false;
    }
    return true;
  };

  const submit = async (status: PaperStatus) => {
    if (!user) {
      showToast("Sign in to submit a paper.", "error");
      return;
    }
    if (!validate()) return;
    try {
      await submitPaper({
        title: form.title,
        sourceType,
        status,
        externalUrl: sourceType === "link" ? form.externalUrl || undefined : undefined,
        abstract: form.abstract || undefined,
        content: sourceType === "editor" ? form.content || undefined : undefined,
        categoryIds,
        productId,
      });
      if (status === PaperStatus.PUBLISHED) {
        showToast("Paper submitted for review.", "success");
        router.push("/archive");
      } else {
        showToast("Paper saved as draft.", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      showToast(err?.message ?? "Failed to submit paper.", "error");
    }
  };

  if (!user) {
    return (
      <div>
        <div className="page-wrap section">
          <div className="path-badge">/root/paper/submit</div>
          <h1 className="mb-4 text-[42px]">Submit a Paper</h1>
          <p className="mb-6 text-[17px] text-muted">You need to be signed in as a researcher to submit.</p>
          <Button size="sm" onClick={() => handleAuthClick("login")}>
            Sign In to Continue
          </Button>
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
            <select className="inp" value={sourceType} onChange={(e) => setSourceType(e.target.value as PaperSourceType)}>
              <option value="link">Link / arXiv / DOI</option>
              <option value="editor">Write on Platform</option>
            </select>
          </div>

          <div className="inp-group">
            <label className="inp-label">Paper Title *</label>
            <input className="inp" value={form.title} onChange={set("title")} placeholder="A descriptive, full title" />
          </div>

          {products && products.length > 0 && (
            <div className="inp-group">
              <label className="inp-label">Link to Product (optional)</label>
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
          </div>

          {sourceType === "editor" && (
            <div className="inp-group">
              <label className="inp-label">Paper Content (optional)</label>
              <textarea className="inp" rows={10} value={form.content} onChange={set("content")} placeholder="Full paper content" />
            </div>
          )}

          <div className="inp-group">
            <label className="inp-label">Categories (optional)</label>
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
