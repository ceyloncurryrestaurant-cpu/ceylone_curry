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
    async function checkAuth() {
      if (isLoginPage) {
        setChecking(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setChecking(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <SettingsProvider>
        {children}
        <Toaster position="top-right" richColors />
      </SettingsProvider>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-ceylon-volcanic flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-ceylon-copper border-t-transparent rounded-full shadow-copper" />
      </div>
    );
  }

  return (
    <SettingsProvider>
      <div className="min-h-screen flex bg-ceylon-volcanic text-ceylon-ivory relative">
        <div className="grain-overlay" />
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen bg-ceylon-volcanic text-ceylon-ivory relative z-10">{children}</main>
        <Toaster position="top-right" richColors />
      </div>
    </SettingsProvider>
  );
}
