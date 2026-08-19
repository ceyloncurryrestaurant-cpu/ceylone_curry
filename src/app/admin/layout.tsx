"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "@/components/ui/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

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
      <div className="min-h-screen flex bg-[#FAF7F2] text-[#071B5C] relative">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen bg-[#FAF7F2] text-[#071B5C] relative z-10">
          {children}
        </main>
        <Toaster position="top-right" richColors />
      </div>
    </SettingsProvider>
  );
}
