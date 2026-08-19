"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Flame, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface OfferItem {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  image?: { url: string } | string;
  images?: any[];
  discountPercentage?: number;
  originalPrice?: number;
  offerPrice?: number;
  price?: number;
  isActive?: boolean;
}

export const OfferPopup: React.FC = () => {
  const { addToCart } = useCart();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/products?isOffer=true", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setOffers(data.products);
          // Show popup ONLY after actual database offer products have loaded
          setTimeout(() => setVisible(true), 500);
        }
      } catch (err) {
        console.error("Error fetching offer popup products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  // Auto-rotate between all active offer products every 5000ms (5 seconds)
  useEffect(() => {
    if (!visible || offers.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [visible, offers.length]);

  const handleClose = () => {
    setVisible(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  if (loading || !visible || offers.length === 0) return null;

  const currentOffer = offers[currentIndex] || offers[0];

  // Extract image URL safely
  let offerImg = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";
  if (currentOffer.images && currentOffer.images.length > 0) {
    const firstImg = currentOffer.images[0];
    if (typeof firstImg === "string") offerImg = firstImg;
    else if (typeof firstImg === "object" && firstImg?.url) offerImg = firstImg.url;
  } else if (currentOffer.image) {
    if (typeof currentOffer.image === "string") offerImg = currentOffer.image;
    else if (typeof currentOffer.image === "object" && (currentOffer.image as any)?.url) offerImg = (currentOffer.image as any).url;
  }

  const offerTitle = currentOffer.name || currentOffer.title || "Ceylon Daily Special";
  const offerDesc = currentOffer.shortDescription || currentOffer.description || "Fresh Sri Lankan authentic specialty cooked daily.";
  const offerPriceVal = currentOffer.offerPrice ?? 11.00;
  const origPriceVal = currentOffer.originalPrice || currentOffer.price || 18.50;
  const discountVal = currentOffer.discountPercentage || (origPriceVal > offerPriceVal ? Math.round(((origPriceVal - offerPriceVal) / origPriceVal) * 100) : 0);

  return (
    <div className="fixed inset-0 z-[9999] bg-ceylon-dark/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-ceylon-navy text-white border-4 border-ceylon-gold shadow-navy p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark text-white transition-all border border-white/20 shadow-md cursor-pointer"
          aria-label="Close offer popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Limited Time Badge & Offer Index */}
        <div className="flex items-center justify-between gap-2 pr-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ceylon-red text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
            <Flame className="w-4 h-4 fill-current text-ceylon-gold" />
            <span>DAILY SPECIAL OFFER ({currentIndex + 1} OF {offers.length})</span>
          </div>
        </div>

        {/* Large Food Photography with Previous/Next controls */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-ceylon-gold/40 shadow-xl bg-ceylon-blue-deep group">
          <Image src={offerImg} alt={offerTitle} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-transparent to-transparent opacity-75" />

          {/* Navigation Controls inside photography */}
          {offers.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between z-10">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-ceylon-gold hover:text-ceylon-dark transition-all border border-white/20 cursor-pointer"
                title="Previous Offer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-ceylon-gold hover:text-ceylon-dark transition-all border border-white/20 cursor-pointer"
                title="Next Offer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Offer Info */}
        <div className="space-y-2 text-center">
          <h3 className="font-serif-display text-2xl font-extrabold text-white">
            {offerTitle}
          </h3>

          {/* High-Contrast Vibrant Gold/Amber Description Text */}
          <p className="text-sm text-amber-200/95 font-medium leading-relaxed drop-shadow-sm px-2">
            {offerDesc}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {discountVal > 0 && (
              <span className="font-serif-display text-3xl font-extrabold text-ceylon-gold gold-text-glow">
                {discountVal}% OFF
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-serif-display text-xl font-bold text-white">
                £{offerPriceVal.toFixed(2)}
              </span>
              {origPriceVal > offerPriceVal && (
                <span className="text-xs text-amber-100/60 line-through font-medium">
                  £{origPriceVal.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dot Indicators */}
        {offers.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {offers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-ceylon-gold shadow-gold" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to offer ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/offers"
            onClick={handleClose}
            className="flex-1 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs tracking-wider text-center border border-white/20"
          >
            View All Offers ({offers.length})
          </Link>
          <Link
            href="/menu"
            onClick={handleClose}
            className="flex-1 py-3.5 rounded-full bg-ceylon-gold hover:bg-ceylon-gold-saffron text-ceylon-dark font-black uppercase text-xs tracking-wider text-center shadow-gold"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};
