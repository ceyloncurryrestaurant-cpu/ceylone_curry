"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "@/components/ui/Toast";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let isMounted = true;

    if (isLoginPage) {
      setChecking(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (isMounted) {
          if (data.authenticated) {
            setAuthenticated(true);
            setChecking(false);
          } else {
            router.replace("/admin/login");
          }
        }
      } catch (err) {
        if (isMounted) {
          router.replace("/admin/login");
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <SettingsProvider>
        {children}
        <Toaster position="top-right" richColors />
      </SettingsProvider>
    );
  }

  if (checking || !authenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#071B5C] border-t-transparent rounded-full shadow-md" />
      </div>
    );
  }

  return (
    <SettingsProvider>
      <div className="h-screen flex flex-col lg:flex-row bg-[#FAF7F2] text-[#071B5C] relative overflow-hidden">
        {/* Top Header for Mobile View */}
        <header className="lg:hidden bg-[#071B5C] text-white px-5 py-4 flex items-center justify-between border-b border-white/10 shadow-md shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open Sidebar Menu"
          >
            <Menu className="w-6 h-6 text-ceylon-gold" />
          </button>
          <span className="font-serif-display text-base font-extrabold uppercase tracking-wider text-white">
            Ceylon Curry Admin
          </span>
          <div className="w-10 h-10" /> {/* Balanced Spacer */}
        </header>

        {/* Sidebar Nav (Drawer on Mobile, Sidebar on Desktop) */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto bg-[#FAF7F2] text-[#071B5C] relative z-10">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </SettingsProvider>
  );
}
