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
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden space-y-16">
      <Logo variant="watermark" />

      {/* HERO BANNER */}
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-volcanic bg-ceylon-cocoa text-ceylon-ivory p-8 sm:p-16 text-center border-2 border-ceylon-copper/40">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80"
            alt="Ceylon Curry Atmosphere"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-ceylon-cocoa/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-saffron" />
            GET IN TOUCH
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-ceylon-ivory leading-tight">
            Contact Ceylon Curry
          </h1>
          <p className="text-ceylon-sandstone text-xs sm:text-sm font-light leading-relaxed">
            We are located in the heart of Plymouth on Mayflower Street. Reach out for table reservations, catering inquiries, or takeaway orders.
          </p>
        </div>
      </div>

      {/* CONTACT DETAILS & FORM */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left: Contact Info Card */}
        <div className="glass-cocoa p-8 sm:p-12 rounded-[3rem] border-2 border-ceylon-copper/40 text-ceylon-ivory shadow-volcanic space-y-8">
          <h2 className="font-serif-display text-3xl font-black text-ceylon-ivory">Visit & Reach Us</h2>

          <ul className="space-y-6 text-sm">
            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 border border-ceylon-copper/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">Address</span>
                <p className="text-ceylon-ivory font-medium mt-0.5">{settings.address}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 border border-ceylon-copper/30">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">Telephone</span>
                <a href={formattedCallHref} className="text-ceylon-saffron font-bold hover:underline mt-0.5 block">
                  {settings.mobileNumber}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-ceylon-volcanic text-emerald-400 shrink-0 border border-ceylon-copper/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">WhatsApp Orders</span>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline mt-0.5 block">
                  {settings.whatsappNumber}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-ceylon-volcanic text-ceylon-copper shrink-0 border border-ceylon-copper/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">Opening Hours</span>
                <p className="text-ceylon-ivory font-semibold mt-0.5">Monday - Sunday: {settings.openingHours.monday}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right: Contact Form */}
        <div className="glass-cocoa p-8 sm:p-12 rounded-[3rem] border border-ceylon-copper/40 shadow-volcanic space-y-6">
          <h2 className="font-serif-display text-3xl font-black text-ceylon-ivory">Send Us a Message</h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center text-emerald-200 space-y-2">
              <h3 className="font-serif-display text-2xl font-bold text-emerald-400">Message Received!</h3>
              <p className="text-xs">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-semibold focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-semibold focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you..."
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-medium focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper transition-all flex items-center justify-center gap-2 cursor-pointer"
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
