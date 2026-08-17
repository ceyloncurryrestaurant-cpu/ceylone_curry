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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none overflow-hidden z-0">
        <div className="relative w-[550px] h-[500px]">
          <Image
            src="/logo.jpg"
            alt="Ceylon Curry Watermark"
            fill
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  const heightClasses = {
    sm: "h-11 w-auto",
    md: "h-14 w-auto",
    lg: "h-20 w-auto",
    watermark: "h-36 w-auto",
  };

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="inline-flex items-center group transition-all duration-300">
        {/* Exact Official Logo Image (Cropped without Address & Phone Number) */}
        <div className="relative rounded-2xl overflow-hidden shadow-gold border-2 border-ceylon-gold/50 group-hover:scale-105 group-hover:shadow-gold-lg transition-all duration-500 bg-[#020E66]">
          <Image
            src="/logo.jpg"
            alt="Ceylon Curry Official Logo"
            width={180}
            height={165}
            priority
            className={`${heightClasses[size]} object-contain transition-transform duration-500 group-hover:scale-105`}
          />
        </div>
      </Link>

      {/* Decorative Gold Accent Divider Line */}
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
