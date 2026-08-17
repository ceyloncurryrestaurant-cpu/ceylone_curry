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
      <div className="min-h-screen bg-ceylon-volcanic py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center items-center text-center text-ceylon-ivory">
        <div className="glass-cocoa p-12 rounded-[3rem] border border-ceylon-copper/40 max-w-md w-full space-y-6 relative z-10 shadow-volcanic">
          <div className="w-20 h-20 mx-auto rounded-full bg-ceylon-volcanic text-ceylon-copper flex items-center justify-center shadow-copper border border-ceylon-copper/30">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-display text-3xl font-bold text-ceylon-ivory">Your Table is Waiting</h2>
            <p className="text-xs text-ceylon-sandstone">Your shopping cart is currently empty. Explore our menu to add dishes.</p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper transition-all"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-center border-b border-ceylon-bronze/30 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">YOUR ORDER SUMMARY</span>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-ceylon-ivory mt-1">
              Food Cart ({totalCount} Items)
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-ceylon-chilli hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        {/* Cart Line Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="glass-cocoa p-4 sm:p-6 rounded-3xl border border-ceylon-copper/30 shadow-volcanic flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-ceylon-copper/30 shrink-0 bg-ceylon-volcanic">
                  <Image src={item.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"} alt={item.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-ceylon-ivory">{item.name}</h3>
                  <span className="text-xs text-ceylon-sandstone font-semibold">£{item.price.toFixed(2)} each</span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center border border-ceylon-copper/40 rounded-full bg-ceylon-volcanic px-3 py-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-ceylon-sandstone hover:text-ceylon-copper cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-black text-xs text-ceylon-ivory">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-ceylon-sandstone hover:text-ceylon-copper cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif-display text-xl font-black text-ceylon-saffron">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-ceylon-sandstone/60 hover:text-ceylon-chilli transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout Trigger */}
        <div className="glass-volcanic p-8 rounded-[3rem] text-ceylon-ivory shadow-volcanic flex flex-col sm:flex-row justify-between items-center gap-6 border-2 border-ceylon-copper/40">
          <div>
            <span className="text-xs uppercase font-bold text-ceylon-copper tracking-widest block">Total Payable</span>
            <span className="font-serif-display text-4xl font-black text-ceylon-saffron">£{totalPrice.toFixed(2)}</span>
          </div>

          <Link
            href="/checkout"
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black uppercase text-xs tracking-widest shadow-copper transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
