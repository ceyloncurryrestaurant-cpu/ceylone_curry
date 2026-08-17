"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Filter, CheckCircle2, XCircle, Clock, Eye, AlertOctagon, UserX, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Modal detail state
  const [detailRes, setDetailRes] = useState<any>(null);

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, selectedDate]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (selectedDate) params.append("date", selectedDate);

      const res = await fetch(`/api/reservations?${params.toString()}`);
      const data = await res.json();
      if (data.success) setReservations(data.reservations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        fetchReservations();
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
        fetchReservations();
      } else {
        toast.error(data.error || "Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting reservation");
    }
  };

  return (
    <div className="space-y-8 bg-ceylon-volcanic text-ceylon-ivory min-h-[85vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-ceylon-bronze/30">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-ceylon-ivory">
            Reservations Dashboard
          </h1>
          <p className="text-xs text-ceylon-sandstone mt-1 font-light">
            Accept or cancel table bookings, update guest arrival status, or delete obsolete reservations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-bold bg-ceylon-cocoa text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-bold bg-ceylon-cocoa text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
          >
            <option value="all" className="bg-ceylon-volcanic text-ceylon-ivory">All Statuses</option>
            <option value="Pending" className="bg-ceylon-volcanic text-ceylon-ivory">Pending</option>
            <option value="Accepted" className="bg-ceylon-volcanic text-ceylon-ivory">Accepted</option>
            <option value="Completed" className="bg-ceylon-volcanic text-ceylon-ivory">Completed</option>
            <option value="Cancelled" className="bg-ceylon-volcanic text-ceylon-ivory">Cancelled</option>
            <option value="No Show" className="bg-ceylon-volcanic text-ceylon-ivory">No Show</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      {loading ? (
        <div className="glass-cocoa rounded-3xl p-12 text-center border border-ceylon-copper/30">
          <div className="animate-spin w-8 h-8 border-4 border-ceylon-copper border-t-transparent rounded-full mx-auto shadow-copper" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="glass-cocoa rounded-3xl p-12 text-center max-w-md mx-auto space-y-2 border border-ceylon-copper/30 shadow-volcanic">
          <p className="font-serif-display font-bold text-ceylon-ivory text-lg">No Reservations Found</p>
          <p className="text-xs text-ceylon-sandstone font-light">Try adjusting your status or date filter.</p>
        </div>
      ) : (
        <div className="glass-cocoa rounded-[2.5rem] shadow-volcanic border border-ceylon-copper/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ceylon-volcanic text-ceylon-copper text-xs uppercase font-black tracking-widest border-b border-ceylon-bronze/30">
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Table</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ceylon-bronze/20 text-sm font-medium text-ceylon-ivory">
                {reservations.map((r) => (
                  <tr key={r._id} className="hover:bg-ceylon-volcanic/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-ceylon-saffron text-xs">
                      {r.reservationNumber}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-ceylon-ivory block">{r.customerName}</span>
                      <span className="text-xs text-ceylon-sandstone block">{r.mobile}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-ceylon-saffron text-xs block">
                        Table 0{r.tableId?.tableNumber || "1"}
                      </span>
                      <span className="text-[10px] text-ceylon-sandstone/70 block">({r.tableId?.type || "Couple"})</span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-ceylon-ivory">
                      {r.date} at {r.startTime}
                    </td>
                    <td className="p-4 font-bold text-xs text-ceylon-ivory">{r.guestCount} Guests</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          r.status === "Accepted"
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                            : r.status === "Pending"
                            ? "bg-amber-950/80 text-ceylon-saffron border border-ceylon-copper/40"
                            : r.status === "No Show"
                            ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                            : "bg-ceylon-volcanic text-ceylon-sandstone/70 border border-ceylon-bronze/30"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => setDetailRes(r)}
                        className="p-1.5 text-ceylon-copper hover:bg-ceylon-volcanic rounded-lg transition-colors cursor-pointer"
                        title="View Details & Update"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReservation(r._id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Reservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Detail & Action Modal */}
      {detailRes && (
        <div className="fixed inset-0 z-50 bg-ceylon-volcanic/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-ceylon-cocoa border-2 border-ceylon-copper/50 rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-volcanic text-ceylon-ivory">
            <div className="flex justify-between items-center pb-3 border-b border-ceylon-bronze/30">
              <div>
                <span className="text-[10px] font-bold text-ceylon-copper uppercase tracking-widest block">Reservation Reference</span>
                <h3 className="font-serif-display font-extrabold text-xl text-ceylon-ivory">
                  {detailRes.reservationNumber}
                </h3>
              </div>
              <button onClick={() => setDetailRes(null)} className="text-ceylon-sandstone hover:text-ceylon-ivory font-bold text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-ceylon-volcanic rounded-2xl border border-ceylon-copper/30">
                <div>
                  <span className="text-ceylon-sandstone block">Customer</span>
                  <span className="font-bold text-ceylon-ivory text-sm">{detailRes.customerName}</span>
                </div>
                <div>
                  <span className="text-ceylon-sandstone block">Phone</span>
                  <span className="font-bold text-ceylon-ivory text-sm">{detailRes.mobile}</span>
                </div>
                <div>
                  <span className="text-ceylon-sandstone block">Table Reserved</span>
                  <span className="font-bold text-ceylon-saffron text-sm">
                    Table 0{detailRes.tableId?.tableNumber || "1"} ({detailRes.tableId?.type})
                  </span>
                </div>
                <div>
                  <span className="text-ceylon-sandstone block">Date & Time</span>
                  <span className="font-bold text-ceylon-ivory text-sm">
                    {detailRes.date} at {detailRes.startTime}
                  </span>
                </div>
              </div>

              {detailRes.specialRequest && (
                <div className="p-3 bg-ceylon-volcanic rounded-xl border border-ceylon-copper/30">
                  <span className="font-bold text-ceylon-copper block">Special Notes:</span>
                  <p className="text-ceylon-sandstone mt-1">{detailRes.specialRequest}</p>
                </div>
              )}
            </div>

            {/* Admin Status Actions */}
            <div className="pt-3 border-t border-ceylon-bronze/30 space-y-2">
              <span className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Change Reservation Status:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "Accepted")}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Accept Reservation
                </button>
                <button
                  onClick={() => handleUpdateStatus(detailRes._id, "Completed")}
                  className="py-2.5 rounded-xl font-extrabold text-xs text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron shadow-copper transition-all cursor-pointer"
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
                  className="w-full py-2.5 rounded-xl bg-rose-950/50 text-rose-300 hover:bg-rose-900/70 font-bold text-xs border border-rose-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Permanently Delete Reservation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
