import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCommunity } from "@/components/ControlledChaos/CommunityContext";
import { useComplaints } from "@/components/ControlledChaos/ComplaintContext";
import { useLang } from "@/components/ControlledChaos/LangContext";

const ARAB_COUNTRIES = [
  { name: "مصر", flag: "🇪🇬", code: "eg" },
  { name: "فلسطين", flag: "🇵🇸", code: "ps" },
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
  { name: "السودان", flag: "🇸🇩", code: "sd" },
  { name: "العالم (Global)", flag: "🌐", code: "global" }
];

import { useGames } from "@/components/ControlledChaos/GamesContext";
import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { useCoupons } from "@/components/ControlledChaos/CouponContext";
import { useAdminStatus } from "@/components/ControlledChaos/AdminStatusContext";
import { useAdminFinance } from "@/components/ControlledChaos/AdminFinanceContext";
import { useNotifications } from "@/components/ControlledChaos/NotificationContext";
import { useOrders, OrderStatus, Order } from "@/components/ControlledChaos/OrderContext";
import { ShieldAlert, KeyRound, Check, X, Send, ImagePlus, Image, Eye, AlertTriangle, User, Calendar, ExternalLink, ArrowLeft, Gamepad2, Plus, LogOut, Edit, Trash2, Settings, Ticket, Copy, Star, Info, Play, Video, Users, DollarSign, TrendingUp, Activity, ShoppingBag, Package, Search, Filter, Flame, Trophy, Sparkles, BellOff, Bell, LayoutDashboard, Wallet, LayoutGrid, ClipboardList, BellRing, Megaphone, CheckCircle2, Edit3, Maximize2, Clock, Share2, MessageSquare, PlusCircle, Tag, Globe } from "lucide-react";
import { CommunityChat } from "@/components/ControlledChaos/CommunityChat";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { useWallet, GemPackage } from "@/components/ControlledChaos/WalletContext";
import { useMonthlyStore } from "@/components/ControlledChaos/MonthlyStoreContext";

