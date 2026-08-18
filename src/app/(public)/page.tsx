"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { OfferCarousel } from "@/components/offers/OfferCarousel";
import { OfferPopup } from "@/components/offers/OfferPopup";
import { Logo } from "@/components/Logo";
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
  Heart,
  ChevronRight,
  ShoppingBag,
  Star,
  CheckCircle,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function HomePage() {
  const { settings } = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [offerProducts, setOfferProducts] = useState<any[]>([]);
  const [allOffers, setAllOffers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [moreProducts, setMoreProducts] = useState<any[]>([]);
  const [spotlightProduct, setSpotlightProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featRes, offerRes, catRes, allProdRes, offersRes] = await Promise.all([
          fetch("/api/products?isFeatured=true"),
          fetch("/api/products?isOffer=true"),
          fetch("/api/categories"),
          fetch("/api/products?isAvailable=true"),
          fetch("/api/offers"),
        ]);
        const featData = await featRes.json();
        const offerData = await offerRes.json();
        const catData = await catRes.json();
        const allProdData = await allProdRes.json();
        const offersData = await offersRes.json();

        if (featData.success && featData.products.length > 0) {
          setSpotlightProduct(featData.products[0]);
          setFeaturedProducts(featData.products.slice(1, 5));
        }
        if (offerData.success) setOfferProducts(offerData.products.slice(0, 3));
        if (catData.success) setCategories(catData.categories);
        if (allProdData.success) setMoreProducts(allProdData.products.slice(0, 6));
        if (offersData.success) setAllOffers(offersData.offers);
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
    <div className="space-y-0 relative overflow-hidden bg-ceylon-cream text-ceylon-dark">
      <Logo variant="watermark" />
      <OfferPopup />

      {/* ======================================================== */}
      {/* 01 — HERO SECTION                                         */}
      {/* ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center bg-ceylon-navy text-white overflow-hidden py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-ceylon-gold/40 backdrop-blur-md shadow-gold">
              <Sparkles className="w-4 h-4 text-ceylon-gold animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">
                AUTHENTIC CEYLON FLAVOURS
              </span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
              TASTE THE SOUL OF <span className="text-ceylon-gold gold-text-glow">CEYLON</span>
            </h1>

            <p className="text-ceylon-cream/90 text-base sm:text-lg leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              Traditional Sri Lankan flavours, freshly prepared and served with a modern touch in Plymouth.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all duration-300 shadow-gold transform hover:-translate-y-1"
              >
                <Utensils className="w-4 h-4" />
                <span>EXPLORE MENU</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/reserve"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs font-black uppercase tracking-widest text-white bg-ceylon-blue-deep hover:bg-ceylon-navy transition-all duration-300 shadow-xl border-2 border-ceylon-gold/50 transform hover:-translate-y-1"
              >
                <Calendar className="w-4 h-4 text-ceylon-gold" />
                <span>RESERVE A TABLE</span>
              </Link>
            </div>
          </div>

          {/* Hero Right: Large Animated Food Photography */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-ceylon-gold/50 shadow-navy animate-hero-scale bg-ceylon-blue-deep">
              <Image
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80"
                alt="Signature Ceylon Kottu & Curry"
                fill
                priority
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Detail Badge */}
            <div className="absolute -bottom-6 -left-6 bg-ceylon-blue-deep text-white p-5 rounded-2xl shadow-gold border-2 border-ceylon-gold/50 hidden sm:flex items-center gap-4 animate-float">
              <Award className="w-10 h-10 text-ceylon-gold shrink-0" />
              <div>
                <span className="font-serif-display text-lg font-bold block leading-none text-ceylon-gold">Hand-Roasted Spices</span>
                <span className="text-[10px] text-ceylon-cream uppercase tracking-wider">Heritage Island Recipes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-ceylon-gold/80">SCROLL TO EXPLORE</span>
          <div className="w-[2px] h-8 bg-ceylon-gold/40 relative overflow-hidden rounded-full">
            <div className="w-full h-1/2 bg-ceylon-gold animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 02 — DAILY OFFERS (Rotates Every 5 Seconds)              */}
      {/* ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <OfferCarousel offers={allOffers.length > 0 ? allOffers : offerProducts} />
      </section>

      {/* ======================================================== */}
      {/* 03 — FEATURED PRODUCTS (TODAY'S FAVOURITES)              */}
      {/* ======================================================== */}
      <section className="py-24 bg-white text-ceylon-dark relative z-10 border-y border-ceylon-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block">
              OUR POPULAR DISHES
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
              TODAY'S FAVOURITES
            </h2>
            <p className="text-gray-600 text-sm font-normal">
              Hand-picked guest favorites simmered in dark roasted Ceylon curry spices.
            </p>
          </div>

          {/* Spotlight + Asymmetric Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Spotlight Large Item */}
            {spotlightProduct && (
              <div className="lg:col-span-1 glass-panel rounded-3xl overflow-hidden border-2 border-ceylon-gold/50 shadow-xl flex flex-col justify-between p-6 bg-ceylon-navy text-white space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-ceylon-gold/40">
                  <Image
                    src={spotlightProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"}
                    alt={spotlightProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-ceylon-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                    SPOTLIGHT FAVOURITE
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-ceylon-gold block">FEATURED DISH</span>
                  <h3 className="font-serif-display text-2xl font-bold text-white">{spotlightProduct.name}</h3>
                  <p className="text-xs text-ceylon-cream/90 line-clamp-3 leading-relaxed font-light">{spotlightProduct.shortDescription}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="font-serif-display text-2xl font-extrabold text-ceylon-gold">£{spotlightProduct.price.toFixed(2)}</span>
                  <Link
                    href={`/menu/${spotlightProduct._id}`}
                    className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron shadow-gold"
                  >
                    ADD TO ORDER
                  </Link>
                </div>
              </div>
            )}

            {/* Asymmetric Product Cards Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 04 — FOOD CATEGORIES (WHAT ARE YOU CRAVING?)              */}
      {/* ======================================================== */}
      <section className="py-24 bg-ceylon-cream relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block">
              VISUAL DISCOVERY
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
              WHAT ARE YOU CRAVING?
            </h2>
            <p className="text-gray-600 text-sm">
              Click any visual category entry to explore authentic dishes freshly cooked to order.
            </p>
          </div>

          {/* Large Visual Entry Category Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const catImg = cat.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80";
              return (
                <Link
                  key={cat._id}
                  href={`/menu?category=${cat._id}`}
                  className="group relative rounded-3xl overflow-hidden border-2 border-ceylon-gold/30 shadow-card hover:shadow-navy transition-all duration-500 transform hover:-translate-y-2 block aspect-[4/3] bg-ceylon-navy"
                >
                  <Image
                    src={catImg}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-ceylon-navy/40 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                    <h3 className="font-serif-display text-xl font-bold text-white group-hover:text-ceylon-gold transition-colors">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] font-bold text-ceylon-gold">
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 05 — PRODUCT SHOWCASE (FROM OUR KITCHEN)                  */}
      {/* ======================================================== */}
      <section className="py-24 bg-ceylon-navy text-white relative z-10 border-t-4 border-ceylon-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-ceylon-gold/40 shadow-navy">
            <Image
              src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1000&q=80"
              alt="Ceylon Chicken Lamprais Parcel"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">FROM OUR KITCHEN</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Ceylon Chicken Lamprais
            </h2>
            <p className="text-ceylon-cream/90 text-sm leading-relaxed font-light">
              Dutch Burgher delicacy baked in a banana leaf parcel: Ghee rice, spiced chicken curry, aubergine moju, frikkadels, and sweet seeni sambol.
            </p>
            <div className="flex items-baseline gap-4">
              <span className="font-serif-display text-4xl font-extrabold text-ceylon-gold gold-text-glow">£15.00</span>
              <span className="text-xs text-ceylon-cream/70 font-semibold">Wrapped & Baked Fresh</span>
            </div>
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron shadow-gold transition-all"
              >
                <span>ORDER LAMPRAIS PARCEL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 06 — BRAND / CEYLON STORY                                */}
      {/* ======================================================== */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-center space-y-8">
        <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">THE TASTE OF CEYLON</span>
        <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy max-w-3xl mx-auto leading-tight">
          "Some flavours are more than flavours. They bring memories back."
        </h2>
        <p className="text-gray-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          From Northern Jaffna roasted curries to Southern coconut-infused gravies, Ceylon Curry brings the warmth and royal banquet traditions of Sri Lanka to Mayflower Street.
        </p>
      </section>

      {/* ======================================================== */}
      {/* 07 — INGREDIENT STORY (WHERE THE FLAVOUR BEGINS)          */}
      {/* ======================================================== */}
      <section className="py-24 bg-white relative z-10 border-y border-ceylon-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block">
              FROM CEYLON'S SPICE TRAILS
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
              WHERE THE FLAVOUR BEGINS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-ceylon-cream border border-ceylon-gold/30 text-center space-y-3 shadow-card">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Ceylon Cinnamon</h3>
              <p className="text-xs text-gray-600 leading-relaxed">True Ceylon cinnamon quills giving fragrant subtle sweetness.</p>
            </div>
            <div className="p-8 rounded-3xl bg-ceylon-cream border border-ceylon-gold/30 text-center space-y-3 shadow-card">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Roasted Coriander</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Dark roasted in small batches for authentic Jaffna black curry.</p>
            </div>
            <div className="p-8 rounded-3xl bg-ceylon-cream border border-ceylon-gold/30 text-center space-y-3 shadow-card">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Fresh Coconut Milk</h3>
              <p className="text-xs text-gray-600 leading-relaxed">First-press coconut cream for rich, velvety curry gravies.</p>
            </div>
            <div className="p-8 rounded-3xl bg-ceylon-cream border border-ceylon-gold/30 text-center space-y-3 shadow-card">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Curry Leaves & Pandan</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Fresh karapincha tempered in hot coconut oil for island aroma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 08 — RESTAURANT EXPERIENCE (MORE THAN A MEAL)            */}
      {/* ======================================================== */}
      <section className="py-28 bg-ceylon-navy text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">RESTAURANT ATMOSPHERE</span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              MORE THAN A MEAL
            </h2>
            <p className="text-ceylon-cream/90 text-sm sm:text-base leading-relaxed font-light">
              Dining at Ceylon Curry is a celebration of warmth, conversation, and sharing. Whether booking an intimate couple table or a family banquet, our Plymouth dining room welcomes you.
            </p>
            <div className="pt-2">
              <Link
                href="/reserve"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron shadow-gold transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>RESERVE YOUR TABLE</span>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-ceylon-gold/40 shadow-navy">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
              alt="Ceylon Curry Plymouth Dining Room"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 09 — MORE PRODUCTS (MORE TO CRAVE)                       */}
      {/* ======================================================== */}
      <section className="py-24 bg-ceylon-cream relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block">
              MORE DISCOVERIES
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
              MORE TO CRAVE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {moreProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10 — RESERVATION (YOUR TABLE AWAITS)                     */}
      {/* ======================================================== */}
      <section className="py-28 bg-ceylon-navy text-white relative z-10 border-t-4 border-ceylon-gold">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">ONLINE BOOKINGS</span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white">
            YOUR TABLE AWAITS
          </h2>
          <p className="text-ceylon-cream/90 text-sm max-w-xl mx-auto font-light">
            Reserve your table for an authentic Ceylon dining experience. 7 seating options with 1-hour automatic table release protection.
          </p>
          <div className="pt-2">
            <Link
              href="/reserve"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron shadow-gold transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>RESERVE A TABLE NOW</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11 — CONTACT / LOCATION (COME FIND US)                   */}
      {/* ======================================================== */}
      <section className="py-24 bg-white text-ceylon-dark relative z-10 border-y border-ceylon-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block">
              LOCATION & HOURS
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-ceylon-navy">
              COME FIND US
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-ceylon-gold/40 text-center space-y-3 shadow-card">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-ceylon-navy text-ceylon-gold flex items-center justify-center shadow-md">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Restaurant Address</h3>
              <p className="text-xs font-bold text-gray-700">{addressStr}</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-ceylon-gold/40 text-center space-y-3 shadow-card">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-ceylon-navy text-ceylon-gold flex items-center justify-center shadow-md">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Telephone & WhatsApp</h3>
              <a href={formattedCallHref} className="text-sm font-extrabold text-ceylon-navy hover:underline block">{phoneNum}</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline block">WhatsApp: {whatsappNum}</a>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-ceylon-gold/40 text-center space-y-3 shadow-card">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-ceylon-navy text-ceylon-gold flex items-center justify-center shadow-md">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-ceylon-navy">Opening Hours</h3>
              <p className="text-xs font-extrabold text-gray-800">Monday - Sunday: {hoursStr}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
