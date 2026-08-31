"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export function CheckoutPageClient() {
  const router = useRouter();
  const { cart, totalPrice, clearCart, grandTotal } = useCart();
  const { settings } = useSettings();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ceylon-volcanic py-24 px-4 text-center space-y-4 text-ceylon-ivory">
        <h2 className="font-serif-display text-3xl font-bold text-ceylon-ivory">Your Cart is Empty</h2>
        <button
          onClick={() => router.push("/menu")}
          className="px-8 py-3.5 rounded-full bg-ceylon-copper text-ceylon-volcanic font-black uppercase text-xs shadow-copper cursor-pointer"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !deliveryAddress) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          orderNotes,
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.whatsappUrl) {
        toast.success("Order logged! Redirecting to WhatsApp...");
        clearCart();
        window.open(data.whatsappUrl, "_blank");
        router.push("/");
      } else {
        toast.error("Failed to generate WhatsApp order link.");
      }
    } catch (err) {
      toast.error("Error creating order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ceylon-volcanic text-ceylon-ivory py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="border-b border-ceylon-bronze/30 pb-4">
          <span className="text-xs uppercase font-extrabold tracking-[0.3em] text-ceylon-copper">FINAL STEP</span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-black text-ceylon-ivory mt-1">
            Complete Your Food Order
          </h1>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-cocoa p-8 rounded-[3rem] border border-ceylon-copper/40 shadow-volcanic space-y-5">
              <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory">Customer & Delivery Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-semibold focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="07123 456789"
                    className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-semibold focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-semibold focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Delivery Address *</label>
                <textarea
                  rows={3}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House No, Street Name, Plymouth Postcode..."
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-medium focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>

              <div className="p-4 rounded-2xl bg-ceylon-gold/10 border border-ceylon-gold/30 text-ceylon-ivory space-y-1">
                <span className="text-xs font-bold text-ceylon-saffron block">🚚 DELIVERY POLICY</span>
                <p className="text-[11px] leading-relaxed text-ceylon-sandstone">
                  If within a 5 km radius and purchased above £40: **FREE delivery**. Otherwise, a delivery charge will be added to your order.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-ceylon-copper uppercase block mb-1">Order Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Extra spice level, allergies, gate code..."
                  className="w-full px-4 py-3 rounded-2xl border border-ceylon-copper/40 text-xs font-medium focus:outline-none focus:border-ceylon-saffron bg-ceylon-volcanic text-ceylon-ivory placeholder-ceylon-sandstone/60"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-volcanic p-8 rounded-[3rem] text-ceylon-ivory border-2 border-ceylon-copper/40 shadow-volcanic space-y-6">
              <h3 className="font-serif-display text-2xl font-bold text-ceylon-ivory border-b border-ceylon-bronze/30 pb-4">
                Your Order Summary
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 border-b border-ceylon-bronze/20 pb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-ceylon-ivory">{item.name}</span>
                      <span className="text-ceylon-copper block font-semibold">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-ceylon-saffron">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 text-xs font-semibold">
                <div className="flex justify-between text-ceylon-sandstone">
                  <span>Food Subtotal</span>
                  <span>£{grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ceylon-sandstone">
                  <span>Delivery</span>
                  <span>
                    {grandTotal >= 40 
                      ? "FREE (within 5 km)" 
                      : "Delivery charge will be added"}
                  </span>
                </div>
              </div>

              <div className="border-t border-ceylon-bronze/30 pt-4 flex justify-between items-center text-sm">
                <span className="font-bold uppercase tracking-wider text-ceylon-copper">Total Amount:</span>
                <span className="font-serif-display text-3xl font-black text-ceylon-saffron">£{totalPrice.toFixed(2)}</span>
              </div>
              <p className="text-[9px] text-ceylon-sandstone italic text-right -mt-2">
                * Note: Delivery charge (if applicable) will be added upon confirmation.
              </p>

              {grandTotal >= 50 && (
                <div className="p-4 rounded-2xl bg-[#0E3094]/30 border border-[#F5B91A]/30 text-[#FFF8E8] space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-black text-ceylon-copper">
                    <span>🅿️</span>
                    <span>FREE PARKING TICKET CLAIM UNLOCKED!</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-ceylon-sandstone">
                    Your order total is over £50! You qualify for a Mayflower Street East Car Park ticket reimbursement. We have automatically flagged this on your WhatsApp order details.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{submitting ? "Processing..." : "Send Order via WhatsApp"}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-ceylon-sandstone text-center pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Direct WhatsApp Order Dispatch</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
