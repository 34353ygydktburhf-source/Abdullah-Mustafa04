import React, { useState, useEffect } from "react";
import { useCommunity, CommunityPost, Reactions } from "./CommunityContext";
import { User, MessageSquare, Trash2, KeyRound, Share2, ThumbsUp, Send, Smartphone, Eye, ChevronRight, ChevronLeft, X, Crown, Gift, Copy, CheckCircle } from "lucide-react";
import { useSettings } from "./SettingsContext";
import { StatusRing } from "./StatusRing";
import { useWallet } from "./WalletContext";
import { GemIcon } from "./GemIcon";
import { useLogin } from "./LoginContext";
import { useNotifications } from "./NotificationContext";
import { useLang } from "./LangContext";
import { Link } from "react-router-dom";
import { formatGems } from "@/lib/utils";
import gsap from "gsap";

const GIFT_PRESETS = [50, 100, 500, 1000];

export function CommunityPosts({ onOpenChat }: { onOpenChat: (authorId: string, authorName: string, postId: string) => void }) {
  const { posts, isAuthenticatedDev, verifyDevPin, deletePost, reactToPost, tipPost } = useCommunity();
  const { spendGems } = useWallet();
  const { isLoggedIn, openLogin } = useLogin();
  const { settings } = useSettings();
  const { addNotification } = useNotifications();
  const { t } = useLang();
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
  const [giftPromptId, setGiftPromptId] = useState<string | null>(null);
  const [giftAmount, setGiftAmount] = useState<number>(100);
  const [lightbox, setLightbox] = useState<{images: string[], index: number} | null>(null);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight" && lightbox) {
        setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length });
      }
      if (e.key === "ArrowLeft" && lightbox) {
         setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const visiblePosts = posts.filter(p => p.status === "approved" || p.isAdminPost);

  const handleDeleteAttempt = (id: string) => {
    setDeletePromptId(id);
    setPinInput("");
    setErrorMsg("");
  };

  const confirmDelete = (id: string) => {
    if (verifyDevPin(pinInput)) {
      deletePost(id);
      setDeletePromptId(null);
    } else {
      setErrorMsg("الرمز السري غير صحيح");
    }
  };

  const shareToWhatsapp = (post: CommunityPost) => {
    const text = `شاهد هذا المنشور في مجتمع AL LORD Store:
*${post.title}*
${post.description}
رابط الموقع: ${window.location.origin}/community`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const sendToAdmin = (post: CommunityPost) => {
    const text = `مرحباً لورد، أريد الاستفسار عن هذا المنشور:
الناشر: ${post.authorName}
العنوان: ${post.title}
الرابط: ${window.location.origin}/community?id=${post.id}`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleNativeShare = async (post: CommunityPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      shareToWhatsapp(post);
    }
  };

  const reactionEmojis: Record<keyof Reactions, string> = {
    like: "👍",
    love: "❤️",
    haha: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡"
  };

  if (visiblePosts.length === 0) {
    return (
      <div className="py-20 text-center border-4 border-dashed border-[var(--c-ink)]/20 animate-in fade-in duration-500">
        <p className="text-xl font-black uppercase text-[var(--c-ink)]/50">لا يوجد منشورات حتى الآن</p>
        <p className="text-sm font-bold mt-2 text-[var(--c-ink)]/40">كن أول من ينشر عرضاً أو طلباً!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {visiblePosts.map(post => (
        <div 
          key={post.id} 
          className={`relative border-[4px] md:border-[6px] border-[var(--c-ink)] p-4 md:p-8 transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_rgba(0,0,0,1)] hover:-translate-y-1 md:hover:-translate-y-2 hover:-translate-x-1 md:hover:-translate-x-2 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] md:hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] hover:bg-[#fffdf0] bg-white group`}
        >
          {/* Chaotic Background Pattern purely for aesthetics */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none transition-opacity bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent bg-[length:20px_20px]"></div>
          
          {post.isAdminPost && (
            <div className="absolute top-0 left-0 bg-[var(--c-orange)] text-[var(--c-ink)] px-2 py-1 md:px-3 md:py-1 text-[9px] md:text-xs font-black uppercase border-b-4 border-r-4 border-[var(--c-ink)] shadow-[2px_2px_0px_#000] z-20">
              إعلان مسؤول
            </div>
          )}

          <div className="flex items-start gap-4 md:gap-6 mb-4 pt-2">
            {post.isAdminPost ? (
              <div className="relative group/admin z-20 shrink-0">
                <StatusRing shape="circle" size="md">
                  <div className="relative p-0.5 md:p-1 border-4 border-black bg-[var(--c-orange)] rounded-full overflow-hidden w-12 h-12 md:w-16 md:h-16 shadow-[2px_2px_0px_#000] md:shadow-[4px_4px_0px_#000] transition-transform group-hover/admin:scale-105 group-hover/admin:rotate-3">
                    <img src="https://i.pinimg.com/736x/0b/91/a5/0b91a5919e54ac44629a8f5ca01e84b3.jpg" alt="Admin" className="w-full h-full object-cover rounded-full" />
                  </div>
                </StatusRing>
                <div className="absolute -top-3 -right-2 rotate-12 bg-white rounded-full p-1 border-2 border-black shadow-[2px_2px_0px_#000] animate-bounce z-30">
                  <Crown className="w-4 h-4 text-[var(--c-orange)] fill-[var(--c-orange)]" />
                </div>
              </div>
            ) : (
              <div className={`w-12 h-12 shrink-0 border-2 border-[var(--c-ink)] flex items-center justify-center bg-[var(--c-lime)] shadow-[2px_2px_0px_#000]`}>
                 <User className="w-6 h-6 text-[var(--c-ink)]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
               <h4 className={`text-sm md:text-base font-black uppercase truncate ${post.isAdminPost ? 'text-[var(--c-orange)]' : 'text-[var(--c-ink)]'}`}>
                 {post.authorName}
               </h4>
               <p className="text-[10px] font-bold opacity-50">{new Date(post.timestamp).toLocaleString("ar-EG")}</p>
            </div>
          </div>

          <div className="mb-4 relative z-10">
            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-3 group-hover:text-[var(--c-orange)] transition-colors">{post.title}</h3>
            <p className="text-base md:text-lg font-bold opacity-90 leading-relaxed whitespace-pre-wrap">{post.description}</p>
            
            {post.isAdminPost && post.giftCode && (
              <div className="mt-6 mb-4 p-4 border-4 border-dashed border-[var(--c-orange)] bg-[var(--c-orange)]/5 relative group/gift">
                <div className="absolute -top-3 left-4 bg-[var(--c-orange)] text-black px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black rotate-1 shadow-[2px_2px_0px_#000]">
                  🎁 {t("Exclusive Gift Code", "كود هدايا حصري")}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <div className="text-xl md:text-2xl font-mono font-black tracking-[0.2em] text-[var(--c-ink)] bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_#000]">
                    {post.giftCode}
                  </div>
                  <button 
                    onClick={() => {
                        navigator.clipboard.writeText(post.giftCode!);
                        addNotification(t("Code Copied", "تم نسخ الكود"), t("Now go to your wallet to redeem it!", "اذهب للمحفظة الآن لاستخدامه!"), "success");
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-black uppercase text-sm border-4 border-black hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_var(--c-orange)] active:translate-y-1 active:shadow-none"
                  >
                    <Copy className="w-4 h-4" /> {t("Copy Code", "نسخ الكود")}
                  </button>
                </div>
              </div>
            )}

            {post.isAdminPost && post.actionLink && (
              <div className="mt-4 mb-2">
                <a 
                  href={post.actionLink.startsWith('http') ? post.actionLink : undefined}
                  target={post.actionLink.startsWith('http') ? "_blank" : undefined}
                  className="inline-flex items-center gap-2 bg-[var(--c-lime)] border-4 border-[var(--c-ink)] text-[var(--c-ink)] px-6 py-3 font-black uppercase text-sm shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
                  onClick={(e) => {
                    if (!post.actionLink?.startsWith('http')) {
                      e.preventDefault();
                      window.location.href = post.actionLink || '/';
                    }
                  }}
                >
                  {t("View Deal", "تصفح العرض المذكور")}
                </a>
              </div>
            )}

            {isAuthenticatedDev && post.hiddenContact && (
              <div className="mt-4 mb-2 p-3 bg-red-100 border-4 border-dashed border-red-600 inline-block shadow-[4px_4px_0px_rgba(220,38,38,1)] relative w-full md:w-auto">
                 <p className="text-[10px] font-black uppercase text-red-600 mb-1 flex items-center justify-between">
                   <span>Admin Vision: Hidden Contact</span>
                   <Eye className="w-3 h-3 ml-2" />
                 </p>
                 <p className="text-lg md:text-xl font-bold select-all truncate">{post.hiddenContact}</p>
                 <p className="text-[9px] opacity-70 mt-1">Visible to admins only</p>
              </div>
            )}
            
            {post.images && post.images.length > 0 && (
              <div className={`mt-4 grid gap-2 shadow-[6px_6px_0px_#000] border-[6px] border-[var(--c-ink)] overflow-hidden bg-[var(--c-ink)] ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.map((img, idx) => {
                  const isMoreHidden = post.images!.length > 3 && idx === 2;
                  if (idx > 2) return null; // Only show up to 3 images in the grid
                  
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setLightbox({images: post.images!, index: idx})}
                      className={`relative group/image overflow-hidden cursor-pointer bg-white ${post.images!.length >= 3 && idx === 0 ? 'col-span-2 aspect-video max-h-[350px]' : 'aspect-square md:aspect-video max-h-[250px]'}`}
                    >
                      <img 
                        src={img} 
                        alt={`${post.title} - ${idx}`} 
                        className={`w-full h-full object-cover group-hover/image:scale-[1.03] transition-transform duration-500`} 
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-sm">
                         <div className="bg-[var(--c-lime)] border-4 border-black p-3 translate-y-4 group-hover/image:translate-y-0 transition-transform shadow-[4px_4px_0px_#000]">
                            <Eye className="w-6 h-6 text-black" />
                         </div>
                      </div>
                      {/* +N Overlay if more than 3 */}
                      {isMoreHidden && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center border-4 border-black group-hover/image:bg-black/90 transition-colors">
                           <span className="text-white text-5xl font-black font-mono">+{post.images!.length - 3}</span>
                           <span className="text-[var(--c-lime)] font-black text-xs uppercase mt-2">عرض الكل</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reactions Summary */}
          <div className="flex items-center gap-3 mb-4 py-2 border-y-2 border-black/5 justify-between flex-wrap">
             <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(post.reactions || {}).map(([type, count]) => (
                  count > 0 && (
                    <div 
                      key={type} 
                      className="flex items-center gap-1 bg-white border-2 border-black px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#000] animate-in zoom-in-95 duration-300"
                    >
                      <span className="text-xs">{reactionEmojis[type as keyof Reactions]}</span>
                      <span className="text-[10px] font-black">{count}</span>
                    </div>
                  )
                ))}
                {Object.values(post.reactions || {}).reduce((a, b) => a + b, 0) === 0 && (
                  <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{t("No reactions yet", "لا يوجد تفاعلات بعد")}</p>
                )}
             </div>
             {post.tippedGems && post.tippedGems > 0 ? (
               <div className="flex items-center gap-1 bg-[#ccff00] px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] animate-pulse">
                  <GemIcon size={12} />
                  <span className="text-[10px] font-black uppercase text-black">+{formatGems(post.tippedGems)} مهداة</span>
               </div>
             ) : null}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-start gap-2 md:gap-4 border-t-4 border-[var(--c-ink)]/10 pt-4 relative">
              {/* Interaction Bar */}
              <div className="relative group/reaction flex-1 min-w-0 sm:flex-none">
                <button 
                  onClick={() => setActiveReactionPicker(activeReactionPicker === post.id ? null : post.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-black uppercase text-xs border-4 border-black transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none ${activeReactionPicker === post.id ? 'bg-[var(--c-lime)] text-black' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                  <ThumbsUp className="w-4 h-4" /> <span className="sm:inline">أعجبني</span>
                </button>
                
                {/* Reaction Picker Overlay for Mobile handled outside loop to prevent clipping */}
              </div>

              {/* Gift Gems Button */}
              <div className="relative flex-1 min-w-0 sm:flex-none">
                <button 
                  onClick={() => isLoggedIn ? setGiftPromptId(giftPromptId === post.id ? null : post.id) : openLogin()}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 font-black uppercase text-xs border-4 border-black hover:bg-[#ccff00] hover:text-black transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
                >
                  <Gift className="w-4 h-4 text-[#b084ff]" /> <span className="sm:inline">إهداء</span>
                </button>

                {giftPromptId === post.id && (
                  <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGiftPromptId(null)}></div>
                    <div className="relative w-full md:max-w-md bg-[#fffbf0] border-t-8 md:border-8 border-black p-6 md:p-8 shadow-[0_-10px_0_rgba(0,0,0,0.1)] md:shadow-[12px_12px_0px_#ccff00] animate-in slide-in-from-bottom-full md:slide-in-from-bottom-5 duration-300">
                      <button 
                        onClick={() => setGiftPromptId(null)}
                        className="absolute top-4 right-4 bg-white border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[var(--c-purple)] p-3 border-4 border-black shadow-[4px_4px_0px_#000]">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase leading-tight">{t("Gift Gems", "إهداء جواهر")}</h3>
                          <p className="text-[10px] font-bold opacity-60 uppercase">{t("To:", "إلى:")} {post.authorName}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Select Amount", "اختر الكمية")}</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {GIFT_PRESETS.map(amt => (
                              <button 
                                key={amt}
                                onClick={() => setGiftAmount(amt)}
                                className={`py-4 md:py-2 border-2 border-black font-black text-sm transition-all shadow-[2px_2px_0px_#000] active:translate-y-0.5 active:shadow-none ${giftAmount === amt ? 'bg-[#ccff00] text-black' : 'bg-white hover:bg-gray-50'}`}
                              >
                                {amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase mb-2 opacity-50">{t("Custom Amount", "كمية مخصصة")}</label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                              <input 
                                type="number" 
                                min="1"
                                value={giftAmount}
                                onChange={(e) => setGiftAmount(parseInt(e.target.value) || 0)}
                                className="w-full border-4 border-black p-4 md:p-3 text-2xl md:text-xl font-black outline-none bg-white focus:bg-[#ccff00]/10 transition-colors"
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                                <GemIcon size={32} className="md:w-6 md:h-6" />
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                 if (giftAmount > 0 && spendGems(giftAmount, `إهداء لصاحب المنشور: ${post.authorName}`)) {
                                   tipPost(post.id, giftAmount);
                                   setGiftPromptId(null);
                                   addNotification(t("Gems Sent!", "تم الإرسال!"), t("Your gift has been sent successfully.", "تم إرسال هديتك بنجاح."), "success");
                                 }
                              }}
                              className="bg-[#b084ff] text-white px-8 py-4 md:py-0 font-black uppercase text-base md:text-sm border-4 border-black shadow-[6px_6px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:bg-black hover:shadow-none active:translate-y-1 transition-all"
                            >
                              {t("Send", "إرسال")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onOpenChat(post.authorId, post.authorName, post.id)}
                className="flex-1 min-w-0 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-4 py-3 font-black uppercase text-xs border-4 border-black hover:bg-[var(--c-orange)] hover:text-white transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
              >
                <MessageSquare className="w-4 h-4" /> <span className="sm:inline">تواصل</span>
              </button>

              <button 
                onClick={() => sendToAdmin(post)}
                className="flex-1 min-w-0 sm:flex-none flex items-center justify-center gap-2 bg-[var(--c-lime)] text-black px-4 py-3 font-black uppercase text-xs border-4 border-black hover:bg-black hover:text-[var(--c-lime)] transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
              >
                <Send className="w-4 h-4" /> <span className="sm:inline">للمسؤول</span>
              </button>

              <button 
                onClick={() => handleNativeShare(post)}
                className="col-span-2 sm:col-auto sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-4 py-3 font-black uppercase text-xs border-4 border-black hover:bg-[var(--c-purple)] transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none"
              >
                <Share2 className="w-4 h-4" /> <span className="sm:inline">مشاركة العرض</span>
              </button>

              {isAuthenticatedDev && (
                <button 
                  onClick={() => handleDeleteAttempt(post.id)}
                  className="w-10 h-10 md:w-12 md:h-12 bg-red-100 border-4 border-black flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-[3px_3px_0px_#000] md:shadow-[4px_4px_0px_#000] shrink-0"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}

              {deletePromptId === post.id && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border-4 border-[var(--c-ink)] p-4 shadow-[4px_4px_0px_var(--c-ink)] z-10 animate-in zoom-in-95 duration-200">
                  <p className="text-[10px] font-black uppercase mb-2">تأكيد حذف أمان اللورد:</p>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="flex-1 border-2 border-black p-1 text-xs font-black tracking-widest outline-none"
                      placeholder="PIN"
                    />
                    <button 
                      onClick={() => confirmDelete(post.id)}
                      className="bg-red-600 text-white px-2 py-1 font-black text-[10px] uppercase border-2 border-black"
                    >
                      حذف
                    </button>
                  </div>
                  {errorMsg && <p className="text-[8px] text-red-600 font-black mt-1 uppercase">{errorMsg}</p>}
                </div>
              )}
          </div>
        </div>
      ))}

      {/* Global Reaction Picker (Outside loop to prevent clipping by card transforms) */}
      {activeReactionPicker && (
        <>
          {/* Backdrop for all devices to ensure focus */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[400]" onClick={() => setActiveReactionPicker(null)}></div>
          
          <div className="fixed bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex items-center justify-center z-[500] w-full px-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1 md:gap-3 bg-white border-4 border-black p-4 md:p-6 shadow-[0_16px_0_#000] animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 w-full max-w-[380px] justify-around relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {t("What's your reaction?", "ما هو تفاعلك؟")}
              </div>
              {(Object.keys(reactionEmojis) as Array<keyof Reactions>).map((type) => (
                <button 
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    reactToPost(activeReactionPicker, type);
                    setActiveReactionPicker(null);
                    gsap.fromTo(e.currentTarget, { scale: 1.5, y: -20 }, { scale: 1, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                  }}
                  className="text-3xl md:text-4xl hover:-translate-y-3 hover:scale-125 transition-all duration-300 p-2 md:p-3 cursor-pointer bg-[#f8f8f8] border-2 border-transparent hover:border-black hover:shadow-[4px_4px_0px_#000] rounded-xl active:bg-[var(--c-lime)] flex items-center justify-center shrink-0 w-12 h-12 md:w-16 md:h-16"
                  title={type}
                >
                  <span className="leading-none">{reactionEmojis[type]}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-[500] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
          dir="ltr" // Ensure sliders go left-to-right correctly
        >
          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }} 
            className="absolute top-4 right-4 text-white hover:text-black p-3 border-4 border-white hover:bg-[var(--c-lime)] transition-colors z-50 shadow-[4px_4px_0px_#000]"
          >
            <X className="w-8 h-8" />
          </button>
          
          {/* Main Image */}
          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightbox.images[lightbox.index]} 
              className="max-h-[85vh] max-w-[95vw] object-contain border-8 border-white bg-black shadow-[16px_16px_0px_#000] animate-in zoom-in-95 duration-200" 
              alt="Fullscreen view"
            />
            <div className="absolute top-4 left-4 bg-white text-black font-black px-3 py-1 border-4 border-black font-mono shadow-[4px_4px_0px_#000]">
              {lightbox.index + 1} / {lightbox.images.length}
            </div>
            
            {/* Nav Buttons */}
            {lightbox.images.length > 1 && (
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 sm:px-12 pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length }); }}
                  className="pointer-events-auto bg-white hover:bg-[var(--c-orange)] text-black border-4 border-black p-3 transition-transform hover:scale-110 active:scale-95 shadow-[4px_4px_0px_#000]"
                >
                  <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length }); }}
                  className="pointer-events-auto bg-white hover:bg-[var(--c-orange)] text-black border-4 border-black p-3 transition-transform hover:scale-110 active:scale-95 shadow-[4px_4px_0px_#000]"
                >
                  <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
                </button>
              </div>
            )}
            
            {/* Dots */}
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-6 flex gap-3 bg-black/50 p-3 rounded-full backdrop-blur-md border-2 border-white/20">
                {lightbox.images.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-300 cursor-pointer border-2 border-white ${idx === lightbox.index ? 'bg-[var(--c-lime)] scale-125 border-black shadow-[0_0_10px_var(--c-lime)]' : 'bg-transparent hover:bg-white/50'}`} 
                    onClick={(e) => { e.stopPropagation(); setLightbox({...lightbox, index: idx}); }} 
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
