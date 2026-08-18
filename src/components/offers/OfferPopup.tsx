"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Flame, ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
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

export const OfferPopup: React.FC = () => {
  const { addToCart } = useCart();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const popupClosed = sessionStorage.getItem("ceylon_popup_closed");
    if (popupClosed) return;

    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        if (data.success && data.offers) {
          const now = new Date();
          const valid = data.offers.filter((o: OfferItem) => {
            if (o.isActive === false) return false;
            if (o.startDate && new Date(o.startDate) > now) return false;
            if (o.endDate && new Date(o.endDate) < now) return false;
            return true;
          });

          if (valid.length > 0) {
            setOffers(valid);
            // Delay 1 second before showing popup
            setTimeout(() => setVisible(true), 1000);
          }
        }
      } catch (err) {
        console.error("Error fetching offer popup:", err);
      }
    }

    fetchOffers();
  }, []);

  // Rotate between multiple active offers every 5000ms
  useEffect(() => {
    if (!visible || offers.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [visible, offers.length]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("ceylon_popup_closed", "true");
  };

  if (!visible || offers.length === 0) return null;

  const currentOffer = offers[currentIndex] || offers[0];
  const offerImg = typeof currentOffer.image === "object" && currentOffer.image?.url
    ? currentOffer.image.url
    : typeof currentOffer.image === "string"
    ? currentOffer.image
    : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="fixed inset-0 z-[9999] bg-ceylon-dark/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="relative max-w-lg w-full rounded-3xl overflow-hidden bg-ceylon-navy text-white border-4 border-ceylon-gold shadow-navy p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark text-white transition-all border border-white/20"
          aria-label="Close offer popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Limited Time Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ceylon-red text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
          <Flame className="w-4 h-4 fill-current text-ceylon-gold" />
          <span>LIMITED TIME SPECIAL OFFER ({currentIndex + 1}/{offers.length})</span>
        </div>

        {/* Large Food Photography */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-ceylon-gold/40 shadow-xl bg-ceylon-blue-deep">
          <Image src={offerImg} alt={currentOffer.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-transparent to-transparent opacity-70" />
        </div>

        {/* Offer Info */}
        <div className="space-y-2 text-center">
          <h3 className="font-serif-display text-2xl font-extrabold text-white">
            {currentOffer.title}
          </h3>
          <p className="text-xs text-ceylon-cream/90 font-light leading-relaxed">
            {currentOffer.description}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {currentOffer.discountPercentage && (
              <span className="font-serif-display text-3xl font-extrabold text-ceylon-gold gold-text-glow">
                {currentOffer.discountPercentage}% OFF
              </span>
            )}
            {currentOffer.offerPrice && (
              <span className="font-serif-display text-xl font-bold text-white">
                £{currentOffer.offerPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/offers"
            onClick={handleClose}
            className="flex-1 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs tracking-wider text-center border border-white/20"
          >
            View All Offers
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
