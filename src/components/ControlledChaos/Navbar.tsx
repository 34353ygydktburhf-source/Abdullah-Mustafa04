import React, { useState } from "react";
import { Gamepad2, Languages, LogIn, LogOut, Users, Bell } from "lucide-react";
import { BrutalButton } from "./BrutalButton";
import { useLang } from "./LangContext";
import { useLogin } from "./LoginContext";
import { useNotifications } from "./NotificationContext";
import { useLocation, Link } from "react-router-dom";
import { NavProfileButton } from "./AccountSystem";
import { NotificationCenter } from "./NotificationCenter";
import { useWallet } from "./WalletContext";
import { GemIcon } from "./GemIcon";
import { formatGems } from "@/lib/utils";
import { useSettings } from "./SettingsContext";
import { useMonthlyStore } from "./MonthlyStoreContext";

function MonthlyStoreBadge() {
  const { status, isOpen, openStore } = useMonthlyStore();
  const { t } = useLang();
  
  if (status === 'burned' || status === 'confirmed') return null;
  
  return (
    <Link 
      to="/monthly-store"
      className="relative flex items-center gap-2 bg-black text-[var(--c-lime)] px-4 py-1.5 border-2 border-[var(--c-lime)] shadow-[4px_4px_0px_var(--c-lime)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group overflow-hidden pointer-events-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <span className="animate-pulse">🔥</span>
      <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter">
        {t("Monthly Store", "المتجر الشهري")}
      </span>
    </Link>
  );
}

