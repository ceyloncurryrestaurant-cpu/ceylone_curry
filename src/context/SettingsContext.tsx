"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
  whatsappNumber: "+441752941504",
  restaurantEmail: "info@ceyloncurry.co.uk",
  adminEmail: "admin@ceyloncurry.co.uk",
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
    facebook: "https://facebook.com/ceyloncurry",
    instagram: "https://instagram.com/ceyloncurry",
    tiktok: "https://tiktok.com/@ceyloncurry",
  },
  currency: "£",
  reservationSettings: {
    reservationDurationMinutes: 60,
    minNoticeHours: 1,
    maxAdvanceDays: 30,
  },
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
