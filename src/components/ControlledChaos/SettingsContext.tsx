import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteSettings {
  whatsappNumber: string;
  facebookLink: string;
  instagramLink: string;
  telegramLink: string;
  messengerLink: string;
  supportEmail: string;
  currencySymbol: string;
  currencySuffix: boolean;
  paymentAccounts: { id: string; name: string; value: string; countryCode?: string }[];
  notificationsEnabled: boolean;
  bannerImages: string[];
  maintenanceMode: boolean;
  announcementBanner: string;
  siteName: string;
  gemPrice: number;
}

const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "201063006506",
  facebookLink: "https://www.facebook.com/share/p/Lq6B2VLD9VrqaRqU/?mibextid=oFDknk",
  instagramLink: "https://www.instagram.com/0_allord?igsh=bnAzc2NyNXpleGN0",
  telegramLink: "https://t.me/allord00o",
  messengerLink: "https://m.me/yourpage",
  supportEmail: "support@allordstore.com",
  currencySymbol: "ج.م",
  currencySuffix: true,
  paymentAccounts: [
    { id: "1", name: "Vodafone Cash", value: "01063006506", countryCode: "eg" },
    { id: "2", name: "InstaPay", value: "allord@instapay", countryCode: "eg" },
    { id: "3", name: "PayPal", value: "allord@store.com", countryCode: "global" },
    { id: "4", name: "Binance Wallet", value: "ID: 15487723", countryCode: "global" }
  ],
  notificationsEnabled: true,
  bannerImages: [
    "https://i.pinimg.com/1200x/2c/68/d9/2c68d9f10928a6f3a388147d337d4062.jpg",
    "https://i.pinimg.com/1200x/41/6e/f4/416ef493cba6e992c2e32e0468d9d033.jpg",
    "https://i.pinimg.com/1200x/61/ea/f4/61eaf493cba6e992c2e32e0468d9d033.jpg"
  ],
  maintenanceMode: false,
  announcementBanner: "خصم 50% على جميع شحنات ببجي موبايل اليوم!",
  siteName: "AL LORD STORE",
  gemPrice: 0.9
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const stored = localStorage.getItem("al-lord-site-settings");
    if (!stored) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure new keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = (updates: Partial<SiteSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem("al-lord-site-settings", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("al-lord-site-settings");
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
