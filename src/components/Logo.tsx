"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "light" | "dark" | "watermark";
  size?: "sm" | "md" | "lg" | "watermark";
  showDivider?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ variant = "light", size = "md", showDivider = false }) => {
  if (variant === "watermark") {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0 overflow-hidden select-none">
        <Image
          src="/logo.png"
          alt="Ceylon Curry Watermark"
          width={600}
          height={690}
          className="object-contain"
        />
      </div>
    );
  }

  // Sleek, compact circle outline dimensions so navbar stays slim, elegant & perfectly proportioned
  const frameSizeClasses = {
    sm: "w-9 h-9 p-1",
    md: "w-11 h-11 sm:w-13 sm:h-13 p-1.5",
    lg: "w-16 h-16 sm:w-20 sm:h-20 p-2",
    watermark: "w-28 h-28 p-3",
  };

  const textTitleClasses = {
    sm: "text-base font-black",
    md: "text-lg sm:text-xl font-extrabold",
    lg: "text-2xl sm:text-3xl font-black",
    watermark: "text-3xl font-black",
  };

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform duration-300 transform hover:scale-105">
        {/* Sleek Golden Outline Circle — Crisp White Background */}
        <div className={`relative rounded-full border-2 border-ceylon-gold bg-white shadow-sm flex items-center justify-center shrink-0 transition-all group-hover:shadow-[0_0_12px_rgba(245,185,26,0.5)] ${frameSizeClasses[size]}`}>
          <Image
            src="/logo.png"
            alt="Ceylon Curry Logo"
            width={120}
            height={120}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        {/* Hotel Name Only — Next to Logo */}
        <span
          className={`font-serif-display tracking-tight leading-none transition-colors ${
            variant === "light" ? "text-white group-hover:text-ceylon-gold" : "text-[#071B5C] group-hover:text-[#0A2472]"
          } ${textTitleClasses[size]}`}
        >
          Ceylon Curry
        </span>
      </Link>

      {showDivider && (
        <div className="flex items-center gap-3 mt-3 opacity-80">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-ceylon-gold" />
          <span className="text-ceylon-gold text-xs">✦</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-ceylon-gold" />
        </div>
      )}
    </div>
  );
};
