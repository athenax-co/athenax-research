"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AUTH_QUERY_KEYS, useLogout, useSession } from "@/hooks/useAuth";
import { REFERENCE_QUERY_KEYS } from "@/hooks/useReference";
import { getCategories } from "@/api/reference";
import Navbar from "./Navbar";
import Toast from "./ui/Toast";
import LoginModal from "./ui/LoginModal";
import RegisterModal from "./ui/RegisterModal";
import CategoryPickerModal from "./ui/CategoryPickerModal";
import { usePathname, useRouter } from "next/navigation";

// ─── singleton QueryClient ────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

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
export let _globalShowToast = (text: string, type: string) => {};

// ─── inner provider (needs QueryClient in scope) ──────────────────────────────

function InnerProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [selectedLab, setSelectedLab] = useState<any>(null);

  const pathname = usePathname();
  const router = useRouter();

  // ── prefetch reference data ───────────────────────────────────────────────
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: REFERENCE_QUERY_KEYS.categories,
      queryFn: getCategories,
      staleTime: 10 * 60 * 1000,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const removeToast = (id: string) =>
    setToasts((t) => t.filter((x) => x.id !== id));

  // ── auth click dispatcher ─────────────────────────────────────────────────
  const handleAuthClick = (action: string) => {
    if (action === "login") { setShowLogin(true); return; }
    if (action === "register") { setShowRegister(true); return; }
    if (action === "logout") { logoutMutate(); return; }
  };

  // Called by modals when login/signup succeeds so the UI updates instantly
  const handleAuthSuccess = (user: any) => {
    setUserOverride(user);
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser: setUserOverride,
        showToast,
        handleAuthClick,
        selectedLab,
        setSelectedLab,
      }}
    >
      <div style={{ minHeight: "100vh", background: "#F2EFE9" }}>
        <Navbar current={pathname} user={user} onAuthClick={handleAuthClick} />
        {children}
      </div>
      <div className="toast-wrap">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      {showLogin && (
        <LoginModal
          open={showLogin}
          onOpenChange={setShowLogin}
          onSuccess={handleAuthSuccess}
          showToast={showToast}
        />
      )}
      {showRegister && (
        <RegisterModal
          open={showRegister}
          onOpenChange={setShowRegister}
          onSuccess={handleAuthSuccess}
          showToast={showToast}
        />
      )}
      {showCategoryPicker && sessionUser?.id && (
        <CategoryPickerModal
          open={showCategoryPicker}
          userId={sessionUser.id}
          onDone={() => { setShowCategoryPicker(false); router.push("/"); }}
        />
      )}
    </GlobalContext.Provider>
  );
}

// ─── public export ────────────────────────────────────────────────────────────

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerProvider>{children}</InnerProvider>
    </QueryClientProvider>
  );
}
