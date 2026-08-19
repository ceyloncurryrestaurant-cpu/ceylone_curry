"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export function GalleryPageClient() {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      title: "Signature Ceylon House Special",
      category: "Food",
    },
    {
      url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      title: "Fiery Devilled King Prawns",
      category: "Seafood",
    },
    {
      url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      title: "Slow-Cooked Roasted Lamb Curry",
      category: "Mains",
    },
    {
      url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
      title: "Heritage Banana Leaf Parcel",
      category: "Heritage",
    },
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      title: "Ceylon Dining Room Atmosphere",
      category: "Ambiance",
    },
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      title: "Royal Ceylon Table Setting",
      category: "Ambiance",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="section-pretitle">our</span>
        <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-white">
          Gallery
        </h1>
        <p className="text-white/80 text-sm sm:text-base font-light pt-1">
          Take a visual journey through our authentic Ceylonese culinary creations and restaurant dining experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-midnight border-2 border-ceylon-gold/30 hover:border-ceylon-gold transition-all duration-500 transform hover:-translate-y-2"
          >
            <Image
              src={img.url}
              alt={img.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010842] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-ceylon-gold bg-[#020E66]/90 px-3 py-1 rounded-full border border-ceylon-gold/40">
                {img.category}
              </span>
              <h3 className="font-serif-display text-xl font-bold text-white leading-tight">
                {img.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/reserve"
          className="inline-flex items-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-midnight bg-ceylon-gold hover:bg-ceylon-gold-light transition-all shadow-gold shimmer-btn"
        >
          <Calendar className="w-4 h-4" />
          <span>Book a Dining Experience</span>
        </Link>
      </div>
    </div>
  );
}
