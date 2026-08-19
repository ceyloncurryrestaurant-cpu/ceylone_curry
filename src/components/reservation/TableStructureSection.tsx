"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, Clock, Check, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface TableItem {
  _id: string;
  tableNumber: number;
  capacity: number;
  type: string;
  status: string;
  isAvailableForSlot?: boolean;
}

export const TableStructureSection: React.FC = () => {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Table Seating High-Res Photographs for Tables 1 to 7
  const tablePhotos: { [key: number]: string } = {
    1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    2: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    3: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    4: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    5: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
    6: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80",
    7: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80",
  };

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await fetch("/api/tables");
        const data = await res.json();
        if (data.success && data.tables) {
          setTables(data.tables);
        }
      } catch (err) {
        console.error("Error fetching homepage table structure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, []);

  return (
    <section className="py-28 bg-ceylon-navy text-white relative z-10 border-y-4 border-ceylon-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-ceylon-gold/40 backdrop-blur-md shadow-gold">
            <Calendar className="w-4 h-4 text-ceylon-gold" />
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-ceylon-gold">
              7-TABLE SEATING LAYOUT
            </span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-5xl font-extrabold text-white">
            YOUR TABLE AWAITS
          </h2>
          <p className="text-ceylon-cream/90 text-sm font-light leading-relaxed">
            Select your preferred dining table below. Every reservation includes automatic 1-hour window protection and email confirmation.
          </p>
        </div>

        {/* 7-Table Photography Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="h-72 rounded-3xl bg-white/10 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.slice(0, 7).map((t) => {
              const photoUrl = tablePhotos[t.tableNumber] || tablePhotos[1];
              return (
                <div
                  key={t._id}
                  className="group relative rounded-3xl overflow-hidden bg-ceylon-blue-deep border-2 border-ceylon-gold/40 shadow-navy hover:shadow-gold transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between"
                >
                  {/* Seating Photography */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden block">
                    <Image
                      src={photoUrl}
                      alt={`Table ${t.tableNumber} Seating`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ceylon-navy via-transparent to-transparent opacity-75" />

                    {/* Table Badge */}
                    <div className="absolute top-3 left-3 bg-ceylon-navy text-ceylon-gold text-xs font-black px-3 py-1 rounded-full border border-ceylon-gold/50 shadow-md">
                      TABLE {t.tableNumber}
                    </div>

                    {/* Capacity Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                      <Users className="w-3 h-3 text-ceylon-gold" />
                      <span>{t.capacity} Guests</span>
                    </div>
                  </div>

                  {/* Table Info & Booking CTA */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif-display text-lg font-bold text-white">
                        {t.capacity === 2 ? "Couple Table" : "Family Banquet Table"}
                      </h3>
                      <p className="text-[11px] text-ceylon-cream/80 font-light mt-0.5">
                        {t.capacity === 2 ? "Intimate dining setting" : "Spacious family seating"}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Available
                      </span>

                      <Link
                        href={`/reserve?table=${t.tableNumber}`}
                        className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all shadow-gold flex items-center gap-1"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/reserve"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest text-ceylon-dark bg-ceylon-gold hover:bg-ceylon-gold-saffron transition-all shadow-gold transform hover:-translate-y-1"
          >
            <Calendar className="w-4 h-4" />
            <span>Go To Interactive Booking Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
