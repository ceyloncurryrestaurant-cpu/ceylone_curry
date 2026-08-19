"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useCart } from "@/context/CartContext";
import { Logo } from "./Logo";
import { ShoppingBag, Phone, Menu as MenuIcon, X, MessageCircle, MapPin } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Offers", href: "/offers", badge: "Deals" },
    { name: "Reserve a Table", href: "/reserve" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const phoneNum = settings?.mobileNumber || "01752 941504";
  const whatsappNum = settings?.whatsappNumber || "+441752941504";
  const addressStr = settings?.address || "44 Mayflower St, Plymouth PL1 1QX";
  const hoursStr = settings?.openingHours?.monday || "10:00 AM - 10:00 PM";

  const formattedCallHref = `tel:${phoneNum.replace(/\s+/g, "")}`;
  const whatsappUrl = getWhatsAppLink(whatsappNum);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 shadow-lg">
      {/* Top Notification Bar — Royal Navy Blue with White Text */}
      <div
        className={`bg-[#071B5C] text-white text-xs transition-all duration-300 border-b border-white/10 ${
          scrolled ? "max-h-0 py-0 opacity-0 overflow-hidden" : "py-2 px-4 hidden md:block opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-blue-200 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-ceylon-gold shrink-0" />
              {addressStr}
            </span>
            <span className="text-white/80 font-medium">🕒 Mon - Sun: {hoursStr}</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={formattedCallHref}
              className="hover:text-ceylon-gold transition-colors flex items-center gap-1.5 font-bold text-white"
            >
              <Phone className="w-3.5 h-3.5 text-ceylon-gold" />
              {phoneNum}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar — Pure White with Royal Navy Text */}
      <div className={`bg-white border-b border-blue-900/15 shadow-md transition-all duration-300 ${scrolled ? "py-1.5" : "py-2"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Logo variant="dark" size={scrolled ? "sm" : "md"} />

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs uppercase font-extrabold tracking-widest transition-all duration-300 ${
                    isActive
                      ? "text-[#071B5C] border-b-2 border-[#071B5C]"
                      : "text-[#071B5C]/80 hover:text-[#071B5C] hover:border-b-2 hover:border-[#071B5C]/40"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 px-2 py-0.5 text-[9px] font-black uppercase bg-ceylon-red text-white rounded-full shadow-md animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Shopping Bag & Call */}
          <div className="flex items-center space-x-3">
            <a
              href={formattedCallHref}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#071B5C] hover:bg-[#0D2A78] transition-all duration-300 shadow-md"
            >
              <Phone className="w-3.5 h-3.5 text-ceylon-gold" />
              <span>Call Us</span>
            </a>

            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative p-2.5 rounded-full bg-[#071B5C] hover:bg-[#0D2A78] text-white transition-all duration-300 shadow-md"
            >
              <ShoppingBag className="w-5 h-5 text-ceylon-gold" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ceylon-red text-[11px] font-black text-white shadow-md animate-bounce">
                  {totalCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#071B5C] bg-gray-100 hover:bg-gray-200 focus:outline-none border border-gray-300 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#071B5C]" /> : <MenuIcon className="w-6 h-6 text-[#071B5C]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer — True Transparent Glass Backdrop Blur with High Contrast Drop-Shadow Text */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-[#071B5C]/75 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-8 animate-fade-in text-white overflow-y-auto">
          <div className="flex justify-between items-center pb-6 border-b border-white/20 shrink-0">
            <Logo variant="light" size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 cursor-pointer shadow-md"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4 my-auto py-6">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 font-serif-display text-2xl sm:text-3xl font-extrabold tracking-wide transition-all border-b border-white/15 ${
                    isActive
                      ? "text-ceylon-gold border-b-2 border-ceylon-gold drop-shadow-md"
                      : "text-white hover:text-ceylon-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-3 py-1 text-xs font-sans font-black uppercase bg-ceylon-red text-white rounded-full shadow-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/20 space-y-4 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Direct Order</span>
            </a>
            <p className="text-center text-xs text-amber-200 font-semibold drop-shadow">
              📍 {addressStr} • 📞 {phoneNum}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
