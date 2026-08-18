"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowRight, Sparkles, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/Toast";

interface OfferItem {
  _id: string;
  title: string;
  description: string;
  image?: { url: string } | string;
  discountPercentage?: number;
  originalPrice?: number;
  offerPrice?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

interface OfferCarouselProps {
  offers: OfferItem[];
}

export const OfferCarousel: React.FC<OfferCarouselProps> = ({ offers }) => {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Active valid offers filter
  const activeOffers = offers.filter((o) => {
    if (o.isActive === false) return false;
    const now = new Date();
    if (o.startDate && new Date(o.startDate) > now) return false;
    if (o.endDate && new Date(o.endDate) < now) return false;
    return true;
  });

  // Auto rotate every 5000ms (5 seconds)
  useEffect(() => {
    if (activeOffers.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeOffers.length, isPaused]);

  if (activeOffers.length === 0) return null;

  const currentOffer = activeOffers[currentIndex] || activeOffers[0];
  const offerImg = typeof currentOffer.image === "object" && currentOffer.image?.url
    ? currentOffer.image.url
    : typeof currentOffer.image === "string"
    ? currentOffer.image
    : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80";

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeOffers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeOffers.length) % activeOffers.length);
  };

  const handleAddToCart = () => {
    if (currentOffer.offerPrice) {
      addToCart({
        id: currentOffer._id,
        name: currentOffer.title,
        price: currentOffer.offerPrice,
        image: offerImg,
      });
      toast.success(`${currentOffer.title} added to order!`);
    }
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-ceylon-navy text-white border-4 border-ceylon-gold shadow-navy"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12">
        {/* Left: Offer Details */}
        <div className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ceylon-red text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
            <Flame className="w-4 h-4 fill-current text-ceylon-gold" />
            <span>TODAY'S CEYLON SPECIAL</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {currentOffer.title}
            </h2>
            <p className="text-ceylon-cream/90 text-sm font-light leading-relaxed">
              {currentOffer.description}
            </p>
          </div>

          {/* Pricing Highlight */}
          <div className="flex items-baseline gap-4 pt-2">
            {currentOffer.discountPercentage && (
              <span className="font-serif-display text-4xl sm:text-5xl font-extrabold text-ceylon-gold gold-text-glow">
                {currentOffer.discountPercentage}% OFF
              </span>
            )}
            {currentOffer.offerPrice && (
              <div className="flex items-baseline gap-2">
                <span className="font-serif-display text-2xl font-bold text-white">
                  £{currentOffer.offerPrice.toFixed(2)}
                </span>
                {currentOffer.originalPrice && currentOffer.originalPrice > currentOffer.offerPrice && (
                  <span className="text-sm text-gray-400 line-through font-semibold">
                    £{currentOffer.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {currentOffer.offerPrice ? (
              <button
                onClick={handleAddToCart}
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all shadow-gold transform hover:-translate-y-0.5"
              >
                Claim Offer & Order Now
              </button>
            ) : (
              <Link
                href="/offers"
                className="px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all shadow-gold transform hover:-translate-y-0.5"
              >
                View Offer Details
              </Link>
            )}

            <Link
              href="/offers"
              className="px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white hover:text-ceylon-gold transition-colors inline-flex items-center gap-1.5"
            >
              <span>All Offers ({activeOffers.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Large Food Photography */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-ceylon-gold/40 shadow-2xl bg-ceylon-blue-deep">
          <Image
            src={offerImg}
            alt={currentOffer.title}
            fill
            priority
            className="object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-transparent to-transparent opacity-60" />
        </div>
      </div>

      {/* Manual Navigation Controls & Auto-rotate Indicators */}
      {activeOffers.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-between items-center px-8">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark text-white transition-all border border-white/20"
              title="Previous Offer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark text-white transition-all border border-white/20"
              title="Next Offer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {activeOffers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-ceylon-gold shadow-gold"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to offer ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
