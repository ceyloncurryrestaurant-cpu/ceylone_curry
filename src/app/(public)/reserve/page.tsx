"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { Logo } from "@/components/Logo";
import { Calendar as CalendarIcon, Clock, Users, CheckCircle, ShieldAlert, Sparkles, User, Mail, Phone, MessageSquare, Info, Check, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function ReservePage() {
  const router = useRouter();
  const { settings } = useSettings();

  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState<string>("18:00");
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [tables, setTables] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Generate 30-day date options (1 full month ahead)
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }),
    };
  });

  // Expanded 15-minute & 30-minute time slots from 10:00 AM to 11:00 PM
  const timeSlots = [
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "12:00", "12:15", "12:30", "12:45",
    "13:00", "13:15", "13:30", "13:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45",
    "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45",
    "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30", "21:45",
    "22:00", "22:15", "22:30", "22:45", "23:00"
  ];

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate, selectedTime]);

  async function fetchAvailability() {
    setLoading(true);
    try {
      const [tRes, rRes] = await Promise.all([
        fetch("/api/tables"),
        fetch(`/api/reservations?date=${selectedDate}`),
      ]);
      const tData = await tRes.json();
      const rData = await rRes.json();

      if (tData.success) setTables(tData.tables);
      if (rData.success) setReservations(rData.reservations);
    } catch (err) {
      toast.error("Failed to load table availability.");
    } finally {
      setLoading(false);
    }
  }

  // 1-Hour Overlap Protection Validation
  const isTableOccupied = (tableId: string) => {
    if (!selectedTime) return false;
    const [reqHours, reqMins] = selectedTime.split(":").map(Number);
    const reqStartTotal = reqHours * 60 + reqMins;
    const reqEndTotal = reqStartTotal + 60;

    return reservations.some((res: any) => {
      if (res.tableId?._id !== tableId && res.tableId !== tableId) return false;
      if (res.status === "Cancelled" || res.status === "No Show" || res.status === "Completed") return false;

      const [resHours, resMins] = res.startTime ? res.startTime.split(":").map(Number) : [0, 0];
      const resStartTotal = resHours * 60 + resMins;
      const resEndTotal = resStartTotal + 60;

      return reqStartTotal < resEndTotal && reqEndTotal > resStartTotal;
    });
  };

  const handleTableSelect = (table: any) => {
    if (isTableOccupied(table._id)) {
      toast.error(`Table ${table.tableNumber} is reserved during ${selectedTime}.`, {
        description: "Please pick another table or time slot.",
      });
      return;
    }

    if (guestCount > table.capacity) {
      toast.error(`Table ${table.tableNumber} max capacity is ${table.capacity} guests.`, {
        description: `Your party size is ${guestCount}. Please select a Family Table (4 Seats).`,
      });
      return;
    }

    setSelectedTable(table);
    toast.success(`Table ${table.tableNumber} (${table.type}, ${table.capacity} Seats) Selected!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTable) {
      toast.error("Please select a table from our seating options.");
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error("Please fill in all contact details.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: selectedTable._id,
          date: selectedDate,
          startTime: selectedTime,
          guestCount,
          customerName,
          email: customerEmail,
          mobile: customerPhone,
          specialRequest: specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Reservation confirmed!");
        router.push(`/reservation-confirmation?id=${data.reservationNumber || data.reservation?.reservationNumber}`);
      } else {
        toast.error(data.error || "Reservation failed.");
      }
    } catch (err) {
      toast.error("Network error during booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden shadow-volcanic bg-ceylon-cocoa text-ceylon-ivory p-8 sm:p-14 text-center border-2 border-ceylon-copper/40">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
              alt="Dining Room Atmosphere"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-ceylon-cocoa/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-ceylon-saffron" />
              TABLE SEATING & RESERVATIONS
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-ceylon-ivory leading-tight">
              Reserve Your Dining Table
            </h1>
            <p className="text-ceylon-sandstone text-xs sm:text-sm font-light leading-relaxed">
              Explore our 7 visual table seating options. Select your date, time, and table seating photo for an unforgettable dining experience.
            </p>
          </div>
        </div>

        {/* 5-STEP JOURNEY STEPPER */}
        <div className="glass-cocoa p-4 rounded-2xl border border-ceylon-copper/40 flex justify-between items-center text-xs font-black uppercase tracking-widest overflow-x-auto shadow-volcanic">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 1 ? "bg-ceylon-copper text-ceylon-volcanic" : "text-ceylon-sandstone/40"}`}>
            <span>01 DATE</span>
          </div>
          <span className="text-ceylon-bronze">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 2 ? "bg-ceylon-copper text-ceylon-volcanic" : "text-ceylon-sandstone/40"}`}>
            <span>02 TIME & PARTY</span>
          </div>
          <span className="text-ceylon-bronze">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 3 ? "bg-ceylon-copper text-ceylon-volcanic" : "text-ceylon-sandstone/40"}`}>
            <span>03 SELECT TABLE IMAGE</span>
          </div>
          <span className="text-ceylon-bronze">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 4 ? "bg-ceylon-copper text-ceylon-volcanic" : "text-ceylon-sandstone/40"}`}>
            <span>04 DETAILS</span>
          </div>
        </div>

        {/* MAIN BOOKING GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Date, Time & Guest Selectors */}
          <div className="space-y-6 lg:col-span-1">
            {/* Step 1: Clean Date Selector */}
            <div className="glass-cocoa p-6 rounded-3xl border border-ceylon-copper/40 space-y-4 shadow-volcanic">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-ivory flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-ceylon-copper" />
                1. Select Reservation Date
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">
                  Reservation Date *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    required
                    style={{ colorScheme: "dark" }}
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setSelectedTable(null);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/50 bg-ceylon-volcanic text-ceylon-ivory text-sm font-bold focus:outline-none focus:border-ceylon-saffron cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Time & Party Size Selector */}
            <div className="glass-cocoa p-6 rounded-3xl border border-ceylon-copper/40 space-y-4 shadow-volcanic">
              <h3 className="font-serif-display text-xl font-bold text-ceylon-ivory flex items-center gap-2">
                <Clock className="w-5 h-5 text-ceylon-copper" />
                2. Select Time & Guests
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">
                  Party Size (Guests)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setGuestCount(num);
                        setSelectedTable(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                        guestCount === num
                          ? "bg-ceylon-copper text-ceylon-volcanic border-ceylon-copper shadow-copper"
                          : "bg-ceylon-volcanic text-ceylon-ivory border-ceylon-copper/30 hover:border-ceylon-copper"
                      }`}
                    >
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Direct Time Input */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-ceylon-copper uppercase tracking-wider block">
                  Reservation Arrival Time *
                </label>
                <input
                  type="time"
                  required
                  style={{ colorScheme: "dark" }}
                  value={selectedTime}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedTime(e.target.value);
                      setSelectedTable(null);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/50 bg-ceylon-volcanic text-ceylon-ivory text-sm font-bold focus:outline-none focus:border-ceylon-saffron cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Visual Tables Showcase with Individual Photos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-cocoa p-6 sm:p-8 rounded-[3rem] border border-ceylon-copper/40 shadow-volcanic space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-ceylon-bronze/30 pb-4">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">
                    3. Select Restaurant Table Experience
                  </h3>
                  <p className="text-xs text-ceylon-sandstone font-light mt-0.5">
                    Click any table card below to view its photograph and select it for your booking.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-ceylon-chilli inline-block shadow-sm" /> Reserved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-ceylon-copper inline-block shadow-sm" /> Selected
                  </span>
                </div>
              </div>

              {/* Table Seating Cards Grid with Prominent Photographs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => {
                  const occupied = isTableOccupied(table._id);
                  const isSelected = selectedTable?._id === table._id;
                  const tableImg = table.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";

                  return (
                    <div
                      key={table._id}
                      onClick={() => !occupied && handleTableSelect(table)}
                      className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer transform ${
                        occupied
                          ? "opacity-40 border-ceylon-bronze/20 cursor-not-allowed"
                          : isSelected
                          ? "border-ceylon-copper shadow-copper-lg scale-105 ring-4 ring-ceylon-copper/40"
                          : "border-ceylon-copper/30 hover:border-ceylon-copper hover:-translate-y-1.5 shadow-volcanic"
                      }`}
                    >
                      {/* Seating Photography */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ceylon-volcanic">
                        <Image
                          src={tableImg}
                          alt={`Table ${table.tableNumber} Dining Experience`}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ceylon-volcanic via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              occupied
                                ? "bg-ceylon-chilli text-white"
                                : isSelected
                                ? "bg-ceylon-copper text-ceylon-volcanic shadow-copper"
                                : "bg-emerald-600 text-white shadow-md"
                            }`}
                          >
                            {occupied ? "Reserved" : isSelected ? "✓ Selected" : "Available"}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 z-10 text-ceylon-ivory">
                          <div className="flex justify-between items-end">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-widest text-ceylon-copper block">
                                Table 0{table.tableNumber}
                              </span>
                              <h4 className="font-serif-display text-lg font-bold text-ceylon-ivory">
                                {table.type} Table
                              </h4>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-ceylon-volcanic/80 backdrop-blur-md text-[10px] font-black text-ceylon-saffron border border-ceylon-copper/30">
                              {table.capacity} Seats
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Table Experience Preview Card */}
              {selectedTable && (
                <div className="bg-ceylon-volcanic text-ceylon-ivory p-6 sm:p-8 rounded-[3rem] border-2 border-ceylon-copper/50 shadow-volcanic space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-ceylon-copper/40 shadow-xl">
                      <Image
                        src={selectedTable.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"}
                        alt={`Table ${selectedTable.tableNumber}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-ceylon-copper uppercase tracking-widest block">
                        Selected Table Experience
                      </span>
                      <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-ceylon-ivory">
                        Table 0{selectedTable.tableNumber} ({selectedTable.type})
                      </h3>
                      <p className="text-xs text-ceylon-sandstone leading-relaxed font-light">
                        Enjoy your Ceylon dining experience at Table {selectedTable.tableNumber} for {guestCount} guests on {selectedDate} at {selectedTime}.
                      </p>
                    </div>
                  </div>

                  {/* Customer Details Form */}
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-ceylon-bronze/30">
                    <h4 className="font-serif-display text-xl font-bold text-ceylon-copper">
                      4. Guest Contact Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-ceylon-sandstone uppercase block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="John Smith"
                          className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 bg-ceylon-cocoa text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-ceylon-sandstone uppercase block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 bg-ceylon-cocoa text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-ceylon-sandstone uppercase block mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="07123 456789"
                          className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 bg-ceylon-cocoa text-ceylon-ivory text-xs font-semibold focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-ceylon-sandstone uppercase block mb-1">Special Requests (Optional)</label>
                      <textarea
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Window seat, anniversary, high chair needed..."
                        className="w-full px-4 py-2.5 rounded-xl border border-ceylon-copper/40 bg-ceylon-cocoa text-ceylon-ivory text-xs focus:outline-none focus:border-ceylon-saffron"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-10 py-4 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase tracking-widest shadow-copper transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        {submitting ? "Confirming..." : "Confirm Table Reservation"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
