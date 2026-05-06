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
import { useMonthlyStore } from "@/components/ControlledChaos/MonthlyStoreContext";
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
  const { status: monthlyStatus, discount: monthlyDiscount } = useMonthlyStore();
  const isMonthlyActive = monthlyStatus === 'confirmed';

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

        {/* Compact Game Header */}
        <div className="relative bg-[var(--c-ink)] text-white overflow-hidden border-b-4 border-[var(--c-ink)]">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity blur-sm" style={{ backgroundImage: `url(${game.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 to-black/40" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center p-6 md:p-10 gap-4 md:gap-6">
            <img src={game.image} alt={game.name} className="w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl object-cover shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-3xl md:text-5xl font-black uppercase text-white">{game.name}</h1>
                {game.badge && game.badge.text && (
                  <div className={`${game.badge.color || 'bg-red-500'} text-white px-2 py-1 md:px-3 md:py-1 border-2 border-white shadow-[2px_2px_0px_#000] rotate-2 flex items-center gap-1 animate-pulse`}>
                    {game.badge.icon === 'Flame' && <Flame className="w-3 h-3 md:w-4 md:h-4" />}
                    {game.badge.icon === 'Star' && <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />}
                    {game.badge.icon === 'Trophy' && <Trophy className="w-3 h-3 md:w-4 md:h-4" />}
                    {game.badge.icon === 'Sparkles' && <Sparkles className="w-3 h-3 md:w-4 md:h-4" />}
                    <span className="font-black uppercase text-[10px] md:text-sm">{game.badge.text}</span>
                  </div>
                )}
              </div>
              <p className="text-xs md:text-base text-white/70 max-w-2xl line-clamp-2">{t(game.desc, game.descAr || game.desc)}</p>
            </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
              {packages.map((pkg: any, i: number) => {
                const totalDiscount = (game.discount || 0) + (pkg.discount || 0) + (isMonthlyActive ? (monthlyDiscount || 0) : 0);
                const unitPrice = typeof pkg.price === 'number' ? pkg.price : (parseInt(pkg.price.replace(/\D/g, ""), 10) || 0);
                const discountedPrice = Math.round(unitPrice * (1 - totalDiscount / 100));

                return (
                  <button 
                    key={pkg.id || i} 
                    onClick={() => openModal({...pkg, unitPrice, discountedPrice, totalDiscount})}
                    className="group relative w-full text-left outline-none"
                  >
                    <div className={`absolute inset-0 ${pkg.popular ? "bg-[var(--c-orange)]" : game.color} translate-x-1.5 translate-y-1.5 md:translate-x-2 md:translate-y-2 border-2 md:border-4 border-[var(--c-ink)]`} />
                    <div className={`relative ${pkg.popular ? "bg-[var(--c-orange)]" : game.color} border-2 md:border-4 border-[var(--c-ink)] group-hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full bg-white`}>
                      {pkg.popular && (
                        <div className="absolute top-0 right-0 bg-[var(--c-ink)] text-[var(--c-bg)] px-1.5 py-0.5 md:px-2 md:py-1 text-[8px] md:text-[10px] font-black uppercase flex items-center gap-1 z-10">
                          <Star className="w-2 h-2 md:w-3 md:h-3" /> {t("POPULAR", "مميز")}
                        </div>
                      )}
                      
                      {totalDiscount > 0 && (
                        <div className="absolute top-0 left-0 z-20 pointer-events-none -translate-x-1 -translate-y-1 md:-translate-x-2 md:-translate-y-2">
                          <div className="bg-red-600 text-white flex flex-col items-center justify-center px-1.5 py-0.5 md:px-2 md:py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)] relative min-w-[30px] md:min-w-[50px]">
                            <span className="text-[7px] md:text-[8px] font-black tracking-tighter leading-none mb-0 md:mb-0.5 opacity-80">{t("SALE", "خصم")}</span>
                            <span className="text-[10px] md:text-sm font-black leading-none">-{totalDiscount}%</span>
                          </div>
                        </div>
                      )}

                      <div className="aspect-square bg-cover bg-center relative border-b-2 md:border-b-4 border-[var(--c-ink)]" style={{ backgroundImage: `url(${pkg.image || PKG_IMAGES[i % PKG_IMAGES.length]})` }}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="p-2 md:p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[10px] sm:text-xs md:text-sm font-black uppercase mb-1 md:mb-2 line-clamp-2 leading-tight">
                            {lang === 'ar' ? (pkg.nameAr || pkg.name) : pkg.name}
                          </h3>
                          <div className="mt-auto">
                            {totalDiscount > 0 ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] md:text-[10px] font-bold line-through opacity-50 leading-none">{formatPrice(unitPrice)}</span>
                                <span className="text-[11px] sm:text-xs md:text-lg font-black leading-none">{formatPrice(discountedPrice)}</span>
                              </div>
                            ) : (
                              <p className="text-[11px] sm:text-xs md:text-lg font-black leading-none">{formatPrice(unitPrice)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
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

                      {/* Payment Method section removed - Gems only */}

                      <div className="space-y-6 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {fieldConfig.fields.map((field: any, idx: number) => {
                            const suggestions = gameSavedAccounts.filter(acc => acc.accountId.includes(formData[field.key] || ""));
                            const isHalfWidth = field.key.toLowerCase().includes('id') || field.key.toLowerCase().includes('zone') || field.key.toLowerCase().includes('server');
                            
                            return (
                            <div key={field.key} className={`${isHalfWidth ? 'sm:col-span-1' : 'sm:col-span-2'} relative`}>
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
                              
                              {field.type === 'select' ? (
                                <select 
                                  value={formData[field.key] || ""} 
                                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                  className="w-full border-4 border-[var(--c-ink)] px-4 py-3 text-lg font-bold bg-white outline-none focus:border-[var(--c-orange)] appearance-none cursor-pointer"
                                >
                                  <option value="">{field.placeholder || t("Select option...", "اختر خياراً...")}</option>
                                  {field.options?.map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              ) : (
                                <input 
                                  type="text" 
                                  value={formData[field.key] || ""} 
                                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))} 
                                  onFocus={() => { if(idx === 0) setIsSuggestionsOpen(true); }} 
                                  onBlur={() => { setTimeout(() => setIsSuggestionsOpen(false), 200); }} 
                                  placeholder={field.placeholder} 
                                  className="w-full border-4 border-[var(--c-ink)] px-4 py-3 text-lg font-bold bg-transparent outline-none focus:border-[var(--c-orange)]" 
                                />
                              )}

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
                        </div>
                        
                        <div className="bg-black/5 p-4 border-2 border-black border-dashed">
                          <label className="block text-[10px] font-black uppercase mb-1 opacity-60">{t("Player Name (Optional)", "اسم اللاعب (اختياري - لتأكيد الحساب)")}</label>
                          <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder={t("e.g. AL LORD", "مثال: اللورد")} className="w-full bg-transparent border-b-2 border-black p-2 font-black text-sm outline-none" />
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
                          {(() => {
                             const baseUnitPrice = selectedPkg.discountedPrice !== undefined ? selectedPkg.discountedPrice : (typeof selectedPkg.price === 'number' ? selectedPkg.price : (parseInt(selectedPkg.price.replace(/\D/g, ""), 10) || 0));
                             const totalBasePrice = baseUnitPrice * quantity;
                             // 50 Gems = 45 EGP logic
                             const gemsPrice = Math.ceil(totalBasePrice / 0.9);
                             const hasEnough = balance >= gemsPrice;
                             const missingGems = gemsPrice > balance ? gemsPrice - balance : 0;
                             return (
                               <div className="space-y-3">
                                 <button 
                                   onClick={submitGemOrder} 
                                   disabled={!isFormValid || !hasEnough || isVerifying} 
                                   className={`w-full bg-[#101010] text-white px-6 py-5 text-xl font-black uppercase flex items-center justify-center gap-2 transition-all shadow-[6px_6px_0px_#b084ff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${(!isFormValid || !hasEnough || isVerifying) ? "opacity-30 cursor-not-allowed grayscale" : "hover:bg-[#b084ff]"}`}
                                 >
                                   {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <GemIcon size={24} />} 
                                   {isVerifying ? t("Processing...", "جاري الدفع...") : t("Pay with Gems", "ادفع بالجواهر")} ({formatGems(gemsPrice)})
                                 </button>
                                 {!hasEnough && isFormValid && (
                                   <div className="flex flex-col items-center gap-3 mt-4 p-4 border-4 border-red-600 bg-red-50 relative overflow-hidden shadow-[4px_4px_0px_#dc2626]">
                                     <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none rotate-12">
                                        <GemIcon size={80} />
                                     </div>
                                     <p className="text-sm font-black uppercase text-red-600 text-center relative z-10 flex items-center gap-2">
                                       {t("Insufficient Gem Balance", "رصيد الجواهر في حسابك غير كافٍ")}
                                     </p>
                                     <p className="text-xs font-bold text-red-700 uppercase text-center relative z-10">
                                       {t(`You are missing ${missingGems} gems to complete this purchase.`, `ينقصك ${missingGems} جوهرة لإتمام عملية الشراء.`)}
                                     </p>
                                     <Link 
                                       to={`/buy-gems?amount=${missingGems}`} 
                                       className="mt-2 w-full bg-red-600 text-white text-center py-3 text-sm font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative z-10 border-2 border-black flex items-center justify-center gap-2"
                                     >
                                       {t(`Buy ${missingGems} Gems Now`, `اشحن ${missingGems} جوهرة الآن`)} <ArrowLeft className="w-4 h-4 rotate-180 hidden md:block" />
                                     </Link>
                                   </div>
                                 )}
                               </div>
                             );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2 and 3 removed (Payment transfer details & proof upload) */}

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
