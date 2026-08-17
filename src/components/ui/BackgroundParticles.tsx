"use client";

import React from "react";

export const BackgroundParticles: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Radial Glow Spotlights */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-ceylon-gold/10 rounded-full blur-[140px] animate-ambient-pulse" />
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-ceylon-cinnamon/10 rounded-full blur-[150px] animate-ambient-pulse [animation-delay:3s]" />
      <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-ceylon-blue-vibrant/15 rounded-full blur-[160px] animate-ambient-pulse [animation-delay:5s]" />

      {/* Floating Gold & Spice Sparkles */}
      <div className="absolute top-[12%] left-[8%] w-2.5 h-2.5 rounded-full bg-ceylon-gold/40 blur-[1px] animate-float-slow" />
      <div className="absolute top-[28%] right-[12%] w-3 h-3 rounded-full bg-ceylon-gold/30 blur-[1px] animate-float-slow [animation-delay:2s]" />
      <div className="absolute top-[45%] left-[20%] w-2 h-2 rounded-full bg-ceylon-cinnamon/40 blur-[1px] animate-float-slow [animation-delay:4s]" />
      <div className="absolute top-[68%] right-[22%] w-3.5 h-3.5 rounded-full bg-ceylon-gold/35 blur-[1.5px] animate-float-slow [animation-delay:1s]" />
      <div className="absolute top-[82%] left-[15%] w-2 h-2 rounded-full bg-ceylon-gold/40 blur-[1px] animate-float-slow [animation-delay:3.5s]" />

      {/* Luxury Subtle Gold Micro Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#F4C430_1.5px,transparent_1.5px)] [background-size:28px_28px]" />
    </div>
  );
};
