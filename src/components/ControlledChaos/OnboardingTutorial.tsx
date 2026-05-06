import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  ArrowRight, CheckCircle, Heart, Zap, ShieldCheck, Diamond, Star, X, 
  Gamepad2, Users, Wallet, Trophy, Cpu, Activity, Terminal, Crosshair, 
  Layers, Lock, Unlock, RefreshCw, Radio, Binary, Info, BookOpen, 
  ShoppingBag, Shield, LayoutDashboard, History, Crown
} from "lucide-react";
import { useLang } from "./LangContext";
import { GemIcon } from "./GemIcon";

function SwordAnimation({ onComplete }: { onComplete: () => void }) {
  const [scrollCount, setScrollCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const swordRef = useRef<HTMLDivElement>(null);
  const rockRef = useRef<HTMLDivElement>(null);
  const particleContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const createSparks = (intensity: number, color: string = "#ccff00") => {
    if (!particleContainerRef.current) return;
    for (let i = 0; i < 12 * intensity; i++) {
      const spark = document.createElement('div');
      spark.className = `absolute w-1 h-1 rounded-full`;
      spark.style.backgroundColor = color;
      particleContainerRef.current.appendChild(spark);
      
      gsap.set(spark, { x: 0, y: 0 });
      gsap.to(spark, {
        x: gsap.utils.random(-200, 200),
        y: gsap.utils.random(-200, 200),
        opacity: 0,
        scale: 0,
        duration: gsap.utils.random(0.5, 1),
        ease: "power2.out",
        onComplete: () => spark.remove()
      });
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && scrollCount < 4) {
        setScrollCount(prev => prev + 1);
        createSparks(scrollCount + 1);
        
        // Shake rock and sword
        gsap.to([swordRef.current, rockRef.current], {
          x: `random(-${(scrollCount + 1) * 3}, ${(scrollCount + 1) * 3})`,
          y: `random(-${(scrollCount + 1) * 2}, ${(scrollCount + 1) * 2})`,
          duration: 0.05,
          repeat: 4,
          yoyo: true
        });
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollCount]);

  useEffect(() => {
    if (scrollCount > 0 && scrollCount < 5) {
      gsap.to(swordRef.current, {
        y: -scrollCount * 60,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      });
      
      // Flash effect on every step
      gsap.fromTo(swordRef.current, 
        { filter: "brightness(2)" },
        { filter: "brightness(1)", duration: 0.5 }
      );
    }
    
    if (scrollCount === 5) {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto";
          onComplete();
        }
      });

      // Screen Shake
      tl.to(containerRef.current, {
        x: "random(-10, 10)",
        y: "random(-10, 10)",
        duration: 0.05,
        repeat: 10,
        yoyo: true
      }, 0);

      // 1. Shatter the rock and lift the sword high
      tl.to(rockRef.current, {
        y: 400,
        opacity: 0,
        scale: 0.5,
        rotate: 15,
        duration: 0.6,
        ease: "back.in(2)",
        onStart: () => createSparks(20, "#ddd") 
      }, 0);

      tl.to(swordRef.current, {
        y: -600,
        scale: 1.5,
        duration: 1.2,
        ease: "power4.out",
        onStart: () => createSparks(30, "#ccff00")
      }, 0.2);

      // 2. Cinematic Pause & Radial Flash
      tl.to({}, { duration: 1 });

      // 3. Smooth Fade & Blur Exit
      tl.to(containerRef.current, {
        filter: "blur(100px) brightness(2.5)",
        opacity: 0,
        duration: 1.2,
        ease: "power2.in"
      });
    }
  }, [scrollCount]);

  const handleInteraction = () => {
    if (scrollCount < 5) {
      setScrollCount(prev => prev + 1);
      createSparks(scrollCount + 1);
      
      gsap.to([swordRef.current, rockRef.current], {
        x: `random(-${(scrollCount + 1) * 4}, ${(scrollCount + 1) * 4})`,
        y: `random(-${(scrollCount + 1) * 3}, ${(scrollCount + 1) * 3})`,
        duration: 0.05,
        repeat: 5,
        yoyo: true
      });
    }
  };

  // Touch Drag Logic
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = touchStart.current - e.touches[0].clientY;
    if (delta > 50 && scrollCount < 5) {
      handleInteraction();
      touchStart.current = e.touches[0].clientY;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden touch-none"
      onMouseDown={handleInteraction}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        .progress-bar {
          transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.15)_0%,transparent_70%)] animate-pulse"></div>

      {/* Progress HUD */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 md:w-96 h-2 bg-black/5 border-2 border-black overflow-hidden z-[100]">
        <div 
          className="progress-bar h-full bg-[var(--c-lime)] border-r-2 border-black" 
          style={{ width: `${(scrollCount / 5) * 100}%` }}
        />
        <div className="absolute top-4 left-0 w-full text-[8px] font-black uppercase text-black/40 flex justify-between tracking-tighter">
          <span>STRENGTH_DETECTED</span>
          <span>{scrollCount * 20}%</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center scale-[0.5] md:scale-75">
         {/* Instruction */}
         <div className={`absolute top-[-220px] w-full text-black font-black uppercase text-3xl text-center tracking-[0.5em] transition-all duration-700 ${scrollCount === 5 ? 'opacity-0 scale-110 blur-lg' : 'opacity-60'}`}>
            {t("UNLEASH THE POWER", "أطلق العنان للقوة")}
            <div className="mt-8 flex gap-4 justify-center">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-12 h-2 border-2 border-black transition-all duration-500 ${i <= scrollCount ? 'bg-[var(--c-lime)] scale-x-125' : 'bg-transparent'}`}></div>
               ))}
            </div>
            <div className="mt-6 text-xs font-bold tracking-[0.2em] animate-pulse">
               {t("DRAG UP OR SCROLL TO PULL", "اسحب للأعلى أو استخدم العجلة للسحب")}
            </div>
         </div>

         {/* Sword & Rock Assembly */}
         <div className="relative w-96 h-[600px] flex items-center justify-center">
            {/* Particle Container */}
            <div ref={particleContainerRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-30"></div>

            {/* Rock - Stylized with Cracks */}
            <div ref={rockRef} className="absolute bottom-0 w-[450px] h-72 z-20">
               <svg viewBox="0 0 450 250" className="w-full h-full drop-shadow-[30px_30px_0px_rgba(0,0,0,0.05)]">
                  <path d="M50 250 L0 200 L50 100 L150 50 L300 30 L400 80 L450 200 L400 250 Z" fill="#fcfcfc" stroke="black" strokeWidth="10" />
                  
                  {/* Dynamic Cracks - Progressive Over 5 Steps */}
                  {scrollCount >= 1 && (
                    <path d="M150 50 L180 90 L160 120" stroke="black" strokeWidth="4" strokeLinecap="round" fill="none" className="animate-in fade-in" />
                  )}
                  {scrollCount >= 2 && (
                    <path d="M300 30 L270 80 L290 130" stroke="black" strokeWidth="4" strokeLinecap="round" fill="none" className="animate-in fade-in" />
                  )}
                  {scrollCount >= 3 && (
                    <path d="M225 40 L225 180 M100 150 L180 200" stroke="black" strokeWidth="6" strokeLinecap="round" fill="none" className="animate-in fade-in" />
                  )}
                  {scrollCount >= 4 && (
                    <path d="M50 100 L400 80" stroke="black" strokeWidth="8" strokeDasharray="15 10" fill="none" className="animate-in zoom-in" />
                  )}
                  {scrollCount >= 5 && (
                    <path d="M0 200 L450 200" stroke="black" strokeWidth="12" strokeDasharray="20 10" fill="none" className="animate-in zoom-in" />
                  )}
               </svg>
            </div>
            
            {/* Sword Assembly */}
            <div ref={swordRef} className="relative z-10 flex flex-col items-center mt-32">
               {/* Crown Hilt */}
               <div className="relative mb-[-25px] z-30">
                  <div className="bg-[#ccff00] p-6 border-[8px] border-black shadow-[10px_10px_0px_#000] rotate-45">
                     <Crown className="w-16 h-16 text-black -rotate-45" />
                  </div>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-[#ccff00] rounded-full transition-all duration-1000 ${scrollCount === 4 ? 'scale-[3] opacity-0' : 'scale-0'}`}></div>
               </div>

               {/* Handle */}
               <div className="w-10 h-28 bg-black border-x-[8px] border-white/10 relative">
                  <div className="absolute inset-y-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1)_50%,transparent)]"></div>
               </div>

               {/* Cross-Guard */}
               <div className="w-48 h-10 bg-black border-[8px] border-white/10 shadow-[10px_10px_0px_#000] flex justify-between px-3">
                  <div className="w-5 h-full bg-[#ccff00] border-x-2 border-black"></div>
                  <div className="w-5 h-full bg-[#ccff00] border-x-2 border-black"></div>
               </div>

               {/* Blade */}
               <div className="w-20 h-[480px] bg-white border-x-[8px] border-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-full bg-black/10"></div>
                  
                  {/* Etched Pattern */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-[80%] border-x-2 border-black/5 flex flex-col gap-8 py-4 opacity-20">
                     {[...Array(6)].map((_, i) => <div key={i} className="w-full h-4 border-2 border-black rotate-45"></div>)}
                  </div>

                  {/* Glow on success */}
                  {scrollCount === 4 && (
                    <div className="absolute inset-0 bg-[#ccff00]/40 animate-pulse"></div>
                  )}
               </div>
            </div>
         </div>
      </div>
      
      {/* Cinematic Flash Overlay */}
      {scrollCount === 4 && (
        <div className="absolute inset-0 bg-white opacity-0 animate-[flash_2.5s_ease-out_forwards] pointer-events-none z-[10001]"></div>
      )}
    </div>
  );
}

