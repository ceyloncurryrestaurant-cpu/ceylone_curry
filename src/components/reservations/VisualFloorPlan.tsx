"use client";

import React from "react";

interface TableItem {
  _id: string;
  tableNumber: number;
  type: string; // Couple Table / Family Table
  capacity: number; // 2 / 4
  status: string; // Available / Occupied / Reserved
}

interface VisualFloorPlanProps {
  tables: TableItem[];
  selectedTableId: string | null;
  onSelectTable: (table: TableItem) => void;
  reservedTableIds?: string[];
}

export const VisualFloorPlan: React.FC<VisualFloorPlanProps> = ({
  tables,
  selectedTableId,
  onSelectTable,
  reservedTableIds = [],
}) => {
  return (
    <div className="bg-[#071A52] p-8 sm:p-10 rounded-3xl border-2 border-ceylon-gold/40 shadow-2xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-ceylon-gold block">
            INTERACTIVE DINING ROOM FLOOR PLAN
          </span>
          <h3 className="font-serifDisplay text-2xl font-extrabold text-white mt-0.5">
            Select Your Preferred Table (7 Dining Tables)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#F8F3E7] border border-[#E5A93C]" />
            <span className="text-white/80">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#E5A93C] shadow-gold" />
            <span className="text-ceylon-gold font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#C83A2B]/40 border border-[#C83A2B]" />
            <span className="text-white/50">Reserved / Conflict</span>
          </div>
        </div>
      </div>

      {/* Visual Floor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 items-center">
        {tables.map((table) => {
          const isSelected = selectedTableId === table._id;
          const isConflict = reservedTableIds.includes(table._id) || table.status === "Occupied";
          const isFamily = table.capacity > 2;

          return (
            <button
              key={table._id}
              type="button"
              disabled={isConflict}
              onClick={() => onSelectTable(table)}
              className={`relative group p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-between min-h-[190px] cursor-pointer ${
                isConflict
                  ? "bg-[#071A52]/60 border-[#C83A2B]/40 opacity-50 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#E5A93C] border-[#E5A93C] text-[#071A52] shadow-gold scale-105 font-bold"
                  : "bg-[#F8F3E7] border-[#EEE2C2] text-[#171717] hover:border-[#E5A93C] hover:shadow-lg"
              }`}
            >
              {/* Top Seats Representation */}
              <div className="flex justify-center gap-2">
                <div
                  className={`w-5 h-2.5 rounded-t-md transition-colors ${
                    isSelected ? "bg-[#071A52]" : isConflict ? "bg-[#C83A2B]/50" : "bg-[#E5A93C]"
                  }`}
                />
                {isFamily && (
                  <div
                    className={`w-5 h-2.5 rounded-t-md transition-colors ${
                      isSelected ? "bg-[#071A52]" : isConflict ? "bg-[#C83A2B]/50" : "bg-[#E5A93C]"
                    }`}
                  />
                )}
              </div>

              {/* Main Table Shape */}
              <div
                className={`w-full py-4 rounded-2xl flex flex-col items-center justify-center my-2 transition-all ${
                  isSelected
                    ? "bg-[#071A52] text-[#E5A93C]"
                    : isConflict
                    ? "bg-[#071A52]/80 text-white/40"
                    : "bg-[#071A52] text-[#E5A93C]"
                }`}
              >
                <span className="font-serifDisplay text-lg font-black tracking-wider">
                  T0{table.tableNumber}
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest mt-0.5 opacity-80">
                  {table.capacity} Seats
                </span>
              </div>

              {/* Bottom Seats Representation */}
              <div className="flex justify-center gap-2">
                <div
                  className={`w-5 h-2.5 rounded-b-md transition-colors ${
                    isSelected ? "bg-[#071A52]" : isConflict ? "bg-[#C83A2B]/50" : "bg-[#E5A93C]"
                  }`}
                />
                {isFamily && (
                  <div
                    className={`w-5 h-2.5 rounded-b-md transition-colors ${
                      isSelected ? "bg-[#071A52]" : isConflict ? "bg-[#C83A2B]/50" : "bg-[#E5A93C]"
                    }`}
                  />
                )}
              </div>

              {/* Table Type Label */}
              <span
                className={`text-[9px] uppercase font-extrabold tracking-wider mt-2 ${
                  isSelected ? "text-[#071A52]" : isConflict ? "text-white/40" : "text-[#171717]/70"
                }`}
              >
                {table.capacity > 2 ? "Family Table" : "Couple Table"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
