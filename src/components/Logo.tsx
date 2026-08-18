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

  const heightClasses = {
    sm: "h-11 w-auto",
    md: "h-14 w-auto",
    lg: "h-20 w-auto",
    watermark: "h-36 w-auto",
  };

  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="inline-flex items-center group transition-transform duration-300 transform hover:scale-105">
        <Image
          src="/logo.png"
          alt="Ceylon Curry Official Logo"
          width={180}
          height={207}
          priority
          className={`${heightClasses[size]} object-contain drop-shadow-md transition-transform duration-300`}
        />
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
