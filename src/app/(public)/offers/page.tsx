"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Tag, Sparkles } from "lucide-react";

export default function OffersPage() {
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/products?isOffer=true");
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
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-16 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-ceylon-chilli text-white text-xs font-black uppercase tracking-widest rounded-full animate-pulse shadow-lg">
          <Tag className="w-4 h-4" />
          <span>EXCLUSIVE DAILY SAVINGS</span>
        </div>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory leading-tight">
          Chef's Special <span className="text-ceylon-copper copper-text-glow">Offers</span>
        </h1>
        <p className="text-ceylon-sandstone text-sm sm:text-base font-light">
          Save on our signature Sri Lankan curries and house specialties with exclusive daily savings.
        </p>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-ceylon-cocoa/50 rounded-3xl animate-pulse border border-ceylon-copper/20" />
          ))}
        </div>
      ) : offerProducts.length === 0 ? (
        <div className="glass-cocoa rounded-3xl p-16 text-center border-2 border-ceylon-copper/30 max-w-md mx-auto space-y-3 shadow-volcanic">
          <p className="font-serif-display font-bold text-ceylon-ivory text-2xl">No Active Daily Offers</p>
          <p className="text-xs text-ceylon-sandstone">Check back soon for new daily specials and discounts, or explore our full menu catalog.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
