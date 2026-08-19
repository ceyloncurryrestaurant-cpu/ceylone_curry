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

      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 sm:h-80 bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : offerProducts.length === 0 ? (
        <div className="bg-[#FAF7F2] rounded-3xl p-16 text-center border-2 border-gray-200 max-w-md mx-auto space-y-3 shadow-md text-[#071B5C]">
          <p className="font-serif-display font-bold text-2xl">No Active Daily Offers</p>
          <p className="text-xs text-gray-600">Check back soon for new daily specials and discounts, or explore our full menu catalog.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-8">
          {offerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
