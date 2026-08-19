"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Grid,
  CalendarDays,
  Settings as SettingsIcon,
  LogOut,
  Layers,
  ShoppingBag,
  Flame,
} from "lucide-react";
import { toast } from "@/components/ui/Toast";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products & Menu", href: "/admin/products", icon: UtensilsCrossed },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Special Offers", href: "/admin/offers", icon: Flame },
    { name: "7-Table Manager", href: "/admin/tables", icon: Grid },
    { name: "Reservations", href: "/admin/reservations", icon: CalendarDays },
    { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      toast.success("Admin logged out successfully.");
      router.push("/admin/login");
    } catch (err) {
      toast.error("Logout error.");
    }
  };

  return (
    <aside className="w-64 bg-[#071B5C] text-white flex flex-col justify-between p-6 border-r border-white/10 min-h-screen relative overflow-hidden shadow-2xl shrink-0">
      <div className="space-y-8 relative z-10">
        <div className="pt-2 border-b border-white/15 pb-6 text-center">
          <Logo variant="light" size="sm" showDivider />
          <span className="text-[9px] uppercase font-extrabold tracking-[0.25em] text-ceylon-gold block mt-2">
            ADMINISTRATOR PORTAL
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "bg-ceylon-gold text-[#071B5C] shadow-gold scale-105"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#071B5C]" : "text-ceylon-gold"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/15 relative z-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-rose-300 bg-rose-950/60 hover:bg-rose-600 hover:text-white transition-all duration-300 border border-rose-500/40 shadow-md cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Portal</span>
        </button>
      </div>
    </aside>
  );
};