// --- Helper Components for the Overhaul ---
const NavButton = ({ id, active, icon: Icon, label, badge, onClick, colorClass }: any) => {
  return (
    <button 
      onClick={() => onClick(id)} 
      className={`
        flex-1 md:flex-none px-4 py-3 md:px-6 md:py-4 font-black uppercase text-[10px] md:text-xs border-4 border-black transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 relative group
        ${active 
          ? `${colorClass || 'bg-[var(--c-lime)]'} text-black shadow-[6px_6px_0px_#000] -translate-y-1` 
          : 'bg-white hover:bg-black/5 hover:-translate-y-0.5'
        }
      `}
    >
      <Icon className={`w-4 h-4 md:w-5 md:h-5 ${active ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`} />
      <span className="whitespace-nowrap text-center leading-none tracking-tight">{label}</span>
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] md:text-[10px] px-2 py-0.5 border-2 border-black animate-pulse z-10 font-black shadow-sm">
          {badge}
        </span>
      )}
    </button>
  );
};

const StatMiniCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white border-4 border-black p-4 flex items-center justify-between shadow-[4px_4px_0px_#000] min-w-[140px] flex-1">
    <div>
      <p className="text-[9px] font-black uppercase opacity-40 mb-1">{label}</p>
      <p className="text-xl font-black leading-none">{value}</p>
    </div>
    <div className={`p-2 border-2 border-black ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, action, lang }: any) => {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-8 border-black pb-6 gap-6 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
      <div className={`flex items-center gap-5 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
        <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-4 border-black shadow-[6px_6px_0px_var(--c-orange)] transform -rotate-3">
           <Icon className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-black uppercase leading-none tracking-tighter drop-shadow-sm">{title}</h2>
          <p className="text-xs md:text-base font-bold uppercase opacity-50 mt-1 tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="w-full md:w-auto">
        {action}
      </div>
    </div>
  );
};

const AdminCard = ({ children, title, icon: Icon, color = "bg-white", className = "", lang }: any) => (
  <div className={`${color} border-4 border-black p-6 shadow-[10px_10px_0px_#000] relative overflow-hidden group hover:shadow-[14px_14px_0px_#000] transition-all ${className}`}>
    {title && (
      <div className={`flex items-center gap-3 mb-6 border-b-2 border-black/10 pb-3 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
        {Icon && <Icon className="w-6 h-6 text-[var(--c-orange)]" />}
        <h4 className="font-black uppercase text-base tracking-tight">{title}</h4>
      </div>
    )}
    <div className="relative z-10">
      {children}
    </div>
    {/* Decorative background element */}
    <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-black/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
  </div>
);

export default function AdminDashboard() {
  const { isAuthenticatedDev, verifyDevPin, logoutDev, posts, approvePost, rejectPost, publishDevPost, middlemanRequests, resolveMiddleman } = useCommunity();
  const { complaints, resolveComplaint } = useComplaints();
  const { games, addGame, removeGame, updateGame, adminResetGames } = useGames();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { coupons, addCoupon, updateCoupon, removeCoupon } = useCoupons();
  const { statuses, addStatus, removeStatus } = useAdminStatus();
  const { crmUsers, expenses, totalIncome, addExpense, removeExpense, updateUserRating, deleteUser } = useAdminFinance();
  const { t, lang } = useLang();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const { addNotification } = useNotifications();
  const { createGiftCode, gemPackages, addGemPackage, deleteGemPackage, updateGemPackage, addGemsToUser } = useWallet();
  const { probabilities: monthlyProbs, setProbabilityConfig, activeGames: monthlyGames, isOpen: isMonthlyOpen } = useMonthlyStore();
  const pendingPostsCount = posts.filter(p => p.status === 'pending').length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'pending').length;

  const getStatusArabic = (status: string) => {
    switch(status) {
      case 'pending': return "معلق";
      case 'processing': return "قيد التنفيذ";
      case 'done': return "تم الاكتمال";
      case 'rejected': return "مرفوض";
      default: return status;
    }
  };

  const [giftCodeAmount, setGiftCodeAmount] = useState(1000);
  const [giftCodeCustom, setGiftCodeCustom] = useState("");

  const [sendGemsId, setSendGemsId] = useState("");
  const [sendGemsAmount, setSendGemsAmount] = useState(500);

  const [newGemPkg, setNewGemPkg] = useState<Partial<GemPackage>>({ name: "", nameEn: "", gems: 100, price: 1.5, popular: false, color: "#fffbf0" });
  const [editingGemPkg, setEditingGemPkg] = useState<GemPackage | null>(null);

  const [gameSearchTerm, setGameSearchTerm] = useState("");

  const handleGenerateGiftCode = (copyOnly: boolean) => {
    const codeStr = giftCodeCustom.trim() || `AL-GIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    createGiftCode(codeStr, giftCodeAmount);
    
    try {
      navigator.clipboard.writeText(codeStr);
    } catch {
      const el = document.createElement('textarea');
      el.value = codeStr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    if (copyOnly) {
      window.alert(`تم تفعيل ونسخ الكود: ${codeStr} بقيمة ${giftCodeAmount} جوهرة.`);
    } else {
      publishDevPost({
        title: "🎁 كود هدايا جديد!",
        description: `🎉 كود هدايا جديد متاح الآن! 🎉\nاستخدم الكود: ${codeStr} للحصول على ${giftCodeAmount} جوهرة فوراً! الأسبقية لأكثر شخص سريع!`,
        images: [],
        giftCode: codeStr
      } as any);
      window.alert(`تم الانتهاء: الكود ${codeStr} نُسخ ونُشر كموضوع على مجتمع AL LORD!`);
    }
  };

  const handleAddOrUpdateGemPkg = () => {
    if (editingGemPkg) {
      updateGemPackage(editingGemPkg.id, editingGemPkg);
      setEditingGemPkg(null);
      addNotification("تم التحديث", "تم تحديث باقة الجواهر بنجاح", "success");
    } else {
      if (newGemPkg.name && newGemPkg.price) {
        addGemPackage({
          id: `pkg-${Date.now()}`,
          name: newGemPkg.name,
          nameEn: newGemPkg.nameEn || newGemPkg.name,
          gems: newGemPkg.gems || 100,
          price: newGemPkg.price || 1.5,
          popular: newGemPkg.popular || false,
          color: newGemPkg.color || "#fffbf0"
        } as GemPackage);
        setNewGemPkg({ name: "", nameEn: "", gems: 100, price: 1.5, popular: false, color: "#fffbf0" });
        addNotification("تمت الإضافة", "تمت إضافة باقة الجواهر بنجاح", "success");
      }
    }
  };


  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending": return lang === 'ar' ? "قيد الانتظار" : "Pending";
      case "processing": return lang === 'ar' ? "قيد التنفيذ" : "Processing";
      case "done": return lang === 'ar' ? "تم الاكتمل" : "Completed";
      case "rejected": return lang === 'ar' ? "مرفوض" : "Rejected";
      default: return status;
    }
  };
  
  const [activeTab, setActiveTab] = useState<"orders" | "games" | "content" | "complaints" | "settings" | "coupons" | "stories" | "users" | "finance" | "gems" | "monthly">("orders");
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Post states
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [imageInputs, setImageInputs] = useState<string[]>([]);
  const [postActionLink, setPostActionLink] = useState("");
  const [storyCaption, setStoryCaption] = useState("");
  const [storyMedia, setStoryMedia] = useState<string | null>(null);
  const [storyType, setStoryType] = useState<"image" | "video">("image");
  const [hasStoryAction, setHasStoryAction] = useState(false);
  const [storyActionLabel, setStoryActionLabel] = useState("");
  const [storyActionLink, setStoryActionLink] = useState("");

  // Manual Notification state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"success" | "info" | "warning" | "error">("info");
  
  // Modals/Chats
  const [activeAdminChat, setActiveAdminChat] = useState<{ id: string, name: string, postId?: string } | null>(null);
  const [selectedComplaintImage, setSelectedComplaintImage] = useState<string | null>(null);
  const [selectedOrderScreenshot, setSelectedOrderScreenshot] = useState<string | null>(null);

  // CRM States
  const [crmRatingFilter, setCrmRatingFilter] = useState("ALL");
  const [crmSearchTerm, setCrmSearchTerm] = useState("");

  // Orders States
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [orderUpdateNote, setOrderUpdateNote] = useState("");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Games states
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [addingGame, setAddingGame] = useState(false);
  const [newGameForm, setNewGameForm] = useState({
    id: "", name: "", nameAr: "", cat: "MOBILE", category: "mobile", desc: "", descAr: "", color: "bg-[#ff5e00]", image: "", tags: "",
    chargingMethod: "Vodafone Cash / InstaPay",
    deliveryTime: "10 - 30 دقيقة",
    chargingInfo: [] as string[],
    discount: 0,
    noPackagesMessage: "",
    tutorialVideoUrl: "",
    badge: { text: "", color: "bg-red-500", icon: "Flame" } as { text: string; color: string; icon?: string },
    statements: [] as string[]
  });
  const [packagesForm, setPackagesForm] = useState<any[]>([]);
  const [fieldsForm, setFieldsForm] = useState<any[]>([]);
  
  // Sub-states for nested items within Game Form
  const [editingPkgIdx, setEditingPkgIdx] = useState<number | null>(null);
  const [newPkgInGame, setNewPkgInGame] = useState({ name: "", nameAr: "", price: "", image: "", popular: false });
  const [newFieldInGame, setNewFieldInGame] = useState({ key: "", label: "", placeholder: "", required: true });

  const pendingPosts = posts.filter(p => p.status === "pending");

  const handleRemoveCoupon = (id: string) => {
    if (confirm(lang === 'ar' ? "تأكيد حذف الكود؟" : "Confirm deletion?")) {
      removeCoupon(id);
    }
  };

  const filteredCrmUsers = crmUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(crmSearchTerm.toLowerCase()) || 
                          (u.contact && u.contact.includes(crmSearchTerm));
    const matchesRating = crmRatingFilter === "ALL" || u.rating === crmRatingFilter;
    return matchesSearch && matchesRating;
  });

  const handleLogin = () => {
    if (verifyDevPin(pinInput)) {
      setPinInput("");
      setErrorMsg("");
    } else {
      setErrorMsg(lang === 'ar' ? "الرمز السري غير صحيح" : "Incorrect PIN");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (imageInputs.length >= 3) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageInputs([...imageInputs, ev.target.result as string]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImageInputs(imageInputs.filter((_, i) => i !== index));
  };

  const handleDevPost = () => {
    if (!titleInput.trim() || !descInput.trim()) return;
    publishDevPost({
      title: titleInput,
      description: descInput,
      images: imageInputs.length > 0 ? imageInputs : undefined,
      actionLink: postActionLink.trim() || undefined
    });
    setTitleInput("");
    setDescInput("");
    setImageInputs([]);
    setPostActionLink("");
  };

  const openGameEdit = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    setNewGameForm({
      id: game.id,
      name: game.name,
      nameAr: game.nameAr || "",
      cat: game.cat,
      category: game.category,
      desc: game.desc,
      descAr: game.descAr || "",
      color: game.color,
      image: game.image,
      tags: game.tags.join(","),
      chargingMethod: game.fieldConfig?.chargingMethod || "Vodafone Cash / InstaPay",
      deliveryTime: game.fieldConfig?.deliveryTime || "10 - 30 دقيقة",
      chargingInfo: game.fieldConfig?.chargingInfo || [],
      discount: game.discount || 0,
      noPackagesMessage: game.noPackagesMessage || "",
      tutorialVideoUrl: game.tutorialVideoUrl || "",
      badge: game.badge || { text: "", color: "bg-red-500", icon: "Flame" },
      statements: game.statements || []
    });
    setPackagesForm(game.packages || []);
    setFieldsForm(game.fieldConfig?.fields || []);
    setEditingGameId(gameId);
    setAddingGame(false);
  };

  const openAddGame = () => {
    setNewGameForm({
      id: "game-" + Math.floor(Math.random() * 10000),
      name: "",
      nameAr: "",
      cat: "MOBILE",
      category: "mobile",
      desc: "",
      descAr: "",
      color: "bg-[#ff5e00]",
      image: "",
      tags: "",
      chargingMethod: "Vodafone Cash / InstaPay",
      deliveryTime: "10 - 30 دقيقة",
      chargingInfo: [],
      discount: 0,
      noPackagesMessage: "",
      tutorialVideoUrl: "",
      badge: { text: "", color: "bg-red-500", icon: "Flame" } as { text: string; color: string; icon?: string },
      statements: []
    });
    setPackagesForm([]);
    setFieldsForm([{ key: "playerId", label: "Player ID", placeholder: "أدخل ID اللاعب", required: true }]);
    setEditingGameId(null);
    setAddingGame(true);
  };

  const saveGame = () => {
    if (!newGameForm.name || !newGameForm.image) return;
    const isNew = addingGame;
    const finalData = {
      ...newGameForm,
      tags: newGameForm.tags.split(",").map(t => t.trim()).filter(t => t),
      packages: packagesForm,
      fieldConfig: {
        fields: fieldsForm,
        chargingInfo: newGameForm.chargingInfo,
        chargingMethod: newGameForm.chargingMethod,
        deliveryTime: newGameForm.deliveryTime
      }
    };

    if (isNew) {
      // Ensure the generated ID is unique by checking if it already exists
      let finalId = finalData.id || "game-" + Math.floor(Math.random() * 10000);
      if (games.some(g => g.id === finalId)) {
        finalId = finalId + "-" + Math.floor(Math.random() * 1000);
      }
      addGame({ ...finalData, id: finalId } as any);
      setAddingGame(false);
    } else {
      updateGame(editingGameId!, finalData as any);
      setEditingGameId(null);
    }
  };

  if (!isAuthenticatedDev) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--c-bg)] text-[var(--c-ink)]">
        <GlobalStyles />
        <div className="absolute top-6 left-6">
          <Link to="/" className="flex items-center gap-2 font-black uppercase text-sm hover:text-[var(--c-orange)] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Store
          </Link>
        </div>
        <div className="border-4 border-[var(--c-ink)] bg-white p-8 max-w-lg w-full shadow-[12px_12px_0px_var(--c-ink)]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-center gap-3 mb-8 pb-8 border-b-4 border-black/10">
            <ShieldAlert className="w-12 h-12 text-[var(--c-orange)]" />
            <div>
              <h3 className="text-3xl font-black uppercase leading-none">AL LORD ADMIN</h3>
              <p className="text-xs font-bold mt-1 opacity-50">Sudo Privileges Required</p>
            </div>
          </div>
          <p className="text-sm font-bold opacity-70 mb-4 text-center">{t("Enter security PIN to access the dashboard.", "أدخل رمز الأمان للوصول للوحة التحكم.")}</p>
          <div className="flex gap-2 relative mb-2">
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <KeyRound className="w-5 h-5 text-black/50" />
            </div>
            <input 
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••••"
              className="flex-1 w-full border-4 border-black pl-12 pr-4 py-4 text-xl font-black tracking-[0.5em] focus:outline-none focus:border-[var(--c-orange)] transition-colors"
            />
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-[var(--c-ink)] text-white py-4 font-black text-lg uppercase hover:bg-[var(--c-lime)] hover:text-black border-4 border-[var(--c-ink)] transition-colors shadow-[4px_4px_0px_#ccff00]"
          >
            {t("Access System", "تشغيل النظام")}
          </button>
          {errorMsg && <p className="text-red-500 font-black text-xs uppercase mt-4 text-center bg-red-100 p-2 border-2 border-red-500">{errorMsg}</p>}
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        const filteredOrders = orders
          .filter(o => (orderStatusFilter === "ALL" || o.status === orderStatusFilter))
          .filter(o => o.id.includes(orderSearchTerm) || o.userName.toLowerCase().includes(orderSearchTerm.toLowerCase()) || o.gameName.toLowerCase().includes(orderSearchTerm.toLowerCase()));

        return (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <SectionHeader 
              icon={ShoppingBag} 
              title={t("Orders Management", "إدارة الطلبات")} 
              subtitle={`${filteredOrders.length} ${t("total orders found", "طلب تم العثور عليه")}`}
              lang={lang}
              action={
                <div className={`flex flex-col sm:flex-row gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <div className="relative flex-1">
                    <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 opacity-50`} />
                    <input 
                      type="text" 
                      placeholder={t("Search Orders...", "بحث في الطلبات...")} 
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-4 border-black font-bold text-sm bg-white focus:shadow-[4px_4px_0px_#000] transition-all`}
                    />
                  </div>
                  <select 
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="px-4 py-3 border-4 border-black font-black uppercase text-[10px] bg-white cursor-pointer hover:bg-black hover:text-white transition-colors"
                  >
                    <option value="ALL">{t("All Statuses", "كل الحالات")}</option>
                    <option value="pending">{t("Pending", "قيد الانتظار")}</option>
                    <option value="processing">{t("Processing", "قيد التنفيذ")}</option>
                    <option value="done">{t("Completed", "تم الاكتمال")}</option>
                    <option value="rejected">{t("Rejected", "مرفوض")}</option>
                  </select>
                  <button 
                    onClick={() => {
                      const pendings = orders.filter(o => o.status === 'pending');
                      if (pendings.length === 0) return alert(lang==='ar'?'لا توجد طلبات معلقة':'No pending orders');
                      if(confirm(lang==='ar' ? `تنفيذ ${pendings.length} طلبات معلقة؟` : `Process ${pendings.length} pending orders?`)) {
                        pendings.forEach(o => updateOrderStatus(o.id, 'done', t('Bulk Processed', 'تم التنفيذ بالجملة')));
                      }
                    }}
                    className="px-4 py-3 bg-[var(--c-lime)] border-4 border-black font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                  >
                    {t("Bulk Complete", "إنهاء المعلق")}
                  </button>
                </div>
              }
            />

            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white border-4 border-black shadow-[10px_10px_0px_#000] overflow-hidden group hover:shadow-[15px_15px_0px_rgba(0,0,0,1)] transition-all">
                  <div className={`flex flex-col md:flex-row ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Left Panel: ID & Time */}
                    {/* Left Panel: ID & Time */}
                    <div className="md:w-60 p-6 bg-black text-white flex flex-col justify-between border-b-4 md:border-b-0 md:border-r-4 border-black shrink-0">
                        <div>
                           <div className="flex justify-between items-start mb-1">
                              <div className="text-[10px] font-black uppercase text-[var(--c-lime)] tracking-widest">{t("Transaction ID", "رقم العملية")}</div>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 border-2 border-white/20 ${
                                order.status === 'done' ? 'bg-green-500' : 
                                order.status === 'rejected' ? 'bg-red-500' : 
                                order.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500 text-black'
                              }`}>
                                {t(order.status, getStatusArabic(order.status))}
                              </span>
                           </div>
                           <div className="font-black text-lg break-all">#{order.id.substring(0, 12)}</div>
                        </div>
                       <div className="mt-6">
                          <div className={`flex items-center gap-2 text-xs font-bold opacity-60 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                             <Calendar className="w-4 h-4" />
                             {new Date(order.timestamp).toLocaleString()}
                          </div>
                          <div className={`mt-3 flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                             <span className="text-[9px] font-black uppercase bg-[var(--c-orange)] text-black px-2 py-1 border-2 border-white/20">
                                {order.paymentMethod}
                             </span>
                             <span className="text-[9px] font-black uppercase bg-white text-black px-2 py-1 border-2 border-white/20">
                                {order.senderInfo || "No Info"}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Middle Panel: Product & Customer */}
                    <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className={lang === 'ar' ? 'text-right' : ''}>
                          <div className={`flex items-center gap-3 mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                             <div className="w-12 h-12 bg-[var(--c-lime)] border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center font-black text-xl">
                                {order.gameName.charAt(0)}
                             </div>
                             <div>
                                <h4 className="font-black uppercase text-xl leading-tight">{order.gameName}</h4>
                                <p className="text-sm font-bold opacity-60">{order.packageName} x{order.quantity}</p>
                             </div>
                          </div>
                          <div className="space-y-2 bg-black/5 p-4 border-2 border-black border-dashed">
                             {Object.entries(order.fields).map(([k, v]) => (
                               <div key={k} className="flex gap-2">
                                 <span className="font-black uppercase opacity-40">{k}:</span>
                                 <span className="font-black text-black select-all">{String(v)}</span>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col justify-between">
                          <div className={`flex items-center gap-4 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_#000] ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                             <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black font-black uppercase">
                                {order.userName.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                <p className="font-black text-sm uppercase truncate">{order.userName}</p>
                                <p className="text-[10px] font-bold opacity-60 truncate">{order.userContact}</p>
                             </div>
                          </div>
                          <div className={`mt-6 flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                             <div className={lang === 'ar' ? 'text-right' : ''}>
                                <p className="text-[10px] font-black uppercase opacity-50">{t("Total Price", "السعر الإجمالي")}</p>
                                <p className="text-3xl font-black text-[var(--c-orange)]">{order.totalPrice} {t("EGP", "ج.م")}</p>
                             </div>
                             {order.screenshot && (
                                <button onClick={() => setSelectedOrderScreenshot(order.screenshot!)} className="w-16 h-16 border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden relative group">
                                   <img src={order.screenshot} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Eye className="w-6 h-6 text-white" />
                                   </div>
                                </button>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Right Panel: Actions */}
                    <div className={`md:w-56 p-6 flex flex-col justify-center gap-3 bg-gray-50 md:border-l-4 border-black ${lang === 'ar' ? 'md:border-r-4 md:border-l-0 text-right' : ''}`}>
                       <div className="flex flex-col gap-2">
                          <div className="text-[10px] font-black uppercase opacity-50 mb-1">{t("Status Control", "التحكم بالحالة")}</div>
                          {editingOrderId === order.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={orderUpdateNote}
                                onChange={(e) => setOrderUpdateNote(e.target.value)}
                                placeholder={t("Internal Note...", "ملاحظة داخلية...")}
                                className="w-full text-[10px] p-2 border border-black focus:outline-none"
                              />
                              <div className="grid grid-cols-2 gap-1">
                                <button onClick={() => { 
                                  updateOrderStatus(order.id, 'done', orderUpdateNote); 
                                  if (order.gameId === "GEMS_TOPUP" && order.fields?.gems_amount) {
                                    addGemsToUser(order.fields.user_id || order.userId, parseInt(order.fields.gems_amount), `شحن جواهر من الطلب ${order.id}`);
                                  }
                                  setEditingOrderId(null); 
                                  setOrderUpdateNote(""); 
                                }} className="bg-green-500 text-white text-[8px] font-black py-1.5 uppercase hover:bg-black transition-colors">{t("Accept", "قبول")}</button>
                                <button onClick={() => { updateOrderStatus(order.id, 'rejected', orderUpdateNote); setEditingOrderId(null); setOrderUpdateNote(""); }} className="bg-red-500 text-white text-[8px] font-black py-1.5 uppercase hover:bg-black transition-colors">{t("Reject", "رفض")}</button>
                                <button onClick={() => { updateOrderStatus(order.id, 'processing', orderUpdateNote); setEditingOrderId(null); setOrderUpdateNote(""); }} className="bg-blue-500 text-white text-[8px] font-black py-1.5 uppercase hover:bg-black transition-colors col-span-2">{t("Process", "تنفيذ")}</button>
                                <button onClick={() => setEditingOrderId(null)} className="bg-white border border-black text-[8px] font-black py-1.5 uppercase hover:bg-black/5 transition-colors col-span-2">{t("Cancel", "إلغاء")}</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <button 
                                onClick={() => setEditingOrderId(order.id)}
                                className="w-full bg-black text-white px-3 py-2 text-[10px] font-black uppercase hover:bg-[var(--c-orange)] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Edit className="w-3 h-3" /> {t("Manage", "إدارة")}
                              </button>
                              {order.status !== 'pending' && (
                                 <button onClick={() => { if(confirm(t("Delete order record?", "حذف سجل الطلب؟"))) deleteOrder(order.id) }} className="text-[10px] font-black text-red-600 hover:underline uppercase text-center">{t("Delete Record", "حذف السجل")}</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="p-12 text-center border-4 border-black border-dashed opacity-30 font-black uppercase">
                    {t("No orders found", "لا يوجد طلبات حالياً")}
                  </div>
                )}
              </div>
            </div>
          );
      case "games":
        if (addingGame || editingGameId) {
          return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-4 mb-8 border-b-8 border-black pb-6">
                <button 
                  onClick={() => { setAddingGame(false); setEditingGameId(null); }}
                  className="w-12 h-12 bg-white flex items-center justify-center border-4 border-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                   <h3 className="text-3xl font-black uppercase leading-none">{addingGame ? t("Register New Product", "إضافة منتج جديد") : t("Refine Product Details", "تعديل بيانات المنتج")}</h3>
                   <p className="text-sm font-bold opacity-50 uppercase tracking-widest mt-1">{t("Master Database Entry", "إدخال قاعدة البيانات الرئيسية")}</p>
                </div>
              </div>

              <div className="border-8 border-black p-8 bg-[#f0f0f0] shadow-[12px_12px_0px_#000] relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Column 1: Identity & Visuals */}
                    <div className="space-y-8">
                       <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                          <h4 className="text-sm font-black uppercase mb-6 flex items-center gap-2"> <LayoutGrid className="w-4 h-4" /> {t("Basic Identity", "الهوية البصرية والأساسية")}</h4>
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Product ID (Slug)", "معرف المنتج (Slug)")}</label>
                                <input value={newGameForm.id} onChange={e => setNewGameForm({...newGameForm, id: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm bg-gray-50 focus:bg-white outline-none" placeholder="pubg-mobile" />
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Name (EN)", "الاسم (EN)")}</label>
                                   <input value={newGameForm.name} onChange={e => setNewGameForm({...newGameForm, name: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm" />
                                </div>
                                <div>
                                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Name (AR)", "الاسم (AR)")}</label>
                                   <input value={newGameForm.nameAr} onChange={e => setNewGameForm({...newGameForm, nameAr: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm text-right" dir="rtl" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Cover Image URL", "رابط صورة الغلاف")}</label>
                                <input value={newGameForm.image} onChange={e => setNewGameForm({...newGameForm, image: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm" placeholder="https://..." />
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Platform", "المنصة")}</label>
                                   <select value={newGameForm.category} onChange={e => setNewGameForm({...newGameForm, category: e.target.value})} className="w-full border-4 border-black p-3 font-black text-xs bg-white uppercase">
                                      <option value="mobile">Mobile</option>
                                      <option value="pc">PC / Console</option>
                                      <option value="cards">Gift Cards</option>
                                   </select>
                                </div>
                                <div>
                                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Theme Color", "اللون المميز")}</label>
                                   <select value={newGameForm.color} onChange={e => setNewGameForm({...newGameForm, color: e.target.value})} className="w-full border-4 border-black p-3 font-black text-xs bg-white uppercase">
                                      <option value="bg-[#ff5e00]">Orange</option>
                                      <option value="bg-[#b084ff]">Purple</option>
                                      <option value="bg-[#ccff00]">Lime</option>
                                      <option value="bg-[#002f6c]">Dark Blue</option>
                                      <option value="bg-red-600">Blood Red</option>
                                   </select>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                          <h4 className="text-sm font-black uppercase mb-6 flex items-center gap-2"> <Info className="w-4 h-4" /> {t("Marketing & Info", "التسويق والبيانات")}</h4>
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Search Tags", "الكلمات الدلالية")}</label>
                                <input value={newGameForm.tags} onChange={e => setNewGameForm({...newGameForm, tags: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-xs" placeholder="UC, Mobile, Fast" />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Description (AR)", "الوصف (AR)")}</label>
                                <textarea value={newGameForm.descAr} onChange={e => setNewGameForm({...newGameForm, descAr: e.target.value})} rows={2} className="w-full border-4 border-black p-3 font-bold text-xs text-right" dir="rtl" />
                             </div>
                             <div className="p-4 border-4 border-black bg-black text-white">
                                <label className="block text-[10px] font-black uppercase mb-2 text-[var(--c-lime)]">{t("Promo Badge", "بادج ترويجي")}</label>
                                <div className="flex gap-2">
                                   <input value={newGameForm.badge?.text} onChange={e => setNewGameForm({...newGameForm, badge: {...newGameForm.badge!, text: e.target.value}})} className="flex-1 bg-white/10 border-2 border-white/20 p-2 text-white font-bold text-xs outline-none focus:border-[var(--c-lime)]" placeholder="HOT" />
                                   <select value={newGameForm.badge?.color} onChange={e => setNewGameForm({...newGameForm, badge: {...newGameForm.badge!, color: e.target.value}})} className="bg-white/10 border-2 border-white/20 p-2 text-white font-black text-[10px] uppercase">
                                      <option value="bg-red-600">Red</option>
                                      <option value="bg-blue-600">Blue</option>
                                      <option value="bg-yellow-500">Gold</option>
                                   </select>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Column 2: Package Management */}
                    <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col">
                       <h4 className="text-sm font-black uppercase mb-6 flex items-center gap-2"> <Package className="w-4 h-4" /> {t("Package Management", "إدارة الباقات")}</h4>
                       
                       <div className="bg-gray-100 p-4 border-4 border-black mb-6">
                          <p className="text-[10px] font-black uppercase mb-4 opacity-50">{editingPkgIdx !== null ? t("Edit Package", "تعديل باقة") : t("Quick Add Package", "إضافة باقة سريعة")}</p>
                          <div className="space-y-3">
                             <div className="flex gap-2">
                                <input value={newPkgInGame.name} onChange={e => setNewPkgInGame({...newPkgInGame, name: e.target.value})} placeholder="Name (EN)" className="flex-1 border-2 border-black p-2 text-xs font-bold" />
                                <input value={newPkgInGame.nameAr} onChange={e => setNewPkgInGame({...newPkgInGame, nameAr: e.target.value})} placeholder="الاسم (AR)" className="flex-1 border-2 border-black p-2 text-xs font-bold text-right" dir="rtl" />
                             </div>
                             <div className="flex gap-2">
                                <input value={newPkgInGame.price} onChange={e => setNewPkgInGame({...newPkgInGame, price: e.target.value})} placeholder="Price" className="flex-1 border-2 border-black p-2 text-xs font-black" />
                                <input value={newPkgInGame.image} onChange={e => setNewPkgInGame({...newPkgInGame, image: e.target.value})} placeholder="Img URL (Opt)" className="flex-1 border-2 border-black p-2 text-xs font-bold" />
                             </div>
                             <button 
                                onClick={() => {
                                   if(!newPkgInGame.name || !newPkgInGame.price) return;
                                   if(editingPkgIdx !== null) {
                                      const updated = [...packagesForm];
                                      updated[editingPkgIdx] = { ...newPkgInGame, id: updated[editingPkgIdx].id };
                                      setPackagesForm(updated);
                                      setEditingPkgIdx(null);
                                   } else {
                                      setPackagesForm([...packagesForm, { ...newPkgInGame, id: "pkg-" + Date.now() }]);
                                   }
                                   setNewPkgInGame({ name: "", nameAr: "", price: "", image: "", popular: false });
                                }}
                                className="w-full bg-black text-[var(--c-lime)] py-2 font-black uppercase text-xs border-2 border-black hover:bg-[var(--c-lime)] hover:text-black transition-all"
                             >
                                {editingPkgIdx !== null ? t("Update Package", "تحديث الباقة") : t("Confirm & Add", "تأكيد وإضافة")}
                             </button>
                             {editingPkgIdx !== null && <button onClick={() => { setEditingPkgIdx(null); setNewPkgInGame({ name: "", nameAr: "", price: "", image: "", popular: false }); }} className="w-full text-[10px] font-black uppercase hover:underline">Cancel</button>}
                          </div>
                       </div>

                       <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                          {packagesForm.map((pkg, idx) => (
                             <div key={pkg.id} className="flex items-center justify-between p-3 border-2 border-black bg-white group hover:bg-black/5 transition-colors">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-[10px]">#{idx+1}</div>
                                   <div>
                                      <p className="font-black text-xs uppercase">{pkg.name}</p>
                                      <p className="text-[10px] font-black text-[var(--c-orange)]">{pkg.price} {settings.currencySymbol}</p>
                                   </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => { setEditingPkgIdx(idx); setNewPkgInGame(pkg); }} className="p-1.5 bg-[var(--c-lime)] border-2 border-black hover:bg-black hover:text-white"><Edit3 className="w-3 h-3" /></button>
                                   <button onClick={() => setPackagesForm(packagesForm.filter((_, i) => i !== idx))} className="p-1.5 bg-red-100 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white"><Trash2 className="w-3 h-3" /></button>
                                </div>
                             </div>
                          ))}
                          {packagesForm.length === 0 && <p className="text-center py-10 text-[10px] font-black uppercase opacity-20 border-2 border-black border-dashed">No packages added</p>}
                       </div>
                    </div>

                    {/* Column 3: Field Config & Instructions */}
                    <div className="space-y-8">
                       <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                          <h4 className="text-sm font-black uppercase mb-6 flex items-center gap-2"> <ClipboardList className="w-4 h-4" /> {t("Order Fields", "حقول الطلب")}</h4>
                          <div className="bg-black/5 p-4 border-2 border-black border-dashed mb-4">
                             <div className="grid grid-cols-2 gap-2 mb-2">
                                <input value={newFieldInGame.key} onChange={e => setNewFieldInGame({...newFieldInGame, key: e.target.value})} placeholder="Key (e.g. playerId)" className="border-2 border-black p-2 text-[10px] font-bold" />
                                <input value={newFieldInGame.label} onChange={e => setNewFieldInGame({...newFieldInGame, label: e.target.value})} placeholder="Label (AR)" className="border-2 border-black p-2 text-[10px] font-bold text-right" dir="rtl" />
                             </div>
                             <button 
                                onClick={() => {
                                   if(!newFieldInGame.key || !newFieldInGame.label) return;
                                   setFieldsForm([...fieldsForm, { ...newFieldInGame }]);
                                   setNewFieldInGame({ key: "", label: "", placeholder: "", required: true });
                                }}
                                className="w-full bg-white border-2 border-black py-2 font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
                             >
                                {t("Add Field", "إضافة حقل")}
                             </button>
                          </div>
                          <div className="space-y-2">
                             {fieldsForm.map((f, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-white border-2 border-black">
                                   <span className="text-[10px] font-black uppercase">{f.key} <span className="opacity-40 ml-2">({f.label})</span></span>
                                   <button onClick={() => setFieldsForm(fieldsForm.filter((_, i) => i !== idx))} className="text-red-600 hover:scale-110 transition-transform"><Trash2 className="w-3 h-3" /></button>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                          <h4 className="text-sm font-black uppercase mb-6 flex items-center gap-2"> <Activity className="w-4 h-4" /> {t("Delivery Specs", "مواصفات التسليم")}</h4>
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Delivery Time", "مدة التسليم")}</label>
                                <input value={newGameForm.deliveryTime} onChange={e => setNewGameForm({...newGameForm, deliveryTime: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-xs" placeholder="5 - 15 دقيقة" />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Charging Method", "طريقة الشحن")}</label>
                                <input value={newGameForm.chargingMethod} onChange={e => setNewGameForm({...newGameForm, chargingMethod: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-xs" placeholder="Vodafone Cash / InstaPay" />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Tutorial Video URL", "رابط فيديو الشرح")}</label>
                                <input value={newGameForm.tutorialVideoUrl} onChange={e => setNewGameForm({...newGameForm, tutorialVideoUrl: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-xs" placeholder="https://..." />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-10 pt-10 border-t-8 border-black flex flex-col md:flex-row gap-4">
                    <button 
                       onClick={saveGame}
                       className="flex-[2] bg-black text-[var(--c-lime)] py-6 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-[var(--c-lime)] hover:text-black transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
                    >
                       <Check className="w-8 h-8" /> {addingGame ? t("Publish Product to Store", "نشر المنتج في المتجر") : t("Sync Changes to Live", "تحديث البيانات المباشرة")}
                    </button>
                    <button 
                       onClick={() => { setAddingGame(false); setEditingGameId(null); }}
                       className="flex-1 bg-white text-black py-6 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-red-600 hover:text-white transition-all active:translate-y-1 active:shadow-none"
                    >
                       {t("Discard", "إلغاء الأمر")}
                    </button>
                 </div>
              </div>
            </div>
          );
        }

        const filteredGamesList = games.filter(g => 
          g.name.toLowerCase().includes(gameSearchTerm.toLowerCase()) || 
          g.nameAr?.toLowerCase().includes(gameSearchTerm.toLowerCase()) ||
          g.category.toLowerCase().includes(gameSearchTerm.toLowerCase())
        );

        return (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 border-b-8 border-black pb-8 gap-6 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`flex flex-col gap-1 ${lang === 'ar' ? 'text-right' : ''}`}>
                <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                   <Gamepad2 className="w-10 h-10 text-[var(--c-purple)]" />
                   {t("Games Database", "قاعدة بيانات الألعاب")}
                </h2>
                <p className="text-xs font-black uppercase opacity-40">{games.length} {t("active products", "منتج نشط")}</p>
              </div>

              <div className={`flex flex-col sm:flex-row gap-4 w-full lg:w-auto ${lang === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                <div className="relative flex-1">
                  <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 opacity-50`} />
                  <input 
                    type="text" 
                    placeholder={t("Search games...", "بحث في الألعاب...")} 
                    className={`w-full lg:w-64 ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-4 border-black font-bold text-sm bg-white focus:bg-[var(--c-lime)]/5 outline-none shadow-[4px_4px_0px_#000]`}
                    value={gameSearchTerm}
                    onChange={(e) => setGameSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={adminResetGames} className="flex-1 lg:flex-none px-6 py-3 bg-black text-white font-black uppercase text-xs hover:bg-red-600 transition-colors border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                    {t("Reset", "تصفير")}
                  </button>
                  <button onClick={openAddGame} className="flex-1 lg:flex-none px-6 py-3 bg-[var(--c-lime)] border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-[var(--c-lime)] transition-colors shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none">
                    <Plus className="w-5 h-5" /> {t("Add Product", "إضافة")}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {filteredGamesList.map(game => (
                  <div key={game.id} className="border-4 border-black p-5 flex flex-col justify-between shadow-[8px_8px_0px_#000] relative bg-white hover:-translate-y-2 transition-transform group">
                     <div>
                       <div className="relative aspect-video border-4 border-black mb-4 overflow-hidden">
                          <img src={game.image} alt={game.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          <div className="absolute top-2 right-2 bg-black text-white text-[8px] font-black px-2 py-1 border border-white/20 uppercase">
                             {game.category}
                          </div>
                       </div>
                       <h3 className="font-black text-xl uppercase leading-tight mb-2 truncate">{game.name}</h3>
                       <div className="flex items-center justify-between border-t-2 border-black/5 pt-2">
                           <p className="text-[10px] font-black uppercase opacity-40">{game.packages?.length || 0} {t("Packages", "باقات")}</p>
                           <p className="text-[10px] font-black text-red-600">{game.fieldConfig?.deliveryTime}</p>
                       </div>
                     </div>
                     <div className="flex gap-2 mt-6">
                        <button onClick={() => openGameEdit(game.id)} className="flex-1 bg-black text-white text-[10px] font-black uppercase py-3 hover:bg-[var(--c-orange)] hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Edit3 className="w-3 h-3" /> {t("Edit", "تعديل")}
                        </button>
                        <button onClick={() => { if(confirm(t("Delete this game?", "حذف اللعبة؟"))) removeGame(game.id) }} className="w-12 bg-red-100 flex items-center justify-center border-4 border-black text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                ))}
                {filteredGamesList.length === 0 && (
                   <div className="col-span-full py-32 border-8 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                      <Gamepad2 className="w-20 h-20 mb-4" />
                      <p className="font-black uppercase text-2xl tracking-tighter">No games found matching your search</p>
                   </div>
                )}
            </div>
          </div>
        );
      case "content":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Share2} 
                  title={t("Community Content", "محتوى المجتمع")} 
                  subtitle={t("Moderate user posts and publish administrative announcements", "إدارة منشورات المستخدمين ونشر الإعلانات الإدارية")}
                  lang={lang}
                />

               <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  {/* Moderation */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-black uppercase flex items-center gap-2">
                         <Clock className="w-5 h-5 text-[var(--c-orange)]" />
                         {t("Pending for Review", "بانتظار المراجعة")}
                       </h3>
                       <span className="bg-black text-white text-[10px] px-3 py-1 font-black rounded-full">
                         {pendingPosts.length} {t("Posts", "منشور")}
                       </span>
                    </div>
                    
                    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                      {pendingPosts.length === 0 ? (
                        <div className="py-20 border-4 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                           <CheckCircle2 className="w-12 h-12 mb-2" />
                           <p className="font-black uppercase text-sm">{t("No pending requests", "لا توجد طلبات معلقة")}</p>
                        </div>
                      ) : (
                        pendingPosts.map(post => (
                          <AdminCard key={post.id} title={post.title} icon={User} lang={lang}>
                             <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                   <div className="w-6 h-6 rounded-full bg-[var(--c-purple)] border-2 border-black"></div>
                                   <span className="text-[10px] font-black uppercase opacity-60">{post.authorName}</span>
                                </div>
                                <p className="text-xs font-bold leading-relaxed">{post.description}</p>
                                
                                {post.images && post.images.length > 0 && (
                                  <div className="grid grid-cols-3 gap-2">
                                    {post.images.map((img, idx) => (
                                      <img key={idx} src={img} className="aspect-square object-cover border-2 border-black shadow-[2px_2px_0px_#000] hover:scale-105 transition-transform" />
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex gap-2 pt-4 border-t-2 border-black/5">
                                  <button onClick={() => approvePost(post.id)} className="flex-1 bg-[var(--c-lime)] border-4 border-black py-3 font-black text-xs uppercase hover:bg-black hover:text-[var(--c-lime)] transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"> 
                                     <Check className="w-4 h-4 inline mr-2" /> {t("Approve", "قبول")} 
                                  </button>
                                  <button onClick={() => rejectPost(post.id)} className="flex-1 bg-red-100 text-red-600 border-4 border-black py-3 font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"> 
                                     <X className="w-4 h-4 inline mr-2" /> {t("Reject", "رفض")} 
                                  </button>
                                </div>
                             </div>
                          </AdminCard>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Direct Publishing */}
                  <AdminCard title={t("Admin Announcement", "النشر المباشر")} icon={Megaphone} lang={lang} color="bg-[var(--c-lime)]">
                    <div className="space-y-6 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-60">{t("Post Title", "العنوان")}</label>
                        <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="w-full border-4 border-black p-3 text-sm font-black focus:bg-white transition-colors outline-none" placeholder={t("e.g. New Seasonal Offer", "مثال: عرض الموسم الجديد")} />
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-60">{t("Content", "المحتوى")}</label>
                        <textarea value={descInput} onChange={(e) => setDescInput(e.target.value)} rows={4} className="w-full border-4 border-black p-3 text-sm font-bold resize-none focus:bg-white transition-colors outline-none" placeholder={t("Describe the announcement...", "اكتب تفاصيل الإعلان...")} />
                      </div>
                      
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-2 opacity-60">{t("Action Link & Quick Select", "رابط الإجراء واختصار سريع")}</label>
                        <input value={postActionLink} onChange={(e) => setPostActionLink(e.target.value)} placeholder="e.g. /game/valorant-points" className="w-full border-4 border-black p-3 text-xs font-black mb-4 focus:bg-white outline-none" />
                        
                        <div className={`flex flex-wrap gap-2 ${lang === 'ar' ? 'justify-end' : ''}`}>
                           <button onClick={() => setPostActionLink("/community")} className="text-[9px] font-black uppercase bg-black text-white px-3 py-1.5 hover:bg-white hover:text-black border-2 border-black transition-all">Community</button>
                           <button onClick={() => setPostActionLink("/profile")} className="text-[9px] font-black uppercase bg-black text-white px-3 py-1.5 hover:bg-white hover:text-black border-2 border-black transition-all">Profile</button>
                           <button onClick={() => setPostActionLink(`https://wa.me/${settings.whatsappNumber}`)} className="text-[9px] font-black uppercase bg-[#25D366] text-white px-3 py-1.5 border-2 border-black hover:scale-105 transition-all">WhatsApp</button>
                           
                           <div className="relative group">
                             <button className="text-[9px] font-black uppercase bg-[var(--c-purple)] text-white px-3 py-1.5 border-2 border-black">Select Game ↓</button>
                             <div className="absolute top-full left-0 mt-2 bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-1 flex-col gap-1 hidden group-hover:flex z-50 min-w-[180px] max-h-48 overflow-y-auto">
                                {games.map(g => (
                                  <button key={g.id} onClick={() => setPostActionLink(`/game/${g.id}`)} className="text-left rtl:text-right text-[10px] font-black p-2 hover:bg-black hover:text-[var(--c-lime)] border-b border-black/5 last:border-b-0">{g.name}</button>
                                ))}
                             </div>
                           </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase mb-3 opacity-60">{t("Images (Max 3)", "إضافة صور")}</label>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {imageInputs.map((str, idx) => (
                            <div key={idx} className="relative aspect-square border-4 border-black bg-white group overflow-hidden">
                              <img src={str} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                              <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white border-2 border-black flex items-center justify-center hover:bg-black transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                          ))}
                          {imageInputs.length < 3 && (
                            <label className="flex flex-col items-center justify-center border-4 border-dashed border-black/30 bg-black/5 aspect-square cursor-pointer hover:bg-white transition-all group">
                              <ImagePlus className="w-8 h-8 text-black opacity-30 group-hover:opacity-100 transition-opacity" />
                              <input type="file" onChange={handleImageUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                      </div>

                      <button onClick={handleDevPost} className="w-full bg-black text-[var(--c-lime)] py-5 font-black uppercase text-lg border-4 border-black hover:bg-[var(--c-orange)] hover:text-black transition-all shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none"> 
                         <Send className="w-6 h-6 inline mr-2" /> {t("Publish Now", "نشر المنشور الآن")} 
                      </button>
                    </div>
                  </AdminCard>
               </div>

               {/* Manual Notification Sender */}
               <AdminCard title={t("Send System-Wide Notification", "بث إشعار عام للموقع")} icon={BellRing} lang={lang}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
                     <div className="lg:col-span-2">
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Notification Title", "عنوان الإشعار")}</label>
                        <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder={t("e.g. New Feature!", "مثال: ميزة جديدة!")} className="w-full border-4 border-black p-3 font-black text-sm outline-none focus:bg-[var(--c-lime)]/5 transition-colors" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Type", "النوع")}</label>
                        <select value={notifType} onChange={e => setNotifType(e.target.value as any)} className="w-full border-4 border-black p-3 font-black text-xs uppercase bg-white cursor-pointer">
                           <option value="success">{t("Success", "نجاح")}</option>
                           <option value="info">{t("Info", "معلومات")}</option>
                           <option value="warning">{t("Warning", "تحذير")}</option>
                           <option value="error">{t("Error", "خطأ")}</option>
                        </select>
                     </div>
                     <div className="flex items-end">
                        <button 
                          onClick={() => {
                            if (!notifTitle || !notifMessage) return;
                            addNotification(notifTitle, notifMessage, notifType);
                            setNotifTitle(""); setNotifMessage("");
                            alert(lang === 'ar' ? "تم إرسال الإشعار لجميع المستخدمين!" : "Notification sent to all users!");
                          }}
                          className="w-full bg-yellow-400 text-black border-4 border-black py-3 font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_#000]"
                        >
                           {t("Blast Now 📢", "بث الآن 📢")}
                        </button>
                     </div>
                     <div className="lg:col-span-4">
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Message Content", "محتوى الرسالة")}</label>
                        <textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} rows={2} placeholder={t("Type message...", "اكتب نص الرسالة...")} className="w-full border-4 border-black p-3 font-bold text-xs outline-none focus:bg-[var(--c-lime)]/5 transition-colors" />
                     </div>
                  </div>
               </AdminCard>
            </div>
          );
        case "complaints":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={AlertTriangle} 
                  title={t("User Complaints", "صندوق الشكاوي")} 
                  subtitle={t("Review and resolve reported issues and user feedback", "مراجعة وحل المشاكل المبلغ عنها وملاحظات المستخدمين")}
                  lang={lang}
                />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {complaints.length === 0 ? (
                  <div className="col-span-full py-20 border-4 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                     <CheckCircle2 className="w-16 h-16 mb-4" />
                     <p className="font-black uppercase text-xl">{t("System is clean.", "النظام نظيف.")}</p>
                  </div>
                ) : (
                  complaints.map(complaint => (
                    <AdminCard 
                      key={complaint.id} 
                      title={complaint.userName} 
                      icon={User} 
                      lang={lang}
                      color={complaint.status === 'resolved' ? "bg-gray-100 opacity-50 grayscale" : "bg-white"}
                    >
                      <div className="pt-2 space-y-4">
                        <div className={`p-4 bg-black/5 border-2 border-black border-dashed rounded-lg ${lang === 'ar' ? 'text-right' : ''}`}>
                          <p className="text-xs font-bold leading-relaxed">{complaint.description}</p>
                          <p className="text-[10px] font-black opacity-30 mt-2 uppercase">{complaint.userContact}</p>
                        </div>
                        
                        {complaint.image && (
                          <div className="relative aspect-video border-4 border-black overflow-hidden group cursor-pointer" onClick={() => setSelectedComplaintImage(complaint.image!)}>
                             <img src={complaint.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Maximize2 className="text-white w-8 h-8" />
                             </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${complaint.status === 'resolved' ? 'bg-gray-300' : 'bg-[var(--c-orange)] text-black'}`}>
                             {complaint.status}
                          </span>
                          {complaint.status !== 'resolved' && (
                            <button 
                              onClick={() => resolveComplaint(complaint.id)} 
                              className="bg-[var(--c-lime)] border-4 border-black px-6 py-2 text-xs font-black uppercase hover:bg-black hover:text-[var(--c-lime)] transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                            > 
                              {t("Resolve", "حل الشكوى")} 
                            </button>
                          )}
                        </div>
                      </div>
                    </AdminCard>
                  ))
                )}
              </div>
            </div>
          );
        case "settings":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-10 max-w-4xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Settings} 
                  title={t("Global Site Settings", "إعدادات الموقع العامة")} 
                  subtitle={t("Master control for site configuration, maintenance, and currency", "التحكم الرئيسي في إعدادات الموقع والصيانة والعملة")}
                  lang={lang}
                />
                
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Controls */}
                  <AdminCard title={t("Site Controls", "تحكم الموقع")} icon={LayoutDashboard} lang={lang}>
                    <div className="space-y-6 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Site Name", "اسم الموقع")}</label> 
                        <input value={settings.siteName} onChange={e => updateSettings({ siteName: e.target.value })} className="w-full border-4 border-black p-3 font-bold text-sm bg-white focus:bg-[var(--c-lime)]/5 outline-none transition-all" /> 
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Announcement Banner", "الشريط الإعلاني العلوي")}</label> 
                        <input value={settings.announcementBanner} onChange={e => updateSettings({ announcementBanner: e.target.value })} placeholder="Leave empty to disable" className="w-full border-4 border-black p-3 font-bold text-sm bg-white focus:bg-[var(--c-lime)]/5 outline-none transition-all" /> 
                      </div>
                      <div className={`flex items-center justify-between p-4 border-4 border-black bg-black/5 border-dashed ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className={lang === 'ar' ? 'text-right' : ''}>
                           <p className="text-xs font-black uppercase">{t("Maintenance Mode", "وضع الصيانة")}</p>
                           <p className="text-[10px] font-bold opacity-40 uppercase">{t("Lock the entire site", "قفل الموقع بالكامل")}</p>
                        </div>
                        <button 
                          onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })} 
                          className={`w-14 h-8 border-4 border-black relative transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                        >
                          <div className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${settings.maintenanceMode ? (lang === 'ar' ? 'left-0.5' : 'right-0.5') : (lang === 'ar' ? 'right-0.5' : 'left-0.5')} bg-white`} />
                        </button>
                      </div>
                    </div>
                  </AdminCard>

                  {/* Contact Channels */}
                  <AdminCard title={t("Contact Channels", "قنوات التواصل")} icon={Send} lang={lang}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("WhatsApp", "واتساب")}</label> 
                        <input value={settings.whatsappNumber} onChange={e => updateSettings({ whatsappNumber: e.target.value })} className="w-full border-2 border-black p-2 font-bold text-xs" /> 
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Facebook", "فيسبوك")}</label> 
                        <input value={settings.facebookLink} onChange={e => updateSettings({ facebookLink: e.target.value })} className="w-full border-2 border-black p-2 font-bold text-xs" /> 
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Instagram", "إنستجرام")}</label> 
                        <input value={settings.instagramLink} onChange={e => updateSettings({ instagramLink: e.target.value })} className="w-full border-2 border-black p-2 font-bold text-xs" /> 
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Telegram", "تليجرام")}</label> 
                        <input value={settings.telegramLink} onChange={e => updateSettings({ telegramLink: e.target.value })} className="w-full border-2 border-black p-2 font-bold text-xs" /> 
                      </div>
                    </div>
                  </AdminCard>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Notifications */}
                  <AdminCard title={t("System Features", "مميزات النظام")} icon={Bell} lang={lang}>
                    <div className={`flex items-center justify-between p-5 bg-white border-4 border-black shadow-[6px_6px_0px_#000] ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                       <div className={lang === 'ar' ? 'text-right' : ''}>
                          <p className="font-black text-sm uppercase">{t("Global Notifications", "الإشعارات العامة")}</p>
                          <p className="text-[10px] font-bold opacity-40 uppercase max-w-[200px] leading-tight mt-1">{t("Enable site-wide real-time notification system", "تفعيل نظام الإشعارات الفوري في كامل الموقع")}</p>
                       </div>
                       <button 
                         onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                         className={`w-16 h-10 border-4 border-black relative transition-all ${settings.notificationsEnabled ? 'bg-[var(--c-lime)]' : 'bg-red-500'}`}
                       >
                         <div className={`absolute top-1 w-6 h-6 border-2 border-black transition-all ${settings.notificationsEnabled ? (lang === 'ar' ? 'left-1' : 'right-1') : (lang === 'ar' ? 'right-1' : 'left-1')} bg-white`} />
                       </button>
                    </div>
                  </AdminCard>

                  {/* Currency & Gem Economics */}
                  <AdminCard title={t("Economics & Localization", "الاقتصاد والموقع")} icon={Globe} lang={lang}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}> 
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Currency Symbol", "رمز العملة")}</label> 
                        <input value={settings.currencySymbol} onChange={e => updateSettings({ currencySymbol: e.target.value })} placeholder="$, ج.م" className="w-full border-4 border-black p-3 font-black text-lg bg-white" /> 
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Price Per Gem", "سعر الجوهرة الواحدة")}</label> 
                        <div className="relative">
                           <input type="number" step="0.0001" value={settings.gemPrice} onChange={e => updateSettings({ gemPrice: parseFloat(e.target.value) })} className="w-full border-4 border-black p-3 font-black text-lg bg-white pr-12" />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-xs opacity-30">{settings.currencySymbol}</span>
                        </div>
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Currency Position", "مكان العملة")}</label> 
                        <button 
                          onClick={() => updateSettings({ currencySuffix: !settings.currencySuffix })}
                          className={`w-full border-4 border-black p-3 font-black text-xs uppercase transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none ${settings.currencySuffix ? 'bg-black text-white' : 'bg-white text-black'}`}
                        >
                          {settings.currencySuffix ? t("Suffix (e.g. 10 EGP)", "لاحق (مثال: 10 ج.م)") : t("Prefix (e.g. EGP 10)", "سابق (مثال: ج.م 10)")}
                        </button>
                      </div>
                      <div className="bg-gray-100 p-4 border-2 border-black border-dashed flex flex-col gap-3 col-span-full">
                         <div className="flex items-center gap-3">
                           <Info className="w-5 h-5 opacity-40" />
                           <p className="text-[9px] font-bold leading-tight opacity-60 uppercase">{t("This price is used to calculate individual gem amounts for users.", "هذا السعر يُستخدم لحساب تكلفة شحن كميات الجواهر الفردية للمستخدمين.")}</p>
                         </div>
                         
                         <div className="mt-2 pt-4 border-t border-black/10">
                            <label className="block text-[10px] font-black uppercase mb-3 opacity-50">{t("Pricing Calculator (Target Price)", "حاسبة التسعير (السعر المستهدف)")}</label>
                            <div className="flex flex-wrap gap-4 items-end">
                               <div className="flex-1 min-w-[120px]">
                                  <label className="text-[8px] font-black uppercase opacity-40 block mb-1">{t("For Every X Gems", "لكل عدد X جواهر")}</label>
                                  <input id="calc-gems" type="number" defaultValue="25" className="w-full border-2 border-black p-2 font-black text-sm" />
                               </div>
                               <div className="flex-1 min-w-[120px]">
                                  <label className="text-[8px] font-black uppercase opacity-40 block mb-1">{t("Target Total Price", "السعر الإجمالي المستهدف")}</label>
                                  <input id="calc-price" type="number" defaultValue="22.5" step="0.1" className="w-full border-2 border-black p-2 font-black text-sm" />
                               </div>
                               <button 
                                 onClick={() => {
                                   const g = parseFloat((document.getElementById("calc-gems") as HTMLInputElement).value);
                                   const p = parseFloat((document.getElementById("calc-price") as HTMLInputElement).value);
                                   if(g > 0) updateSettings({ gemPrice: p / g });
                                 }}
                                 className="bg-black text-[var(--c-lime)] px-4 py-2 border-2 border-black font-black uppercase text-[9px] hover:bg-[var(--c-orange)] hover:text-black transition-all"
                               >
                                 Apply Price
                               </button>
                            </div>
                            <p className="text-[8px] font-bold opacity-40 mt-2 uppercase italic">{t("* Example: 25 gems for 23 pounds = 0.92 per gem", "* مثال: 25 جوهرة مقابل 23 جنيه = 0.92 للجوهرة الواحدة")}</p>
                         </div>

                         <div className="mt-4">
                            <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Live Price Preview", "معاينة حية للأسعار")}</label>
                            <div className="grid grid-cols-3 gap-3">
                               {[100, 500, 1000].map(amt => {
                                  const finalVal = amt * settings.gemPrice;
                                  const displayVal = finalVal % 1 === 0 ? finalVal.toString() : finalVal.toFixed(2);
                                  return (
                                    <div key={amt} className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] group hover:-translate-y-1 transition-transform">
                                       <p className="text-[8px] font-black opacity-40 uppercase mb-1">{amt} {t("Gems", "جوهرة")}</p>
                                       <p className="text-base font-black text-black">{displayVal} <span className="text-[10px] opacity-40 font-bold">{settings.currencySymbol}</span></p>
                                    </div>
                                  );
                               })}
                            </div>
                         </div>
                      </div>
                    </div>
                  </AdminCard>
               </div>

                {/* Store Banners */}
                <AdminCard title={t("Marketing Banners", "بنرات المتجر")} icon={Image} lang={lang}>
                   <div className="space-y-4 pt-2">
                     <div className="flex gap-2 mb-4">
                        <input 
                          id="new-banner-url"
                          placeholder="https://image-url.com/banner.jpg" 
                          className="flex-1 border-4 border-black p-3 font-bold text-xs outline-none focus:bg-[var(--c-lime)]/5"
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById("new-banner-url") as HTMLInputElement;
                            if(input.value) {
                              updateSettings({ bannerImages: [...settings.bannerImages, input.value] });
                              input.value = "";
                            }
                          }}
                          className="bg-black text-white px-6 font-black uppercase text-xs border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                        >
                          Add
                        </button>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Array.isArray(settings.bannerImages) && settings.bannerImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-video border-4 border-black group overflow-hidden">
                             <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                             <button 
                               onClick={() => {
                                 const filtered = settings.bannerImages.filter((_, i) => i !== idx);
                                 updateSettings({ bannerImages: filtered });
                               }}
                               className="absolute top-1 right-1 w-8 h-8 bg-red-600 text-white border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black"
                             >
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                        ))}
                     </div>
                   </div>
                </AdminCard>

                {/* Advanced Payment Accounts */}
                <AdminCard title={t("Payment Receiving Accounts", "حسابات استلام المدفوعات")} icon={Wallet} lang={lang}>
                   <div className="space-y-4 pt-2">
                     <div className="flex justify-end mb-2">
                        <button 
                          onClick={() => {
                            const newAccounts = [...settings.paymentAccounts, { id: Date.now().toString(), name: "New Wallet", value: "" }];
                            updateSettings({ paymentAccounts: newAccounts });
                          }}
                          className="bg-black text-[var(--c-lime)] px-6 py-2 text-[10px] font-black uppercase border-4 border-black hover:bg-[var(--c-orange)] hover:text-black transition-all shadow-[4px_4px_0px_#000]"
                        >
                          + {t("Add New Account", "إضافة حساب جديد")}
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {settings.paymentAccounts.map((acc, index) => (
                          <div key={acc.id} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 border-4 border-black p-4 shadow-[4px_4px_0px_#000] animate-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                            <div className="flex-1 w-full"> 
                              <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Wallet Name", "الاسم")}</label> 
                              <input value={acc.name} onChange={e => { const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a); updateSettings({ paymentAccounts: updated }); }} className="w-full border-2 border-black p-2 font-bold text-xs" /> 
                            </div>
                            <div className="flex-1 w-full"> 
                              <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Country", "الدولة")}</label> 
                                <select value={acc.countryCode || "eg"} onChange={e => { const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, countryCode: e.target.value } : a); updateSettings({ paymentAccounts: updated }); }} className="w-full border-2 border-black p-2 font-bold text-xs bg-white">
                                  {Array.isArray(ARAB_COUNTRIES) && ARAB_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                                </select> 
                            </div>
                            <div className="flex-[2] w-full"> 
                              <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Details", "التفاصيل")}</label> 
                              <input value={acc.value} onChange={e => { const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, value: e.target.value } : a); updateSettings({ paymentAccounts: updated }); }} className="w-full border-2 border-black p-2 font-black text-xs text-[var(--c-orange)]" /> 
                            </div>
                            <button onClick={() => { if(confirm("Delete?")) { const filtered = settings.paymentAccounts.filter(a => a.id !== acc.id); updateSettings({ paymentAccounts: filtered }); } }} className="bg-red-500 text-white w-10 h-10 border-4 border-black flex items-center justify-center hover:bg-black transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                     </div>
                   </div>
                </AdminCard>

                {/* Reset Section */}
                <div className="pt-10 border-t-8 border-black border-dashed">
                   <button 
                    onClick={() => { if(confirm("DANGER! This will wipe everything. Continue?")) { resetSettings(); adminResetGames(); } }} 
                    className="w-full sm:w-auto bg-red-600 text-white px-10 py-5 font-black uppercase border-4 border-black shadow-[8px_8px_0px_#000] hover:bg-black transition-all active:translate-y-1 active:shadow-none"
                   > 
                      Wipe All System Data & Reset to Factory
                   </button>
                   <p className="mt-4 text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">Warning: This action is irreversible.</p>
                </div>
            </div>
          );
        case "coupons":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Ticket} 
                  title={t("Discount Management", "إدارة أكواد الخصم")} 
                  subtitle={t("Create and manage promotional coupons and seasonal discounts", "إنشاء وإدارة أكواد الخصم الترويجية والتخفيضات الموسمية")}
                  lang={lang}
                />
               
               <div className="flex justify-end mb-4">
                  <button onClick={() => addCoupon({ code: "NEWCODE", discountPercent: 0.1, isActive: true })} className="px-8 py-3 bg-[var(--c-orange)] border-4 border-black font-black uppercase text-xs hover:bg-black hover:text-[var(--c-orange)] transition-all shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none"> 
                    + {t("Add New Coupon", "إضافة كود جديد")} 
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.map(coupon => (
                  <AdminCard key={coupon.id} title={coupon.code} icon={Tag} lang={lang} color={coupon.isActive ? "bg-white" : "bg-gray-100 grayscale opacity-60"}>
                     <div className="space-y-4 pt-2">
                        <div className={lang === 'ar' ? 'text-right' : ''}>
                           <label className="text-[10px] font-black uppercase block mb-1 opacity-40">{t("Coupon Code", "كود الخصم")}</label>
                           <input value={coupon.code} onChange={e => updateCoupon(coupon.id, { code: e.target.value.toUpperCase() })} className="text-2xl font-black uppercase border-b-4 border-black/10 w-full focus:border-black outline-none transition-all" />
                        </div>
                        <div className={`flex items-center gap-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <div className="flex-1">
                             <label className="text-[10px] font-black uppercase block mb-1 opacity-40">{t("Discount Amount", "قيمة الخصم")}</label>
                             <div className="flex items-center gap-2">
                                <input type="number" step="0.01" value={coupon.discountPercent} onChange={e => updateCoupon(coupon.id, { discountPercent: parseFloat(e.target.value) })} className="text-xl font-black border-b-4 border-black/10 w-full focus:border-black outline-none" />
                                <span className="font-black text-xl">%</span>
                             </div>
                           </div>
                           <div className="flex flex-col items-center">
                              <label className="text-[10px] font-black uppercase block mb-1 opacity-40">{t("Active", "مفعل")}</label>
                              <button 
                                onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })} 
                                className={`w-14 h-8 border-4 border-black relative transition-all ${coupon.isActive ? 'bg-[var(--c-lime)]' : 'bg-gray-300'}`}
                              > 
                                 <div className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${coupon.isActive ? (lang === 'ar' ? 'left-0.5' : 'right-0.5') : (lang === 'ar' ? 'right-0.5' : 'left-0.5')} bg-white`} /> 
                              </button>
                           </div>
                        </div>
                        <button onClick={() => removeCoupon(coupon.id)} className="w-full py-3 bg-red-100 text-red-600 font-black uppercase text-[10px] border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all"> 
                           <Trash2 className="w-4 h-4 inline mr-2" /> {t("Delete Coupon", "حذف الكود")} 
                        </button>
                     </div>
                  </AdminCard>
                ))}
              </div>
            </div>
          );
        case "stories":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Video} 
                  title={t("Social Stories", "الحالات الإجتماعية")} 
                  subtitle={t("Publish temporary image or video updates to engage users", "نشر تحديثات صور أو فيديو مؤقتة لزيادة تفاعل المستخدمين")}
                  lang={lang}
                />

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Create Story */}
                  <div className="lg:col-span-2">
                    <AdminCard title={t("Create New Story", "نشر حالة جديدة")} icon={PlusCircle} lang={lang}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Media Type", "نوع الوسائط")}</label>
                            <div className="flex gap-3">
                              <button onClick={() => setStoryType("image")} className={`flex-1 py-4 border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none ${storyType === 'image' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}> <ImagePlus className="w-4 h-4" /> {t("Image", "صورة")} </button>
                              <button onClick={() => setStoryType("video")} className={`flex-1 py-4 border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none ${storyType === 'video' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}> <Play className="w-4 h-4" /> {t("Video", "فيديو")} </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Select File", "اختيار الملف")}</label>
                            <div className="relative group">
                               <input 
                                  type="file" 
                                  accept={storyType === 'image' ? "image/*" : "video/*"}
                                  className="w-full border-4 border-black p-4 font-bold text-xs bg-white cursor-pointer"
                                  onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setStoryMedia(reader.result as string); reader.readAsDataURL(file); } }}
                               />
                               {storyType === 'video' && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter">* {t("Max duration: 30 seconds", "الحد الأقصى للمدة: 30 ثانية")}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Caption", "وصف الحالة")}</label>
                            <textarea 
                              value={storyCaption}
                              onChange={(e) => setStoryCaption(e.target.value)}
                              placeholder={t("Say something about this...", "اكتب شيئاً...")}
                              className="w-full border-4 border-black p-4 font-bold text-sm h-28 focus:bg-[var(--c-lime)]/5 outline-none transition-all"
                            />
                          </div>

                          <div className={`p-5 bg-white border-4 border-black shadow-[6px_6px_0px_#000] ${lang === 'ar' ? 'text-right' : ''}`}>
                            <label className={`flex items-center gap-4 cursor-pointer group mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                               <div className={`w-14 h-8 border-4 border-black relative transition-all ${hasStoryAction ? 'bg-[var(--c-lime)]' : 'bg-gray-100'}`}>
                                  <div className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${hasStoryAction ? (lang === 'ar' ? 'left-0.5' : 'right-0.5') : (lang === 'ar' ? 'right-0.5' : 'left-0.5')} bg-white`} />
                               </div>
                               <input type="checkbox" className="hidden" checked={hasStoryAction} onChange={e => setHasStoryAction(e.target.checked)} />
                               <span className="text-xs font-black uppercase">{t("Add Action Button", "إضافة زر تفاعلي")}</span>
                            </label>

                            {hasStoryAction && (
                              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                       <label className="block text-[9px] font-black uppercase mb-1 opacity-50">{t("Button Text", "نص الزر")}</label>
                                       <input value={storyActionLabel} onChange={e => setStoryActionLabel(e.target.value)} placeholder={t("e.g. Play Now", "مثال: اشحن الآن")} className="w-full border-2 border-black p-2 font-bold text-xs" />
                                    </div>
                                    <div>
                                       <label className="block text-[9px] font-black uppercase mb-1 opacity-50">{t("Target Link", "الرابط")}</label>
                                       <input value={storyActionLink} onChange={e => setStoryActionLink(e.target.value)} placeholder="/" className="w-full border-2 border-black p-2 font-bold text-xs" />
                                    </div>
                                 </div>
                                 <div className="pt-2">
                                    <label className="block text-[8px] font-black uppercase mb-2 opacity-50">{t("Quick Select", "اختيار سريع")}</label>
                                    <div className="flex flex-wrap gap-2">
                                       <button onClick={() => setStoryActionLink("/")} className="px-2 py-1 bg-black text-white text-[9px] font-bold border-2 border-black hover:bg-white hover:text-black transition-all">Home</button>
                                       {games.slice(0, 5).map(g => (
                                          <button key={g.id} onClick={() => setStoryActionLink(`/game/${g.id}`)} className="px-2 py-1 bg-[var(--c-lime)] text-black text-[9px] font-bold border-2 border-black hover:bg-black hover:text-white transition-all">
                                             {g.name}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={() => {
                              if (storyMedia) {
                                addStatus({ type: storyType, url: storyMedia, caption: storyCaption, action: hasStoryAction && storyActionLabel && storyActionLink ? { label: storyActionLabel, link: storyActionLink } : undefined });
                                setStoryMedia(null); setStoryCaption(""); setHasStoryAction(false); setStoryActionLabel(""); setStoryActionLink("");
                                addNotification(t("Published", "تم النشر"), t("Story is now live!", "الحالة الآن نشطة للجميع!"), "success");
                              }
                            }}
                            disabled={!storyMedia}
                            className="w-full bg-[var(--c-orange)] text-black border-4 border-black py-5 font-black uppercase text-xl shadow-[8px_8px_0px_#000] hover:bg-black hover:text-[var(--c-orange)] disabled:opacity-50 transition-all active:translate-y-1 active:shadow-none"
                          >
                            {t("Publish Story 🚀", "نشر الحالة الآن 🚀")}
                          </button>
                        </div>

                        <div className="border-8 border-black bg-black p-1 flex flex-col items-center justify-center relative overflow-hidden rounded-[2rem] aspect-[9/16] shadow-2xl">
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20"></div>
                          <span className="absolute top-10 text-[8px] font-black uppercase text-white opacity-40 z-20">{t("Live Preview", "معاينة مباشرة")}</span>
                          
                          <div className="w-full h-full relative overflow-hidden rounded-[1.5rem] bg-gray-900">
                             {storyMedia ? (
                               storyType === 'image' ? (
                                 <img src={storyMedia} className="w-full h-full object-cover" />
                               ) : (
                                 <video src={storyMedia} autoPlay muted loop className="w-full h-full object-cover" />
                               )
                             ) : (
                               <div className="flex flex-col items-center justify-center h-full opacity-20 text-white">
                                 <Video className="w-16 h-16 mb-4 animate-pulse" />
                                 <span className="font-black uppercase text-xs tracking-widest">{t("No Media Selected", "لم يتم اختيار ملف")}</span>
                               </div>
                             )}

                             {storyCaption && (
                                <div className="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-sm p-4 border-l-4 border-[var(--c-lime)] text-white">
                                   <p className="text-xs font-bold leading-relaxed">{storyCaption}</p>
                                </div>
                             )}

                             {hasStoryAction && storyActionLabel && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
                                   <div className="bg-white text-black text-center py-3 font-black uppercase text-xs rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
                                      {storyActionLabel}
                                   </div>
                                </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </AdminCard>
                  </div>

                  {/* Active Stories */}
                  <div className="lg:col-span-1">
                    <AdminCard title={t("Active Stories", "الحالات النشطة")} icon={Eye} lang={lang}>
                       <div className="grid grid-cols-2 gap-4 pt-2">
                        {statuses.length === 0 ? (
                          <div className="col-span-full py-10 border-4 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                             <Activity className="w-10 h-10 mb-2" />
                             <p className="font-black uppercase text-[10px]">{t("No active stories", "لا توجد حالات")}</p>
                          </div>
                        ) : (
                          statuses.map(s => (
                            <div key={s.id} className="relative group border-4 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden aspect-[9/16] hover:-rotate-1 transition-all">
                              {s.type === 'image' ? ( <img src={s.url} className="w-full h-full object-cover" /> ) : ( <div className="w-full h-full bg-black flex items-center justify-center text-white"> <Play className="w-10 h-10 opacity-50" /> </div> )}
                              <div className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[9px] font-black text-white uppercase mb-4 leading-tight line-clamp-3">{s.caption || t("No caption", "بدون وصف")}</p>
                                <button onClick={() => removeStatus(s.id)} className="w-full bg-red-600 text-white py-2 text-[10px] font-black uppercase border-2 border-white/20 hover:bg-white hover:text-red-600 transition-colors">
                                  {t("Remove", "حذف")}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </AdminCard>
                  </div>
               </div>
            </div>
          );
        case "users":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Users} 
                  title={t("CRM & Customer Loyalty", "إدارة العملاء والولاء")} 
                  subtitle={`${filteredCrmUsers.length} ${t("total registered customers", "عميل مسجل")}`}
                  lang={lang}
                  action={
                    <div className={`flex flex-col sm:flex-row gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className="relative flex-1">
                        <Search className={`absolute ${lang === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 opacity-50`} />
                        <input 
                          type="text" 
                          value={crmSearchTerm} 
                          onChange={(e) => setCrmSearchTerm(e.target.value)}
                          placeholder={t("Search by name or contact...", "ابحث بالاسم أو رقم التواصل...")} 
                          className={`w-full ${lang === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-4 border-black font-bold text-sm shadow-[4px_4px_0px_#000] focus:shadow-[6px_6px_0px_#000] transition-all`} 
                        />
                      </div>
                      <select 
                        value={crmRatingFilter} 
                        onChange={(e) => setCrmRatingFilter(e.target.value)}
                        className="border-4 border-black p-3 font-black uppercase text-xs shadow-[4px_4px_0px_#000] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="ALL">{t("All Ratings", "كل التقييمات")}</option>
                        <option value="NORMAL">{t("Normal", "عادي")}</option>
                        <option value="VIP">{t("VIP ⭐", "مميز VIP ⭐")}</option>
                        <option value="WARNING">{t("Warning ⚠️", "تحذير ⚠️")}</option>
                        <option value="BANNED">{t("Banned 🚫", "محظور 🚫")}</option>
                      </select>
                    </div>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {filteredCrmUsers.map((u) => (
                      <AdminCard key={u.id} lang={lang} className="hover:-translate-y-2 transition-transform">
                         <div className={`flex items-start justify-between mb-4 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                               <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_var(--c-orange)] font-black text-xl">
                                  {u.name.charAt(0)}
                               </div>
                               <div>
                                  <h4 className="font-black text-lg uppercase truncate max-w-[140px]">{u.name}</h4>
                                  <p className="text-[10px] font-bold opacity-50">{t("Joined:", "انضم في:")} {new Date(u.joinDate).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${u.rating === 'VIP' ? 'bg-yellow-400' : u.rating === 'WARNING' ? 'bg-orange-500 text-white' : u.rating === 'BANNED' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                               {u.rating}
                            </span>
                         </div>

                         <div className="space-y-3 mb-6">
                            <div className={`flex justify-between items-center p-2 bg-black/5 border-2 border-black border-dashed ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                               <span className="text-[10px] font-black uppercase opacity-50">{t("Total Spent", "إجمالي المدفوعات")}</span>
                               <span className="font-black text-[var(--c-orange)]">{settings.currencySymbol} {u.totalSpent.toLocaleString()}</span>
                            </div>
                            <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                               <span className="text-[10px] font-black uppercase opacity-40">{t("Posts / Middleman", "منشورات / وساطة")}</span>
                               <span className="font-black text-xs">{u.totalPosts} / {u.middlemanUses}</span>
                            </div>
                            <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                               <span className="text-[10px] font-black uppercase opacity-40">{t("Contact", "بيانات التواصل")}</span>
                               <span className="font-black text-xs select-all bg-[var(--c-lime)]/20 px-1">{u.contact || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 p-2 bg-[var(--c-ink)] text-white border-2 border-black">
                               <Star className="w-4 h-4 text-[var(--c-orange)]" />
                               <div className="flex-1">
                                 <p className="text-[8px] font-black uppercase opacity-60 leading-none mb-1">{t("Quick Gem Control", "تحكم سريع بالجواهر")}</p>
                                 <div className="flex items-center gap-2">
                                    <button onClick={() => { addGemsToUser(u.id, 100, "إضافة إدارية سريعة"); alert(lang==='ar'?'تمت إضافة 100 جوهرة':'100 Gems Added'); }} className="bg-[var(--c-lime)] text-black px-1.5 py-0.5 text-[8px] font-black border border-white hover:bg-white transition-colors">+100</button>
                                    <button onClick={() => { addGemsToUser(u.id, -100, "خصم إداري سريع"); alert(lang==='ar'?'تم خصم 100 جوهرة':'100 Gems Deducted'); }} className="bg-red-500 text-white px-1.5 py-0.5 text-[8px] font-black border border-white hover:bg-white hover:text-red-500 transition-colors">-100</button>
                                 </div>
                               </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-2 border-t-2 border-black pt-4">
                            <div className="col-span-2">
                                <select 
                                  value={u.rating} 
                                  onChange={(e) => updateUserRating(u.id, e.target.value as any)}
                                  className="w-full p-2 border-2 border-black font-black uppercase text-[10px] bg-white cursor-pointer shadow-[2px_2px_0px_#000]"
                                >
                                  <option value="">{t("Change Rating", "تغيير التقييم")}</option>
                                  <option value="NORMAL">{t("Normal", "عادي")}</option>
                                  <option value="VIP">{t("VIP ⭐", "مميز VIP ⭐")}</option>
                                  <option value="WARNING">{t("Warning ⚠️", "تحذير ⚠️")}</option>
                                  <option value="BANNED">{t("Banned 🚫", "محظور 🚫")}</option>
                                </select>
                            </div>
                            <a 
                               href={`https://wa.me/${u.contact}`} 
                               target="_blank" 
                               rel="noreferrer"
                               className="bg-[#25D366] text-black border-2 border-black py-2 px-1 text-center font-black uppercase text-[10px] shadow-[2px_2px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-1"
                            >
                               {t("WhatsApp", "مراسلة")}
                            </a>
                            <button 
                               onClick={() => { if(confirm(lang==='ar'?'حذف؟':'Delete?')) deleteUser(u.id); }}
                               className="bg-black text-white border-2 border-black py-2 px-1 text-center font-black uppercase text-[10px] shadow-[2px_2px_0px_#000] hover:translate-y-0.5 hover:shadow-none transition-all"
                            >
                               {t("Delete", "حذف")}
                            </button>
                         </div>
                      </AdminCard>
                   ))}
                   {filteredCrmUsers.length === 0 && (
                      <div className="col-span-full py-20 border-8 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                         <Users className="w-16 h-16 mb-4" />
                         <p className="font-black uppercase text-xl">No users found</p>
                      </div>
                   )}
                </div>
            </div>
          );
        case "finance":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <SectionHeader 
                icon={TrendingUp} 
                title={t("Store Accounting", "الحسابات المالية")} 
                subtitle={t("Monitor your revenue, expenses, and net profit", "مراقبة الإيرادات والمصروفات وصافي الربح")}
                lang={lang}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AdminCard color="bg-[var(--c-lime)]" className="group" lang={lang}>
                   <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                      <Trophy className="w-16 h-16" />
                   </div>
                   <p className="text-xs font-black uppercase opacity-60 mb-3 tracking-widest">{t("Gross Income", "إجمالي الإيرادات")}</p>
                   <p className="text-4xl lg:text-5xl font-black truncate drop-shadow-sm">{settings.currencySymbol} {totalIncome.toLocaleString()}</p>
                   <div className="mt-4 h-1 bg-black/10 w-full overflow-hidden">
                      <div className="h-full bg-black w-2/3 animate-pulse" />
                   </div>
                </AdminCard>

                <AdminCard color="bg-red-100" lang={lang}>
                   <div className="absolute top-0 right-0 p-3 opacity-10">
                      <TrendingUp className="rotate-180 w-16 h-16" />
                   </div>
                   <p className="text-xs font-black uppercase text-red-600 mb-3 tracking-widest">{t("Total Expenses", "إجمالي المصروفات")}</p>
                   <p className="text-4xl lg:text-5xl font-black text-red-600 truncate drop-shadow-sm">{settings.currencySymbol} {expenses.reduce((a,b)=>a+b.amount,0).toLocaleString()}</p>
                </AdminCard>

                <AdminCard color="bg-black" className="shadow-[12px_12px_0px_var(--c-orange)]" lang={lang}>
                   <div className="absolute top-0 right-0 p-3 opacity-20">
                     <DollarSign className="w-20 h-20 text-[var(--c-lime)]" />
                   </div>
                   <p className="text-xs font-black uppercase text-[var(--c-orange)] mb-3 tracking-widest relative z-10">{t("Net Profit", "صافي الربح")}</p>
                   <p className="text-4xl lg:text-5xl font-black truncate relative z-10 text-[var(--c-lime)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                      {settings.currencySymbol} {(totalIncome - expenses.reduce((a,b)=>a+b.amount,0)).toLocaleString()}
                   </p>
                </AdminCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">
                  <AdminCard title={t("Revenue vs Expenses (Mock)", "رسم بياني للإيرادات (تجريبي)")} icon={Activity} lang={lang}>
                    <div className="h-48 flex items-end gap-3 px-4 pt-8">
                       {[60, 80, 45, 90, 100, 70, 85].map((h, i) => (
                         <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-[var(--c-lime)] border-4 border-black shadow-[4px_4px_0px_#000] group-hover:bg-[var(--c-orange)] transition-colors relative" style={{ height: `${h}%` }}>
                               <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">{(h * totalIncome / 100).toFixed(0)}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase opacity-40">Day {i+1}</span>
                         </div>
                       ))}
                    </div>
                  </AdminCard>

                  <AdminCard title={t("Manage Expenses", "إدارة المصروفات والتكاليف")} icon={Activity} lang={lang}>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formdata = new FormData(e.currentTarget);
                        const title = formdata.get("title") as string;
                        const amount = parseFloat(formdata.get("amount") as string);
                        const cat = formdata.get("cat") as any;
                        if(title && amount) {
                          addExpense({ title, amount, category: cat, date: new Date().toISOString() });
                          e.currentTarget.reset();
                        }
                      }}
                      className="flex flex-col lg:flex-row gap-5 mb-10 bg-gray-100/50 p-6 border-4 border-black border-dashed"
                    >
                      <div className="flex-[2]">
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Expense Title", "عنوان المصروف")}</label>
                        <input name="title" required placeholder={t("e.g. Server Hosting", "مثال: استضافة السيرفر")} className="w-full border-2 border-black p-3 font-bold text-sm bg-white focus:bg-[var(--c-lime)]/10 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Amount", "المبلغ")}</label>
                        <input name="amount" type="number" required placeholder={`${settings.currencySymbol}`} className="w-full border-2 border-black p-3 font-bold text-sm bg-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Category", "التصنيف")}</label>
                        <select name="cat" className="w-full border-2 border-black p-3 font-black uppercase text-xs bg-white">
                          <option value="Ads">Ads Campaign</option>
                          <option value="Server">Server/Hosting</option>
                          <option value="Salaries">Salaries</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button type="submit" className="w-full lg:w-auto bg-black text-[var(--c-lime)] font-black uppercase px-8 py-3 border-4 border-black hover:bg-[var(--c-orange)] hover:text-black transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none">
                          {t("Add Record", "إضافة")}
                        </button>
                      </div>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {expenses.map(exp => (
                        <div key={exp.id} className="flex items-center justify-between gap-4 border-4 border-black p-5 hover:bg-[var(--c-lime)]/5 transition-all group">
                           <div className={`flex items-center gap-4 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                              <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black group-hover:rotate-6 transition-transform">
                                 <DollarSign className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-black text-lg leading-tight">{exp.title}</p>
                                <div className={`flex gap-2 items-center mt-1 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                   <span className="text-[9px] font-black uppercase bg-black text-[var(--c-lime)] px-2 py-0.5">{exp.category}</span>
                                   <span className="text-[9px] font-bold opacity-40">{new Date(exp.date).toLocaleDateString()}</span>
                                </div>
                              </div>
                           </div>
                           <div className={`flex items-center gap-5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <p className="font-black text-xl text-red-600">-{settings.currencySymbol}{exp.amount.toLocaleString()}</p>
                              <button onClick={() => removeExpense(exp.id)} className="w-10 h-10 bg-white flex items-center justify-center border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[2px_2px_0px_#000]">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                      ))}
                      {expenses.length === 0 && (
                        <div className="col-span-full py-20 border-4 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                           <Activity className="w-16 h-16 mb-4" />
                           <p className="font-black uppercase text-xl">No expenses recorded</p>
                        </div>
                      )}
                    </div>
                  </AdminCard>
                </div>

                <div className="lg:col-span-1 space-y-6">
                  <AdminCard title={t("Quick Stats", "إحصائيات سريعة")} icon={TrendingUp} lang={lang} color="bg-[var(--c-ink)] text-white">
                     <div className="space-y-6 pt-2">
                        <div className={lang === 'ar' ? 'text-right' : ''}>
                           <p className="text-[10px] font-black uppercase text-[var(--c-lime)] mb-1">Weekly Growth</p>
                           <p className="text-3xl font-black">+14.5%</p>
                           <div className="h-1.5 w-full bg-white/10 mt-2 border border-white/20">
                              <div className="h-full bg-[var(--c-lime)] w-[65%]" />
                           </div>
                        </div>
                        <div className={lang === 'ar' ? 'text-right' : ''}>
                           <p className="text-[10px] font-black uppercase text-[var(--c-orange)] mb-1">Tax Estimate (Mock)</p>
                           <p className="text-3xl font-black">-{settings.currencySymbol} 1,200</p>
                        </div>
                        <button className="w-full bg-white text-black py-4 font-black uppercase text-xs border-4 border-white shadow-[4px_4px_0px_#000] hover:bg-[var(--c-lime)] transition-colors">
                           {t("Download Report", "تحميل التقرير")}
                        </button>
                     </div>
                  </AdminCard>
                  
                  <AdminCard title={t("Tips", "نصائح")} icon={Sparkles} lang={lang}>
                     <p className="text-[10px] font-bold leading-relaxed opacity-70 italic">
                        "Your revenue is up by 12% compared to last month. Consider running a weekend promotion for Games."
                     </p>
                  </AdminCard>
                </div>
              </div>
            </div>
          );
        case "gems":
          return (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-10" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
               <SectionHeader 
                  icon={Star} 
                  title={t("Gems Economy Management", "إدارة اقتصاد الجواهر")} 
                  subtitle={t("Manage gift codes, user balances, and gem packages", "إدارة أكواد الهدايا وأرصدة المستخدمين وباقات الجواهر")}
                  lang={lang}
                />
                
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Send Gems Section */}
                  <AdminCard title={t("Send Gems to User", "إرسال جواهر لمستخدم")} icon={Send} lang={lang}>
                    <div className="space-y-5 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("User ID / Phone", "معرف المستخدم أو رقمه")}</label>
                        <input 
                          type="text" 
                          value={sendGemsId}
                          onChange={(e) => setSendGemsId(e.target.value)}
                          placeholder={t("e.g. USER-1234", "مثال: USER-1234")} 
                          className="w-full border-4 border-black p-3 font-bold bg-white focus:bg-[var(--c-lime)]/5 outline-none transition-all" 
                        />
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 opacity-50">{t("Amount (Gems)", "عدد الجواهر")}</label>
                        <input 
                          type="number" 
                          value={sendGemsAmount}
                          onChange={(e) => setSendGemsAmount(Number(e.target.value))}
                          placeholder="500" 
                          className="w-full border-4 border-black p-3 font-bold bg-white focus:bg-[var(--c-lime)]/5 outline-none transition-all" 
                        />
                      </div>
                      <button 
                        onClick={() => {
                          if (!sendGemsId) return alert("Please enter User ID");
                          addGemsToUser(sendGemsId, sendGemsAmount, `تحويل إداري مباشر`);
                          setSendGemsId("");
                          addNotification(t("Sent", "تم الإرسال"), t("Gems sent successfully", "تم إرسال الجواهر بنجاح"), "success");
                        }}
                        className="w-full bg-[#b084ff] text-white font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-y-1 hover:shadow-none active:translate-y-1.5 transition-all"
                      >
                        {t("Send Gems Now", "إرسال الجواهر الآن")}
                      </button>
                      <p className="text-[10px] font-bold opacity-50 text-center uppercase tracking-tighter">
                        {t("* Gems will be credited directly to their wallet.", "* الجواهر ستضاف مباشرة لمحفظة المستخدم.")}
                      </p>
                    </div>
                  </AdminCard>
  
                  {/* Create Gift Codes Section */}
                  <AdminCard title={t("Create Gift Code", "إنشاء كود هدايا")} icon={Ticket} color="bg-black text-white" lang={lang}>
                    <div className="space-y-5 pt-2">
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 text-[var(--c-lime)]">{t("Code Value (Gems)", "قيمة الكود (جواهر)")}</label>
                        <input 
                          type="number" 
                          value={giftCodeAmount}
                          onChange={(e) => setGiftCodeAmount(Number(e.target.value))}
                          className="w-full border-4 border-white/20 p-3 font-bold bg-white/10 text-white focus:border-[var(--c-lime)] outline-none transition-all" 
                        />
                      </div>
                      <div className={lang === 'ar' ? 'text-right' : ''}>
                        <label className="block text-[10px] font-black uppercase mb-1 text-[var(--c-lime)]">{t("Custom Code (Optional)", "كود مخصص (اختياري)")}</label>
                        <input 
                          type="text" 
                          value={giftCodeCustom}
                          onChange={(e) => setGiftCodeCustom(e.target.value)}
                          placeholder="AL-GIFT-..." 
                          className="w-full border-4 border-white/20 p-3 font-bold bg-white/10 text-white focus:border-[var(--c-lime)] outline-none transition-all" 
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button 
                          onClick={() => handleGenerateGiftCode(true)}
                          className="flex-1 bg-white text-black font-black uppercase py-3 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-y-1 hover:shadow-none transition-all"
                        >
                          {t("Copy Only", "تفعيل ونسخ")}
                        </button>
                        <button 
                          onClick={() => handleGenerateGiftCode(false)}
                          className="flex-1 bg-[var(--c-lime)] text-black font-black uppercase py-3 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:translate-y-1 hover:shadow-none transition-all"
                        >
                          {t("Publish Public", "توليد ونشر")}
                        </button>
                      </div>
                    </div>
                  </AdminCard>
                </div>
  
                    {/* Package Form */}
                    <div className="lg:col-span-1">
                      <div className="bg-[#fffbf0] border-4 border-black p-6 shadow-[8px_8px_0px_#000] sticky top-32">
                        <h3 className={`font-black uppercase text-base mb-6 border-b-4 border-black pb-3 flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                           <div className={`p-2 border-2 border-black ${editingGemPkg ? 'bg-[#b084ff]' : 'bg-[var(--c-lime)]'}`}>
                              {editingGemPkg ? <Edit3 className="w-5 h-5 text-black"/> : <Plus className="w-5 h-5 text-black"/>}
                           </div>
                           {editingGemPkg ? t("Refine Gem Package", "تعديل باقة الجواهر") : t("Create New Package", "إنشاء باقة جديدة")}
                        </h3>
                        
                        <div className="space-y-5">
                          <div className={lang === 'ar' ? 'text-right' : ''}>
                            <label className="block text-[10px] font-black uppercase opacity-40 mb-1">{t("Display Names (AR / EN)", "أسماء العرض (عربي / إنجليزي)")}</label>
                            <div className="grid grid-cols-2 gap-3">
                               <input type="text" placeholder="اسم الباقة" value={editingGemPkg ? editingGemPkg.name : newGemPkg.name} onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, name: e.target.value}) : setNewGemPkg({...newGemPkg, name: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm text-right" dir="rtl" />
                               <input type="text" placeholder="Package Name" value={editingGemPkg ? editingGemPkg.nameEn : newGemPkg.nameEn} onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, nameEn: e.target.value}) : setNewGemPkg({...newGemPkg, nameEn: e.target.value})} className="w-full border-4 border-black p-3 font-bold text-sm" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className={lang === 'ar' ? 'text-right' : ''}>
                              <label className="block text-[10px] font-black uppercase opacity-40 mb-1">{t("Gems Count", "عدد الجواهر")}</label>
                              <div className="relative">
                                 <input type="number" value={editingGemPkg ? editingGemPkg.gems : newGemPkg.gems} onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, gems: Number(e.target.value)}) : setNewGemPkg({...newGemPkg, gems: Number(e.target.value)})} className="w-full border-4 border-black p-3 font-black text-lg bg-white" />
                                 <Star className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500 opacity-20" />
                              </div>
                            </div>
                            <div className={lang === 'ar' ? 'text-right' : ''}>
                              <label className="block text-[10px] font-black uppercase opacity-40 mb-1">{t("Price ($)", "السعر ($)")}</label>
                              <div className="relative">
                                 <input type="number" step="0.01" value={editingGemPkg ? editingGemPkg.price : newGemPkg.price} onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, price: Number(e.target.value)}) : setNewGemPkg({...newGemPkg, price: Number(e.target.value)})} className="w-full border-4 border-black p-3 font-black text-lg bg-white" />
                                 <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 opacity-20" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className={lang === 'ar' ? 'text-right' : ''}>
                               <label className="block text-[10px] font-black uppercase opacity-40 mb-1">{t("Accent Color", "لون التمييز")}</label>
                               <div className="flex gap-2">
                                  <input type="text" value={editingGemPkg ? editingGemPkg.color : newGemPkg.color} onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, color: e.target.value}) : setNewGemPkg({...newGemPkg, color: e.target.value})} className="flex-1 border-4 border-black p-2 font-bold text-xs" />
                                  <div className="w-12 h-12 border-4 border-black shadow-[2px_2px_0px_#000]" style={{ backgroundColor: editingGemPkg ? editingGemPkg.color : newGemPkg.color }}></div>
                               </div>
                             </div>
                             <div className="flex flex-col justify-end">
                                <label className={`flex items-center gap-3 bg-black/5 p-3 border-4 border-black border-dashed cursor-pointer hover:bg-white transition-colors ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                  <input 
                                    type="checkbox" 
                                    checked={editingGemPkg ? editingGemPkg.popular : newGemPkg.popular}
                                    onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, popular: e.target.checked}) : setNewGemPkg({...newGemPkg, popular: e.target.checked})}
                                    className="w-5 h-5 accent-black"
                                  />
                                  <span className="text-[10px] font-black uppercase leading-tight">{t("Most Popular", "الأكثر مبيعاً")}</span>
                                </label>
                             </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <button 
                              onClick={handleAddOrUpdateGemPkg}
                              className={`flex-1 ${editingGemPkg ? 'bg-[#b084ff]' : 'bg-[var(--c-lime)]'} text-black font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all hover:-translate-y-0.5`}
                            >
                              {editingGemPkg ? t("Update Package", "تحديث البيانات") : t("Launch Package", "إطلاق الباقة")}
                            </button>
                            {editingGemPkg && (
                              <button onClick={() => setEditingGemPkg(null)} className="px-6 bg-red-500 text-white border-4 border-black font-black uppercase hover:bg-black transition-colors shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none">
                                <X className="w-6 h-6" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package List Grid */}
                    <div className="lg:col-span-2">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {gemPackages.map(pkg => (
                          <div key={pkg.id} className="relative border-4 border-black p-6 bg-white flex flex-col gap-6 shadow-[10px_10px_0px_#000] hover:shadow-[15px_15px_0px_#000] transition-all group overflow-hidden">
                            {pkg.popular && (
                               <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 font-black uppercase text-[8px] border-l-4 border-b-4 border-black rotate-0 z-10">
                                  HOT SELECTION
                               </div>
                            )}
                            <div className={`flex items-center gap-6 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                              <div className="w-20 h-20 border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_#000] group-hover:-rotate-6 transition-transform relative shrink-0" style={{ backgroundColor: pkg.color }}>
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                                <Star className="w-12 h-12 text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)] relative z-10" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black uppercase text-lg leading-tight mb-1 truncate">{lang === 'ar' ? pkg.name : pkg.nameEn}</p>
                                <div className={`flex items-baseline gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                                   <span className="text-3xl font-black text-black">{pkg.gems.toLocaleString()}</span>
                                   <span className="text-xs font-black opacity-30 uppercase">Gems</span>
                                </div>
                                <p className="text-sm font-black text-[var(--c-orange)] mt-1 uppercase tracking-widest">${pkg.price.toFixed(2)}</p>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t-4 border-black/5">
                              <button 
                                onClick={() => setEditingGemPkg(pkg)} 
                                className="flex-1 flex items-center justify-center gap-2 bg-[var(--c-lime)] border-4 border-black py-2 font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none"
                              >
                                <Edit className="w-4 h-4" /> {t("Edit", "تعديل")}
                              </button>
                              <button 
                                onClick={() => { if(confirm(lang==='ar'?'هل أنت متأكد من حذف هذه الباقة؟':'Are you sure you want to delete this package?')) deleteGemPackage(pkg.id); }} 
                                className="px-4 bg-red-100 text-red-600 border-4 border-black py-2 font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {gemPackages.length === 0 && (
                           <div className="col-span-full py-20 border-8 border-dashed border-black/10 flex flex-col items-center justify-center opacity-20">
                              <ShoppingBag className="w-20 h-20 mb-4" />
                              <p className="font-black uppercase text-xl">Inventory Empty</p>
                           </div>
                        )}
                      </div>
                    </div>
              </div>
          );
      case "monthly":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <SectionHeader 
              icon={Sparkles} 
              title={t("Monthly Store Control", "إدارة المتجر الشهري")} 
              subtitle={t("Manage gamified discounts, probabilities, and event status", "التحكم في الخصومات التفاعلية، الاحتمالات، وحالة الحدث")}
              lang={lang}
              action={
                <div className="flex gap-4">
                  <Link to="/monthly-store" target="_blank" className="bg-white border-4 border-black px-6 py-3 font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_#000] flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" /> {t("Preview Store", "معاينة المتجر")}
                  </Link>
                </div>
              }
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               {/* Store Status & Logic */}
               <AdminCard title={t("Event Status", "حالة الحدث")} icon={Clock} lang={lang}>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between p-4 border-4 border-black bg-gray-50">
                        <div>
                           <p className="text-[10px] font-black uppercase opacity-50">{t("Store Accessibility", "إمكانية دخول المتجر")}</p>
                           <p className="font-black text-lg">{isMonthlyOpen ? t("ACTIVE", "نشط") : t("CLOSED", "مغلق")}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 border-black ${isMonthlyOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        <button className="w-full bg-black text-white py-4 font-black uppercase text-sm border-4 border-black hover:bg-[var(--c-lime)] hover:text-black transition-all shadow-[6px_6px_0px_var(--c-lime)]">
                           {t("TOGGLE EVENT STATUS", "تفعيل / إيقاف الحدث")}
                        </button>
                     </div>

                     <div className="p-4 border-4 border-black border-dashed">
                        <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Active Games for this Month", "الألعاب المفعلة لهذا الشهر")}</label>
                        <div className="flex flex-wrap gap-2">
                           {monthlyGames.map(gid => (
                             <span key={gid} className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase border-2 border-black">
                               {gid}
                             </span>
                           ))}
                        </div>
                        <button className="mt-4 text-[10px] font-black uppercase underline hover:text-[var(--c-orange)] transition-colors">
                           {t("Edit Games List", "تعديل قائمة الألعاب")}
                        </button>
                     </div>
                  </div>
               </AdminCard>

               {/* Probability Weights */}
               <AdminCard title={t("Probability Weights", "نسب الاحتمالات")} icon={Activity} lang={lang}>
                  <div className="space-y-8">
                     <p className="text-[10px] font-bold opacity-60 uppercase">{t("Adjust the probability of getting Rare vs Common discounts.", "تحكم في نسبة ظهور الخصومات النادرة مقابل الشائعة.")}</p>
                     
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-[10px] font-black uppercase">{t("Rare (50% - 85%)", "نادر (50% - 85%)")}</span>
                              <span className="text-xs font-black text-red-500">{monthlyProbs.rare}%</span>
                           </div>
                           <input 
                             type="range" min="1" max="50" value={monthlyProbs.rare} 
                             onChange={e => setProbabilityConfig({...monthlyProbs, rare: parseInt(e.target.value)})}
                             className="w-full accent-red-500 h-2 bg-black/10 rounded-lg cursor-pointer" 
                           />
                        </div>

                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-[10px] font-black uppercase">{t("Medium (20% - 50%)", "متوسط (20% - 50%)")}</span>
                              <span className="text-xs font-black text-orange-500">{monthlyProbs.medium}%</span>
                           </div>
                           <input 
                             type="range" min="1" max="50" value={monthlyProbs.medium} 
                             onChange={e => setProbabilityConfig({...monthlyProbs, medium: parseInt(e.target.value)})}
                             className="w-full accent-orange-500 h-2 bg-black/10 rounded-lg cursor-pointer" 
                           />
                        </div>

                        <div>
                           <div className="flex justify-between mb-2">
                              <span className="text-[10px] font-black uppercase">{t("Common (5% - 20%)", "شائع (5% - 20%)")}</span>
                              <span className="text-xs font-black text-[var(--c-lime)]">{monthlyProbs.common}%</span>
                           </div>
                           <input 
                             type="range" min="1" max="100" value={monthlyProbs.common} 
                             className="w-full accent-[var(--c-lime)] h-2 bg-black/10 rounded-lg cursor-not-allowed opacity-50" 
                             disabled
                           />
                           <p className="text-[8px] font-bold mt-2 opacity-40 uppercase">* Common is automatically balanced to reach 100% total.</p>
                        </div>
                     </div>

                     <button className="w-full bg-[var(--c-lime)] text-black border-4 border-black py-3 font-black uppercase text-xs shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                        {t("SAVE PROBABILITY CONFIG", "حفظ إعدادات الاحتمالات")}
                     </button>
                  </div>
               </AdminCard>

               {/* Analytics Mini */}
               <AdminCard title={t("Store Performance", "أداء المتجر")} icon={TrendingUp} lang={lang} color="bg-black text-white">
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-white/20 bg-white/5">
                           <p className="text-[8px] font-black uppercase opacity-40">{t("Total Visitors", "إجمالي الزوار")}</p>
                           <p className="text-2xl font-black">1,248</p>
                        </div>
                        <div className="p-4 border-2 border-white/20 bg-white/5">
                           <p className="text-[8px] font-black uppercase opacity-40">{t("Active Spins", "عمليات اللف")}</p>
                           <p className="text-2xl font-black text-[var(--c-lime)]">852</p>
                        </div>
                        <div className="p-4 border-2 border-white/20 bg-white/5">
                           <p className="text-[8px] font-black uppercase opacity-40">{t("Burnt Chances", "فرص محروقة")}</p>
                           <p className="text-2xl font-black text-red-500">142</p>
                        </div>
                        <div className="p-4 border-2 border-white/20 bg-white/5">
                           <p className="text-[8px] font-black uppercase opacity-40">{t("Conversion Rate", "نسبة التحويل")}</p>
                           <p className="text-2xl font-black text-blue-400">18.5%</p>
                        </div>
                     </div>

                     <div className="pt-4 border-t-2 border-white/10">
                        <p className="text-[10px] font-black uppercase mb-4 opacity-40">{t("Recent Wins", "آخر المكاسب")}</p>
                        <div className="space-y-2">
                           {[...Array(3)].map((_, i) => (
                             <div key={i} className="flex justify-between items-center text-[9px] font-bold">
                                <span>USER_IDX_{i+1}</span>
                                <span className="text-[var(--c-lime)]">85% OFF</span>
                                <span className="opacity-40">2m ago</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </AdminCard>
            </div>
          </div>
        );
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-ink)] pb-20">
        <GlobalStyles />
        {/* Admin Header */}
        <div className="bg-black text-white border-b-8 border-[var(--c-orange)] p-6 sticky top-0 z-[60] shadow-xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="w-12 h-12 bg-white flex items-center justify-center border-4 border-[var(--c-orange)] hover:scale-110 transition-transform">
                 <ArrowLeft className="w-6 h-6 text-black" />
              </Link>
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-[var(--c-lime)]" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-black uppercase leading-none tracking-tighter">Admin <span className="text-[var(--c-orange)] text-border">DASHBOARD</span></h1>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Master Control Panel</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={logoutDev}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 text-xs font-black uppercase border-2 border-white/20 hover:bg-black transition-colors"
               >
                 <LogOut className="w-4 h-4" /> {t("Lock Dashboard", "قفل اللوحة")}
               </button>
            </div>
          </div>
        </div>

        {/* Top Navigation Bar - Refactored */}
        <div className="bg-white border-b-4 border-black sticky top-[88px] md:top-[96px] z-50 shadow-lg overflow-x-auto no-scrollbar" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <div className="max-w-[1600px] mx-auto flex items-center gap-1 p-2 min-w-max">
            <NavButton 
              id="orders" 
              active={(activeTab as string) === 'orders'} 
              icon={ShoppingBag} 
              label={t("Orders", "الطلبات")} 
              badge={pendingOrdersCount}
              onClick={setActiveTab}
              colorClass="bg-[var(--c-lime)]"
            />
            <NavButton 
              id="games" 
              active={(activeTab as string) === 'games'} 
              icon={Gamepad2} 
              label={t("Products", "المنتجات")} 
              onClick={setActiveTab}
              colorClass="bg-[var(--c-orange)]"
            />
            <NavButton 
              id="gems" 
              active={(activeTab as string) === 'gems'} 
              icon={Star} 
              label={t("Gems", "الجواهر")} 
              onClick={setActiveTab}
              colorClass="bg-[#b084ff]"
            />
            <NavButton 
              id="finance" 
              active={(activeTab as string) === 'finance'} 
              icon={TrendingUp} 
              label={t("Finance", "المالية")} 
              onClick={setActiveTab}
              colorClass="bg-green-500"
            />
            <NavButton 
              id="users" 
              active={(activeTab as string) === 'users'} 
              icon={Users} 
              label={t("CRM", "العملاء")} 
              onClick={setActiveTab}
              colorClass="bg-blue-500"
            />
            <NavButton 
              id="content" 
              active={(activeTab as string) === 'content'} 
              icon={Megaphone} 
              label={t("Community", "المجتمع")} 
              badge={pendingPostsCount}
              onClick={setActiveTab}
              colorClass="bg-[var(--c-purple)]"
            />
            <NavButton 
              id="stories" 
              active={(activeTab as string) === 'stories'} 
              icon={Video} 
              label={t("Stories", "الحالات")} 
              onClick={setActiveTab}
              colorClass="bg-[#ff5e00]"
            />
            <NavButton 
              id="coupons" 
              active={(activeTab as string) === 'coupons'} 
              icon={Ticket} 
              label={t("Coupons", "الخصومات")} 
              onClick={setActiveTab}
              colorClass="bg-yellow-400"
            />
            <NavButton 
              id="complaints" 
              active={(activeTab as string) === 'complaints'} 
              icon={AlertTriangle} 
              label={t("Support", "الشكاوي")} 
              badge={pendingComplaintsCount}
              onClick={setActiveTab}
              colorClass="bg-red-500"
            />
            <NavButton 
              id="settings" 
              active={(activeTab as string) === 'settings'} 
              icon={Settings} 
              label={t("Settings", "الإعدادات")} 
              onClick={setActiveTab}
            />
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-8 mb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {/* Global Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
             <StatMiniCard 
                label={t("Total Sales", "إجمالي المبيعات")} 
                value={`${totalIncome} ${settings.currencySymbol}`} 
                icon={TrendingUp} 
                color="bg-[var(--c-lime)]" 
             />
             <StatMiniCard 
                label={t("Pending Orders", "طلبات معلقة")} 
                value={pendingOrdersCount} 
                icon={Clock} 
                color="bg-[var(--c-orange)]" 
             />
             <StatMiniCard 
                label={t("Total Users", "إجمالي العملاء")} 
                value={crmUsers.length} 
                icon={Users} 
                color="bg-blue-400" 
             />
             <StatMiniCard 
                label={t("Support Tickets", "تذاكر الدعم")} 
                value={pendingComplaintsCount} 
                icon={AlertTriangle} 
                color="bg-red-500" 
             />
          </div>

          {/* Content Area - Refactored to Full Width */}
          <div className="w-full bg-white border-4 border-black p-4 md:p-10 shadow-[12px_12px_0px_#000] min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>

        {/* Screenshot Viewer Modal */}
        {selectedOrderScreenshot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-300">
             <button onClick={() => setSelectedOrderScreenshot(null)} className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform"> <X className="w-10 h-10" /> </button>
             <div className="max-w-4xl max-h-full border-8 border-white shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <img src={selectedOrderScreenshot} className="w-full h-full object-contain" alt="Transfer Proof" />
                <div className="bg-white p-3 border-t-8 border-white text-center font-black uppercase text-sm tracking-widest">{t("Transfer Proof Verification", "التحقق من إثبات الدفع")}</div>
             </div>
          </div>
        )}

        {/* Complaint Image Viewer */}
        {selectedComplaintImage && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-10" onClick={() => setSelectedComplaintImage(null)}>
             <img src={selectedComplaintImage} alt="Full view" className="max-w-full max-h-full border-8 border-white shadow-[20px_20px_0px_rgba(0,0,0,0.5)]" />
          </div>
        )}

        {activeAdminChat && (
          <div className="fixed inset-0 z-[130]">
            <CommunityChat otherUserId={activeAdminChat.id} otherUserName={`Supervision: ${activeAdminChat.name}`} postId={activeAdminChat.postId} onClose={() => setActiveAdminChat(null)} />
          </div>
        )}
      </div>
    );
}

