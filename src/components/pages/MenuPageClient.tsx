"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, Utensils } from "lucide-react";

export function MenuPageClient() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }

    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products || []);
        if (catData.success) setCategories(catData.categories || []);
      } catch (err) {
        console.error("Error fetching menu data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.categoryId?._id === selectedCategory ||
      product.categoryId === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#071B5C] py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-6">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-[#071B5C] block">
            CEYLON CULINARY CATALOG
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-[#071B5C]">
            Explore Our Authentic Menu
          </h1>
          <p className="text-gray-600 text-sm font-light">
            Traditional Sri Lankan curries, kottu roti, biryanis, and street food cooked daily with fresh island spices.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-xs font-semibold text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <Filter className="w-4 h-4 text-[#071B5C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#071B5C]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-300 text-xs font-bold text-[#071B5C] focus:outline-none focus:border-[#071B5C] cursor-pointer"
            >
              <option value="featured">Featured Dishes</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div
          className="flex flex-nowrap items-center justify-start gap-2.5 overflow-x-auto pb-3 px-2 sm:px-4 w-full scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap snap-center ${
              selectedCategory === "all"
                ? "bg-[#071B5C] text-white shadow-md ring-2 ring-ceylon-gold"
                : "bg-white text-[#071B5C] border-2 border-gray-200 hover:border-[#071B5C] hover:bg-gray-50"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId?._id === cat._id || p.categoryId === cat._id).length;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap snap-center ${
                  selectedCategory === cat._id
                    ? "bg-[#071B5C] text-white shadow-md ring-2 ring-ceylon-gold"
                    : "bg-white text-[#071B5C] border-2 border-gray-200 hover:border-[#071B5C] hover:bg-gray-50"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 sm:h-80 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#FAF7F2] rounded-3xl p-16 text-center border-2 border-gray-200 max-w-md mx-auto space-y-3 shadow-md text-[#071B5C]">
            <Utensils className="w-12 h-12 text-[#071B5C] mx-auto opacity-40" />
            <p className="font-serif-display font-bold text-2xl">No Dishes Found</p>
            <p className="text-xs text-gray-600">Try adjusting your category selection or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
