"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";
import { Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export function ReservePageClient() {
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
    if (isTableOccupied(table._id) || table.status !== "Available") {
      toast.error(`Table ${table.tableNumber} is reserved or unavailable.`, {
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

    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localDateStr = new Date(now.getTime() - tzOffset).toISOString().split("T")[0];

    if (selectedDate < localDateStr) {
      toast.error("Reservations cannot be made for past dates.");
      return;
    }

    if (selectedDate === localDateStr) {
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const [reqHours, reqMins] = selectedTime.split(":").map(Number);

      if (reqHours < currentHours || (reqHours === currentHours && reqMins <= currentMinutes)) {
        toast.error("Reservations cannot be made for past times today.");
        return;
      }
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#071B5C] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#071B5C] text-white p-8 sm:p-14 text-center border-2 border-white/20">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
              alt="Dining Room Atmosphere"
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-[#071B5C]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-ceylon-gold" />
              TABLE SEATING & RESERVATIONS
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl font-black text-white leading-tight">
              Reserve Your Dining Table
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-light leading-relaxed">
              Explore our 7 visual table seating options. Select your date, time, and table seating photo for an unforgettable dining experience.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-300 flex justify-between items-center text-xs font-black uppercase tracking-widest overflow-x-auto shadow-md text-[#071B5C]">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 1 ? "bg-[#071B5C] text-white" : "text-gray-400"}`}>
            <span>01 DATE</span>
          </div>
          <span className="text-gray-300">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 2 ? "bg-[#071B5C] text-white" : "text-gray-400"}`}>
            <span>02 TIME & PARTY</span>
          </div>
          <span className="text-gray-300">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 3 ? "bg-[#071B5C] text-white" : "text-gray-400"}`}>
            <span>03 SELECT TABLE IMAGE</span>
          </div>
          <span className="text-gray-300">›</span>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${step >= 4 ? "bg-[#071B5C] text-white" : "text-gray-400"}`}>
            <span>04 DETAILS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-md text-[#071B5C]">
              <h3 className="font-serif-display text-xl font-bold text-[#071B5C] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#071B5C]" />
                1. Select Reservation Date
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">
                  Reservation Date *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedDate(e.target.value);
                        setSelectedTable(null);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 text-[#071B5C] text-sm font-bold focus:outline-none focus:border-[#071B5C] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-md text-[#071B5C]">
              <h3 className="font-serif-display text-xl font-bold text-[#071B5C] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#071B5C]" />
                2. Select Time & Guests
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">
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
                          ? "bg-[#071B5C] text-white border-[#071B5C] shadow-md"
                          : "bg-gray-50 text-[#071B5C] border-gray-300 hover:border-[#071B5C]"
                      }`}
                    >
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#071B5C] uppercase tracking-wider block">
                  Reservation Arrival Time *
                </label>
                <input
                  type="time"
                  required
                  value={selectedTime}
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedTime(e.target.value);
                      setSelectedTable(null);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 bg-gray-50 text-[#071B5C] text-sm font-bold focus:outline-none focus:border-[#071B5C] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-3 sm:p-8 rounded-2xl sm:rounded-[3rem] border border-gray-200 shadow-md text-[#071B5C] space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200 pb-3 sm:pb-4">
                <div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#071B5C]">
                    3. Select Restaurant Table Experience
                  </h3>
                  <p className="text-xs text-gray-600 font-light mt-0.5">
                    Click any table card below to view its photograph and select it for your booking.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" /> Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-ceylon-red inline-block shadow-sm" /> Reserved
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#071B5C] inline-block shadow-sm" /> Selected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3">
                {tables.map((table) => {
                  const occupied = isTableOccupied(table._id) || table.status !== "Available";
                  const isSelected = selectedTable?._id === table._id;
                  const tableImg = table.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";

                  return (
                    <div
                      key={table._id}
                      onClick={() => !occupied && handleTableSelect(table)}
                      className={`group relative rounded-xl sm:rounded-3xl overflow-hidden border border-gray-300 sm:border-2 transition-all duration-300 cursor-pointer transform min-w-0 w-full ${
                        occupied
                          ? "opacity-40 border-gray-200 cursor-not-allowed"
                          : isSelected
                          ? "border-[#071B5C] shadow-2xl scale-[1.02] sm:scale-105 ring-2 sm:ring-4 ring-[#071B5C]/30"
                          : "border-gray-200 hover:border-[#071B5C] hover:-translate-y-1 shadow-md"
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071B5C]">
                        <Image
                          src={tableImg}
                          alt={`Table ${table.tableNumber} Dining Experience`}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-[#071B5C]/20 to-transparent" />

                        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 flex gap-1 sm:gap-2">
                          <span
                            className={`px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[7px] sm:text-[10px] font-black uppercase tracking-wider ${
                              occupied
                                ? "bg-ceylon-red text-white"
                                : isSelected
                                ? "bg-[#071B5C] text-white shadow-md"
                                : "bg-emerald-600 text-white shadow-md"
                            }`}
                          >
                            {occupied ? "Reserved" : isSelected ? "✓ Selected" : "Available"}
                          </span>
                        </div>

                        <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 text-white">
                          <div className="flex justify-between items-end gap-1">
                            <div className="min-w-0">
                              <span className="text-[7px] sm:text-[10px] font-extrabold uppercase tracking-widest text-ceylon-gold block truncate">
                                Table 0{table.tableNumber}
                              </span>
                              <h4 className="font-serif-display text-[10px] sm:text-lg font-bold text-white leading-tight truncate">
                                {table.type} Table
                              </h4>
                            </div>
                            <span className="px-1 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#071B5C]/90 backdrop-blur-md text-[7px] sm:text-[10px] font-black text-ceylon-gold border border-white/20 shrink-0">
                              {table.capacity} Seats
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedTable && (
                <div className="bg-[#071B5C] text-white p-6 sm:p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                      <Image
                        src={selectedTable.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"}
                        alt={`Table ${selectedTable.tableNumber}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-bold text-ceylon-gold uppercase tracking-widest block">
                        Selected Table Experience
                      </span>
                      <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-white">
                        Table 0{selectedTable.tableNumber} ({selectedTable.type})
                      </h3>
                      <p className="text-xs text-blue-100 leading-relaxed font-light">
                        Enjoy your Ceylon dining experience at Table {selectedTable.tableNumber} for {guestCount} guests on {selectedDate} at {selectedTime}.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/20">
                    <h4 className="font-serif-display text-xl font-bold text-ceylon-gold">
                      4. Guest Contact Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-blue-100 uppercase block mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="John Smith"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-[#0E3094] text-white text-xs font-semibold focus:outline-none focus:border-ceylon-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-blue-100 uppercase block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-[#0E3094] text-white text-xs font-semibold focus:outline-none focus:border-ceylon-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-blue-100 uppercase block mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="07123 456789"
                          className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-[#0E3094] text-white text-xs font-semibold focus:outline-none focus:border-ceylon-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-blue-100 uppercase block mb-1">Special Requests (Optional)</label>
                      <textarea
                        rows={2}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Window seat, anniversary, high chair needed..."
                        className="w-full px-4 py-2.5 rounded-xl border border-white/20 bg-[#0E3094] text-white text-xs focus:outline-none focus:border-ceylon-gold"
                      />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto px-10 py-4 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase tracking-widest shadow-gold transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
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
