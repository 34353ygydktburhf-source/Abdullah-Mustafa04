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
      }, 60000); // 1 minute
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
                    className="w-full pl-12 pr-4 py-4 text-xl font-black bg-transparent focus:outline-none"
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
                    className={`relative px-6 flex items-center gap-2 border-4 border-black text-xs md:text-sm font-black uppercase transition-all overflow-hidden ${
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
              <div className="relative group overflow-hidden rounded-2xl shadow-[0px_16px_40px_rgba(0,0,0,0.2)] h-80 md:h-[520px] bg-black">
                {settings.bannerImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                      idx === currentBanner 
                        ? "opacity-100 translate-x-0 scale-100 z-10" 
                        : "opacity-0 translate-x-full scale-110 z-0"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-700" />
                    
                    {/* Scanline Effect Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-30" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                       <div className="flex items-center gap-3 mb-3">
                          <div className="bg-white text-black px-3 py-1 font-black text-[10px] border-2 border-black">
                            {idx + 1} / {settings.bannerImages.length}
                          </div>
                       </div>
                       <h2 className="text-white font-black uppercase text-2xl md:text-5xl drop-shadow-[4px_4px_0px_#000] tracking-tighter leading-none mb-2"> 
                         {t("Premium Deals", "أفضل العروض الحصرية")} 
                       </h2>
                    </div>
                  </div>
                ))}

                {/* Banner Controls */}
                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                   {settings.bannerImages.map((_, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setCurrentBanner(idx)}
                      className={`h-3 transition-all border-2 border-black ${idx === currentBanner ? 'w-10 bg-[var(--c-lime)]' : 'w-3 bg-white hover:bg-gray-300'}`}
                     />
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Results count & Info Display */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--c-orange)] mb-1">{t("Catalogue", "كتالوج الألعاب")}</span>
                <p className="text-3xl md:text-4xl font-black uppercase leading-none">
                  {category === "all" ? t("All Titles", "كل العناوين") : category === "mobile" ? t("Mobile Hits", "ألعاب الجوال") : t("PC Classics", "ألعاب الكمبيوتر")}
                </p>
              </div>
              <div className="h-12 w-1.5 bg-black/10 rotate-12 hidden md:block" />
              <p className="text-xs md:text-sm font-black uppercase tracking-widest opacity-50 bg-black/5 px-3 py-1 border-2 border-dashed border-black/20">
                {lang === "ar" 
                  ? `${filtered.length} لعبة متاحة`
                  : `${filtered.length} TITLES AVAILABLE`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {favorites.length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                   <span className="text-[10px] font-black uppercase opacity-40">{t("Your Picks", "اختياراتك")}:</span>
                   <button 
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`flex items-center gap-2 text-xs font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000] active:translate-y-0 transition-all ${showFavoritesOnly ? 'bg-[var(--c-lime)] text-black' : 'bg-red-500 text-white'}`}
                  >
                    <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-black' : 'fill-white'}`} />
                    {showFavoritesOnly ? t("Show All", "عرض الكل") : `${t("Favorites", "المفضلة")} (${favorites.length})`}
                  </button>
                </div>
              )}
              <Link
                to="/community"
                className="group flex items-center gap-2 text-xs font-black uppercase bg-black text-[var(--c-lime)] px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] hover:shadow-[0px_8px_20px_rgba(204,255,0,0.3)] active:translate-y-0 transition-all"
              >
                <span>🎮</span>
                {t("Sell Account", "اعرض حسابك")}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Compact Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 relative">
            {filtered.map((g, i) => (
              <Link 
                key={i} 
                to={`/game/${slugify(g.name)}`}
                className="game-card group relative aspect-square overflow-hidden rounded-2xl bg-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0px_16px_40px_rgba(204,255,0,0.35)] hover:-translate-y-2 transition-all duration-500 ease-out"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
              >
                {/* Blurred Background Layer with Animated Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 blur-lg grayscale-[0.3] group-hover:scale-125 group-hover:opacity-50 transition-all duration-700 ease-in-out"
                  style={{ backgroundImage: `url(${g.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-20 opacity-20 group-hover:opacity-40 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                  {/* Game Icon with Floating Animation */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-[var(--c-lime)] translate-x-1 translate-y-1 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-2xl bg-white transition-all duration-500 group-hover:rotate-[5deg] group-hover:-translate-y-2 group-hover:shadow-[0px_8px_24px_rgba(0,0,0,0.5)]">
                      <img 
                        src={g.image} 
                        alt={g.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Discount Badge - Floating Style */}
                    {g.discount != null && g.discount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] md:text-xs font-black px-2 py-1 rounded-full shadow-lg z-30 group-hover:scale-110 transition-transform">
                        -{g.discount}%
                      </div>
                    )}
                  </div>

                  {/* Game Name - Animated Reveal */}
                  <div className="relative overflow-hidden px-2 py-1">
                    <h3 className="text-xs md:text-sm font-black uppercase text-white leading-tight transition-all duration-300 transform group-hover:scale-110 group-hover:text-[var(--c-lime)] drop-shadow-[2px_2px_0px_#000]">
                      {g.name}
                    </h3>
                  </div>

                  {/* Category Tag (Optional/Small) */}
                  <div className="mt-2 h-0 group-hover:h-5 overflow-hidden transition-all duration-300">
                    <span className="text-[8px] md:text-[10px] font-black bg-[var(--c-orange)] text-black px-2 py-0.5 border-2 border-black uppercase tracking-tighter">
                      {g.cat}
                    </span>
                  </div>
                </div>

                {/* Favorite Toggle (Overlayed) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(g.name);
                  }}
                  className="absolute top-3 right-3 z-30 w-10 h-10 bg-black/80 border-4 border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 hover:bg-red-600 hover:border-black"
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.includes(g.name) ? "fill-white text-white" : "text-white"}`}
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
