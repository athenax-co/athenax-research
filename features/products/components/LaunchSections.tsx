"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrafficLights } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronUp, ChevronDown, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductMedia, TeamMemberOut, ProductVoice, Bounty, ProductComment, TeamMemberIn, VoiceIn, BountyIn } from "@/features/products";
import Link from "next/link";

type GallerySectionProps = {
  media: ProductMedia[];
  isAdmin?: boolean;
  onUpload?: (file: File) => void;
  onDelete?: (id: number) => void;
  onSwap?: (idA: number, orderA: number, idB: number, orderB: number) => void;
  uploading?: boolean;
};

export function GallerySection({ media, isAdmin, onUpload, onDelete, onSwap, uploading }: GallerySectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const images = media.filter((m) => m.mediaType === "image").sort((a, b) => a.sortOrder - b.sortOrder);

  if (isAdmin) {
    return (
      <div className="space-y-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-['Space_Mono',monospace] text-[10px] text-[#888]">{images.length} image{images.length !== 1 ? "s" : ""}</span>
          <button
            className="flex items-center gap-1.5 rounded border border-ink bg-white px-2.5 py-1 font-['Space_Mono',monospace] text-[11px] font-medium shadow-[1.5px_1.5px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px disabled:opacity-50"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <span className="spinner" /> : <Upload size={11} />}
            {uploading ? "Uploading…" : "Upload Image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUpload) onUpload(file);
              e.target.value = "";
            }}
          />
        </div>

        {images.length === 0 ? (
          <div className="flex min-h-20 items-center justify-center rounded border border-dashed border-[#D8D4CC] bg-[#FAFAF7] font-['Space_Mono',monospace] text-[10px] text-[#aaa]">
            No images yet — upload one above
          </div>
        ) : (
          <div className="space-y-1.5">
            {images.map((img, i) => (
              <div key={img.id} className="flex items-center gap-2 rounded border border-[rgba(0,0,0,0.08)] bg-white p-1.5">
                <img src={img.url ?? undefined} alt="" className="h-12 w-20 shrink-0 rounded object-cover" />
                <span className="flex-1 truncate font-['Space_Mono',monospace] text-[10px] text-[#888]">{i + 1} / {images.length}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    className="p-1 text-[#888] hover:text-ink disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => onSwap?.(img.id, img.sortOrder, images[i - 1].id, images[i - 1].sortOrder)}
                    title="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    className="p-1 text-[#888] hover:text-ink disabled:opacity-30"
                    disabled={i === images.length - 1}
                    onClick={() => onSwap?.(img.id, img.sortOrder, images[i + 1].id, images[i + 1].sortOrder)}
                    title="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    className="p-1 text-[#aaa] hover:text-[#E8323C]"
                    onClick={() => onDelete?.(img.id)}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => setLightboxIndex((i) => (i != null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(() => setLightboxIndex((i) => (i != null && i < images.length - 1 ? i + 1 : i)), [images.length]);

  useEffect(() => {
    if (lightboxIndex == null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, prev, next]);

  if (images.length === 0) {
    return (
      <div className="grid h-72 grid-cols-[1.4fr_1fr] grid-rows-2 gap-1.5">
        <div className="row-span-2 flex items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          screenshot.png
        </div>
        <div className="flex items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          02.png
        </div>
        <div className="flex items-center justify-center rounded bg-[#E8E4D9] border border-[rgba(0,0,0,0.08)] text-[10px] font-['Space_Mono',monospace] text-[#888]">
          03.png
        </div>
      </div>
    );
  }

  const [first, second, third] = images;
  const extra = images.length - 3;

  return (
    <>
      <div className="grid h-72 grid-cols-[1.4fr_1fr] grid-rows-2 gap-1.5">
        <button
          className="row-span-2 overflow-hidden rounded border border-[rgba(0,0,0,0.08)] cursor-pointer"
          onClick={() => openAt(0)}
        >
          <img src={first.url ?? undefined} alt="" className="h-full w-full object-cover" />
        </button>

        <button
          className="overflow-hidden rounded border border-[rgba(0,0,0,0.08)] cursor-pointer"
          onClick={() => second && openAt(1)}
        >
          {second ? (
            <img src={second.url ?? undefined} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#E8E4D9] text-[10px] font-['Space_Mono',monospace] text-[#888]">02.png</div>
          )}
        </button>

        <button
          className="relative overflow-hidden rounded border border-[rgba(0,0,0,0.08)] cursor-pointer"
          onClick={() => openAt(third ? 2 : 0)}
        >
          {third ? (
            <img src={third.url ?? undefined} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#E8E4D9] text-[10px] font-['Space_Mono',monospace] text-[#888]">03.png</div>
          )}
          {extra > 0 && (
            <span className="absolute bottom-1.5 right-1.5 rounded bg-[rgba(0,0,0,0.55)] px-1.5 py-0.5 text-[9px] font-['Space_Mono',monospace] text-white">
              + {extra} more
            </span>
          )}
        </button>
      </div>

      {lightboxIndex != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X size={20} />
          </button>

          <span className="absolute top-4 left-1/2 -translate-x-1/2 font-['Space_Mono',monospace] text-[11px] text-white/60">
            {lightboxIndex + 1} / {images.length}
          </span>

          <button
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-20"
            disabled={lightboxIndex === 0}
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={images[lightboxIndex].url ?? undefined}
            alt=""
            className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-20"
            disabled={lightboxIndex === images.length - 1}
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-5 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className={`h-12 w-16 overflow-hidden rounded border-2 transition-all ${i === lightboxIndex ? "border-white" : "border-transparent opacity-50 hover:opacity-75"}`}
              >
                <img src={img.url ?? undefined} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const AVATAR_COLORS = ["#FFE14D", "#B5D8E9", "#E9C9B5", "#D4C5E2", "#C5DED4"];

const EMPTY_MEMBER: TeamMemberIn = { name: "", roleLabel: "", bioNote: "", twitterUrl: "", githubUrl: "" };

export function TeamSection({
  members,
  isAdmin,
  isOwner,
  onApprove,
  onReject,
  onDelete,
  onUpdate,
  onCreate,
  creating,
}: {
  members: TeamMemberOut[];
  isAdmin: boolean;
  isOwner: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<TeamMemberIn>) => void;
  onCreate: (data: TeamMemberIn) => void;
  creating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMemberOut | null>(null);
  const [form, setForm] = useState<TeamMemberIn>(EMPTY_MEMBER);
  const [editForm, setEditForm] = useState<Partial<TeamMemberIn>>({});

  const formatLinkLabel = (url: string) => {
    let label = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    label = label.replace(/^twitter\.com\//, "x.com/");
    return label;
  };

  const shown = expanded ? members : members.slice(0, 3);
  const hiddenCount = members.length - 3;

  function openEdit(m: TeamMemberOut) {
    setEditMember(m);
    setEditForm({
      name: m.name,
      roleLabel: m.roleLabel ?? "",
      bioNote: m.bioNote ?? "",
      twitterUrl: m.twitterUrl ?? "",
      githubUrl: m.githubUrl ?? "",
    });
  }

  function submitAdd() {
    if (!form.name.trim()) return;
    onCreate({ ...form, name: form.name.trim() });
    setForm(EMPTY_MEMBER);
    setAddOpen(false);
  }

  function submitEdit() {
    if (!editMember) return;
    onUpdate(editMember.id, editForm);
    setEditMember(null);
  }

  return (
    <>
      {isAdmin && (
        <div className="mb-4">
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Add Member
          </Button>
        </div>
      )}

      {members.length === 0 && <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No team members listed.</p>}

      <div className={`overflow-hidden transition-all ${expanded ? "max-h-200 overflow-y-auto" : "max-h-120"}`}>
        {shown.map((m, i) => (
          <div key={m.id} className={`flex items-start gap-4 py-4 ${i < shown.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}>
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink text-[16px] font-bold"
              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            >
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[17px] font-bold leading-snug">{m.name}</span>
                {m.roleLabel && <span className="font-['Space_Mono',monospace] text-[11px] text-[#8A8A8A]">· {m.roleLabel}</span>}
                {(isAdmin || isOwner) && m.status === "pending" && (
                  <span className="rounded border border-[rgba(0,0,0,0.15)] bg-[#FFF8DC] px-1.5 py-0.5 font-['Space_Mono',monospace] text-[9px] font-semibold tracking-[0.05em] text-[#8B6914]">
                    PENDING
                  </span>
                )}
              </div>
              {m.bioNote && <div className="text-[13px] text-[#5A5A5A] mb-1.5">{m.bioNote}</div>}
              {(m.twitterUrl || m.githubUrl) && (
                <div className="flex flex-wrap gap-3 font-['Space_Mono',monospace] text-[11px]">
                  {m.twitterUrl && (
                    <a
                      href={m.twitterUrl.startsWith("http") ? m.twitterUrl : `https://${m.twitterUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#185FA5] hover:underline"
                    >
                      ↗ {formatLinkLabel(m.twitterUrl)}
                    </a>
                  )}
                  {m.githubUrl && (
                    <a
                      href={m.githubUrl.startsWith("http") ? m.githubUrl : `https://${m.githubUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#185FA5] hover:underline"
                    >
                      ↗ {formatLinkLabel(m.githubUrl)}
                    </a>
                  )}
                </div>
              )}
              {isAdmin && m.status === "pending" && (
                <div className="mt-1.5 flex gap-1.5">
                  <button onClick={() => onApprove(m.id)} className="font-['Space_Mono',monospace] text-[10px] text-[#639922] hover:underline">
                    ✓ Approve
                  </button>
                  <span className="text-[#ccc]">·</span>
                  <button onClick={() => onReject(m.id)} className="font-['Space_Mono',monospace] text-[10px] text-[#888] hover:underline">
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
            {isAdmin && (
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => openEdit(m)} className="p-1 text-[#6B6B7A] hover:text-ink" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(m.id)} className="p-1 text-[#aaa] hover:text-[#E8323C]" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {hiddenCount > 0 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 font-['Space_Mono',monospace] text-[11px] text-[#888] hover:text-[#1a1a1a]">
          {expanded ? "− show less" : `+ ${hiddenCount} more team members`}
        </button>
      )}

      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setForm(EMPTY_MEMBER);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>ADD_TEAM_MEMBER.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="inp-group">
              <label className="inp-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input className="inp" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Role</label>
              <input
                className="inp"
                placeholder="e.g. Co-founder, Engineer"
                value={form.roleLabel}
                onChange={(e) => setForm({ ...form, roleLabel: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Bio</label>
              <input
                className="inp"
                placeholder="One-line bio"
                value={form.bioNote}
                onChange={(e) => setForm({ ...form, bioNote: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Twitter URL</label>
              <input
                className="inp"
                placeholder="https://twitter.com/…"
                value={form.twitterUrl}
                onChange={(e) => setForm({ ...form, twitterUrl: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">GitHub URL</label>
              <input
                className="inp"
                placeholder="https://github.com/…"
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
            </div>
            <div className="flex gap-2.5">
              <Button className="flex-1" onClick={submitAdd} disabled={creating || !form.name.trim()}>
                {creating ? <span className="spinner" /> : "Add Member →"}
              </Button>
              <Button variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editMember}
        onOpenChange={(o) => {
          if (!o) setEditMember(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>EDIT_TEAM_MEMBER.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="inp-group">
              <label className="inp-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input className="inp" value={editForm.name ?? ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Role</label>
              <input className="inp" value={editForm.roleLabel ?? ""} onChange={(e) => setEditForm({ ...editForm, roleLabel: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Bio</label>
              <input className="inp" value={editForm.bioNote ?? ""} onChange={(e) => setEditForm({ ...editForm, bioNote: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Twitter URL</label>
              <input className="inp" value={editForm.twitterUrl ?? ""} onChange={(e) => setEditForm({ ...editForm, twitterUrl: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">GitHub URL</label>
              <input className="inp" value={editForm.githubUrl ?? ""} onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })} />
            </div>
            <div className="flex gap-2.5">
              <Button className="flex-1" onClick={submitEdit} disabled={!editForm.name?.trim()}>
                Save Changes →
              </Button>
              <Button variant="ghost" onClick={() => setEditMember(null)}>
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

const EMPTY_VOICE: VoiceIn = { quote: "", authorHandle: "", authorName: "", sourceUrl: "" };

export function VoicesSection({
  voices,
  isAdmin,
  onDelete,
  onCreate,
  onUpdate,
  onSwap,
  creating,
}: {
  voices: ProductVoice[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onCreate: (data: VoiceIn) => void;
  onUpdate: (id: number, data: Partial<VoiceIn>) => void;
  onSwap?: (idA: number, orderA: number, idB: number, orderB: number) => void;
  creating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editVoice, setEditVoice] = useState<ProductVoice | null>(null);
  const [form, setForm] = useState<VoiceIn>(EMPTY_VOICE);
  const [editForm, setEditForm] = useState<Partial<VoiceIn>>({});

  const sorted = [...voices].sort((a, b) => a.sortOrder - b.sortOrder);
  const shown = expanded ? sorted : sorted.slice(0, 2);

  function openEdit(v: ProductVoice) {
    setEditVoice(v);
    setEditForm({ quote: v.quote, authorHandle: v.authorHandle, authorName: v.authorName ?? "", sourceUrl: v.sourceUrl ?? "" });
  }

  function submitAdd() {
    if (!form.quote.trim() || !form.authorHandle.trim()) return;
    onCreate({ ...form, quote: form.quote.trim(), authorHandle: form.authorHandle.trim() });
    setForm(EMPTY_VOICE);
    setAddOpen(false);
  }

  function submitEdit() {
    if (!editVoice || !editForm.quote?.trim() || !editForm.authorHandle?.trim()) return;
    onUpdate(editVoice.id, editForm);
    setEditVoice(null);
  }

  return (
    <>
      {isAdmin && (
        <div className="mb-4">
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Add Voice
          </Button>
        </div>
      )}

      {voices.length === 0 && <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No voices yet.</p>}

      <div className={`overflow-hidden transition-all ${expanded ? "max-h-150 overflow-y-auto" : "max-h-77.5"}`}>
        {shown.map((v, i) => (
          <div key={v.id} className="mb-2.5 rounded-md border border-[rgba(0,0,0,0.08)] bg-[#FFFCEF] px-4 py-3.5 last:mb-0">
            <p className="text-[13px] italic leading-[1.55]">"{v.quote}"</p>
            <div className="mt-2 flex items-center justify-between font-['Space_Mono',monospace] text-[10px]">
              <span className="font-medium text-[#1a1a1a]">{v.authorName ?? v.authorHandle}</span>
              <div className="flex items-center gap-3">
                {v.sourceUrl && (
                  <Link href={v.sourceUrl} target="_blank" rel="noreferrer" className="text-[#185FA5] hover:underline">
                    ↗ open thread
                  </Link>
                )}
                {isAdmin && (
                  <>
                    <button
                      className="text-[#888] hover:text-ink disabled:opacity-30"
                      disabled={i === 0}
                      onClick={() => onSwap?.(v.id, v.sortOrder, sorted[i - 1].id, sorted[i - 1].sortOrder)}
                      title="Move up"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      className="text-[#888] hover:text-ink disabled:opacity-30"
                      disabled={i === sorted.length - 1}
                      onClick={() => onSwap?.(v.id, v.sortOrder, sorted[i + 1].id, sorted[i + 1].sortOrder)}
                      title="Move down"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <button onClick={() => openEdit(v)} className="text-[#6B6B7A] hover:text-ink" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => onDelete(v.id)} className="text-[#aaa] hover:text-[#E8323C]" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sorted.length > 2 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-2.5 font-['Space_Mono',monospace] text-[11px] text-[#888] hover:text-[#1a1a1a]">
          {expanded ? "− show less" : `show ${sorted.length - 2} more →`}
        </button>
      )}

      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setForm(EMPTY_VOICE);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>ADD_VOICE.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="inp-group">
              <label className="inp-label">
                Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                className="inp resize-none"
                rows={3}
                placeholder="What they said…"
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">
                Handle <span className="text-red-500">*</span>
              </label>
              <input
                className="inp"
                placeholder="@username"
                value={form.authorHandle}
                onChange={(e) => setForm({ ...form, authorHandle: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Author name</label>
              <input
                className="inp"
                placeholder="Display name (optional)"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Source URL</label>
              <input
                className="inp"
                placeholder="https://twitter.com/…"
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              />
            </div>
            <div className="flex gap-2.5">
              <Button className="flex-1" onClick={submitAdd} disabled={creating || !form.quote.trim() || !form.authorHandle.trim()}>
                {creating ? <span className="spinner" /> : "Add Voice →"}
              </Button>
              <Button variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editVoice}
        onOpenChange={(o) => {
          if (!o) setEditVoice(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>EDIT_VOICE.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="inp-group">
              <label className="inp-label">
                Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                className="inp resize-none"
                rows={3}
                value={editForm.quote ?? ""}
                onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">
                Handle <span className="text-red-500">*</span>
              </label>
              <input
                className="inp"
                value={editForm.authorHandle ?? ""}
                onChange={(e) => setEditForm({ ...editForm, authorHandle: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Author name</label>
              <input className="inp" value={editForm.authorName ?? ""} onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })} />
            </div>
            <div className="inp-group">
              <label className="inp-label">Source URL</label>
              <input className="inp" value={editForm.sourceUrl ?? ""} onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })} />
            </div>
            <div className="flex gap-2.5">
              <Button className="flex-1" onClick={submitEdit} disabled={!editForm.quote?.trim() || !editForm.authorHandle?.trim()}>
                Save Changes →
              </Button>
              <Button variant="ghost" onClick={() => setEditVoice(null)}>
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

const EMPTY_BOUNTY: BountyIn = { title: "", techLabel: "", rewardAmount: "", externalUrl: "" };

export function BountiesSection({
  bounties,
  isAdmin,
  onDelete,
  onCreate,
  creating,
}: {
  bounties: Bounty[];
  isAdmin: boolean;
  onDelete: (id: number) => void;
  onCreate: (data: BountyIn) => void;
  creating: boolean;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<BountyIn>(EMPTY_BOUNTY);

  function submitAdd() {
    if (!form.title.trim() || !form.rewardAmount || !form.externalUrl.trim()) return;
    onCreate({ ...form, title: form.title.trim(), externalUrl: form.externalUrl.trim() });
    setForm(EMPTY_BOUNTY);
    setAddOpen(false);
  }

  return (
    <>
      {isAdmin && (
        <div className="mb-4">
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Add Bounty
          </Button>
        </div>
      )}

      {bounties.length === 0 && <p className="py-3 font-['Space_Mono',monospace] text-[10px] text-[#888]">No active bounties.</p>}

      {bounties.map((b, i) => (
        <div
          key={b.id}
          className={`flex items-start justify-between py-3.5 ${i < bounties.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}
        >
          <div className="flex-1 min-w-0">
            <div className="mb-1 text-sm font-semibold">{b.title}</div>
            <div className="flex flex-wrap items-center gap-1.5 font-['Space_Mono',monospace] text-[10px] text-[#888]">
              {b.techLabel && <span className="rounded border border-[rgba(0,0,0,0.12)] bg-[#FAFAF7] px-1.5 py-0.5 text-[9px]">{b.techLabel}</span>}
              <span className="capitalize">{b.status}</span>
            </div>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-2">
            <a
              href={b.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="font-['Space_Mono',monospace] text-[15px] font-bold text-[#639922] hover:underline"
            >
              ${Number(b.rewardAmount).toLocaleString()}
            </a>
            {isAdmin && (
              <button onClick={() => onDelete(b.id)} className="text-[#aaa] hover:text-[#E8323C]" title="Delete">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      ))}

      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          if (!o) {
            setAddOpen(false);
            setForm(EMPTY_BOUNTY);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>ADD_BOUNTY.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="inp-group">
              <label className="inp-label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="inp"
                placeholder="e.g. Fix critical auth bug"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Tech tag</label>
              <input
                className="inp"
                placeholder="e.g. Python, React"
                value={form.techLabel}
                onChange={(e) => setForm({ ...form, techLabel: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">
                Reward amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                className="inp"
                type="number"
                min="0"
                placeholder="e.g. 500"
                value={form.rewardAmount}
                onChange={(e) => setForm({ ...form, rewardAmount: e.target.value })}
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">
                External URL <span className="text-red-500">*</span>
              </label>
              <input
                className="inp"
                placeholder="GitHub issue or application form"
                value={form.externalUrl}
                onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              />
            </div>
            <div className="flex gap-2.5">
              <Button
                className="flex-1"
                onClick={submitAdd}
                disabled={creating || !form.title.trim() || !form.rewardAmount || !form.externalUrl.trim()}
              >
                {creating ? <span className="spinner" /> : "Create Bounty →"}
              </Button>
              <Button variant="ghost" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function DiscussionSection({ user, comments, onPost }: { user: any; comments: ProductComment[]; onPost: (text: string) => void }) {
  const [text, setText] = useState("");

  return (
    <WindowCard label="DISCUSSION.SYS">
      <div className="mb-4 font-['Space_Mono',monospace] text-[10px] uppercase tracking-[0.06em] text-[#888]">
        {comments.length} comments · developer & researcher discussion
      </div>

      {comments.length === 0 && <p className="mb-4 font-['Space_Mono',monospace] text-[10px] text-[#888]">No comments yet. Be the first.</p>}

      {comments.map((c) => (
        <div
          key={c.id}
          className={`mb-2.5 rounded-lg bg-[#FFFCEF] px-4 py-3.5 ${c.pinned ? "border-l-[3px] border-l-[#E94842] rounded-l-none border border-[rgba(0,0,0,0.08)]" : "border border-[rgba(0,0,0,0.08)]"}`}
        >
          <div className="mb-2 flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] font-['Space_Mono',monospace] text-[10px] font-semibold text-[#555]"
              style={{ background: AVATAR_COLORS[c.createdById % AVATAR_COLORS.length] }}
            >
              U
            </div>
            <span className="font-['Space_Mono',monospace] text-[10px] text-[#888]">
              {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            {c.pinned && (
              <span className="font-['Space_Mono',monospace] text-[9px] bg-[#FFE14D] border border-ink px-1.5 py-0.5 rounded font-semibold tracking-[0.05em]">
                PINNED
              </span>
            )}
          </div>
          <div className="text-sm leading-[1.55]">{c.text}</div>
        </div>
      ))}

      <div className="mt-4 border-t border-t-[rgba(0,0,0,0.08)] pt-4 flex items-center gap-2.5">
        {user ? (
          <>
            <input
              className="flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[#FFFCEF] px-3.5 py-3 text-[13px] placeholder:text-[#aaa] focus:outline-none focus:border-ink"
              placeholder="Share your thoughts…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              disabled={!text.trim()}
              onClick={() => {
                onPost(text.trim());
                setText("");
              }}
              className="rounded-full border border-ink bg-white px-4 py-2.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px disabled:opacity-40"
            >
              Post
            </button>
          </>
        ) : (
          <p className="font-['Space_Mono',monospace] text-[10px] text-[#888]">Sign in to join the discussion.</p>
        )}
      </div>
    </WindowCard>
  );
}