export function OnboardingTutorial() {
  const { t, lang } = useLang();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactionCompleted, setInteractionCompleted] = useState(false);
  const [hudActive, setHudActive] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showSwordAnimation, setShowSwordAnimation] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';

  const steps = [
    {
      id: "ECOSYSTEM",
      icon: <Zap className="w-8 h-8" />,
      title: t("Direct Game Charging", "شحن ألعاب مباشر"),
      desc: t("We provide the fastest and most reliable game charging services for elite gamers. Your assets are delivered instantly to your game account.", "نقدم أسرع وأكثر خدمات شحن الألعاب موثوقية للاعبين المحترفين. يتم تسليم رصيدك فوراً إلى حسابك في اللعبة."),
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      points: [
        t("Direct ID charging system", "نظام شحن مباشر عبر المعرف (ID)"),
        t("Support for all major global titles", "دعم جميع الألعاب العالمية الكبرى"),
        t("Zero wait time for delivery", "وقت انتظار صفر للتسليم")
      ]
    },
    {
      id: "GEMS",
      icon: <GemIcon size={32} />,
      title: t("The Gem Currency", "عملة الجواهر"),
      desc: t("Gems are the heart of our platform. One balance to charge any game you want. Simple, secure, and always synchronized.", "الجواهر هي قلب منصتنا. رصيد واحد لشحن أي لعبة تريدها. بسيطة، آمنة، ودائماً متزامنة."),
      image: "https://i.pinimg.com/736x/fa/79/0d/fa790deb7789e9bf7236d5777cc90618.jpg",
      points: [
        t("Universal charging balance", "رصيد شحن موحد لكل الألعاب"),
        t("Instant wallet updates", "تحديثات فورية للمحفظة"),
        t("Special discounts for gem users", "خصومات خاصة لمستخدمي الجواهر")
      ]
    },
    {
      id: "COMMUNITY",
      icon: <Users className="w-8 h-8" />,
      title: t("Gamers Collective", "تجمع اللاعبين"),
      desc: t("Join an elite network of high-performance gamers. Share strategies, get updates, and become part of the Al Lord community.", "انضم إلى شبكة نخبوية من اللاعبين المحترفين. شارك الاستراتيجيات، احصل على التحديثات، وكن جزءاً من مجتمع ال لورد."),
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
      points: [
        t("Exclusive gamer events", "فعاليات حصرية للاعبين"),
        t("Early access to new offers", "وصول مبكر للعروض الجديدة"),
        t("24/7 dedicated support team", "فريق دعم مخصص على مدار الساعة")
      ]
    },
    {
      id: "SECURITY",
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t("Maximum Security", "أمان فائق"),
      desc: t("Your transactions are protected by military-grade encryption. We ensure every recharge is safe and your data is never shared.", "معاملاتك محمية بتشفير من الدرجة العسكرية. نضمن أن كل عملية شحن آمنة وبياناتك لا يتم مشاركتها أبداً."),
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      points: [
        t("End-to-end encryption", "تشفير من الطرف إلى الطرف"),
        t("Secure payment gateways", "بوابات دفع آمنة"),
        t("Privacy first policy", "سياسة الخصوصية أولاً")
      ]
    }
  ];

  const startTutorial = () => {
    setIsVisible(true);
    setCurrentStep(0);
    setShowSwordAnimation(false);
    setHudActive(true);
    document.body.style.overflow = "hidden";
    addLog("SYSTEM_GUIDE: RE-INITIALIZING...");
  };

  useEffect(() => {
    const hasSeen = localStorage.getItem("al-lord-onboarding-completed");
    if (!hasSeen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        setHudActive(true);
        addLog("SYSTEM_GUIDE: INITIALIZING...");
        addLog("INTERFACE_SCAN: OPTIMAL");
      }, 500);
    }

    window.addEventListener('al-lord-start-onboarding', startTutorial);
    return () => window.removeEventListener('al-lord-start-onboarding', startTutorial);
  }, []);

  useEffect(() => {
    setInteractionCompleted(false);
    if (isVisible && hudActive) {
      addLog(`CHAPTER_LOADED: ${steps[currentStep].id}`);
    }
  }, [currentStep, isVisible, hudActive]);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-4), `> ${msg}`]);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      gsap.to(contentRef.current, {
        opacity: 0,
        x: isRtl ? 50 : -50,
        duration: 0.3,
        onComplete: () => {
          setCurrentStep(c => c + 1);
          gsap.fromTo(contentRef.current, 
            { opacity: 0, x: isRtl ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
          );
        }
      });
    } else {
      exitTutorial();
    }
  };

  const exitTutorial = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      onComplete: () => {
        setShowSwordAnimation(true);
        localStorage.setItem("al-lord-onboarding-completed", "true");
      }
    });
  };

  if (!isVisible) return null;

  if (showSwordAnimation) {
    return <SwordAnimation onComplete={() => setIsVisible(false)} />;
  }

  const current = steps[currentStep];

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col md:flex-row overflow-hidden select-none transition-opacity duration-1000 ${hudActive ? 'opacity-100' : 'opacity-0'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background HUD Layers */}
      <div className="absolute inset-0 hud-grid opacity-20"></div>
      <div className="hud-scanline opacity-30"></div>

      {/* Sidebar - Navigation Chapters */}
      <div className="w-full md:w-80 border-b-4 md:border-b-0 md:border-r-4 border-white/5 bg-black/50 backdrop-blur-xl z-20 flex flex-col p-6 md:p-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-[var(--c-lime)] flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_#fffbf0]">
            <Cpu className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none uppercase">AL LORD</h2>
            <span className="text-[10px] font-black text-[var(--c-lime)] tracking-[0.3em] uppercase">SYSTEM_GUIDE_v4.0</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {steps.map((step, i) => (
            <div 
              key={step.id}
              className={`flex items-center gap-4 p-4 border-2 transition-all duration-500 ${i === currentStep ? 'bg-white text-black border-white shadow-[4px_4px_0px_var(--c-lime)]' : 'bg-transparent text-white/40 border-white/10 opacity-60'}`}
            >
              <div className="text-xs font-black">0{i+1}</div>
              <div className="text-xs font-black uppercase tracking-widest">{step.id}</div>
              {i === currentStep && <Activity className="w-4 h-4 ml-auto text-black animate-pulse" />}
            </div>
          ))}
        </div>

        {/* Terminal Logs Footer */}
        <div className="mt-auto pt-8 border-t-2 border-white/5 hidden md:block">
           <div className="space-y-1.5">
              {terminalLogs.map((log, i) => (
                <p key={i} className="text-[9px] font-mono text-[var(--c-lime)] opacity-60 truncate">
                   {log}
                </p>
              ))}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-8 md:p-20 z-10">
        {/* Decorative corner accents */}
        <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white/20"></div>
        <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white/20"></div>
        <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white/20"></div>
        <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white/20"></div>

        <div ref={contentRef} className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Text Side */}
          <div className={`flex flex-col ${isRtl ? 'items-end text-right' : 'items-start text-left'}`}>
            <div className="flex items-center gap-4 mb-8 text-[var(--c-lime)]">
              {current.icon}
              <span className="text-xs font-black uppercase tracking-[0.5em]">{t("CHAPTER", "الفصل")} 0{currentStep + 1}</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase leading-none mb-8 tracking-tighter">
              {current.title}
            </h1>
            <p className="text-lg md:text-2xl font-bold text-white/50 leading-relaxed mb-12">
              {current.desc}
            </p>
            
            <div className="space-y-4">
              {current.points.map((point, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 bg-[var(--c-lime)] rounded-full group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm font-black text-white/80 uppercase tracking-widest">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative group">
             <div className="absolute -inset-4 border-4 border-[var(--c-lime)]/20 rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
             <div className="absolute -inset-4 border-4 border-white/10 -rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
             <div className="relative w-full aspect-video border-4 border-white overflow-hidden shadow-[20px_20px_0px_#000]">
                <img 
                  src={current.image} 
                  alt={current.id}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                
                {/* Overlay Icon */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-[var(--c-lime)] p-4 border-4 border-black text-black">
                  {current.icon}
                </div>
             </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="mt-20 md:mt-32 flex flex-col items-center gap-8">
          <button 
            onClick={nextStep}
            className="group relative bg-white text-black font-black uppercase text-xl md:text-3xl px-12 md:px-24 py-6 md:py-8 border-4 border-black shadow-[10px_10px_0px_var(--c-lime)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <span className="flex items-center gap-4">
              {currentStep === steps.length - 1 ? t("ENTER THE HUB", "دخول المركز") : t("NEXT CHAPTER", "الفصل التالي")}
              <ArrowRight className={`w-8 h-8 ${isRtl ? 'rotate-180' : ''}`} />
            </span>
          </button>
          
          <button 
            onClick={exitTutorial}
            className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] hover:text-[var(--c-lime)] transition-colors"
          >
            {t("SKIP SYSTEM GUIDE", "تخطي الدليل التعريفي")}
          </button>
        </div>
      </div>
    </div>
  );
}
