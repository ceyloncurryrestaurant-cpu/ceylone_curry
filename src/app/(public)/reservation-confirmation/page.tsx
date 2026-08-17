"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";
import { Logo } from "@/components/Logo";
import { CheckCircle2, Calendar, Clock, Users, MapPin, Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");
  const { settings } = useSettings();

  const [reservation, setReservation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservation() {
      if (!reservationId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/reservations?id=${reservationId}`);
        const data = await res.json();
        if (data.success && data.reservations?.length > 0) {
          setReservation(data.reservations[0]);
        }
      } catch (err) {
        console.error("Error fetching reservation:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReservation();
  }, [reservationId]);

  return (
    <div className="min-h-screen bg-ceylon-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <Logo variant="watermark" />

      <div className="max-w-xl w-full mx-auto space-y-8 relative z-10 text-center">
        {/* Animated Checkmark Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-ceylon-blue text-ceylon-gold flex items-center justify-center shadow-gold border-4 border-ceylon-gold/40 animate-bounce">
          <CheckCircle2 className="w-14 h-14 fill-current text-ceylon-gold" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">
            RESERVATION CONFIRMED
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-ceylon-blue">
            We Look Forward to Welcoming You!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            A confirmation email has been dispatched with your reservation details.
          </p>
        </div>

        {/* Reference Summary Card */}
        {reservation && (
          <div className="glass-panel p-8 rounded-3xl border border-ceylon-gold/40 shadow-xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Booking Reference</span>
                <span className="font-serif-display text-xl font-extrabold text-ceylon-blue">
                  {reservation.reservationId}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {reservation.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-ceylon-gold" /> Date
                </span>
                <p className="font-bold text-ceylon-blue text-sm">{reservation.date}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-ceylon-gold" /> Time Slot
                </span>
                <p className="font-bold text-ceylon-blue text-sm">{reservation.time}</p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1 font-bold">
                  <Users className="w-3.5 h-3.5 text-ceylon-gold" /> Table & Guests
                </span>
                <p className="font-bold text-ceylon-blue text-sm">
                  Table {reservation.tableNumber} • {reservation.guestCount} Guests
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-ceylon-gold" /> Location
                </span>
                <p className="font-bold text-ceylon-blue text-xs">{settings.address}</p>
              </div>
            </div>

            {reservation.specialRequests && (
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Special Requests</span>
                <p className="text-xs text-gray-700 italic bg-gray-50 p-3 rounded-xl border border-gray-200">
                  "{reservation.specialRequests}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ceylon-blue text-white font-black uppercase text-xs tracking-wider shadow-blue hover:bg-ceylon-blue-dark transition-all"
          >
            Return to Homepage
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-ceylon-gold text-ceylon-blue font-black uppercase text-xs tracking-wider shadow-gold hover:bg-ceylon-gold-light transition-all"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ceylon-cream flex items-center justify-center">Loading reservation confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
