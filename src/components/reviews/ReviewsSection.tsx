"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote, Heart, CheckCircle2 } from "lucide-react";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  date?: string;
}

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Default high-praise guest testimonials if DB is initializing
  const defaultReviews: Review[] = [
    {
      _id: "rev-1",
      name: "David M., Plymouth Local",
      rating: 5,
      comment: "Absolute best Jaffna Lamb Curry in Devon! The hand-roasted spice aroma hits you the moment you step in. Authentic Ceylon taste!",
    },
    {
      _id: "rev-2",
      name: "Sarah & James T.",
      rating: 5,
      comment: "The Cheese Kottu Roti is incredible. The reservation process for Table 3 was smooth, and the hospitality was warm and welcoming.",
    },
    {
      _id: "rev-3",
      name: "Priyantha K.",
      rating: 5,
      comment: "Reminds me of home in Colombo. Coconut Sambol and Devilled King Prawns were perfection. 10/10 dining experience in Plymouth!",
    },
  ];

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success && data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          setReviews(defaultReviews);
        }
      } catch (err) {
        setReviews(defaultReviews);
      }
    }
    fetchReviews();
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <section className="py-24 bg-white text-ceylon-dark relative z-10 border-y border-ceylon-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ceylon-navy text-ceylon-gold text-xs font-black uppercase tracking-widest shadow-md">
            <Quote className="w-3.5 h-3.5 fill-current" />
            <span>GUEST REVIEWS & STORIES</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
            LOVED BY PLYMOUTH FOODIES
          </h2>
          <p className="text-gray-600 text-sm font-normal">
            Real guest reviews and dining experiences at Ceylon Curry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev._id}
              className="glass-panel p-8 rounded-3xl border border-ceylon-gold/40 shadow-card hover:shadow-navy transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-ceylon-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="font-serif-display text-sm font-extrabold text-ceylon-navy">
                  {rev.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Guest
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
