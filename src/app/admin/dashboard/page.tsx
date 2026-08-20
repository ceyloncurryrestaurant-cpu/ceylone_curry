"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Flame,
  Calendar,
  Grid,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  UserX,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOffers: 0,
    totalReservations: 0,
    pendingReservations: 0,
    availableTables: 7,
    reservedTables: 0,
  });

  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailRes, setDetailRes] = useState<any | null>(null);

  async function fetchDashboardStats() {
    try {
      const [pRes, tRes, rRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/tables"),
        fetch("/api/reservations"),
      ]);

      const pData = await pRes.json();
      const tData = await tRes.json();
      const rData = await rRes.json();

      const products = pData.products || [];
      const tables = tData.tables || [];
      const reservations = rData.reservations || [];

      const activeOffers = products.filter((p: any) => p.isOffer).length;
      const pendingRes = reservations.filter((r: any) => r.status === "Pending").length;
      const occupiedCount = tables.filter((t: any) => t.status === "Occupied").length;

      setStats({
        totalProducts: products.length,
        activeOffers,
        totalReservations: reservations.length,
        pendingReservations: pendingRes,
        availableTables: tables.length - occupiedCount,
        reservedTables: occupiedCount,
      });

      setRecentReservations(reservations.slice(0, 5));
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Reservation status updated to ${newStatus}`);
        setDetailRes(null);
        fetchDashboardStats();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this reservation?")) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Reservation deleted successfully.");
        setDetailRes(null);
        fetchDashboardStats();
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting reservation");
    }
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh]">
      {/* Header Greeting Banner — ROYAL NAVY */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#071B5C] text-white p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ceylon-gold" />
            CEYLON CURRY RESTAURANT OVERVIEW
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Good Afternoon, Admin
          </h1>
          <p className="text-xs text-blue-100 mt-1 font-light">{todayStr}</p>
        </div>

        <Link
          href="/admin/reservations"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-white transition-all shadow-gold"
        >
          <span>Manage Reservations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid — CRISP WHITE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-2 hover:border-[#071B5C] transition-all text-[#071B5C]">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Total Products</span>
            <div className="p-3 rounded-2xl bg-[#071B5C] text-ceylon-gold">
              <UtensilsCrossed className="w-5 h-5 text-ceylon-gold" />
            </div>
          </div>
          <span className="font-serif-display text-4xl font-black text-[#071B5C] block">
            {stats.totalProducts}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live catalog items
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-2 hover:border-[#071B5C] transition-all text-[#071B5C]">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Active Daily Offers</span>
            <div className="p-3 rounded-2xl bg-ceylon-red text-white">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-serif-display text-4xl font-black text-ceylon-red block">
            {stats.activeOffers}
          </span>
          <span className="text-[10px] text-gray-500 font-bold">Special discounted deals</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-2 hover:border-[#071B5C] transition-all text-[#071B5C]">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Total Bookings</span>
            <div className="p-3 rounded-2xl bg-[#071B5C] text-ceylon-gold">
              <Calendar className="w-5 h-5 text-ceylon-gold" />
            </div>
          </div>
          <span className="font-serif-display text-4xl font-black text-[#071B5C] block">
            {stats.totalReservations}
          </span>
          <span className="text-[10px] text-[#071B5C] font-bold">
            {stats.pendingReservations} Pending Review
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-2 hover:border-[#071B5C] transition-all text-[#071B5C]">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">7-Table Status</span>
            <div className="p-3 rounded-2xl bg-emerald-600 text-white">
              <Grid className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-serif-display text-4xl font-black text-emerald-600 block">
            {stats.availableTables} / 7
          </span>
          <span className="text-[10px] text-emerald-700 font-bold">Available tables right now</span>
        </div>
      </div>

      {/* Recent Reservations Table — CRISP WHITE CONTAINER WITH ROYAL NAVY HEADER */}
      <div className="bg-white p-8 rounded-[3rem] border border-gray-200 shadow-md space-y-6 text-[#071B5C]">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#071B5C]">Recent Customer Bookings</h3>
            <p className="text-xs text-gray-500 font-light">Live reservation requests from website customers.</p>
          </div>

          <Link
            href="/admin/reservations"
            className="text-xs font-black uppercase text-[#071B5C] hover:text-ceylon-gold transition-colors flex items-center gap-1"
          >
            All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentReservations.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500 font-light">
            No recent reservations recorded.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#071B5C] text-white font-black uppercase tracking-widest">
                <tr>
                  <th className="p-3.5">Ref ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Table</th>
                  <th className="p-3.5">Guests</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium text-[#071B5C]">
                {recentReservations.map((r: any) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5 text-[#071B5C] font-black">{r.reservationNumber}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#071B5C]">{r.customerName}</div>
                      <div className="text-[10px] text-gray-500 font-light">{r.mobile}</div>
                    </td>
                    <td className="p-3.5">
                      <div>{r.date}</div>
                      <div className="text-[10px] text-[#071B5C] font-bold">{r.startTime}</div>
                    </td>
                    <td className="p-3.5 font-bold">Table 0{r.tableId?.tableNumber || "1"}</td>
                    <td className="p-3.5">{r.guestCount} Guests</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          r.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : r.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-rose-100 text-rose-700 border border-rose-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setDetailRes(r)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-[#071B5C] hover:text-white transition-colors cursor-pointer text-[#071B5C]"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-inherit" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {detailRes && (
        <div className="fixed inset-0 z-50 bg-[#071B5C]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gray-200 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl text-[#071B5C]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div>
                <span className="text-[10px] font-bold text-[#071B5C] uppercase tracking-widest block">Reservation Reference</span>
                <h3 className="font-serif-display font-extrabold text-xl text-[#071B5C]">
                  {detailRes.reservationNumber}
                </h3>
              </div>
              <button onClick={() => setDetailRes(null)} className="text-gray-400 hover:text-[#071B5C] font-bold text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block">Customer</span>
                  <span className="font-bold text-[#071B5C] text-sm">{detailRes.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone</span>
                  <span className="font-bold text-[#071B5C] text-sm">{detailRes.mobile}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Table Reserved</span>
                  <span className="font-bold text-[#071B5C] text-sm">
                    Table 0{detailRes.tableId?.tableNumber || "1"} ({detailRes.tableId?.type || "Couple"})
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Date & Time</span>
                  <span className="font-bold text-[#071B5C] text-sm">
                    {detailRes.date} at {detailRes.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Guests</span>
                  <span className="font-bold text-[#071B5C] text-sm">{detailRes.guestCount} Guests</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status</span>
                  <span className="font-bold text-[#071B5C] text-sm uppercase">{detailRes.status}</span>
                </div>
              </div>

              {detailRes.specialRequest && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="font-bold text-[#071B5C] block">Special Notes:</span>
                  <p className="text-gray-600 mt-1">{detailRes.specialRequest}</p>
                </div>
              )}
            </div>

            {/* Admin Status Actions */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <span className="text-xs font-bold text-[#071B5C] uppercase block mb-1">Change Reservation Status:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "Accepted")}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Accept Reservation
                </button>
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "Completed")}
                  className="py-2.5 rounded-xl font-extrabold text-xs text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white shadow-gold transition-all cursor-pointer"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "No Show")}
                  className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Mark No Show</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "Cancelled")}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Cancel Booking
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleDeleteReservation(detailRes._id)}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Reservation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
