import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Gamepad2, ShieldCheck, Zap, Headphones, Star, X, Send, Info, CreditCard, Clock, CheckCircle, Plus, Minus, Languages, Loader2, ChevronUp, ChevronDown, HelpCircle, ImagePlus, LogIn, Flame, Trophy, Sparkles } from "lucide-react";
import { useGames } from "@/components/ControlledChaos/GamesContext";
import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { useCoupons } from "@/components/ControlledChaos/CouponContext";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { BrutalButton } from "@/components/ControlledChaos/BrutalButton";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useLogin } from "@/components/ControlledChaos/LoginContext";
import { useOrders } from "@/components/ControlledChaos/OrderContext";
import { VideoTutorialModal } from "@/components/ControlledChaos/VideoTutorialModal";
import { useWallet } from "@/components/ControlledChaos/WalletContext";
import { GemIcon } from "@/components/ControlledChaos/GemIcon";
import { formatGems } from "@/lib/utils";

const PKG_IMAGES = [
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80", 
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80", 
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80", 
  "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80", 
  "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&q=80", 
  "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&q=80", 
];

const DEFAULT_FIELD_CONFIG = {
  fields: [
    { key: "playerId", label: "Player ID", placeholder: "أدخل ID الخاص بك", required: true },
  ],
  chargingInfo: ["يتم الشحن مباشرة بعد تأكيد الدفع"],
  chargingMethod: "Vodafone Cash / InstaPay",
  deliveryTime: "10 - 30 دقيقة",
};

