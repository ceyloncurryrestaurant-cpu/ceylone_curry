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
  const [imgCacheBust, setImgCacheBust] = useState<Record<string, number>>({});

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
        setImgCacheBust((prev) => ({ ...prev, [tableId]: Date.now() }));
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

  const handleImageUrlChange = async (tableId: string, newUrl: string) => {
    setUpdatingId(tableId);
    try {
      const updateRes = await fetch(`/api/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: { url: newUrl } }),
      });
      const updateData = await updateRes.json();
      if (updateData.success) {
        toast.success("Table seating photograph updated!");
        setImgCacheBust((prev) => ({ ...prev, [tableId]: Date.now() }));
        fetchTables();
      } else {
        toast.error("Failed to save table image URL.");
      }
    } catch (err) {
      toast.error("Error updating table image URL.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh]">
      {/* Header — ROYAL NAVY BANNER */}
      <div className="flex justify-between items-center bg-[#071B5C] text-white p-8 rounded-[3rem] border-2 border-white/20 shadow-2xl">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-gold">
            7-TABLE SEATING PHOTOGRAPHY & STATUS CONTROLLER
          </span>
          <h1 className="font-serif-display text-3xl font-extrabold text-white mt-1">
            Restaurant Tables Manager
          </h1>
          <p className="text-xs text-blue-100 mt-1 font-light">
            Manage live occupancy status and upload dedicated seating photographs for Tables 1 - 7.
          </p>
        </div>

        <button
          onClick={fetchTables}
          className="p-3 rounded-full bg-white/10 hover:bg-ceylon-gold hover:text-[#071B5C] transition-all text-white border border-white/20 cursor-pointer"
          title="Refresh availability"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Visual Table Cards with Seating Photography — CRISP WHITE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          const isOccupied = table.status === "Occupied";
          const isReserved = table.status === "Reserved";
          const bust = imgCacheBust[table._id];
          const baseImg = table.image?.url || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";
          const tableImg = bust && table.image?.url
            ? `${table.image.url}${table.image.url.includes("?") ? "&" : "?"}t=${bust}`
            : baseImg;

          return (
            <div
              key={table._id}
              className={`rounded-3xl overflow-hidden border-2 transition-all duration-300 space-y-4 shadow-md bg-white text-[#071B5C] ${
                isOccupied
                  ? "border-rose-500"
                  : isReserved
                  ? "border-amber-400"
                  : "border-gray-200 hover:border-[#071B5C]"
              }`}
            >
              {/* Seating Experience Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071B5C]">
                <Image
                  key={tableImg}
                  src={tableImg}
                  alt={`Table ${table.tableNumber}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071B5C] via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isOccupied
                        ? "bg-rose-600 text-white"
                        : isReserved
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-emerald-600 text-white shadow-md"
                    }`}
                  >
                    {table.status}
                  </span>
                </div>

                {/* Image Upload Input Overlay */}
                <label className="absolute bottom-3 right-3 z-10 cursor-pointer bg-[#071B5C]/90 text-ceylon-gold hover:bg-ceylon-gold hover:text-[#071B5C] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20 shadow-md transition-all flex items-center gap-1.5">
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
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#071B5C] block">
                      {table.type} Table ({table.capacity} Seats)
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-[#071B5C]">
                      Table 0{table.tableNumber}
                    </h3>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-[#071B5C] uppercase">
                    Seating Image URL (or upload above)
                  </label>
                  <input
                    key={table.image?.url || table._id}
                    type="url"
                    placeholder="Paste image URL here..."
                    defaultValue={table.image?.url || ""}
                    onBlur={(e) => {
                      const trimmed = e.target.value.trim();
                      if (trimmed && trimmed !== (table.image?.url || "")) {
                        handleImageUrlChange(table._id, trimmed);
                      }
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-gray-300 text-[11px] font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C] placeholder-gray-400"
                  />
                </div>

                {/* Status Controls */}
                <div className="flex gap-2 pt-2 border-t border-gray-200">
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
                      className="flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-[#071B5C] bg-ceylon-gold hover:bg-[#071B5C] hover:text-white shadow-gold transition-all cursor-pointer"
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
