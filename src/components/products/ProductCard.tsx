"use client";

import React, { useState } from "react";
import Image from "next/image";
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
    images?: { url: string }[];
    categoryId?: { name: string };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const displayPrice = product.isOffer && product.offerPrice ? product.offerPrice : product.price;
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

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
    <div className="group relative rounded-3xl overflow-hidden glass-cocoa border border-ceylon-copper/30 shadow-volcanic hover:shadow-copper-lg transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between">
      {/* Product Image Container */}
      <Link href={`/menu/${product._id}`} className="relative aspect-[4/3] w-full overflow-hidden block bg-ceylon-volcanic">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Discount Badge */}
        {product.isOffer && (
          <div className="absolute top-3 left-3 z-10 bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md animate-pulse">
            {product.discountPercentage ? `${product.discountPercentage}% OFF` : "SPECIAL OFFER"}
          </div>
        )}

        {/* Quick View Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="p-3 rounded-full bg-ceylon-copper text-ceylon-volcanic shadow-copper transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-5 h-5" />
          </span>
        </div>
      </Link>

      {/* Product Details Content */}
      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-ceylon-cocoa">
        <div className="space-y-1.5">
          {product.categoryId?.name && (
            <span className="text-[10px] uppercase font-black tracking-widest text-ceylon-copper block">
              {product.categoryId.name}
            </span>
          )}
          <Link href={`/menu/${product._id}`}>
            <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory hover:text-ceylon-saffron transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="text-xs text-ceylon-sandstone line-clamp-2 leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-ceylon-bronze/30 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-display text-2xl font-black text-ceylon-saffron">
                £{displayPrice.toFixed(2)}
              </span>
              {product.isOffer && product.originalPrice && product.originalPrice > displayPrice && (
                <span className="text-xs text-ceylon-sandstone/50 line-through font-medium">
                  £{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md flex items-center gap-1.5 transform active:scale-95 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic shadow-copper"
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
