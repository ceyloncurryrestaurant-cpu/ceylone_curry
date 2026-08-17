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
    <footer className="relative bg-ceylon-volcanic text-ceylon-ivory overflow-hidden border-t-4 border-ceylon-copper">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        {/* Large Editorial Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-8 border-b border-ceylon-bronze/30">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            CEYLON CURRY • PLYMOUTH
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-black text-ceylon-ivory tracking-wide">
            COME HUNGRY. LEAVE WITH A STORY.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-ceylon-sandstone leading-relaxed font-light">
              Authentic Sri Lankan curries, kottu roti, and traditional island delicacies cooked with hand-roasted Ceylon spices in Plymouth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-full bg-ceylon-cocoa hover:bg-emerald-500 hover:text-white transition-all text-emerald-400 border border-ceylon-copper/30 flex items-center justify-center shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-xl font-bold text-ceylon-copper uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-ceylon-sandstone">
              <li>
                <Link href="/" className="hover:text-ceylon-saffron transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-ceylon-saffron transition-colors">
                  Menu Catalog
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-ceylon-saffron transition-colors">
                  Chef's Offers
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="hover:text-ceylon-saffron transition-colors">
                  Reserve a Table
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ceylon-saffron transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ceylon-saffron transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-xl font-bold text-ceylon-copper uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="p-4 rounded-2xl bg-ceylon-cocoa/90 border border-ceylon-copper/30 text-xs space-y-2">
              <div className="flex items-center gap-2 text-ceylon-saffron font-bold">
                <Clock className="w-4 h-4 shrink-0" />
                <span>All Week Dining</span>
              </div>
              <p className="text-ceylon-ivory font-extrabold text-xs">
                Monday - Sunday: {hoursStr}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif-display text-xl font-bold text-ceylon-copper uppercase tracking-wider">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs text-ceylon-sandstone font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-ceylon-copper shrink-0 mt-0.5" />
                <span>{addressStr}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-ceylon-copper shrink-0" />
                <a href={formattedCallHref} className="hover:text-ceylon-saffron font-bold text-ceylon-ivory">
                  {phoneNum}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-ceylon-copper shrink-0" />
                <span>{emailStr}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-ceylon-copper/50 to-transparent my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-ceylon-sandstone">
          <p>© {new Date().getFullYear()} Ceylon Curry. Authentic Sri Lankan Cuisine in Plymouth. All Rights Reserved.</p>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-ceylon-copper text-ceylon-volcanic hover:bg-ceylon-saffron transition-all shadow-copper"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
