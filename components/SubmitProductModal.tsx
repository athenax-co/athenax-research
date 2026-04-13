"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import CategorySelector from "@/components/ui/CategorySelector";
import { ProductStage, QualityBadge } from "@/enums";
import { useSubmitProduct } from "@/hooks/queries/useProduct";
import { useGlobal } from "@/components/GlobalProvider";

const DRAFT_KEY = "ax_submit_product_draft";

const step1Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z.url("Invalid URL").min(1, "Product URL is required"),
  description: z.string().min(1, "Description is required"),
  email: z.union([z.email("Must be a valid email"), z.literal("")]).optional(),
  twitter: z.string().regex(/^(@?[A-Za-z0-9_]{1,15})?$/, "Must be a valid Twitter handle").optional(),
  github: z
    .url()
    .regex(/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?$/, "Must be a valid GitHub URL")
    .or(z.literal(""))
    .optional(),
});

const DEFAULT_FORM = {
  name: "",
  url: "",
  stage: ProductStage.SEED as string,
  description: "",
  github: "",
  email: "",
  twitter: "",
  funding: "",
  founded: String(new Date().getFullYear()),
  qualityBadge: QualityBadge.RESEARCH_BASED as string,
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { form: typeof DEFAULT_FORM; categoryIds: number[] };
  } catch {
    return null;
  }
}

function saveDraft(form: typeof DEFAULT_FORM, categoryIds: number[]) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, categoryIds }));
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

interface SubmitProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubmitProductModal({ open, onOpenChange }: SubmitProductModalProps) {
  const { showToast } = useGlobal();
  const { mutateAsync: submitProductMutation, isPending: submitting } = useSubmitProduct();

  const [step, setStep] = useState<1 | 2>(1);

  const draft = loadDraft();
  const [submitForm, setSubmitForm] = useState(draft?.form ?? DEFAULT_FORM);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(draft?.categoryIds ?? []);
  const [errors, setErrors] = useState<Partial<Record<"name" | "url" | "description" | "email" | "twitter" | "github", string>>>({});

  useEffect(() => {
    saveDraft(submitForm, selectedCategoryIds);
  }, [submitForm, selectedCategoryIds]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep(1), 300);
  };

  const set = (k: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setSubmitForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNext = () => {
    const result = step1Schema.safeParse({
      name: submitForm.name,
      url: submitForm.url,
      description: submitForm.description,
      email: submitForm.email,
      twitter: submitForm.twitter,
      github: submitForm.github,
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
    setStep(2);
  };

  const handleSubmit = async () => {
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
        email: submitForm.email || undefined,
        twitter: submitForm.twitter || undefined,
        categoryIds: selectedCategoryIds,
      });
      clearDraft();
      showToast(`${submitForm.name} launch submitted! We'll review within 48 hours.`, "success");
      handleClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to submit launch. Please try again.", "error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>SUBMIT_LAUNCH.SYS</DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          <div className="font-mono text-[11px] text-muted mb-4 tracking-widest">STEP {step} OF 2</div>

          {step === 1 ? (
            <>
              <div className="inp-group">
                <label className="inp-label">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`inp ${errors.name ? "border-red-400" : ""}`}
                  value={submitForm.name}
                  onChange={set("name")}
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
                  onChange={set("url")}
                  placeholder="https://yourproduct.com"
                />
                {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
              </div>

              <div className="inp-group">
                <label className="inp-label">GitHub Repository</label>
                <input
                  className={`inp ${errors.github ? "border-red-400" : ""}`}
                  value={submitForm.github}
                  onChange={set("github")}
                  placeholder="github.com/you/repo"
                />
                {errors.github && <p className="mt-1 text-xs text-red-500">{errors.github}</p>}
              </div>

              <div className="inp-group">
                <label className="inp-label">
                  One-line Description <span className="text-red-500">*</span>
                </label>
                <input
                  className={`inp ${errors.description ? "border-red-400" : ""}`}
                  value={submitForm.description}
                  onChange={set("description")}
                  placeholder="What does your product do?"
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>

              <div className="flex gap-3">
                <div className="inp-group flex-1">
                  <label className="inp-label">Email</label>
                  <input
                    className={`inp ${errors.email ? "border-red-400" : ""}`}
                    type="email"
                    value={submitForm.email}
                    onChange={set("email")}
                    placeholder="founder@yourproduct.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="inp-group flex-1">
                  <label className="inp-label">Twitter / X</label>
                  <input
                    className={`inp ${errors.twitter ? "border-red-400" : ""}`}
                    value={submitForm.twitter}
                    onChange={set("twitter")}
                    placeholder="@yourhandle"
                  />
                  {errors.twitter && <p className="mt-1 text-xs text-red-500">{errors.twitter}</p>}
                </div>
              </div>

              <button className="btn btn-primary w-full justify-center" onClick={handleNext}>
                Next →
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <div className="inp-group flex-1">
                  <label className="inp-label">Stage</label>
                  <select className="inp" value={submitForm.stage} onChange={set("stage")}>
                    {Object.values(ProductStage).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="inp-group flex-1">
                  <label className="inp-label">Quality Badge</label>
                  <select className="inp" value={submitForm.qualityBadge} onChange={set("qualityBadge")}>
                    {Object.values(QualityBadge).map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="inp-group flex-1">
                  <label className="inp-label">Funding Raised ($)</label>
                  <input className="inp" type="number" min={0} value={submitForm.funding} onChange={set("funding")} placeholder="e.g. 500000" />
                </div>
                <div className="inp-group flex-1">
                  <label className="inp-label">Founded (Year)</label>
                  <select
                    className="inp"
                    value={submitForm.founded}
                    onChange={set("founded")}
                  >
                    {Array.from({ length: new Date().getFullYear() - 2009 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inp-group">
                <label className="inp-label">Categories</label>
                <CategorySelector onChangeIds={setSelectedCategoryIds} />
              </div>

              <div className="flex gap-2.5">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="btn btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "Submit Launch →"}
                </button>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
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
      <SubmitProductModal open={open} onOpenChange={setOpen} />
    </>
  );
}
