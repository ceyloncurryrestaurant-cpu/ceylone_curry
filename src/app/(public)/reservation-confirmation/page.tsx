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
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center">
      <div className="grain-overlay" />

      <div className="max-w-xl w-full mx-auto space-y-8 relative z-10 text-center">
        {/* Animated Checkmark Icon */}
        <div className="w-24 h-24 mx-auto rounded-full bg-ceylon-copper text-ceylon-volcanic flex items-center justify-center shadow-copper border-4 border-ceylon-saffron/50 animate-bounce">
          <CheckCircle2 className="w-14 h-14 fill-current text-ceylon-volcanic" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper block">
            RESERVATION CONFIRMED
          </span>
          <h1 className="font-serif-display text-3xl sm:text-5xl font-black text-ceylon-ivory leading-tight">
            We Look Forward to Welcoming You!
          </h1>
          <p className="text-xs sm:text-sm text-ceylon-sandstone font-light">
            A confirmation email has been dispatched with your reservation details.
          </p>
        </div>

        {/* Reference Summary Card */}
        <div className="glass-cocoa p-8 rounded-[2.5rem] border-2 border-ceylon-copper/40 shadow-volcanic space-y-6 text-left text-ceylon-ivory">
          <div className="flex justify-between items-center border-b border-ceylon-bronze/30 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-ceylon-copper block">Booking Reference</span>
              <span className="font-serif-display text-2xl font-black text-ceylon-saffron">
                {reservation?.reservationNumber || reservationId || "CC-CONFIRMED"}
              </span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              {reservation?.status || "PENDING"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 text-xs font-medium">
            <div className="space-y-1">
              <span className="text-ceylon-copper flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-ceylon-saffron" /> Date
              </span>
              <p className="font-bold text-ceylon-ivory text-sm">
                {reservation?.date || "Selected Date"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-ceylon-copper flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                <Clock className="w-3.5 h-3.5 text-ceylon-saffron" /> Arrival Time
              </span>
              <p className="font-bold text-ceylon-ivory text-sm">
                {reservation?.startTime || "Selected Time"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-ceylon-copper flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                <Users className="w-3.5 h-3.5 text-ceylon-saffron" /> Table & Guests
              </span>
              <p className="font-bold text-ceylon-ivory text-sm">
                {reservation?.tableId?.tableNumber ? `Table ${reservation.tableId.tableNumber}` : "Table Seating"} • {reservation?.guestCount || 2} Guests
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-ceylon-copper flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-ceylon-saffron" /> Location
              </span>
              <p className="font-bold text-ceylon-sandstone text-xs">
                {settings?.address || "44 Mayflower St, Plymouth PL1 1QX"}
              </p>
            </div>
          </div>

          {reservation?.specialRequest && (
            <div className="pt-3 border-t border-ceylon-bronze/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-ceylon-copper block">Special Requests</span>
              <p className="text-xs text-ceylon-sandstone italic bg-ceylon-volcanic/80 p-3.5 rounded-2xl border border-ceylon-copper/30">
                "{reservation.specialRequest}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper transition-all"
          >
            Return to Homepage
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-ceylon-cocoa hover:bg-ceylon-volcanic text-ceylon-ivory font-black uppercase text-xs tracking-widest border border-ceylon-copper/40 shadow-volcanic transition-all"
          >
            Explore Menu Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory flex items-center justify-center">Loading reservation confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
