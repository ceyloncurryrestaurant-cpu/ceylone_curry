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
    <footer className="relative bg-ceylon-volcanic text-ceylon-ivory overflow-hidden border-t-2 border-ceylon-copper">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 space-y-8">
        {/* Large Editorial Statement */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-6 border-b border-ceylon-bronze/20">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-ceylon-copper block">
            CEYLON CURRY • PLYMOUTH
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-black text-ceylon-ivory tracking-wide">
            COME HUNGRY. LEAVE WITH A STORY.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo variant="light" size="sm" />
            <p className="text-[11px] text-ceylon-sandstone leading-relaxed font-light">
              Authentic Sri Lankan curries, kottu roti, and traditional island delicacies cooked with hand-roasted Ceylon spices in Plymouth.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif-display text-base font-bold text-ceylon-copper uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-[11px] font-semibold text-ceylon-sandstone">
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

          <div className="space-y-3">
            <h4 className="font-serif-display text-base font-bold text-ceylon-copper uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="p-3.5 rounded-2xl bg-ceylon-cocoa/90 border border-ceylon-copper/20 text-[11px] space-y-1.5">
              <div className="flex items-center gap-2 text-ceylon-saffron font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>All Week Dining</span>
              </div>
              <p className="text-ceylon-ivory font-extrabold text-[11px]">
                Monday - Sunday: {hoursStr}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif-display text-base font-bold text-ceylon-copper uppercase tracking-wider">
              Contact & Location
            </h4>
            <ul className="space-y-2.5 text-[11px] text-ceylon-sandstone font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-ceylon-copper shrink-0 mt-0.5" />
                <span>{addressStr}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-ceylon-copper shrink-0" />
                <a href={formattedCallHref} className="hover:text-ceylon-saffron font-bold text-ceylon-ivory">
                  {phoneNum}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ceylon-copper shrink-0" />
                <span>{emailStr}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-ceylon-copper/30 to-transparent my-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-ceylon-sandstone">
          <p>© {new Date().getFullYear()} Ceylon Curry. Authentic Sri Lankan Cuisine in Plymouth. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <span>
              Developed by{" "}
              <a
                href="https://apptronsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ceylon-copper hover:text-ceylon-saffron transition-colors font-bold"
              >
                Apptron Solutions
              </a>
            </span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-ceylon-copper text-ceylon-volcanic hover:bg-ceylon-saffron transition-all shadow-copper"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
