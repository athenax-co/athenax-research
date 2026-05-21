"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useCategories, useSubcategories } from "@/hooks/queries/useReference";
import TagInput from "@/components/ui/TagInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { QualityBadge } from "@/enums";
import { useSubmitProduct, useProductStages } from "@/features/products";
import { useGlobal } from "@/components/GlobalProvider";
import { cn } from "@/lib/utils";

const DRAFT_KEY = "ax_submit_product_draft";

const step1Schema = z.object({
  name: z.string().min(1, "Product name is required"),
  url: z.union([z.url("Invalid URL"), z.literal("")]).optional(),
  shortDesc: z.string().min(1, "One-line description is required"),
  email: z.union([z.email("Must be a valid email"), z.literal("")]).optional(),
});

const githubSchema = z
  .url()
  .regex(/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?$/, "Must be a valid GitHub URL")
  .or(z.literal(""))
  .optional();

const DEFAULT_FORM = {
  name: "",
  url: "",
  stage: "",
  shortDesc: "",
  description: "",
  github: "",
  email: "",
  funding: "",
  founded: "",
  qualityBadge: "",
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { form: typeof DEFAULT_FORM; categoryIds: number[]; subCategoryIds: number[]; backers: string[] };
  } catch {
    return null;
  }
}

function saveDraft(form: typeof DEFAULT_FORM, categoryIds: number[], subCategoryIds: number[], backers: string[]) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, categoryIds, subCategoryIds, backers }));
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
  const router = useRouter();
  
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
            <p className="text-xs text-muted mb-6">
              In the meantime, explore other launches and follow us on{" "}
              <Link
                href="https://x.com/athenax_co"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-ink underline underline-offset-2 hover:opacity-80"
              >
                X
              </Link>
              .
            </p>
            <Button className="w-full" onClick={() => { onOpenChange(false); router.push("/launch"); }}>
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

  const draft = loadDraft();
  const [submitForm, setSubmitForm] = useState({ ...DEFAULT_FORM, ...(draft?.form ?? {}) });
  const { data: categories = [] } = useCategories();
  const { data: stages = [] } = useProductStages();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(draft?.categoryIds?.[0] ?? null);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>(draft?.subCategoryIds ?? []);
  const [selectedOther, setSelectedOther] = useState(false);
  const [otherName, setOtherName] = useState("");
  const { data: subcategories = [], isPending: loadingSubcategories } = useSubcategories(selectedCategoryId);
  const [backers, setBackers] = useState<string[]>(draft?.backers ?? []);
  const [errors, setErrors] = useState<Partial<Record<"name" | "url" | "shortDesc" | "email" | "github", string>>>({});

  const set = (k: keyof typeof DEFAULT_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setSubmitForm((f) => {
      const next = { ...f, [k]: e.target.value };
      saveDraft(next, selectedCategoryId ? [selectedCategoryId] : [], subCategoryIds, backers);
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
    const githubResult = githubSchema.safeParse(submitForm.github);
    if (!githubResult.success) {
      setErrors({ github: githubResult.error.issues[0]?.message });
      return;
    }
    try {
      await submitProductMutation({
        name: submitForm.name,
        url: submitForm.url || undefined,
        links: submitForm.github ? [{ linkType: "github" as const, url: submitForm.github }] : undefined,
        stage: submitForm.stage || undefined,
        funding: Number(submitForm.funding) || 0,
        founded: submitForm.founded ? Number(submitForm.founded) : undefined,
        shortDesc: submitForm.shortDesc,
        description: submitForm.description || undefined,
        qualityBadge: submitForm.qualityBadge || undefined,
        email: submitForm.email || undefined,
        categoryIds: selectedCategoryId ? [selectedCategoryId] : [],
        subCategoryIds: selectedOther ? [] : subCategoryIds,
        otherSubcategoryName: selectedOther && otherName.trim() ? otherName.trim() : undefined,
        backers,
      });
      clearDraft();
      setSubmitForm(DEFAULT_FORM);
      setSelectedCategoryId(null);
      setSubCategoryIds([]);
      setSelectedOther(false);
      setOtherName("");
      setBackers([]);
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
                  Product URL / Demo
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
                  className="inp min-h-22.5 resize-y"
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
                    <option value="">— None —</option>
                    {stages.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="inp-group flex-1">
                  <label className="inp-label">Quality Badge</label>
                  <select className="inp" value={submitForm.qualityBadge} onChange={set("qualityBadge")}>
                    <option value="">— None —</option>
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
                    <option value="">— None —</option>
                    {Array.from({ length: new Date().getFullYear() - 2009 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inp-group">
                <label className="inp-label">Category</label>
                <select
                  className="inp"
                  value={selectedCategoryId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value ? Number(e.target.value) : null;
                    setSelectedCategoryId(id);
                    setSubCategoryIds([]);
                    saveDraft(submitForm, id ? [id] : [], [], backers);
                  }}
                >
                  <option value="" disabled>Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {selectedCategoryId && (
                <div className="inp-group">
                  <label className="inp-label">Sub-category</label>
                  {loadingSubcategories ? (
                    <p className="text-xs text-muted pt-1">Loading…</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSubCategoryIds([sub.id]);
                            setSelectedOther(false);
                            setOtherName("");
                            saveDraft(submitForm, [selectedCategoryId], [sub.id], backers);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                            subCategoryIds.includes(sub.id) && !selectedOther
                              ? "bg-ink text-cream border-ink"
                              : "bg-transparent text-ink border-ink hover:bg-ink/5"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOther(true);
                          setSubCategoryIds([]);
                          saveDraft(submitForm, [selectedCategoryId], [], backers);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          selectedOther
                            ? "bg-ink text-cream border-ink"
                            : "bg-transparent text-ink border-ink hover:bg-ink/5"
                        }`}
                      >
                        Other
                      </button>
                    </div>
                  )}
                  {selectedOther && (
                    <input
                      className="inp mt-2"
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                      placeholder="Describe your sub-category…"
                    />
                  )}
                </div>
              )}

              <div className="inp-group">
                <label className="inp-label">Backers</label>
                <TagInput
                  value={backers}
                  onChange={(vals) => {
                    setBackers(vals);
                    saveDraft(submitForm, selectedCategoryId ? [selectedCategoryId] : [], subCategoryIds, vals);
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
