"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Edit, Flame } from "lucide-react";

export default function AdminOffersPage() {
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/products?isOffer=true");
      const data = await res.json();
      if (data.success) setOfferProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#071B5C]">
            Daily Offers Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-light">
            Active special offer dishes currently displayed on the homepage & daily deals showcase.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white transition-all shadow-gold"
        >
          Manage Product Offers
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-md">
          <div className="animate-spin w-8 h-8 border-4 border-[#071B5C] border-t-transparent rounded-full mx-auto" />
        </div>
      ) : offerProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 border border-gray-200 shadow-md text-[#071B5C]">
          <p className="font-serif-display font-bold text-[#071B5C] text-xl">No Active Daily Offers</p>
          <p className="text-xs text-gray-500 font-light">Go to Products to enable Daily Special Offers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerProducts.map((p) => (
            <div key={p._id} className="bg-white rounded-3xl p-5 shadow-md border border-gray-200 flex gap-4 text-[#071B5C]">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <Image
                  src={p.images && p.images[0]?.url ? p.images[0].url : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80"}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-[#071B5C] text-sm">{p.name}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif-display font-black text-[#071B5C] text-lg">£{p.offerPrice?.toFixed(2)}</span>
                  <span className="text-xs text-gray-400 line-through">£{p.price.toFixed(2)}</span>
                  <span className="text-[10px] font-bold text-ceylon-red uppercase">
                    {p.discountPercentage}% OFF
                  </span>
                </div>
                <Link
                  href="/admin/products"
                  className="text-xs font-bold text-[#071B5C] hover:text-ceylon-gold inline-flex items-center gap-1 pt-1 transition-colors"
                >
                  <Edit className="w-3 h-3" /> Edit Offer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
