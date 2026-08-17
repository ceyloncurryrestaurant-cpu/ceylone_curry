"use client";

import React, { useEffect, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Save, Phone, MessageCircle, Mail, MapPin, Clock, Globe, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const { settings, refetchSettings } = useSettings();

  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [restaurantEmail, setRestaurantEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(2.99);

  const [openingHours, setOpeningHours] = useState({
    monday: "10:00 AM - 10:00 PM",
    tuesday: "10:00 AM - 10:00 PM",
    wednesday: "10:00 AM - 10:00 PM",
    thursday: "10:00 AM - 10:00 PM",
    friday: "10:00 AM - 10:00 PM",
    saturday: "10:00 AM - 10:00 PM",
    sunday: "10:00 AM - 10:00 PM",
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    tiktok: "",
  });

  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setRestaurantName(settings.restaurantName || "Ceylon Curry");
      setAddress(settings.address || "44 Mayflower St, Plymouth PL1 1QX");
      setMobileNumber(settings.mobileNumber || "01752 941504");
      setWhatsappNumber(settings.whatsappNumber || "+441752941504");
      setRestaurantEmail(settings.restaurantEmail || "info@ceyloncurry.co.uk");
      setAdminEmail(settings.adminEmail || "admin@ceyloncurry.co.uk");
      setDeliveryFee(settings.deliveryFee !== undefined ? settings.deliveryFee : 2.99);
      if (settings.openingHours) setOpeningHours(settings.openingHours as any);
      if (settings.socialLinks) setSocialLinks(settings.socialLinks as any);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName,
          address,
          mobileNumber,
          whatsappNumber,
          restaurantEmail,
          adminEmail,
          deliveryFee: Number(deliveryFee),
          openingHours,
          socialLinks,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to update settings.");
        setSaving(false);
        return;
      }

      // Revalidate centralized settings context immediately across public site
      await refetchSettings();

      toast.success("Restaurant settings updated successfully!", {
        description: "Mobile number, WhatsApp, address & hours updated everywhere across the application.",
      });
    } catch (err) {
      toast.error("Error saving settings.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = () => {
    const link = getWhatsAppLink(whatsappNumber, "Hello Ceylon Curry! Testing WhatsApp configuration.");
    window.open(link, "_blank");
  };

  return (
    <div className="max-w-4xl space-y-8 bg-ceylon-volcanic text-ceylon-ivory min-h-[85vh]">
      {/* Header */}
      <div className="pb-4 border-b border-ceylon-bronze/30">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-ceylon-ivory">
          Centralized Restaurant Settings
        </h1>
        <p className="text-xs text-ceylon-sandstone mt-1 font-light">
          Single Source of Truth: Updating mobile or WhatsApp numbers here dynamically updates all Header, Footer, Contact Page, WhatsApp buttons, Checkout, and Emails.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Business Contact Information */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
            <Phone className="w-5 h-5 text-ceylon-copper" />
            1. Business Profile & Phone Connection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-bold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Restaurant Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Public Mobile Number (Header / Call Buttons) *
              </label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-bold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                WhatsApp Order Destination Number *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-bold bg-ceylon-volcanic text-emerald-400 focus:outline-none focus:border-ceylon-saffron"
                />
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Test WhatsApp Connection"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Standard Order Delivery Fee (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-bold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
              <span className="text-[10px] text-ceylon-sandstone block mt-1">
                This fee applies to local delivery orders placed on checkout.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Email Routing */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
            <Mail className="w-5 h-5 text-ceylon-copper" />
            2. Email Configurations (Nodemailer)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Restaurant Email (Customer Contact) *
              </label>
              <input
                type="email"
                required
                value={restaurantEmail}
                onChange={(e) => setRestaurantEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Admin Booking Notification Email *
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Opening Hours */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
            <Clock className="w-5 h-5 text-ceylon-copper" />
            3. Weekly Opening Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-ceylon-copper mb-1">Mon - Thu</label>
              <input
                type="text"
                value={openingHours.monday}
                onChange={(e) => setOpeningHours({ ...openingHours, monday: e.target.value, tuesday: e.target.value, wednesday: e.target.value, thursday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block font-bold text-ceylon-copper mb-1">Fri - Sat</label>
              <input
                type="text"
                value={openingHours.friday}
                onChange={(e) => setOpeningHours({ ...openingHours, friday: e.target.value, saturday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block font-bold text-ceylon-copper mb-1">Sunday</label>
              <input
                type="text"
                value={openingHours.sunday}
                onChange={(e) => setOpeningHours({ ...openingHours, sunday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-full font-black text-base shadow-copper hover:bg-ceylon-saffron transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-ceylon-volcanic bg-ceylon-copper"
          >
            <Save className="w-5 h-5 fill-current" />
            <span>{saving ? "Updating System Settings..." : "Save & Propagate All Settings"}</span>
          </button>
        </div>
      </form>

      {/* Section 4: Security & Admin Password Reset */}
      <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
        <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
          <Globe className="w-5 h-5 text-ceylon-copper" />
          4. Security & Admin Password Reset
        </h3>

        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
          }
          if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
          }

          setUpdatingPassword(true);
          try {
            const res = await fetch("/api/admin/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "reset-password",
                email: adminEmail,
                newPassword,
              }),
            });

            const data = await res.json();
            if (data.success) {
              toast.success("Admin password reset successfully!");
              setNewPassword("");
              setConfirmPassword("");
            } else {
              toast.error(data.error || "Password reset failed.");
            }
          } catch (err) {
            toast.error("Error resetting password.");
          } finally {
            setUpdatingPassword(false);
          }
        }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                New Admin Password *
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ceylon-copper uppercase mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ceylon-copper/40 text-sm font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-copper text-ceylon-volcanic bg-ceylon-copper hover:bg-ceylon-saffron transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{updatingPassword ? "Resetting Password..." : "Update Admin Password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
