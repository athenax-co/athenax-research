"use client";

import { useState, useEffect, useRef } from "react";
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
import { ProductStage, ProductLinkType } from "@/enums";
import type { ProductDetailOut, ProductUpdateIn, ProductLinkIn } from "../types";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";

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

const STAGE_OPTIONS = Object.values(ProductStage);

interface EditInfoProps {
  product: ProductDetailOut;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductUpdateIn) => void;
  saving?: boolean;
}

export function EditProductInfoDialog({ product, open, onOpenChange, onSave, saving }: EditInfoProps) {
  const [form, setForm] = useState<ProductUpdateIn>({});

  useEffect(() => {
    if (open) {
      setForm({
        description: product.description ?? "",
        stage: product.stage ?? "",
        funding: product.funding ?? undefined,
        founded: product.founded ?? undefined,
      });
    }
  }, [open]);

  const set = <K extends keyof ProductUpdateIn>(key: K, val: ProductUpdateIn[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    const payload: ProductUpdateIn = { ...form };
    if (!payload.stage) payload.stage = undefined;
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
            <label className="inp-label">Description</label>
            <textarea
              className="inp min-h-24 resize-y"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="inp-group mb-0">
            <label className="inp-label">Stage</label>
            <select className="inp" value={form.stage ?? ""} onChange={(e) => set("stage", e.target.value)}>
              <option value="">— none —</option>
              {STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

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

const LINK_TYPE_OPTIONS = Object.values(ProductLinkType);

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

  const usedTypes = new Set(product.links.map((l) => l.linkType));
  const availableTypes = LINK_TYPE_OPTIONS.filter((t) => !usedTypes.has(t as ProductLinkType));

  const [newLink, setNewLink] = useState({ linkType: "", url: "" });

  useEffect(() => {
    if (!open) {
      setAddingLink(false);
      setEditingLinkId(null);
    }
  }, [open]);

  useEffect(() => {
    if (addingLink) {
      setNewLink({ linkType: availableTypes[0] ?? "", url: "" });
    }
  }, [addingLink]);

  const handleAddLink = () => {
    if (!newLink.url.trim() || !newLink.linkType) return;
    onCreateLink({ linkType: newLink.linkType as ProductLinkType, url: newLink.url.trim() });
    setAddingLink(false);
  };

  const startEditLink = (link: { id: number; url: string }) => {
    setEditingLinkId(link.id);
    setEditUrl(link.url);
  };

  const handleUpdateLink = (linkId: number) => {
    if (!editUrl.trim()) return;
    onUpdateLink(linkId, { url: editUrl.trim() });
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
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 font-['Space_Mono',monospace] text-[10px] uppercase tracking-wider text-[#888]">
                    {link.linkType}
                  </span>
                  <input
                    className="inp flex-1 py-1 text-sm"
                    style={{ marginTop: 0 }}
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
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
                    onClick={() => onDeleteLink(link.id)}
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
                      onChange={(e) => setNewLink((f) => ({ ...f, url: e.target.value }))}
                      placeholder="https://…"
                      autoFocus
                    />
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
