import React, { useState, useEffect } from "react";
import { Heart, Search, Filter, X, ArrowUpRight, ArrowLeft, Gamepad2, Languages, Loader2, CheckCircle, Flame, Star, Trophy, Sparkles } from "lucide-react";
import { useGames } from "@/components/ControlledChaos/GamesContext";
import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { BrutalButton } from "@/components/ControlledChaos/BrutalButton";
import { Link } from "react-router-dom";
import { slugify } from "@/pages/GameDetailPage";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useWallet } from "@/components/ControlledChaos/WalletContext";
import { GemIcon } from "@/components/ControlledChaos/GemIcon";
import { useLogin } from "@/components/ControlledChaos/LoginContext";
import { formatGems } from "@/lib/utils";
import gsap from "gsap";

type Category = "all" | "mobile" | "pc";

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { lang, toggleLang, t } = useLang();
  const { games } = useGames();
  const { settings } = useSettings();
  const { balance } = useWallet();
  const { isLoggedIn } = useLogin();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("al-lord-favorites") || "[]"); } catch { return []; }
  });

  const [orderCheck, setOrderCheck] = useState<{isOpen: boolean, game: string, step: "checking"|"success"}>({
    isOpen: false,
    game: "",
    step: "checking"
  });

  const handleDirectOrder = (e: React.MouseEvent, gameName: string) => {
    e.preventDefault();
    setOrderCheck({ isOpen: true, game: gameName, step: "checking" });
    
    setTimeout(() => {
      setOrderCheck(prev => ({ ...prev, step: "success" }));
      setTimeout(() => {
        const userContact = localStorage.getItem("user_contact") || (lang === "ar" ? "زائر" : "Guest");
        const msg = lang === "ar" 
          ? `مرحباً، أريد شحن لعبة ${gameName} بشكل مباشر. اسم الحساب في الموقع: ${userContact}`
          : `Hello, I want to top up ${gameName} directly. My account contact: ${userContact}`;
        window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
        setOrderCheck(prev => ({ ...prev, isOpen: false }));
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    localStorage.setItem("al-lord-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]);
  };

  const filtered = games.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || g.category === category;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(g.name);
    return matchSearch && matchCategory && matchesFavorites;
  });

  // Entrance animation for cards
  useEffect(() => {
    if (filtered.length > 0) {
      gsap.to(".game-card", {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power4.out",
        overwrite: "auto"
      });
    }
  }, [filtered, category]);

  // Banner rotation logic (every 1 minute)
  useEffect(() => {
    if (settings.bannerImages && settings.bannerImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner(prev => (prev + 1) % settings.bannerImages.length);
      }, 5000); // 5 seconds
      return () => clearInterval(timer);
    }
  }, [settings.bannerImages]);

  const categories: { label: string; value: Category }[] = [
    { label: "All Games", value: "all" },
    { label: "Mobile", value: "mobile" },
    { label: "PC / Console", value: "pc" },
  ];

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)", color: "var(--c-ink)" }}>
        {/* Header */}
        <div className="border-b-4 border-[var(--c-ink)] px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase hover:text-[var(--c-orange)] transition-colors">
              <ArrowLeft className="w-5 h-5" /> {t("Back", "رجوع")}
            </Link>
            {/* Redundant mobile balance hidden per user request */}
            {isLoggedIn && (
              <Link 
                to="/buy-gems" 
                className="hidden flex-row items-center gap-1 border-2 px-1.5 py-1 transition-all text-xs font-black cursor-pointer bg-[#b084ff] text-black border-black shadow-[2px_2px_0px_#000]"
              >
                 <span>{formatGems(balance)}</span>
                 <GemIcon size={14} />
              </Link>
            )}
            <div className="hidden md:flex items-center gap-2" dir="ltr">
              <Gamepad2 className="w-6 h-6 text-[var(--c-lime)]" />
              <span className="text-2xl font-black uppercase">AL LORD STORE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-1 hover:text-[var(--c-lime)] transition-colors cursor-pointer text-sm font-bold uppercase">
              <Languages className="w-4 h-4" />
              {lang === "en" ? "عربي" : "EN"}
            </button>
            {isLoggedIn && (
              <Link 
                to="/buy-gems" 
                className="hidden md:flex flex-row items-center gap-2 border-2 px-2.5 py-1 transition-all text-sm font-black hover:-translate-y-0.5 cursor-pointer bg-[#b084ff] text-black border-black shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000]"
              >
                 <span>{formatGems(balance)}</span>
                 <GemIcon size={16} />
              </Link>
            )}
            <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <BrutalButton>{t("Order Now", "اطلب الآن")}</BrutalButton>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black uppercase mb-8">
            <span className="font-marker text-[var(--c-orange)]">All</span> Games
          </h1>

          {/* Search & Filters Section */}
          <div className="flex flex-col gap-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Refined Search Bar */}
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-[var(--c-orange)] translate-x-2 translate-y-2 border-4 border-black group-focus-within:translate-x-1 group-focus-within:translate-y-1 transition-transform" />
                <div className="relative flex items-center bg-white border-4 border-black">
                  {/* Search icon — always on the left in LTR, right in RTL via absolute */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <Search className="w-5 h-5 text-black/40 group-focus-within:text-[var(--c-orange)] transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder={t("Search games...", "ابحث عن اللعبة...")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-xl font-bold bg-transparent focus:outline-none"
                    dir="auto"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="px-4 text-red-500 hover:scale-110 transition-transform flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Refined Category Filters */}
              <div className="flex gap-2 h-[68px]">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`relative px-6 flex items-center gap-2 border-4 border-black text-sm md:text-base font-bold md:font-black uppercase transition-all overflow-hidden ${
                      category === c.value
                        ? "bg-[var(--c-lime)] translate-x-1 translate-y-1 shadow-none"
                        : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                    }`}
                  >
                    <Filter className="w-4 h-4 opacity-50" />
                    <span className="relative z-10">{t(c.label, c.label === "All Games" ? "الكل" : c.label === "Mobile" ? "جوال" : "كمبيوتر")}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advertisement Banner (Slideshow) */}
            {settings.bannerImages && settings.bannerImages.length > 0 && (
              <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-[8px_8px_0px_#000] h-[180px] sm:h-[250px] md:h-[400px] bg-black mb-1 md:mb-6">
                {settings.bannerImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentBanner 
                        ? "opacity-100 z-10 scale-100" 
                        : "opacity-0 z-0 scale-110"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ))}

                {/* Banner Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                   {settings.bannerImages.map((_, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setCurrentBanner(idx)}
                      className={`h-3 rounded-full border-2 border-black transition-all ${idx === currentBanner ? 'w-10 bg-[var(--c-lime)]' : 'w-3 bg-white/50 hover:bg-white'}`}
                     />
                   ))}
                </div>
                
                {/* Visual Flair */}
                <div className="absolute top-4 left-4 z-20 bg-black text-[var(--c-lime)] px-4 py-1 border-2 border-[var(--c-lime)] font-black uppercase text-[10px] tracking-[0.2em] shadow-[4px_4px_0px_#000]">
                   Trending Now
                </div>
              </div>
            )}
          </div>

          {/* Results count & Info Display */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-2 md:mb-6 gap-2 w-full">
            <div className="flex flex-row items-center justify-between lg:justify-start gap-2 sm:gap-6 w-full lg:w-auto">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--c-orange)] mb-0 md:mb-1">{t("Catalogue", "كتالوج الألعاب")}</span>
                <p className="text-lg md:text-4xl font-black uppercase leading-none">
                  {category === "all" ? t("All Titles", "كل العناوين") : category === "mobile" ? t("Mobile Hits", "ألعاب الجوال") : t("PC Classics", "ألعاب الكمبيوتر")}
                </p>
              </div>
              <div className="h-12 w-1.5 bg-black/10 rotate-12 hidden sm:block" />
              <p className="inline-flex w-fit text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80 bg-black/5 px-2 py-1 md:px-3 md:py-1.5 border border-dashed border-black/20">
                {lang === "ar" 
                  ? `${filtered.length} لعبة`
                  : `${filtered.length} TITLES`
                }
              </p>
            </div>
            
            <div className="flex flex-row items-center gap-2 w-full lg:w-auto mt-1 lg:mt-0">
              {favorites.length > 0 && (
                <button 
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex-1 lg:flex-none flex justify-center items-center gap-1 text-[10px] md:text-xs font-bold uppercase px-2 py-1.5 md:px-4 md:py-2 border-2 md:border-4 border-black shadow-[2px_2px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#000] md:hover:shadow-[6px_6px_0px_#000] active:translate-y-0 transition-all ${showFavoritesOnly ? 'bg-[var(--c-lime)] text-black' : 'bg-red-500 text-white'}`}
                >
                  <Heart className={`w-3 h-3 md:w-4 md:h-4 ${showFavoritesOnly ? 'fill-black' : 'fill-white'}`} />
                  {showFavoritesOnly ? t("All", "الكل") : `${t("Favorites", "المفضلة")} (${favorites.length})`}
                </button>
              )}
              <Link
                to="/community"
                className="group flex-1 lg:flex-none flex justify-center items-center gap-1 text-[10px] md:text-xs font-bold uppercase bg-black text-[var(--c-lime)] px-2 py-1.5 md:px-4 md:py-2 border-2 md:border-4 border-black shadow-[2px_2px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[0px_8px_20px_rgba(204,255,0,0.3)] active:translate-y-0 transition-all"
              >
                <span>🎮</span>
                {t("Sell Account", "اعرض حسابك")}
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Compact Games Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6 relative">
            {filtered.map((g, i) => (
              <Link 
                key={i} 
                to={`/game/${slugify(g.name)}`}
                className="game-card group relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_var(--c-purple)] hover:-translate-y-1 transition-all duration-300 bg-white"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                {/* Full Image */}
                <img 
                  src={g.image} 
                  alt={g.name} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:brightness-110 transition-all duration-300 z-0"
                />

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-10 opacity-20 group-hover:opacity-40 transition-opacity" />

                {/* Hover Darkening Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10" />

                {/* Discount Badge */}
                {g.discount != null && g.discount > 0 && (
                  <div className="absolute top-1 left-1 md:top-3 md:left-3 bg-red-600 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-sm md:rounded-md shadow-[2px_2px_0px_#000] z-20 transition-transform border md:border-2 border-black">
                    -{g.discount}%
                  </div>
                )}

                {/* Favorite Toggle (Overlayed) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(g.name);
                  }}
                  className="absolute top-2 right-2 md:top-3 md:right-3 z-20 w-8 h-8 md:w-10 md:h-10 bg-white/90 border-2 md:border-4 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 hover:bg-[var(--c-lime)] shadow-[2px_2px_0px_#000] rounded-full"
                >
                  <Heart
                    className={`w-4 h-4 md:w-5 md:h-5 ${favorites.includes(g.name) ? "fill-red-500 text-red-500" : "text-black"}`}
                  />
                </button>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl font-black uppercase mb-4">{t("No games found", "لم يتم إيجاد اللعبة")}</p>
              <p className="text-lg opacity-50">{t("Try a different search or category", "جرب بحث مختلف أو غيّر التصنيف")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-white border-4 border-black flex items-center justify-center rounded-full shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--c-lime)] transition-all"
        style={{ direction: 'ltr' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
      </button>

      {/* Verification Modal */}
      {orderCheck.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-300">
            {/* Shadow */}
            <div className="absolute inset-0 bg-[var(--c-orange)] translate-x-3 translate-y-3 border-4 border-[var(--c-ink)]" />
            
            <div className="relative border-4 border-[var(--c-ink)] p-8 text-center flex flex-col items-center justify-center min-h-[250px]" style={{ backgroundColor: "var(--c-bg)" }}>
              {orderCheck.step === "checking" ? (
                <>
                  <Loader2 className="w-16 h-16 text-[var(--c-ink)] animate-spin mb-6" />
                  <h3 className="text-xl font-black uppercase mb-2 text-[var(--c-ink)]" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                    {t("Fetching Account Details...", "جاري جلب بيانات الحساب...")}
                  </h3>
                  <p className="text-sm font-bold opacity-70 text-[var(--c-ink)]" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                    {t("Please wait while we prepare your request for", "يرجى الانتظار بينما نجهز طلبك لـ")} <br/>
                    <span className="text-[var(--c-purple)] font-black text-lg">{orderCheck.game}</span>
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-16 h-16 text-[var(--c-lime)] mb-6 animate-in zoom-in duration-300" />
                  <h3 className="text-xl font-black uppercase mb-2 text-[var(--c-ink)]" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                    {t("Account Fetched Successfully!", "تم استرجاع بيانات الحساب بنجاح!")}
                  </h3>
                  <p className="text-sm font-bold opacity-70 text-[var(--c-ink)]" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                    {t("Redirecting you to WhatsApp...", "جاري تحويلك للمحادثة...")}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
