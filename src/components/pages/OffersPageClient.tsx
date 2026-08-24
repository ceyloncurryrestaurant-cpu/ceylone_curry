"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Flame } from "lucide-react";

export function OffersPageClient() {
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/products?isOffer=true", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setOfferProducts(data.products);
        }
      } catch (err) {
        console.error("Error loading offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#071B5C] py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="bg-[#FAF7F2] p-10 sm:p-14 rounded-[3rem] border border-gray-200 shadow-md text-center max-w-4xl mx-auto space-y-4 text-[#071B5C]">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-ceylon-red text-white text-xs font-black uppercase tracking-widest rounded-full animate-pulse shadow-md">
          <Flame className="w-4 h-4" />
          <span>EXCLUSIVE DAILY SAVINGS</span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-[#071B5C] leading-tight">
          Chef's Special <span className="text-ceylon-gold">Offers</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base font-light max-w-xl mx-auto">
          Save on our signature Sri Lankan curries and house specialties with exclusive daily savings.
        </p>
      </div>

      {/* PARK & DINE BANNER */}
      <div className="max-w-4xl mx-auto bg-[#071B5C] rounded-[2.5rem] p-8 sm:p-12 text-white border-2 border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5B91A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="md:w-2/3 space-y-4 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ceylon-gold/10 border border-ceylon-gold/30 text-ceylon-gold text-xs uppercase font-extrabold tracking-widest">
            <span>🅿️</span>
            <span>PARK & DINE EXCLUSIVE</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Free Parking at Mayflower Street East Car Park!
          </h2>
          <p className="text-sm text-blue-100 font-light leading-relaxed">
            Visiting Plymouth City Centre? Park at the Mayflower Street East Car Park (PL1 1QJ) right near the restaurant. If you spend <span className="text-ceylon-gold font-bold">£50.00 or more</span> with us, we will fully reimburse your parking ticket! Simply present your ticket to our staff when dining or checking out.
          </p>
        </div>
        
        <div className="md:w-1/3 w-full flex flex-col items-center justify-center gap-3 relative z-10 shrink-0 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-ceylon-gold/10 text-ceylon-gold flex items-center justify-center text-4xl">
            🎁
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-ceylon-gold font-bold">SPEND £50+</p>
            <p className="text-lg font-black font-serif-display text-white">GET FREE PARKING</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 sm:h-80 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : offerProducts.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-3xl p-16 text-center border-2 border-gray-200 max-w-md mx-auto space-y-3 shadow-md text-[#071B5C]">
          <p className="font-serif-display font-bold text-2xl">No Active Daily Offers</p>
          <p className="text-xs text-gray-600">Check back soon for new daily specials and discounts, or explore our full menu catalog.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {offerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
