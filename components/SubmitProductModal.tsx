"use client";

import { useState } from "react";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import CategorySelector from "@/components/ui/CategorySelector";
import { ProductStage, QualityBadge } from "@/enums";
import { useSubmitProduct } from "@/hooks/queries/useProduct";
import { useGlobal } from "@/components/GlobalProvider";

const submitProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z.url("Invalid URL").min(1, "Product URL is required"),
  description: z.string().min(1, "Description is required"),
});

const DEFAULT_FORM = {
  name: "",
  url: "",
  stage: ProductStage.SEED as string,
  description: "",
  github: "",
  funding: "",
  founded: String(new Date().getFullYear()),
  qualityBadge: QualityBadge.RESEARCH_BASED as string,
};

function SubmitProductModal({ onClose }: { onClose: () => void }) {
  const { showToast } = useGlobal();
  const { mutateAsync: submitProductMutation, isPending: submitting } = useSubmitProduct();
  const [submitForm, setSubmitForm] = useState(DEFAULT_FORM);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Partial<Record<"name" | "url" | "description", string>>>({});

  const handleSubmit = async () => {
    const result = submitProductSchema.safeParse({
      name: submitForm.name,
      url: submitForm.url,
      description: submitForm.description,
    });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      await submitProductMutation({
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
      onClose();
    } catch {
      showToast("Failed to submit launch. Please try again.", "error");
    }
  };

  return (
    <Modal title="SUBMIT_LAUNCH.SYS" onClose={onClose}>
      <div className="inp-group">
        <label className="inp-label">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          className={`inp ${errors.name ? "border-red-400" : ""}`}
          value={submitForm.name}
          onChange={(e) => setSubmitForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. AxonOS"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div className="inp-group">
        <label className="inp-label">
          Product URL / Demo <span className="text-red-500">*</span>
        </label>
        <input
          className={`inp ${errors.url ? "border-red-400" : ""}`}
          value={submitForm.url}
          onChange={(e) => setSubmitForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://yourproduct.com"
        />
        {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
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
          <select className="inp" value={submitForm.qualityBadge} onChange={(e) => setSubmitForm((f) => ({ ...f, qualityBadge: e.target.value }))}>
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
        <label className="inp-label">
          One-line Description <span className="text-red-500">*</span>
        </label>
        <input
          className={`inp ${errors.description ? "border-red-400" : ""}`}
          value={submitForm.description}
          onChange={(e) => setSubmitForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What does your product do?"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>
      <div className="inp-group">
        <label className="inp-label">Categories</label>
        <CategorySelector onChangeIds={setSelectedCategoryIds} />
      </div>
      <button className="btn btn-primary w-full justify-center" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Launch →"}
      </button>
    </Modal>
  );
}

export default function SubmitProductButton({
  label = "Submit Your Launch →",
  className = "btn btn-primary btn-sm",
}: {
  label?: string;
  className?: string;
}) {
  const { user, showToast } = useGlobal();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      showToast("Sign in to submit a launch.", "error");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button className={className} onClick={handleClick}>
        {label}
      </button>
      {open && <SubmitProductModal onClose={() => setOpen(false)} />}
    </>
  );
}
