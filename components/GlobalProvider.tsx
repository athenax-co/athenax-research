"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { QueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, useLogout, useSession } from "@/hooks/queries/useAuth";
import Toast from "./ui/Toast";
import LoginModal from "./ui/LoginModal";
import RegisterModal from "./ui/RegisterModal";
import CategoryPickerModal from "./ui/CategoryPickerModal";
import { SubmitProductModal, SubmitProductSuccessModal } from "./SubmitProductModal";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();

// ─── context ──────────────────────────────────────────────────────────────────

type ToastItem = {
  id: string;
  text: string;
  type: string;
};

type GlobalContextType = {
  user: any;
  setUser: (user: any) => void;
  showToast: (text: string, type?: string) => void;
  handleAuthClick: (action: string) => void;
  selectedLab: any;
  setSelectedLab: (lab: any) => void;
  submitProductOpen: boolean;
  setSubmitProductOpen: (open: boolean) => void;
  showSubmitProductSuccess: (productName: string) => void;
  openSubmitProductModal: () => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
}

// Global toast ref — lets Footer / non-component code call showToast
export let _globalShowToast: (text: string, type: string) => void = () => {};

// ─── inner provider (needs QueryClient in scope) ──────────────────────────────

function InnerProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [submitProductOpen, setSubmitProductOpen] = useState(false);
  const [submitProductSuccessOpen, setSubmitProductSuccessOpen] = useState(false);
  const [submitProductSuccessName, setSubmitProductSuccessName] = useState("");
  const [selectedLab, setSelectedLab] = useState<any>(null);

  const router = useRouter();

  // ── session ──────────────────────────────────────────────────────────────
  const { data: sessionUser } = useSession();

  // Allow manual override (e.g. after modal login resolves before session refetch)
  const [userOverride, setUserOverride] = useState<any>(undefined);
  const user = userOverride !== undefined ? userOverride : (sessionUser ?? null);

  // ── show category picker once after email verification ───────────────────
  useEffect(() => {
    if (sessionUser?.verified && sessionUser?.categories?.length === 0) {
      setShowCategoryPicker(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id, sessionUser?.verified]);

  // ── logout mutation ───────────────────────────────────────────────────────
  const { mutate: logoutMutate } = useLogout({
    onSuccess: () => {
      setUserOverride(null);
      showToast("Signed out.", "info");
      router.push("/");
    },
    onError: () => {
      // Even if the server call fails, clear local state
      setUserOverride(null);
      queryClient.setQueryData(AUTH_QUERY_KEYS.session, null);
      showToast("Signed out.", "info");
      router.push("/");
    },
  });

  // ── toasts ────────────────────────────────────────────────────────────────
  const showToast = (text: string, type: string = "info") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, text, type }]);
  };

  useEffect(() => {
    _globalShowToast = showToast;
  }, [toasts]);

  const removeToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  // ── auth click dispatcher ─────────────────────────────────────────────────
  const handleAuthClick = (action: string) => {
    if (action === "login") {
      setShowLogin(true);
      return;
    }
    if (action === "register") {
      setShowRegister(true);
      return;
    }
    if (action === "logout") {
      logoutMutate();
      return;
    }
  };

  // Called by modals when login/signup succeeds so the UI updates instantly
  const handleAuthSuccess = (user: any) => {
    setUserOverride(user);
  };

  // Show submit product success modal
  const showSubmitProductSuccess = (productName: string) => {
    setSubmitProductSuccessName(productName);
    setSubmitProductSuccessOpen(true);
  };

  // Open submit product modal with auth check
  const openSubmitProductModal = useCallback(() => {
    if (!user) {
      if (showLogin) return;
      showToast("Please log in to submit a product", "info");
      setShowLogin(true);
      return;
    }
    if (submitProductOpen) return;
    setSubmitProductOpen(true);
  }, [user, showLogin, submitProductOpen]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser: setUserOverride,
        showToast,
        handleAuthClick,
        selectedLab,
        setSelectedLab,
        submitProductOpen,
        setSubmitProductOpen,
        showSubmitProductSuccess,
        openSubmitProductModal,
      }}
    >
      <div style={{ minHeight: "100vh", background: "#F2EFE9" }}>{children}</div>
      <div className="toast-wrap">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      {showLogin && <LoginModal open={showLogin} onOpenChange={setShowLogin} onSuccess={handleAuthSuccess} showToast={showToast} />}
      {showRegister && <RegisterModal open={showRegister} onOpenChange={setShowRegister} onSuccess={handleAuthSuccess} showToast={showToast} />}
      {showCategoryPicker && sessionUser?.id && (
        <CategoryPickerModal
          open={showCategoryPicker}
          userId={sessionUser.id}
          onDone={() => {
            setShowCategoryPicker(false);
            router.push("/");
          }}
        />
      )}
      <SubmitProductModal open={submitProductOpen} onOpenChange={setSubmitProductOpen} />
      <SubmitProductSuccessModal open={submitProductSuccessOpen} onOpenChange={setSubmitProductSuccessOpen} productName={submitProductSuccessName} />
    </GlobalContext.Provider>
  );
}

// ─── public export ────────────────────────────────────────────────────────────

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
      <InnerProvider>{children}</InnerProvider>
  );
}
