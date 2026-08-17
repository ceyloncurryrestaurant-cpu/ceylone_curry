"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/products/ProductCard";
import { Logo } from "@/components/Logo";
import { Search, Flame, Tag, SlidersHorizontal, Utensils, Sparkles, Filter } from "lucide-react";

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyOffers, setOnlyOffers] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/products?isAvailable=true"),
          fetch("/api/categories"),
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();

        if (pData.success) setProducts(pData.products);
        if (cData.success) setCategories(cData.categories);
      } catch (err) {
        console.error("Error fetching menu catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products.filter((item) => {
    if (selectedCategory !== "all" && item.categoryId?._id !== selectedCategory && item.categoryId !== selectedCategory) {
      return false;
    }
    if (onlyOffers && !item.isOffer) {
      return false;
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchDesc = item.shortDescription?.toLowerCase().includes(q);
      const matchIng = item.ingredients?.some((ing: string) => ing.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchIng) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return (a.offerPrice || a.price) - (b.offerPrice || b.price);
    if (sortBy === "price-high") return (b.offerPrice || b.price) - (a.offerPrice || a.price);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden space-y-12">
      <Logo variant="watermark" />

      {/* MENU HERO BANNER */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-volcanic bg-ceylon-cocoa text-ceylon-ivory p-8 sm:p-14 text-center border-2 border-ceylon-copper/40">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1600&q=80"
            alt="Ceylon Menu Culinary Photography"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-ceylon-cocoa/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-saffron" />
            OUR CULINARY CATALOG
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-ceylon-ivory leading-tight">
            The Flavours of Ceylon
          </h1>
          <p className="text-ceylon-sandstone text-xs sm:text-sm font-light leading-relaxed">
            Explore authentic Sri Lankan street delicacies, slow-cooked roasted spice curries, sizzling Kottu roti, and traditional island desserts.
          </p>
        </div>
      </div>

      {/* SEARCH, CATEGORIES & FILTERS BAR */}
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Top Controls: Expanding Search & Sorting */}
        <div className="glass-cocoa p-4 sm:p-6 rounded-3xl border border-ceylon-copper/30 shadow-volcanic flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-ceylon-copper absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, ingredients (e.g. Kottu, Prawns)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-ceylon-volcanic border border-ceylon-copper/40 focus:outline-none focus:border-ceylon-saffron text-xs font-semibold text-ceylon-ivory placeholder-ceylon-sandstone/60 transition-all shadow-sm"
            />
          </div>

          {/* Controls: Offer Filter & Sorting */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                onlyOffers
                  ? "bg-ceylon-chilli text-white border-ceylon-chilli shadow-md"
                  : "bg-ceylon-volcanic text-ceylon-sandstone border-ceylon-copper/40 hover:border-ceylon-copper"
              }`}
            >
              <Flame className="w-4 h-4 text-ceylon-saffron fill-current" />
              <span>Chef's Offers Only</span>
            </button>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-ceylon-copper" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-ceylon-volcanic border border-ceylon-copper/40 text-xs font-bold text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron shadow-sm"
              >
                <option value="featured" className="bg-ceylon-volcanic text-ceylon-ivory">Featured Dishes</option>
                <option value="price-low" className="bg-ceylon-volcanic text-ceylon-ivory">Price: Low to High</option>
                <option value="price-high" className="bg-ceylon-volcanic text-ceylon-ivory">Price: High to Low</option>
                <option value="name" className="bg-ceylon-volcanic text-ceylon-ivory">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === "all"
                ? "bg-ceylon-copper text-ceylon-volcanic shadow-copper scale-105"
                : "bg-ceylon-cocoa text-ceylon-sandstone border border-ceylon-copper/30 hover:border-ceylon-copper"
            }`}
          >
            All Dishes ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat._id
                  ? "bg-ceylon-copper text-ceylon-volcanic shadow-copper scale-105"
                  : "bg-ceylon-cocoa text-ceylon-sandstone border border-ceylon-copper/30 hover:border-ceylon-copper"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* DISHES CATALOG GRID */}
      <div className="max-w-7xl mx-auto relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-ceylon-cocoa/40 animate-pulse border border-ceylon-copper/20" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-cocoa p-16 rounded-3xl text-center border border-ceylon-copper/30 max-w-md mx-auto space-y-4">
            <Utensils className="w-12 h-12 text-ceylon-copper mx-auto" />
            <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">No Dishes Found</h3>
            <p className="text-xs text-ceylon-sandstone">Try adjusting your search terms or clearing selected category filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setOnlyOffers(false);
              }}
              className="px-6 py-2.5 rounded-full bg-ceylon-copper text-ceylon-volcanic font-black uppercase text-xs shadow-copper cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
