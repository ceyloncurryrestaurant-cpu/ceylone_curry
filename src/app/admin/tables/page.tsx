"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Grid, RefreshCw, Upload, Image as ImageIcon, Check, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminTablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [uploadingTableId, setUploadingTableId] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    try {
      const res = await fetch("/api/tables", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setTables(data.tables);
      }
    } catch (err) {
      toast.error("Failed to fetch restaurant tables.");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (tableId: string, newStatus: string) => {
    setUpdatingId(tableId);
    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Table status updated to ${newStatus}!`);
        fetchTables();
      } else {
        toast.error("Failed to update table status.");
      }
    } catch (err) {
      toast.error("Error updating table status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleImageUpload = async (tableId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTableId(tableId);
    toast.info("Uploading table seating photograph...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success || !uploadData.images?.[0]) {
        toast.error("Failed to upload image.");
        return;
      }

      const uploadedImage = uploadData.images[0];

      const updateRes = await fetch(`/api/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage }),
      });

      const updateData = await updateRes.json();
      if (updateData.success) {
        toast.success("Table seating photograph updated successfully!");
        fetchTables();
      } else {
        toast.error("Failed to save table image.");
      }
    } catch (err) {
      toast.error("Error uploading table image.");
    } finally {
      setUploadingTableId(null);
    }
  };

  return (
    <div className="space-y-8 bg-ceylon-volcanic text-ceylon-ivory min-h-[85vh]">
      {/* Header */}
      <div className="flex justify-between items-center glass-cocoa text-ceylon-ivory p-8 rounded-[3rem] border-2 border-ceylon-copper/40 shadow-volcanic">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">
            7-TABLE SEATING PHOTOGRAPHY & STATUS CONTROLLER
          </span>
          <h1 className="font-serif-display text-3xl font-extrabold text-ceylon-ivory mt-1">
            Restaurant Tables Manager
          </h1>
          <p className="text-xs text-ceylon-sandstone mt-1 font-light">
            Manage live occupancy status and upload dedicated seating photographs for Tables 1 - 7.
          </p>
        </div>

        <button
          onClick={fetchTables}
          className="p-3 rounded-full bg-ceylon-volcanic hover:bg-ceylon-copper hover:text-ceylon-volcanic transition-all text-ceylon-copper border border-ceylon-copper/30 cursor-pointer"
          title="Refresh availability"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Visual Table Cards with Seating Photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const isOccupied = table.status === "Occupied";
          const isReserved = table.status === "Reserved";
          const tableImg = table.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";

          return (
            <div
              key={table._id}
              className={`rounded-3xl overflow-hidden border-2 transition-all duration-300 space-y-4 shadow-volcanic glass-cocoa ${
                isOccupied
                  ? "border-rose-500/50"
                  : isReserved
                  ? "border-ceylon-copper/50"
                  : "border-ceylon-copper/30 hover:border-ceylon-copper"
              }`}
            >
              {/* Seating Experience Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ceylon-volcanic">
                <Image
                  src={tableImg}
                  alt={`Table ${table.tableNumber}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ceylon-cocoa via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isOccupied
                        ? "bg-rose-600 text-white border border-rose-400/40"
                        : isReserved
                        ? "bg-amber-950/90 text-ceylon-saffron border border-ceylon-copper/40"
                        : "bg-emerald-950/90 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                {/* Image Upload Input Overlay */}
                <label className="absolute bottom-3 right-3 z-10 cursor-pointer bg-ceylon-volcanic/90 text-ceylon-copper hover:bg-ceylon-copper hover:text-ceylon-volcanic text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-ceylon-copper/40 shadow-copper transition-all flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTableId === table._id ? "Uploading..." : "Change Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(table._id, e)}
                    disabled={uploadingTableId === table._id}
                  />
                </label>
              </div>

              {/* Table Details */}
              <div className="px-6 pb-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-ceylon-copper block">
                      {table.type} Table ({table.capacity} Seats)
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">
                      Table 0{table.tableNumber}
                    </h3>
                  </div>
                </div>

                {/* Status Controls */}
                <div className="flex gap-2 pt-2 border-t border-ceylon-bronze/30">
                  {isOccupied || isReserved ? (
                    <button
                      onClick={() => handleStatusChange(table._id, "Available")}
                      disabled={updatingId === table._id}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                    >
                      Release Table (Mark Available)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(table._id, "Occupied")}
                      disabled={updatingId === table._id}
                      className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron shadow-copper transition-all cursor-pointer"
                    >
                      Mark Guests Seated
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
