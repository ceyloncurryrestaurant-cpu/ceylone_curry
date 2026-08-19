"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { Save, Phone, MessageCircle, Mail, MapPin, Clock, Globe, ExternalLink, CheckCircle, Image as ImageIcon, Plus, Trash2, Upload, Sparkles, LayoutGrid, Heart, KeyRound } from "lucide-react";
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

  // Section Images
  const [heroImages, setHeroImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2000&q=85",
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
      image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
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

  // Story Images
  const [storyMainImage, setStoryMainImage] = useState("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80");
  const [storySecondaryImage, setStorySecondaryImage] = useState("https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80");
  const [uploadingStoryMain, setUploadingStoryMain] = useState(false);
  const [uploadingStorySec, setUploadingStorySec] = useState(false);
  const storyMainRef = useRef<HTMLInputElement | null>(null);
  const storySecRef = useRef<HTMLInputElement | null>(null);

  // Gallery Strip Images
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  ]);
  const [uploadingGallery, setUploadingGallery] = useState<number | null>(null);
  const galleryFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (settings) {
      setRestaurantName(settings.restaurantName || "Ceylon Curry");
      setAddress(settings.address || "44 Mayflower St, Plymouth PL1 1QX");
      setMobileNumber(settings.mobileNumber || "01752 941504");
      setWhatsappNumber(settings.whatsappNumber || "447123456789");
      setRestaurantEmail(settings.restaurantEmail || "info@ceyloncurry.co.uk");
      setAdminEmail(settings.adminEmail || "admin@ceyloncurry.co.uk");
      setDeliveryFee(settings.deliveryFee ?? 2.99);

      if (settings.openingHours) {
        setOpeningHours(settings.openingHours);
      }
      if (settings.socialLinks) {
        setSocialLinks({
          facebook: settings.socialLinks.facebook || "",
          instagram: settings.socialLinks.instagram || "",
          tiktok: settings.socialLinks.tiktok || "",
        });
      }
      if (settings.heroImages && settings.heroImages.length > 0) {
        setHeroImages(settings.heroImages);
      }
      if (settings.signatureDishes && settings.signatureDishes.length > 0) {
        setSignatureDishes(settings.signatureDishes);
      }
      if (settings.storyMainImage) setStoryMainImage(settings.storyMainImage);
      if (settings.storySecondaryImage) setStorySecondaryImage(settings.storySecondaryImage);
      if (settings.galleryImages && settings.galleryImages.length > 0) {
        setGalleryImages(settings.galleryImages);
      }
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
          storyMainImage,
          storySecondaryImage,
          galleryImages: galleryImages.filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Failed to update settings.");
        setSaving(false);
        return;
      }

      await refetchSettings();

      toast.success("All Homepage & System Settings updated successfully!", {
        description: "Homepage photos, hero slides, signatures, gallery, mobile number & hours updated live.",
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: adminEmail || "admin@ceyloncurry.co.uk",
          newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Admin password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Password update failed.");
      }
    } catch (err) {
      toast.error("Network error updating password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 bg-[#FAF7F2] text-[#071B5C] min-h-[85vh] pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-[#071B5C]">
          Admin Media & Homepage Manager
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-light">
          Control 100% of all images, sections, hero slides, signatures, story photos, gallery items, and contact info across the homepage.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Business Contact Information */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <Phone className="w-5 h-5 text-[#071B5C]" />
            1. Business Profile & Phone Connection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                Restaurant Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                Public Mobile Number (Header / Call Buttons) *
              </label>
              <input
                type="text"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                WhatsApp Order Destination Number *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 text-emerald-700 focus:outline-none focus:border-[#071B5C]"
                />
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Test WhatsApp Connection"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                Standard Order Delivery Fee (£) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Background Slideshow Images */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <ImageIcon className="w-5 h-5 text-[#071B5C]" />
            2. Hero Section Images (Homepage Top Slideshow)
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Upload or paste custom photo URLs for all 5 full-screen hero slideshow background images.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroImages.map((url, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 group">
                <div className="relative aspect-video w-full bg-gray-100">
                  {url ? (
                    <Image src={url} alt={`Hero slide ${idx + 1}`} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => heroFileRefs.current[idx]?.click()}
                      className="p-2 rounded-full bg-ceylon-gold text-[#071B5C] hover:bg-white transition cursor-pointer shadow-md"
                      title="Upload image"
                    >
                      {uploadingHero === idx ? <span className="text-[10px] font-bold px-1">...</span> : <Upload className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...heroImages];
                        updated[idx] = "";
                        setHeroImages(updated);
                      }}
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition cursor-pointer shadow-md"
                      title="Clear image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest bg-[#071B5C] text-white px-2 py-0.5 rounded-full shadow-md">
                    Hero Slide {idx + 1}
                  </span>
                </div>

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
                      }
                    } catch {
                      toast.error("Upload error.");
                    } finally {
                      setUploadingHero(null);
                    }
                  }}
                />

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
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-[11px] font-semibold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C] placeholder-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The Soul of Ceylon Story Images */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <Heart className="w-5 h-5 text-[#071B5C]" />
            3. "The Soul of Ceylon Story" Section Photos
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Upload or change the 2 main photos displayed in the "Taste of Ceylon in Plymouth" story section.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Story Main Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#071B5C] uppercase">Main Story Photo (Large)</label>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 group">
                {storyMainImage ? (
                  <Image src={storyMainImage} alt="Story Main" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => storyMainRef.current?.click()}
                    className="px-3 py-1.5 rounded-full bg-ceylon-gold text-[#071B5C] font-bold text-xs hover:bg-white transition flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingStoryMain ? "Uploading..." : "Upload Photo"}</span>
                  </button>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={storyMainRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingStoryMain(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (data.success && data.url) {
                      setStoryMainImage(data.url);
                      toast.success("Main story photo uploaded!");
                    }
                  } catch {
                    toast.error("Upload failed.");
                  } finally {
                    setUploadingStoryMain(false);
                  }
                }}
              />
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={storyMainImage}
                onChange={(e) => setStoryMainImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>

            {/* Story Secondary Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#071B5C] uppercase">Secondary Overlap Photo (Small)</label>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 group">
                {storySecondaryImage ? (
                  <Image src={storySecondaryImage} alt="Story Secondary" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => storySecRef.current?.click()}
                    className="px-3 py-1.5 rounded-full bg-ceylon-gold text-[#071B5C] font-bold text-xs hover:bg-white transition flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingStorySec ? "Uploading..." : "Upload Photo"}</span>
                  </button>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={storySecRef}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingStorySec(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                    const data = await res.json();
                    if (data.success && data.url) {
                      setStorySecondaryImage(data.url);
                      toast.success("Secondary story photo uploaded!");
                    }
                  } catch {
                    toast.error("Upload failed.");
                  } finally {
                    setUploadingStorySec(false);
                  }
                }}
              />
              <input
                type="url"
                placeholder="Or paste image URL..."
                value={storySecondaryImage}
                onChange={(e) => setStorySecondaryImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Signature Dishes of the House Showcase */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#071B5C]" />
              4. Signatures of the House Showcase (3 Dishes)
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
                    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
                    badge: "CHEF'S SPECIAL",
                  },
                ]);
              }}
              className="px-4 py-2 rounded-xl bg-[#071B5C] hover:bg-ceylon-gold hover:text-[#071B5C] text-white font-black text-xs uppercase flex items-center gap-1 cursor-pointer transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Signature Dish</span>
            </button>
          </div>

          <div className="space-y-6">
            {signatureDishes.map((dish, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-4 relative text-[#071B5C]">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-[#071B5C]">
                    Signature #{idx + 1}: {dish.name || "Untitled"}
                  </span>
                  {signatureDishes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = signatureDishes.filter((_, i) => i !== idx);
                        setSignatureDishes(updated);
                      }}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-100 transition cursor-pointer"
                      title="Remove signature dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Image Preview & Upload */}
                  <div className="md:col-span-4 space-y-2">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-300 bg-white group">
                      {dish.image ? (
                        <Image src={dish.image} alt={dish.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => sigFileRefs.current[idx]?.click()}
                          className="px-3 py-1.5 rounded-full bg-ceylon-gold text-[#071B5C] font-bold text-xs hover:bg-white transition flex items-center gap-1 cursor-pointer shadow-md"
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
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-[11px] font-semibold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C] placeholder-gray-400"
                    />
                  </div>

                  {/* Dish Details */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#071B5C] uppercase mb-1">Dish Name *</label>
                        <input
                          type="text"
                          required
                          value={dish.name}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].name = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#071B5C] uppercase mb-1">Badge *</label>
                        <input
                          type="text"
                          required
                          value={dish.badge}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].badge = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#071B5C] uppercase mb-1">Subtitle *</label>
                        <input
                          type="text"
                          required
                          value={dish.subtitle}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].subtitle = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#071B5C] uppercase mb-1">Price *</label>
                        <input
                          type="text"
                          required
                          value={dish.price}
                          onChange={(e) => {
                            const updated = [...signatureDishes];
                            updated[idx].price = e.target.value;
                            setSignatureDishes(updated);
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#071B5C] uppercase mb-1">Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={dish.description}
                        onChange={(e) => {
                          const updated = [...signatureDishes];
                          updated[idx].description = e.target.value;
                          setSignatureDishes(updated);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Curated Visual Gallery Strip (4 Photos) */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <LayoutGrid className="w-5 h-5 text-[#071B5C]" />
            5. "Life at Ceylon Curry" Gallery Strip Photos (4 Photos)
          </h3>
          <p className="text-xs text-gray-500 font-light">
            Upload or paste image URLs for the 4 wide gallery strip photos shown on the homepage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((url, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 group">
                <div className="relative aspect-square w-full bg-gray-100">
                  {url ? (
                    <Image src={url} alt={`Gallery photo ${idx + 1}`} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => galleryFileRefs.current[idx]?.click()}
                      className="p-2 rounded-full bg-ceylon-gold text-[#071B5C] hover:bg-white transition cursor-pointer shadow-md"
                      title="Upload photo"
                    >
                      {uploadingGallery === idx ? <span className="text-[10px] font-bold px-1">...</span> : <Upload className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...galleryImages];
                        updated[idx] = "";
                        setGalleryImages(updated);
                      }}
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition cursor-pointer shadow-md"
                      title="Clear photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest bg-[#071B5C] text-white px-2 py-0.5 rounded-full shadow-md">
                    Gallery #{idx + 1}
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => { galleryFileRefs.current[idx] = el; }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingGallery(idx);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                      const uploadData = await uploadRes.json();
                      if (uploadData.success && uploadData.url) {
                        const updated = [...galleryImages];
                        updated[idx] = uploadData.url;
                        setGalleryImages(updated);
                        toast.success(`Gallery photo #${idx + 1} updated!`);
                      }
                    } catch {
                      toast.error("Upload error.");
                    } finally {
                      setUploadingGallery(null);
                    }
                  }}
                />

                <div className="p-2">
                  <input
                    type="url"
                    placeholder="Paste photo URL..."
                    value={url}
                    onChange={(e) => {
                      const updated = [...galleryImages];
                      updated[idx] = e.target.value;
                      setGalleryImages(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-[11px] font-semibold bg-white text-[#071B5C] focus:outline-none focus:border-[#071B5C] placeholder-gray-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Weekly Opening Hours */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <Clock className="w-5 h-5 text-[#071B5C]" />
            6. Weekly Opening Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#071B5C] mb-1">Mon - Thu</label>
              <input
                type="text"
                value={openingHours.monday}
                onChange={(e) => setOpeningHours({ ...openingHours, monday: e.target.value, tuesday: e.target.value, wednesday: e.target.value, thursday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#071B5C] mb-1">Fri - Sat</label>
              <input
                type="text"
                value={openingHours.friday}
                onChange={(e) => setOpeningHours({ ...openingHours, friday: e.target.value, saturday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#071B5C] mb-1">Sunday</label>
              <input
                type="text"
                value={openingHours.sunday}
                onChange={(e) => setOpeningHours({ ...openingHours, sunday: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
              />
            </div>
          </div>
        </div>

        {/* Section 7: Admin Security & Password Change */}
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-md border border-gray-200 space-y-6 text-[#071B5C]">
          <h3 className="font-serif-display font-bold text-xl text-[#071B5C] flex items-center gap-2 border-b border-gray-200 pb-3">
            <KeyRound className="w-5 h-5 text-[#071B5C]" />
            7. Admin Security & Password Reset
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                  New Admin Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter min 6 characters..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B5C] uppercase mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold bg-gray-50 text-[#071B5C] focus:outline-none focus:border-[#071B5C]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={updatingPassword}
              className="px-6 py-3 rounded-full bg-[#071B5C] hover:bg-ceylon-gold hover:text-[#071B5C] text-white font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{updatingPassword ? "Updating Password..." : "Update Admin Password"}</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-full font-black text-base shadow-gold hover:bg-[#071B5C] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest text-[#071B5C] bg-ceylon-gold"
          >
            <Save className="w-5 h-5 fill-current" />
            <span>{saving ? "Updating All Homepage Media..." : "Save & Propagate All Homepage Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
