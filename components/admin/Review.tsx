import Modal from "@/components/ui/Modal";
import { useUpdatePaperVerificationStatus } from "@/hooks/queries/usePaper";
import { useGlobal } from "@/components/GlobalProvider";
import { PaperVerificationStatus } from "@/enums";
import type { PaperOut } from "@/types/paper";

type Props = {
  paper: PaperOut;
  onClose: () => void;
};

export default function PaperReviewDialog({ paper, onClose }: Props) {
  const { showToast } = useGlobal();
  const { mutate: updateVerification, isPending } = useUpdatePaperVerificationStatus();

  const handle = (status: PaperVerificationStatus) => {
    updateVerification(
      { id: paper.id, verificationStatus: status },
      {
        onSuccess: () => {
          showToast(
            `${status === PaperVerificationStatus.APPROVED ? "Approved" : "Rejected"}: ${paper.title.slice(0, 40)}`,
            status === PaperVerificationStatus.APPROVED ? "success" : "info"
          );
          onClose();
        },
      }
    );
  };

  return (
    <Modal title="PAPER_REVIEW.SYS" onClose={onClose}>
      <div className="mb-4">
        <div className="mb-3 flex flex-wrap items-start gap-2">
          <h2 className="mb-0 text-[20px] leading-snug">{paper.title}</h2>
          {paper.categories.map((c) => (
            <span key={c.id} className="topic-pill shrink-0">
              {c.name}
            </span>
          ))}
        </div>

        {paper.abstract && (
          <p className="mb-4 text-[13px] leading-[1.65] text-muted">{paper.abstract}</p>
        )}

        <div className="mb-3 grid grid-cols-3 gap-2.5">
          {[
            { label: "Source", value: paper.sourceType },
            { label: "Votes", value: String(paper.voteCount) },
            { label: "Submitted", value: new Date(paper.createdAt).toLocaleDateString("en-CA") },
          ].map((item) => (
            <div key={item.label} className="stat-card">
              <div className="stat-label">{item.label}</div>
              <div className="stat-value text-[15px]">{item.value}</div>
            </div>
          ))}
        </div>

        {[
          { label: "External URL", value: paper.externalUrl ?? "None" },
          { label: "Publish Status", value: paper.status },
          { label: "Verification", value: paper.verificationStatus },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
            <span className="text-[12px] font-semibold text-muted">{item.label}</span>
            <span className="font-['Space_Mono',monospace] text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-t border-[#D8D4CC] pt-3">
        <button
          className="btn btn-primary flex-1 justify-center"
          onClick={() => handle(PaperVerificationStatus.APPROVED)}
          disabled={isPending}
        >
          {isPending ? <span className="spinner" /> : "✓ Approve"}
        </button>
        <button
          className="btn btn-outline flex-1 justify-center"
          onClick={() => handle(PaperVerificationStatus.REJECTED)}
          disabled={isPending}
        >
          {isPending ? <span className="spinner" /> : "✗ Reject"}
        </button>
      </div>
    </Modal>
  );
}