export function Navbar() {
  const { settings } = useSettings();
  const { lang, toggleLang, t } = useLang();
  const { openLogin, isLoggedIn, openLogoutConfirm } = useLogin();
  const { unreadCount } = useNotifications();
  const { balance } = useWallet();
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  return (
    <>
      {settings.announcementBanner && (
        <div className="bg-[var(--c-orange)] text-black font-black uppercase text-[10px] md:text-xs text-center py-1.5 px-4 shadow-[0_2px_0_#000] relative z-[101] pointer-events-auto flex items-center justify-center gap-2">
           <span className="animate-pulse">🔥</span> {settings.announcementBanner} <span className="animate-pulse">🔥</span>
        </div>
      )}
      <nav className={`fixed ${settings.announcementBanner ? 'top-7 md:top-8' : 'top-0'} left-0 right-0 z-[100] flex items-center justify-between px-4 py-3 md:px-6 md:py-4 pointer-events-none ${isHomePage ? "mix-blend-difference" : ""}`}>
        {isHomePage ? (
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 shrink-0 hover:scale-105 transition-transform pointer-events-auto" dir="ltr">
            <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-[var(--c-lime)]" />
            <span className="text-sm sm:text-base md:text-xl font-black uppercase text-white leading-none mt-1">AL LORD STORE</span>
          </Link>
        ) : (
          <div className="w-32" /> // Empty space for layout balance
        )}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-white pointer-events-auto">
          <MonthlyStoreBadge />
          {isHomePage && (
            <>
              <a href="#games" className="hover:line-through">{t("Games", "الألعاب")}</a>
              <a href="#about" className="hover:line-through">{t("About", "عنّا")}</a>
              <a href="#reviews" className="hover:line-through">{t("Reviews", "آراء العملاء")}</a>
              <a href="#contact" className="hover:line-through">{t("Contact", "تواصل")}</a>
              <Link to="/games" className="hover:line-through">{t("All Games", "كل الألعاب")}</Link>
            </>
          )}
          {isHomePage && (
            <button onClick={toggleLang} className="flex items-center gap-1 hover:text-[var(--c-lime)] transition-colors cursor-pointer">
              <Languages className="w-4 h-4" />
              {lang === "en" ? "عربي" : "EN"}
            </button>
          )}
          
          {/* Desktop Gem Counter */}
          {isLoggedIn && !["/profile", "/community", "/buy-gems"].includes(location.pathname) && (
            <Link 
              to="/buy-gems" 
              className={`flex items-center gap-2 border-2 px-2.5 py-1 transition-all text-sm font-black hover:-translate-y-0.5 cursor-pointer ${
                isHomePage 
                  ? "bg-transparent text-[#b084ff] border-[#b084ff] hover:bg-[#b084ff] hover:text-black" 
                  : "bg-[#b084ff] text-black border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
              }`}
            >
               <span>{formatGems(balance)}</span>
               <GemIcon size={16} />
            </Link>
          )}

          {/* Desktop Notification Bell */}
          {isHomePage && (
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative transition-all cursor-pointer flex items-center gap-2 ${
                  !isHomePage 
                    ? "bg-[var(--c-lime)] text-black border-4 border-black p-3 shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]" 
                    : "p-2 hover:bg-white/10 text-white"
                }`}
              >
                <Bell className={`${!isHomePage ? "w-6 h-6" : "w-5 h-5"}`} />
                {!isHomePage && <span className="text-xs font-black uppercase">{t("Notifications", "الإشعارات")}</span>}
                {unreadCount > 0 && (
                  <span className={`absolute ${!isHomePage ? "-top-2 -right-2 w-5 h-5 text-[10px] flex items-center justify-center font-black" : "top-1 right-1 w-2.5 h-2.5"} bg-red-600 ${!isHomePage ? "text-white" : ""} rounded-full border-2 border-black animate-pulse shadow-[2px_2px_0px_rgba(0,0,0,0.3)]`}>
                    {!isHomePage && unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {isHomePage && (
            isLoggedIn ? (
              <button onClick={openLogoutConfirm} className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 text-xs font-black hover:bg-black hover:text-white transition-colors cursor-pointer ml-4 border-2 border-black">
                <LogOut className="w-4 h-4" />
                {t("LOGOUT", "خروج")}
              </button>
            ) : (
              <button onClick={openLogin} className="flex items-center gap-1 bg-white text-black px-3 py-1 text-xs font-black hover:bg-[var(--c-lime)] transition-colors cursor-pointer ml-4 border-2 border-black">
                <LogIn className="w-4 h-4" />
                {t("LOGIN", "دخول")}
              </button>
            )
          )}
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 pointer-events-auto">
          {/* Mobile Gem Counter */}
          {isLoggedIn && !isHomePage && !["/profile", "/community", "/buy-gems"].includes(location.pathname) && (
            <Link 
              to="/buy-gems" 
              className={`md:hidden flex items-center gap-1 border-2 px-1.5 py-1 transition-all text-xs font-black cursor-pointer ${
                 isHomePage 
                  ? "bg-transparent text-[#b084ff] border-[#b084ff]" 
                  : "bg-[#b084ff] text-black border-black shadow-[2px_2px_0px_#000]"
              }`}
            >
               <span>{formatGems(balance)}</span>
               <GemIcon size={14} />
            </Link>
          )}

          {isHomePage && (
            <button 
              onClick={() => {
                console.log("Mobile Bell Clicked!");
                setIsNotifOpen(true);
              }}
              className={`md:hidden relative z-[110] cursor-pointer transition-all active:scale-90 flex items-center justify-center ${
                !isHomePage 
                  ? "bg-[var(--c-lime)] text-black border-4 border-black w-10 h-10 shadow-[3px_3px_0px_#000]" 
                  : "p-3 text-white hover:text-[var(--c-lime)]"
              }`}
              aria-label="Notifications"
            >
              <Bell className={`${!isHomePage ? "w-5 h-5" : "w-6 h-6"}`} />
              {unreadCount > 0 && (
                <span className={`absolute ${!isHomePage ? "-top-1.5 -right-1.5 w-5 h-5 text-[10px] flex items-center justify-center font-black" : "top-2 right-2 w-3.5 h-3.5"} bg-red-600 rounded-full border-2 border-black animate-pulse shadow-[2px_2px_0px_rgba(0,0,0,0.3)] ${!isHomePage ? "text-white" : ""}`}>
                  {!isHomePage && unreadCount}
                </span>
              )}
            </button>
          )}
          {isHomePage && (
            <>
              <button onClick={isLoggedIn ? openLogoutConfirm : openLogin} className="md:hidden text-white flex items-center gap-1 text-xs uppercase tracking-widest shrink-0">
                {isLoggedIn ? <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button onClick={toggleLang} className="md:hidden text-white flex items-center gap-1 text-xs uppercase tracking-widest shrink-0">
                <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{lang === "en" ? "عربي" : "EN"}</span>
              </button>
            </>
          )}
          {/* Spacing for absolute Profile Button */}
          <div className="w-14 sm:w-16 h-10 sm:h-12 md:hidden shrink-0" />
        </div>
      </nav>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      
      {/* Profile Button - Standalone */}
      {isHomePage && (
        <div className={`fixed ${settings.announcementBanner ? 'top-9 md:top-12' : 'top-2.5 md:top-4'} ${lang === "ar" ? "left-3 md:left-6" : "right-3 md:right-6"} z-[110] pointer-events-auto transition-all`}>
          <NavProfileButton />
        </div>
      )}
    </>
  );
}
