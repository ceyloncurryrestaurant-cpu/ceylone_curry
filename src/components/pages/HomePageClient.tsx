"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { ReviewModal } from "@/components/ReviewModal";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Utensils,
  ChevronRight,
  ChevronLeft,
  Car,
  Gift,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

const parkImages = [
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601165/ceylon_curry/park/qarpo5dnphiiiwhnhpjh.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601171/ceylon_curry/park/wvvch6xerk1zchhqig2x.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601179/ceylon_curry/park/trhrh6cdi63qnuhf4aod.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601181/ceylon_curry/park/m3jhgc1rt7mkyxmhwbmg.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601184/ceylon_curry/park/l3y00ixxhxmg8krxwss1.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601187/ceylon_curry/park/eldfxgtvsyxhut72o8wm.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601190/ceylon_curry/park/ydskyymuqmuygmszfwqf.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601193/ceylon_curry/park/dtxf9yawrxn8sd7ef8fl.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601196/ceylon_curry/park/akwsi9jjgyv7rhzn4gyi.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601198/ceylon_curry/park/egbwd3o3ytjucads2z14.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601199/ceylon_curry/park/qtpru55gldguodnhnfcn.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787601201/ceylon_curry/park/yfgoklfhtd9kwrcntdzr.jpg",
];
const parkVideo = "https://res.cloudinary.com/emsmspoh/video/upload/v1787601270/ceylon_curry/park/j7eod3fswco2mnii2fry.mp4";

interface HomePageClientProps {
  initialFeaturedProducts?: any[];
  initialOfferProducts?: any[];
  initialCategories?: any[];
  initialAllProducts?: any[];
  initialReviews?: any[];
}

