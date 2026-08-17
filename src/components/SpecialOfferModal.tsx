"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Flame, ArrowRight, Sparkles } from "lucide-react";

export const SpecialOfferModal: React.FC = () => {
  const [offerProduct, setOfferProduct] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/products?isOffer=true");
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setOfferProduct(data.products[0]);
        } else {
          // Fallback offer if DB has no offers flagged yet
          setOfferProduct({
            _id: "default-offer",
            name: "Jaffna Roasted Lamb Curry & Kottu Combo",
            shortDescription: "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
            price: 18.90,
            offerPrice: 14.90,
            discountPercentage: 20,
            images: [
              { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }
            ],
          });
        }

        // Always open modal on site entry
        setIsOpen(true);
      } catch (err) {
        setOfferProduct({
          _id: "default-offer",
          name: "Jaffna Roasted Lamb Curry & Kottu Combo",
          shortDescription: "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
          price: 18.90,
          offerPrice: 14.90,
          discountPercentage: 20,
          images: [
            { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }
          ],
        });
        setIsOpen(true);
      }
    }

    const timer = setTimeout(fetchOffers, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  if (!offerProduct) return null;

  const mainImg =
    offerProduct.images && offerProduct.images[0]?.url
      ? offerProduct.images[0].url
      : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      {/* Floating Offer Badge Trigger (Allows re-opening anytime) */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[9990] px-4 py-2.5 rounded-full bg-ceylon-chilli text-white text-xs font-black uppercase tracking-widest shadow-lg border-2 border-ceylon-saffron flex items-center gap-2 hover:scale-105 transition-all cursor-pointer animate-pulse"
        >
          <Flame className="w-4 h-4 fill-current text-ceylon-saffron" />
          <span>TODAY'S SPECIAL OFFER ({offerProduct.discountPercentage || 20}% OFF)</span>
        </button>
      )}

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-ceylon-volcanic/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-ceylon-cocoa border-2 border-ceylon-copper/50 rounded-3xl overflow-hidden shadow-volcanic space-y-0 text-ceylon-ivory">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-ceylon-volcanic/80 text-ceylon-sandstone hover:text-ceylon-ivory border border-ceylon-copper/40 transition-colors cursor-pointer"
              aria-label="Close special offer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Dish Hero Image */}
            <div className="relative aspect-[16/9] w-full bg-ceylon-volcanic">
              <Image
                src={mainImg}
                alt={offerProduct.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-transparent to-black/40" />

              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce text-ceylon-saffron" />
                <span>A LITTLE EXTRA SPICE • TODAY ONLY</span>
              </div>

              {offerProduct.discountPercentage && (
                <div className="absolute bottom-4 right-4 z-10 px-4 py-2 rounded-2xl bg-ceylon-saffron text-ceylon-volcanic font-serif-display text-2xl font-black shadow-saffron border border-white/20">
                  {offerProduct.discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-ceylon-copper flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-ceylon-saffron" />
                  CHEF'S SIGNATURE TEMPTATION
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-black text-ceylon-ivory">
                  {offerProduct.name}
                </h3>
                <p className="text-xs text-ceylon-sandstone line-clamp-2 leading-relaxed">
                  {offerProduct.shortDescription || offerProduct.description || "Enjoy today's handcrafted Sri Lankan special offer, prepared fresh with hand-roasted Ceylon spices."}
                </p>
              </div>

              {/* Pricing Row */}
              <div className="flex items-baseline gap-3 pt-1">
                {offerProduct.offerPrice ? (
                  <>
                    <span className="font-serif-display text-3xl font-black text-ceylon-saffron">
                      £{offerProduct.offerPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-ceylon-sandstone/60 line-through">
                      £{offerProduct.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif-display text-3xl font-black text-ceylon-saffron">
                    £{offerProduct.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href={`/menu/${offerProduct._id}`}
                  onClick={handleClose}
                  className="w-full sm:flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all duration-300 shadow-copper flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/offers"
                  onClick={handleClose}
                  className="w-full sm:flex-1 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-ivory bg-ceylon-volcanic/80 hover:bg-ceylon-volcanic transition-all duration-300 border border-ceylon-copper/40 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>EXPLORE ALL OFFERS</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
