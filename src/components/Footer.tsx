"use client";

import React from "react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { Logo } from "./Logo";
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowUp, Share2, Globe } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const phoneNum = settings?.mobileNumber || "01752 941504";
  const whatsappNum = settings?.whatsappNumber || "+441752941504";
  const addressStr = settings?.address || "44 Mayflower St, Plymouth PL1 1QX";
  const hoursStr = settings?.openingHours?.monday || "10:00 AM - 10:00 PM";
  const emailStr = settings?.restaurantEmail || "info@ceyloncurry.co.uk";
  const fbUrl = settings?.socialLinks?.facebook || "https://facebook.com/ceyloncurry";
  const igUrl = settings?.socialLinks?.instagram || "https://instagram.com/ceyloncurry";

  const formattedCallHref = `tel:${phoneNum.replace(/\s+/g, "")}`;
  const whatsappUrl = getWhatsAppLink(whatsappNum);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-ceylon-navy text-white overflow-hidden border-t-4 border-ceylon-gold">
      {/* Large Transparent Logo Watermark */}
      <Logo variant="watermark" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        {/* Large Statement Banner */}
        <div className="text-center space-y-2 pb-8 border-b border-white/10">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold">CEYLON CURRY PLYMOUTH</span>
          <h2 className="font-serif-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            COME HUNGRY. LEAVE HAPPY.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-ceylon-cream/80 leading-relaxed font-light">
              Authentic Sri Lankan curries, kottu roti, and traditional island delicacies cooked with hand-roasted Ceylon spices in Plymouth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark transition-all text-white border border-white/20 flex items-center justify-center"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-ceylon-dark transition-all text-white border border-white/20 flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-white transition-all text-emerald-400 border border-white/20 flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-lg font-bold text-ceylon-gold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-white/90">
              <li>
                <Link href="/" className="hover:text-ceylon-gold transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-ceylon-gold transition-colors">
                  MENU CATALOG
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-ceylon-gold transition-colors">
                  CHEF'S OFFERS
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="hover:text-ceylon-gold transition-colors">
                  RESERVE A TABLE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ceylon-gold transition-colors">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ceylon-gold transition-colors">
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-lg font-bold text-ceylon-gold uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="p-4 rounded-2xl bg-white/10 border border-ceylon-gold/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-ceylon-gold font-bold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>All Week Dining</span>
              </div>
              <p className="text-white font-extrabold text-xs">
                Monday - Sunday: {hoursStr}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-lg font-bold text-ceylon-gold uppercase tracking-wider">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-white/90 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ceylon-gold shrink-0 mt-0.5" />
                <span>{addressStr}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ceylon-gold shrink-0" />
                <a href={formattedCallHref} className="hover:text-ceylon-gold font-bold">
                  {phoneNum}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ceylon-gold shrink-0" />
                <span>{emailStr}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-ceylon-gold/50 to-transparent my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/70">
          <p>© {new Date().getFullYear()} Ceylon Curry. Authentic Sri Lankan Cuisine in Plymouth. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-ceylon-gold text-ceylon-dark hover:bg-ceylon-gold-saffron transition-all shadow-gold"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
