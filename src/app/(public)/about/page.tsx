"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Sparkles, Utensils, Award, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden space-y-16">
      {/* HERO BANNER */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-volcanic bg-ceylon-cocoa text-ceylon-ivory p-8 sm:p-16 text-center border-2 border-ceylon-copper/40">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
            alt="Ceylon Curry Restaurant Story"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-ceylon-cocoa/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-saffron" />
            OUR CULINARY JOURNEY
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-ceylon-ivory leading-tight">
            The Story of Ceylon Curry
          </h1>
          <p className="text-ceylon-sandstone text-xs sm:text-sm font-light leading-relaxed">
            Bringing authentic Sri Lankan spices, family recipes, and island hospitality to the heart of Plymouth.
          </p>
        </div>
      </div>

      {/* HERITAGE STORY & INGREDIENTS */}
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">TRADITION & PASSION</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-black text-ceylon-ivory">
              Crafted with Hand-Roasted Spices
            </h2>
            <p className="text-ceylon-sandstone text-sm sm:text-base leading-relaxed font-light">
              At Ceylon Curry, every curry powder is hand-roasted in small batches using coriander, cumin, fennel, and Ceylon black pepper. We honor traditional techniques passed down through generations of Sri Lankan home cooks.
            </p>
            <p className="text-ceylon-sandstone text-sm sm:text-base leading-relaxed font-light">
              Our signature Kottu Roti is prepared live on a hot flat iron griddle, shredding fresh paratha with vegetables, eggs, and aromatic curry sauce for an unmatchable sensory experience.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-ceylon-copper/40 shadow-volcanic">
            <Image
              src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80"
              alt="Jaffna Spiced Curry Cooking"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-cocoa p-10 sm:p-14 rounded-[3rem] border-2 border-ceylon-copper/40 shadow-volcanic text-center space-y-6 text-ceylon-ivory max-w-4xl mx-auto">
          <h3 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-ceylon-ivory">Experience Ceylon Dining</h3>
          <p className="text-ceylon-sandstone text-xs sm:text-sm max-w-xl mx-auto font-light">
            Book your table or explore our menu to experience authentic Sri Lankan cuisine in Plymouth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/reserve"
              className="px-8 py-3.5 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper cursor-pointer"
            >
              Reserve a Table
            </Link>
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-full bg-ceylon-volcanic/80 text-ceylon-ivory border border-ceylon-copper/40 font-black uppercase text-xs tracking-widest hover:bg-ceylon-volcanic cursor-pointer"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
