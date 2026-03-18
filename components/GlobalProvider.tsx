"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authSvc, initDB } from "@/lib/db-helper";
import { getArticles, getResearch, sortByPublishedAtDesc } from "@/lib/api";
import Navbar from "./Navbar";
import Toast from "./ui/Toast";
import LoginModal from "./ui/LoginModal";
import RegisterModal from "./ui/RegisterModal";
import { usePathname, useRouter } from "next/navigation";

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
  articles: any[];
  research: any[];
  archiveLoading: boolean;
  archiveError: string;
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

// Global toast ref — lets Footer call showToast without prop drilling
export let _globalShowToast = (text: string, type: string) => {};

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [articles, setArticles] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(true);
  const [archiveError, setArchiveError] = useState("");
  const [selectedLab, setSelectedLab] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    const loadArchive = async () => {
      setArchiveLoading(true);
      setArchiveError("");
      try {
        const [articleItems, researchItems] = await Promise.all([getArticles(), getResearch()]);
        if (!mounted) return;
        setArticles(sortByPublishedAtDesc(articleItems as any));
        setResearch(sortByPublishedAtDesc(researchItems as any));
      } catch (err) {
        if (!mounted) return;
        setArchiveError("Could not load archive content right now.");
      } finally {
        if (mounted) setArchiveLoading(false);
      }
    };
    loadArchive();

    initDB();
    const session = authSvc.getSession();
    if (session) setUser(session);
  }, []);

  const showToast = (text: string, type: string = "info") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, text, type }]);
  };

  useEffect(() => {
    _globalShowToast = showToast;
  }, [toasts]);

  const removeToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const handleLogout = () => {
    authSvc.logout();
    setUser(null);
    showToast("Signed out.", "info");
    router.push("/");
  };

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
      handleLogout();
      return;
    }
  };

  return (
    <GlobalContext.Provider
      value={{ user, setUser, showToast, handleAuthClick, articles, research, archiveLoading, archiveError, selectedLab, setSelectedLab }}
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
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={setUser} showToast={showToast} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={setUser} showToast={showToast} />}
    </GlobalContext.Provider>
  );
}
