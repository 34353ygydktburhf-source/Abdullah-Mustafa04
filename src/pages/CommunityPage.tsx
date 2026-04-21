import React, { useState } from "react";
import { Navbar } from "@/components/ControlledChaos/Navbar";
import { Footer } from "@/components/ControlledChaos/Footer";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { CommunityPosts } from "@/components/ControlledChaos/CommunityPosts";
import { CommunityChat } from "@/components/ControlledChaos/CommunityChat";
import { useCommunity } from "@/components/ControlledChaos/CommunityContext";
import { useLogin } from "@/components/ControlledChaos/LoginContext";
import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useAdminStatus } from "@/components/ControlledChaos/AdminStatusContext";
import { StatusRing } from "@/components/ControlledChaos/StatusRing";
import { StoryViewer } from "@/components/ControlledChaos/StoryViewer";
import { CommunityAds } from "@/components/ControlledChaos/CommunityAds";
import { Users, Code, PenTool, Flame, ArrowUpRight, X, ImagePlus, ArrowRight, MessageSquare, Bell, Clock, Facebook, ShieldCheck, LogOut, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ArabGamingHub } from "@/components/ControlledChaos/ArabGamingHub";
import { CommunityLeaderboard } from "@/components/ControlledChaos/CommunityLeaderboard";
import { Trophy } from "lucide-react";
const FACEBOOK_GROUP_URL = "https://www.facebook.com/share/g/18N6emWfvo/";

