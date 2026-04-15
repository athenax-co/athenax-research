import { useEffect } from "react";
import { cn } from "@/utils/lib";

const dotColor = {
  success: "text-[#4caf50]",
  error: "text-[#e8323c]",
  info: "text-[#f5d94e]",
} as const;

const Toast = ({ msg, onClose }: { msg: any; onClose: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="toast-slide-in flex items-center gap-3 bg-ink text-white rounded-[10px] px-4.5 py-3.25 text-sm font-medium shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
      <span className={cn(dotColor[msg.type as keyof typeof dotColor] ?? "text-yellow")}>●</span>
      <span>{msg.text}</span>
      <button
        onClick={onClose}
        className="ml-auto bg-transparent border-none text-white cursor-pointer text-base leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;