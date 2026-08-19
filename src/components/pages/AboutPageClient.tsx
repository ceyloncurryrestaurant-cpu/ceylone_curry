"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AboutPageClient() {
  return (
    <div className="min-h-screen bg-white text-[#071B5C] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden space-y-16">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#071B5C] text-white p-8 sm:p-16 text-center border-2 border-white/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
            alt="Ceylon Curry Restaurant Story"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-[#071B5C]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-gold" />
            OUR CULINARY JOURNEY
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-white leading-tight">
            The Story of Ceylon Curry
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-light leading-relaxed">
            Bringing authentic Sri Lankan spices, family recipes, and island hospitality to the heart of Plymouth.
          </p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-8 sm:p-14 rounded-[3rem] border border-gray-200 shadow-md max-w-7xl mx-auto space-y-16 relative z-10 text-[#071B5C]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-[#071B5C]">TRADITION & PASSION</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-black text-[#071B5C]">
              Crafted with Hand-Roasted Spices
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light">
              At Ceylon Curry, every curry powder is hand-roasted in small batches using coriander, cumin, fennel, and Ceylon black pepper. We honor traditional techniques passed down through generations of Sri Lankan home cooks.
            </p>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light">
              Our signature Kottu Roti is prepared live on a hot flat iron griddle, shredding fresh paratha with vegetables, eggs, and aromatic curry sauce for an unmatchable sensory experience.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-gray-300 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80"
              alt="Jaffna Spiced Curry Cooking"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="bg-[#071B5C] text-white p-10 sm:p-14 rounded-[3rem] border-2 border-white/20 shadow-2xl text-center space-y-6 max-w-4xl mx-auto">
          <h3 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white">Experience Ceylon Dining</h3>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto font-light">
            Book your table or explore our menu to experience authentic Sri Lankan cuisine in Plymouth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="/reserve"
              className="px-8 py-3.5 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase text-xs tracking-widest shadow-gold cursor-pointer transition-all"
            >
              Reserve a Table
            </Link>
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-full bg-white/10 text-white border border-white/30 font-black uppercase text-xs tracking-widest hover:bg-white/20 cursor-pointer transition-all"
            >
              View Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
