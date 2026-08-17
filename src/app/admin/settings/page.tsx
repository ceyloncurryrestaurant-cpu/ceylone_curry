"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Save, Phone, MessageCircle, Mail, MapPin, Clock, Globe, ExternalLink, CheckCircle, Image as ImageIcon, Plus, Trash2, Upload, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import Image from "next/image";

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
  const [heroImages, setHeroImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=2000&q=85",
  ]);
  const [uploadingHero, setUploadingHero] = useState<number | null>(null);
  const heroFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [signatureDishes, setSignatureDishes] = useState([
    {
      name: "CHEESE KOTTU ROTI",
      subtitle: "Street-Food Comfort with a Rich Ceylon Twist",
      description: "Shredded godamba flatbread flash-fried on a flat iron griddle with roasted chicken, farm eggs, crunchy vegetables, and melted cheddar sauce.",
      price: "£13.50",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
      badge: "HOUSE FAVORITE",
    },
    {
      name: "JAFFNA BLACK LAMB CURRY",
      subtitle: "Slow-Braised Tender Lamb in Dark Roasted Spice",
      description: "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste.",
      price: "£15.90",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
      badge: "CHEF'S CROWN",
    },
    {
      name: "DEVILLED KING PRAWNS",
      subtitle: "Fiery Wok-Tossed Prawns with Capsicum & Tomato",
      description: "Jumbo king prawns tossed with banana peppers, red onions, crushed chilli flakes, and sweet-spicy Ceylon glaze.",
      price: "£14.80",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
      badge: "HOT & SPICY",
    },
  ]);
  const [uploadingSig, setUploadingSig] = useState<number | null>(null);
  const sigFileRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      if (settings.heroImages && settings.heroImages.length > 0) setHeroImages(settings.heroImages);
      if (settings.signatureDishes && settings.signatureDishes.length > 0) setSignatureDishes(settings.signatureDishes as any);
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
          heroImages: heroImages.filter(Boolean),
          signatureDishes,
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

        {/* Section 3.5: Hero Section Image Management */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
            <ImageIcon className="w-5 h-5 text-ceylon-copper" />
            3. Hero Section Images (Homepage Slideshow)
          </h3>
          <p className="text-xs text-ceylon-sandstone font-light">
            Upload or paste image URLs for the 5 full-screen hero slideshow images shown on the homepage. Click the upload icon to choose a file or edit the URL directly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroImages.map((url, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-ceylon-copper/40 bg-ceylon-volcanic group">
                {/* Preview */}
                <div className="relative aspect-video w-full bg-ceylon-cocoa">
                  {url ? (
                    <Image
                      src={url}
                      alt={`Hero slide ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-ceylon-sandstone/40">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => heroFileRefs.current[idx]?.click()}
                      className="p-2 rounded-full bg-ceylon-copper text-ceylon-volcanic hover:bg-ceylon-saffron transition cursor-pointer"
                      title="Upload image"
                    >
                      {uploadingHero === idx ? (
                        <span className="text-[10px] font-bold px-1">...</span>
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...heroImages];
                        updated[idx] = "";
                        setHeroImages(updated);
                      }}
                      className="p-2 rounded-full bg-ceylon-chilli text-white hover:bg-red-700 transition cursor-pointer"
                      title="Clear image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest bg-ceylon-volcanic/80 text-ceylon-copper px-2 py-0.5 rounded-full">
                    Slide {idx + 1}
                  </span>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { heroFileRefs.current[idx] = el; }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingHero(idx);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                      const uploadData = await uploadRes.json();
                      if (uploadData.success && uploadData.url) {
                        const updated = [...heroImages];
                        updated[idx] = uploadData.url;
                        setHeroImages(updated);
                        toast.success(`Hero slide ${idx + 1} image uploaded!`);
                      } else {
                        toast.error("Upload failed. Try pasting a URL instead.");
                      }
                    } catch {
                      toast.error("Upload error.");
                    } finally {
                      setUploadingHero(null);
                    }
                  }}
                />

                {/* URL input */}
                <div className="p-2">
                  <input
                    type="url"
                    placeholder="Paste image URL here..."
                    value={url}
                    onChange={(e) => {
                      const updated = [...heroImages];
                      updated[idx] = e.target.value;
                      setHeroImages(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/30 text-[11px] font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron placeholder-ceylon-sandstone/40"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-ceylon-sandstone/60 font-light">
            💡 Tip: You can upload your own food photos or paste Unsplash/any public image URLs. Changes take effect after clicking "Save &amp; Propagate All Settings".
          </p>
        </div>

        {/* Section 4: Signature Dishes of the House */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <div className="flex justify-between items-center border-b border-ceylon-bronze/30 pb-3">
            <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-ceylon-copper" />
              4. Signatures of the House Showcase
            </h3>
            <button
              type="button"
              onClick={() => {
                setSignatureDishes([
                  ...signatureDishes,
                  {
                    name: "NEW SIGNATURE DISH",
                    subtitle: "Delicious Ceylon Culinary Special",
                    description: "Describe the authentic flavors and ingredients of this special dish.",
                    price: "£14.00",
                    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
                    badge: "CHEF'S SPECIAL",
                  },
                ]);
              }}
              className="px-4 py-2 rounded-xl bg-ceylon-copper hover:bg-ceylon-saffron text-ceylon-volcanic font-black text-xs uppercase flex items-center gap-1 cursor-pointer transition-all shadow-copper"
            >
              <Plus className="w-4 h-4" />
              <span>Add Signature Dish</span>
            </button>
          </div>
          <p className="text-xs text-ceylon-sandstone font-light">
            Customize the editorial Signature Dishes featured on the main landing page. Change photos, badges, prices and titles live.
          </p>

          <div className="space-y-6">
            {signatureDishes.map((dish, idx) => (
              <div key={idx} className="glass-volcanic p-6 rounded-3xl border border-ceylon-copper/40 space-y-4 relative">
                <div className="flex justify-between items-center border-b border-ceylon-bronze/30 pb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-ceylon-copper">
                    Signature #{idx + 1}: {dish.name || "Untitled"}
                  </span>
                  {signatureDishes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = signatureDishes.filter((_, i) => i !== idx);
                        setSignatureDishes(updated);
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/40 transition cursor-pointer"
                      title="Remove signature dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Image Preview & Upload */}
                  <div className="md:col-span-4 space-y-2">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-ceylon-copper/40 bg-ceylon-cocoa group">
                      {dish.image ? (
                        <Image src={dish.image} alt={dish.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex items-center justify-center h-full text-ceylon-sandstone/40">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => sigFileRefs.current[idx]?.click()}
                          className="px-3 py-1.5 rounded-full bg-ceylon-copper text-ceylon-volcanic font-bold text-xs hover:bg-ceylon-saffron transition flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingSig === idx ? "Uploading..." : "Upload Photo"}</span>
                        </button>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { sigFileRefs.current[idx] = el; }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingSig(idx);
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                          const uploadData = await uploadRes.json();
                          if (uploadData.success && uploadData.url) {
                            const updated = [...signatureDishes];
                            updated[idx].image = uploadData.url;
                            setSignatureDishes(updated);
                            toast.success(`Signature dish #${idx + 1} photo updated!`);
                          } else {
                            toast.error("Upload failed.");
                          }
                        } catch {
                          toast.error("Upload error.");
                        } finally {
                          setUploadingSig(null);
                        }
                      }}
                    />
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={dish.image}
                      onChange={(e) => {
                        const updated = [...signatureDishes];
                        updated[idx].image = e.target.value;
                        setSignatureDishes(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/30 text-[11px] font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron placeholder-ceylon-sandstone/40"
                    />
                  </div>

                  {/* Dish Details */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-ceylon-copper uppercase mb-1">Dish Name *</label>
                        <input
                          type="text"
                          required
                          value={dish.name}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].name = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-bold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-ceylon-copper uppercase mb-1">Badge (e.g. HOUSE FAVORITE) *</label>
                        <input
                          type="text"
                          required
                          value={dish.badge}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].badge = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-bold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-ceylon-copper uppercase mb-1">Subtitle *</label>
                        <input
                          type="text"
                          required
                          value={dish.subtitle}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].subtitle = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-semibold bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-ceylon-copper uppercase mb-1">Price *</label>
                        <input
                          type="text"
                          required
                          value={dish.price}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].price = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-bold bg-ceylon-volcanic text-ceylon-saffron focus:outline-none focus:border-ceylon-saffron"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-ceylon-copper uppercase mb-1">Editorial Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={dish.description}
                        onChange={(e) => {
                          const updated = [...signatureDishes];
                          updated[idx].description = e.target.value;
                          setSignatureDishes(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-ceylon-copper/40 text-xs font-medium bg-ceylon-volcanic text-ceylon-ivory focus:outline-none focus:border-ceylon-saffron"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Opening Hours */}
        <div className="glass-cocoa rounded-[2.5rem] p-6 sm:p-8 shadow-volcanic border border-ceylon-copper/30 space-y-6 text-ceylon-ivory">
          <h3 className="font-serif-display font-bold text-xl text-ceylon-copper flex items-center gap-2 border-b border-ceylon-bronze/30 pb-3">
            <Clock className="w-5 h-5 text-ceylon-copper" />
            4. Weekly Opening Hours
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
