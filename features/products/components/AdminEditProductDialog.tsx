"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrafficLights,
  DialogBody,
  DialogFooter,
  DialogClose
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PRODUCT_LINK_TYPES, QualityBadge, VerificationStatus, type ProductLinkType } from "@/enums";
import { urlSchema } from "@/lib/validators";
import { useProductStages, useProductSearch } from "../hooks";
import type { ProductDetailOut, ProductUpdateIn, ProductLinkIn, ProductListItem } from "../types";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import TagInput from "@/components/ui/TagInput";
import { useCategories, useSubcategories } from "@/hooks/queries/useReference";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Edit Logo Dialog (LOGO.SYS) ─────────────────────────────────────────────

interface EditLogoProps {
  product: ProductDetailOut;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  onDelete: () => void;
  uploadPending?: boolean;
  deletePending?: boolean;
}

export function EditProductLogoDialog({ product, open, onOpenChange, onUpload, onDelete, uploadPending, deletePending }: EditLogoProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTrafficLights />
          <DialogTitle>EDIT_LOGO.SYS</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <DialogBody className="py-5 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="size-24 rounded-xl border border-ink shadow-[3px_3px_0_#1a1a1a]">
              <AvatarImage src={preview ?? product.logo ?? undefined} alt={product.name} className="size-full object-contain" />
              <AvatarFallback className="rounded-xl bg-white text-4xl font-extrabold">{product.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded border border-ink bg-white px-2.5 py-1 font-['Space_Mono',monospace] text-[11px] font-medium shadow-[1.5px_1.5px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px disabled:opacity-50"
              onClick={() => fileRef.current?.click()}
              disabled={uploadPending || deletePending}
            >
              <Upload size={11} />
              {file ? file.name : "Upload Logo Image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setFile(f);
                setPreview(URL.createObjectURL(f));
                e.target.value = "";
              }}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          {product.logo && (
            <Button
              size="sm"
              variant="ghost"
              className="mr-auto text-red-500 hover:text-red-600"
              onClick={onDelete}
              disabled={deletePending || uploadPending}
            >
              {deletePending ? <span className="spinner mr-1" /> : <Trash2 size={13} className="mr-1" />}
              {deletePending ? "Deleting…" : "Delete"}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={() => file && onUpload(file)} disabled={!file || uploadPending || deletePending}>
            {uploadPending ? "Uploading…" : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Info Dialog (ABOUT.SYS) ────────────────────────────────────────────

interface EditInfoProps {
  product: ProductDetailOut;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductUpdateIn) => void;
  saving?: boolean;
}

export function EditProductInfoDialog({ product, open, onOpenChange, onSave, saving }: EditInfoProps) {
  const { data: stages = [] } = useProductStages();
  const { data: categories = [] } = useCategories();
  const [form, setForm] = useState<ProductUpdateIn>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [selectedOther, setSelectedOther] = useState(false);
  const [otherName, setOtherName] = useState("");
  const { data: subcategories = [], isPending: loadingSubcategories } = useSubcategories(selectedCategoryId);

  const originalCategoryId = product.categories[0]?.id ?? null;
  const productPendingSub = product.categories[0]?.subcategories.find((s) => s.status === VerificationStatus.PENDING) ?? null;

  useEffect(() => {
    if (open) {
      setForm({
        name: product.name ?? "",
        shortDesc: product.shortDesc ?? "",
        description: product.description ?? "",
        stage: product.stage ?? "",
        qualityBadge: product.qualityBadge ?? "",
        funding: product.funding ?? undefined,
        founded: product.founded ?? undefined,
        backers: product.backers.map((b) => b.name),
        grants: product.grants.map((g) => g.name),
      });
      setSelectedCategoryId(product.categories[0]?.id ?? null);
      setSubCategoryIds(product.categories[0]?.subcategories.map((s) => s.id) ?? []);
      setSelectedOther(false);
      setOtherName("");
    }
  }, [open]);

  const set = <K extends keyof ProductUpdateIn>(key: K, val: ProductUpdateIn[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    const payload: ProductUpdateIn = { ...form };
    if (!payload.stage) payload.stage = null;
    if (!payload.qualityBadge) payload.qualityBadge = null;
    // Category and sub-category are always sent together (even unchanged) so a stale
    // sub-category can never be left pointing at a parent the backend no longer sees.
    payload.categoryIds = selectedCategoryId ? [selectedCategoryId] : [];
    payload.subCategoryIds = selectedOther ? [] : subCategoryIds;
    payload.otherSubcategoryName = selectedOther && otherName.trim() ? otherName.trim() : undefined;
    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTrafficLights />
          <DialogTitle>EDIT_ABOUT.SYS</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <DialogBody className="space-y-4 py-5">
          <div className="inp-group mb-0">
            <label className="inp-label">Name</label>
            <input
              className="inp"
              type="text"
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Short Description</label>
            <input
              className="inp"
              type="text"
              value={form.shortDesc ?? ""}
              onChange={(e) => set("shortDesc", e.target.value)}
            />
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Description</label>
            <textarea
              className="inp min-h-24 resize-y"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="inp-group mb-0">
              <label className="inp-label">Stage</label>
              <select className="inp" value={form.stage ?? ""} onChange={(e) => set("stage", e.target.value)}>
                <option value="">— none —</option>
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="inp-group mb-0">
              <label className="inp-label">Quality Badge</label>
              <select className="inp" value={form.qualityBadge ?? ""} onChange={(e) => set("qualityBadge", e.target.value)}>
                <option value="">— none —</option>
                {Object.values(QualityBadge).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Category</label>
            <select
              className="inp"
              value={selectedCategoryId ?? ""}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : null;
                setSelectedCategoryId(id);
                setSubCategoryIds([]);
                setSelectedOther(false);
                setOtherName("");
              }}
            >
              <option value="" disabled>Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCategoryId && (
            <div className="inp-group mb-0">
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
                  {productPendingSub && selectedCategoryId === originalCategoryId && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-[#D4A017]/50 bg-[#FEF3C7] px-3 py-1 text-xs font-medium text-[#92400E]"
                      title="Custom sub-category awaiting review — approve or reject it from the product page"
                    >
                      ⚠ {productPendingSub.name} (pending)
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOther(true);
                      setSubCategoryIds([]);
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

          <div className="grid grid-cols-2 gap-3">
            <div className="inp-group mb-0">
              <label className="inp-label">Funding ($)</label>
              <input
                className="inp"
                type="number"
                min={0}
                value={form.funding ?? ""}
                onChange={(e) => set("funding", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="inp-group mb-0">
              <label className="inp-label">Founded (Year)</label>
              <input
                className="inp"
                type="number"
                min={1900}
                max={2100}
                value={form.founded ?? ""}
                onChange={(e) => set("founded", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Backers</label>
            <TagInput
              value={form.backers ?? []}
              onChange={(vals) => set("backers", vals)}
              placeholder="Type backer name and press Enter"
            />
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Grants</label>
            <TagInput
              value={form.grants ?? []}
              onChange={(vals) => set("grants", vals)}
              placeholder="Type grant name and press Enter"
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Links Dialog (LINKS.SYS) ───────────────────────────────────────────

const LINK_TYPE_OPTIONS = PRODUCT_LINK_TYPES.map((t) => t.value);

interface EditLinksProps {
  product: ProductDetailOut;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLink: (data: ProductLinkIn) => void;
  onUpdateLink: (linkId: number, data: Partial<ProductLinkIn>) => void;
  onDeleteLink: (linkId: number) => void;
  linkPending?: boolean;
}

export function EditProductLinksDialog({
  product,
  open,
  onOpenChange,
  onCreateLink,
  onUpdateLink,
  onDeleteLink,
  linkPending,
}: EditLinksProps) {
  const [addingLink, setAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editUrlError, setEditUrlError] = useState<string | null>(null);

  const usedTypes = new Set(product.links.map((l) => l.linkType));
  const availableTypes = LINK_TYPE_OPTIONS.filter((t) => !usedTypes.has(t as ProductLinkType));

  const [newLink, setNewLink] = useState({ linkType: "", url: "" });
  const [newLinkUrlError, setNewLinkUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setAddingLink(false);
      setEditingLinkId(null);
    }
  }, [open]);

  useEffect(() => {
    if (addingLink) {
      setNewLink({ linkType: availableTypes[0] ?? "", url: "" });
      setNewLinkUrlError(null);
    }
  }, [addingLink]);

  const handleAddLink = () => {
    const url = newLink.url.trim();
    if (!url || !newLink.linkType) return;
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      setNewLinkUrlError(result.error.issues[0].message);
      return;
    }
    onCreateLink({ linkType: newLink.linkType as ProductLinkType, url });
    setAddingLink(false);
  };

  const startEditLink = (link: { id: number; url: string }) => {
    setEditingLinkId(link.id);
    setEditUrl(link.url);
    setEditUrlError(null);
  };

  const handleUpdateLink = (linkId: number) => {
    const url = editUrl.trim();
    if (!url) return;
    const result = urlSchema.safeParse(url);
    if (!result.success) {
      setEditUrlError(result.error.issues[0].message);
      return;
    }
    onUpdateLink(linkId, { url });
    setEditingLinkId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTrafficLights />
          <DialogTitle>EDIT_LINKS.SYS</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <DialogBody className="py-5 space-y-2">
          {product.links.length === 0 && !addingLink && (
            <p className="py-2 text-sm text-[#888]">No links yet.</p>
          )}

          {product.links.map((link) => (
            <div key={link.id} className="rounded-lg border border-[rgba(0,0,0,0.1)] bg-white p-3">
              {editingLinkId === link.id ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-20 shrink-0 font-['Space_Mono',monospace] text-[10px] uppercase tracking-wider text-[#888]">
                      {link.linkType}
                    </span>
                    <input
                      className="inp flex-1 py-1 text-sm"
                      style={{ marginTop: 0 }}
                      value={editUrl}
                      onChange={(e) => { setEditUrl(e.target.value); setEditUrlError(null); }}
                      placeholder="URL"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdateLink(link.id)} disabled={linkPending}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingLinkId(null)}>
                      Cancel
                    </Button>
                  </div>
                  {editUrlError && <p className="pl-22 text-xs text-red-500">{editUrlError}</p>}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 font-['Space_Mono',monospace] text-[10px] uppercase tracking-wider text-[#888]">
                    {link.linkType}
                  </span>
                  <span className="flex-1 truncate text-sm">{link.url}</span>
                  <button
                    type="button"
                    onClick={() => startEditLink(link)}
                    className="shrink-0 p-1 text-[#888] transition-colors hover:text-ink"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (confirm("Delete this link?")) onDeleteLink(link.id); }}
                    disabled={linkPending}
                    className="shrink-0 p-1 text-[#888] transition-colors hover:text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {availableTypes.length > 0 && (
            addingLink ? (
              <div className="rounded-lg border-2 border-ink bg-white p-3 space-y-3 mt-2">
                <div className="grid grid-cols-[140px_1fr] gap-3">
                  <div className="inp-group mb-0">
                    <label className="inp-label">Type</label>
                    <select
                      className="inp py-1 text-sm"
                      value={newLink.linkType}
                      onChange={(e) => setNewLink((f) => ({ ...f, linkType: e.target.value }))}
                    >
                      {availableTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="inp-group mb-0">
                    <label className="inp-label">URL</label>
                    <input
                      className="inp py-1 text-sm"
                      value={newLink.url}
                      onChange={(e) => { setNewLink((f) => ({ ...f, url: e.target.value })); setNewLinkUrlError(null); }}
                      placeholder="https://…"
                      autoFocus
                    />
                    {newLinkUrlError && <p className="mt-1 text-xs text-red-500">{newLinkUrlError}</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setAddingLink(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddLink} disabled={!newLink.url.trim() || linkPending}>
                    {linkPending ? "Adding…" : "Add Link"}
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingLink(true)}
                className="mt-1 flex items-center gap-1.5 text-sm text-[#888] transition-colors hover:text-ink"
              >
                <Plus size={14} />
                Add Link
              </button>
            )
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Similar Products Dialog (SIMILAR.SYS) ──────────────────────────────

// Caps the curated set at the same size as the default /similar display limit, so the
// single fetch the page already makes always contains the full curated set — no second request.
const MAX_SIMILAR = 3;

interface EditSimilarProps {
  product: ProductDetailOut;
  similarProducts: ProductListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (similarProductIds: number[]) => void;
  saving?: boolean;
}

type SimilarOption = { id: number; name: string; logo?: string | null };

export function EditSimilarProductsDialog({ product, similarProducts, open, onOpenChange, onSave, saving }: EditSimilarProps) {
  // Reuses the page's existing /similar fetch (passed in as a prop) rather than
  // issuing a second request — curated entries are filtered out client-side.
  const currentSimilar = useMemo(() => similarProducts.filter((s) => s.curated), [similarProducts]);
  const [selected, setSelected] = useState<SimilarOption[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const excludeIds = [product.id, ...selected.map((s) => s.id)];
  const { data: results, isFetching } = useProductSearch(debouncedQuery, excludeIds);

  useEffect(() => {
    if (open) setSelected(currentSimilar);
  }, [open, currentSimilar]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const atLimit = selected.length >= MAX_SIMILAR;

  const addProduct = (p: SimilarOption) => {
    if (atLimit) return;
    setSelected((prev) => [...prev, p]);
    setQuery("");
  };

  const removeProduct = (id: number) => setSelected((prev) => prev.filter((p) => p.id !== id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTrafficLights />
          <DialogTitle>EDIT_SIMILAR.SYS</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <DialogBody className="py-5 space-y-3">
          <div className="inp flex flex-wrap gap-1.5 min-h-10">
            {selected.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1 rounded bg-[#F0EDE8] px-2 py-0.5 text-sm font-medium">
                {p.name}
                <button
                  type="button"
                  className="text-muted hover:text-foreground leading-none"
                  onClick={() => removeProduct(p.id)}
                >
                  ×
                </button>
              </span>
            ))}
            {!atLimit && (
              <input
                className="flex-1 min-w-32 bg-transparent outline-none text-sm placeholder:text-muted"
                placeholder={selected.length === 0 ? "Search products…" : "Add another…"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
          </div>

          {atLimit ? (
            <p className="text-xs text-[#888]">Maximum of {MAX_SIMILAR} similar products reached.</p>
          ) : (
            query.trim() && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-[rgba(0,0,0,0.1)] bg-white">
                {isFetching ? (
                  <p className="p-3 text-sm text-[#888]">Searching…</p>
                ) : (results ?? []).length === 0 ? (
                  <p className="p-3 text-sm text-[#888]">No products found.</p>
                ) : (
                  (results ?? []).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addProduct(p)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F3EF]"
                    >
                      <Avatar className="size-6 shrink-0 rounded border border-ink">
                        <AvatarImage src={p.logo ?? undefined} alt={p.name} className="size-full object-contain" />
                        <AvatarFallback className="rounded text-[10px] font-bold">{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(selected.map((p) => p.id))} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
