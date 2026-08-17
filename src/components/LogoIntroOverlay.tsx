"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";

export const LogoIntroOverlay: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if intro has already played in this session
    const hasSeenIntro = sessionStorage.getItem("ceylon_intro_seen");
    if (hasSeenIntro) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setAnimatingOut(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem("ceylon_intro_seen", "true");
      }, 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-ceylon-midnight flex flex-col items-center justify-center transition-opacity duration-500 ${
        animatingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Animated Logo */}
        <div className="transform transition-transform duration-700 animate-fade-in scale-110">
          <Logo variant="light" size="lg" />
        </div>

        {/* Drawing Gold Line */}
        <div className="w-48 h-[2px] bg-ceylon-gold/30 relative overflow-hidden rounded-full mt-4">
          <div className="w-full h-full bg-ceylon-gold animate-draw-line" />
        </div>

        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ceylon-gold/80 animate-pulse pt-2">
          Authentic Ceylon Flavours
        </span>
      </div>
    </div>
  );
};
