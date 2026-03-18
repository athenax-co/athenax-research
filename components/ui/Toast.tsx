import { useEffect } from "react";

const Toast = ({ msg, onClose }: { msg: any; onClose: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  const icon = msg.type === "success" ? "●" : msg.type === "error" ? "●" : "●";
  return (
    <div className={`toast toast-${msg.type}`}>
      <span className="toast-dot">{icon}</span>
      <span>{msg.text}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: "auto", background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;