export default function CommunityPage() {
  const { submitPost, messages, markMessagesAsRead, posts } = useCommunity();
  const { isLoggedIn, openLogin, userData, openLogoutConfirm } = useLogin();
  const { settings } = useSettings();
  const { t, lang } = useLang();
  const { statuses, hasActiveStatus } = useAdminStatus();
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [hiddenContact, setHiddenContact] = useState("");
  const [imageStrs, setImageStrs] = useState<string[]>([]);
  const [postSuccess, setPostSuccess] = useState(false);

  const [activeChat, setActiveChat] = useState<{ id: string; name: string; postId?: string } | null>(null);
  const [showInbox, setShowInbox] = useState(false);
  const [showArabMap, setShowArabMap] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentUserId = userData?.contact || "guest123";
  // Calculate unread messages
  const unreadCount = isLoggedIn ? messages.filter(m => m.receiverId === currentUserId && !m.isRead).length : 0;
  
  // Get unique conversations grouped by otherId AND postId
  const conversations = isLoggedIn ? (() => {
    const map = new Map<string, { otherId: string, otherName: string, postId?: string, postTitle: string, lastMsg: string, timestamp: string, unread: number }>();
    
    messages.forEach(m => {
      if (m.senderId === currentUserId || m.receiverId === currentUserId) {
        const isMeSender = m.senderId === currentUserId;
        const otherId = isMeSender ? m.receiverId : m.senderId;
        
        // Logical Fix: Fetch author name from post if I am the sender, 
        // because ChatMessage doesn't store receiverName.
        const post = posts.find(p => p.id === m.postId);
        const postTitle = post ? post.title : "(منشور عام)";
        
        let otherName = isMeSender ? otherId : m.senderName;
        // Improve name lookup: If I'm chatting about a post, use the post author's name
        if (isMeSender && post && post.authorId === otherId) {
          otherName = post.authorName;
        }
        
        const fOtherName = otherId === "dev" ? "المراقب (الإدارة)" : otherName;
        const isUnread = m.receiverId === currentUserId && !m.isRead;
        const conversationKey = `${otherId}-${m.postId || "general"}`;
        const existing = map.get(conversationKey);
        
        if (!existing || new Date(m.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
          map.set(conversationKey, {
            otherId,
            otherName: fOtherName,
            postId: m.postId,
            postTitle,
            lastMsg: m.image ? (t("Image 🖼️", "صورة 🖼️")) : m.text,
            timestamp: m.timestamp,
            unread: (existing?.unread || 0) + (isUnread ? 1 : 0)
          });
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  })() : [];

  const handleOpenChat = (id: string, name: string, postId?: string) => {
    setActiveChat({ id, name, postId });
    setShowInbox(false);
    if (isLoggedIn) markMessagesAsRead(currentUserId, id, postId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (imageStrs.length >= 3) {
        alert(t("Max 3 images reached.", "يمكنك رفع 3 صور كحد أقصى."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageStrs(prev => [...prev, ev.target.result as string]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImageStrs(imageStrs.filter((_, i) => i !== index));
  };

  const handlePostSubmit = () => {
    if (!title.trim() || !desc.trim()) return;
    
    submitPost({
      title,
      description: desc,
      images: imageStrs.length > 0 ? imageStrs : undefined,
      authorId: userData?.contact || "guest123",
      authorName: userData?.name || "Guest User",
      hiddenContact: hiddenContact.trim() || undefined
    });
    
    setTitle("");
    setDesc("");
    setHiddenContact("");
    setImageStrs([]);
    setPostSuccess(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setTimeout(() => setPostSuccess(false), 300);
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen flex flex-col bg-[var(--c-bg)] text-[var(--c-ink)] overflow-hidden font-sans uppercase">
        <Navbar />

        {/* Hero Section */}
        <section className="pt-20 md:pt-24 pb-8 px-4 md:px-8 bg-black border-b-8 border-[var(--c-ink)] relative overflow-hidden">
          {/* Decorative Grid & Image */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://i.pinimg.com/736x/fa/79/0d/fa790deb7789e9bf7236d5777cc90618.jpg')] bg-cover bg-center mix-blend-luminosity"></div>
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]"></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_1px,white_1px,white_2px),repeating-linear-gradient(90deg,transparent,transparent_1px,white_1px,white_2px)] [background-size:20px_20px]" />
          
          <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-right flex-1 order-2 md:order-1">
              <div className="relative mb-4 group inline-block">
                <div className="absolute inset-0 bg-[#fffbf0] translate-x-1.5 translate-y-1.5 border-4 border-black group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                <div className="relative bg-[var(--c-lime)] border-4 border-black px-6 py-3 shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
                  <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none">
                    {t("AL LORD COMMUNITY", "مجتمع ال لورد")}
                  </h1>
                </div>
                <div className="absolute -top-3 -left-3 bg-black text-[var(--c-lime)] px-2 py-1 text-[10px] font-black uppercase border-2 border-[var(--c-lime)] rotate-[-4deg]">
                  {t("OFFICIAL", "رسمي")}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                 <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                 <p className="text-[10px] md:text-xs text-white/60 font-black uppercase tracking-[0.2em]">
                   {t("SECURE ACCESS • PRIVATE ZONE", "دخول آمن • منطقة خاصة")}
                 </p>
              </div>
              
              <div className="relative group max-w-sm">
                <div className="absolute inset-0 bg-white/10 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
                <div className="relative border-2 border-white/20 bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] md:text-xs font-bold text-white/80 leading-snug">
                  <span className="text-[var(--c-orange)] mr-1">⚠️</span> {t("Safe exchange platform. No links or numbers allowed.", "منصة التبادل الآمنة. يمنع نشر الروابط أو الأرقام.")}
                </div>
              </div>
            </div>

            <div className="relative order-1 md:order-2 shrink-0">
               <div className="absolute inset-0 bg-[var(--c-lime)] rotate-6 border-4 border-black"></div>
               <div className="relative bg-white p-4 md:p-6 border-4 border-black shadow-[8px_8px_0px_#000] animate-in zoom-in-90 duration-500">
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-black" />
               </div>
               <div className="absolute -top-3 -right-3 bg-red-600 text-white px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black -rotate-12">
                  Live
               </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-12 relative">
          
          {/* Top Actions */}
          <div className="flex flex-col mb-12 border-4 border-black bg-[var(--c-bg)] p-3 md:p-6 shadow-[8px_8px_0px_#000]">
            <div className="flex flex-wrap md:flex-nowrap justify-between items-center w-full gap-3">
               
               <div className="flex items-center gap-2 md:gap-6 flex-wrap sm:flex-nowrap">
                 <StatusRing shape="circle" size="md">
                   <div className="relative p-0.5 md:p-1 border-4 border-black bg-white rounded-full overflow-hidden w-12 h-12 md:w-16 md:h-16 shadow-[2px_2px_0px_#000] md:shadow-[3px_3px_0px_#000]">
                     <img src="https://i.pinimg.com/736x/0b/91/a5/0b91a5919e54ac44629a8f5ca01e84b3.jpg" alt="Admin" className="w-full h-full object-cover" />
                   </div>
                 </StatusRing>

                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => {
                       setShowArabMap(!showArabMap);
                       setShowLeaderboard(false);
                     }}
                     className="group flex items-center justify-center gap-1 md:gap-2 bg-[#ccff00] text-black border-4 border-black px-2 py-2 md:px-6 md:py-3 font-black uppercase text-[10px] md:text-sm shadow-[3px_3px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] hover:bg-black hover:text-[#ccff00] active:translate-y-1 active:shadow-none transition-all"
                   >
                     <Globe2 className="w-3 h-3 md:w-5 md:h-5 transition-transform group-hover:rotate-12" />
                     <span className="hidden sm:inline">{t("Arab Services", "خدمات الوطن العربي")}</span>
                     <span className="sm:hidden">{t("Services", "خدمات")}</span>
                   </button>
                   
                   <Link 
                     to="/"
                     className="group flex items-center justify-center gap-1 md:gap-2 bg-red-500 text-black border-4 border-black px-2 py-2 md:px-6 md:py-3 font-black uppercase text-[10px] md:text-sm shadow-[3px_3px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] hover:bg-black hover:text-red-500 active:translate-y-1 active:shadow-none transition-all"
                   >
                     <LogOut className="w-3 h-3 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                     <span className="hidden sm:inline">{t("Exit Community", "الخروج من المجتمع")}</span>
                     <span className="sm:hidden">{t("Exit", "خروج")}</span>
                   </Link>
                 </div>
               </div>

               <button 
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className="md:hidden flex-1 flex items-center justify-center gap-2 bg-black text-white px-3 py-2 font-black uppercase text-[10px] border-4 border-black shadow-[4px_4px_0px_var(--c-lime)] active:translate-y-1 active:shadow-none transition-all"
               >
                 <PenTool className="w-3 h-3 text-[var(--c-lime)]" /> {isMobileMenuOpen ? t("Close", "إغلاق") : t("Menu", "قائمة")}
               </button>
            </div>

            <div className={`mt-6 ${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row flex-wrap gap-4 w-full animate-in slide-in-from-top-4 duration-300`}>

               <button 
                 onClick={() => {
                   if (!isLoggedIn) openLogin();
                   else setShowSubmitModal(true);
                 }}
                 className="flex-1 md:flex-none bg-[var(--c-purple)] text-black px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors border-4 border-black shadow-[4px_4px_0px_var(--c-ink)] active:translate-y-1 active:shadow-none"
               >
                 <PenTool className="w-5 h-5" /> {t("Post Offer", "أضف عرضك (انشر)")}
               </button>
               
               <button 
                 onClick={() => setShowRulesModal(true)}
                 className="flex-1 md:flex-none bg-[var(--c-orange)] text-black px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors border-4 border-black shadow-[4px_4px_0px_var(--c-ink)] active:translate-y-1 active:shadow-none"
               >
                 <ShieldCheck className="w-5 h-5" /> {t("Rules", "القواعد")}
               </button>

               <button 
                 onClick={() => {
                   setShowLeaderboard(true);
                   setShowArabMap(false);
                 }}
                 className={`flex-1 md:flex-none ${showLeaderboard ? 'bg-black text-[var(--c-lime)]' : 'bg-[#f4f4f4] text-black'} px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-[var(--c-lime)] transition-colors border-4 border-black shadow-[4px_4px_0px_var(--c-ink)] active:translate-y-1 active:shadow-none`}
               >
                 <Trophy className={`w-5 h-5 ${showLeaderboard ? 'text-[var(--c-lime)]' : 'text-yellow-500'}`} /> {t("Leaderboard", "أبطال المتجر")}
               </button>

               {isLoggedIn && (
                 <button 
                   onClick={() => setShowInbox(!showInbox)}
                   className="relative flex-1 md:flex-none bg-[var(--c-ink)] text-white px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-[var(--c-lime)] transition-colors border-4 border-black shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                 >
                   <Bell className="w-5 h-5" /> {t("Inbox", "الوارد")} {unreadCount > 0 && <span className="absolute -top-3 -right-3 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs animate-bounce shadow-[2px_2px_0px_#000] border-2 border-black">{unreadCount}</span>}
                 </button>
               )}
               <a 
                 href={FACEBOOK_GROUP_URL}
                 target="_blank"
                 rel="noreferrer"
                 className="flex-1 md:flex-none bg-[#1877F2] text-white px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors border-4 border-black shadow-[4px_4px_0px_var(--c-ink)] active:translate-y-1 active:shadow-none"
               >
                 <Facebook className="w-5 h-5" /> {t("Facebook Group", "مجتمع فيسبوك")}
               </a>
               <a 
                 href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("مرحباً، أريد الانضمام لجروب اللورد الرسمي للمجتمع")}`}
                 target="_blank"
                 rel="noreferrer"
                 className="flex-1 md:flex-none bg-[#25D366] text-black px-6 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-[#25D366] transition-colors border-4 border-black shadow-[4px_4px_0px_var(--c-ink)] active:translate-y-1 active:shadow-none"
               >
                 <MessageSquare className="w-5 h-5" /> {t("Community Chat", "دردشة المجتمع")}
               </a>

            </div>
          </div>

          {/* Arab Map Zone */}
          {showArabMap && !showLeaderboard && (
             <div className="mb-12 animate-in slide-in-from-top-4 duration-500 origin-top">
               <ArabGamingHub />
             </div>
          )}

          {/* Leaderboard Zone */}
          {showLeaderboard && (
             <div className="mb-12 animate-in slide-in-from-top-4 duration-500 origin-top">
               <CommunityLeaderboard />
               <button 
                 onClick={() => setShowLeaderboard(false)}
                 className="mt-8 w-full md:w-auto mx-auto bg-black text-white px-8 py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-[var(--c-lime)] hover:text-black transition-colors border-4 border-black shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none"
               >
                 {t("Close Leaderboard", "إغلاق لوحة المتصدرين")}
               </button>
             </div>
          )}

          {!showLeaderboard && (
            <div className="flex-1 w-full relative z-10 space-y-4">
              <CommunityAds />
              <h2 className="text-3xl font-black uppercase inline-block border-b-6 border-[var(--c-orange)] pb-2 mb-4">
                {t("LIVE FEED", "جدار الإعلانات (Live Feed)")}
              </h2>
              <CommunityPosts onOpenChat={handleOpenChat} />
            </div>
          )}
        </section>

        {/* Inbox Modal */}
        {showInbox && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[var(--c-bg)] border-8 border-black shadow-[20px_20px_0px_#000] animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
               <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-[var(--c-lime)]" /> {t("PRIVATE MESSAGES", "صندوق الرسائل الخاص")}
                  </h3>
                  <button onClick={() => setShowInbox(false)} className="w-10 h-10 border-4 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                    <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 bg-white/50">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                       <Bell className="w-20 h-20 mb-4" />
                       <p className="text-xl font-black uppercase">{t("INBOX EMPTY", "الصندوق فارغ تماماً")}</p>
                       <p className="text-sm font-bold">{t("Start a conversation from the ads below.", "ابدأ محادثة من خلال الإعلانات في الأسفل")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {conversations.map(conv => (
                        <button 
                          key={`${conv.otherId}-${conv.postId || "general"}`}
                          onClick={() => handleOpenChat(conv.otherId, conv.otherName, conv.postId)}
                          className={`group w-full text-right p-6 border-4 border-black transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000] relative flex items-center gap-4 ${conv.unread > 0 ? 'bg-[var(--c-lime)]/20' : 'bg-white'}`}
                        >
                          <div className={`w-14 h-14 shrink-0 flex items-center justify-center border-4 border-black ${conv.unread > 0 ? 'bg-[var(--c-lime)] animate-pulse' : 'bg-gray-100'}`}>
                             <Users className="w-6 h-6 text-black" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-black text-lg truncate block">{conv.otherName}</span>
                              <span className="text-[10px] font-black opacity-40 uppercase whitespace-nowrap">
                                {new Date(conv.timestamp).toLocaleTimeString(t("en-US", "ar-EG"), { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                               <span className="text-[10px] font-black bg-black text-[var(--c-orange)] px-2 py-0.5 rounded-sm uppercase max-w-[150px] truncate">
                                 {conv.postTitle}
                               </span>
                               {conv.unread > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-black animate-bounce shadow-[2px_2px_0px_#000]">{t(`${conv.unread} New Messages`, `${conv.unread} رسالة جديدة`)}</span>}
                            </div>
                            <p className="text-sm font-bold opacity-70 truncate line-clamp-1 italic">"{conv.lastMsg}"</p>
                          </div>
                          <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                        </button>
                      ))}
                    </div>
                  )}
               </div>
               
               <div className="p-4 border-t-4 border-black bg-black text-[#fff] text-center text-[10px] font-black uppercase flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-[var(--c-lime)]" /> {t("AL LORD SECURE ENCRYPTED MESSAGING SYSTEM", "نظام AL LORD الآمن لتشفير المراسلات")}
               </div>
            </div>
          </div>
        )}

        {/* Community Rules Modal */}
        {showRulesModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[var(--c-bg)] border-8 border-black p-6 md:p-8 shadow-[12px_12px_0px_#000] md:shadow-[20px_20px_0px_#000] animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
              <button 
                onClick={() => setShowRulesModal(false)}
                className="absolute top-4 right-4 w-10 h-10 border-4 border-black flex items-center justify-center hover:bg-black hover:text-[var(--c-bg)] transition-colors z-30"
              >
                <X className="w-6 h-6" />
              </button>

               <div className="flex items-center gap-4 mb-4 md:mb-8">
                  <ShieldCheck className="w-10 h-10 md:w-14 md:h-14 text-[var(--c-orange)]" />
                  <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-outline-sm">{t("COMMUNITY RULES", "ميثاق أمان المجتمع")}</h2>
               </div>

              <div className="space-y-6 text-right" dir="rtl">
                 <div className="p-4 bg-[var(--c-lime)] border-4 border-black">
                    <h3 className="text-xl font-black mb-1 uppercase">1. {t("NO CONTACT INFO", "ممنوع وضع بيانات تواصل خارجية")}</h3>
                    <p className="font-bold opacity-80 text-sm">{t("Do not put phone numbers or external links in description.", "يمنع وضع أرقام هواتف أو روابط تواصل خارجية في الوصف.")}</p>
                 </div>

                 <div className="p-4 bg-[var(--c-purple)] text-white border-4 border-black shadow-[6px_6px_0px_#000]">
                    <h3 className="text-xl font-black mb-1 uppercase">2. {t("MANDATORY MIDDLEMAN SYSTEM", "نظام الوساطة الإلزامي")}</h3>
                    <p className="font-bold opacity-90 text-sm">{t("Always use the official Lord Middleman for your safety.", "استخدم وسيط اللورد الرسمي دائماً لضمان أمان عمليتك.")}</p>
                 </div>

                 <div className="p-4 bg-white border-4 border-black">
                    <h3 className="text-xl font-black mb-1 uppercase text-[var(--c-orange)]">3. {t("HONESTY AND TRANSPARENCY", "الصدق والشفافية")}</h3>
                    <p className="font-bold opacity-80 text-sm">{t("Mention all account details with total honesty.", "التزم بذكر كافة تفاصيل الحساب بصدق تام.")}</p>
                 </div>
              </div>

              <button 
                onClick={() => setShowRulesModal(false)}
                className="w-full mt-8 bg-black text-white py-4 font-black uppercase text-xl border-4 border-black hover:bg-[var(--c-lime)] hover:text-black transition-colors"
              >
                {t("I Agree and Comply", "أوافق وألتزم بالقوانين")}
              </button>
            </div>
          </div>
        )}

        {/* Submit Post Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[var(--c-bg)] border-4 border-black p-6 shadow-[12px_12px_0px_#000] animate-in zoom-in-95 duration-200">
              <button 
                onClick={closeSubmitModal}
                className="absolute top-4 right-4 w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-black hover:text-[var(--c-bg)] transition-colors z-30"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-black mb-6 uppercase flex items-center gap-2">
                 <PenTool className="w-6 h-6 text-[var(--c-orange)]" /> {t("New Offer", "إرسال عرض جديد")}
              </h3>

              {postSuccess && (
                <div className="mb-6 animate-in zoom-in-95 duration-500">
                  <div className="p-4 border-4 border-black bg-[var(--c-lime)] text-black text-center font-black mb-4">
                     {t("Offer sent successfully! Waiting for admin approval.", "تم إرسال العرض بنجاح وبانتظار موافقة الإدارة!")}
                  </div>
                  <a 
                    href={FACEBOOK_GROUP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 p-4 bg-[#1877F2] text-white border-4 border-black font-black uppercase hover:bg-black transition-colors shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none"
                  >
                    <Facebook className="w-6 h-6" /> {t("Post to Facebook also!", "أنشر عرضك في مجتمع فيسبوك أيضاً!")}
                  </a>
                  <p className="text-[10px] text-center font-bold mt-2 opacity-60">{t("Join 50k+ members on Facebook.", "لزيادة فرصة بيع/شراء حسابك، انضم لأكثر من 50 ألف عضو على فيسبوك.")}</p>
                </div>
              )}

              {!postSuccess && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">{t("OFFER TITLE / REQUEST", "عنوان العرض / الطلب")}</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={t("Example: Pubg account with features...", "مثال: حساب ببجي بميزات كذا...")}
                      className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:border-[var(--c-orange)] bg-white shadow-[inner_4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">{t("DESCRIPTION", "وصف العرض")}</label>
                    <textarea 
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder={t("Full details... (No links/numbers allowed)", "التفاصيل كاملة... (يمنع وضع أي روابط أو أرقام وستُرفض تلقائياً)")}
                      rows={5}
                      className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:border-[var(--c-orange)] bg-white resize-none shadow-[inner_4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">{t("Secret Contact (Admin Only)", "بيانات تواصل للوساطة (للإدارة فقط)")}</label>
                    <input 
                      type="text" 
                      value={hiddenContact}
                      onChange={(e) => setHiddenContact(e.target.value)}
                      placeholder={t("e.g. WhatsApp number or FB link", "مثال: رقم الواتساب أو رابط الفيسبوك")}
                      className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:border-[var(--c-orange)] bg-[var(--c-lime)]/10 shadow-[inner_4px_4px_0px_rgba(0,0,0,0.1)] placeholder:text-black/40"
                    />
                    <p className="text-[10px] font-black mt-1 text-red-600 leading-tight">
                      {t("* Completely hidden from users. Required for admins to reach you if needed.", "* مخفية تماماً عن الأعضاء. تستخدمها الإدارة فقط للتواصل معك إن لزم الأمر.")}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">{t("IMAGES (MAX 3)", "صور إضافية (الحد الأقصى 3 صور)")}</label>
                    <p className="text-[10px] font-bold opacity-50 mb-2">{t("Add images for proof or ads to increase trust.", "أضف صور للإثباتات أو الإعلانات لزيادة الثقة.")}</p>
                    
                    {imageStrs.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {imageStrs.map((str, idx) => (
                          <div key={idx} className="relative group border-4 border-black aspect-square bg-white">
                            <img src={str} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white flex items-center justify-center border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-[2px_2px_0px_#000]"
                              title={t("Delete Image", "حذف الصورة")}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {imageStrs.length < 3 && (
                      <label className="flex items-center justify-center w-full min-h-[80px] border-4 border-dashed border-black bg-black/5 hover:bg-[var(--c-lime)]/20 cursor-pointer transition-colors relative overflow-hidden">
                        <div className="flex flex-col items-center opacity-50 p-2">
                           <ImagePlus className="w-6 h-6 mb-1" />
                           <span className="text-[10px] font-black uppercase">{t(`Click to upload image (${3 - imageStrs.length} remaining)`, `اضغط لرفع صورة إضافية (${3 - imageStrs.length} متبقية)`)}</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  <button 
                    onClick={handlePostSubmit}
                    disabled={!title.trim() || !desc.trim()}
                    className="w-full bg-black text-[var(--c-lime)] py-4 font-black uppercase text-lg hover:bg-[var(--c-orange)] hover:text-black border-4 border-black transition-colors shadow-[6px_6px_0px_var(--c-lime)] active:translate-y-1 active:shadow-none disabled:opacity-50"
                  >
                    {t("Send for Review", "إرسال للمراجعة")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat System */}
        {activeChat && (
          <CommunityChat 
            otherUserId={activeChat.id} 
            otherUserName={activeChat.name}
            postId={activeChat.postId}
            onClose={() => setActiveChat(null)} 
          />
        )}
      </div>
    </>
  );
}
