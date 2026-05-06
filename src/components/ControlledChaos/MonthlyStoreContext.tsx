import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNotifications } from "./NotificationContext";

export type MonthlyStoreStatus = 'idle' | 'spinning' | 'confirmed' | 'burned';

interface MonthlyStoreContextType {
  isOpen: boolean;
  status: MonthlyStoreStatus;
  discount: number | null;
  activeGames: string[];
  timeLeft: number; // Seconds
  probabilities: {
    common: number; // 5-20%
    medium: number; // 20-50%
    rare: number;   // 50-85%
  };
  openStore: () => void;
  closeStore: () => void;
  spin: () => void;
  confirmDiscount: () => void;
  burnChance: () => void;
  setProbabilityConfig: (config: any) => void;
}

const MonthlyStoreContext = createContext<MonthlyStoreContextType | undefined>(undefined);

export function MonthlyStoreProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<MonthlyStoreStatus>('idle');
  const [discount, setDiscount] = useState<number | null>(null);
  const [activeGames, setActiveGames] = useState<string[]>(["pubg-mobile", "free-fire", "e-football"]);
  const [timeLeft, setTimeLeft] = useState(3 * 24 * 60 * 60); // 3 days default
  const [probabilities, setProbabilities] = useState({
    common: 50, // 50% chance for 5-20% discount
    medium: 35, // 35% chance for 20-50% discount
    rare: 15    // 15% chance for 50-85% discount
  });

  const { addNotification } = useNotifications();

  // Persist state
  useEffect(() => {
    const saved = localStorage.getItem("al-lord-monthly-store-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStatus(parsed.status || 'idle');
        setDiscount(parsed.discount || null);
      } catch (e) {
        console.error("Failed to parse monthly store state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("al-lord-monthly-store-state", JSON.stringify({ status, discount }));
  }, [status, discount]);

  // Timer logic
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const spin = () => {
    if (status !== 'idle') return;
    setStatus('spinning');
    
    // The actual selection logic
    const roll = Math.random() * 100;
    let finalDiscount = 5;

    if (roll < probabilities.rare) {
      finalDiscount = Math.floor(Math.random() * (85 - 50 + 1) + 50);
    } else if (roll < (probabilities.rare + probabilities.medium)) {
      finalDiscount = Math.floor(Math.random() * (50 - 20 + 1) + 20);
    } else {
      finalDiscount = Math.floor(Math.random() * (20 - 5 + 1) + 5);
    }

    setDiscount(finalDiscount);
  };

  const confirmDiscount = () => {
    setStatus('confirmed');
    addNotification("الخصم تفعيل!", `لقد حصلت على خصم ${discount}%`, "success");
  };

  const burnChance = () => {
    setStatus('burned');
    setIsOpen(false);
    addNotification("فرصة ضائعة", "لقد خسرت فرصتك في المتجر الشهري لهذا الشهر.", "error");
  };

  const openStore = () => {
    if (status === 'burned') {
      addNotification("تنبيه", "لقد تم حرق فرصتك لهذا الشهر.", "warning");
      return;
    }
    setIsOpen(true);
  };

  const closeStore = () => setIsOpen(false);

  const setProbabilityConfig = (config: any) => setProbabilities(config);

  return (
    <MonthlyStoreContext.Provider value={{ 
      isOpen, status, discount, activeGames, timeLeft, probabilities,
      openStore, closeStore, spin, confirmDiscount, burnChance, setProbabilityConfig
    }}>
      {children}
    </MonthlyStoreContext.Provider>
  );
}

export function useMonthlyStore() {
  const context = useContext(MonthlyStoreContext);
  if (!context) throw new Error("useMonthlyStore must be used within MonthlyStoreProvider");
  return context;
}
