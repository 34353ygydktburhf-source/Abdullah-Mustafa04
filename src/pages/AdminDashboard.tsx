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
import { ShieldAlert, KeyRound, Check, X, Send, ImagePlus, Eye, AlertTriangle, User, Calendar, ExternalLink, ArrowLeft, Gamepad2, Plus, LogOut, Edit, Trash2, Settings, Ticket, Copy, Star, Info, Play, Video, Users, DollarSign, TrendingUp, Activity, ShoppingBag, Package, Search, Filter, Flame, Trophy, Sparkles, BellOff, Bell } from "lucide-react";
import { CommunityChat } from "@/components/ControlledChaos/CommunityChat";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { useWallet, GemPackage } from "@/components/ControlledChaos/WalletContext";

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
  const { addNotification } = useNotifications();
  const { createGiftCode, gemPackages, addGemPackage, deleteGemPackage, updateGemPackage, addGemsToUser } = useWallet();

  const [giftCodeAmount, setGiftCodeAmount] = useState(1000);
  const [giftCodeCustom, setGiftCodeCustom] = useState("");

  const [sendGemsId, setSendGemsId] = useState("");
  const [sendGemsAmount, setSendGemsAmount] = useState(500);

  const [newGemPkg, setNewGemPkg] = useState<Partial<GemPackage>>({ name: "", nameEn: "", gems: 100, price: 1.5, popular: false, color: "#fffbf0" });
  const [editingGemPkg, setEditingGemPkg] = useState<GemPackage | null>(null);

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
  
  const [activeTab, setActiveTab] = useState<"orders" | "games" | "content" | "middleman" | "complaints" | "settings" | "coupons" | "stories" | "users" | "finance" | "gems">("orders");
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
    id: "", name: "", cat: "MOBILE", category: "mobile", desc: "", descAr: "", color: "bg-[#ff5e00]", image: "", tags: "",
    chargingMethod: "Vodafone Cash / InstaPay",
    deliveryTime: "10 - 30 دقيقة",
    chargingInfo: [] as string[],
    discount: 0,
    noPackagesMessage: "",
    tutorialVideoUrl: "",
    badge: { text: "", color: "bg-red-500", icon: "Flame" } as { text: string; color: string; icon?: string },
    statements: [] as string[]
  });
  const [packagesForm, setPackagesForm] = useState<{id: string, name: string, nameAr?: string, price: string, image?: string, popular?: boolean, discount?: number}[]>([]);
  const [fieldsForm, setFieldsForm] = useState<{key: string, label: string, placeholder: string, required: boolean}[]>([]);

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

  return (
    <div className="min-h-screen bg-[var(--c-bg)] text-[var(--c-ink)] pb-20">
      <GlobalStyles />
      {/* Admin Header */}
      <div className="bg-black text-white border-b-8 border-[var(--c-orange)] p-6 sticky top-0 z-40 shadow-xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
          <button 
            onClick={logoutDev}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 text-xs font-black uppercase border-2 border-white/20 hover:bg-black transition-colors"
          >
             <LogOut className="w-4 h-4" /> {t("Lock Dashboard", "قفل اللوحة")}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b-4 border-black/20 pb-4">
          <button onClick={() => setActiveTab("orders")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'orders' ? 'bg-[var(--c-lime)] text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <ShoppingBag className="w-4 h-4 inline mr-2" /> {t("Orders", "الطلبات")}
            {orders.filter(o => o.status === 'pending').length > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 animate-pulse">{orders.filter(o => o.status === 'pending').length}</span>}
          </button>
          <button onClick={() => setActiveTab("games")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'games' ? 'bg-[var(--c-orange)] text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Gamepad2 className="w-4 h-4 inline mr-2" /> {t("Manage Games", "إدارة المنتجات")}
          </button>
          <button onClick={() => setActiveTab("content")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'content' ? 'bg-[var(--c-lime)] text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Send className="w-4 h-4 inline mr-2" /> {t("Community Posts", "المنشورات")}
            {pendingPosts.length > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 animate-pulse">{pendingPosts.length}</span>}
          </button>
          <button onClick={() => setActiveTab("middleman")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'middleman' ? 'bg-[var(--c-purple)] text-white shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Eye className="w-4 h-4 inline mr-2" /> {t("Supervision", "الوساطة والمراقبة")}
            {middlemanRequests.length > 0 && <span className="ml-2 bg-red-400 text-black px-1.5">{middlemanRequests.length}</span>}
          </button>
          <button onClick={() => setActiveTab("complaints")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'complaints' ? 'bg-red-500 text-white shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <AlertTriangle className="w-4 h-4 inline mr-2" /> {t("Complaints Box", "لوحة الشكاوي")}
            {complaints.filter(c => c.status === 'pending').length > 0 && <span className="ml-2 bg-black text-white px-1.5 animate-bounce block inline-block">{complaints.filter(c => c.status === 'pending').length}</span>}
          </button>
          <button onClick={() => setActiveTab("settings")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'settings' ? 'bg-[var(--c-lime)] text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Settings className="w-4 h-4 inline mr-2" /> {t("Site Settings", "إعدادات الموقع")}
          </button>
          <button onClick={() => setActiveTab("stories")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'stories' ? 'bg-[#ff5e00] text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Video className="w-4 h-4 inline mr-2" /> {t("Stories", "إدارة الحالات")}
          </button>
          <button onClick={() => setActiveTab("coupons")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'coupons' ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Ticket className="w-4 h-4 inline mr-2" /> {t("Discount Codes", "أكواد الخصم")}
          </button>
          <button onClick={() => setActiveTab("users")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'users' ? 'bg-blue-500 text-white shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Users className="w-4 h-4 inline mr-2" /> {t("Users CRM", "إدارة العملاء")}
          </button>
          <button onClick={() => setActiveTab("finance")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'finance' ? 'bg-green-500 text-white shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <TrendingUp className="w-4 h-4 inline mr-2" /> {t("Accounting", "الماليات")}
          </button>
          <button onClick={() => setActiveTab("gems")} className={`px-5 py-3 font-black uppercase text-sm border-4 border-black transition-all ${activeTab === 'gems' ? 'bg-[#b084ff] text-white shadow-[4px_4px_0px_#000]' : 'bg-white hover:bg-black/5'}`}>
            <Star className="w-4 h-4 inline mr-2" /> {t("Gems System", "نظام الجواهر")}
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,0.1)] min-h-[500px]">
          
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b-4 border-black pb-4 gap-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                   <Package className="w-8 h-8 text-[var(--c-orange)]" />
                   {t("Orders Management", "إدارة الطلبات")} ({orders.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                    <input 
                      type="text" 
                      placeholder={t("Search Orders...", "بحث في الطلبات...")} 
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border-2 border-black font-bold text-sm focus:outline-none focus:border-[var(--c-orange)]"
                    />
                  </div>
                  <select 
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border-2 border-black font-black uppercase text-xs focus:outline-none focus:bg-black focus:text-white"
                  >
                    <option value="ALL">{t("All Statuses", "كل الحالات")}</option>
                    <option value="pending">{t("Pending", "قيد الانتظار")}</option>
                    <option value="processing">{t("Processing", "قيد التنفيذ")}</option>
                    <option value="done">{t("Completed", "تم الاكتمال")}</option>
                    <option value="rejected">{t("Rejected", "مرفوض")}</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-xs uppercase tracking-widest text-left">
                      <th className="p-4 border-r border-white/20">{t("Order Info", "معلومات الطلب")}</th>
                      <th className="p-4 border-r border-white/20">{t("Game/Package", "اللعبة / الباقة")}</th>
                      <th className="p-4 border-r border-white/20">{t("Customer", "العميل")}</th>
                      <th className="p-4 border-r border-white/20">{t("Total", "الإجمالي")}</th>
                      <th className="p-4 border-r border-white/20">{t("Status", "الحالة")}</th>
                      <th className="p-4">{t("Actions", "الإجراءات")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => (orderStatusFilter === "ALL" || o.status === orderStatusFilter))
                      .filter(o => o.id.includes(orderSearchTerm) || o.userName.toLowerCase().includes(orderSearchTerm.toLowerCase()) || o.gameName.toLowerCase().includes(orderSearchTerm.toLowerCase()))
                      .map((order) => (
                      <tr key={order.id} className="border-4 border-black hover:bg-black/5 transition-colors">
                          <td className="p-4">
                            <div className="text-sm font-black text-[var(--c-purple)]">{order.id}</div>
                            <div className="text-[10px] font-bold opacity-50 flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" /> {new Date(order.timestamp).toLocaleString()}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                               <span className="text-[10px] font-black uppercase px-1.5 py-0.5 border border-black bg-white">
                                  {order.paymentMethod}
                               </span>
                               {order.senderInfo && (
                                 <span className="text-[10px] font-black uppercase px-1.5 py-0.5 border border-black bg-[var(--c-lime)]">
                                    {t("From", "من")}: {order.senderInfo}
                                 </span>
                               )}
                            </div>
                            {order.screenshot && (
                              <div className="mt-3">
                                 <button 
                                  onClick={() => setSelectedOrderScreenshot(order.screenshot!)}
                                  className="relative border-2 border-black group overflow-hidden"
                                 >
                                   <img src={order.screenshot} className="w-20 h-14 object-cover blur-[1px] group-hover:blur-0 transition-all" />
                                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Eye className="w-4 h-4 text-white" />
                                   </div>
                                   <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] px-1 font-black uppercase">{t("Transfer Proof", "إثبات الدفع")}</div>
                                 </button>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-black text-sm uppercase">{order.gameName}</div>
                            <div className="text-xs font-bold opacity-70">{order.packageName} x{order.quantity}</div>
                            <div className="mt-2 p-2 bg-black/5 border border-black/10 text-[10px] font-bold">
                               {Object.entries(order.fields).map(([k, v]) => (
                                 <div key={k} className="flex justify-between gap-4">
                                   <span className="uppercase opacity-60">{k}:</span>
                                   <span className="font-black">{v}</span>
                                  </div>
                               ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[var(--c-lime)] flex items-center justify-center border-2 border-black font-black text-xs">
                                 {order.userName.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-black uppercase">{order.userName}</div>
                                <div className="text-[10px] font-bold opacity-50">{order.userContact}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-black text-sm text-[var(--c-ink)]">
                            {order.totalPrice} {t("EGP", "ج.م")}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_#000] ${
                                order.status === 'done' ? 'bg-green-400' : 
                                order.status === 'processing' ? 'bg-blue-400' : 
                                order.status === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'
                              }`}>
                                {t(order.status.toUpperCase(), getStatusText(order.status))}
                              </span>
                              <button 
                                onClick={() => {
                                  const text = `
Order ID: ${order.id}
Game: ${order.gameName}
Package: ${order.packageName} x${order.quantity}
Price: ${order.totalPrice} EGP
Customer: ${order.userName} (${order.userContact})
Payment: ${order.paymentMethod}
From: ${order.senderInfo || 'N/A'}
Details: ${Object.entries(order.fields).map(([k,v]) => `${k}: ${v}`).join(', ')}
Timestamp: ${new Date(order.timestamp).toLocaleString()}
                                  `.trim();
                                  navigator.clipboard.writeText(text);
                                  alert(lang === 'ar' ? "تم نسخ تفاصيل الطلب!" : "Order details copied!");
                                }}
                                className="bg-white border-2 border-black p-1 text-[8px] font-black uppercase hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1"
                              >
                                <Copy className="w-2.5 h-2.5" /> {t("Copy All", "نسخ التفاصيل")}
                              </button>
                            </div>
                          </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1.5">
                            {editingOrderId === order.id ? (
                              <div className="flex flex-col gap-2 p-3 bg-black/5 border-2 border-black animate-in zoom-in-95">
                                <input 
                                  type="text" 
                                  placeholder={t("Note (Optional)...", "ملاحظة (اختياري)...")} 
                                  value={orderUpdateNote}
                                  onChange={(e) => setOrderUpdateNote(e.target.value)}
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
                                  }} className="bg-green-500 text-white text-[10px] font-black py-1.5 uppercase hover:bg-black transition-colors">{t("Accept", "قبول")}</button>
                                  <button onClick={() => { updateOrderStatus(order.id, 'rejected', orderUpdateNote); setEditingOrderId(null); setOrderUpdateNote(""); }} className="bg-red-500 text-white text-[10px] font-black py-1.5 uppercase hover:bg-black transition-colors">{t("Reject", "رفض")}</button>
                                  <button onClick={() => { updateOrderStatus(order.id, 'processing', orderUpdateNote); setEditingOrderId(null); setOrderUpdateNote(""); }} className="bg-blue-500 text-white text-[10px] font-black py-1.5 uppercase hover:bg-black transition-colors col-span-2">{t("Processing", "بدء")}</button>
                                  <button onClick={() => setEditingOrderId(null)} className="bg-white border border-black text-[10px] font-black py-1.5 uppercase hover:bg-black/5 transition-colors col-span-2">{t("Cancel", "إلغاء")}</button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setEditingOrderId(order.id)}
                                className="w-full bg-black text-white px-3 py-2 text-[10px] font-black uppercase hover:bg-[var(--c-orange)] transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Edit className="w-3 h-3" /> {t("Manage Status", "إدارة الحالة")}
                              </button>
                            )}
                            {order.status !== 'pending' && !editingOrderId && (
                               <button onClick={() => { if(confirm(t("Delete order record?", "حذف سجل الطلب؟"))) deleteOrder(order.id) }} className="text-[10px] font-black text-red-600 hover:underline uppercase text-center">{t("Delete Record", "حذف السجل")}</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-sm font-bold opacity-50 uppercase tracking-widest">{t("No orders found", "لا توجد طلبات حالياً")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GAMES TAB */}
          {activeTab === "games" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                   <Gamepad2 className="w-8 h-8 text-[var(--c-purple)]" />
                   {t("Games Database", "قاعدة بيانات الألعاب")} ({games.length})
                </h2>
                <div className="flex gap-2">
                  <button onClick={adminResetGames} className="px-4 py-2 bg-black text-white font-black uppercase text-xs hover:bg-red-600 transition-colors">
                    {t("Reset Defaults", "استعادة الافتراضيات")}
                  </button>
                  <button onClick={openAddGame} className="px-4 py-2 bg-[var(--c-lime)] border-2 border-black font-black uppercase text-xs flex items-center gap-1 hover:bg-black hover:text-[var(--c-lime)] transition-colors shadow-[2px_2px_0px_#000]">
                    <Plus className="w-4 h-4" /> {t("Add Game", "إضافة لعبة")}
                  </button>
                </div>
              </div>

              {(addingGame || editingGameId) ? (
                <div className="border-4 border-black p-6 bg-[#f9f9f9]">
                   <h3 className="text-xl font-black uppercase mb-4 shadow-[inset_0_-8px_0_var(--c-lime)] inline-block">
                     {addingGame ? t("Add New Game", "إضافة لعبة جديدة") : t("Edit Game", "تعديل اللعبة")}
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-black uppercase mb-1">{t("ID (slug)", "المعرف")}</label>
                       <input value={newGameForm.id} onChange={e => setNewGameForm({...newGameForm, id: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-4" />

                       {/* Badge & Statements Configuration */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                         <div className="p-4 border-4 border-black bg-white shadow-[4px_4px_0px_var(--c-orange)]">
                           <h4 className="text-sm font-black uppercase mb-3 flex items-center gap-2"> <Flame className="w-4 h-4 text-[var(--c-orange)]" /> {t("Badge Settings", "إعدادات البادج")}</h4>
                           <div className="space-y-2">
                             <input 
                               value={newGameForm.badge?.text || ""} 
                               onChange={e => setNewGameForm({...newGameForm, badge: { ...newGameForm.badge!, text: e.target.value }})} 
                               placeholder={t("Badge Text (e.g. HOT)", "نص البادج (مثلاً جديد)")} 
                               className="w-full border-2 border-black p-2 font-bold text-xs" 
                             />
                             <div className="flex gap-2">
                               <select 
                                 value={newGameForm.badge?.color || "bg-red-500"} 
                                 onChange={e => setNewGameForm({...newGameForm, badge: { ...newGameForm.badge!, color: e.target.value }})}
                                 className="flex-1 border-2 border-black p-2 font-black text-[10px] uppercase bg-white"
                               >
                                 <option value="bg-red-500">Red</option>
                                 <option value="bg-blue-500">Blue</option>
                                 <option value="bg-green-500">Green</option>
                               </select>
                               <select 
                                 value={newGameForm.badge?.icon || "Flame"} 
                                 onChange={e => setNewGameForm({...newGameForm, badge: { ...newGameForm.badge!, icon: e.target.value }})}
                                 className="flex-1 border-2 border-black p-2 font-black text-[10px] uppercase bg-white"
                               >
                                 <option value="Flame">Flame</option>
                                 <option value="Star">Star</option>
                                 <option value="Trophy">Trophy</option>
                                 <option value="Sparkles">Sparkles</option>
                               </select>
                             </div>
                           </div>
                         </div>
                         <div className="p-4 border-4 border-black bg-[var(--c-ink)] text-white shadow-[4px_4px_0px_var(--c-lime)]">
                           <h4 className="text-sm font-black uppercase mb-2 flex items-center gap-2"> <Info className="w-4 h-4 text-[var(--c-lime)]" /> {t("Statements", "تصريحات")}</h4>
                           <textarea 
                             value={newGameForm.statements?.join("\n") || ""} 
                             onChange={e => setNewGameForm({...newGameForm, statements: e.target.value.split("\n")})}
                             rows={2} 
                             className="w-full bg-white text-black border-2 border-black p-2 font-bold text-xs"
                             placeholder={t("One per line...", "ملاحظة لكل سطر...")}
                           />
                         </div>
                       </div>
                       
                       <label className="block text-xs font-black uppercase mb-1">{t("Name (EN)", "الاسم")}</label>
                       <input value={newGameForm.name} onChange={e => setNewGameForm({...newGameForm, name: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-4" />
                       
                       <label className="block text-xs font-black uppercase mb-1">{t("Image URL", "رابط الصورة")}</label>
                       <input value={newGameForm.image} onChange={e => setNewGameForm({...newGameForm, image: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-4" />
                       
                       <div className="flex gap-4 mb-4">
                         <div className="flex-1">
                           <label className="block text-xs font-black uppercase mb-1">{t("Category Type", "المنصة الرئيسية")}</label>
                           <select value={newGameForm.category} onChange={e => setNewGameForm({...newGameForm, category: e.target.value})} className="w-full border-4 border-black p-2 font-bold bg-white">
                             <option value="mobile">Mobile</option>
                             <option value="pc">PC / Console</option>
                           </select>
                         </div>
                         <div className="flex-1">
                           <label className="block text-xs font-black uppercase mb-1">{t("Theme Color", "لون اللعبة")}</label>
                           <select value={newGameForm.color} onChange={e => setNewGameForm({...newGameForm, color: e.target.value})} className="w-full border-4 border-black p-2 font-bold bg-white">
                             <option value="bg-[#ff5e00]">Orange</option>
                             <option value="bg-[#b084ff]">Purple</option>
                             <option value="bg-[#ccff00]">Lime</option>
                             <option value="bg-[#002f6c]">Dark Blue</option>
                           </select>
                         </div>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-black uppercase mb-1">{t("Tags (comma separated)", "الكلمات الدلالية")}</label>
                       <input value={newGameForm.tags} onChange={e => setNewGameForm({...newGameForm, tags: e.target.value})} placeholder="e.g. UC, Top-Up, Mobile" className="w-full border-4 border-black p-2 font-bold mb-4" />
                       
                       <label className="block text-xs font-black uppercase mb-1">{t("Description (EN)", "الوصف الإنجليزي")}</label>
                       <textarea value={newGameForm.desc} onChange={e => setNewGameForm({...newGameForm, desc: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-4" rows={2} />
                       
                       <label className="block text-xs font-black uppercase mb-1">{t("Description (AR)", "الوصف العربي")}</label>
                       <textarea value={newGameForm.descAr} onChange={e => setNewGameForm({...newGameForm, descAr: e.target.value})} className="w-full border-4 border-black p-2 font-bold text-right mb-4" rows={2} dir="rtl" />
                       
                       <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-black uppercase mb-1">{t("Global Discount (%)", "خصم اللعبة (%)")}</label>
                            <input type="number" value={newGameForm.discount} onChange={e => setNewGameForm({...newGameForm, discount: parseFloat(e.target.value) || 0})} className="w-full border-4 border-black p-2 font-black bg-[var(--c-lime)]/20 shadow-[2px_2px_0px_#000]" />
                          </div>
                          <div className="flex-[2]">
                            <label className="block text-xs font-black uppercase mb-1">{t("Empty State Message", "رسالة 'لا توجد حزم'")}</label>
                            <input value={newGameForm.noPackagesMessage} onChange={e => setNewGameForm({...newGameForm, noPackagesMessage: e.target.value})} placeholder={t("e.g. Coming Soon...", "مثال: قريباً...")} className="w-full border-4 border-black p-2 font-bold text-sm shadow-[2px_2px_0px_#000]" />
                          </div>
                       </div>

                       <div className="mt-4">
                          <label className="block text-xs font-black uppercase mb-1 text-[var(--c-purple)]">{t("Tutorial Video/Link URL", "رابط فيديو الشرح")}</label>
                          <input 
                             value={newGameForm.tutorialVideoUrl || ""} 
                             onChange={e => setNewGameForm({...newGameForm, tutorialVideoUrl: e.target.value})} 
                             placeholder="https://www.youtube.com/watch?v=..." 
                             className="w-full border-4 border-black p-2 font-bold text-sm shadow-[2px_2px_0px_#000]" 
                          />
                          <p className="text-[9px] font-bold opacity-60 mt-1 uppercase">{t("This link will appear as 'Watch Tutorial' on the game page", "سيظهر هذا الرابط كزر 'شاهد شرح الشحن' في صفحة اللعبة")}</p>
                       </div>
                     </div>
                   </div>

                   <hr className="border-2 border-black/10 my-6" />

                   <div>
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                           <h4 className="text-lg font-black uppercase">{t("Pricing Packages", "حزم الشحن")}</h4>
                           <span className="bg-black text-[var(--c-lime)] px-2 py-0.5 text-[10px] font-black">{packagesForm.length}</span>
                        </div>
                        <button 
                          onClick={() => setPackagesForm([...packagesForm, { id: 'pkg-'+Math.random(), name: '', nameAr: '', price: '', image: '' }])}
                          className="px-4 py-2 bg-[var(--c-lime)] border-2 border-black text-black text-xs font-black uppercase flex items-center gap-1 hover:bg-black hover:text-[var(--c-lime)] transition-colors shadow-[2px_2px_0px_#000]"
                        >
                          <Plus className="w-3 h-3" /> Add New Package
                        </button>
                      </div>
                      <div className="space-y-3">
                        {packagesForm.length > 0 && (
                          <div className="grid grid-cols-12 gap-2 px-2 text-[10px] font-black uppercase opacity-40">
                             <div className="col-span-3">{t("Package Name (EN)", "اسم الحزمة (EN)")}</div>
                             <div className="col-span-3">{t("Package Name (AR)", "اسم الحزمة (AR)")}</div>
                             <div className="col-span-1">{t("Price", "السعر")}</div>
                             <div className="col-span-1">{t("Discount %", "خصم %")}</div>
                             <div className="col-span-2">{t("Image URL", "رابط الصورة")}</div>
                             <div className="col-span-1 text-center">{t("Hot", "تميز")}</div>
                             <div className="col-span-1 text-center"></div>
                          </div>
                        )}
                        {packagesForm.map((pkg, idx) => (
                          <div key={pkg.id || idx} className="grid grid-cols-12 gap-2 items-center bg-white border-4 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:border-[var(--c-orange)] transition-colors">
                            <div className="col-span-3">
                              <input placeholder="Pro 100 Gems" value={pkg.name} onChange={e => { const np = [...packagesForm]; np[idx] = { ...np[idx], name: e.target.value }; setPackagesForm(np); }} className="w-full border-2 border-black/10 p-2 text-xs font-bold focus:border-black outline-none" />
                            </div>
                            <div className="col-span-3">
                              <input placeholder="100 جوهرة" value={pkg.nameAr} onChange={e => { const np = [...packagesForm]; np[idx] = { ...np[idx], nameAr: e.target.value }; setPackagesForm(np); }} className="w-full border-2 border-black/10 p-2 text-xs font-bold focus:border-black outline-none text-right" dir="rtl" />
                            </div>
                            <div className="col-span-1">
                              <input placeholder="50" value={pkg.price} onChange={e => { const np = [...packagesForm]; np[idx] = { ...np[idx], price: e.target.value }; setPackagesForm(np); }} className="w-full border-2 border-black/10 p-2 text-xs font-black focus:border-black outline-none" />
                            </div>
                            <div className="col-span-1">
                              <input placeholder="0" type="number" value={pkg.discount || 0} onChange={e => { const np = [...packagesForm]; np[idx] = { ...np[idx], discount: parseInt(e.target.value) || 0 }; setPackagesForm(np); }} className="w-full border-2 border-black/10 p-2 text-xs font-black bg-yellow-100 focus:border-black outline-none" />
                            </div>
                            <div className="col-span-2 relative group/img">
                              <input placeholder="https://..." value={pkg.image} onChange={e => { const np = [...packagesForm]; np[idx] = { ...np[idx], image: e.target.value }; setPackagesForm(np); }} className="w-full border-2 border-black/10 p-2 text-[10px] font-bold focus:border-black outline-none" />
                              {pkg.image && (
                                <div className="absolute right-0 top-full mt-1 bg-white border-2 border-black p-1 shadow-lg z-50 hidden group-hover/img:block">
                                  <img src={pkg.image} className="w-20 h-20 object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="col-span-1 flex justify-center">
                              <button 
                                onClick={() => {
                                  const np = [...packagesForm];
                                  np[idx] = { ...np[idx], popular: !np[idx].popular };
                                  setPackagesForm(np);
                                }}
                                className={`w-8 h-8 flex items-center justify-center border-2 border-black transition-colors ${pkg.popular ? 'bg-yellow-400 text-black' : 'bg-white text-gray-400 opacity-30 hover:opacity-100'}`}
                                title="Mark as Popular"
                              >
                                <Star className={`w-4 h-4 ${pkg.popular ? 'fill-black' : ''}`} />
                              </button>
                            </div>
                            <div className="col-span-1 flex gap-1 justify-center">
                              <button 
                                onClick={() => {
                                  const dupe = { ...pkg, id: 'pkg-'+Math.random() };
                                  const np = [...packagesForm];
                                  np.splice(idx + 1, 0, dupe);
                                  setPackagesForm(np);
                                }}
                                className="w-7 h-7 bg-blue-500 flex items-center justify-center text-white border-2 border-black hover:bg-black transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              <button onClick={() => setPackagesForm(packagesForm.filter((_, i) => i !== idx))} className="w-7 h-7 bg-red-500 flex items-center justify-center text-white border-2 border-black hover:bg-black transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {packagesForm.length === 0 && <div className="p-8 border-4 border-dashed border-black/10 text-center opacity-40 font-bold uppercase text-xs">No packages added yet. Click "Add New Package" to start.</div>}
                      </div>
                   </div>

                    <hr className="border-2 border-black/10 my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Field Config */}
                       <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-black uppercase">{t("Order Fields", "حقول الطلب")}</h4>
                            <button 
                              onClick={() => setFieldsForm([...fieldsForm, { key: "f" + Date.now(), label: "", placeholder: "", required: true }])}
                              className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase hover:bg-[var(--c-lime)] hover:text-black transition-colors"
                            >
                              + Add Field
                            </button>
                          </div>
                          <div className="space-y-3">
                            {fieldsForm.map((field, idx) => (
                              <div key={field.key} className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input placeholder="Label (e.g. Player ID)" value={field.label} onChange={e => { const nf = [...fieldsForm]; nf[idx].label = e.target.value; setFieldsForm(nf); }} className="border-2 border-black/10 p-1.5 text-[10px] font-bold" />
                                  <input placeholder="Placeholder" value={field.placeholder} onChange={e => { const nf = [...fieldsForm]; nf[idx].placeholder = e.target.value; setFieldsForm(nf); }} className="border-2 border-black/10 p-1.5 text-[10px] font-bold" />
                                </div>
                                <div className="flex justify-between items-center">
                                  <label className="flex items-center gap-2 text-[10px] font-black cursor-pointer">
                                    <input type="checkbox" checked={field.required} onChange={e => { const nf = [...fieldsForm]; nf[idx].required = e.target.checked; setFieldsForm(nf); }} className="w-4 h-4 border-2 border-black" />
                                    Required
                                  </label>
                                  <button onClick={() => setFieldsForm(fieldsForm.filter((_, i) => i !== idx))} className="text-red-500 hover:text-black transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                       </div>

                       {/* Charging Info */}
                       <div>
                          <h4 className="text-lg font-black uppercase mb-4">{t("Charging Details", "تفاصيل الشحن")}</h4>
                          
                          <label className="block text-[10px] font-black uppercase mb-1">{t("Payment Label", "اسم وسيلة الدفع")}</label>
                          <input value={newGameForm.chargingMethod} onChange={e => setNewGameForm({...newGameForm, chargingMethod: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-3 text-xs" />
                          
                          <label className="block text-[10px] font-black uppercase mb-1">{t("Delivery Time", "وقت التسليم")}</label>
                          <input value={newGameForm.deliveryTime} onChange={e => setNewGameForm({...newGameForm, deliveryTime: e.target.value})} className="w-full border-4 border-black p-2 font-bold mb-3 text-xs" />
                          
                          <label className="block text-[10px] font-black uppercase mb-1">{t("Info Bullets (One per line)", "تعليمات الشحن (سطر لكل نقطة)")}</label>
                          <textarea 
                            value={newGameForm.chargingInfo.join("\n")} 
                            onChange={e => setNewGameForm({...newGameForm, chargingInfo: e.target.value.split("\n")})}
                            rows={4} 
                            className="w-full border-4 border-black p-2 font-bold text-xs"
                          />
                       </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button onClick={saveGame} className="flex-1 bg-[var(--c-ink)] text-[var(--c-bg)] py-3 font-black uppercase border-4 border-black hover:bg-[var(--c-lime)] hover:text-black transition-colors shadow-[4px_4px_0px_#000]">
                        {t("Save Game", "حفظ البيانات")}
                      </button>
                      <button onClick={() => { setAddingGame(false); setEditingGameId(null); }} className="px-6 bg-white border-4 border-black py-3 font-black uppercase hover:bg-black/5 transition-colors">
                        {t("Cancel", "إلغاء")}
                      </button>
                    </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map(game => (
                    <div key={game.id} className={`border-4 border-black p-4 flex flex-col justify-between shadow-[4px_4px_0px_#000] relative bg-white`}>
                       <div>
                         <img src={game.image} alt={game.name} className="w-full h-32 object-cover border-2 border-black mb-3" />
                         <h3 className="font-black text-xl uppercase leading-none mb-1 truncate">{game.name}</h3>
                         <div className="flex items-center justify-between">
                             <p className="text-[10px] font-bold uppercase opacity-50">{game.packages?.length || 0} Packages</p>
                             <p className="text-[10px] font-black bg-[var(--c-lime)] px-1.5 border border-black">{game.packages?.[0]?.price || "--"}</p>
                          </div>
                       </div>
                       <div className="flex gap-2 mt-4 pt-4 border-t-2 border-black/10">
                         <button 
                           onClick={() => openGameEdit(game.id)}
                           className="flex-1 bg-[var(--c-ink)] text-white text-xs py-2 font-black uppercase flex items-center justify-center gap-1 hover:bg-[var(--c-purple)] transition-colors"
                         >
                           <Edit className="w-3 h-3" /> {t("Edit", "تعديل")}
                         </button>
                         <button 
                           onClick={() => { if(confirm("Are you sure?")) removeGame(game.id) }}
                           className="w-10 bg-red-100 text-red-600 flex items-center justify-center border-2 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY POSTS TAB */}
          {activeTab === "content" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                  {t("Pending for Review", "بانتظار المراجعة")}
                  <span className="bg-[var(--c-orange)] text-[var(--c-ink)] text-xs px-2 py-0.5 border-2 border-[var(--c-ink)]">
                    {pendingPosts.length}
                  </span>
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {pendingPosts.length === 0 ? (
                    <div className="p-8 border-4 border-dashed border-[var(--c-ink)]/20 text-center opacity-50 font-bold uppercase text-sm">{t("No pending requests", "لا توجد طلبات معلقة")}</div>
                  ) : (
                    pendingPosts.map(post => (
                      <div key={post.id} className="border-4 border-[var(--c-ink)] bg-[var(--c-bg)] p-4 shadow-[4px_4px_0px_var(--c-ink)]">
                        <div className="mb-3">
                          <p className="text-[10px] font-black uppercase text-[var(--c-purple)]">{post.authorName}</p>
                          <p className="font-black text-lg text-black">{post.title}</p>
                          <p className="text-sm font-bold opacity-80 mt-1 mb-2 text-black">{post.description}</p>
                          {post.images && post.images.length > 0 && (
                            <div className="flex gap-2 mb-2 overflow-x-auto">
                              {post.images.map((img, idx) => (
                                <img key={idx} src={img} className="w-24 h-24 object-cover border-2 border-[var(--c-ink)] shrink-0" />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approvePost(post.id)} className="flex-1 bg-[var(--c-lime)] border-2 border-black py-2 font-black text-xs uppercase hover:bg-green-400"> <Check className="w-4 h-4" /> {t("Approve", "قبول")} </button>
                          <button onClick={() => rejectPost(post.id)} className="flex-1 bg-red-100 border-2 border-black py-2 font-black text-xs uppercase hover:bg-red-500 hover:text-white"> <X className="w-4 h-4" /> {t("Reject", "رفض")} </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="border-4 border-[var(--c-ink)] p-4 md:p-6 bg-[var(--c-lime)] relative overflow-visible h-fit">
                <h3 className="text-xl font-black uppercase mb-4 relative z-10 text-black">{t("Admin Announcement", "النشر المباشر")}</h3>
                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 text-black">{t("Title", "العنوان")}</label>
                    <input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} className="w-full border-4 border-black p-3 text-sm font-bold text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 text-black">{t("Content", "المحتوى")}</label>
                    <textarea value={descInput} onChange={(e) => setDescInput(e.target.value)} rows={4} className="w-full border-4 border-black p-3 text-sm font-bold resize-none text-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 text-black">{t("Action Link (Optional)", "رابط الإجراء (اختياري)")}</label>
                    <input value={postActionLink} onChange={(e) => setPostActionLink(e.target.value)} placeholder="e.g. /game/valorant-points" className="w-full border-4 border-black p-3 text-sm font-bold text-black mb-2" />
                    
                    <div className="flex flex-wrap gap-2">
                       <button type="button" onClick={() => setPostActionLink("/community")} className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 hover:bg-[var(--c-lime)] hover:text-black border-2 border-black transition-colors">
                         {t("Community", "المجتمع")}
                       </button>
                       <button type="button" onClick={() => setPostActionLink("/profile")} className="text-[10px] font-black uppercase bg-black text-white px-2 py-1 hover:bg-[var(--c-lime)] hover:text-black border-2 border-black transition-colors">
                         {t("Profile", "الملف الشخصي")}
                       </button>
                       <button type="button" onClick={() => setPostActionLink(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(lang === "en" ? "Hello regarding the latest offer" : "مرحباً بخصوص العرض الأخير")}`)} className="text-[10px] font-black uppercase bg-[#25D366] text-black px-2 py-1 hover:scale-105 border-2 border-black transition-transform">
                         {t("WhatsApp", "مراسلة وتساب")}
                       </button>
                       <div className="relative group">
                         <button type="button" className="text-[10px] font-black uppercase bg-[var(--c-purple)] text-white px-2 py-1 hover:bg-[var(--c-lime)] hover:text-black border-2 border-black transition-colors">
                           {t("Link to Grid ↓", "رابط الألعاب ↓")}
                         </button>
                         <div className="absolute top-full right-0 mt-1 bg-white border-4 border-black shadow-[4px_4px_0px_#000] p-1 flex-col gap-1 hidden group-hover:flex z-50 min-w-[150px] max-h-[150px] overflow-y-auto">
                            {games.map(g => (
                              <button type="button" key={g.id} onClick={() => setPostActionLink(`/game/${g.id}`)} className="text-left rtl:text-right text-[10px] font-black uppercase p-2 hover:bg-black hover:text-[var(--c-lime)] border-b-2 border-black/10 last:border-b-0">
                                {g.name}
                              </button>
                            ))}
                         </div>
                       </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 text-black">{t("Images (Max 3)", "إضافة صور")}</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {imageInputs.map((str, idx) => (
                        <div key={idx} className="relative border-2 border-black aspect-square">
                          <img src={str} className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white flex items-center justify-center"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                    {imageInputs.length < 3 && (
                      <label className="flex flex-col items-center justify-center border-4 border-dashed border-black/50 bg-white/50 p-4 cursor-pointer">
                        <ImagePlus className="w-6 h-6 text-black" />
                        <input type="file" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  <button onClick={handleDevPost} className="w-full bg-black text-white py-3 font-black uppercase border-4 border-black hover:bg-[var(--c-orange)] transition-all"> <Send className="w-5 h-5" /> {t("Publish Now", "نشر الآن")} </button>
                </div>
              </div>

              {/* Manual Notification Sender */}
              <div className="md:col-span-2 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_#000]">
                 <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                    <Bell className="w-6 h-6 text-yellow-500" />
                    {t("Send Website Notification", "إرسال إشعار للموقع")}
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black uppercase mb-1">{t("Notification Title", "عنوان الإشعار")}</label>
                       <input 
                         value={notifTitle} 
                         onChange={e => setNotifTitle(e.target.value)} 
                         placeholder={t("e.g. New Offer!", "مثال: عرض جديد!")} 
                         className="w-full border-4 border-black p-3 font-bold text-sm" 
                       />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase mb-1">{t("Type", "النوع")}</label>
                        <select 
                          value={notifType} 
                          onChange={e => setNotifType(e.target.value as any)} 
                          className="w-full border-4 border-black p-3 font-black text-xs uppercase"
                        >
                           <option value="success">{t("Success", "نجاح")}</option>
                           <option value="info">{t("Info", "معلومات")}</option>
                           <option value="warning">{t("Warning", "تحذير")}</option>
                           <option value="error">{t("Error", "خطأ")}</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                       <label className="block text-[10px] font-black uppercase mb-1">{t("Message", "الرسالة")}</label>
                       <textarea 
                         value={notifMessage} 
                         onChange={e => setNotifMessage(e.target.value)} 
                         rows={2} 
                         placeholder={t("Message content...", "محتوى الرسالة...")} 
                         className="w-full border-4 border-black p-3 font-bold text-xs" 
                       />
                    </div>
                 </div>
                 <button 
                   onClick={() => {
                     if (!notifTitle || !notifMessage) return;
                     addNotification(notifTitle, notifMessage, notifType);
                     setNotifTitle("");
                     setNotifMessage("");
                     alert(lang === 'ar' ? "تم إرسال الإشعار لجميع المستخدمين!" : "Notification sent to all users!");
                   }}
                   className="w-full bg-yellow-400 text-black border-4 border-black py-3 font-black uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_#000]"
                 >
                    {t("Blast Notification 📢", "بث الإشعار الآن 📢")}
                 </button>
              </div>
            </div>
          )}

          {/* MIDDLEMAN TAB */}
          {activeTab === "middleman" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"> <Eye className="w-6 h-6 text-[var(--c-purple)]" /> {t("Supervised Chats", "رقابة الشات والوساطة")} </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {middlemanRequests.length === 0 ? (
                  <div className="col-span-full p-8 border-4 border-dashed border-black/20 text-center opacity-50 font-bold uppercase text-sm">{t("No active middleman requests", "لا توجد طلبات وساطة حالية")}</div>
                ) : (
                  middlemanRequests.map(req => (
                    <div key={req.id} className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_var(--c-purple)] flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-sm mb-1 text-black">{req.userA_Name} & {req.userB_Name}</h4>
                        <p className="text-xs font-bold opacity-70 mb-2 text-black">Request ID: {req.id.substring(0,8)}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => setActiveAdminChat({ id: req.userAId, name: `${req.userA_Name} & ${req.userB_Name}`, postId: req.postId })} className="flex-1 bg-[var(--c-purple)] text-white border-2 border-black py-2 font-black text-xs uppercase hover:bg-black transition-colors"> Watch Chat </button>
                        <button onClick={() => resolveMiddleman(req.id)} className="w-10 bg-[var(--c-lime)] border-2 border-black flex items-center justify-center hover:bg-black hover:text-[var(--c-lime)]"> <Check className="w-5 h-5" /> </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* COMPLAINTS TAB */}
          {activeTab === "complaints" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"> <AlertTriangle className="w-6 h-6 text-red-500" /> {t("User Complaints", "صندوق الشكاوي")} </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {complaints.length === 0 ? (
                  <div className="col-span-full p-12 border-4 border-dashed border-black/20 text-center opacity-50 font-bold uppercase text-sm">{t("System is clean.", "النظام نظيف.")}</div>
                ) : (
                  complaints.map(complaint => (
                    <div key={complaint.id} className={`border-4 border-black p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between ${complaint.status === 'resolved' ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                      <div>
                        <h4 className="font-black text-sm text-black">{complaint.userName} ({complaint.userContact})</h4>
                        <p className="text-xs font-bold my-2 text-black">{complaint.description}</p>
                        {complaint.image && <img src={complaint.image} className="w-full h-32 object-cover border-2 border-black mb-2" onClick={() => setSelectedComplaintImage(complaint.image!)} />}
                      </div>
                      <div className="flex justify-between items-center mt-2 border-t-2 border-black/10 pt-2">
                        <span className="text-[10px] font-black uppercase">{complaint.status}</span>
                        {complaint.status !== 'resolved' && (
                          <button onClick={() => resolveComplaint(complaint.id)} className="bg-[var(--c-lime)] border-2 border-black px-4 py-1.5 text-[10px] font-black uppercase hover:bg-black hover:text-[var(--c-lime)] shadow-[2px_2px_0px_#000]"> {t("Resolve", "حل الشكوى")} </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SITE SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"> <Settings className="w-6 h-6" /> {t("Global Site Settings", "إعدادات الموقع العامة")} </h3>
              <div className="space-y-6">
                <div className="bg-[#ccff00]/10 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                  <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-black/10 pb-2">{t("Contact Channels", "قنوات التواصل")}</h4>
                  <div className="space-y-4">
                    <div> <label className="block text-[10px] font-black uppercase mb-1">{t("WhatsApp Number", "رقم الواتساب")}</label> <input value={settings.whatsappNumber} onChange={e => updateSettings({ whatsappNumber: e.target.value })} className="w-full border-4 border-black p-3 font-bold text-sm" /> </div>
                    <div> <label className="block text-[10px] font-black uppercase mb-1">{t("Facebook Link", "رابط الفيسبوك")}</label> <input value={settings.facebookLink} onChange={e => updateSettings({ facebookLink: e.target.value })} className="w-full border-4 border-black p-3 font-bold text-sm" /> </div>
                    <div> <label className="block text-[10px] font-black uppercase mb-1">{t("Instagram Link", "رابط الإنستجرام")}</label> <input value={settings.instagramLink} onChange={e => updateSettings({ instagramLink: e.target.value })} className="w-full border-4 border-black p-3 font-bold text-sm" /> </div>
                    <div> <label className="block text-[10px] font-black uppercase mb-1">{t("Telegram Link", "رابط التليجرام")}</label> <input value={settings.telegramLink} onChange={e => updateSettings({ telegramLink: e.target.value })} className="w-full border-4 border-black p-3 font-bold text-sm" /> </div>
                  </div>
                </div>

                <div className="bg-blue-100 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                  <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-black/10 pb-2 flex items-center justify-between">
                    {t("Site Features", "مميزات الموقع")}
                    <div className={settings.notificationsEnabled ? "text-green-600" : "text-red-600"}>
                       {settings.notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </div>
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-white border-4 border-black">
                     <div>
                        <p className="font-black text-sm uppercase">{t("Global Notifications", "الإشعارات العامة")}</p>
                        <p className="text-[10px] font-bold opacity-60 uppercase">{t("Turn on/off the notification system site-wide", "تشغيل أو إيقاف نظام الإشعارات في الموقع بالكامل")}</p>
                     </div>
                     <button 
                       onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                       className={`w-14 h-8 border-4 border-black relative transition-all ${settings.notificationsEnabled ? 'bg-[var(--c-lime)]' : 'bg-red-500'}`}
                     >
                       <div className={`absolute top-0.5 w-5 h-5 border-2 border-black transition-all ${settings.notificationsEnabled ? 'right-0.5 bg-white' : 'left-0.5 bg-black'}`} />
                     </button>
                  </div>
                </div>
                
                <div className="bg-yellow-400 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                  <h4 className="font-black uppercase text-sm mb-4 border-b-2 border-black/10 pb-2">{t("Currency & Localization", "العملة والموقع")}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div> 
                      <label className="block text-[10px] font-black uppercase mb-1">{t("Currency Symbol", "رمز العملة")}</label> 
                      <input value={settings.currencySymbol} onChange={e => updateSettings({ currencySymbol: e.target.value })} placeholder="e.g. $, ج.م, SAR" className="w-full border-4 border-black p-3 font-bold text-sm" /> 
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">{t("Position", "المكان")}</label> 
                      <button 
                        onClick={() => updateSettings({ currencySuffix: !settings.currencySuffix })}
                        className={`w-full border-4 border-black p-3 font-black text-xs uppercase transition-colors ${settings.currencySuffix ? 'bg-black text-white' : 'bg-white text-black'}`}
                      >
                        {settings.currencySuffix ? t("Suffix (100 ج.م)", "لاحق (100 ج.م)") : t("Prefix ($100)", "سابق ($100)")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ff5e00]/10 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                  <div className="flex justify-between items-center mb-4 border-b-2 border-black/10 pb-2">
                    <h4 className="font-black uppercase text-sm">{t("Payment Receiving Accounts", "حسابات استلام المدفوعات")}</h4>
                    <button 
                      onClick={() => {
                        const newAccounts = [...settings.paymentAccounts, { id: Date.now().toString(), name: "New Wallet", value: "" }];
                        updateSettings({ paymentAccounts: newAccounts });
                      }}
                      className="bg-black text-white px-3 py-1 text-[8px] font-black uppercase hover:bg-[var(--c-orange)] transition-colors"
                    >
                      + {t("Add Account", "إضافة حساب")}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {settings.paymentAccounts.map((acc, index) => (
                      <div key={acc.id} className="flex gap-2 items-end animate-in slide-in-from-right-2" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="flex-1"> 
                          <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Wallet Name", "اسم المحفظة")}</label> 
                          <input 
                            value={acc.name} 
                            onChange={e => {
                              const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, name: e.target.value } : a);
                              updateSettings({ paymentAccounts: updated });
                            }} 
                            className="w-full border-2 border-black p-2 font-bold text-xs" 
                          /> 
                        </div>
                        <div className="flex-1"> 
                          <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Country", "الدولة")}</label> 
                          <select 
                            value={acc.countryCode || "eg"} 
                            onChange={e => {
                              const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, countryCode: e.target.value } : a);
                              updateSettings({ paymentAccounts: updated });
                            }} 
                            className="w-full border-2 border-black p-2 font-bold text-xs bg-white" 
                          >
                            {ARAB_COUNTRIES.map(c => (
                              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                            ))}
                          </select> 
                        </div>
                        <div className="flex-[2]"> 
                          <label className="block text-[8px] font-black uppercase mb-1 opacity-50">{t("Number / ID", "الرقم أو المعرف")}</label> 
                          <input 
                            value={acc.value} 
                            onChange={e => {
                              const updated = settings.paymentAccounts.map(a => a.id === acc.id ? { ...a, value: e.target.value } : a);
                              updateSettings({ paymentAccounts: updated });
                            }} 
                            className="w-full border-2 border-black p-2 font-bold text-xs" 
                          /> 
                        </div>
                        <button 
                          onClick={() => {
                            if(confirm("Delete this account?")) {
                              const filtered = settings.paymentAccounts.filter(a => a.id !== acc.id);
                              updateSettings({ paymentAccounts: filtered });
                            }
                          }}
                          className="bg-red-500 text-white w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-100 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                  <div className="flex justify-between items-center mb-4 border-b-2 border-black/10 pb-2">
                    <h4 className="font-black uppercase text-sm flex items-center gap-2"> <ImagePlus className="w-4 h-4" /> {t("Banner Advertising Management", "إدارة الإعلانات البانر")} </h4>
                    <button 
                      onClick={() => {
                        const newBanners = [...(settings.bannerImages || []), ""];
                        updateSettings({ bannerImages: newBanners });
                      }}
                      className="bg-black text-white px-3 py-1 text-[8px] font-black uppercase hover:bg-[var(--c-purple)] transition-colors"
                    >
                      + {t("Add Banner", "إضافة إعلان")}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(settings.bannerImages || []).map((url, index) => (
                      <div key={index} className="flex gap-4 items-start bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000]">
                        <div className="w-20 h-12 border-2 border-black overflow-hidden flex-shrink-0 bg-gray-100">
                          {url ? <img src={url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] opacity-30 font-black">NO IMG</div>}
                        </div>
                        <div className="flex-1">
                          <input 
                            value={url} 
                            placeholder="https://i.pinimg.com/..."
                            onChange={e => {
                              const updated = [...settings.bannerImages];
                              updated[index] = e.target.value;
                              updateSettings({ bannerImages: updated });
                            }} 
                            className="w-full border-2 border-black p-2 font-bold text-xs" 
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const updated = settings.bannerImages.filter((_, i) => i !== index);
                            updateSettings({ bannerImages: updated });
                          }}
                          className="bg-red-500 text-white w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(settings.bannerImages || []).length === 0 && (
                       <p className="text-center text-[10px] font-bold opacity-50 uppercase py-4 border-2 border-dashed border-black">{t("No banners active", "لا يوجد إعلانات مفعلة")}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-red-100 border-4 border-black border-dashed">
                   <button onClick={() => { if(confirm("Reset Settings?")) resetSettings(); adminResetGames(); }} className="bg-red-600 text-white px-4 py-2 text-[10px] font-black uppercase border-2 border-black hover:bg-black transition-colors"> Reset All Data & Settings </button>
                </div>
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === "coupons" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2"> <Ticket className="w-8 h-8 text-yellow-500" /> {t("Discount Management", "إدارة أكواد الخصم")} </h2>
                <button onClick={() => addCoupon({ code: "NEWCODE", discountPercent: 0.1, isActive: true })} className="px-4 py-2 bg-yellow-400 border-2 border-black font-black uppercase text-xs hover:bg-black hover:text-white shadow-[2px_2px_0px_#000]"> <Plus className="w-4 h-4" /> {t("Add Coupon", "إضافة كود جديد")} </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_var(--c-ink)] relative group">
                     <div className="mb-4">
                        <label className="text-[10px] font-bold uppercase block mb-1">Promo Code</label>
                        <input value={coupon.code} onChange={e => updateCoupon(coupon.id, { code: e.target.value.toUpperCase() })} className="text-xl font-black uppercase border-b-4 border-black/10 w-full" />
                     </div>
                     <div className="mb-4 flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold uppercase block mb-1">Discount %</label>
                          <input type="number" step="0.01" value={coupon.discountPercent} onChange={e => updateCoupon(coupon.id, { discountPercent: parseFloat(e.target.value) })} className="text-lg font-black border-b-4 border-black/10 w-full" />
                        </div>
                        <button onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })} className={`w-12 h-6 border-2 border-black rounded-full relative ${coupon.isActive ? 'bg-[var(--c-lime)]' : 'bg-gray-200'}`}> <div className={`absolute top-0.5 w-4 h-4 rounded-full border-2 border-black transition-all ${coupon.isActive ? 'right-0.5 bg-white' : 'left-0.5 bg-black'}`} /> </button>
                     </div>
                     <button onClick={() => removeCoupon(coupon.id)} className="w-full py-2 bg-red-100 text-red-600 font-black uppercase text-[10px] border-2 border-red-600 hover:bg-red-600 hover:text-white"> <Trash2 className="w-3 h-3 inline mr-1" /> Delete </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === "stories" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#ff5e00] mb-8">
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"> <Video className="w-8 h-8 text-[#ff5e00]" /> {t("Create New Story", "نشر حالة جديدة")} </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">{t("Media Type", "نوع الوسائط")}</label>
                      <div className="flex gap-2">
                        <button onClick={() => setStoryType("image")} className={`flex-1 py-3 border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${storyType === 'image' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}> <ImagePlus className="w-4 h-4" /> {t("Image", "صورة")} </button>
                        <button onClick={() => setStoryType("video")} className={`flex-1 py-3 border-4 border-black font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${storyType === 'video' ? 'bg-black text-white' : 'bg-white hover:bg-black/5'}`}> <Play className="w-4 h-4" /> {t("Video", "فيديو")} </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">{t("Select File", "اختيار الملف")}</label>
                      <input 
                        type="file" 
                        accept={storyType === 'image' ? "image/*" : "video/*"}
                        className="w-full border-4 border-black p-3 font-bold text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setStoryMedia(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {storyType === 'video' && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">* {t("Max duration: 30 seconds", "الحد الأقصى للمدة: 30 ثانية")}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase mb-1">{t("Caption", "وصف الحالة (اختياري)")}</label>
                      <textarea 
                        value={storyCaption}
                        onChange={(e) => setStoryCaption(e.target.value)}
                        placeholder={t("Say something about this...", "اكتب شيئاً...")}
                        className="w-full border-4 border-black p-4 font-bold text-sm h-24"
                      />
                    </div>

                    <div className="bg-white border-2 border-dashed border-black p-4 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer group mb-3">
                         <div className={`w-12 h-6 rounded-full border-2 border-black relative transition-all ${hasStoryAction ? 'bg-[var(--c-lime)]' : 'bg-gray-100'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full border-2 border-black transition-all ${hasStoryAction ? 'right-0.5 bg-white' : 'left-0.5 bg-black'}`} />
                         </div>
                         <input type="checkbox" className="hidden" checked={hasStoryAction} onChange={e => setHasStoryAction(e.target.checked)} />
                         <span className="text-xs font-black uppercase tracking-tight">{t("Add Action Button", "إضافة زر تفاعلي")}</span>
                      </label>

                      {hasStoryAction && (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                           <div className="grid grid-cols-2 gap-3">
                              <div>
                                 <label className="block text-[9px] font-black uppercase mb-1 opacity-50">{t("Button Text", "نص الزر")}</label>
                                 <input value={storyActionLabel} onChange={e => setStoryActionLabel(e.target.value)} placeholder={t("e.g. Play Now", "مثال: اشحن الآن")} className="w-full border-2 border-black p-2 font-bold text-xs" />
                              </div>
                              <div>
                                 <label className="block text-[9px] font-black uppercase mb-1 opacity-50">{t("Target Link", "الرابط")}</label>
                                 <input value={storyActionLink} onChange={e => setStoryActionLink(e.target.value)} placeholder="/" className="w-full border-2 border-black p-2 font-bold text-xs" />
                              </div>
                           </div>
                           
                           <div className="pt-2 border-t border-black/5">
                              <label className="block text-[8px] font-black uppercase mb-2 opacity-50">{t("Quick Select Link", "اختيار سريع للرابط")}</label>
                              <div className="flex flex-wrap gap-2">
                                 <button onClick={() => setStoryActionLink("/")} className="px-2 py-1 bg-gray-100 text-[9px] font-bold border border-black/10 hover:bg-black hover:text-white transition-colors">Home</button>
                                 <button onClick={() => setStoryActionLink("/community")} className="px-2 py-1 bg-gray-100 text-[9px] font-bold border border-black/10 hover:bg-black hover:text-white transition-colors">Community</button>
                                 <button onClick={() => setStoryActionLink("/profile")} className="px-2 py-1 bg-gray-100 text-[9px] font-bold border border-black/10 hover:bg-black hover:text-white transition-colors">Profile</button>
                                 {games.slice(0, 10).map(g => (
                                    <button key={g.id} onClick={() => setStoryActionLink(`/game/${g.id}`)} className="px-2 py-1 bg-[var(--c-lime)]/10 text-[9px] font-bold border border-black/10 hover:bg-black hover:text-white transition-colors">
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
                          addStatus({ 
                            type: storyType, 
                            url: storyMedia, 
                            caption: storyCaption,
                            action: hasStoryAction && storyActionLabel && storyActionLink 
                              ? { label: storyActionLabel, link: storyActionLink } 
                              : undefined
                          });
                          setStoryMedia(null);
                          setStoryCaption("");
                          setHasStoryAction(false);
                          setStoryActionLabel("");
                          setStoryActionLink("");
                          alert(lang === 'ar' ? "تم نشر الحالة بنجاح!" : "Story published successfully!");
                        }
                      }}
                      disabled={!storyMedia}
                      className="w-full bg-[#ff5e00] text-black border-4 border-black py-4 font-black uppercase text-lg shadow-[4px_4px_0px_#000] hover:bg-black hover:text-[#ff5e00] disabled:opacity-50 transition-all"
                    >
                      {t("Publish Story 🚀", "نشر الحالة الآن 🚀")}
                    </button>
                  </div>
                  <div className="border-4 border-black bg-black/5 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <span className="absolute top-2 left-2 text-[10px] font-black uppercase opacity-30">{t("Story Preview", "معاينة الحالة")}</span>
                    {storyMedia ? (
                      storyType === 'image' ? (
                        <img src={storyMedia} className="max-w-full max-h-[300px] border-4 border-black shadow-lg" />
                      ) : (
                        <video src={storyMedia} controls className="max-w-full max-h-[300px] border-4 border-black shadow-lg" />
                      )
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <Video className="w-16 h-16 mb-2" />
                        <span className="font-black uppercase text-xs">{t("No Preview Available", "لا يوجد معاينة")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"> <Eye className="w-6 h-6" /> {t("Active Stories", "الحالات النشطة حالياً")} </h3>
              {statuses.length === 0 ? (
                <div className="p-12 border-4 border-dashed border-black/20 text-center opacity-50 font-bold uppercase text-sm">{t("No active stories.", "لا توجد حالات نشطة.")}</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {statuses.map(s => (
                    <div key={s.id} className="relative group border-4 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden aspect-[9/16]">
                      {s.type === 'image' ? (
                        <img src={s.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-black flex items-center justify-center text-white"> <Play className="w-12 h-12 opacity-50" /> </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[10px] font-bold truncate mb-2">{s.caption || t("No caption", "بدون وصف")}</p>
                        <button 
                          onClick={() => removeStatus(s.id)}
                          className="w-full bg-red-600 py-1 text-[8px] font-black uppercase hover:bg-white hover:text-red-600 transition-colors"
                        >
                          {t("Delete", "حذف")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS CRM TAB */}
          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"> <Users className="w-8 h-8 text-blue-500" /> {t("Users CRM Dashboard", "نظام إدارة العملاء")} </h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                <input 
                  type="text" 
                  value={crmSearchTerm} 
                  onChange={(e) => setCrmSearchTerm(e.target.value)}
                  placeholder={t("Search by name or contact...", "ابحث بالاسم أو رقم التواصل...")} 
                  className="flex-1 border-4 border-black p-3 font-bold text-sm shadow-[4px_4px_0px_#000] focus:outline-none" 
                />
                <select 
                  value={crmRatingFilter} 
                  onChange={(e) => setCrmRatingFilter(e.target.value)}
                  className="border-4 border-black p-3 font-black uppercase text-sm shadow-[4px_4px_0px_#000] focus:outline-none"
                >
                  <option value="ALL">{t("All Ratings", "كل التقييمات")}</option>
                  <option value="NORMAL">{t("Normal", "عادي")}</option>
                  <option value="VIP">{t("VIP ⭐", "مميز VIP ⭐")}</option>
                  <option value="WARNING">{t("Warning ⚠️", "تحذير ⚠️")}</option>
                  <option value="BANNED">{t("Banned 🚫", "محظور 🚫")}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 overflow-x-auto pb-4">
                <table className="w-full border-4 border-black text-left bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                  <thead className="bg-[var(--c-ink)] text-white font-black uppercase text-xs">
                    <tr>
                      <th className="p-4 border-b-4 border-black ltr:border-r-4 rtl:border-l-4">{t("User Info", "بيانات العميل")}</th>
                      <th className="p-4 border-b-4 border-black ltr:border-r-4 rtl:border-l-4">{t("Stats & Activity", "النشاط والتفاعل")}</th>
                      <th className="p-4 border-b-4 border-black ltr:border-r-4 rtl:border-l-4">{t("Financials", "المدفوعات")}</th>
                      <th className="p-4 border-b-4 border-black ltr:border-r-4 rtl:border-l-4">{t("Rating", "التقييم")}</th>
                      <th className="p-4 border-b-4 border-black">{t("Actions", "إجراءات")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrmUsers.map((u, i) => (
                      <tr key={u.id} className={`border-b-4 border-black font-bold text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-[var(--c-lime)]/20 transition-colors`}>
                        <td className="p-4 border-black ltr:border-r-4 rtl:border-l-4">
                          <p className="font-black text-base md:text-lg">{u.name}</p>
                          <p className="text-[10px] opacity-70 mb-2">{t("Joined:", "انضم في:")} {new Date(u.joinDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                          <span className="text-[10px] bg-black text-[var(--c-lime)] px-2 py-1 select-all tracking-wide">{u.contact || t("No Contact", "لا توجد بيانات")}</span>
                        </td>
                        <td className="p-4 border-black ltr:border-r-4 rtl:border-l-4">
                          <p className="flex justify-between w-full md:w-32 mb-1">
                            <span className="opacity-70">{t("Posts:", "المنشورات:")}</span>
                            <span className="font-black bg-gray-200 px-1 border border-black text-center min-w-[20px]">{u.totalPosts}</span>
                          </p>
                          <p className="flex justify-between w-full md:w-32">
                            <span className="opacity-70">{t("Middleman:", "الوساطة:")}</span>
                            <span className="font-black bg-gray-200 px-1 border border-black text-center min-w-[20px]">{u.middlemanUses}</span>
                          </p>
                        </td>
                        <td className="p-4 border-black ltr:border-r-4 rtl:border-l-4">
                          <p className="text-green-700 flex flex-col md:flex-row md:items-center gap-1 mb-1">
                            <span className="opacity-70 text-xs">{t("Total:", "الإجمالي:")}</span>
                            <span className="font-black text-base">{settings.currencySymbol} {u.totalSpent.toLocaleString()}</span>
                          </p>
                          <p className="text-gray-500 flex flex-col md:flex-row md:items-center gap-1">
                            <span className="text-[10px]">{t("Avg/Order:", "المتوسط/طلب:")}</span>
                            <span className="text-xs font-black">{settings.currencySymbol} {u.avgSpending.toLocaleString()}</span>
                          </p>
                        </td>
                        <td className="p-4">
                          <select 
                            value={u.rating} 
                            onChange={(e) => updateUserRating(u.id, e.target.value as any)}
                            className={`p-2 border-2 border-black font-black uppercase text-xs w-full shadow-[2px_2px_0px_#000] focus:outline-none focus:scale-105 transition-transform ${u.rating === 'VIP' ? 'bg-yellow-400' : u.rating === 'WARNING' ? 'bg-orange-500 text-white' : u.rating === 'BANNED' ? 'bg-red-600 text-white' : 'bg-white'}`}
                          >
                            <option value="NORMAL">{t("Normal", "عادي")}</option>
                            <option value="VIP">{t("VIP ⭐", "مميز VIP ⭐")}</option>
                            <option value="WARNING">{t("Warning ⚠️", "تحذير ⚠️")}</option>
                            <option value="BANNED">{t("Banned 🚫", "محظور 🚫")}</option>
                          </select>
                        </td>
                        <td className="p-4 border-black ltr:border-l-4 rtl:border-r-4 min-w-[120px]">
                          <div className="flex flex-col gap-2">
                             {u.contact && (
                                <a 
                                  href={`https://wa.me/${u.contact}?text=${encodeURIComponent(lang === "en" ? "Hello from AL LORD Team" : "مرحباً من إدارة متجر اللورد")}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="w-full bg-[#25D366] text-black border-2 border-black py-1.5 px-1 text-center font-black uppercase text-[9px] shadow-[2px_2px_0px_#000] hover:-translate-y-1 transition-transform"
                                >
                                  {t("WhatsApp", "مراسلة")}
                                </a>
                             )}
                             {u.rating !== 'BANNED' && (
                                <button 
                                  onClick={() => updateUserRating(u.id, "BANNED")}
                                  className="w-full bg-red-600 text-white border-2 border-black py-1.5 px-1 text-center font-black uppercase text-[9px] shadow-[2px_2px_0px_#000] hover:-translate-y-1 transition-transform"
                                >
                                  {t("Quick Ban", "حظر سريع")}
                                </button>
                             )}
                             <button 
                               onClick={() => {
                                 if (confirm(lang === 'ar' ? "تأكيد حذف العميل نهائياً؟" : "Confirm permanent delete?")) {
                                   deleteUser(u.id);
                                 }
                               }}
                               className="w-full bg-black text-[var(--c-lime)] border-2 border-black py-1.5 px-1 text-center font-black uppercase text-[9px] shadow-[2px_2px_0px_#000] hover:-translate-y-1 transition-transform"
                             >
                               {t("Delete", "حذف")}
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCrmUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center uppercase font-black opacity-50">
                          {t("No users found matching your search.", "لا يوجد عملاء يطابقون بحثك.")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FINANCE ACCOUNTING TAB */}
          {activeTab === "finance" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 border-b-4 border-black pb-4">
                 <TrendingUp className="w-8 h-8 text-green-500" />
                 <h3 className="text-2xl font-black uppercase">{t("Store Accounting", "الحسابات المالية")}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--c-lime)] border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                   <p className="text-[10px] font-black uppercase opacity-60 mb-2 whitespace-nowrap">{t("Gross Income", "إجمالي الإيرادات (قبل الخصم)")}</p>
                   <p className="text-3xl lg:text-4xl font-black truncate">{settings.currencySymbol} {totalIncome.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 border-4 border-black p-6 shadow-[6px_6px_0px_#000]">
                   <p className="text-[10px] font-black uppercase text-red-600 mb-2">{t("Total Expenses", "إجمالي المصروفات")}</p>
                   <p className="text-3xl lg:text-4xl font-black text-red-600 truncate">{settings.currencySymbol} {expenses.reduce((a,b)=>a+b.amount,0).toLocaleString()}</p>
                </div>
                <div className="bg-black text-white border-4 border-black p-6 shadow-[6px_6px_0px_var(--c-orange)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10">
                     <DollarSign className="w-24 h-24" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-[var(--c-orange)] mb-2 relative z-10">{t("Net Profit", "صافي الربح")}</p>
                   <p className="text-3xl lg:text-4xl font-black truncate relative z-10 text-[var(--c-lime)]">{settings.currencySymbol} {(totalIncome - expenses.reduce((a,b)=>a+b.amount,0)).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-4 border-black p-6 md:p-8 bg-white shadow-[8px_8px_0px_#000]">
                <h4 className="text-xl font-black uppercase mb-6 flex items-center gap-2"> <Activity className="w-6 h-6 text-red-500" /> {t("Manage Expenses", "إدارة المصروفات والتكاليف")} </h4>
                
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
                  className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-4 border-4 border-black border-dashed"
                >
                  <input name="title" required placeholder={t("Expense Title (e.g. Staff)", "العنوان (مثال: راتب أدمن)")} className="flex-[2] border-2 border-black p-3 font-bold text-sm" />
                  <input name="amount" type="number" required placeholder={`${t("Amount", "القيمة")} (${settings.currencySymbol})`} className="flex-1 border-2 border-black p-3 font-bold text-sm" />
                  <select name="cat" className="flex-1 border-2 border-black p-3 font-bold text-sm uppercase">
                    <option value="Ads">Ads Campaign</option>
                    <option value="Server">Server/Hosting</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Other">Other</option>
                  </select>
                  <button type="submit" className="bg-black text-[var(--c-lime)] font-black uppercase px-6 py-3 border-2 border-black hover:bg-[var(--c-orange)] hover:text-black transition-colors">
                    {t("Add Record", "إضافة")}
                  </button>
                </form>

                <div className="space-y-3">
                  {expenses.map(exp => (
                    <div key={exp.id} className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 border-2 border-black p-4 hover:bg-gray-50 transition-colors">
                       <div>
                          <p className="font-black text-base">{exp.title}</p>
                          <div className="flex gap-2 items-center mt-1">
                             <span className="text-[10px] font-bold uppercase bg-black text-[var(--c-lime)] px-2 py-0.5">{exp.category}</span>
                             <span className="text-[10px] font-bold opacity-50">{new Date(exp.date).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <p className="font-black text-lg text-red-600">-{settings.currencySymbol} {exp.amount.toLocaleString()}</p>
                          <button onClick={() => removeExpense(exp.id)} className="w-8 h-8 bg-red-100 flex items-center justify-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
                  {expenses.length === 0 && <p className="text-center text-sm font-bold opacity-50 uppercase p-4">No expenses recorded</p>}
                </div>
              </div>
            </div>
          )}

          {/* GEMS SYSTEM TAB */}
          {activeTab === "gems" && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                  <Star className="w-8 h-8 text-[#b084ff]" />
                  {t("Gems Economy Management", "إدارة اقتصاد الجواهر")}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Send Gems Section */}
                <div className="border-4 border-black p-6 bg-[#fffbf0] shadow-[8px_8px_0px_#000]">
                  <h3 className="font-black uppercase text-xl mb-4 bg-[#ccff00] inline-block px-3 py-1 border-2 border-black">
                    {t("Send Gems to User", "إرسال جواهر لمستخدم")}
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block font-black text-sm mb-2">{t("User ID / Phone", "معرف المستخدم أو رقمه")}</label>
                      <input 
                        type="text" 
                        value={sendGemsId}
                        onChange={(e) => setSendGemsId(e.target.value)}
                        placeholder={t("e.g. USER-1234", "مثال: USER-1234")} 
                        className="w-full border-4 border-black p-3 font-bold bg-white" 
                      />
                    </div>
                    <div>
                      <label className="block font-black text-sm mb-2">{t("Amount (Gems)", "عدد الجواهر")}</label>
                      <input 
                        type="number" 
                        value={sendGemsAmount}
                        onChange={(e) => setSendGemsAmount(Number(e.target.value))}
                        placeholder="500" 
                        className="w-full border-4 border-black p-3 font-bold bg-white" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!sendGemsId) return alert("Please enter User ID");
                        addGemsToUser(sendGemsId, sendGemsAmount, `تحويل إداري مباشر`);
                        setSendGemsId("");
                      }}
                      className="w-full bg-[#b084ff] text-white font-black uppercase py-4 border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      {t("Send Gems Now", "إرسال الجواهر الآن")}
                    </button>
                    <p className="text-xs font-bold opacity-60 text-center mt-2">
                      {t("* Gems will be credited directly to their wallet.", "* الجواهر ستضاف مباشرة لمحفظة المستخدم.")}
                    </p>
                  </div>
                </div>

                {/* Create Gift Codes Section */}
                <div className="border-4 border-black p-6 bg-[#101010] text-[#fffbf0] shadow-[8px_8px_0px_#b084ff]">
                  <h3 className="font-black uppercase text-xl mb-4 bg-[#ff5e00] text-black inline-block px-3 py-1 border-2 border-[#fffbf0]">
                    {t("Create Gift Code", "إنشاء كود هدايا")}
                  </h3>
                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block font-black text-sm mb-2 text-[#ccff00]">{t("Code Value (Gems)", "قيمة الكود (جواهر)")}</label>
                      <input 
                        type="number" 
                        value={giftCodeAmount}
                        onChange={(e) => setGiftCodeAmount(Number(e.target.value))}
                        className="w-full border-4 border-[#fffbf0] p-3 font-bold bg-black text-[#fffbf0] focus:border-[#ccff00] outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block font-black text-sm mb-2 text-[#ccff00]">{t("Custom Code (Optional)", "كود مخصص (اختياري)")}</label>
                      <input 
                        type="text" 
                        value={giftCodeCustom}
                        onChange={(e) => setGiftCodeCustom(e.target.value)}
                        placeholder="AL-GIFT-..." 
                        className="w-full border-4 border-[#fffbf0] p-3 font-bold bg-black text-[#fffbf0] focus:border-[#ccff00] outline-none" 
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => handleGenerateGiftCode(true)}
                        className="flex-1 bg-white text-black font-black uppercase py-4 border-4 border-[#fffbf0] shadow-[4px_4px_0px_#fffbf0] hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        {t("Copy & Activate", "تفعيل ونسخ فقط")}
                      </button>
                      <button 
                        onClick={() => handleGenerateGiftCode(false)}
                        className="flex-1 bg-[#ccff00] text-black font-black uppercase py-4 border-4 border-[#fffbf0] shadow-[4px_4px_0px_#fffbf0] hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        {t("Generate & Publish", "توليد ونشر عام")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manage Gem Packages Section */}
              <div className="mt-8 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_#ccff00]">
                <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                  <Package className="w-8 h-8 text-[#ff5e00]" />
                  {t("Manage Gem Packages", "إدارة باقات الجواهر")}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Form */}
                  <div className="lg:col-span-1 border-4 border-black p-4 bg-[#fffbf0]">
                    <h3 className="font-black uppercase mb-4 border-b-4 border-black pb-2">{editingGemPkg ? t("Edit Package", "تعديل باقة") : t("Add New Package", "إضافة باقة جديدة")}</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase">{t("Name (AR)", "الاسم (عربي)")}</label>
                        <input 
                          type="text" 
                          value={editingGemPkg ? editingGemPkg.name : newGemPkg.name}
                          onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, name: e.target.value}) : setNewGemPkg({...newGemPkg, name: e.target.value})}
                          className="w-full border-2 border-black p-2 font-bold bg-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase">{t("Name (EN)", "الاسم (انجليزي)")}</label>
                        <input 
                          type="text" 
                          value={editingGemPkg ? editingGemPkg.nameEn : newGemPkg.nameEn}
                          onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, nameEn: e.target.value}) : setNewGemPkg({...newGemPkg, nameEn: e.target.value})}
                          className="w-full border-2 border-black p-2 font-bold bg-white" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase">{t("Gems", "عدد الجواهر")}</label>
                          <input 
                            type="number" 
                            value={editingGemPkg ? editingGemPkg.gems : newGemPkg.gems}
                            onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, gems: Number(e.target.value)}) : setNewGemPkg({...newGemPkg, gems: Number(e.target.value)})}
                            className="w-full border-2 border-black p-2 font-bold bg-white" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase">{t("Price ($)", "السعر ($)")}</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={editingGemPkg ? editingGemPkg.price : newGemPkg.price}
                            onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, price: Number(e.target.value)}) : setNewGemPkg({...newGemPkg, price: Number(e.target.value)})}
                            className="w-full border-2 border-black p-2 font-bold bg-white" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase">{t("Color Hex", "لون البطاقة")}</label>
                        <input 
                          type="text" 
                          value={editingGemPkg ? editingGemPkg.color : newGemPkg.color}
                          onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, color: e.target.value}) : setNewGemPkg({...newGemPkg, color: e.target.value})}
                          className="w-full border-2 border-black p-2 font-bold bg-white" 
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={editingGemPkg ? editingGemPkg.popular : newGemPkg.popular}
                          onChange={(e) => editingGemPkg ? setEditingGemPkg({...editingGemPkg, popular: e.target.checked}) : setNewGemPkg({...newGemPkg, popular: e.target.checked})}
                          id="popular-pkg"
                        />
                        <label htmlFor="popular-pkg" className="text-xs font-black uppercase">{t("Mark as Popular", "تمييز كأشهر باقة")}</label>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={handleAddOrUpdateGemPkg}
                          className="flex-1 bg-black text-white font-black uppercase py-3 border-2 border-black shadow-[3px_3px_0px_#ccff00]"
                        >
                          {editingGemPkg ? t("Update", "تحديث") : t("Add", "إضافة")}
                        </button>
                        {editingGemPkg && (
                          <button onClick={() => setEditingGemPkg(null)} className="px-4 bg-gray-200 border-2 border-black font-black uppercase">X</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="lg:col-span-2 space-y-3">
                    {gemPackages.map(pkg => (
                      <div key={pkg.id} className="border-4 border-black p-3 bg-white flex items-center justify-between shadow-[4px_4px_0px_#000]">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-2 border-black flex items-center justify-center" style={{ backgroundColor: pkg.color }}>
                            <Star className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <p className="font-black uppercase text-sm">{pkg.nameEn} / {pkg.name}</p>
                            <p className="text-[10px] font-bold opacity-60 uppercase">{pkg.gems} Gems • ${pkg.price}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingGemPkg(pkg)} className="p-2 border-2 border-black bg-[#ccff00] hover:translate-y-0.5 transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { if(confirm("Are you sure?")) deleteGemPackage(pkg.id); }} className="p-2 border-2 border-black bg-red-500 text-white hover:translate-y-0.5 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {gemPackages.length === 0 && (
                      <div className="text-center py-10 opacity-40 font-black uppercase">{t("No packages defined", "لا يوجد باقات حالياً")}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
