import { User, ShieldCheck, Trophy, History, Star, CreditCard, LogIn, LogOut, CheckCircle, Info, X, Plus, ChevronDown, ChevronUp, ReceiptText, Copy, Check, BellRing, AlertTriangle, ChevronRight, Code, Video, Gift, Link as LinkIcon } from "lucide-react";
import { useLogin } from "@/components/ControlledChaos/LoginContext";
import { useWallet } from "@/components/ControlledChaos/WalletContext";
import { GemIcon } from "@/components/ControlledChaos/GemIcon";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useNotifications } from "@/components/ControlledChaos/NotificationContext";
import { Navbar } from "@/components/ControlledChaos/Navbar";
import { Footer } from "@/components/ControlledChaos/Footer";
import { SavedAccountsModal } from "@/components/ControlledChaos/AccountSystem";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { ComplaintModal } from "@/components/ControlledChaos/ComplaintModal";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAdminStatus } from "@/components/ControlledChaos/AdminStatusContext";
import { StatusRing } from "@/components/ControlledChaos/StatusRing";
import { StoryViewer } from "@/components/ControlledChaos/StoryViewer";
import { formatGems } from "@/lib/utils";

const LEVEL_CONFIG = [
  { id: "low", name: "Novice", ar: "مبتديء", color: "#ccff00", xp: 0 },
  { id: "mid", name: "Veteran", ar: "مخضرم", color: "#b084ff", xp: 100 },
  { id: "high", name: "", ar: "", color: "#ff5e00", xp: 500 },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, openLogin, userData, openLogoutConfirm } = useLogin();
  const { balance, transactions, referralCode, redeemGiftCode } = useWallet();
  const { t, lang } = useLang();
  
  const { addNotification } = useNotifications();
  const [giftInput, setGiftInput] = useState("");
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isWalletExpanded, setIsWalletExpanded] = useState(false);
  const [giftError, setGiftError] = useState("");
  const { hasActiveStatus, openViewer } = useAdminStatus();
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    
    addNotification(
      t("Copied to Clipboard", "تم النسخ للحافظة"),
      `${t("Field", "الحقل")}: ${fieldId} (${text})`,
      "info"
    );

    setTimeout(() => setCopiedField(null), 2000);
  };

  const [orders] = useState([
    { id: "ORD-9921", game: "PUBG Mobile", amount: "60 UC", date: "2024-03-25", status: "Completed", statusAr: "مكتمل", targetId: "5129938812", payMethod: "Vodafone Cash" },
    { id: "ORD-8812", game: "Free Fire", amount: "100 Diamonds", date: "2024-03-22", status: "Completed", statusAr: "مكتمل", targetId: "12849921", payMethod: "InstaPay" },
    { id: "ORD-7711", game: "Call of Duty", amount: "Battle Pass", date: "2024-03-15", status: "Completed", statusAr: "مكتمل", targetId: "COD-UsernameX", payMethod: "Credit Card" },
    { id: "ORD-6622", game: "Roblox", amount: "400 Robux", date: "2024-03-10", status: "Completed", statusAr: "مكتمل", targetId: "RobloxSlayer99", payMethod: "Vodafone Cash" },
    { id: "ORD-5531", game: "eFootball", amount: "250 Coins", date: "2024-03-05", status: "Completed", statusAr: "مكتمل", targetId: "293001882", payMethod: "Stripe" },
  ]);

  const getLevelInfo = (lvl: number) => {
    if (lvl > 10) return LEVEL_CONFIG[2];
    if (lvl > 5) return LEVEL_CONFIG[1];
    return LEVEL_CONFIG[0];
  };

  const levelInfo = getLevelInfo(11);
  const isVIP = true;

  const triggerTestNotif = () => {
    const types: Array<"success"| "info"| "warning"| "error"> = ["success", "info", "warning", "error"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    addNotification(
       t("System Test", "اختبار النظام"),
       t(`This is a test notification of type: ${randomType}`, `هذا تنبيه تجريبي من النوع: ${randomType}`),
       randomType
    );
  };

  const ActionButtons = () => (
    <>
      <button 
        onClick={() => { setShowInfoModal(true); setIsActionsModalOpen(false); }}
        className="flex items-center gap-2 bg-[#101010] text-white px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-[#ff5e00] hover:text-black transition-all border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
      >
        <Info className="w-4 h-4" />
        {t("Account Info", "معلومات الحساب")}
      </button>
      {hasActiveStatus && (
        <button 
          onClick={() => { openViewer(); setIsActionsModalOpen(false); }}
          className="bg-[#ccff00] text-black px-3 py-2 font-black uppercase text-[10px] md:text-xs flex items-center gap-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
        >
          <Video className="w-4 h-4" /> {t("Show Status", "عرض الحالة")}
        </button>
      )}
      <button 
        onClick={() => { setShowSavedAccounts(true); setIsActionsModalOpen(false); }}
        className="flex items-center gap-2 bg-[#ccff00] text-black px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-[#ff5e00] transition-all border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
      >
        <Star className="w-4 h-4" />
        {t("Manage Favorites", "إدارة محفوظاتي")}
      </button>
      <button 
        onClick={() => { triggerTestNotif(); setIsActionsModalOpen(false); }}
        className="flex items-center gap-2 bg-white text-black px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-[var(--c-lime)] transition-all border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
      >
        <BellRing className="w-4 h-4" />
        {t("Test Notif", "تجربة إشعار")}
      </button>
      <button 
        onClick={() => { setShowComplaintModal(true); setIsActionsModalOpen(false); }}
        className="flex items-center gap-2 bg-[#ff5e00] text-black px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-black hover:text-[#fffbf0] transition-all border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
      >
        <AlertTriangle className="w-4 h-4" />
        {t("Submit Complaint", "إرسال بلاغ")}
      </button>
      <button 
        onClick={() => { openLogoutConfirm(); setIsActionsModalOpen(false); }}
        className="flex items-center gap-2 bg-red-600 text-[#fffbf0] px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-black transition-all border-2 border-black shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start"
      >
        <LogOut className="w-4 h-4" />
        {t("Logout", "تسجيل الخروج")}
      </button>
      <Link 
        to="/admin"
        className="flex items-center gap-2 bg-[#101010] text-[#ccff00] px-3 py-2 text-[10px] md:text-xs font-black uppercase hover:bg-black hover:text-[#fffbf0] transition-all border-2 border-[#ccff00] shadow-[4px_4px_0px_#ccff00] active:translate-y-0.5 active:shadow-none w-full md:w-auto justify-center md:justify-start md:ml-auto"
      >
        <Code className="w-4 h-4" />
        {t("Dev Access", "دخول المطورين")}
      </Link>
    </>
  );

  return (
    <>
      <GlobalStyles />
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#b084ff] selection:text-[#fffbf0]" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Navbar />

      {/* Floating Close Button */}
      <button 
        onClick={() => navigate('/')}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 md:top-28 md:bottom-auto md:left-auto md:right-8 z-50 bg-[#101010] text-[#fffbf0] border-4 border-[#101010] px-6 py-3 font-black uppercase shadow-[6px_6px_0px_#b084ff] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#ccff00] transition-all flex items-center gap-2 cursor-pointer"
      >
        <X className="w-5 h-5 text-[#ccff00]" />
        {t("Close Profile", "إغلاق البروفايل")}
      </button>

      {/* Header Section (Light) */}
      <section className="pt-24 md:pt-32 pb-12 px-4 md:px-8 bg-[#fffbf0] relative border-b-8 border-black">
        <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Profile Header Block */}
          <div className="bg-[#b084ff] text-[#101010] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_#000] relative overflow-hidden">
            {/* Shadow Overlay decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 opactiy-10 -mr-16 -mt-16 bg-[#ccff00] rounded-full blur-3xl opacity-20 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
              {/* Avatar */}
              <div className="mx-auto md:mx-0">
                <StatusRing shape="square" size="lg">
                  <div className={`relative p-1 border-4 border-black bg-[#fffbf0] shrink-0 ${isVIP ? 'animate-pulse' : ''} shadow-[4px_4px_0px_#000]`}>
                    <div className="absolute inset-0 -m-2 border-4 border-dashed border-black/20" />
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 bg-[#fffbf0] flex items-center justify-center border-4 border-black relative"
                      style={{ borderColor: levelInfo.color }}
                    >
                      <User className="w-12 h-12 md:w-16 md:h-16 text-black opacity-20" />
                      {isVIP && (
                        <div className="absolute -top-3 -right-3 bg-[#ff5e00] text-black font-black text-[10px] px-2 py-1 border-2 border-black rotate-12 shadow-[2px_2px_0px_#000]">
                          VIP
                        </div>
                      )}
                    </div>
                  </div>
                </StatusRing>
              </div>

              {/* Info */}
              <div className="text-center md:text-start flex-1 min-w-0">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-black px-2 py-0.5 rounded-sm flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                    <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-black" strokeWidth={3} />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black">
                      {isLoggedIn ? t("Premium Agent", "عميل ذهبي VIP") : t("Guest Session", "جلسة ضيف")}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase leading-tight md:leading-[0.85] tracking-tighter truncate mt-2 text-white text-outline">
                  {isLoggedIn ? (userData?.name || "User") : t("Explorer", "مستكشف")}
                </h2>
                <p className="text-xs md:text-sm font-bold mt-2 truncate text-black/70">
                  {isLoggedIn ? (userData?.contact || "Not Provided") : t("Anonymous Access", "دخول مجهول")}
                </p>

                {isLoggedIn && userData?.id && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                    <div className="bg-black/10 border-2 border-black/20 px-3 py-1.5 flex items-center gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                       <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-60">USER ID:</span>
                       <span className="text-xs md:text-sm font-mono font-bold tracking-wider">{userData.id}</span>
                       <button 
                         onClick={() => handleCopy(userData.id, "ID")}
                         className="p-1 hover:bg-black hover:text-[#fffbf0] transition-colors rounded-sm"
                         title={t("Copy ID", "نسخ المعرف")}
                       >
                         {copiedField === "ID" ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                       </button>
                    </div>

                    {/* Gem Balance Card Restored */}
                    <Link 
                       to="/buy-gems"
                       className="bg-[#ccff00] border-2 border-black px-3 py-1.5 flex items-center gap-2 shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all group"
                     >
                        <GemIcon size={16} className="group-hover:animate-bounce" />
                        <div className="flex flex-col leading-none">
                           <span className="text-[9px] font-black uppercase opacity-60">{t("Wallet Balance", "رصيد المحفظة")}</span>
                           <span className="text-sm font-black tracking-tight">{formatGems(balance)} <span className="text-[10px] opacity-70">GEMS</span></span>
                        </div>
                        <Plus className="w-3 h-3 ml-1" strokeWidth={4} />
                     </Link>
                  </div>
                )}
                
                {isLoggedIn && (
                  <div className="mt-6">
                    {/* Mobile Collapsible Button */}
                    <div className="md:hidden">
                      <button 
                        onClick={() => setIsActionsModalOpen(true)}
                        className="w-full flex items-center justify-between bg-[#101010] text-[#ccff00] px-4 py-3 font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <ReceiptText className="w-5 h-5" />
                          {t("Account Actions", "إجراءات الحساب")}
                        </span>
                        <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Desktop Side-by-Side */}
                    <div className="hidden md:flex flex-wrap gap-2">
                      <ActionButtons />
                    </div>
                  </div>
                )}
              </div>

              {/* Level Badge */}
              <div className="hidden md:flex flex-col items-center shrink-0">
                <div 
                  className="w-20 h-20 rotate-45 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] transition-colors duration-500"
                  style={{ backgroundColor: levelInfo.color }}
                >
                  <div className="-rotate-45 flex flex-col items-center text-black">
                    <span className="text-[10px] font-black leading-none opacity-80 uppercase">{t("LVL", "مستوى")}</span>
                    <span className="text-2xl font-black">11</span>
                  </div>
                </div>
                <span className="mt-4 font-black uppercase text-[10px] tracking-widest text-white px-2 bg-black">{lang === 'ar' ? levelInfo.ar : levelInfo.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section (Dark) */}
      <section className="flex-1 bg-[#101010] text-[#fffbf0] pb-20 px-4 md:px-8 relative">
        {/* Abstract pattern lines in background */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(#ccff00_1px,transparent_1px),linear-gradient(90deg,#ccff00_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-4xl mx-auto w-full pt-12 animate-in fade-in duration-500 relative z-10">
          {!isLoggedIn ? (
            <div className="text-center border-4 border-black p-8 bg-[#ccff00] shadow-[8px_8px_0px_#000] text-black">
              <LogIn className="w-20 h-20 mx-auto mb-6 opacity-30" />
              <h3 className="font-black uppercase text-2xl md:text-4xl mb-3">{t("Sign in needed", "يرجى تسجيل الدخول")}</h3>
              <p className="font-bold text-base md:text-lg opacity-80 mb-8 max-w-md mx-auto">{t("Level up and track your recharges by logging in to your account.", "ارتقِ بمستواك وتابع شحناتك بسهولة عبر تسجيل الدخول لحسابك الخاص.")}</p>
              <button 
                onClick={openLogin}
                className="bg-black text-[#ccff00] px-12 py-5 font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0px_#ff5e00] hover:bg-[#ff5e00] hover:text-black hover:shadow-[8px_8px_0px_#b084ff] transition-all active:translate-y-1 inline-flex items-center gap-3"
              >
                <LogIn className="w-6 h-6" />
                {t("Go to Login", "انتقل لتسجيل الدخول")}
              </button>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="border-4 border-[#fffbf0] p-6 bg-[#b084ff] text-black shadow-[4px_4px_0px_#fffbf0] md:shadow-[8px_8px_0px_#ccff00] hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-black" />
                    <span className="text-xs font-black uppercase opacity-80">{t("Total Recharges", "إجمالي الشحن")}</span>
                  </div>
                  <div className="text-4xl md:text-6xl font-black">12 <span className="text-sm md:text-lg uppercase opacity-60 ml-2">{t("Requests", "طلبات")}</span></div>
                </div>
                <div className="border-4 border-[#fffbf0] p-6 bg-[#ff5e00] text-black shadow-[4px_4px_0px_#fffbf0] md:shadow-[8px_8px_0px_#ccff00] hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-6 h-6 text-black" />
                    <span className="text-xs font-black uppercase opacity-80">{t("Account Security", "أمان الحساب")}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 bg-black/20 h-6 border-2 border-black p-1">
                      <div className="bg-[#ccff00] h-full w-[95%] border-r-2 border-black animate-[pulse_3s_ease-in-out_infinite]" />
                    </div>
                    <span className="text-xl md:text-3xl font-black">95%</span>
                  </div>
                </div>
              </div>

              {/* Gem Wallet Hub */}
              <div className="border-4 border-black bg-[#fffbf0] text-black shadow-[8px_8px_0px_#ccff00] animate-in fade-in-up duration-500 delay-100 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 md:p-8 cursor-pointer hover:bg-black/5 transition-colors select-none"
                  onClick={() => setIsWalletExpanded(!isWalletExpanded)}
                >
                  <div className="flex items-center gap-4">
                    <h3 className="font-black uppercase text-2xl md:text-3xl flex items-center gap-3 text-[#b084ff]">
                      <GemIcon size={32} />
                      {t("Gem Wallet", "المحفظة الذهبية")}
                    </h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{t("Balance", "الرصيد")}</span>
                      <div className="text-xl font-black text-black bg-[#ccff00] px-3 py-1 border-2 border-black">
                        {formatGems(balance)}
                      </div>
                    </div>
                    <ChevronDown className={`w-8 h-8 transition-transform duration-300 ${isWalletExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ${isWalletExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 md:p-8 pt-0 border-t-4 border-black/10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 mt-6">
                      <div className="flex-1">
                        <p className="text-sm font-bold opacity-70 uppercase">
                          {t("Your universal store currency", "عملتك الموحدة داخل المتجر")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{t("Current Balance", "الرصيد الحالي")}</span>
                        <div className="text-4xl md:text-5xl font-black text-black bg-[#ccff00] px-4 py-2 border-4 border-black relative">
                          {formatGems(balance)}
                          <span className="absolute -top-3 -right-3 rotate-12 bg-black text-[#ccff00] text-xs font-black px-2 py-0.5 border-2 border-white">Gems</span>
                        </div>
                      </div>
                    </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="border-4 border-black bg-white p-5 cursor-pointer hover:-translate-y-1 transition-all group" onClick={() => addNotification(t("Adding...", "جار الإضافة"), t("Direct purchasing gems will be available via store packages...", "تتوفر خاصية الشراء المباشر عبر الباقات..."), "info")}>
                    <div className="flex items-center gap-3 mb-2">
                       <Plus className="w-6 h-6 text-[#101010] group-hover:scale-125 transition-transform" />
                       <h4 className="font-black uppercase text-lg">{t("Buy Gems", "شراء جواهر")}</h4>
                    </div>
                    <p className="text-xs font-bold opacity-60 uppercase">{t("Recharge your wallet", "شحن رصيد المحفظة الخاص بك")}</p>
                  </div>

                  <div className="border-4 border-black bg-[#101010] p-5 text-white">
                    <div className="flex items-center gap-3 mb-3">
                       <Gift className="w-6 h-6 text-[#b084ff]" />
                       <h4 className="font-black uppercase text-lg text-[#ccff00]">{t("Redeem Code", "استرداد كود هدايا")}</h4>
                    </div>
                    <div className="flex w-full items-stretch shadow-[4px_4px_0px_#000]">
                      <input 
                        type="text" 
                        placeholder="AL-GIFT-..." 
                        className="flex-1 bg-white text-black border-2 border-black p-2 font-bold focus:outline-none focus:bg-[#ccff00]/10 min-w-0"
                        value={giftInput}
                        onChange={(e) => setGiftInput(e.target.value)}
                      />
                      <button 
                        onClick={() => {
                          setGiftError("");
                          if (redeemGiftCode(giftInput)) {
                            setGiftInput("");
                            addNotification("Success", "تم استرداد الكود بنجاح", "success");
                          } else {
                            setGiftError(t("Invalid or used code", "الكود غير صحيح أو مستخدم"));
                            addNotification("Error", "الكود غير صحيح أو مستخدم", "error");
                          }
                        }}
                        className="bg-[#ccff00] text-black font-black px-4 border-2 border-r-0 border-black hover:bg-[#b084ff] hover:text-white transition-colors whitespace-nowrap shrink-0 text-sm"
                      >
                        {t("Apply", "تطبيق")}
                      </button>
                    </div>
                    {giftError && (
                      <p className="text-[10px] font-black text-red-600 mt-2 uppercase animate-in fade-in slide-in-from-top-1">
                        {giftError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-4 border-black bg-[#fffbf0] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#b084ff] p-2 border-2 border-black rotate-[-5deg]">
                       <LinkIcon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                       <h4 className="font-black text-sm uppercase">{t("Referral Code", "رابط الدعوة الخاص")}</h4>
                       <p className="text-[10px] font-bold opacity-70 uppercase">{t("Invite friends and earn gems!", "ادعُ الأصدقاء واربح الجواهر!")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0 w-full md:w-auto">
                     <div className="bg-white border-2 border-y-black border-l-black border-r-0 md:border-r-2 md:border-black p-2 font-black text-sm truncate flex-1 md:w-48 text-center">{referralCode}</div>
                     <button onClick={() => handleCopy(referralCode, "Referral Link")} className="bg-black text-white p-2 border-2 border-black hover:bg-[#ccff00] hover:text-black transition-colors shrink-0">
                       <Copy className="w-5 h-5" />
                     </button>
                  </div>
                </div>

                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="border-4 border-[#ccff00] p-6 md:p-8 bg-[#1a1a1a] shadow-[6px_6px_0px_#ccff00] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none">
                  <ShieldCheck className="w-32 h-32 text-[#ccff00]" />
                </div>
                <div className="flex justify-between items-end mb-6 relative z-10">
                  <div>
                    <h4 className="font-black uppercase text-2xl md:text-4xl text-[#ccff00] leading-none">{t("Status Upgrade", "تطوير رتبة الحساب")}</h4>
                    <p className="text-xs font-bold opacity-60 uppercase mt-2 text-[#fffbf0]">160 XP {t("to Next Level", "للمستوى التالي")}</p>
                  </div>
                </div>
                <div className="h-10 md:h-12 border-4 border-black bg-black relative overflow-hidden z-10">
                   <div 
                    className="h-full bg-[#ccff00] transition-all duration-1000 border-r-4 border-black" 
                    style={{ width: '65%' }}
                   />
                   <div className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black mix-blend-difference">
                     {t("Processing Experience...", "جاري معالجة الخبرة...")}
                   </div>
                </div>
              </div>

              {/* Complaints & Support Button */}
              <div 
                className="hidden md:flex border-4 border-[#fffbf0] p-5 bg-[#ff5e00] text-black shadow-[4px_4px_0px_#fffbf0] md:shadow-[8px_8px_0px_#b084ff] items-center justify-between group cursor-pointer hover:-translate-y-1 transition-all" 
                onClick={() => setShowComplaintModal(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-black text-[#ff5e00] p-2 border-2 border-black rotate-3">
                    <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-lg md:text-xl leading-none">{t("Report a Problem", "إرسال بلاغ أو شكوى")}</h4>
                    <p className="text-[9px] md:text-[10px] font-bold opacity-70 uppercase mt-1">{t("Direct contact with admins", "تواصل مباشر مع الإدارة")}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </div>

              {/* Transaction Log */}
              <div className="mt-12">
                <div className="flex items-center gap-3 mb-8 border-b-4 border-[#fffbf0] pb-4">
                  <History className="w-8 h-8 text-[#ff5e00]" />
                  <h4 className="font-black uppercase text-3xl md:text-5xl tracking-tighter text-[#fffbf0]">{t("Transaction Log", "سجل العمليات")}</h4>
                </div>
                <div className="space-y-4">
                  {orders.map((order, idx) => {
                    const isExpanded = expandedOrderId === order.id;
                    
                    return (
                    <div key={idx} className="flex flex-col border-4 border-[#fffbf0] bg-[#1a1a1a] shadow-[4px_4px_0px_#fffbf0] mb-4 transition-all">
                      {/* Header Row */}
                      <div 
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className={`group flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 cursor-pointer hover:bg-black transition-colors ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}
                      >
                        <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                          <div className="bg-[#ccff00] text-black px-3 py-1.5 text-xs font-black border-2 border-black">{order.date}</div>
                          <span className="font-black uppercase text-lg tracking-tight text-[#fffbf0]">{order.game}</span>
                        </div>
                        <div className={`flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-3 md:gap-6 mt-4 md:mt-0 ${lang === 'ar' ? 'md:flex-row-reverse text-left md:text-right' : ''}`}>
                          <span className="text-xl font-black text-[#b084ff]">{order.amount}</span>
                          <div className="flex flex-row items-center justify-between gap-4 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-xs font-black text-black bg-[#ccff00] px-4 py-2 border-2 border-black shadow-[2px_2px_0px_#ff5e00]">
                              <CheckCircle className="w-4 h-4" /> {lang === 'ar' ? order.statusAr : order.status}
                            </div>
                            
                            {/* Expand Button */}
                            <button className="bg-black text-white p-2 border-2 border-[#fffbf0] hover:bg-[#ff5e00] hover:text-black transition-colors rounded-sm shadow-[2px_2px_0px_#fffbf0]">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Data Row */}
                      {isExpanded && (
                        <div className="border-t-4 border-dashed border-[#fffbf0]/30 p-5 md:p-6 bg-black flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                          <div className={`flex items-center gap-2 text-[#ccff00] mb-2 ${lang === 'ar' ? 'flex-row-reverse justify-start text-right' : 'justify-start text-left'}`}>
                            <ReceiptText className="w-5 h-5" />
                            <h5 className="font-black uppercase text-sm text-[#ccff00]">{t("Order Details", "بيانات الطلبية")}</h5>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-2 border-[#fffbf0]/20 p-4 bg-[#1a1a1a]">
                              <p className="text-[10px] uppercase font-bold text-[#fffbf0]/50 mb-1">{t("Order Reference", "الرقم المرجعيللطلب")}</p>
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-black uppercase text-[#fffbf0] tracking-wider truncate">{order.id}</p>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCopy(order.id, `${order.id}-ref`); }}
                                  className={`w-7 h-7 shrink-0 border-2 flex items-center justify-center transition-all ${copiedField === `${order.id}-ref` ? 'border-[#ccff00] bg-[#ccff00] text-black shadow-[2px_2px_0px_#ccff00]' : 'border-[#fffbf0]/20 bg-[#101010] text-[#fffbf0]/50 hover:bg-[#ccff00] hover:text-black hover:border-black shadow-[2px_2px_0px_rgba(255,251,240,0.2)] hover:shadow-[2px_2px_0px_transparent]'}`}
                                >
                                  {copiedField === `${order.id}-ref` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            <div className="border-2 border-[#fffbf0]/20 p-4 bg-[#1a1a1a]">
                              <p className="text-[10px] uppercase font-bold text-[#fffbf0]/50 mb-1">{t("Target ID / Account", "معرف اللاعب / الحساب")}</p>
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-black uppercase text-[#fffbf0] tracking-wider truncate">{order.targetId}</p>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleCopy(order.targetId, `${order.id}-target`); }}
                                  className={`w-7 h-7 shrink-0 border-2 flex items-center justify-center transition-all ${copiedField === `${order.id}-target` ? 'border-[#ccff00] bg-[#ccff00] text-black shadow-[2px_2px_0px_#ccff00]' : 'border-[#fffbf0]/20 bg-[#101010] text-[#fffbf0]/50 hover:bg-[#ccff00] hover:text-black hover:border-black shadow-[2px_2px_0px_rgba(255,251,240,0.2)] hover:shadow-[2px_2px_0px_transparent]'}`}
                                >
                                  {copiedField === `${order.id}-target` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            <div className="border-2 border-[#fffbf0]/20 p-4 bg-[#1a1a1a]">
                              <p className="text-[10px] uppercase font-bold text-[#fffbf0]/50 mb-1">{t("Payment Method", "طريقة الدفع")}</p>
                              <p className="font-black uppercase text-[#fffbf0] tracking-wider">{order.payMethod}</p>
                            </div>
                            <div className="border-2 border-[#fffbf0]/20 p-4 bg-[#1a1a1a]">
                              <p className="text-[10px] uppercase font-bold text-[#fffbf0]/50 mb-1">{t("Delivered Amount", "الكمية المسلمة")}</p>
                              <p className="font-black uppercase text-[#b084ff] tracking-wider">{order.amount} {order.game}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Minor Sub Modals */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
           <div className="relative bg-[#fffbf0] border-4 border-black p-8 shadow-[10px_10px_0px_#000] w-full max-w-sm rotate-1">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="absolute -top-6 -right-6 w-12 h-12 bg-[#ff5e00] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:rotate-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-8 h-8 text-[#b084ff]" />
                  <h4 className="text-2xl font-black uppercase leading-none">{t("Login Security", "بيانات الحساب")}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="border-b-2 border-black/10 pb-2">
                    <p className="text-[10px] font-black opacity-50 uppercase">{t("Method", "طريقة الدخول")}</p>
                    <p className="font-black uppercase text-sm text-[#ff5e00]">{userData?.method || "Unknown"}</p>
                  </div>
                  <div className="border-b-2 border-black/10 pb-2">
                    <p className="text-[10px] font-black opacity-50 uppercase">{t("Username", "اسم المستخدم")}</p>
                    <p className="font-black uppercase text-sm">{userData?.name || "Guest"}</p>
                  </div>
                  <div className="border-b-2 border-black/10 pb-2">
                    <p className="text-[10px] font-black opacity-50 uppercase">{t("Login Date", "تاريخ الدخول")}</p>
                    <p className="font-black uppercase text-sm">{userData?.date || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setShowInfoModal(false)}
                    className="w-full bg-[#ccff00] border-4 border-black py-3 font-black uppercase text-xs shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {t("OK, GOT IT", "حسناً، فهمت")}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {showSavedAccounts && (
        <SavedAccountsModal onClose={() => setShowSavedAccounts(false)} />
      )}

      <ComplaintModal 
        isOpen={showComplaintModal} 
        onClose={() => setShowComplaintModal(false)} 
      />

      {isActionsModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="absolute inset-0" onClick={() => setIsActionsModalOpen(false)} />
           <div className="relative bg-[#fffbf0] border-8 border-black p-6 shadow-[15px_15px_0px_#ccff00] w-full max-w-sm">
              <button 
                onClick={() => setIsActionsModalOpen(false)}
                className="absolute -top-6 -right-6 w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000] hover:bg-black hover:text-white transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-6 flex items-center gap-3">
                 <div className="bg-[#b084ff] p-2 border-2 border-black rotate-3">
                    <ReceiptText className="w-6 h-6 text-black" />
                 </div>
                 <h3 className="text-2xl font-black uppercase text-black">{t("Account Actions", "إجراءات الحساب")}</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                 <ActionButtons />
              </div>
              
              <div className="mt-8 pt-6 border-t-4 border-black/10">
                 <p className="text-[10px] font-black uppercase opacity-40 text-center">{t("AL LORD STORE SYSTEM ACCESS", "ال لورد ستور - نظام الوصول")}</p>
              </div>
           </div>
        </div>
      )}
    </div>
    </>
  );
}
