"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import CategorySelector from "@/components/ui/CategorySelector";
import TagInput from "@/components/ui/TagInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductStage, QualityBadge } from "@/enums";
import { useSubmitProduct } from "@/features/products";
import { useGlobal } from "@/components/GlobalProvider";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "ax_submit_product_draft";

const step1Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z.url("Invalid URL").min(1, "Product URL is required"),
  shortDesc: z.string().min(1, "One-line description is required"),
  email: z.union([z.email("Must be a valid email"), z.literal("")]).optional(),
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
  shortDesc: "",
  description: "",
  github: "",
  email: "",
  funding: "",
  founded: String(new Date().getFullYear()),
  qualityBadge: QualityBadge.RESEARCH_BASED as string,
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { form: typeof DEFAULT_FORM; categoryIds: number[]; subCategories: string[]; backers: string[] };
  } catch {
    return null;
  }
}

function saveDraft(form: typeof DEFAULT_FORM, categoryIds: number[], subCategories: string[], backers: string[]) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, categoryIds, subCategories, backers }));
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

interface SubmitProductSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function SubmitProductSuccessModal({ open, onOpenChange, productName }: SubmitProductSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>SUBMISSION_SUCCESS.SYS</DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-3">Your product has been submitted!</h2>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              Thanks for submitting <span className="font-semibold text-ink">{productName}</span>! Our team will review it within 48 hours. Check your
              email for updates.
            </p>
            <p className="text-xs text-muted mb-6">In the meantime, explore other launches and join our community on Discord.</p>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Explore Launches →
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export function SubmitProductModal({ open, onOpenChange }: SubmitProductModalProps) {
  const { showToast, showSubmitProductSuccess } = useGlobal();
  const { mutateAsync: submitProductMutation, isPending: submitting } = useSubmitProduct();

  const [step, setStep] = useState<1 | 2>(1);
  const [resetKey, setResetKey] = useState(0);

  const draft = loadDraft();
  const [submitForm, setSubmitForm] = useState({ ...DEFAULT_FORM, ...(draft?.form ?? {}) });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(draft?.categoryIds ?? []);
  const [subCategories, setSubCategories] = useState<string[]>(draft?.subCategories ?? []);
  const [backers, setBackers] = useState<string[]>(draft?.backers ?? []);
  const [errors, setErrors] = useState<Partial<Record<"name" | "url" | "shortDesc" | "email" | "github", string>>>({});

  const set = (k: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setSubmitForm((f) => {
      const next = { ...f, [k]: e.target.value };
      saveDraft(next, selectedCategoryIds, subCategories, backers);
      return next;
    });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setStep(1), 300);
  };

  const handleNext = () => {
    const result = step1Schema.safeParse({
      name: submitForm.name,
      url: submitForm.url,
      shortDesc: submitForm.shortDesc,
      email: submitForm.email,
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
        url: submitForm.url || undefined,
        stage: submitForm.stage,
        funding: Number(submitForm.funding) || 0,
        founded: Number(submitForm.founded) || new Date().getFullYear(),
        shortDesc: submitForm.shortDesc,
        description: submitForm.description || undefined,
        qualityBadge: submitForm.qualityBadge,
        email: submitForm.email || undefined,
        categoryIds: selectedCategoryIds,
        subCategories,
        backers,
      });
      clearDraft();
      setSubmitForm(DEFAULT_FORM);
      setSelectedCategoryIds([]);
      setSubCategories([]);
      setBackers([]);
      setResetKey((k) => k + 1);
      setStep(1);
      onOpenChange(false);
      showSubmitProductSuccess(submitForm.name);
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
                <label className="inp-label">
                  One-line Description <span className="text-red-500">*</span>
                </label>
                <input
                  className={`inp ${errors.shortDesc ? "border-red-400" : ""}`}
                  value={submitForm.shortDesc}
                  onChange={set("shortDesc")}
                  placeholder="What does your product do in one sentence?"
                />
                {errors.shortDesc && <p className="mt-1 text-xs text-red-500">{errors.shortDesc}</p>}
              </div>

              <div className="inp-group">
                <label className="inp-label">Full Description</label>
                <textarea
                  className="inp min-h-[90px] resize-y"
                  value={submitForm.description}
                  onChange={set("description")}
                  placeholder="Describe your product in detail — what it does, who it's for, and what makes it unique."
                />
              </div>

              <div className="inp-group">
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

              <Button className="w-full" onClick={handleNext}>
                Next →
              </Button>
            </>
          ) : (
            <>
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
                  <select className="inp" value={submitForm.founded} onChange={set("founded")}>
                    {Array.from({ length: new Date().getFullYear() - 2009 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inp-group">
                <label className="inp-label">Categories</label>
                <CategorySelector key={resetKey} onChangeIds={setSelectedCategoryIds} />
              </div>

              <div className="inp-group">
                <label className="inp-label">Sub-categories</label>
                <TagInput
                  value={subCategories}
                  onChange={(vals) => {
                    setSubCategories(vals);
                    saveDraft(submitForm, selectedCategoryIds, vals, backers);
                  }}
                  placeholder="e.g. NLP, Robotics — press Enter to add"
                  addAnother="Add another…"
                />
              </div>

              <div className="inp-group">
                <label className="inp-label">Backers</label>
                <TagInput
                  value={backers}
                  onChange={(vals) => {
                    setBackers(vals);
                    saveDraft(submitForm, selectedCategoryIds, subCategories, vals);
                  }}
                  placeholder="Investor or firm name — press Enter to add"
                  addAnother="Add another…"
                />
              </div>

              <div className="flex gap-2.5">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "Submit Launch →"}
                </Button>
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
  className,
  size = "sm",
}: {
  label?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <Link href="/launch?submit" className={cn(buttonVariants({ size }), "no-underline", className)}>
      {label}
    </Link>
  );
}
