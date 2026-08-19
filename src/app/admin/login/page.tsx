"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Lock, Mail, KeyRound, ArrowRight, X, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset Password Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setResetting] = useState(false);

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

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail || !newPassword) {
      toast.error("Please fill in email and new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setResetting(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: resetEmail,
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Admin password updated successfully!");
        setEmail(resetEmail);
        setIsResetModalOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Password reset failed.");
      }
    } catch (err) {
      toast.error("Reset error.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071B5C] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      <div className="max-w-md w-full space-y-8 relative z-10 bg-[#0E3094] p-8 sm:p-10 rounded-[2.5rem] border-2 border-white/20 shadow-2xl">
        <div className="text-center space-y-4">
          <Logo variant="light" size="lg" showDivider />
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ceylon-gold block pt-2">
            ADMINISTRATOR PORTAL ACCESS
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 pt-4">
          <div>
            <label className="text-xs font-bold text-ceylon-gold uppercase block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ceylon-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ceyloncurry.co.uk"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#071B5C] border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-ceylon-gold placeholder-blue-200/50"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-ceylon-gold uppercase block">Password</label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email || "admin@ceyloncurry.co.uk");
                  setIsResetModalOpen(true);
                }}
                className="text-[11px] text-ceylon-gold hover:underline font-bold cursor-pointer"
              >
                Reset Password?
              </button>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-ceylon-gold absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#071B5C] border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-ceylon-gold placeholder-blue-200/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase text-xs tracking-widest shadow-gold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Login to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-blue-200/80 text-center pt-2 font-light">
          Ceylon Curry Digital Management System • Restricted Access
        </div>
      </div>

      {/* Reset Admin Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071B5C]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E3094] border-2 border-white/20 rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/15">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-ceylon-gold block">SECURITY RECOVERY</span>
                <h3 className="font-serif-display font-extrabold text-xl text-white mt-0.5">
                  Reset Admin Password
                </h3>
              </div>
              <button onClick={() => setIsResetModalOpen(false)} className="text-white/70 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ceylon-gold uppercase mb-1">Registered Admin Email *</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@ceyloncurry.co.uk"
                  className="w-full px-4 py-3 rounded-2xl bg-[#071B5C] border border-white/20 text-white font-semibold focus:outline-none focus:border-ceylon-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-ceylon-gold uppercase mb-1">New Password (Min 6 chars) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#071B5C] border border-white/20 text-white font-semibold focus:outline-none focus:border-ceylon-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-ceylon-gold uppercase mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#071B5C] border border-white/20 text-white font-semibold focus:outline-none focus:border-ceylon-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={resetting}
                  className="w-full py-3.5 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase tracking-widest text-xs shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{resetting ? "Resetting Password..." : "Confirm Password Reset"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
