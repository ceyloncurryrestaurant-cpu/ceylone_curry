"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

type Listener = (toasts: ToastMessage[]) => void;
let toasts: ToastMessage[] = [];
let listeners: Listener[] = [];

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  success: (title: string, opts?: { description?: string }) => {
    const id = Math.random().toString(36).substring(7);
    toasts = [{ id, type: "success", title, description: opts?.description }, ...toasts.slice(0, 4)];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 4000);
  },
  error: (title: string, opts?: { description?: string }) => {
    const id = Math.random().toString(36).substring(7);
    toasts = [{ id, type: "error", title, description: opts?.description }, ...toasts.slice(0, 4)];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 5000);
  },
  info: (title: string, opts?: { description?: string }) => {
    const id = Math.random().toString(36).substring(7);
    toasts = [{ id, type: "info", title, description: opts?.description }, ...toasts.slice(0, 4)];
    notify();
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, 4000);
  },
};

export const Toaster: React.FC<{ position?: string; richColors?: boolean }> = () => {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    listeners.push(setActiveToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setActiveToasts);
    };
  }, []);

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {activeToasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-fade-in ${
            t.type === "success"
              ? "bg-ceylon-blue text-white border-ceylon-gold"
              : t.type === "error"
              ? "bg-ceylon-red text-white border-white/20"
              : "bg-ceylon-cream text-ceylon-blue border-ceylon-gold/40"
          }`}
        >
          {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-ceylon-gold shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />}
          {t.type === "info" && <Info className="w-5 h-5 text-ceylon-blue shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h4 className="font-bold text-sm leading-snug">{t.title}</h4>
            {t.description && <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{t.description}</p>}
          </div>

          <button
            onClick={() => {
              toasts = toasts.filter((item) => item.id !== t.id);
              notify();
            }}
            className="p-1 hover:opacity-70 text-xs opacity-60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
