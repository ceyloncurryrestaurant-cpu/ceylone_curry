"use client";

import React, { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div
        className="fixed inset-0 bg-[#071B5C]/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white border-2 border-gray-200 rounded-[2.5rem] p-8 max-w-sm w-full space-y-6 text-center text-[#071B5C] shadow-2xl z-[10001] transform transition-all scale-100 duration-300 animate-fade-in">
        {/* Icon Header */}
        <div className="flex justify-center">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full ${
              variant === "danger"
                ? "bg-rose-50 border-2 border-rose-200 text-[#D92720]"
                : "bg-amber-50 border-2 border-amber-200 text-[#F5B91A]"
            }`}
          >
            {variant === "danger" ? (
              <Trash2 className="w-8 h-8 animate-pulse" />
            ) : (
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            )}
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h3 className="font-serif-display font-extrabold text-2xl text-[#071B5C] tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-gray-300 font-black text-xs uppercase tracking-widest text-[#071B5C] hover:bg-gray-50 transition-all cursor-pointer outline-none"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer outline-none ${
              variant === "danger"
                ? "bg-[#D92720] hover:bg-[#B01A14] shadow-rose-500/20"
                : "bg-[#F5B91A] hover:bg-[#D49D0E] shadow-gold/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
