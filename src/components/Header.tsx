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
    { name: "HOME", href: "/" },
    { name: "MENU", href: "/menu" },
    { name: "OFFERS", href: "/offers", badge: "Deals" },
    { name: "ABOUT", href: "/about" },
    { name: "RESERVE", href: "/reserve" },
    { name: "CONTACT", href: "/contact" },
  ];

  const phoneNum = settings?.mobileNumber || "01752 941504";
  const whatsappNum = settings?.whatsappNumber || "+441752941504";
  const addressStr = settings?.address || "44 Mayflower St, Plymouth PL1 1QX";
  const hoursStr = settings?.openingHours?.monday || "10:00 AM - 10:00 PM";

  const formattedCallHref = `tel:${phoneNum.replace(/\s+/g, "")}`;
  const whatsappUrl = getWhatsAppLink(whatsappNum);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ceylon-navy/95 backdrop-blur-md shadow-navy border-b border-ceylon-gold/40 py-2.5"
          : "bg-ceylon-navy border-b border-white/10 py-3.5"
      }`}
    >
      {/* Top Announcement Bar */}
      <div
        className={`bg-ceylon-navy-dark text-white/90 text-xs transition-all duration-300 border-b border-white/5 ${
          scrolled ? "max-h-0 py-0 opacity-0 overflow-hidden" : "py-1.5 px-4 hidden md:block opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-ceylon-gold font-bold">
              <MapPin className="w-3.5 h-3.5 text-ceylon-gold shrink-0" />
              {addressStr}
            </span>
            <span className="text-white/80 font-medium">🕒 Monday - Sunday: {hoursStr}</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={formattedCallHref}
              className="hover:text-ceylon-gold transition-colors flex items-center gap-1.5 font-bold"
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

      {/* Main Navbar: Logo Left, Links Center, Call + Cart Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Transparent Ceylon Curry Logo */}
        <Logo variant="light" size={scrolled ? "sm" : "md"} />

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-hover relative px-3.5 py-2 text-xs font-black tracking-widest transition-all duration-200 ${
                  isActive ? "text-ceylon-gold nav-link-active" : "text-ceylon-cream hover:text-ceylon-gold"
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black uppercase bg-ceylon-red text-white rounded-full animate-pulse shadow-md">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Call Button & Cart */}
        <div className="flex items-center space-x-3">
          <a
            href={formattedCallHref}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all shadow-gold transform hover:-translate-y-0.5"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>Call</span>
          </a>

          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-ceylon-gold/40 shadow-sm"
          >
            <ShoppingBag className="w-5 h-5 text-ceylon-gold" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ceylon-red text-white text-[11px] font-black shadow-md animate-bounce">
                {totalCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-ceylon-gold" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ceylon-navy-dark border-b-2 border-ceylon-gold/40 px-6 pt-6 pb-8 space-y-4 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-1 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-extrabold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-ceylon-gold text-ceylon-dark shadow-gold"
                      : "text-ceylon-cream hover:bg-white/10 hover:text-ceylon-gold"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-[10px] bg-ceylon-red text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <a
              href={formattedCallHref}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-black uppercase text-xs tracking-wider bg-ceylon-gold text-ceylon-dark shadow-gold"
            >
              <Phone className="w-4 h-4" />
              <span>Call {phoneNum}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-black uppercase text-xs tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
