"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/Logo";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, MessageCircle, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center items-center text-center text-[#071B5C]">
        <div className="bg-white p-12 rounded-[3rem] border border-gray-200 max-w-md w-full space-y-6 relative z-10 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#071B5C] text-ceylon-gold flex items-center justify-center shadow-lg border border-ceylon-gold/30">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-display text-3xl font-bold text-[#071B5C]">Your Table is Waiting</h2>
            <p className="text-xs text-gray-600">Your shopping cart is currently empty. Explore our menu to add dishes.</p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#071B5C] hover:bg-[#0A2472] text-white font-black uppercase text-xs tracking-widest shadow-lg transition-all"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 text-ceylon-gold" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#071B5C] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-[#071B5C]">YOUR ORDER SUMMARY</span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-[#071B5C] mt-1">
              Food Cart ({totalCount} Items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-ceylon-red hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        {/* Cart Line Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-[#071B5C]"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-100">
                  <Image src={item.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-[#071B5C]">{item.name}</h3>
                  <span className="text-xs text-gray-500 font-semibold">£{item.price.toFixed(2)} each</span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center border border-gray-300 rounded-full bg-gray-50 px-3 py-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-600 hover:text-[#071B5C] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-black text-xs text-[#071B5C]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-600 hover:text-[#071B5C] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif-display text-xl font-black text-[#071B5C]">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-ceylon-red transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout Trigger */}
        <div className="bg-[#071B5C] p-8 rounded-[3rem] text-white shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6 border-2 border-white/20">
          <div>
            <span className="text-xs uppercase font-bold text-ceylon-gold tracking-widest block">Total Payable</span>
            <span className="font-serif-display text-4xl font-black text-ceylon-gold">£{totalPrice.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-ceylon-gold hover:bg-white text-[#071B5C] font-black uppercase text-xs tracking-widest shadow-gold transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
