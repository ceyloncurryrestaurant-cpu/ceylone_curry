"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Plus, Check, Eye } from "lucide-react";
import { toast } from "@/components/ui/Toast";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug?: string;
    shortDescription?: string;
    price: number;
    originalPrice?: number;
    isOffer?: boolean;
    offerPrice?: number;
    discountPercentage?: number;
    image?: any;
    images?: any[];
    categoryId?: { name: string };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const displayPrice = product.isOffer && product.offerPrice ? product.offerPrice : product.price;

  // Robust Image URL Extraction (supports strings, objects {url}, arrays, and single image props)
  let imageUrl = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";

  if (product.images && product.images.length > 0) {
    const first = product.images[0];
    if (typeof first === "string" && first.trim().length > 0) {
      imageUrl = first;
    } else if (typeof first === "object" && first?.url) {
      imageUrl = first.url;
    }
  } else if (product.image) {
    if (typeof product.image === "string" && product.image.trim().length > 0) {
      imageUrl = product.image;
    } else if (typeof product.image === "object" && (product.image as any)?.url) {
      imageUrl = (product.image as any).url;
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      image: imageUrl,
    });

    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `Price: £${displayPrice.toFixed(2)}`,
    });

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white text-[#071B5C] border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between">
      {/* Product Image Container */}
      <Link href={`/menu/${product._id}`} className="relative aspect-[4/3] w-full overflow-hidden block bg-[#071B5C]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C]/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Discount Badge */}
        {product.isOffer && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-ceylon-red text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
            {product.discountPercentage ? `${product.discountPercentage}% OFF` : "OFFER"}
          </div>
        )}

        {/* Quick View Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="p-2.5 sm:p-3 rounded-full bg-ceylon-gold text-[#071B5C] shadow-gold transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </Link>

      {/* Product Details Content */}
      <div className="p-3.5 sm:p-6 space-y-2 flex-1 flex flex-col justify-between bg-white text-[#071B5C]">
        <div className="space-y-1">
          {product.categoryId?.name && (
            <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-[#071B5C]/70 block">
              {product.categoryId.name}
            </span>
          )}
          <Link href={`/menu/${product._id}`}>
            <h3 className="font-serif-display text-base sm:text-2xl font-bold text-[#071B5C] hover:text-ceylon-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-1 sm:line-clamp-2 leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-4 border-t border-gray-200 mt-auto gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-display text-lg sm:text-2xl font-black text-[#071B5C]">
              £{displayPrice.toFixed(2)}
            </span>
            {product.isOffer && product.originalPrice && product.originalPrice > displayPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through font-medium">
                £{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-1 transform active:scale-95 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-ceylon-gold hover:bg-[#071B5C] hover:text-white text-[#071B5C] shadow-gold"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