export function HomePageClient({
  initialFeaturedProducts = [],
  initialOfferProducts = [],
  initialCategories = [],
  initialAllProducts = [],
  initialReviews = [],
}: HomePageClientProps) {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(initialFeaturedProducts);
  const [offerProducts, setOfferProducts] = useState<any[]>(initialOfferProducts);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [allProducts, setAllProducts] = useState<any[]>(initialAllProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(initialFeaturedProducts.length === 0);

  const catScrollRef = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const parkGalleryScrollRef = useRef<HTMLDivElement>(null);
  const [activeCatIndex, setActiveCatIndex] = useState(0);

  const defaultCatList = [
    { _id: "cat1", name: "Kottu Roti", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80" },
    { _id: "cat2", name: "Ceylon Curries", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
    { _id: "cat3", name: "Rice & Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
    { _id: "cat4", name: "Seafood Delights", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80" },
    { _id: "cat5", name: "Crispy Dosa", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80" },
    { _id: "cat6", name: "Appetizers", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCatList;

  const handleCatScroll = () => {
    if (catScrollRef.current && displayCategories.length > 0) {
      const container = catScrollRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const progress = Math.max(0, Math.min(1, container.scrollLeft / maxScrollLeft));
      const index = Math.round(progress * (displayCategories.length - 1));
      setActiveCatIndex(index);
    }
  };

  useEffect(() => {
    if (!displayCategories || displayCategories.length === 0) return;

    let isPaused = false;
    const container = catScrollRef.current;

    const interval = setInterval(() => {
      if (container && !isPaused) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 190, behavior: "smooth" });
        }
      }
    }, 2400);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      clearInterval(interval);
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [displayCategories]);

  useEffect(() => {
    const container = galleryScrollRef.current;
    if (!container) return;

    let isPaused = false;

    const interval = setInterval(() => {
      if (container && !isPaused) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const step = Math.min(400, container.clientWidth * 0.85);
          container.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 3000);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(interval);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const container = parkGalleryScrollRef.current;
    if (!container) return;

    let isPaused = false;

    const interval = setInterval(() => {
      if (container && !isPaused) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 20) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          const step = Math.min(400, container.clientWidth * 0.85);
          container.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 3200);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(interval);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const scrollCat = (direction: "left" | "right") => {
    if (catScrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      catScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [realReviews, setRealReviews] = useState<any[]>(initialReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const defaultHeroUrls = [
    "/images/hero/biryani.webp",
    "/images/hero/parotta.webp",
    "/images/hero/curry.webp",
    "/images/hero/dosa.webp",
  ];
  const heroImageUrls = (settings?.heroImages && settings.heroImages.length > 0)
    ? settings.heroImages
    : defaultHeroUrls;
  const heroSlides = heroImageUrls.map((url: string, i: number) => ({
    url,
    title: `Ceylon Curry Slide ${i + 1}`,
    tagline: "Authentic Sri Lankan Cuisine",
    price: "",
  }));
  const [heroIndex, setHeroIndex] = useState(0);



  const storyMainImgRaw = settings?.storyMainImage;
  const storyMainImg = (!storyMainImgRaw || storyMainImgRaw.includes("unsplash.com")) ? "/shop.jpeg" : storyMainImgRaw;
  const storySecImg = settings?.storySecondaryImage || "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80";

  const defaultGalleryImages = [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  ];
  const galleryImages = (settings?.galleryImages && settings.galleryImages.length > 0)
    ? settings.galleryImages
    : defaultGalleryImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const fetchRealReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && data.reviews) {
        setRealReviews(data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [featRes, offerRes, catRes, allProdRes, reviewRes] = await Promise.all([
          fetch("/api/products?isFeatured=true", { cache: "no-store" }),
          fetch("/api/products?isOffer=true", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/products?isAvailable=true", { cache: "no-store" }),
          fetch("/api/reviews", { cache: "no-store" }),
        ]);
        const featData = await featRes.json();
        const offerData = await offerRes.json();
        const catData = await catRes.json();
        const allProdData = await allProdRes.json();
        const reviewData = await reviewRes.json();

        if (featData.success) setFeaturedProducts(featData.products.slice(0, 6));
        if (offerData.success && offerData.products) {
          setOfferProducts(offerData.products);
        }
        if (catData.success) setCategories(catData.categories);
        if (allProdData.success) setAllProducts(allProdData.products);
        if (reviewData.success) setRealReviews(reviewData.reviews);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getCategoryFoodImage = (name: string, index: number) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("kottu")) return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80";
    if (lower.includes("curry") || lower.includes("mains")) return "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";
    if (lower.includes("lamprais") || lower.includes("rice")) return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80";
    if (lower.includes("starter") || lower.includes("devilled") || lower.includes("seafood")) return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80";
    if (lower.includes("dessert") || lower.includes("sweet")) return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80";
    if (lower.includes("drink") || lower.includes("beverage")) return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80";

    const defaultFoodImages = [
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    ];
    return defaultFoodImages[index % defaultFoodImages.length];
  };

  const filteredMiniMenuProducts = selectedCategory === "all"
    ? (allProducts.length > 0 ? allProducts.slice(0, 16) : featuredProducts.slice(0, 16))
    : allProducts.filter(p => (p.categoryId?._id === selectedCategory || p.categoryId === selectedCategory)).slice(0, 16);

  return (
    <div className="space-y-0 relative overflow-hidden bg-white">

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center bg-[#071B5C] overflow-hidden pt-20 pb-24">
        {heroSlides.map((slide: any, idx: number) => (
          <div
            key={slide.title}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out bg-[#071B5C] ${
              heroIndex === idx ? "opacity-90 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ transition: "opacity 1000ms ease-in-out, transform 8000ms linear" }}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={idx === 0}
              loading={idx === 0 ? undefined : "eager"}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMwNzFCNUMiLz48L3N2Zz4="
              sizes="100vw"
              className="object-cover brightness-105 contrast-105"
            />
          </div>
        ))}

        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#071B5C]/90 via-[#071B5C]/40 to-[#071B5C]/50 pointer-events-none" />
        <div className="absolute inset-0 z-[1] opacity-10 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 w-full">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#071B5C]/90 border border-ceylon-gold/60 backdrop-blur-md shadow-navy">
            <Sparkles className="w-4 h-4 text-ceylon-gold animate-pulse" />
            <span className="text-[11px] uppercase font-black tracking-[0.3em] text-ceylon-gold">
              CEYLON CURRY • PLYMOUTH
            </span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-white drop-shadow-2xl">
            A JOURNEY <br />
            <span className="text-ceylon-gold gold-text-glow italic">THROUGH CEYLON</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white font-medium leading-relaxed drop-shadow-md">
            Enter a modern Sri Lankan culinary world where slow-cooked roasted spice curries, sizzling Kottu roti, and copper-lit atmosphere converge.
          </p>

          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-ceylon-gold to-transparent mx-auto animate-draw-line" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-white transition-all duration-300 shadow-gold transform hover:-translate-y-1"
            >
              <Utensils className="w-4 h-4" />
              <span>EXPLORE THE MENU</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-[#071B5C]/90 hover:bg-[#0A2472] transition-all duration-300 border border-white/40 shadow-navy transform hover:-translate-y-1"
            >
              <Calendar className="w-4 h-4 text-ceylon-gold" />
              <span>RESERVE A TABLE</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="flex gap-2.5 items-center">
              {heroSlides.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-3 rounded-full transition-all duration-500 cursor-pointer ${
                    heroIndex === i ? "w-10 bg-ceylon-gold shadow-gold" : "w-3 bg-white/50 hover:bg-white"
                  }`}
                  title={`Swap to background image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[9px] uppercase font-black tracking-[0.3em] text-white/90">
            SCROLL TO ENTER
          </span>
          <div className="w-[2px] h-8 bg-white/40 relative overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-ceylon-gold animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* TODAY'S DAILY OFFERS */}
      <section className="py-24 bg-[#FAF7F2] text-[#071B5C] relative z-10 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-300 pb-6">
            <div>
              <span className="text-xs uppercase font-black tracking-[0.3em] text-ceylon-red inline-flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-ceylon-red animate-bounce" />
                TODAY'S SPECIAL OFFERS
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-[#071B5C] mt-1">
                Exclusive Daily Deals
              </h2>
            </div>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#071B5C] hover:text-ceylon-red transition-colors"
            >
              <span>VIEW ALL OFFERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 sm:h-80 rounded-3xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {offerProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CULINARY CATEGORIES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#071B5C] text-white relative z-10 space-y-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold block">
              SHOP COLLECTIONS
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white">
              Categories
            </h2>
            <div className="w-16 h-0.5 bg-ceylon-gold/80 mx-auto rounded-full shadow-gold" />
          </div>

          <div className="relative group/carousel">
            <button
              onClick={() => scrollCat("left")}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ceylon-gold text-[#071B5C] shadow-gold items-center justify-center hover:bg-white transition cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scrollCat("right")}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-ceylon-gold text-[#071B5C] shadow-gold items-center justify-center hover:bg-white transition cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={catScrollRef}
              onScroll={handleCatScroll}
              className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 pt-2 px-4 scrollbar-none snap-x snap-mandatory scroll-smooth items-center justify-start"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayCategories.map((cat, idx) => {
                const foodImg = cat.image || getCategoryFoodImage(cat.name, idx);
                return (
                  <Link
                    key={cat._id || idx}
                    href={`/menu?category=${cat._id}`}
                    className="group flex-shrink-0 flex flex-col items-center gap-3 snap-center transition-transform duration-300 transform hover:-translate-y-2 text-center"
                    style={{ width: "150px" }}
                  >
                    <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-ceylon-gold via-amber-300 to-yellow-500 shadow-[0_0_25px_rgba(245,185,26,0.4)] group-hover:shadow-[0_0_35px_rgba(245,185,26,0.7)] transition-all duration-500">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-[#071B5C] border-2 border-[#071B5C]">
                        <Image
                          src={foodImg}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 128px, 176px"
                          className="object-cover transition-transform duration-700 group-hover:scale-115"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />
                      </div>
                    </div>

                    <span className="font-serif-display text-sm sm:text-base font-bold text-white group-hover:text-ceylon-gold transition-colors line-clamp-2 px-1 max-w-[140px]">
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-2 pt-2">
              {displayCategories.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveCatIndex(i);
                    if (catScrollRef.current && displayCategories.length > 1) {
                      const container = catScrollRef.current;
                      const maxScrollLeft = container.scrollWidth - container.clientWidth;
                      const targetScroll = (i / (displayCategories.length - 1)) * maxScrollLeft;
                      container.scrollTo({ left: targetScroll, behavior: "smooth" });
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeCatIndex ? "w-8 bg-ceylon-gold shadow-gold" : "w-2 bg-white/40 hover:bg-white"
                  }`}
                  title={`Go to category ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MINI MENU */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] text-[#071B5C] relative z-10 space-y-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-[#071B5C] block">
                CHEF'S FEATURED MENU
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-[#071B5C]">
                Popular Dishes Showcase
              </h2>
              <p className="text-gray-600 text-sm font-light">
                Taste our most celebrated Sri Lankan curries, kottu roti, and appetizers.
              </p>
            </div>

            <Link
              href="/menu"
              className="px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-[#071B5C] hover:bg-[#0A2472] transition-all duration-300 shadow-lg flex items-center gap-2 shrink-0"
            >
              <Utensils className="w-4 h-4 text-ceylon-gold" />
              <span>EXPLORE FULL MENU</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 whitespace-nowrap snap-center ${
                  selectedCategory === cat._id
                    ? "bg-[#071B5C] text-white shadow-md ring-2 ring-ceylon-gold"
                    : "bg-white text-[#071B5C] border-2 border-gray-200 hover:border-[#071B5C] hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 16 }).map((_, n) => (
                <div key={n} className="h-80 rounded-3xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMiniMenuProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest text-[#071B5C] bg-[#FAF7F2] hover:bg-[#071B5C] hover:text-white border border-gray-300 transition-all shadow-md"
            >
              <span>VIEW COMPLETE MENU & ORDER</span>
              <ChevronRight className="w-4 h-4 text-ceylon-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* PARK & DINE SECTION */}
      <section className="py-24 bg-[#071B5C] text-white relative z-10 border-t border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ceylon-gold/10 border border-ceylon-gold/30 shadow-md">
              <Car className="w-4 h-4 text-ceylon-gold" />
              <span className="text-[11px] uppercase font-black tracking-[0.3em] text-ceylon-gold">
                PARK & DINE WITH US
              </span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-white mt-1 leading-tight">
              Mayflower Street East Car Park Promotion
            </h2>
            <div className="w-16 h-0.5 bg-ceylon-gold/80 mx-auto rounded-full shadow-gold" />
            <p className="text-sm sm:text-base text-blue-100 font-light max-w-2xl mx-auto leading-relaxed">
              Parking near Mayflower Street? Stop by Ceylon Curry for a delicious meal, and your parking is on us! 
            </p>
          </div>

          {/* SPLIT LAYOUT: VIDEO & DESCRIPTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: VIDEO PLAYER (TIKTOK / REEL ASPECT RATIO) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 bg-[#0A2472] group">
                <video
                  src={parkVideo}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute top-4 left-4 bg-[#071B5C]/85 text-ceylon-gold text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-ceylon-gold/30 shadow-md flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-ceylon-gold animate-ping" />
                  <span>VISITING THE PARK</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PROMO DETAILS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-widest text-ceylon-gold block">
                  EXCLUSIVE PARKING OFFER
                </span>
                <h3 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white">
                  Spend Over £50, Get Free Parking!
                </h3>
                <p className="text-sm text-blue-100 leading-relaxed font-light">
                  Our restaurant is conveniently located at 44 Mayflower Street, just a <span className="text-ceylon-gold font-bold">1-minute walk</span> from the Mayflower Street East Car Park (PL1 1QJ). If you spend <span className="text-ceylon-gold font-bold">£50.00 or more</span> on your meal, we will pay for your car park ticket.
                </p>
              </div>

              <div className="bg-[#0E3094]/40 border border-white/15 p-6 rounded-3xl space-y-4 shadow-inner">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-ceylon-gold/10 text-ceylon-gold flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-serif-display text-base font-bold text-white">Park Conveniently</h4>
                    <p className="text-xs text-blue-200/80 font-light mt-0.5">Park your vehicle at the multi-storey Mayflower Street East Car Park.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-ceylon-gold/10 text-ceylon-gold flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-serif-display text-base font-bold text-white">Dine & Enjoy</h4>
                    <p className="text-xs text-blue-200/80 font-light mt-0.5">Indulge in authentic, aromatic Sri Lankan curries, devilled dishes, or kottu roti.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-ceylon-gold/10 text-ceylon-gold flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-serif-display text-base font-bold text-white">Get Reimbursed</h4>
                    <p className="text-xs text-blue-200/80 font-light mt-0.5">Spend £50+, show your parking ticket to our staff, and we will take care of the parking cost!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-white transition-all shadow-gold"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Order Now & Claim</span>
                </Link>
                
                <div className="flex items-center gap-2 text-xs text-blue-200 font-light">
                  <Gift className="w-4 h-4 text-ceylon-gold" />
                  <span>Valid for all customers</span>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC SCROLLING PARK IMAGE GALLERY */}
          <div className="space-y-6 pt-8 border-t border-white/10">
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-ceylon-gold block">
                PARK & AREA SCENERY
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Explore the Neighborhood
              </h3>
            </div>

            <div
              ref={parkGalleryScrollRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-2 scrollbar-none scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {parkImages.map((imgUrl: string, idx: number) => (
                <div
                  key={idx}
                  className="shrink-0 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-lg bg-[#0E3094] snap-center w-[75vw] max-w-[280px] sm:max-w-none sm:w-[350px] aspect-[4/3] group"
                >
                  <Image
                    src={imgUrl}
                    alt={`Mayflower Park Area Photo ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="py-24 bg-[#071B5C] text-center relative z-10 border-t border-white/10 text-white">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-[0.35em] text-ceylon-gold block">
            CEYLON EMBER PHILOSOPHY
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight italic">
            "Spice is not simply an ingredient. <br />
            <span className="text-ceylon-gold not-italic">It is memory."</span>
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Every roast of coriander, every pinch of true Ceylon cinnamon, and every clash of Kottu blades on hot iron carries generations of Sri Lankan island warmth.
          </p>
        </div>
      </section>

      {/* STORY & SIGNATURE SHOWCASE */}
      <section className="py-28 bg-[#FAF7F2] text-[#071B5C] relative z-10 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-2 border-gray-300 bg-[#071B5C]">
                <Image
                  src={storyMainImg}
                  alt="Authentic Ceylon Culinary Craftsmanship"
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 sm:-right-8 w-1/2 aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl hidden sm:block">
                <Image
                  src={storySecImg}
                  alt="Ceylon Island Spices"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-[#071B5C]">
                THE SOUL OF CEYLON
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-[#071B5C] leading-tight">
                A Taste of Ceylon in Plymouth
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-light">
                Ceylon Curry brings the legendary street food and royal banquet traditions of Sri Lanka to Mayflower Street. From Northern Jaffna roasted curry powders to Southern coconut-infused curries and sizzling kottu roti, every single dish tells a story of spice routes and island warmth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                  <h4 className="font-serif-display text-lg font-bold text-[#071B5C]">Hand-Roasted Spices</h4>
                  <p className="text-xs text-gray-600 font-light">Dark roasted coriander, cumin, and cardamoms sourced directly.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-1">
                  <h4 className="font-serif-display text-lg font-bold text-[#071B5C]">Sizzling Kottu Roti</h4>
                  <p className="text-xs text-gray-600 font-light">Chopped flatbread tossed live on a hot iron griddle.</p>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* VISUAL GALLERY
      <section className="py-24 bg-[#071B5C] text-white relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold block">
            CURATED VISUAL GALLERY
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white mt-1">
            Life at Ceylon Curry
          </h2>
        </div>

        <div
          ref={galleryScrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 px-4 sm:px-8 scrollbar-none scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {galleryImages.map((imgUrl: string, idx: number) => (
            <div
              key={idx}
              className="shrink-0 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-navy bg-[#0E3094] snap-center w-[82vw] max-w-[340px] sm:max-w-none sm:w-[420px] md:w-[500px] aspect-[4/3]"
            >
              <Image
                src={imgUrl}
                alt={`Life at Ceylon Curry Photo ${idx + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>
      */}

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchRealReviews}
      />
    </div>
  );
}
