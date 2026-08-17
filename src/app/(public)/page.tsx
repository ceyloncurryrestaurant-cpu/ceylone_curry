"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Logo } from "@/components/Logo";
import { LogoIntroOverlay } from "@/components/LogoIntroOverlay";
import { SpecialOfferModal } from "@/components/SpecialOfferModal";
import { ReviewModal } from "@/components/ReviewModal";
import { VisualFloorPlan } from "@/components/reservations/VisualFloorPlan";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Phone,
  Clock,
  MapPin,
  Utensils,
  Award,
  ChevronRight,
  Tag,
  Star,
  MessageSquarePlus,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Table reservation selection
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // 5 Full-Screen Swappable Hero Slideshow Images (Auto-changes every 5 seconds)
  const heroSlides = [
    {
      url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=2000&q=85",
      title: "Jaffna Black Roasted Lamb Curry",
      tagline: "Slow-Braised in Dark Island Roasted Spice",
      price: "£15.90",
    },
    {
      url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=2000&q=85",
      title: "Sizzling Cheese Kottu Roti",
      tagline: "Street-Food Icon Flash-Fried on Flat Iron Griddle",
      price: "£13.50",
    },
    {
      url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=2000&q=85",
      title: "Fiery Devilled King Prawns",
      tagline: "Jumbo King Prawns Wok-Tossed with Chilli Glaze",
      price: "£14.80",
    },
    {
      url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85",
      title: "Traditional Ceylon Banquet",
      tagline: "Hand-Crafted Coconut Gravies & Fragrant Rice",
      price: "£18.50",
    },
    {
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=2000&q=85",
      title: "Karapincha Tempered Claypot Curry",
      tagline: "Slow-Simmered in Claypot with Fresh Curry Leaves",
      price: "£14.20",
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  // Signature Dishes Showcase Data
  const signatureDishes = [
    {
      name: "CHEESE KOTTU ROTI",
      subtitle: "Street-Food Comfort with a Rich Ceylon Twist",
      description: "Shredded godamba flatbread flash-fried on a flat iron griddle with roasted chicken, farm eggs, crunchy vegetables, and melted cheddar sauce.",
      price: "£13.50",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
      badge: "HOUSE FAVORITE",
    },
    {
      name: "JAFFNA BLACK LAMB CURRY",
      subtitle: "Slow-Braised Tender Lamb in Dark Roasted Spice",
      description: "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste.",
      price: "£15.90",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
      badge: "CHEF'S CROWN",
    },
    {
      name: "DEVILLED KING PRAWNS",
      subtitle: "Fiery Wok-Tossed Prawns with Capsicum & Tomato",
      description: "Jumbo king prawns tossed with banana peppers, red onions, crushed chilli flakes, and sweet-spicy Ceylon glaze.",
      price: "£14.80",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      badge: "HOT & SPICY",
    },
  ];
  const [currentSignatureIndex, setCurrentSignatureIndex] = useState(0);

  // Auto-swap hero background image every 5 seconds (5000ms)
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
        const [featRes, offerRes, catRes, allProdRes, tableRes, reviewRes] = await Promise.all([
          fetch("/api/products?isFeatured=true"),
          fetch("/api/products?isOffer=true"),
          fetch("/api/categories"),
          fetch("/api/products?isAvailable=true"),
          fetch("/api/tables"),
          fetch("/api/reviews"),
        ]);
        const featData = await featRes.json();
        const offerData = await offerRes.json();
        const catData = await catRes.json();
        const allProdData = await allProdRes.json();
        const tableData = await tableRes.json();
        const reviewData = await reviewRes.json();

        if (featData.success) setFeaturedProducts(featData.products.slice(0, 6));
        if (offerData.success) setOfferProducts(offerData.products.slice(0, 3));
        if (catData.success) setCategories(catData.categories);
        if (allProdData.success) setAllProducts(allProdData.products);
        if (tableData.success) setTables(tableData.tables);
        if (reviewData.success) setRealReviews(reviewData.reviews);
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const phoneNum = settings?.mobileNumber || "01752 941504";
  const whatsappNum = settings?.whatsappNumber || "+441752941504";
  const addressStr = settings?.address || "44 Mayflower St, Plymouth PL1 1QX";
  const hoursStr = settings?.openingHours?.monday || "10:00 AM - 10:00 PM";

  const formattedCallHref = `tel:${phoneNum.replace(/\s+/g, "")}`;
  const whatsappUrl = getWhatsAppLink(whatsappNum);

  return (
    <div className="space-y-0 relative overflow-hidden bg-ceylon-volcanic text-ceylon-ivory">
      {/* 01. CINEMATIC LOGO INTRO OVERLAY */}
      <LogoIntroOverlay />

      {/* 01B. PROMOTIONAL POPUP MODAL */}
      <SpecialOfferModal />

      {/* 02. FULL-SCREEN SWAPPABLE HERO BACKGROUND SLIDESHOW (5 IMAGES AUTO-SWAPPING EVERY 5s) */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center bg-ceylon-volcanic overflow-hidden pt-20 pb-24">
        {/* Full-Screen 5 Swappable Background Images */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.title}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              heroIndex === idx ? "opacity-60 scale-105" : "opacity-0 scale-100"
            }`}
            style={{ transition: "opacity 1000ms ease-in-out, transform 8000ms linear" }}
          >
            <Image
              src={slide.url}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Dark Volcanic Gradient Overlay */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-ceylon-volcanic via-ceylon-volcanic/75 to-ceylon-volcanic/85 pointer-events-none" />
        <div className="absolute inset-0 z-[1] opacity-15 pointer-events-none bg-[radial-gradient(#C8783D_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 w-full">
          {/* Static Brand Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-ceylon-cocoa/90 border border-ceylon-copper/50 backdrop-blur-md shadow-copper">
            <Sparkles className="w-4 h-4 text-ceylon-saffron animate-pulse" />
            <span className="text-[11px] uppercase font-black tracking-[0.3em] text-ceylon-copper">
              CEYLON CURRY • PLYMOUTH
            </span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.98] text-ceylon-ivory">
            A JOURNEY <br />
            <span className="text-ceylon-copper copper-text-glow italic">THROUGH CEYLON</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ceylon-sandstone leading-relaxed font-light">
            Enter a modern Sri Lankan culinary world where slow-cooked roasted spice curries, sizzling Kottu roti, and copper-lit atmosphere converge.
          </p>

          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-ceylon-copper to-transparent mx-auto animate-draw-line" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all duration-300 shadow-copper transform hover:-translate-y-1"
            >
              <Utensils className="w-4 h-4" />
              <span>EXPLORE THE MENU</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/reserve"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-ivory bg-ceylon-cocoa/90 hover:bg-ceylon-volcanic transition-all duration-300 border border-ceylon-copper/40 shadow-volcanic transform hover:-translate-y-1"
            >
              <Calendar className="w-4 h-4 text-ceylon-copper" />
              <span>RESERVE A TABLE</span>
            </Link>
          </div>

          {/* 5-Slide Manual Navigation Pills */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-ceylon-copper">
              SLIDE 0{heroIndex + 1} / 05
            </span>
            <div className="flex gap-2.5 items-center">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-3 rounded-full transition-all duration-500 cursor-pointer ${
                    heroIndex === i ? "w-10 bg-ceylon-saffron shadow-saffron" : "w-3 bg-ceylon-copper/40 hover:bg-ceylon-copper"
                  }`}
                  title={`Swap to background image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[9px] uppercase font-black tracking-[0.3em] text-ceylon-copper/80">
            SCROLL TO ENTER
          </span>
          <div className="w-[2px] h-8 bg-ceylon-copper/30 relative overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-ceylon-copper animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* 03. TODAY'S TEMPTATION / DAILY OFFERS — MOVED RIGHT AFTER HERO SECTION */}
      <section className="py-24 bg-ceylon-charcoal text-ceylon-ivory relative z-10 border-y border-ceylon-bronze/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-ceylon-bronze/30 pb-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper inline-flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-ceylon-chilli animate-bounce" />
                TODAY'S TEMPTATION
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory mt-1">
                Exclusive Daily Deals
              </h2>
            </div>
            <Link
              href="/offers"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ceylon-copper hover:text-ceylon-saffron transition-colors"
            >
              <span>ALL DAILY OFFERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {offerProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fallback offer cards if DB has no offers flagged */}
              <div className="glass-cocoa p-6 rounded-3xl border border-ceylon-copper/30 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" alt="Jaffna Lamb Curry" fill className="object-cover" />
                  <div className="absolute top-3 left-3 bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">20% OFF</div>
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">Jaffna Black Roasted Lamb Curry</h3>
                <p className="text-xs text-ceylon-sandstone font-light">Slow-braised lamb leg in dark roasted spices.</p>
                <div className="flex justify-between items-center pt-2 border-t border-ceylon-bronze/30">
                  <span className="font-serif-display text-2xl font-black text-ceylon-saffron">£14.90 <span className="text-xs line-through text-ceylon-sandstone/50 font-normal">£18.90</span></span>
                  <Link href="/menu" className="px-4 py-2 rounded-full bg-ceylon-copper text-ceylon-volcanic text-xs font-black uppercase">Order</Link>
                </div>
              </div>

              <div className="glass-cocoa p-6 rounded-3xl border border-ceylon-copper/30 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" alt="Cheese Kottu" fill className="object-cover" />
                  <div className="absolute top-3 left-3 bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">SPECIAL DEAL</div>
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">Cheese Kottu Roti Feast</h3>
                <p className="text-xs text-ceylon-sandstone font-light">Iron-griddled flatbread with eggs, chicken & cheese sauce.</p>
                <div className="flex justify-between items-center pt-2 border-t border-ceylon-bronze/30">
                  <span className="font-serif-display text-2xl font-black text-ceylon-saffron">£12.50 <span className="text-xs line-through text-ceylon-sandstone/50 font-normal">£15.00</span></span>
                  <Link href="/menu" className="px-4 py-2 rounded-full bg-ceylon-copper text-ceylon-volcanic text-xs font-black uppercase">Order</Link>
                </div>
              </div>

              <div className="glass-cocoa p-6 rounded-3xl border border-ceylon-copper/30 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" alt="Devilled Prawns" fill className="object-cover" />
                  <div className="absolute top-3 left-3 bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">15% OFF</div>
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">Devilled King Prawns Wok Special</h3>
                <p className="text-xs text-ceylon-sandstone font-light">Jumbo king prawns tossed with banana peppers & chilli glaze.</p>
                <div className="flex justify-between items-center pt-2 border-t border-ceylon-bronze/30">
                  <span className="font-serif-display text-2xl font-black text-ceylon-saffron">£13.90 <span className="text-xs line-through text-ceylon-sandstone/50 font-normal">£16.50</span></span>
                  <Link href="/menu" className="px-4 py-2 rounded-full bg-ceylon-copper text-ceylon-volcanic text-xs font-black uppercase">Order</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 04. CINEMATIC BRAND STATEMENT */}
      <section className="py-24 bg-ceylon-volcanic text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-[0.35em] text-ceylon-copper block">
            CEYLON EMBER PHILOSOPHY
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-ceylon-ivory leading-tight italic">
            "Spice is not simply an ingredient. <br />
            <span className="text-ceylon-saffron not-italic">It is memory."</span>
          </h2>
          <p className="text-sm sm:text-base text-ceylon-sandstone max-w-2xl mx-auto font-light leading-relaxed">
            Every roast of coriander, every pinch of true Ceylon cinnamon, and every clash of Kottu blades on hot iron carries generations of Sri Lankan island warmth.
          </p>
        </div>
      </section>

      {/* 05. THE SOUL OF CEYLON STORY (Swapped Image to Jaffna Black Curry) */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-volcanic border-2 border-ceylon-copper/40 group bg-ceylon-cocoa">
              <Image
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80"
                alt="Authentic Jaffna Black Curry"
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-1/2 aspect-square rounded-3xl overflow-hidden border-4 border-ceylon-volcanic shadow-copper hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80"
                alt="Devilled Seafood"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">
              THE SOUL OF CEYLON
            </span>
            <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory leading-tight">
              A Taste of Ceylon in Plymouth
            </h2>
            <p className="text-ceylon-sandstone text-sm sm:text-base leading-relaxed font-light">
              Ceylon Curry brings the legendary street food and royal banquet traditions of Sri Lanka to Mayflower Street. From Northern Jaffna roasted curry powders to Southern coconut-infused curries and sizzling kottu roti, every single dish tells a story of spice routes and island warmth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-ceylon-cocoa border border-ceylon-copper/30 shadow-sm space-y-1">
                <h4 className="font-serif-display text-lg font-bold text-ceylon-saffron">Hand-Roasted Spices</h4>
                <p className="text-xs text-ceylon-sandstone font-light">Dark roasted coriander, cumin, and cardamoms sourced directly.</p>
              </div>
              <div className="p-5 rounded-2xl bg-ceylon-cocoa border border-ceylon-copper/30 shadow-sm space-y-1">
                <h4 className="font-serif-display text-lg font-bold text-ceylon-saffron">Sizzling Kottu Roti</h4>
                <p className="text-xs text-ceylon-sandstone font-light">Chopped flatbread tossed live on a hot iron griddle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06. SIGNATURE DISH SHOWCASE */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            EDITORIAL DISH FEATURE
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory">
            Signatures of the House
          </h2>
          <p className="text-ceylon-sandstone text-sm font-light">
            Indulge in our most celebrated house dishes, crafted live daily.
          </p>
        </div>

        <div className="bg-ceylon-cocoa rounded-[3rem] p-8 sm:p-14 border-2 border-ceylon-copper/40 shadow-volcanic grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-3xl overflow-hidden border border-ceylon-copper/40 bg-ceylon-volcanic">
            <Image
              src={signatureDishes[currentSignatureIndex].image}
              alt={signatureDishes[currentSignatureIndex].name}
              fill
              className="object-cover transition-all duration-700"
            />
            <div className="absolute top-4 left-4 bg-ceylon-chilli text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
              {signatureDishes[currentSignatureIndex].badge}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-ceylon-copper block">
                HOUSE SIGNATURE #{currentSignatureIndex + 1}
              </span>
              <h3 className="font-serif-display text-4xl font-extrabold text-ceylon-ivory">
                {signatureDishes[currentSignatureIndex].name}
              </h3>
              <p className="text-xs text-ceylon-saffron uppercase font-bold tracking-wider">
                {signatureDishes[currentSignatureIndex].subtitle}
              </p>
              <p className="text-sm text-ceylon-sandstone leading-relaxed font-light">
                {signatureDishes[currentSignatureIndex].description}
              </p>
            </div>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="font-serif-display text-4xl font-black text-ceylon-saffron">
                {signatureDishes[currentSignatureIndex].price}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/menu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all shadow-copper"
              >
                <span>ADD TO ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex gap-2">
                {signatureDishes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSignatureIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      currentSignatureIndex === i ? "bg-ceylon-copper w-8" : "bg-ceylon-bronze/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07. HORIZONTAL FOOD GALLERY STRIP */}
      <section className="py-24 bg-ceylon-charcoal relative z-10 border-y border-ceylon-bronze/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            CURATED VISUAL GALLERY
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-ivory mt-1">
            Life at Ceylon Curry
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 px-8 scrollbar-none">
          <div className="w-[450px] shrink-0 aspect-[4/3] relative rounded-3xl overflow-hidden border border-ceylon-copper/40 shadow-volcanic bg-ceylon-cocoa">
            <Image src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80" alt="Ceylon Curry Dish" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-[650px] shrink-0 aspect-[16/9] relative rounded-3xl overflow-hidden border border-ceylon-copper/40 shadow-volcanic bg-ceylon-cocoa">
            <Image src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80" alt="Kottu Roti Preparation" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-[380px] shrink-0 aspect-square relative rounded-3xl overflow-hidden border border-ceylon-copper/40 shadow-volcanic bg-ceylon-cocoa">
            <Image src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80" alt="Restaurant Interior Atmosphere" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="w-[550px] shrink-0 aspect-[4/3] relative rounded-3xl overflow-hidden border border-ceylon-copper/40 shadow-volcanic bg-ceylon-cocoa">
            <Image src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" alt="Devilled Seafood Dish" fill className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* 08. FOOD CATEGORIES EDITORIAL SHOWCASE */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            CULINARY CATEGORIES
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory">
            Explore By Craving
          </h2>
          <p className="text-ceylon-sandstone text-sm font-light">
            Select a category to view freshly cooked traditional Sri Lankan specialties.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/menu?category=${cat._id}`}
              className="group relative rounded-3xl overflow-hidden bg-ceylon-cocoa border border-ceylon-copper/30 p-8 flex flex-col justify-between min-h-[220px] shadow-volcanic hover:border-ceylon-copper transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-ceylon-copper block">CATEGORY</span>
                <h3 className="font-serif-display text-3xl font-extrabold text-ceylon-ivory group-hover:text-ceylon-saffron transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-ceylon-sandstone line-clamp-2 font-light">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-ceylon-bronze/30">
                <span className="text-xs font-black uppercase tracking-widest text-ceylon-copper group-hover:underline">
                  VIEW DISHES
                </span>
                <ArrowRight className="w-4 h-4 text-ceylon-copper group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 01C. REAL REVIEWS SUBMISSION MODAL */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchRealReviews}
      />

      {/* 08B. REAL GUEST REVIEWS & DINERS TESTIMONIALS */}
      <section className="py-28 bg-ceylon-charcoal relative z-10 border-y border-ceylon-bronze/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
                AUTHENTIC GUEST REVIEWS
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory">
                Loved By Plymouth Diners
              </h2>
              <p className="text-ceylon-sandstone text-sm font-light">
                Read real dining experiences from verified guests, or share your own culinary story.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all duration-300 shadow-copper flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>WRITE A REVIEW</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realReviews.slice(0, 6).map((rev) => (
              <div
                key={rev._id || rev.name}
                className="glass-cocoa p-8 rounded-3xl border border-ceylon-copper/30 shadow-volcanic space-y-4 flex flex-col justify-between hover:border-ceylon-copper transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-ceylon-saffron">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-ceylon-saffron" />
                      ))}
                    </div>
                    {rev.favoriteDish && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-ceylon-volcanic text-ceylon-copper border border-ceylon-copper/30">
                        {rev.favoriteDish}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ceylon-sandstone leading-relaxed font-light italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-4 border-t border-ceylon-bronze/30 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif-display font-bold text-ceylon-ivory">{rev.name}</h4>
                    <span className="text-[10px] uppercase tracking-widest text-ceylon-copper font-semibold block">
                      Verified Guest
                    </span>
                  </div>
                  {rev.createdAt && (
                    <span className="text-[10px] text-ceylon-sandstone/60">
                      {new Date(rev.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. RESERVE YOUR TABLE — VISUAL 7-TABLE FLOOR SELECTOR */}
      <section id="reserve-section" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            TABLE RESERVATION SYSTEM
          </span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-ceylon-ivory">
            YOUR TABLE AWAITS
          </h2>
          <p className="text-ceylon-sandstone text-sm font-light">
            Select your preferred dining table (Tables 1 - 4 Couple, Tables 5 - 7 Family) to start your reservation.
          </p>
        </div>

        {tables.length > 0 && (
          <VisualFloorPlan
            tables={tables}
            selectedTableId={selectedTableId}
            onSelectTable={(table) => setSelectedTableId(table._id)}
          />
        )}

        <div className="text-center pt-4">
          <Link
            href="/reserve"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all shadow-copper"
          >
            <Calendar className="w-4 h-4" />
            <span>CONTINUE TO RESERVATION DETAILS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. LOCATION & CONTACT US SECTION */}
      <section className="py-28 bg-ceylon-charcoal relative z-10 border-t border-ceylon-bronze/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-cocoa p-8 sm:p-14 rounded-[3rem] border border-ceylon-copper/40 shadow-volcanic grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 shadow-copper border border-ceylon-copper/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-display text-xl font-bold text-ceylon-ivory">COME FIND US</h4>
                <p className="text-xs text-ceylon-sandstone mt-1 font-light">{addressStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 shadow-copper border border-ceylon-copper/30">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-display text-xl font-bold text-ceylon-ivory">CALL & INQUIRIES</h4>
                <a href={formattedCallHref} className="text-xs text-ceylon-saffron font-bold hover:underline mt-1 block">
                  {phoneNum}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 shadow-copper border border-ceylon-copper/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif-display text-xl font-bold text-ceylon-ivory">OPENING HOURS</h4>
                <p className="text-xs text-ceylon-sandstone mt-1 font-light">
                  Monday - Sunday: {hoursStr}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
