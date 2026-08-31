"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ISignatureDishData {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  badge: string;
}

export interface ISettingsData {
  restaurantName: string;
  address: string;
  mobileNumber: string;
  whatsappNumber: string;
  restaurantEmail: string;
  adminEmail: string;
  deliveryFee: number;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  currency: string;
  reservationSettings: {
    reservationDurationMinutes: number;
    minNoticeHours: number;
    maxAdvanceDays: number;
  };
  heroImages?: string[];
  signatureDishes?: ISignatureDishData[];
  storyMainImage?: string;
  storySecondaryImage?: string;
  galleryImages?: string[];
}

interface SettingsContextType {
  settings: ISettingsData;
  loading: boolean;
  refetchSettings: () => Promise<void>;
}

const defaultSettings: ISettingsData = {
  restaurantName: "Ceylon Curry",
  address: "44 Mayflower St, Plymouth PL1 1QX",
  mobileNumber: "01752 941504",
  whatsappNumber: "+447824110369",
  restaurantEmail: "info@ceyloncurry.co.uk",
  adminEmail: "ceyloncurry2025@gmail.com",
  deliveryFee: 2.99,
  openingHours: {
    monday: "10:00 AM - 10:00 PM",
    tuesday: "10:00 AM - 10:00 PM",
    wednesday: "10:00 AM - 10:00 PM",
    thursday: "10:00 AM - 10:00 PM",
    friday: "10:00 AM - 10:00 PM",
    saturday: "10:00 AM - 10:00 PM",
    sunday: "10:00 AM - 10:00 PM",
  },
  socialLinks: {
    facebook: "https://www.facebook.com/ceyloncurrysl/",
    instagram: "https://www.instagram.com/ceyloncurrys/",
    tiktok: "https://www.tiktok.com/@ceylon.curry.plym",
  },
  currency: "£",
  reservationSettings: {
    reservationDurationMinutes: 60,
    minNoticeHours: 1,
    maxAdvanceDays: 30,
  },
  heroImages: [
    "/images/hero/biryani.webp",
    "/images/hero/parotta.webp",
    "/images/hero/curry.webp",
    "/images/hero/dosa.webp",
  ],
  signatureDishes: [
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
  ],
  storyMainImage: "/shop.jpeg",
  storySecondaryImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  ],
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refetchSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          ...defaultSettings,
          ...data.settings,
          openingHours: {
            ...defaultSettings.openingHours,
            ...(data.settings.openingHours || {}),
          },
          socialLinks: {
            ...defaultSettings.socialLinks,
            ...(data.settings.socialLinks || {}),
          },
          reservationSettings: {
            ...defaultSettings.reservationSettings,
            ...(data.settings.reservationSettings || {}),
          },
          signatureDishes:
            data.settings.signatureDishes && data.settings.signatureDishes.length > 0
              ? data.settings.signatureDishes
              : defaultSettings.signatureDishes,
          storyMainImage: data.settings.storyMainImage || defaultSettings.storyMainImage,
          storySecondaryImage: data.settings.storySecondaryImage || defaultSettings.storySecondaryImage,
          galleryImages:
            data.settings.galleryImages && data.settings.galleryImages.length > 0
              ? data.settings.galleryImages
              : defaultSettings.galleryImages,
        });
      }
    } catch (error) {
      console.error("Error fetching dynamic settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetchSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
