"use client";

import React, { useState } from "react";
import { X, Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [favoriteDish, setFavoriteDish] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error("Please provide your name and review comment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment, favoriteDish }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Thank you! Your review has been published.");
        setName("");
        setRating(5);
        setComment("");
        setFavoriteDish("");
        onReviewSubmitted();
        onClose();
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch (err) {
      toast.error("Error submitting review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-ceylon-volcanic/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-ceylon-ivory">
      <div className="relative w-full max-w-lg bg-ceylon-cocoa border-2 border-ceylon-copper/50 rounded-3xl p-6 sm:p-8 shadow-volcanic space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-ceylon-volcanic text-ceylon-sandstone hover:text-ceylon-ivory border border-ceylon-copper/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-ceylon-copper flex items-center gap-1.5">
            <MessageSquarePlus className="w-4 h-4 text-ceylon-saffron" />
            SHARE YOUR DINING EXPERIENCE
          </span>
          <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-ceylon-ivory">
            Leave a Real Guest Review
          </h3>
          <p className="text-xs text-ceylon-sandstone font-light">
            Your review will be posted live on Ceylon Curry's website.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-ceylon-copper uppercase">
              Your Rating *
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? "fill-ceylon-saffron text-ceylon-saffron"
                        : "text-ceylon-copper/30"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-ceylon-saffron ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. James R. or Sarah M."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 bg-ceylon-volcanic text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
            />
          </div>

          {/* Favorite Dish Field */}
          <div>
            <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
              Favorite Dish (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cheese Kottu Roti, Black Lamb Curry"
              value={favoriteDish}
              onChange={(e) => setFavoriteDish(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 bg-ceylon-volcanic text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
            />
          </div>

          {/* Comment Field */}
          <div>
            <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
              Your Review & Dining Story *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about the flavors, spice levels, service, or atmosphere..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 bg-ceylon-volcanic text-ceylon-ivory text-xs font-normal focus:outline-none focus:border-ceylon-saffron"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full font-black text-xs uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all duration-300 shadow-copper flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? "Publishing Review..." : "Submit Review"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
