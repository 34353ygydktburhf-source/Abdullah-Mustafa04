import React, { useState, useEffect } from "react";
import { Megaphone, Star, Zap, ShieldCheck, ChevronRight, ChevronDown, ChevronUp, X, Copy, Check, ExternalLink, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./SettingsContext";

interface Ad {
  id: string;
  title: string;
  badge: string;
  text: string;
  details: React.ReactNode;
  link: string;
  color: string;
  icon: React.ReactNode;
  cta?: string;
}

export function CommunityAds() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAdsCollapsed, setIsAdsCollapsed] = useState(true);

  const ADS_DATA: Ad[] = [
    {
      id: "ad1",
      title: "حسابات ببجي ميثيك (Vip)",
      badge: "مميز جداً",
      text: "يتوفر الآن تشكيلة من حسابات ببجي النادرة بأسعار تبدأ من 500 جنيه. ضمان كامل من اللورد.",
      details: (
        <div className="space-y-4">
          <p className="font-bold text-lg">اكتشف أفخم تشكيلة حسابات ببجي في مصر:</p>
          <ul className="space-y-2 list-disc list-inside opacity-80 font-bold">
            <li>حسابات تحتوي على بدلات ميثيك نادرة.</li>
            <li>أسلحة مطورة (كيل ماسيج).</li>
            <li>ربط نظيف وضمان سحب مدى الحياة.</li>
            <li>دعم فني متاح 24/7 للمشتري.</li>
          </ul>
          <div className="p-4 bg-[var(--c-orange)] border-4 border-black font-black text-center rotate-1">
            بادر بالشراء الآن قبل نفاذ الكمية!
          </div>
        </div>
      ),
      link: "/community",
      color: "bg-[var(--c-orange)]",
      icon: <Star className="w-5 h-5" />,
      cta: "تصفح العروض 🛒"
    },
    {
      id: "ad2",
      title: "نظام الوساطة الآمن",
      badge: "هام",
      text: "لا تضيع حقك! استخدم وسيط اللورد الرسمي لضمان أمان عملية البيع والشراء.",
      details: (
        <div className="space-y-4">
          <p className="font-bold text-lg">كيف يعمل نظام الوساطة في اللورد؟</p>
          <div className="grid gap-2">
            <div className="p-3 border-2 border-black bg-white flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">1</span>
              <p className="text-sm font-bold">تواصل معنا لتحديد قيمة العمولة.</p>
            </div>
            <div className="p-3 border-2 border-black bg-white flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">2</span>
              <p className="text-sm font-bold">يقوم المشتري بإيداع المبلغ لدى اللورد.</p>
            </div>
            <div className="p-3 border-2 border-black bg-white flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">3</span>
              <p className="text-sm font-bold">يتم فحص وتسليم البيانات وتأكيد التغيير.</p>
            </div>
            <div className="p-3 border-2 border-black bg-white flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">4</span>
              <p className="text-sm font-bold">يتم تحويل المبلغ للبائع فوراً.</p>
            </div>
          </div>
        </div>
      ),
      link: `https://wa.me/${settings.whatsappNumber}`,
      color: "bg-[var(--c-purple)] text-white",
      icon: <ShieldCheck className="w-5 h-5" />,
      cta: "اطلب وسيط الآن 🛡️"
    },
    {
      id: "ad3",
      title: "عرض خاص لمشتركي المجتمع",
      badge: "لفترة محدودة",
      text: "استخدم كود COMMUNITY10 للحصول على خصم 10% على أول عملية شحن لك من المتجر.",
      details: (
        <div className="space-y-6">
          <div className="text-center py-8 border-4 border-dashed border-black bg-white relative overflow-hidden">
             <Zap className="w-16 h-16 text-[var(--c-lime)] absolute -top-4 -left-4 -rotate-12 opacity-20" />
             <p className="font-black text-xs uppercase mb-2 opacity-50 tracking-widest">كود الخصم الحصري</p>
             <h4 className="text-4xl font-black tracking-tighter text-black">COMMUNITY10</h4>
          </div>
          <div className="space-y-2">
             <p className="text-sm font-bold opacity-80 text-center">يعطيك خصم 10% على جميع خدمات الشحن (ببجي، فري فاير، إلخ) عند أول استخدام لك عبر الموقع.</p>
          </div>
        </div>
      ),
      link: "/",
      color: "bg-[var(--c-lime)]",
      icon: <Zap className="w-5 h-5" />,
      cta: "احصل على الكود 🎟️"
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCtaClick = (ad: Ad) => {
    if (ad.id === "ad3") {
      handleCopy("COMMUNITY10");
      return;
    }
    if (ad.link.startsWith("http")) {
      window.open(ad.link, "_blank");
    } else {
      navigate(ad.link);
    }
    setSelectedAd(null);
  };

  return (
    <div className="mb-12">
      <button 
        onClick={() => setIsAdsCollapsed(!isAdsCollapsed)}
        className="w-full flex items-center justify-between gap-3 mb-6 bg-black text-white p-4 border-4 border-black hover:bg-[var(--c-orange)] hover:text-black transition-colors shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-[4px_4px_0px_#000] group"
      >
        <div className="flex items-center gap-3">
          <Megaphone className="w-8 h-8 text-[var(--c-orange)] group-hover:text-black group-hover:animate-bounce transition-colors" />
          <h2 className="text-xl md:text-2xl font-black uppercase">إعلانات وتنبيهات اللورد</h2>
        </div>
        <div>
           {isAdsCollapsed ? <ChevronDown className="w-8 h-8" /> : <ChevronUp className="w-8 h-8" />}
        </div>
      </button>

      {!isAdsCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
          {ADS_DATA.map((ad) => (
            <div 
              key={ad.id}
              className={`group/ad relative border-4 border-black p-6 shadow-[8px_8px_0px_#000] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] ${ad.color} flex flex-col`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#000]">
                  {ad.badge}
                </div>
                <div className="bg-white/20 p-2 border-2 border-black/20 rounded-full group-hover/ad:bg-white group-hover/ad:text-black transition-colors">
                  {ad.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-black mb-2 uppercase leading-tight group-hover/ad:underline underline-offset-4">
                {ad.title}
              </h3>
              <p className="text-sm font-bold opacity-80 mb-6 leading-relaxed flex-1">
                {ad.text}
              </p>
              
              <button 
                onClick={() => setSelectedAd(ad)}
                className="flex items-center justify-center gap-2 bg-black text-white px-4 py-4 text-xs font-black uppercase border-4 border-black hover:bg-white hover:text-black transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.5)]"
              >
                التفاصيل الكاملة <ChevronRight className="w-4 h-4 transition-transform group-hover/ad:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ad Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[var(--c-bg)] border-8 border-black p-8 shadow-[20px_20px_0px_#000] animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedAd(null)}
              className="absolute top-4 right-4 w-10 h-10 border-4 border-black flex items-center justify-center hover:bg-black hover:text-[var(--c-bg)] transition-colors z-30"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 mb-8">
               <div className={`p-4 border-4 border-black ${selectedAd.color}`}>
                  {selectedAd.icon}
               </div>
               <div>
                  <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase w-fit mb-1">
                    {selectedAd.badge}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">{selectedAd.title}</h2>
               </div>
            </div>

            <div className="text-right" dir="rtl">
              {selectedAd.details}
            </div>

            <div className="mt-10 flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => handleCtaClick(selectedAd)}
                className={`flex-1 py-5 px-6 font-black uppercase text-xl border-4 border-black flex items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-none bg-black text-white hover:bg-white hover:text-black shadow-[8px_8px_0px_#333]`}
              >
                {selectedAd.id === "ad3" ? (
                  <>
                    {copied ? <Check className="w-6 h-6 text-[var(--c-lime)]" /> : <Copy className="w-6 h-6" />}
                    {copied ? "تم النسخ!" : selectedAd.cta}
                  </>
                ) : (
                  <>
                    {selectedAd.cta}
                    {selectedAd.link.startsWith("http") ? <MessageCircle className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                  </>
                )}
              </button>
              
              <button 
                onClick={() => setSelectedAd(null)}
                className="py-5 px-8 font-black uppercase text-xl border-4 border-black bg-white hover:bg-black hover:text-white transition-colors"
              >
                إغلاق
              </button>
            </div>
            
            {copied && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--c-lime)] border-4 border-black px-6 py-2 font-black text-sm uppercase animate-bounce shadow-[4px_4px_0px_#000] z-[310]">
                 تم نسخ الكود! استخدمه الآن 🎟️
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const ArrowRight = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
