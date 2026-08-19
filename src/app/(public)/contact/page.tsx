"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { Logo } from "@/components/Logo";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Sparkles } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { toast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formattedCallHref = `tel:${settings.mobileNumber.replace(/\s+/g, "")}`;
  const whatsappUrl = getWhatsAppLink(settings.whatsappNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you for your message! We will get back to you shortly.");
  };

  return (
    <div className="min-h-screen bg-white text-[#071B5C] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden space-y-16">
      {/* HERO BANNER — ROYAL NAVY */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#071B5C] text-white p-8 sm:p-16 text-center border-2 border-white/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
            alt="Ceylon Curry Atmosphere"
            fill
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-[#071B5C]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-gold" />
            GET IN TOUCH
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-white leading-tight">
            Contact Ceylon Curry
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm font-light leading-relaxed">
            We are located in the heart of Plymouth on Mayflower Street. Reach out for table reservations, catering inquiries, or takeaway orders.
          </p>
        </div>
      </div>

      {/* CONTACT DETAILS & FORM — BALANCED CONTRAST */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left: Contact Info Card (Warm Off-White Sandstone) */}
        <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-[3rem] border border-gray-200 text-[#071B5C] shadow-md space-y-8">
          <h2 className="font-serif-display text-3xl font-black text-[#071B5C]">Visit & Reach Us</h2>

          <ul className="space-y-6 text-sm">
            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-[#071B5C] text-ceylon-gold shrink-0 border border-ceylon-gold/30 shadow-md">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">Address</span>
                <p className="text-gray-800 font-medium mt-0.5">{settings.address}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-[#071B5C] text-ceylon-gold shrink-0 border border-ceylon-gold/30 shadow-md">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">Telephone</span>
                <a href={formattedCallHref} className="text-[#071B5C] font-bold hover:underline mt-0.5 block">
                  {settings.mobileNumber}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-700 text-white shrink-0 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">WhatsApp Orders</span>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline mt-0.5 block">
                  {settings.whatsappNumber}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-[#071B5C] text-ceylon-gold shrink-0 border border-ceylon-gold/30 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">Opening Hours</span>
                <p className="text-gray-800 font-semibold mt-0.5">Monday - Sunday: {settings.openingHours.monday}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Contact Form (Royal Navy Blue) */}
        <div className="bg-[#071B5C] text-white p-8 sm:p-12 rounded-[3rem] border-2 border-white/20 shadow-2xl space-y-6">
          <h2 className="font-serif-display text-3xl font-black text-white">Send Us a Message</h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center text-emerald-200 space-y-2">
              <h3 className="font-serif-display text-2xl font-bold text-emerald-400">Message Received!</h3>
              <p className="text-xs">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ceylon-gold uppercase block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-2xl border border-white/20 text-xs font-semibold focus:outline-none focus:border-ceylon-gold bg-[#0E3094] text-white placeholder-blue-200/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-gold uppercase block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-white/20 text-xs font-semibold focus:outline-none focus:border-ceylon-gold bg-[#0E3094] text-white placeholder-blue-200/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-gold uppercase block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you..."
                  className="w-full px-4 py-3 rounded-2xl border border-white/20 text-xs font-medium focus:outline-none focus:border-ceylon-gold bg-[#0E3094] text-white placeholder-blue-200/60"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase text-xs tracking-widest shadow-gold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
