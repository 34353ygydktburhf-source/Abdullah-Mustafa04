import React, { useState, useEffect, useRef } from "react";
import { useMonthlyStore } from "@/components/ControlledChaos/MonthlyStoreContext";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useGames } from "@/components/ControlledChaos/GamesContext";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { 
  Flame, Trophy, Timer, ArrowLeft, RotateCcw, CheckCircle, 
  AlertTriangle, Lock, Sparkles, ShoppingBag, Gem
} from "lucide-react";
import gsap from "gsap";
import { Link, useNavigate } from "react-router-dom";
import { GemIcon } from "@/components/ControlledChaos/GemIcon";

export default function MonthlyStorePage() {
  const { 
    status, discount, activeGames, timeLeft, spin, confirmDiscount, burnChance, closeStore 
  } = useMonthlyStore();
  const { t, lang } = useLang();
  const { games } = useGames();
  const navigate = useNavigate();
  const isRtl = lang === 'ar';
  
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(10);
  const exitTimerRef = useRef<any>(null);

  const spinnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Format time left
  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (24 * 3600));
    const h = Math.floor((seconds % (24 * 3600)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  useEffect(() => {
    if (status === 'spinning') {
      const tl = gsap.timeline();
      tl.to(spinnerRef.current, {
        rotate: 1440 + Math.random() * 360,
        duration: 3,
        ease: "power4.inOut",
        onComplete: () => {
          // Discount is already set in context by the spin() function
        }
      });
    }
  }, [status]);

  const handleExitAttempt = (e: React.MouseEvent | any) => {
    if (status === 'spinning' || status === 'idle') {
      e.preventDefault();
      setShowExitWarning(true);
      setExitCountdown(10);
      exitTimerRef.current = setInterval(() => {
        setExitCountdown(prev => {
          if (prev <= 1) {
            clearInterval(exitTimerRef.current);
            burnChance();
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      navigate("/");
    }
  };

  const cancelExit = () => {
    setShowExitWarning(false);
    clearInterval(exitTimerRef.current);
  };

  const selectedGamesData = games.filter(g => activeGames.includes(g.id));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[var(--c-lime)] selection:text-black overflow-x-hidden relative">
      <GlobalStyles />
      <style>{`
        .brutal-border { border: 4px solid white; box-shadow: 10px 10px 0px #000; }
        .brutal-glow { filter: drop-shadow(0 0 10px var(--c-lime)); }
        .bg-grid { background-image: radial-gradient(rgba(204,255,0,0.1) 1px, transparent 1px); background-size: 40px 40px; }
        @keyframes pulse-red { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
      `}</style>

      {/* Exit Warning Overlay */}
      {showExitWarning && (
        <div className="fixed inset-0 z-[1000] bg-red-600/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-black border-8 border-white p-8 md:p-12 max-w-2xl w-full shadow-[30px_30px_0px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-white/20 animate-[pulse-red_1s_infinite]"></div>
             <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-bounce" />
             <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
                {t("DANGER!", "خطر!")}
             </h2>
             <p className="text-xl md:text-2xl font-bold mb-8 text-white/80">
                {t("IF YOU LEAVE NOW, YOU WILL LOSE YOUR CHANCE FOR THE MONTH!", "لو خرجت الآن، ستخسر فرصتك لهذا الشهر بالكامل!")}
             </p>
             
             <div className="text-6xl font-black mb-12 text-red-500 font-mono">
                00:{exitCountdown < 10 ? `0${exitCountdown}` : exitCountdown}
             </div>

             <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={cancelExit}
                  className="flex-1 bg-[var(--c-lime)] text-black font-black uppercase py-4 text-xl border-4 border-black shadow-[8px_8px_0px_#fff]"
                >
                  {t("STAY & GET DISCOUNT", "ابقَ واستلم الخصم")}
                </button>
                <button 
                  onClick={() => { burnChance(); navigate("/"); }}
                  className="flex-1 bg-transparent text-white font-black uppercase py-4 text-xl border-4 border-white opacity-40 hover:opacity-100 transition-opacity"
                >
                  {t("EXIT & FORFEIT", "خروج نهائي")}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Header HUD */}
      <div className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b-4 border-white/10 px-6 py-4 flex justify-between items-center">
         <div className="flex items-center gap-4">
            <button onClick={handleExitAttempt} className="p-2 border-2 border-white hover:bg-white hover:text-black transition-all">
               <ArrowLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <div className="hidden md:block">
               <h1 className="text-xl font-black uppercase tracking-widest">{t("MONTHLY EXCLUSIVE", "المتجر الشهري الحصري")}</h1>
               <div className="flex items-center gap-2 text-[10px] text-[var(--c-lime)] font-bold">
                  <Timer className="w-3 h-3" />
                  <span>{formatTime(timeLeft)} REMAINING</span>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-3 md:gap-6">
            {status === 'confirmed' && (
              <div className="bg-[var(--c-lime)] text-black px-4 py-1.5 font-black text-xs border-2 border-black animate-pulse">
                {discount}% DISCOUNT APPLIED
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/5 border-2 border-white/20 px-4 py-1.5">
               <Trophy className="w-4 h-4 text-yellow-500" />
               <span className="text-xs font-black uppercase tracking-tighter">AL LORD STATUS: ELITE</span>
            </div>
         </div>
      </div>

      <div className="relative pt-12 pb-32 px-6 bg-grid">
         {/* Hero Section */}
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Spinner Logic */}
            <div className="lg:col-span-5 flex flex-col items-center">
               <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                  {/* Decorative Rings */}
                  <div className="absolute inset-0 border-[16px] border-white/5 rounded-full animate-spin-slow"></div>
                  <div className="absolute inset-4 border-[4px] border-dashed border-[var(--c-lime)]/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                  
                  {/* The Spinner Body */}
                  <div 
                    ref={spinnerRef}
                    className="absolute inset-8 bg-black border-[12px] border-white rounded-full shadow-[0_0_50px_rgba(204,255,0,0.2)] flex items-center justify-center overflow-hidden"
                  >
                     {status === 'idle' ? (
                        <div className="text-center p-8">
                           <Flame className="w-16 h-16 text-[var(--c-lime)] mx-auto mb-4 animate-pulse" />
                           <p className="text-sm font-black uppercase tracking-[0.2em] opacity-40 mb-2">READY_TO_SPIN</p>
                           <h3 className="text-2xl font-black uppercase">{t("UNLEASH YOUR LUCK", "أطلق العنان لحظك")}</h3>
                        </div>
                     ) : (
                        <div className="text-center">
                           <div className="text-7xl md:text-9xl font-black text-[var(--c-lime)] tracking-tighter">
                              {discount || '??'}%
                           </div>
                           <p className="text-xs font-black uppercase tracking-[0.5em] opacity-40 mt-2">SYSTEM_CALCULATING</p>
                        </div>
                     )}
                     
                     {/* Spinner Center Pin */}
                     <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-white border-x-2 border-black z-20"></div>
                     </div>
                  </div>
               </div>

               <div className="mt-12 w-full max-w-sm">
                  {status === 'idle' && (
                    <button 
                      onClick={spin}
                      className="w-full bg-[var(--c-lime)] text-black font-black uppercase py-6 text-3xl border-4 border-black shadow-[10px_10px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                    >
                      <span className="flex items-center justify-center gap-4">
                        {t("SPIN NOW", "ابدأ اللف")}
                        <RotateCcw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
                      </span>
                    </button>
                  )}

                  {status === 'spinning' && (
                    <div className="w-full bg-white text-black font-black uppercase py-6 text-3xl border-4 border-black text-center animate-pulse">
                      {t("SPINNING...", "جاري اللف...")}
                    </div>
                  )}

                  {status === 'confirmed' && (
                    <div className="w-full bg-black border-4 border-[var(--c-lime)] text-[var(--c-lime)] font-black uppercase py-6 text-2xl text-center shadow-[0_0_20px_var(--c-lime)]">
                      <CheckCircle className="w-6 h-6 inline mr-2" />
                      {t("DISCOUNT SECURED", "تم تثبيت الخصم")}
                    </div>
                  )}
               </div>
               
               {/* Chance Warning */}
               {status === 'idle' && (
                 <p className="mt-6 text-[10px] font-black uppercase text-white/30 tracking-[0.3em] animate-pulse">
                   {t("WARNING: YOU ONLY GET ONE CHANCE PER MONTH", "تنبيه: لديك فرصة واحدة فقط كل شهر")}
                 </p>
               )}
            </div>

            {/* Right: Games Selection */}
            <div className="lg:col-span-7">
               <div className="mb-10 flex items-end justify-between border-b-4 border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black text-[var(--c-lime)] uppercase tracking-[0.5em]">{t("PERSONALIZED DEALS", "عروض مخصصة لك")}</span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mt-2">{t("THE ELITE BUNDLES", "حزم النخبة")}</h2>
                  </div>
                  {status === 'spinning' && discount && (
                    <button 
                      onClick={confirmDiscount}
                      className="bg-white text-black px-8 py-4 font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0px_var(--c-lime)] hover:bg-[var(--c-lime)] transition-colors"
                    >
                      {t("CONFIRM DISCOUNT", "تأكيد الخصم")}
                    </button>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedGamesData.map((game) => (
                    <div key={game.id} className="group relative bg-white text-black border-4 border-black p-6 shadow-[12px_12px_0px_rgba(255,255,255,0.1)] overflow-hidden transition-all hover:shadow-[12px_12px_0px_var(--c-lime)]">
                       {/* Animated Frame */}
                       <div className="absolute inset-0 border-2 border-[var(--c-lime)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--c-lime)] rotate-45 translate-x-12 -translate-y-12"></div>
                       
                       <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                             <div className="w-16 h-16 bg-black border-4 border-white overflow-hidden shadow-[4px_4px_0px_#000]">
                                <img src={game.image} className="w-full h-full object-cover" alt={game.name} />
                             </div>
                             {status === 'confirmed' && (
                                <div className="bg-black text-[var(--c-lime)] px-3 py-1 font-black text-[10px] uppercase">
                                   -{discount}% OFF
                                </div>
                             )}
                          </div>

                          <h3 className="text-2xl font-black uppercase leading-none mb-2">{lang === 'ar' ? game.nameAr : game.name}</h3>
                          <p className="text-xs font-bold opacity-60 mb-6 line-clamp-2">{lang === 'ar' ? game.descAr : game.desc}</p>

                          <Link 
                            to={`/game/${game.id}`}
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-black uppercase text-xs hover:bg-[var(--c-lime)] hover:text-black transition-colors"
                          >
                             <ShoppingBag className="w-4 h-4" />
                             {t("CLAIM DEAL", "احصل على العرض")}
                          </Link>
                       </div>

                       {/* Interactive Hover Icons */}
                       <Sparkles className="absolute bottom-4 right-4 w-6 h-6 text-black/5 group-hover:text-[var(--c-lime)] transition-colors" />
                    </div>
                  ))}
               </div>

               {/* Social Proof Footer */}
               <div className="mt-12 p-6 border-4 border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
                     <GemIcon size={24} className="animate-bounce" />
                     <div className="animate-marquee flex gap-12 text-[10px] font-black uppercase opacity-60">
                        <span>USER_771 JUST UNLOCKED 85% OFF!</span>
                        <span>MOHAMED_K RECEIVED 1,500 BONUS GEMS!</span>
                        <span>SARA_99 SECURED THE LUCKY DEAL BADGE!</span>
                        <span>DARK_KNIGHT GOT 75% DISCOUNT ON PUBG!</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
