"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import WindowCard from "@/components/ui/WindowCard";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { IconShare } from "@/components/Icons";
import { Bookmark, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useUpdateSubcategoryStatus } from "@/hooks/queries/useReference";
import { Popover } from "@base-ui/react";
import VoteButton from "@/components/VoteButton";
import { prettyUrl } from "@/utils/lib";
import { cn } from "@/lib/utils";
import {
  useProductBySlug,
  useInterestProduct,
  useSimilarProducts,
  useComments,
  useCreateComment,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useUpdateTeamMemberStatus,
  useCreateVoice,
  useUpdateVoice,
  useDeleteVoice,
  useCreateBounty,
  useDeleteBounty,
  useUpdateProductStatus,
  useUpdateSimilarProducts,
  useBookmarkProduct,
  useUploadProductMedia,
  useSwapProductMedia,
  useDeleteProductMedia,
  useSwapVoice,
  usePinComment,
  useDeleteComment,
  useUpdateProduct,
  useCreateProductLink,
  useUpdateProductLink,
  useDeleteProductLink,
  useUploadProductLogo,
  useDeleteProductLogo,
  useDeleteProduct,
  GallerySection,
  TeamSection,
  VoicesSection,
  BountiesSection,
  DiscussionSection,
  EditProductInfoDialog,
  EditProductLinksDialog,
  EditProductLogoDialog,
  EditSimilarProductsDialog,
  approvedSubcategories,
  pendingSubcategory,
} from "@/features/products";
import type { ProductDetailOut } from "@/features/products";
import { VerificationStatus, ProductStatus, ProductLinkTypeLabel, sortProductLinksOtherLast } from "@/enums";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queuePage = searchParams.get("queuePage");
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  const { data: apiProduct, isLoading } = useProductBySlug(id);

  const { mutate: interest, isPending: registeringInterest } = useInterestProduct();
  const apiProductId = apiProduct?.id ?? 0;
  const { data: similarProducts } = useSimilarProducts(apiProductId, apiProduct?.status === ProductStatus.APPROVED);
  const { data: commentsData, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(apiProductId);
  const allComments = commentsData?.pages.flatMap((p) => p.items) ?? [];
  const commentsTotal = commentsData?.pages[0]?.total ?? 0;
  const { mutate: createComment } = useCreateComment(apiProductId);
  const { mutate: pinComment } = usePinComment(apiProductId);
  const { mutate: deleteComment } = useDeleteComment(apiProductId);

  const isAdmin = (user?.role as string) === "admin";

  const { mutate: createTeamMember, isPending: creatingTeamMember } = useCreateTeamMember(apiProductId, id);
  const { mutate: updateTeamMember } = useUpdateTeamMember(apiProductId, id);
  const { mutate: deleteTeamMember } = useDeleteTeamMember(apiProductId, id);
  const { mutate: updateTeamMemberStatus } = useUpdateTeamMemberStatus(apiProductId, id);
  const { mutate: createVoice, isPending: creatingVoice } = useCreateVoice(apiProductId, id);
  const { mutate: updateVoice } = useUpdateVoice(apiProductId, id);
  const { mutate: deleteVoice } = useDeleteVoice(apiProductId, id);
  const { mutate: createBounty, isPending: creatingBounty } = useCreateBounty(apiProductId, id);
  const { mutate: deleteBounty } = useDeleteBounty(apiProductId, id);
  const { mutate: updateProductStatus, isPending: updatingStatus } = useUpdateProductStatus();
  const { mutate: uploadMedia, isPending: uploadingMedia } = useUploadProductMedia(apiProductId, id);
  const { mutate: swapMedia } = useSwapProductMedia(apiProductId, id);
  const { mutate: deleteMedia } = useDeleteProductMedia(apiProductId, id);
  const { mutate: swapVoice } = useSwapVoice(apiProductId, id);

  const { mutate: bookmark, isPending: bookmarking } = useBookmarkProduct();

  const [editLogoOpen, setEditLogoOpen] = useState(false);
  const [editInfoOpen, setEditInfoOpen] = useState(false);
  const [editLinksOpen, setEditLinksOpen] = useState(false);
  const [editSimilarOpen, setEditSimilarOpen] = useState(false);
  const [teamAddOpen, setTeamAddOpen] = useState(false);
  const [voicesAddOpen, setVoicesAddOpen] = useState(false);
  const [bountiesAddOpen, setBountiesAddOpen] = useState(false);
  const { mutate: uploadLogo, isPending: uploadingLogo } = useUploadProductLogo(apiProductId, id);
  const { mutate: deleteLogo, isPending: deletingLogo } = useDeleteProductLogo(apiProductId, id);
  const { mutate: deleteProduct, isPending: deletingProduct } = useDeleteProduct();
  const { mutate: updateProduct, isPending: updatingProduct } = useUpdateProduct(id);
  const { mutate: updateSimilarProducts, isPending: updatingSimilar } = useUpdateSimilarProducts(id);
  const { mutate: createLink, isPending: creatingLink } = useCreateProductLink(apiProductId, id);
  const { mutate: updateLink, isPending: updatingLink } = useUpdateProductLink(apiProductId, id);
  const { mutate: deleteLink, isPending: deletingLink } = useDeleteProductLink(apiProductId, id);
  const linkPending = creatingLink || updatingLink || deletingLink;
  const { mutate: updateSubStatus, isPending: updatingSubcategory } = useUpdateSubcategoryStatus();
  const [subPopoverOpen, setSubPopoverOpen] = useState(false);

  const shareLaunch = async (slug: string) => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const shareUrl = `${origin}/launch/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="page-wrap section animate-pulse">
        <div className="mb-6 h-8 w-40 rounded-full bg-[#E8E4DC]" />
        <div className="mb-8 flex gap-4">
          <div className="size-20 shrink-0 rounded-xl bg-[#E8E4DC]" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-9 w-56 rounded bg-[#E8E4DC]" />
            <div className="h-4 w-full rounded bg-[#E8E4DC]" />
            <div className="h-4 w-2/3 rounded bg-[#E8E4DC]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-64 rounded-xl bg-[#E8E4DC]" />
          <div className="space-y-4">
            <div className="h-40 rounded-xl bg-[#E8E4DC]" />
            <div className="h-24 rounded-xl bg-[#E8E4DC]" />
          </div>
        </div>
      </div>
    );
  }

  if (!apiProduct) {
    return (
      <div className="page-wrap section">
        <p>Launch not found.</p>
        <Link className="link-arrow" href="/launch">
          ← Back to Launch
        </Link>
      </div>
    );
  }

  const p: ProductDetailOut = apiProduct;
  const primaryCategory = p.categories[0]?.name ?? "Product";
  const pendingSub = pendingSubcategory(p.categories);
  const isInvestor = (user?.role as string) === "investor";

  const handleBookmark = () => {
    if (!user) {
      showToast("Sign in to bookmark.", "error");
      return;
    }
    if (p.status !== ProductStatus.APPROVED) {
      showToast("Only approved launches can be bookmarked.", "error");
      return;
    }
    const next = !p.bookmarked;
    bookmark(
      { id: p.id, bookmarked: next },
      {
        onSuccess: () => showToast(next ? `Saved ${p.name}` : `Removed ${p.name}`, next ? "success" : "info"),
        onError: () => showToast("Failed to bookmark. Please try again.", "error"),
      }
    );
  };

  const handleApiInterest = () => {
    if (!user) {
      showToast("Sign in to register interest.", "error");
      return;
    }
    if (!isInvestor) {
      showToast("Investor access required.", "error");
      return;
    }
    const newInterested = !p.interested;
    interest(
      { id: p.id, interested: newInterested },
      {
        onSuccess: () => showToast(newInterested ? "Investor interest registered. Founders will be notified." : "Interest removed.", "success"),
        onError: () => showToast("Failed to register interest. Please try again.", "error"),
      }
    );
  };

  const isPending = p.status === ProductStatus.PENDING;
  const isOwner = user != null && p.createdById != null && user.id === p.createdById;

  const handleVerifyProduct = (status: ProductStatus) => {
    // Force an explicit decision on a custom sub-category before the launch is
    // approved — otherwise the backend would silently auto-approve it on cascade.
    if (status === ProductStatus.APPROVED && pendingSub) {
      showToast(`Review the pending sub-category "${pendingSub.name}" before approving the launch.`, "error");
      setSubPopoverOpen(true);
      return;
    }
    updateProductStatus(
      { id: p.id, status },
      {
        onSuccess: () =>
          showToast(
            status === ProductStatus.APPROVED ? "Launch approved." : "Launch rejected.",
            status === ProductStatus.APPROVED ? "success" : "info"
          ),
        onError: () => showToast("Action failed. Please try again.", "error"),
      }
    );
  };

  const handleSubcategoryStatus = (status: VerificationStatus) => {
    if (!pendingSub) return;
    updateSubStatus(
      { id: pendingSub.id, status },
      {
        onSuccess: () => {
          setSubPopoverOpen(false);
          showToast(
            status === VerificationStatus.APPROVED
              ? `Sub-category approved: ${pendingSub.name}`
              : `Sub-category rejected: ${pendingSub.name}`,
            status === VerificationStatus.APPROVED ? "success" : "info"
          );
        },
        onError: () => showToast("Action failed. Please try again.", "error"),
      }
    );
  };

  const handleDeleteProduct = () => {
    if (!confirm(`Are you sure you want to delete "${p.name}"? This will permanently remove the project and cannot be undone.`)) return;
    deleteProduct(p.id, {
      onSuccess: () => {
        showToast(`"${p.name}" has been deleted.`, "info");
        router.push("/launch");
      },
      onError: () => showToast("Delete failed. Please try again.", "error"),
    });
  };

  const factRows = [
    p.categories.length > 0 ? { label: "Category", value: p.categories[0].name } : null,
    p.founded != null ? { label: "Founded", value: String(p.founded) } : null,
    p.funding ? { label: "Funding", value: `$${p.funding.toLocaleString()}` } : null,
    p.stage ? { label: "Stage", value: p.stage } : null,
  ].filter(Boolean) as { label: string; value: string; isStatus?: boolean }[];

  const links = sortProductLinksOtherLast(p.links.filter((l) => l.linkType in ProductLinkTypeLabel)).map((l) => ({
    label: l.label ?? ProductLinkTypeLabel[l.linkType],
    url: l.url,
  }));

  return (
    <div>
      {isPending && isOwner && !isAdmin && (
        <div className="sticky top-17 z-40 flex items-center gap-3 border-b border-[#D4A017]/30 bg-[#FFFBEB] px-5 py-3">
          <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-widest text-[#B45309]">PENDING_REVIEW.SYS</span>
          <span className="h-3 w-px bg-[#D4A017]/40" />
          <p className="flex-1 text-[13px] font-medium text-[#92400E]">
            Your launch is awaiting editorial review. It will become publicly visible once approved.
          </p>
        </div>
      )}

      {isPending && isAdmin && (
        <div className="sticky top-17 z-40 flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] bg-paper px-5 py-3">
          <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-widest text-[#E8323C]">LAUNCH_REVIEW_QUEUE.SYS</span>
          <span className="h-3 w-px bg-[#D8D4CC]" />
          <p className="flex-1 text-[13px] font-semibold text-ink">
            This launch is pending review — approve or reject below.
            {pendingSub && (
              <span className="ml-2 font-normal text-[#92400E]">
                Custom sub-category: <strong>{pendingSub.name}</strong>
              </span>
            )}
          </p>
          <div className="flex shrink-0 gap-2">
            <Link href={`/admin?tab=launches${queuePage ? `&page=${queuePage}` : ""}`} className="btn btn-ghost btn-sm">
              ← Queue
            </Link>
            <button className="btn btn-primary btn-sm" onClick={() => handleVerifyProduct(ProductStatus.APPROVED)} disabled={updatingStatus}>
              {updatingStatus ? <span className="spinner" /> : "✓ Approve"}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => handleVerifyProduct(ProductStatus.REJECTED)} disabled={updatingStatus}>
              {updatingStatus ? <span className="spinner" /> : "✗ Reject"}
            </button>
          </div>
        </div>
      )}

      <div className="page-wrap section" style={{ maxWidth: 1100 }}>
        <div className="mb-6 flex flex-col-reverse items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center rounded-full border border-ink bg-white px-4 py-1.5 text-[13px] font-medium shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px"
          >
            ← Back to Launch
          </button>
          <span className="rounded font-['Space_Mono',monospace] border border-ink bg-white px-3 py-1 text-[11px]">/root/launch/{p.slug}</span>
        </div>

        <div className="mb-8 grid grid-cols-[90px_1fr_auto] items-start gap-4 border-b border-b-[rgba(0,0,0,0.12)] pb-7 max-[640px]:grid-cols-[70px_1fr]">
          <div className="relative shrink-0">
            <Avatar className="size-22 rounded-xl overflow-visible border border-ink shadow-[3px_3px_0_#1a1a1a] max-[640px]:size-17.5">
              <AvatarImage src={p.logo ?? undefined} alt={p.name} className="size-full object-contain" />
              <AvatarFallback className="rounded-xl bg-white text-4xl font-extrabold max-[640px]:text-3xl">{p.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setEditLogoOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full border border-ink bg-white shadow-[1px_1px_0_#1a1a1a] text-[#888] transition-colors hover:text-ink"
                title="Edit logo"
              >
                <Pencil size={10} />
              </button>
            )}
          </div>

          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h1 className="text-[36px] leading-none tracking-tight max-[640px]:text-[28px]">{p.name}</h1>
              {p.categories.length > 0 && <ProductBadge label={p.categories[0].name} />}
              {approvedSubcategories(p.categories).map((sub) => (
                <ProductBadge key={sub.id} label={sub.name} type="subcategory" />
              ))}
              {pendingSub &&
                (isAdmin ? (
                  <Popover.Root open={subPopoverOpen} onOpenChange={setSubPopoverOpen}>
                    <Popover.Trigger
                      className="topic-pill cursor-pointer bg-[#FEF3C7] text-[10px] border-[#D4A017]/40 text-[#92400E] hover:bg-[#FDE9A8]"
                      title="Review pending sub-category"
                    >
                      ⚠ {pendingSub.name.toUpperCase()} (PENDING) ▾
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Positioner sideOffset={6} align="start">
                        <Popover.Popup className="z-50 w-64 rounded-[10px] border-2 border-ink bg-cream p-4 shadow-[6px_6px_0_#1c1c27] outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 transition-opacity duration-150">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Custom sub-category</p>
                          <p className="mt-1 font-bold text-ink">{pendingSub.name}</p>
                          <p className="mt-1 text-xs text-muted">Approve to publish it as a badge, or reject to discard it.</p>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleSubcategoryStatus(VerificationStatus.APPROVED)}
                              disabled={updatingSubcategory}
                            >
                              ✓ Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleSubcategoryStatus(VerificationStatus.REJECTED)}
                              disabled={updatingSubcategory}
                            >
                              ✗ Reject
                            </Button>
                          </div>
                        </Popover.Popup>
                      </Popover.Positioner>
                    </Popover.Portal>
                  </Popover.Root>
                ): (<p/>))}
              {p.qualityBadge && <ProductBadge label={p.qualityBadge} type="stage" />}
              {p.stage && <ProductBadge label={p.stage} type="stage" />}
            </div>
            {p.shortDesc && <p className="mb-2 text-[15px] leading-[1.6] text-[#555] max-w-150">{p.shortDesc}</p>}
            <div className="font-['Space_Mono',monospace] text-[11px] text-[#888] tracking-[0.02em]">
              {p.founded != null && <>founded {p.founded}</>}
              {p.founded != null && p.createdAt && <span className="mx-1 text-[#ccc]">·</span>}
              {p.createdAt && <>launched on AthenaX {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</>}
            </div>
          </div>

          <div className="shrink-0 flex w-full items-center gap-2 sm:w-auto max-[640px]:col-span-2">
            <VoteButton user={user} product={p} showToast={showToast} size="sm" initialVoted={p.voted} showLabel disabled={p.status !== ProductStatus.APPROVED} />
            <Button variant="ghost" size="sm" className="flex-1 justify-center sm:flex-none text-[12px]" onClick={() => shareLaunch(p.slug)}>
              <IconShare size={14} />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(p.bookmarked ? "text-[#B45309]" : "", "disabled:opacity-60")}
              onClick={handleBookmark}
              disabled={bookmarking || p.status !== ProductStatus.APPROVED}
              title={p.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark size={15} fill={p.bookmarked ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <WindowCard
            label="ABOUT.SYS"
            className="md:row-span-2"
            titleRight={
              isAdmin && (
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditInfoOpen(true)}
                    className="p-1 text-[#888] transition-colors hover:text-ink"
                    title="Edit"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProduct}
                    disabled={deletingProduct}
                    className="p-1 text-[#888] transition-colors hover:text-red-500 disabled:opacity-40"
                    title="Delete product"
                  >
                    {deletingProduct ? <span className="spinner" /> : <Trash2 size={12} />}
                  </button>
                </div>
              )
            }
          >
            <p className="mb-3 text-[15px] leading-[1.7]">{p.description ?? "No description provided."}</p>

            <div className="mb-8">
              {factRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between py-2.5 ${i < factRows.length - 1 ? "border-b border-b-[rgba(0,0,0,0.08)]" : ""}`}
                >
                  <span className="font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#888]">{row.label}</span>
                  <span className={`text-sm font-bold ${row.isStatus ? "text-[#639922]" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {p.backers.length > 0 && (
              <div className="mb-3">
                <div className="mb-1 font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#888]">Backers</div>
                <div className="flex flex-wrap gap-2">
                  {p.backers.map((b) => (
                    <span key={b.id} className="rounded-full border border-[rgba(0,0,0,0.15)] bg-white px-2 py-1 text-xs font-medium">
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {p.grants.length > 0 && (
              <div>
                <div className="mb-1 font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.06em] text-[#888]">Grants</div>
                <div className="flex flex-wrap gap-2">
                  {p.grants.map((g) => (
                    <span key={g.id} className="rounded-full border border-[rgba(0,0,0,0.15)] bg-white px-2 py-1 text-xs font-medium">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </WindowCard>

          <div className="flex flex-col gap-4 md:row-span-2">
          <WindowCard label="GALLERY.SYS" bodyClass="p-3">
            <GallerySection
              media={p.media}
              isAdmin={isAdmin}
              uploading={uploadingMedia}
              onUpload={(file) =>
                uploadMedia(
                  { file },
                  {
                    onSuccess: () => showToast("Image uploaded.", "success"),
                    onError: () => showToast("Upload failed. Please try again.", "error"),
                  }
                )
              }
              onDelete={(mediaId) =>
                deleteMedia(mediaId, {
                  onSuccess: () => showToast("Image removed.", "info"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              onSwap={(idA, orderA, idB, orderB) =>
                swapMedia({ idA, orderA, idB, orderB }, { onError: () => showToast("Failed to reorder.", "error") })
              }
            />
          </WindowCard>

          <WindowCard
            label="LINKS.SYS"
            bodyClass="px-5 py-3"
            className="flex-1"
            titleRight={
              isAdmin && (
                <button
                  type="button"
                  onClick={() => setEditLinksOpen(true)}
                  className="ml-auto p-1 text-[#888] transition-colors hover:text-ink"
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
              )
            }
          >
            {links.length > 0 ? (
              links.map((l) => (
                <div key={l.label} className="flex items-baseline justify-between gap-3 border-b border-b-[rgba(0,0,0,0.08)] py-2.5">
                  <span className="shrink-0 text-sm font-semibold">{l.label}</span>
                  <Link
                    href={l.url.startsWith("http") ? l.url : `https://${l.url}`}
                    target="_blank"
                    rel="noreferrer"
                    title={l.url}
                    className="max-w-70 min-w-0 truncate font-['Space_Mono',monospace] text-xs text-[#C4605C] no-underline hover:underline"
                  >
                    ↗ {prettyUrl(l.url)}
                  </Link>
                </div>
              ))
            ) : (
              <p className="py-3 text-[13px] text-[#888]">No links provided.</p>
            )}

            {isInvestor && (
              <div className="mt-3 pt-3 border-t border-t-[rgba(0,0,0,0.08)]">
                <button
                  onClick={handleApiInterest}
                  disabled={registeringInterest}
                  className={`w-full rounded-full border border-ink px-4 py-2 text-[13px] font-semibold shadow-[2px_2px_0_#1a1a1a] transition-transform hover:-translate-x-px hover:-translate-y-px ${p.interested ? "bg-[#D7E9B5]" : "bg-[#FFE14D]"}`}
                >
                  ★ {registeringInterest ? "Registering…" : p.interested ? "Interest Registered" : "Register Investor Interest"}
                </button>
                {p.interested && (
                  <div className="mt-1.5 text-center font-['Space_Mono',monospace] text-[10px] text-[#639922]">
                    {p.investorInterestCount} investor{p.investorInterestCount !== 1 ? "s" : ""} interested
                  </div>
                )}
              </div>
            )}
          </WindowCard>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <WindowCard
            label="TEAM.SYS"
            bodyClass="window-body px-4! sm:px-6!"
            titleRight={
              isAdmin && (
                <button
                  type="button"
                  onClick={() => setTeamAddOpen(true)}
                  className="ml-auto p-1 text-[#888] transition-colors hover:text-ink"
                  title="Add member"
                >
                  <Plus size={12} />
                </button>
              )
            }
          >
            <TeamSection
              members={p.team}
              isAdmin={isAdmin}
              isOwner={isOwner}
              addOpen={teamAddOpen}
              onAddOpenChange={setTeamAddOpen}
              onApprove={(memberId) =>
                updateTeamMemberStatus(
                  { memberId, status: VerificationStatus.APPROVED },
                  { onSuccess: () => showToast("Member approved.", "success"), onError: () => showToast("Action failed.", "error") }
                )
              }
              onReject={(memberId) =>
                updateTeamMemberStatus(
                  { memberId, status: VerificationStatus.REJECTED },
                  { onSuccess: () => showToast("Member rejected.", "info"), onError: () => showToast("Action failed.", "error") }
                )
              }
              onDelete={(memberId) =>
                deleteTeamMember(memberId, {
                  onSuccess: () => showToast("Member removed.", "info"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              onUpdate={(memberId, data) =>
                updateTeamMember(
                  { memberId, data },
                  { onSuccess: () => showToast("Member updated.", "success"), onError: () => showToast("Action failed.", "error") }
                )
              }
              onCreate={(data) =>
                createTeamMember(data, {
                  onSuccess: () => showToast("Member added — pending approval.", "success"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              creating={creatingTeamMember}
            />
          </WindowCard>

          <WindowCard
            label="VOICES.SYS"
            titleRight={
              isAdmin && (
                <button
                  type="button"
                  onClick={() => setVoicesAddOpen(true)}
                  className="ml-auto p-1 text-[#888] transition-colors hover:text-ink"
                  title="Add voice"
                >
                  <Plus size={12} />
                </button>
              )
            }
          >
            <VoicesSection
              voices={p.voices}
              isAdmin={isAdmin}
              addOpen={voicesAddOpen}
              onAddOpenChange={setVoicesAddOpen}
              onDelete={(voiceId) =>
                deleteVoice(voiceId, {
                  onSuccess: () => showToast("Voice removed.", "info"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              onUpdate={(voiceId, data) =>
                updateVoice(
                  { voiceId, data },
                  {
                    onSuccess: () => showToast("Voice updated.", "success"),
                    onError: () => showToast("Action failed.", "error"),
                  }
                )
              }
              onCreate={(data) =>
                createVoice(data, {
                  onSuccess: () => showToast("Voice added.", "success"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              onSwap={(idA, orderA, idB, orderB) =>
                swapVoice({ idA, orderA, idB, orderB }, { onError: () => showToast("Failed to reorder.", "error") })
              }
              creating={creatingVoice}
            />
          </WindowCard>
        </div>

        <div className="mb-8 hidden">
          <WindowCard
            label="BOUNTIES.SYS"
            titleRight={
              isAdmin ? (
                <button
                  type="button"
                  onClick={() => setBountiesAddOpen(true)}
                  className="ml-auto p-1 text-[#888] transition-colors hover:text-ink"
                  title="Add bounty"
                >
                  <Plus size={12} />
                </button>
              ) : (
                <span className="ml-auto font-['Space_Mono',monospace] text-[10px] text-[#888]">ACTIVE BOUNTIES FOR THIS PROJECT</span>
              )
            }
          >
            <BountiesSection
              bounties={p.bounties}
              isAdmin={isAdmin}
              addOpen={bountiesAddOpen}
              onAddOpenChange={setBountiesAddOpen}
              onDelete={(bountyId) =>
                deleteBounty(bountyId, {
                  onSuccess: () => showToast("Bounty removed.", "info"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              onCreate={(data) =>
                createBounty(data, {
                  onSuccess: () => showToast("Bounty created.", "success"),
                  onError: () => showToast("Action failed.", "error"),
                })
              }
              creating={creatingBounty}
            />
          </WindowCard>
        </div>

        {(user || commentsTotal > 0) && (
        <DiscussionSection
          user={user}
          isAdmin={isAdmin}
          comments={allComments}
          total={commentsTotal}
          onPost={(text) => {
            if (p.status !== ProductStatus.APPROVED) {
              showToast("Only approved launches can be commented on.", "error");
              return;
            }
            createComment({ text });
          }}
          onReply={(text, parentId) => {
            if (p.status !== ProductStatus.APPROVED) {
              showToast("Only approved launches can be commented on.", "error");
              return;
            }
            createComment({ text, parentId });
          }}
          onPin={(commentId, pinned) => pinComment({ commentId, pinned })}
          onDelete={isAdmin ? (commentId) => deleteComment(commentId) : undefined}
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          loadingMore={isFetchingNextPage}
        />
        )}

        {p.papers && p.papers.length > 0 && (
          <div className="mt-8 hidden">
            <WindowCard label="RESEARCH.SYS">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] uppercase tracking-[0.06em] text-[#888]">
                Research Backing This Product
              </div>
              {p.papers.map((paper) => (
                <div key={paper.id} className="flex items-center justify-between border-b border-b-[rgba(0,0,0,0.08)] py-2.5">
                  <span className="text-sm font-medium">{paper.title}</span>
                  <Link
                    href={`/research/${paper.slug}`}
                    className="font-['Space_Mono',monospace] text-[11px] text-[#185FA5] no-underline hover:underline"
                  >
                    ↗ View
                  </Link>
                </div>
              ))}
            </WindowCard>
          </div>
        )}

        {isAdmin && (
          <>
            <EditProductLogoDialog
              product={p}
              open={editLogoOpen}
              onOpenChange={setEditLogoOpen}
              uploadPending={uploadingLogo}
              deletePending={deletingLogo}
              onUpload={(file) =>
                uploadLogo(file, {
                  onSuccess: () => {
                    showToast("Logo updated.", "success");
                    setEditLogoOpen(false);
                  },
                  onError: () => showToast("Upload failed. Please try again.", "error"),
                })
              }
              onDelete={() =>
                deleteLogo(undefined, {
                  onSuccess: () => {
                    showToast("Logo removed.", "info");
                    setEditLogoOpen(false);
                  },
                  onError: () => showToast("Delete failed. Please try again.", "error"),
                })
              }
            />
            <EditProductInfoDialog
              product={p}
              open={editInfoOpen}
              onOpenChange={setEditInfoOpen}
              saving={updatingProduct}
              onSave={(data) =>
                updateProduct(
                  { id: p.id, data },
                  {
                    onSuccess: () => {
                      showToast("Product updated.", "success");
                      setEditInfoOpen(false);
                    },
                    onError: (err: Error) => showToast(err.message || "Update failed. Please try again.", "error"),
                  }
                )
              }
            />
            <EditProductLinksDialog
              product={p}
              open={editLinksOpen}
              onOpenChange={setEditLinksOpen}
              onCreateLink={(data) =>
                createLink(data, {
                  onSuccess: () => showToast("Link added.", "success"),
                  onError: () => showToast("Failed to add link.", "error"),
                })
              }
              onUpdateLink={(linkId, data) =>
                updateLink(
                  { linkId, data },
                  {
                    onSuccess: () => showToast("Link updated.", "success"),
                    onError: () => showToast("Failed to update link.", "error"),
                  }
                )
              }
              onDeleteLink={(linkId) =>
                deleteLink(linkId, {
                  onSuccess: () => showToast("Link removed.", "info"),
                  onError: () => showToast("Failed to remove link.", "error"),
                })
              }
              linkPending={linkPending}
            />
            <EditSimilarProductsDialog
              product={p}
              similarProducts={similarProducts ?? []}
              open={editSimilarOpen}
              onOpenChange={setEditSimilarOpen}
              saving={updatingSimilar}
              onSave={(similarProductIds) =>
                updateSimilarProducts(
                  { id: p.id, similarProductIds },
                  {
                    onSuccess: () => {
                      showToast("Similar products updated.", "success");
                      setEditSimilarOpen(false);
                    },
                    onError: (err: Error) => showToast(err.message || "Update failed. Please try again.", "error"),
                  }
                )
              }
            />
          </>
        )}

        {((similarProducts ?? []).length > 0 || isAdmin) && (
          <div className="mt-14 border-t border-t-[rgba(0,0,0,0.12)] pt-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="font-['Space_Mono',monospace] text-[11px] uppercase tracking-[0.08em] text-[#888]">›_ similar projects</div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setEditSimilarOpen(true)}
                  className="p-0.5 text-[#888] transition-colors hover:text-ink"
                  title="Edit similar products"
                >
                  <Pencil size={12} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {(similarProducts ?? []).map((s) => (
                <Link
                  key={s.id}
                  href={`/launch/${s.slug}`}
                  className="explore-card block rounded-xl border-2 border-[#1C1C27] bg-white p-[18px_22px] text-left text-inherit no-underline"
                >
                  <div className="mb-2.5 flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 rounded-lg overflow-visible border border-ink">
                      <AvatarImage src={s.logo ?? undefined} alt={s.name} className="size-full object-contain" />
                      <AvatarFallback className="rounded-lg border border-[#D8D4CC] bg-paper text-base font-bold">{s.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mb-0.75 text-[15px] font-bold">{s.name}</div>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {s.categories.map((c) => (
                      <ProductBadge key={c.id} label={c.name} />
                    ))}
                    {s.stage && <ProductBadge label={s.stage} type="stage" />}
                  </div>
                  <div className="text-xs text-muted">{s.shortDesc}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
