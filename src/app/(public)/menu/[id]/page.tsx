"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/Logo";
import { Plus, Minus, Tag, Flame, ShieldAlert, ArrowLeft, CheckCircle2, ShoppingBag, Check } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function ProductDetailPage({ params }: { params: any }) {
  const { addToCart } = useCart();
  const [productId, setProductId] = useState<string>("");
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    Promise.resolve(params).then((res: any) => {
      if (res?.id) setProductId(res.id);
    });
  }, [params]);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setLoading(false);
        return;
      }

      if (productId === "default-offer") {
        setProduct({
          _id: "default-offer",
          name: "Jaffna Black Roasted Lamb Curry & Kottu Combo",
          description: "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste, served with iron-griddled Kottu roti.",
          shortDescription: "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
          price: 18.90,
          offerPrice: 14.90,
          isOffer: true,
          isAvailable: true,
          spiceLevel: "Hot",
          ingredients: ["Tender Lamb Leg", "Dark Roasted Coriander", "Black Pepper", "Toasted Coconut", "Godamba Roti"],
          allergens: ["Gluten"],
          images: [
            { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80" },
            { url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80" }
          ],
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          // Fallback if product ID not found in DB
          setProduct({
            _id: productId,
            name: "Jaffna Black Roasted Lamb Curry & Kottu Combo",
            description: "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste.",
            shortDescription: "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
            price: 18.90,
            offerPrice: 14.90,
            isOffer: true,
            isAvailable: true,
            spiceLevel: "Hot",
            ingredients: ["Tender Lamb Leg", "Dark Roasted Coriander", "Black Pepper", "Godamba Roti"],
            allergens: ["Gluten"],
            images: [
              { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80" }
            ],
          });
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setProduct({
          _id: productId,
          name: "Jaffna Black Roasted Lamb Curry & Kottu Combo",
          description: "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste.",
          shortDescription: "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
          price: 18.90,
          offerPrice: 14.90,
          isOffer: true,
          isAvailable: true,
          spiceLevel: "Hot",
          ingredients: ["Tender Lamb Leg", "Dark Roasted Coriander", "Black Pepper", "Godamba Roti"],
          allergens: ["Gluten"],
          images: [
            { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80" }
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ceylon-volcanic py-20 px-4 flex justify-center items-center">
        <div className="w-16 h-16 rounded-full border-4 border-ceylon-copper border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ceylon-volcanic py-20 px-4 text-center space-y-4 text-ceylon-ivory">
        <h2 className="font-serif-display text-3xl font-bold text-ceylon-ivory">Dish Not Found</h2>
        <Link href="/menu" className="inline-block px-6 py-3 rounded-full bg-ceylon-copper text-ceylon-volcanic font-black uppercase text-xs">
          Return to Menu
        </Link>
      </div>
    );
  }

  const displayPrice = product.isOffer && product.offerPrice ? product.offerPrice : product.price;
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product._id,
        name: product.name,
        price: displayPrice,
        image: images[0].url,
      });
    }

    setAdded(true);
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      description: `Subtotal: £${(displayPrice * quantity).toFixed(2)}`,
    });

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Logo variant="watermark" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Back Link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ceylon-sandstone hover:text-ceylon-copper transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Menu Catalog
        </Link>

        {/* Product Details Split Presentation */}
        <div className="glass-cocoa p-6 sm:p-10 rounded-[3rem] border border-ceylon-copper/40 shadow-volcanic grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Food Image Gallery */}
          <div className="space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-ceylon-copper/40 shadow-xl bg-ceylon-volcanic">
              <Image
                src={images[selectedImageIndex]?.url}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-500"
              />
              {product.isOffer && (
                <div className="absolute top-4 left-4 z-10 bg-ceylon-chilli text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md animate-pulse">
                  {product.discountPercentage ? `${product.discountPercentage}% OFF` : "SPECIAL OFFER"}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Strip (up to 4 images) */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.slice(0, 4).map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? "border-ceylon-copper scale-105 shadow-copper" : "border-ceylon-bronze/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Culinary Description & Ordering */}
          <div className="space-y-6">
            <div className="space-y-2 border-b border-ceylon-bronze/30 pb-4">
              {product.categoryId?.name && (
                <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">
                  {product.categoryId.name}
                </span>
              )}
              <h1 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-ivory leading-tight">
                {product.name}
              </h1>

              {/* Price Breakdown */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif-display text-4xl font-black text-ceylon-saffron">
                  £{displayPrice.toFixed(2)}
                </span>
                {product.isOffer && product.originalPrice && product.originalPrice > displayPrice && (
                  <span className="text-sm text-ceylon-sandstone/50 line-through font-semibold">
                    £{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Full Description */}
            <p className="text-sm text-ceylon-sandstone leading-relaxed font-light">
              {product.description || product.shortDescription}
            </p>

            {/* Ingredients Tags */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">
                  Key Ingredients & Spices:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing: string, idx: number) => (
                    <span key={idx} className="bg-ceylon-volcanic text-ceylon-saffron text-xs font-semibold px-3 py-1 rounded-full border border-ceylon-copper/30">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens Notice */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="p-4 rounded-2xl bg-ceylon-volcanic border border-ceylon-copper/40 flex items-start gap-3 text-xs text-ceylon-sandstone">
                <ShieldAlert className="w-5 h-5 text-ceylon-saffron shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ceylon-ivory block">Allergen Notice:</span>
                  <span>Contains: {product.allergens.join(", ")}. Please inform our staff of any severe allergies.</span>
                </div>
              </div>
            )}

            {/* Quantity Controls & Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border border-ceylon-copper/40 rounded-full bg-ceylon-volcanic px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-ceylon-copper transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-black text-sm text-ceylon-ivory">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-ceylon-copper transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-copper flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer ${
                  added ? "bg-emerald-600 text-white" : "bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Added to Order!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Order (£{(displayPrice * quantity).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
