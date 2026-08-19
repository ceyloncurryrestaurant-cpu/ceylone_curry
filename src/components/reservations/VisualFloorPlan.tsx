"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTables = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#071B5C] p-6 sm:p-10 rounded-3xl border-2 border-gray-200 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-300">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071B5C] block">
            INTERACTIVE DINING ROOM FLOOR PLAN
          </span>
          <h3 className="font-serifDisplay text-xl sm:text-2xl font-extrabold text-[#071B5C] mt-0.5">
            Select Your Preferred Table (7 Dining Tables)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-white border border-gray-400" />
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-[#071B5C] shadow-md" />
            <span className="text-[#071B5C] font-bold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-400" />
            <span className="text-rose-600 font-bold">Reserved (Auto-releases in 1 Hr)</span>
          </div>
        </div>
      </div>

      {/* Single-Line Horizontal Scrolling Table Carousel Container */}
      <div className="relative group/tables">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scrollTables("left")}
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#071B5C] text-white shadow-lg items-center justify-center hover:bg-ceylon-gold hover:text-[#071B5C] transition cursor-pointer"
          title="Scroll left tables"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scrollTables("right")}
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#071B5C] text-white shadow-lg items-center justify-center hover:bg-ceylon-gold hover:text-[#071B5C] transition cursor-pointer"
          title="Scroll right tables"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="grid grid-cols-2 gap-3.5 sm:flex sm:flex-nowrap sm:gap-6 sm:overflow-x-auto pb-4 pt-2 px-1 scrollbar-none sm:snap-x sm:snap-mandatory sm:scroll-smooth items-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tables.map((table) => {
            const isSelected = selectedTableId === table._id;
            const isConflict = reservedTableIds.includes(table._id) || table.status === "Occupied" || table.status === "Reserved";
            const isFamily = table.capacity > 2;

            return (
              <button
                key={table._id}
                type="button"
                disabled={isConflict}
                onClick={() => onSelectTable(table)}
                className={`w-full sm:w-[170px] sm:flex-shrink-0 sm:snap-center relative group p-3.5 sm:p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-between min-h-[170px] sm:min-h-[180px] cursor-pointer ${
                  isConflict
                    ? "bg-rose-50 border-rose-200 opacity-60 cursor-not-allowed text-rose-700"
                    : isSelected
                    ? "bg-[#071B5C] border-[#071B5C] text-white shadow-xl scale-[1.02] sm:scale-105 font-bold"
                    : "bg-white border-gray-300 text-[#071B5C] hover:border-[#071B5C] hover:shadow-lg"
                }`}
              >
                {/* Top Seats Representation */}
                <div className="flex justify-center gap-2">
                  <div
                    className={`w-5 h-2.5 rounded-t-md transition-colors ${
                      isSelected ? "bg-ceylon-gold" : isConflict ? "bg-rose-300" : "bg-[#071B5C]"
                    }`}
                  />
                  {isFamily && (
                    <div
                      className={`w-5 h-2.5 rounded-t-md transition-colors ${
                        isSelected ? "bg-ceylon-gold" : isConflict ? "bg-rose-300" : "bg-[#071B5C]"
                      }`}
                    />
                  )}
                </div>

                {/* Main Table Shape */}
                <div
                  className={`w-full py-3.5 rounded-2xl flex flex-col items-center justify-center my-2 transition-all ${
                    isSelected
                      ? "bg-[#0A2472] text-ceylon-gold"
                      : isConflict
                      ? "bg-rose-100 text-rose-800"
                      : "bg-[#071B5C] text-white"
                  }`}
                >
                  <span className="font-serifDisplay text-lg font-black tracking-wider">
                    T0{table.tableNumber}
                  </span>
                  <span className="text-[9px] uppercase font-black tracking-widest mt-0.5 opacity-90">
                    {table.capacity} Seats
                  </span>
                </div>

                {/* Bottom Seats Representation */}
                <div className="flex justify-center gap-2">
                  <div
                    className={`w-5 h-2.5 rounded-b-md transition-colors ${
                      isSelected ? "bg-ceylon-gold" : isConflict ? "bg-rose-300" : "bg-[#071B5C]"
                    }`}
                  />
                  {isFamily && (
                    <div
                      className={`w-5 h-2.5 rounded-b-md transition-colors ${
                        isSelected ? "bg-ceylon-gold" : isConflict ? "bg-rose-300" : "bg-[#071B5C]"
                      }`}
                    />
                  )}
                </div>

                {/* Table Type & Status Label */}
                <span
                  className={`text-[9px] uppercase font-extrabold tracking-wider mt-2 ${
                    isSelected ? "text-white" : isConflict ? "text-rose-600 font-bold" : "text-gray-700"
                  }`}
                >
                  {isConflict ? "Reserved (1h)" : table.capacity > 2 ? "Family Table" : "Couple Table"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator Dots */}
        <div className="hidden sm:flex justify-center items-center gap-2 pt-2">
          {tables.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedTableId && tables[i]?._id === selectedTableId
                  ? "w-8 bg-[#071B5C] shadow-md"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
