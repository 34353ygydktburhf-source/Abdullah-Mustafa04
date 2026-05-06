import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import GamesPage from "./pages/GamesPage";
import GameDetailPage from "./pages/GameDetailPage";
import NotFound from "./pages/NotFound";
import { LangProvider } from "@/components/ControlledChaos/LangContext";
import { LoginProvider } from "@/components/ControlledChaos/LoginContext";
import { LoginModal } from "@/components/ControlledChaos/LoginModal";
import { LogoutConfirmModal } from "@/components/ControlledChaos/LogoutConfirmModal";
import { FaqChatWidget } from "@/components/ControlledChaos/FaqChatWidget";
import { LivePurchases } from "@/components/ControlledChaos/LivePurchases";
import ProfilePage from "./pages/ProfilePage";
import { CommunityProvider } from "@/components/ControlledChaos/CommunityContext";
import { NotificationProvider } from "@/components/ControlledChaos/NotificationContext";
import { ComplaintProvider } from "@/components/ControlledChaos/ComplaintContext";
import { GamesProvider } from "@/components/ControlledChaos/GamesContext";
import { SettingsProvider } from "@/components/ControlledChaos/SettingsContext";
import { CouponProvider } from "@/components/ControlledChaos/CouponContext";
import { WalletProvider } from "@/components/ControlledChaos/WalletContext";
import CommunityPage from "./pages/CommunityPage";
import AdminDashboard from "./pages/AdminDashboard";
import BuyGemsPage from "./pages/BuyGemsPage";
import MonthlyStorePage from "./pages/MonthlyStorePage";
import { AdminStatusProvider, useAdminStatus } from "@/components/ControlledChaos/AdminStatusContext";
import { AdminFinanceProvider } from "@/components/ControlledChaos/AdminFinanceContext";
import { OrderProvider } from "@/components/ControlledChaos/OrderContext";
import { MonthlyStoreProvider } from "@/components/ControlledChaos/MonthlyStoreContext";
import { StoryViewer } from "@/components/ControlledChaos/StoryViewer";

const StoryViewerWrapper = () => {
  const { isViewerOpen, closeViewer } = useAdminStatus();
  return isViewerOpen ? <StoryViewer onClose={closeViewer} /> : null;
};

import { useSettings } from "@/components/ControlledChaos/SettingsContext";
import { useCommunity } from "@/components/ControlledChaos/CommunityContext";

const MaintenanceWrapper = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();
  const { isAuthenticatedDev } = useCommunity();
  const location = useLocation();

  if (settings.maintenanceMode && !isAuthenticatedDev && location.pathname !== "/admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--c-bg)] text-[var(--c-ink)] p-4 text-center border-[16px] border-black" dir="ltr">
        <div className="animate-pulse mb-8">
           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--c-orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-4 text-black shadow-[4px_4px_0px_var(--c-orange)] bg-white px-6 py-2 border-4 border-black inline-block tracking-tighter -rotate-2">
           Under<br/>Maintenance
        </h1>
        <p className="text-xl md:text-2xl font-black uppercase mt-8 max-w-xl opacity-80 border-t-4 border-black pt-8">
          The AL LORD system is currently upgrading. We will be back online shortly.
        </p>
      </div>
    );
  }
  return <>{children}</>;
};

const queryClient = new QueryClient();

import { OnboardingTutorial } from "@/components/ControlledChaos/OnboardingTutorial";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LangProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SettingsProvider>
        <CouponProvider>
        <GamesProvider>
          <NotificationProvider>
            <LoginProvider>
              <WalletProvider>
                <CommunityProvider>
                  <ComplaintProvider>
                  <AdminStatusProvider>
                    <OrderProvider>
                    <AdminFinanceProvider>
                    <MonthlyStoreProvider>
                    <MaintenanceWrapper>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/games" element={<GamesPage />} />
                        <Route path="/game/:slug" element={<GameDetailPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/buy-gems" element={<BuyGemsPage />} />
                        <Route path="/monthly-store" element={<MonthlyStorePage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <OnboardingTutorial />
                      <LoginModal />
                      <LogoutConfirmModal />
                      <FaqChatWidget />
                      <LivePurchases />
                      <StoryViewerWrapper />
                    </MaintenanceWrapper>
                    </MonthlyStoreProvider>
                  </AdminFinanceProvider>
                  </OrderProvider>
                  </AdminStatusProvider>
                </ComplaintProvider>
              </CommunityProvider>
              </WalletProvider>
            </LoginProvider>
          </NotificationProvider>
        </GamesProvider>
        </CouponProvider>
        </SettingsProvider>
        </BrowserRouter>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
