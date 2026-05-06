
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Plus, ShieldCheck, Zap, Diamond, CreditCard, X, Upload, Copy } from "lucide-react";
import { GlobalStyles } from "@/components/ControlledChaos/GlobalStyles";
import { Navbar } from "@/components/ControlledChaos/Navbar";
import { useLang } from "@/components/ControlledChaos/LangContext";
import { useWallet, GemPackage } from "@/components/ControlledChaos/WalletContext";
import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { GemIcon } from "@/components/ControlledChaos/GemIcon";
import { useLogin } from "@/components/ControlledChaos/LoginContext";
import { useOrders } from "@/components/ControlledChaos/OrderContext";
import { formatGems } from "@/lib/utils";

const GemBurstAnimation = () => {
  const gems = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {gems.map((_, i) => (
        <div 
          key={i} 
          className="gem-animation-particle"
          style={{ 
            '--tx': `${Math.cos(i * 30 * Math.PI / 180) * 150}px`, 
            '--ty': `${Math.sin(i * 30 * Math.PI / 180) * 150}px`,
            animationDelay: `${i * 0.05}s`
          } as any}
        >
          <GemIcon size={24} />
        </div>
      ))}
    </div>
  );
};


const PAYMENT_SUGGESTIONS = [
  "Vodafone Cash", "InstaPay", "STC Pay", "Urpay", "Zain Cash", "PayPal", "Apple Pay", "Google Pay", "Fawry", "Mada", "Aman", "Orange Money", "Etisalat Cash", "Sadaq", "CashU"
];

