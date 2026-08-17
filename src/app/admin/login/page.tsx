"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Lock, Mail, KeyRound, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Admin login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error(data.error || "Invalid credentials.");
      }
    } catch (err) {
      toast.error("Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ceylon-volcanic flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-ceylon-ivory">
      <div className="grain-overlay" />

      <div className="max-w-md w-full space-y-8 relative z-10 glass-cocoa p-8 sm:p-10 rounded-[2.5rem] border-2 border-ceylon-copper/40 shadow-volcanic">
        <div className="text-center space-y-4">
          <Logo variant="light" size="lg" showDivider />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ceylon-copper block pt-2">
            ADMINISTRATOR PORTAL ACCESS
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 pt-4">
          <div>
            <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ceylon-copper absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ceyloncurry.co.uk"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ceylon-volcanic border border-ceylon-copper/40 text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-ceylon-copper absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ceylon-volcanic border border-ceylon-copper/40 text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Login to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-ceylon-sandstone text-center pt-2 font-light">
          Ceylon Curry Digital Management System • Restricted Access
        </div>
      </div>
    </div>
  );
}