function slugify(name: string) {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // Matches Unicode letters and numbers
    .replace(/(^-|-$)/g, "");
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { games } = useGames();
  const { settings } = useSettings();
  const { coupons } = useCoupons();
  
  // Find by slugified name OR by direct ID (fallback)
  const game = games.find((g) => slugify(g.name) === slug || g.id === slug);
  const { savedAccounts, isLoggedIn, userData, openLogin } = useLogin();
  const { addOrder } = useOrders();
  const { balance, spendGems } = useWallet();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [playerName, setPlayerName] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const { lang, toggleLang, t } = useLang();
  const [paymentMethod, setPaymentMethod] = useState(settings.paymentAccounts[0]?.id || "other");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [senderValue, setSenderValue] = useState("");
  const MAX_QUANTITY = 22;
  const checkoutScrollRef = React.useRef<HTMLDivElement>(null);

  const [orderCheck, setOrderCheck] = useState<{isOpen: boolean, step: "checking"|"success", orderId: string}>({
    isOpen: false,
    step: "checking",
    orderId: ""
  });
  
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [transferProof, setTransferProof] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [otherCountry, setOtherCountry] = useState("");
  const [otherCountryCode, setOtherCountryCode] = useState("");
  const [otherMethod, setOtherMethod] = useState("");
  const [otherMethodInput, setOtherMethodInput] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!game) {
    return (
      <>
        <GlobalStyles />
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--c-bg)", color: "var(--c-ink)" }}>
          <h1 className="text-6xl font-black uppercase mb-4">Game Not Found</h1>
          <Link to="/games">
            <BrutalButton>Back to Games</BrutalButton>
          </Link>
        </div>
      </>
    );
  }

  const gameSavedAccounts = savedAccounts.filter(acc => 
    acc.game.toLowerCase() === game.name.toLowerCase()
  );

  const fieldConfig = game.fieldConfig || DEFAULT_FIELD_CONFIG;
  const packages = game.packages || [];

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'number' ? price : (parseInt(price.replace(/\D/g, ""), 10) || 0);
    if (settings.currencySuffix) {
      return `${num} ${settings.currencySymbol || "ج.م"}`;
    }
    return `${settings.currencySymbol || "ج.م"}${num}`;
  };

  const ARAB_COUNTRIES = [
    { name: "مصر", flag: "🇪🇬", code: "eg", suffix: "(الدولة المستضيفة)" },
    { name: "فلسطين", flag: "🇵🇸", code: "ps", suffix: "فلسطين حرة.. إدعم القضية" },
    { name: "السعودية", flag: "🇸🇦", code: "sa" },
    { name: "الإمارات", flag: "🇦🇪", code: "ae" },
    { name: "الكويت", flag: "🇰🇼", code: "kw" },
    { name: "قطر", flag: "🇶🇦", code: "qa" },
    { name: "البحرين", flag: "🇧🇭", code: "bh" },
    { name: "عمان", flag: "🇴🇲", code: "om" },
    { name: "الأردن", flag: "🇯🇴", code: "jo" },
    { name: "لبنان", flag: "🇱🇧", code: "lb" },
    { name: "سوريا", flag: "🇸🇾", code: "sy" },
    { name: "العراق", flag: "🇮🇶", code: "iq" },
    { name: "ليبيا", flag: "🇱🇾", code: "ly" },
    { name: "تونس", flag: "🇹🇳", code: "tn" },
    { name: "الجزائر", flag: "🇩🇿", code: "dz" },
    { name: "المغرب", flag: "🇲🇦", code: "ma" },
    { name: "اليمن", flag: "🇾🇪", code: "ye" },
    { name: "السودان", flag: "🇸🇩", code: "sd" }
  ];

  const BrutalFlag = ({ code, className = "" }: { code: string; className?: string }) => (
    <div className={`w-6 h-6 rounded-full overflow-hidden border-2 border-[var(--c-ink)] shadow-[2px_2px_0px_var(--c-ink)] shrink-0 bg-white inline-flex items-center justify-center ${className}`}>
      <img 
        src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`} 
        alt={code}
        className={`w-full h-full object-cover ${code.toLowerCase() === 'ps' ? 'object-left scale-125' : 'object-center scale-150'}`}
      />
    </div>
  );

  const PAYMENT_SUGGESTIONS = [
    "Vodafone Cash", "InstaPay", "STC Pay", "Urpay", "Zain Cash", "PayPal", "Apple Pay", "Google Pay", "Fawry", "Mada", "Aman", "Orange Money", "Etisalat Cash", "Sadaq", "CashU"
  ];

  const openModal = (pkg: any) => {
    setSelectedPkg(pkg);
    setFormData({});
    setPlayerName("");
    setPromoCode("");
    setQuantity(1);
    setDiscount(0);
    setPromoError("");
    setCheckoutStep(1);
    setTransferProof(null);
    setIsVerifying(false);
    setSenderValue("");
    setModalOpen(true);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === code && c.isActive);
    if (found) {
      setDiscount(found.discountPercent);
      setPromoError("");
    } else {
      setDiscount(0);
      setPromoError(lang === "ar" ? "كود الخصم غير صالح" : "Invalid promo code");
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransferProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyPaymentInfo = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const submitOrder = () => {
    if (!selectedPkg || !isLoggedIn || !userData || !transferProof) return;
    
    setIsVerifying(true);
    
    const baseUnitPrice = selectedPkg.discountedPrice !== undefined ? selectedPkg.discountedPrice : (typeof selectedPkg.price === 'number' ? selectedPkg.price : (parseInt(selectedPkg.price.replace(/\D/g, ""), 10) || 0));
    const totalBasePrice = baseUnitPrice * quantity;
    const finalPrice = discount > 0 ? Math.round(totalBasePrice * (1 - discount)) : totalBasePrice;

    const orderId = addOrder({
      userId: userData.name,
      userName: userData.name,
      userContact: userData.contact,
      gameId: game.name,
      gameName: game.name,
      packageName: selectedPkg.name,
      packagePrice: baseUnitPrice,
      quantity: quantity,
      totalPrice: finalPrice,
      fields: formData,
      paymentMethod: paymentMethod === "other" ? `${otherMethod} (${otherCountry})` : (settings.paymentAccounts.find(a => a.id === paymentMethod)?.name || paymentMethod),
      senderInfo: senderValue,
      screenshot: transferProof
    });

    // Verification animation delay
    setTimeout(() => {
      setIsVerifying(false);
      setCheckoutStep(4);
      setOrderCheck(prev => ({ ...prev, orderId }));
    }, 3000);
  };

  const submitGemOrder = () => {
    if (!selectedPkg || !isLoggedIn || !userData) return;
    
    const baseUnitPrice = selectedPkg.discountedPrice !== undefined ? selectedPkg.discountedPrice : (typeof selectedPkg.price === 'number' ? selectedPkg.price : (parseInt(selectedPkg.price.replace(/\D/g, ""), 10) || 0));
    const totalBasePrice = baseUnitPrice * quantity;
    // Calculation: 50 Gems = 45 EGP -> 1 Gem = 0.9 EGP
    // Price in Gems = Price in EGP / 0.9
    const finalPriceInGems = Math.ceil(totalBasePrice / 0.9); 
    
    if (spendGems(finalPriceInGems, `Purchase ${selectedPkg.name} for ${game.name}`)) {
      setIsVerifying(true);
      const orderId = addOrder({
        userId: userData.id || userData.name,
        userName: userData.name,
        userContact: userData.contact,
        gameId: game.name,
        gameName: game.name,
        packageName: selectedPkg.name,
        packagePrice: baseUnitPrice,
        quantity: quantity,
        totalPrice: finalPriceInGems,
        fields: formData,
        paymentMethod: "Gems Wallet",
        senderInfo: "N/A",
        screenshot: "SYSTEM_GEM_PAYMENT"
      });

      // Show processing state for a moment then success
      setTimeout(() => {
        setIsVerifying(false);
        setCheckoutStep(4);
        setOrderCheck(prev => ({ ...prev, orderId }));
      }, 1500);
    }
  };

  const scrollCheckout = (offset: number) => {
    if (checkoutScrollRef.current) {
      checkoutScrollRef.current.scrollBy({ top: offset, behavior: 'smooth' });
    }
  };

  const isFormValid = 
    isLoggedIn && 
    agreedToTerms && 
    fieldConfig.fields.filter((f) => f.required).every((f) => formData[f.key]?.trim());

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)", color: "var(--c-ink)" }}>
        {/* Header */}
        <div className="border-b-4 border-[var(--c-ink)] px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/games" className="flex items-center gap-2 text-sm font-bold uppercase hover:text-[var(--c-orange)] transition-colors">
              <ArrowLeft className="w-5 h-5" /> {t("Back", "رجوع")}
            </Link>
            {isLoggedIn && (
              <Link 
                to="/buy-gems" 
                className="md:hidden flex flex-row items-center gap-1 border-2 px-1.5 py-1 transition-all text-xs font-black cursor-pointer bg-[#b084ff] text-black border-black shadow-[2px_2px_0px_#000]"
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
          </div>
        </div>

        {/* Banner */}
        <div className="relative h-80 md:h-[500px] overflow-hidden border-b-4 border-[var(--c-ink)]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${game.image})` }} />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--c-lime)] mb-2">{game.cat}</span>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-5xl md:text-7xl font-black uppercase text-white">{game.name}</h1>
              {game.badge && game.badge.text && (
                <div className={`${game.badge.color || 'bg-red-500'} text-white px-4 py-2 border-4 border-white shadow-[4px_4px_0px_#000] rotate-3 flex items-center gap-2 animate-bounce`}>
                  {game.badge.icon === 'Flame' && <Flame className="w-5 h-5" />}
                  {game.badge.icon === 'Star' && <Star className="w-5 h-5 fill-current" />}
                  {game.badge.icon === 'Trophy' && <Trophy className="w-5 h-5" />}
                  {game.badge.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                  <span className="font-black uppercase text-sm md:text-base">{game.badge.text}</span>
                </div>
              )}
            </div>
            <p className="text-lg text-white/80 mt-2 max-w-xl">{t(game.desc, game.descAr || game.desc)}</p>
          </div>
        </div>

        {/* Packages */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-2">
                <span className="font-marker text-[var(--c-orange)]">{t("PACKAGES", "الحزم")}</span> {t("AVAILABLE", "المتاحة")}
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest opacity-50">{t("CHOOSE THE RIGHT PACKAGE AND TOP UP NOW", "اختر الحزمة المناسبة واشحن الآن")}</p>
            </div>
            
            {game.tutorialVideoUrl && (
              <button 
                onClick={() => setIsTutorialOpen(true)}
                className="flex items-center gap-3 bg-white border-4 border-black px-6 py-3 shadow-[6px_6px_0px_var(--c-lime)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--c-lime)] flex items-center justify-center border-2 border-black group-hover:animate-bounce">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase leading-none opacity-50">{t("Need Help?", "تحتاج مساعدة؟")}</p>
                  <p className="text-xs font-black uppercase leading-none mt-1">{t("Watch Tutorial", "شاهد شرح الشحن")}</p>
                </div>
              </button>
            )}
          </div>

          {/* Official Statements / Announcements */}
          {game.statements && game.statements.length > 0 && game.statements.some(s => s.trim()) && (
            <div className="mb-10 space-y-3">
              {game.statements.filter(s => s.trim()).map((statement, idx) => (
                <div key={idx} className="bg-[var(--c-ink)] text-white border-4 border-black p-4 shadow-[6px_6px_0px_var(--c-lime)] flex items-start gap-4 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="w-8 h-8 rounded-full bg-[var(--c-lime)] flex items-center justify-center shrink-0 border-2 border-white">
                    <Info className="w-5 h-5 text-black" />
                  </div>
                  <p className="font-bold text-sm md:text-base py-1">{statement}</p>
                </div>
              ))}
            </div>
          )}

          {packages.length === 0 ? (
            <div className="bg-white border-8 border-black p-12 text-center shadow-[15px_15px_0px_var(--c-orange)] rotate-1">
              <Info className="w-16 h-16 text-[var(--c-orange)] mx-auto mb-6 animate-pulse" />
              <h3 className="text-3xl font-black uppercase mb-4">
                {game.noPackagesMessage || (lang === 'ar' ? 'عذراً، لا توجد حزم متاحة حالياً لهذه اللعبة. تواصل معنا لمزيد من التفاصيل.' : 'Sorry, no packages available for this game right now. Contact us for details.')}
              </h3>
              <BrutalButton onClick={() => window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(t("Hello, I want to inquire about packages for " + game.name, "مرحباً، أود الاستفسار عن حزم لعبة " + game.name))}`, "_blank")}>
                {t("Contact Support 💬", "تواصل مع الدعم 💬")}
              </BrutalButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg: any, i: number) => {
                const totalDiscount = (game.discount || 0) + (pkg.discount || 0);
                const unitPrice = typeof pkg.price === 'number' ? pkg.price : (parseInt(pkg.price.replace(/\D/g, ""), 10) || 0);
                const discountedPrice = Math.round(unitPrice * (1 - totalDiscount / 100));

                return (
                  <div key={pkg.id || i} className="group relative">
                    <div className={`absolute inset-0 ${pkg.popular ? "bg-[var(--c-orange)]" : game.color} translate-x-3 translate-y-3 border-4 border-[var(--c-ink)]`} />
                    <div className={`relative ${pkg.popular ? "bg-[var(--c-orange)]" : game.color} border-4 border-[var(--c-ink)] group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300`}>
                      {pkg.popular && (
                        <div className="absolute top-0 right-0 bg-[var(--c-ink)] text-[var(--c-bg)] px-3 py-1 text-xs font-black uppercase flex items-center gap-1 z-10">
                          <Star className="w-3 h-3" /> {t("POPULAR", "الأكثر طلباً")}
                        </div>
                      )}
                      
                      {totalDiscount > 0 && (
                        <div className="absolute top-0 left-0 z-20 pointer-events-none -translate-x-2 -translate-y-2">
                          <div className="bg-red-600 text-white flex flex-col items-center justify-center px-3 py-1.5 border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] relative min-w-[70px]">
                            <span className="text-[9px] font-black tracking-tighter leading-none mb-0.5 opacity-80">{t("SALE", "خصم")}</span>
                            <span className="text-xl font-black leading-none">-{totalDiscount}%</span>
                          </div>
                        </div>
                      )}

                      <div className="h-36 bg-cover bg-center relative" style={{ backgroundImage: `url(${pkg.image || PKG_IMAGES[i % PKG_IMAGES.length]})` }}>
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-black text-white uppercase">{lang === 'ar' ? (pkg.nameAr || pkg.name) : pkg.name}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-black uppercase mb-1">{lang === 'ar' ? (pkg.nameAr || pkg.name) : pkg.name}</h3>
                        <div className="mb-4">
                          {totalDiscount > 0 ? (
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold line-through opacity-50">{formatPrice(unitPrice)}</span>
                              <span className="text-3xl font-black">{formatPrice(discountedPrice)}</span>
                            </div>
                          ) : (
                            <p className="text-3xl font-black">{formatPrice(unitPrice)}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 mb-5 text-sm font-bold">
                          <div className="flex items-center gap-2"> <Zap className="w-4 h-4" /> {t("Instant Delivery", "تسليم فوري")} </div>
                          <div className="flex items-center gap-2"> <ShieldCheck className="w-4 h-4" /> {t("100% Safe", "آمن 100%")} </div>
                          <div className="flex items-center gap-2"> <Headphones className="w-4 h-4" /> {t("24/7 Support", "دعم 24/7")} </div>
                        </div>
                        <button onClick={() => openModal({...pkg, unitPrice, discountedPrice, totalDiscount})} className="w-full bg-[var(--c-ink)] text-[var(--c-bg)] px-4 py-3 text-sm font-black uppercase hover:opacity-90 transition-opacity">
                          {t("Top Up Now 🎮", "اشحن الآن 🎮")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Modal */}
        {modalOpen && selectedPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <div className="relative w-full max-w-md my-auto">
              <div className="absolute inset-0 bg-[var(--c-lime)] translate-x-3 translate-y-3 border-4 border-[var(--c-ink)]" />
            <div className="relative border-4 border-[var(--c-ink)] p-4 md:p-6 flex flex-col max-h-[90vh]" style={{ backgroundColor: "var(--c-bg)" }}>


                <div className="shrink-0 mb-4 z-10">
                  <div className="relative border-4 border-[var(--c-ink)] overflow-hidden shadow-[4px_4px_0px_var(--c-ink)]">
                    <button onClick={() => setModalOpen(false)} className={`absolute top-2 ${lang === 'ar' ? 'left-2' : 'right-2'} w-8 h-8 border-2 border-[var(--c-ink)] flex items-center justify-center hover:bg-[var(--c-ink)] hover:text-[var(--c-bg)] transition-colors z-30 bg-white shadow-[2px_2px_0px_#000]`}>
                      <X className="w-4 h-4" />
                    </button>
                    <div className={`${game.color} p-3 md:p-4`}>
                      <p className="text-[10px] md:text-xs font-bold uppercase opacity-70 mb-1">{game.name}</p>
                      <p className="text-xl md:text-2xl font-black leading-none truncate">{lang === 'ar' ? (selectedPkg.nameAr || selectedPkg.name) : selectedPkg.name}</p>
                      <p className="text-lg md:text-xl font-bold mt-2 truncate">
                        {(() => {
                           const unitPrice = selectedPkg.discountedPrice !== undefined ? selectedPkg.discountedPrice : (typeof selectedPkg.price === 'number' ? selectedPkg.price : (parseInt(selectedPkg.price.replace(/\D/g, ""), 10) || 0));
                           const totalBase = unitPrice * quantity;
                           if (discount > 0) {
                             return (
                               <span className="flex items-center gap-1.5 md:gap-2">
                                 <span className="line-through opacity-70">{formatPrice(totalBase)}</span>
                                 <span className="text-[var(--c-ink)] bg-white px-1.5 py-0.5 md:px-2 md:py-1 text-xs md:text-sm font-black transform -rotate-2 whitespace-nowrap">
                                   {formatPrice(Math.round(totalBase * (1 - discount)))}
                                 </span>
                               </span>
                             );
                           }
                           return formatPrice(totalBase);
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                <div ref={checkoutScrollRef} className="flex-1 overflow-y-auto pt-1 pb-8 text-[var(--c-ink)] relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {checkoutStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-right duration-300">
                      <div className="border-4 border-[var(--c-ink)] p-4 mb-6 bg-[var(--c-lime)]/10">
                        <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setShowInfo(!showInfo)}>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--c-orange)] animate-bounce"> <Info className="w-5 h-5 text-white" /> </div>
                            <span className="text-sm font-black uppercase">{t("Charging Info", "معلومات الشحن")}</span>
                          </div>
                          {showInfo ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        {showInfo && (
                          <div className="mt-4 pt-4 border-t-4 border-[var(--c-ink)]">
                            <ul className="space-y-2">
                              {fieldConfig.chargingInfo.map((info: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 text-sm font-bold"> <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-[var(--c-orange)]" /> {info} </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="mb-6 p-4 border-4 border-[var(--c-ink)] bg-white shadow-[4px_4px_0px_var(--c-ink)]">
                        <label className="block text-sm font-black uppercase mb-3 text-[var(--c-purple)]">{t("Choose Quantity", "اختر الكمية")}</label>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} className="w-12 h-12 flex items-center justify-center bg-[var(--c-orange)] border-4 border-[var(--c-ink)] text-[var(--c-ink)] font-black text-xl hover:bg-[var(--c-lime)] transition-colors disabled:opacity-30"> <Minus className="w-6 h-6" /> </button>
                          <div className="flex-1 text-center border-x-4 border-[var(--c-ink)]/10"> <span className="text-3xl font-black">{quantity}</span> </div>
                          <button onClick={() => setQuantity(q => Math.min(MAX_QUANTITY, q + 1))} disabled={quantity >= MAX_QUANTITY} className="w-12 h-12 flex items-center justify-center bg-[var(--c-orange)] border-4 border-[var(--c-ink)] text-[var(--c-ink)] font-black text-xl hover:bg-[var(--c-lime)] transition-colors disabled:opacity-30"> <Plus className="w-6 h-6" /> </button>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-black uppercase mb-3 text-[var(--c-purple)]">{t("Payment Method", "طريقة الدفع")}</label>
                        <div className="grid grid-cols-1 gap-2">
                          {[ 
                            { id: "gems", label: "Pay with Gems", ar: "ادفع بالجواهر", icon: <GemIcon size={16} /> },
                            ...settings.paymentAccounts
                              .filter(acc => acc.countryCode === "eg" && !acc.name.toLowerCase().includes("vodafone"))
                              .map(acc => ({ 
                                id: acc.id, 
                                label: acc.name, 
                                ar: acc.name, 
                                icon: <CreditCard className="w-4 h-4" /> 
                              })),
                            { id: "other", label: "Other Method", ar: "طريقة أخرى", icon: <Send className="w-4 h-4" /> } 
                          ].map((pm) => (
                            <button key={pm.id} type="button" onClick={() => pm.id === "other" ? setIsOtherModalOpen(true) : setPaymentMethod(pm.id)} className={`flex items-center justify-between p-3 border-4 transition-all ${paymentMethod === pm.id ? "border-[var(--c-ink)] bg-[var(--c-lime)] translate-x-1 translate-y-1" : "border-[var(--c-ink)] bg-white hover:bg-[var(--c-lime)]/10 shadow-[4px_4px_0px_var(--c-ink)]"}`}>
                              <span className="flex items-center gap-3 font-black uppercase text-xs">
                                 {pm.id === "other" && paymentMethod === "other" && otherMethod ? ( <span className="flex items-center gap-2"> <span className="text-[var(--c-purple)]">{otherMethod}</span> </span> ) : ( <>{pm.icon} {lang === "ar" ? pm.ar : pm.label}</> )}
                              </span>
                              {paymentMethod === pm.id && <CheckCircle className="w-4 h-4 text-[var(--c-ink)]" />}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 bg-[var(--c-orange)]/10 border-2 border-[var(--c-ink)] p-3 flex items-start gap-2 shadow-[2px_2px_0px_var(--c-ink)]">
                          <Info className="w-4 h-4 text-[var(--c-orange)] shrink-0 mt-0.5" />
                          <p className="text-[10px] font-black uppercase leading-tight text-[var(--c-ink)]">
                            {t("InstaPay is the current default. Change it from 'Other Method' if you want a different wallet or country.", "إنستا باي هي الوسيلة الحالية، قم بتغييرها من زر 'طريقة أخرى' إن كنت تريد محفظة أو دولة مختلفة.")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {fieldConfig.fields.map((field: any, idx: number) => {
                          const suggestions = gameSavedAccounts.filter(acc => acc.accountId.includes(formData[field.key] || ""));
                          return (
                          <div key={field.key} className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-black uppercase"> {field.label} {field.required && "*"} </label>
                              {field.key === 'playerId' && game.tutorialVideoUrl && (
                                <button 
                                  onClick={() => setIsTutorialOpen(true)}
                                  className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[var(--c-orange)] hover:underline"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  {t("How to get ID?", "كيف تجيب الـ ID؟")}
                                </button>
                              )}
                            </div>
                            <input type="text" value={formData[field.key] || ""} onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))} onFocus={() => { if(idx === 0) setIsSuggestionsOpen(true); }} onBlur={() => { setTimeout(() => setIsSuggestionsOpen(false), 200); }} placeholder={field.placeholder} className="w-full border-4 border-[var(--c-ink)] px-4 py-3 text-lg font-bold bg-transparent outline-none focus:border-[var(--c-orange)]" />
                            {idx === 0 && isSuggestionsOpen && suggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-20 border-4 border-[var(--c-ink)] bg-[var(--c-bg)] shadow-[4px_4px_0px_var(--c-ink)] mt-1">
                                <div className="bg-[var(--c-lime)] border-b-4 border-[var(--c-ink)] px-3 py-1.5 text-[10px] font-black uppercase text-[var(--c-ink)]">{t("Saved Accounts", "حسابات محفوظة")}</div>
                                {suggestions.map((acc, i) => (
                                  <button key={i} type="button" onMouseDown={(e) => { e.preventDefault(); setFormData((prev) => ({ ...prev, [field.key]: acc.accountId })); setIsSuggestionsOpen(false); }} className="w-full text-left p-3 text-sm font-black uppercase hover:bg-[var(--c-orange)] hover:text-white border-b-2 border-[var(--c-ink)]/10 last:border-0">{acc.accountId}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        )})}
                        <div>
                          <label className="block text-sm font-black uppercase mb-2">{t("Name (Optional)", "الاسم (اختياري)")}</label>
                          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder={t("Enter your name", "أدخل اسمك")} className="w-full border-4 border-[var(--c-ink)] px-4 py-3 text-lg font-bold bg-transparent outline-none focus:border-[var(--c-orange)]" />
                        </div>

                        {/* Promo Code Section */}
                        <div className="pt-4 border-t-4 border-[var(--c-ink)]/10">
                          <label className="block text-sm font-black uppercase mb-2 text-[var(--c-purple)]">{t("Promo Code", "كود الخصم")}</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                             <input 
                              type="text" 
                              value={promoCode} 
                              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                              placeholder={t("HAVE A CODE?", "لديك كود خصم؟")}
                              className="flex-1 border-4 border-[var(--c-ink)] px-3 py-2 text-sm font-bold bg-white outline-none focus:border-[var(--c-orange)] uppercase min-w-0" 
                             />
                             <button 
                              type="button"
                              onClick={handleApplyPromo}
                              className="bg-[var(--c-ink)] text-white px-6 py-2.5 font-black uppercase text-xs hover:bg-[var(--c-orange)] transition-colors shadow-[2px_2px_0px_#000] whitespace-nowrap"
                             >
                               {t("Apply", "تطبيق")}
                             </button>
                          </div>
                          {promoError && <p className="text-[10px] font-bold text-red-600 mt-1 uppercase">{promoError}</p>}
                          {discount > 0 && <p className="text-[10px] font-black text-green-600 mt-1 uppercase">✓ {t("Discount Applied!", "تم تطبيق الخصم!")} ({(discount * 100).toFixed(0)}%)</p>}
                        </div>
                      </div>

                      <div className="mb-8">
                        <button onClick={() => setAgreedToTerms(!agreedToTerms)} className={`w-full p-4 border-4 transition-all flex items-start gap-4 text-left ${agreedToTerms ? "bg-[var(--c-lime)] translate-x-1 translate-y-1 shadow-none" : "bg-white shadow-[4px_4px_0px_var(--c-ink)] hover:bg-[var(--c-lime)]/10"}`}>
                          <div className={`mt-1 w-6 h-6 shrink-0 border-4 border-[var(--c-ink)] flex items-center justify-center ${agreedToTerms ? 'bg-[var(--c-ink)]' : 'bg-white'}`}> {agreedToTerms && <CheckCircle className="w-4 h-4 text-white" />} </div>
                          <div className="text-xs font-bold leading-tight"> {lang === "ar" ? (<>أوافق على <span className="underline font-black">شروط الخدمة</span>، <span className="underline font-black">سياسة الخصوصية</span>، وحقوق المستخدم والموقع.</>) : (<>I agree to the <span className="underline font-black">Terms of Service</span>, <span className="underline font-black">Privacy Policy</span>, and User/Site Rights.</>)} </div>
                        </button>
                      </div>

                      {!isLoggedIn ? (
                        <button onClick={openLogin} className="w-full bg-[var(--c-purple)] text-white px-6 py-5 text-xl font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[6px_6px_0px_var(--c-ink)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none mb-8">
                          <LogIn className="w-6 h-6" /> {t("Login to Order", "سجل دخولك لطلب الشحن")}
                        </button>
                      ) : (
                        <div>
                          {!isFormValid && (
                            <p className="text-[10px] font-black uppercase text-red-600 mb-2 text-center animate-pulse">
                               {t("Please fill all required fields and agree to terms", "يرجى ملء كافة الحقول الإجبارية والموافقة على الشروط")}
                            </p>
                          )}
                          {paymentMethod === "gems" ? (() => {
                             const baseUnitPrice = selectedPkg.discountedPrice !== undefined ? selectedPkg.discountedPrice : (typeof selectedPkg.price === 'number' ? selectedPkg.price : (parseInt(selectedPkg.price.replace(/\D/g, ""), 10) || 0));
                             const totalBasePrice = baseUnitPrice * quantity;
                             // 50 Gems = 45 EGP logic
                             const gemsPrice = Math.ceil(totalBasePrice / 0.9);
                             const hasEnough = balance >= gemsPrice;
                             return (
                               <div className="space-y-2">
                                 <button 
                                   onClick={submitGemOrder} 
                                   disabled={!isFormValid || !hasEnough} 
                                   className={`w-full bg-[#101010] text-white px-6 py-5 text-xl font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[6px_6px_0px_#b084ff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${(!isFormValid || !hasEnough) ? "opacity-30 cursor-not-allowed grayscale" : "hover:bg-[#b084ff]"}`}
                                 >
                                   <GemIcon size={24} /> {t("Pay Instantly", "ادفع فوراً")} ({formatGems(gemsPrice)})
                                 </button>
                                 {!hasEnough && isFormValid && (
                                   <p className="text-[10px] font-black uppercase text-red-600 text-center animate-pulse">
                                     {t("Insufficient Gem Balance", "رصيد الجواهر غير كافٍ")}
                                   </p>
                                 )}
                               </div>
                             );
                          })() : (
                            <button 
                              onClick={() => setCheckoutStep(2)} 
                              disabled={!isFormValid} 
                              className={`w-full bg-[var(--c-ink)] text-[var(--c-bg)] px-6 py-5 text-xl font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[6px_6px_0px_var(--c-orange)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none mb-8 ${!isFormValid ? "opacity-30 cursor-not-allowed grayscale" : "hover:opacity-90"}`}
                            >
                              {t("Next: Payment Details", "التالي: بيانات الدفع")} <ArrowLeft className="w-6 h-6 rotate-180" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {checkoutStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-right duration-300">
                      <div className="mb-8 p-6 border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
                         <h4 className="text-lg font-black uppercase mb-4 text-[var(--c-purple)]">{t("Send Transfer To:", "أرسل التحويل إلى:")}</h4>
                         
                         <div className="space-y-4 mb-6">
                            {paymentMethod === "other" ? (
                               <div className="p-4 border-4 border-black bg-[var(--c-lime)]">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{otherMethod} ({otherCountry})</span>
                                     <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <p className="text-xs font-bold opacity-70">
                                     {t("Please contact support to complete payment for this method.", "يرجى التواصل مع الدعم لإتمام الدفع لهذه الوسيلة.")}
                                  </p>
                               </div>
                            ) : (
                               settings.paymentAccounts
                                .filter(acc => acc.id === paymentMethod)
                                .map((acc) => (
                               <div key={acc.id} className="p-4 border-4 border-black bg-[var(--c-lime)] shadow-[4px_4px_0px_#000]">
                                  <div className="flex justify-between items-center mb-1">
                                     <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter">{acc.name}</span>
                                     <CheckCircle className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                     <span className="text-lg sm:text-xl font-black tracking-widest break-all text-center sm:text-left">{acc.value}</span>
                                     <button 
                                      onClick={(e) => { e.stopPropagation(); copyPaymentInfo(acc.value, acc.id); }}
                                      className={`w-full sm:w-auto px-4 py-2 text-[10px] font-black uppercase border-2 border-black transition-all ${copiedId === acc.id ? "bg-[var(--c-orange)] text-black translate-x-0.5 translate-y-0.5 shadow-none" : "bg-black text-white hover:bg-white hover:text-black shadow-[2px_2px_0px_#000]"}`}
                                     >
                                       {copiedId === acc.id ? t("Copied!", "تم النسخ") : t("Copy", "نسخ")}
                                     </button>
                                  </div>
                               </div>
                               ))
                            )}
                         </div>

                         <div className="pt-4 border-t-4 border-black/10">
                            <label className="block text-sm font-black uppercase mb-2 text-[var(--c-purple)]">{t("Your Number/Account (Sender):", "الرقم أو الحساب المحول منه:")} *</label>
                            <input 
                              type="text" 
                              value={senderValue} 
                              onChange={(e) => setSenderValue(e.target.value)}
                              placeholder={t("Enter the number you sent from", "أدخل الرقم الذي قمت بالتحويل منه")}
                              className="w-full border-4 border-black p-3 font-bold text-sm bg-white"
                            />
                            <p className="text-[9px] font-bold opacity-60 mt-1 uppercase">{t("Required to match your payment", "ضروري لمطابقة عملية الدفع الخاصة بك")}</p>
                         </div>
                      </div>

                      <div className="flex gap-4 mb-8">
                         <button onClick={() => setCheckoutStep(1)} className="flex-1 border-4 border-black p-4 font-black uppercase text-sm hover:bg-black/5">{t("Back", "رجوع")}</button>
                         <button 
                          onClick={() => setCheckoutStep(3)} 
                          disabled={!senderValue.trim()} 
                          className={`flex-1 bg-[var(--c-lime)] border-4 border-black p-4 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${!senderValue.trim() && 'opacity-30 grayscale'}`}
                         >
                           {t("Next: Upload Proof", "التالي: رفع الإثبات")}
                         </button>
                      </div>
                    </div>
                  )}

                  {checkoutStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right duration-300">
                      <div className="mb-8 p-6 border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
                         <h4 className="text-lg font-black uppercase mb-4 text-[var(--c-purple)]">{t("Transfer Proof", "إثبات التحويل")}</h4>
                         
                         <div className="relative group cursor-pointer border-4 border-dashed border-black/30 p-8 text-center bg-black/5 hover:bg-[var(--c-lime)]/5 transition-all mb-4 overflow-hidden">
                            {transferProof ? (
                              <div className="relative animate-in zoom-in duration-300">
                                 <img src={transferProof} className="max-h-48 mx-auto border-2 border-black shadow-[4px_4px_0px_#000]" />
                                 <button onClick={(e) => { e.stopPropagation(); setTransferProof(null); }} className="absolute -top-4 -right-4 bg-red-600 text-white w-8 h-8 rounded-full border-4 border-black flex items-center justify-center hover:scale-110 transition-transform"> <X className="w-4 h-4" /> </button>
                              </div>
                            ) : (
                              <>
                                <ImagePlus className="w-12 h-12 mx-auto mb-4 opacity-40 group-hover:scale-110 transition-transform" />
                                <p className="text-xs font-black uppercase opacity-60 leading-tight">{t("Tap to upload transfer screenshot", "اضغط لرفع صورة إثبات التحويل")}</p>
                              </>
                            )}
                            <input type="file" accept="image/*" onChange={handleProofUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                      </div>

                      {isVerifying ? (
                        <div className="flex flex-col items-center justify-center p-8 border-4 border-black bg-white mb-8 animate-pulse text-center">
                           <Loader2 className="w-12 h-12 animate-spin mb-4" />
                           <h4 className="text-lg font-black uppercase tracking-tighter">{t("Verifying Data...", "جاري التحقق من البيانات...")}</h4>
                           <p className="text-[10px] font-bold opacity-60 mt-2 uppercase">{t("Please don't close the window", "يرجى عدم إغلاق النافذة")}</p>
                        </div>
                      ) : (
                        <div>
                          {!transferProof && (
                             <p className="text-[10px] font-black uppercase text-red-600 mb-2 text-center animate-pulse">
                               {t("Please upload a transfer screenshot to continue", "يرجى رفع صورة إثبات التحويل للمتابعة")}
                             </p>
                          )}
                          <div className="flex gap-4 mb-8">
                            <button onClick={() => setCheckoutStep(2)} className="flex-1 border-4 border-black p-4 font-black uppercase text-sm hover:bg-black/5">{t("Back", "رجوع")}</button>
                            <button 
                              onClick={submitOrder} 
                              disabled={!transferProof} 
                              className={`flex-1 bg-[var(--c-ink)] text-white border-4 border-black p-4 font-black uppercase text-sm shadow-[4px_4px_0px_var(--c-orange)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all ${!transferProof && 'opacity-30 grayscale'}`}
                            >
                              {t("Complete Order", "إتمام الطلب")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {checkoutStep === 4 && (
                    <div className="animate-in fade-in zoom-in duration-500 text-center py-8">
                       <div className="w-24 h-24 bg-[var(--c-lime)] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_#000] rotate-3">
                          <CheckCircle className="w-14 h-14 text-black" />
                       </div>
                       <h3 className="text-2xl font-black uppercase mb-2 tracking-tighter">{t("Request Received!", "تم استلام طلبك بنجاح!")}</h3>
                       <p className="text-sm font-bold opacity-70 mb-8 max-w-xs mx-auto">
                          {t("The admin is verifying your payment. You'll receive a notification once the credits are added to your account.", "المسؤول يقوم بمراجعة عملية الدفع الآن. ستتلقى إشعاراً فور إضافة الرصيد إلى حسابك.")}
                       </p>
                       <div className="bg-black/5 border-4 border-black border-dashed p-4 mb-8">
                          <p className="text-[10px] font-black uppercase opacity-60 mb-1">{t("Order Tracking ID", "رقم تتبع الطلب")}</p>
                          <p className="text-xl font-black tracking-[0.2em]">{orderCheck.orderId}</p>
                       </div>
                       <button onClick={() => setModalOpen(false)} className="w-full bg-black text-white px-6 py-4 font-black uppercase shadow-[6px_6px_0px_var(--c-lime)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">{t("Close & Track", "إغلاق ومتابعة")}</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Other Payment Method Modal */}
        {isOtherModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOtherModalOpen(false)} />
            <div className="relative w-full max-w-sm mx-auto animate-in zoom-in duration-300">
              <div className="absolute inset-0 bg-[var(--c-purple)] translate-x-3 translate-y-3 border-4 border-[var(--c-ink)]" />
              <div className="relative border-4 border-[var(--c-ink)] p-8 flex flex-col gap-6" style={{ backgroundColor: "var(--c-bg)" }}>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-center">{t("Other Payment Method", "طريقة دفع أخرى")}</h3>
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase opacity-60 mb-1">{t("Select Country", "اختر الدولة")}</label>
                  <button onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className="w-full flex items-center justify-between p-3 border-4 border-[var(--c-ink)] bg-white font-black text-sm uppercase shadow-[4px_4px_0px_var(--c-ink)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all"> <span>{otherCountry || t("Select...", "اختر...")}</span> <ChevronDown className={`w-5 h-5 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} /> </button>
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto border-4 border-[var(--c-ink)] bg-white shadow-[6px_6px_0px_var(--c-ink)]">
                       {ARAB_COUNTRIES.map(country => (
                         <button key={country.name} onClick={() => { setOtherCountry(`${country.flag} ${country.name} ${country.suffix || ""}`.trim()); setOtherCountryCode(country.code); setIsCountryDropdownOpen(false); }} className="w-full text-right p-3 hover:bg-[var(--c-lime)] border-b-2 border-[var(--c-ink)]/10 last:border-0 group"> <div className="flex items-center justify-between gap-3"> {country.suffix && <span className={`text-[10px] font-black uppercase ${country.name === "فلسطين" ? "text-red-600 animate-pulse" : "opacity-50"}`}> {country.suffix} </span>} <span className="flex-1 text-sm font-black uppercase flex items-center justify-end gap-3"> {country.name} <BrutalFlag code={country.code} /> </span> </div> </button>
                       ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black uppercase opacity-60 mb-2">{t("Payment System", "وسيلة الدفع")}</label>
                  {otherCountryCode ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {settings.paymentAccounts
                        .filter(acc => acc.countryCode === otherCountryCode)
                        .map(acc => (
                        <button 
                          key={acc.id}
                          onClick={() => {
                            setOtherMethod(acc.name);
                            setPaymentMethod(acc.id);
                            setIsOtherModalOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 border-4 transition-all ${paymentMethod === acc.id ? "border-black bg-[var(--c-lime)] translate-x-1 translate-y-1" : "border-black bg-white shadow-[4px_4px_0px_#000] hover:bg-black/5"}`}
                        >
                          <span className="text-xs font-black uppercase">{acc.name}</span>
                          {paymentMethod === acc.id && <CheckCircle className="w-4 h-4" />}
                        </button>
                      ))}
                      {settings.paymentAccounts.filter(acc => acc.countryCode === otherCountryCode).length === 0 && (
                        <div className="p-4 border-4 border-dashed border-black/10 text-center">
                          <p className="text-[10px] font-bold opacity-50 uppercase">{t("No specific wallets for this country yet. Contact support.", "لا توجد محافظ مضافة لهذه الدولة بعد. تواصل مع الدعم.")}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 border-4 border-black bg-black/5 text-center text-[10px] font-bold uppercase opacity-50">
                      {t("Select country first", "اختر الدولة أولاً")}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button onClick={() => setIsOtherModalOpen(false)} className="w-full bg-white text-[var(--c-ink)] p-4 font-black uppercase text-sm border-2 border-[var(--c-ink)] shadow-[4px_4px_0px_var(--c-ink)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all"> {t("Cancel", "إلغاء")} </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tutorial Video Modal */}
      {game.tutorialVideoUrl && (
        <VideoTutorialModal 
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
          videoUrl={game.tutorialVideoUrl}
          gameName={game.name}
        />
      )}
    </>
  );
}

export { slugify };