export default function BuyGemsPage() {
  const { t, lang } = useLang();
  const { settings } = useSettings();
  const { balance, gemPackages } = useWallet();
  const { isLoggedIn, openLogin, userData } = useLogin();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [selectedPack, setSelectedPack] = useState<GemPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const [customAmount, setCustomAmount] = useState<string>(searchParams.get("amount") || "25");

  // Real checkout states
  const [paymentMethod, setPaymentMethod] = useState("");
  const [otherMethod, setOtherMethod] = useState("");
  const [otherCountry, setOtherCountry] = useState("Egypt");
  const [transferProof, setTransferProof] = useState<string | null>(null);
  const [senderValue, setSenderValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatPrice = (priceInUSD: number, gemsCount?: number) => {
    // If gemsCount is provided, use the dynamic gemPrice from settings
    if (gemsCount) {
      const finalVal = gemsCount * (settings.gemPrice || 0.9);
      // Format to 2 decimal places if there are decimals, otherwise show whole number
      const displayVal = finalVal % 1 === 0 ? finalVal.toString() : finalVal.toFixed(2);
      
      return settings.currencySuffix 
        ? `${displayVal} ${settings.currencySymbol}`
        : `${settings.currencySymbol} ${displayVal}`;
    }
    
    // Fallback for packages if they have a USD price and we need to convert
    const rate = settings.currencySymbol === "ج.م" ? 50 : 1; // Default rate if no gemPrice logic applied
    const finalVal = Math.round(priceInUSD * rate);
    
    return settings.currencySuffix 
      ? `${finalVal} ${settings.currencySymbol}`
      : `${settings.currencySymbol} ${finalVal}`;
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

  const handlePurchase = () => {
    if (!selectedPack || !transferProof) return;
    setIsProcessing(true);
    
    const finalVal = selectedPack.gems * (settings.gemPrice || 0.9);

    const orderId = addOrder({
      userId: userData?.id || userData?.name || "USER-GUEST",
      userName: userData?.name || "Guest User",
      userContact: userData?.contact || "None",
      gameId: "GEMS_TOPUP",
      gameName: "شحن جواهر المحفظة",
      packageName: selectedPack.nameEn,
      packagePrice: finalVal,
      quantity: 1,
      totalPrice: finalVal,
      fields: { 
        gems_amount: selectedPack.gems.toString(),
        user_id: userData?.id || "N/A"
      },
      paymentMethod: paymentMethod === "other" ? `${otherMethod} (${otherCountry})` : (settings.paymentAccounts.find(a => a.id === paymentMethod)?.name || paymentMethod),
      senderInfo: senderValue,
      screenshot: transferProof
    });

    // Fake processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        setSelectedPack(null);
        setTransferProof(null);
        setSenderValue("");
        setPaymentMethod("");
      }, 5000);
    }, 2000);
  };

  const selectedPaymentAccount = settings.paymentAccounts.find(a => a.id === paymentMethod);

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--c-ink)", color: "var(--c-bg)" }}>
        <Navbar />
        
        <main className="flex-1 pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
          {/* Background Decorative Abstract */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(#ccff00_1px,transparent_1px),linear-gradient(90deg,#ccff00_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="max-w-6xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="mb-6 flex justify-end">
               <button 
                 onClick={() => navigate(-1)} 
                 className="bg-white text-black hover:bg-[#ff5e00] hover:text-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 font-black uppercase"
               >
                 <X className="w-6 h-6" /> <span className="hidden md:inline">{t("Close", "رجوع")}</span>
               </button>
            </div>
            
            <div className="mb-10 text-center md:text-start flex items-center justify-between flex-wrap gap-4">
               <div>
                  <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#ccff00] flex items-center gap-4 flex-wrap justify-center md:justify-start">
                    {t("Gem Store", "متجر الجواهر")} <GemIcon size={48} />
                  </h1>
                  <p className="mt-4 text-lg md:text-xl font-bold opacity-80 uppercase max-w-2xl bg-black inline-block px-3 py-1 border-2 border-[#fffbf0]">
                    {t("Fuel your account. Get games instantly. No waiting.", "اشحن حسابك. اشتري الألعاب فوراً بضغطة زر. بدون أي انتظار.")}
                  </p>
               </div>
               {isLoggedIn && (
                 <div className="bg-black border-4 border-[#b084ff] p-4 text-center shadow-[6px_6px_0px_#b084ff]">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 block mb-1">{t("Current Balance", "رصيدك الحالي")}</span>
                    <div className="text-3xl font-black text-[#ccff00] flex items-center justify-center gap-2">
                       {formatGems(balance)} <GemIcon size={24} />
                    </div>
                 </div>
               )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {gemPackages.map((pack) => (
                <div 
                  key={pack.id}
                  className={`relative border-4 border-black p-3 md:p-6 flex flex-col items-center justify-center aspect-square transition-transform duration-300 ${pack.popular ? 'md:scale-105 z-10 shadow-[6px_6px_0px_#ccff00] md:shadow-[10px_10px_0px_#ccff00]' : 'hover:-translate-y-2 hover:shadow-[4px_4px_0px_#fffbf0] md:hover:shadow-[8px_8px_0px_#fffbf0]'}`}
                  style={{ backgroundColor: pack.color }}
                >
                  {pack.popular && (
                    <div className="absolute -top-4 -right-4 bg-black text-[#ccff00] text-xs font-black uppercase px-3 py-1 border-2 border-[#ccff00] rotate-12 animate-pulse shadow-[2px_2px_0px_#000]">
                      {t("Most Popular!", "الأكثر مبيعاً")}
                    </div>
                  )}
                  
                  <div className="text-black mb-2 md:mb-6 border-b-2 md:border-b-4 border-black/20 pb-2 md:pb-4 text-center w-full">
                    <h3 className="font-black text-sm md:text-2xl uppercase mb-0.5 md:mb-1 truncate w-full">{lang === 'ar' ? pack.name : pack.nameEn}</h3>
                    <p className="font-bold text-[8px] md:text-sm opacity-70 uppercase truncate">{t("Instant Delivery", "تسليم فوري")}</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-6 text-black">
                    <div className={`mb-2 md:mb-4 ${pack.popular ? 'scale-110 md:scale-150 md:animate-bounce' : 'scale-100 md:scale-125'}`}>
                      <GemIcon size={32} className="md:w-12 md:h-12" />
                    </div>
                    <div className="text-2xl md:text-5xl font-black">{formatGems(pack.gems)}</div>
                  </div>
                  
                  <div className="mt-2 md:mt-6 pt-2 md:pt-4 border-t-2 md:border-t-4 border-black/20 w-full">
                    <button 
                      onClick={() => isLoggedIn ? setSelectedPack(pack) : openLogin()}
                      className="w-full bg-black text-white font-black uppercase py-2 md:py-4 border-2 md:border-4 border-black hover:bg-white hover:text-black transition-all shadow-[2px_2px_0px_#000] md:shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none text-[13px] md:text-xl tracking-tight"
                    >
                      {formatPrice(pack.price, pack.gems)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mt-8 border-4 border-[#ccff00] p-6 bg-black text-white relative group hover:-translate-y-1 shadow-[6px_6px_0px_#ccff00] md:shadow-[10px_10px_0px_#ccff00] transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <GemIcon size={120} />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="flex-1 w-full">
                  <h3 className="font-black text-2xl md:text-4xl uppercase mb-2 text-[#ccff00]">{t("Custom Amount", "كمية مخصصة")}</h3>
                  <p className="font-bold text-sm opacity-80 uppercase mb-4">{t("Enter an amount between 25 and 1000 gems", "أدخل كمية بين 25 و 1000 جوهرة")}</p>
                  
                  <div className="flex items-center bg-white border-4 border-black p-2 max-w-sm">
                    <GemIcon size={32} className="mx-2 text-black" />
                    <input 
                      type="number" 
                      min="25" 
                      max="1000"
                      value={customAmount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 1000) setCustomAmount("1000");
                        else setCustomAmount(e.target.value);
                      }}
                      className="w-full text-3xl font-black text-black outline-none bg-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end w-full md:w-auto">
                  <div className="text-4xl font-black mb-4">
                    {formatPrice(0, parseInt(customAmount) || 25)}
                  </div>
                  <button 
                    onClick={() => {
                      const gems = parseInt(customAmount) || 25;
                      if (gems < 25) return;
                      if (isLoggedIn) {
                        setSelectedPack({
                          id: "custom",
                          name: "كمية مخصصة",
                          nameEn: "Custom Amount",
                          gems: gems,
                          price: gems * (settings.gemPrice || 0.9),
                          popular: false,
                          color: "#ccff00"
                        });
                      } else {
                        openLogin();
                      }
                    }}
                    disabled={(parseInt(customAmount) || 0) < 25}
                    className="w-full md:w-auto bg-[#ff5e00] text-black font-black uppercase px-8 py-4 border-4 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("Buy Custom Amount", "شراء هذه الكمية")}
                  </button>
                </div>
              </div>
            </div>

            {/* Perks Strip */}
            <div className="mt-16 border-4 border-[#ccff00] bg-black p-6 md:p-8 flex flex-col md:flex-row shadow-[8px_8px_0px_#ccff00]">
               <div className="flex-1 flex items-center gap-4 mb-6 md:mb-0 md:border-r-4 md:border-[#ccff00]/30 pr-6">
                  <Zap className="w-12 h-12 text-[#ff5e00] shrink-0" />
                  <div>
                    <h4 className="font-black uppercase text-xl text-white">{t("Admin Moderated", "بإشراف الإدارة")}</h4>
                    <p className="text-xs font-bold text-white/60 uppercase">{t("Orders verified by admins", "تُضاف الجواهر بعد التحقق من الدفع")}</p>
                  </div>
               </div>
               <div className="flex-1 flex items-center gap-4 md:pl-6">
                  <ShieldCheck className="w-12 h-12 text-[#b084ff] shrink-0" />
                  <div>
                    <h4 className="font-black uppercase text-xl text-white">{t("Safe & Secure", "آمن وموثوق")}</h4>
                    <p className="text-xs font-bold text-white/60 uppercase">{t("Official payments processing", "نظام دفع رسمي ومحمي بالكامل")}</p>
                  </div>
               </div>
            </div>

          </div>
        </main>
      </div>

      {/* Checkout Modal */}
      {selectedPack && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isProcessing && setSelectedPack(null)}></div>
          
          <div className="relative w-full max-w-md bg-[#fffbf0] border-4 border-black shadow-[12px_12px_0px_#ccff00] p-6 text-black animate-in zoom-in-95 duration-200 mt-20 mb-20">
            {!isProcessing && !success && (
              <button 
                onClick={() => setSelectedPack(null)}
                className="absolute top-4 right-4 bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {isProcessing ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 border-8 border-black border-t-[#ccff00] rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-black uppercase bg-black text-[#ccff00] px-3 py-1 inline-block">{t("Processing Payment...", "جاري معالجة الدفع...")}</h3>
                <p className="mt-4 font-bold uppercase opacity-60 text-sm">{t("Please remain on this page.", "يرجى البقاء في هذه الصفحة.")}</p>
              </div>
            ) : success ? (
              <div className="py-12 text-center flex flex-col items-center relative">
                <GemBurstAnimation />
                <div className="absolute inset-0 bg-[radial-gradient(circle,#ccff00_0%,transparent_70%)] opacity-20 animate-pulse"></div>
                <div className="relative animate-[gem-float_3s_ease-in-out_infinite]">
                  <CheckCircle className="w-24 h-24 text-green-600 mb-6 drop-shadow-[0_0_15px_rgba(22,163,74,0.4)]" />
                </div>
                <h3 className="text-3xl font-black uppercase text-green-600 border-b-4 border-green-600 pb-2 mb-4 relative">
                  {t("Order Placed Successfully!", "تم استلام طلب الشحن!")}
                </h3>
                <p className="font-bold text-lg mb-2 text-center opacity-80 uppercase leading-snug max-w-[280px]">
                  {t("Admin will review your payment and credit gems.", "سيقوم الآدمن بمراجعة الدفعة وإضافة الجواهر لحسابك.")}
                </p>
                <div className="mt-8 flex gap-2">
                   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b-4 border-black pb-4 mb-4">
                  <h2 className="text-xl font-black uppercase flex items-center gap-2"><CreditCard className="w-5 h-5"/> {t("Complete Topup", "إتمام الشحن")}</h2>
                </div>
                
                <div className="mb-4 p-4 border-4 border-black bg-white flex justify-between items-center relative overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                   <div className="absolute right-[-20px] opacity-10 pointer-events-none">
                     <GemIcon size={80} />
                   </div>
                   <div>
                     <p className="text-sm font-bold opacity-60 uppercase">{t("Selected Pack:", "الباقة المختارة:")}</p>
                     <p className="text-xl font-black uppercase">{lang === 'ar' ? selectedPack.name : selectedPack.nameEn}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-bold opacity-60 uppercase">Amount</p>
                     <p className="text-2xl font-black text-[#b084ff]">{formatGems(selectedPack.gems)}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-black mb-2 uppercase opacity-70 ml-1">1. {t("Select Payment Wallet", "اختر المحفظة المراد التحويل لها")}</label>
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="w-full bg-white border-2 border-black p-3 font-bold text-sm"
                    >
                      <option value="" disabled>{t("Choose Wallet...", "اختر المحفظة...")}</option>
                      {settings.paymentAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                      <option value="other">{t("Other Method (Specify)", "طريقة مختلفة (حدد)")}</option>
                    </select>
                  </div>

                  {paymentMethod === "other" && (
                     <div className="p-3 bg-gray-100 border-2 border-black animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black uppercase mb-1">{t("Country", "الدولة")}</label>
                        <select value={otherCountry} onChange={(e) => setOtherCountry(e.target.value)} className="w-full bg-white border-2 border-black p-2 font-bold text-sm mb-2">
                           <option value="Egypt">مصر</option>
                           <option value="Saudi Arabia">السعودية</option>
                           <option value="UAE">الإمارات</option>
                           <option value="Kuwait">الكويت</option>
                           <option value="Jordan">الأردن</option>
                           <option value="Other">دولة أخرى</option>
                        </select>
                        <label className="block text-[10px] font-black uppercase mb-1">{t("Which App/Method?", "عن طريق أي محفظة/تطبيق؟")}</label>
                        <input type="text" list="payment-suggestions" value={otherMethod} onChange={(e) => setOtherMethod(e.target.value)} placeholder="Vodafone Cash, STC..." className="w-full bg-white border-2 border-black p-2 font-bold text-sm outline-none focus:bg-[#ccff00]/10" />
                        <datalist id="payment-suggestions">{PAYMENT_SUGGESTIONS.map(s => <option key={s} value={s} />)}</datalist>
                     </div>
                  )}

                  {selectedPaymentAccount && paymentMethod !== "other" && (
                    <div className="bg-[#ccff00] p-4 border-2 border-black animate-in fade-in slide-in-from-top-2">
                      <p className="text-[10px] font-black uppercase opacity-70 mb-2">{t("Transfer to this number", "الرجاء التحويل إلى هذا الرقم")}</p>
                      
                      <div className="flex gap-2 mb-2">
                        <div className="flex-1 bg-white border-2 border-black p-2 flex items-center justify-between">
                           <span className="font-mono font-black text-sm">{selectedPaymentAccount.value}</span>
                           <button onClick={(e) => { e.preventDefault(); copyPaymentInfo(selectedPaymentAccount.value, 'details'); }} className="p-1 hover:bg-black hover:text-white transition-colors" title="Copy Number">
                              {copiedId === 'details' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black mb-2 uppercase opacity-70 ml-1">2. {t("Your Transfer Number / Name", "الرقم أو الاسم الذي تم التحويل منه")}</label>
                    <input 
                      type="text" 
                      value={senderValue}
                      onChange={(e) => setSenderValue(e.target.value)}
                      placeholder={t("e.g. 01012345678", "مثال: 01012345678")}
                      className="w-full bg-white border-2 border-black p-3 font-bold text-sm outline-none focus:border-[#ff5e00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black mb-2 uppercase opacity-70 ml-1">3. {t("Transfer Proof Screenshot", "إثبات الدفع (سكرين شوت)")}</label>
                    <div className="border-4 border-black border-dashed p-4 bg-white hover:bg-gray-50 transition-colors relative group cursor-pointer text-center">
                       <input type="file" accept="image/*" onChange={handleProofUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                       {transferProof ? (
                         <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="font-black text-xs text-green-600 uppercase">Image Uploaded - Click to replace</span>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-2 opacity-50 group-hover:opacity-100">
                            <Upload className="w-6 h-6" />
                            <span className="font-black text-xs uppercase text-center max-w-[200px]">Click or drag image here</span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 border-y-4 border-black border-dashed py-3">
                   <span className="font-black uppercase text-lg">{t("Total to pay", "الإجمالي")}</span>
                   <span className="font-black uppercase text-2xl bg-[#ccff00] px-3 py-1 border-2 border-black">{formatPrice(0, selectedPack.gems)}</span>
                </div>

                <button 
                  onClick={handlePurchase}
                  disabled={!paymentMethod || !senderValue || !transferProof}
                  className="w-full bg-[#ff5e00] text-black font-black uppercase text-xl py-4 border-4 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000]"
                >
                  <CreditCard className="w-6 h-6" /> {t("Send Order", "إرسال طلب الدفع")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
