import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  CreditCard,
  Inbox,
  MessageSquareQuote,
  FileText,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminTab } from '../../types';

import { AdminOverview } from './AdminOverview';
import { AdminProjects } from './AdminProjects';
import { AdminServices } from './AdminServices';
import { AdminPrototypes } from './AdminPrototypes';
import { AdminInvoices } from './AdminInvoices';
import { AdminMessages } from './AdminMessages';
import { AdminBlog } from './AdminBlog';
import { AdminTestimonials } from './AdminTestimonials';
import { AdminMedia } from './AdminMedia';
import { AdminSettings } from './AdminSettings';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminDashboard: React.FC = () => {
  const { messages, settings, adminTab, setAdminTab } = usePortfolio();
  const { isAuthenticated, isLoading, logout, adminUser } = useAdminAuth();
  const { navigate, activeEntityId, navigateToAdminTab } = useNavigation();
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Route Protection: Redirect unauthenticated users to /admin/login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Synchronize navigation route tab with local adminTab
  useEffect(() => {
    if (activeEntityId && activeEntityId !== 'login') {
      const validTabs: AdminTab[] = [
        'overview',
        'projects',
        'services',
        'prototypes',
        'invoices',
        'blog',
        'messages',
        'testimonials',
        'media',
        'settings',
      ];
      if (validTabs.includes(activeEntityId as AdminTab)) {
        setAdminTab(activeEntityId as AdminTab);
      }
    }
  }, [activeEntityId, setAdminTab]);

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  const tabs: { id: AdminTab; labelAr: string; labelEn: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      labelAr: 'نظرة عامة',
      labelEn: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'projects',
      labelAr: 'المشاريع والأعمال',
      labelEn: 'Projects & Work',
      icon: <FolderKanban className="w-4 h-4" />,
    },
    {
      id: 'services',
      labelAr: 'الخدمات البرمجية',
      labelEn: 'Services & Scope',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'prototypes',
      labelAr: 'المعرض والنماذج التفاعلية',
      labelEn: 'Showcase & Prototypes',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'invoices',
      labelAr: 'الفواتير والمدفوعات',
      labelEn: 'Invoices & Billing',
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      id: 'blog',
      labelAr: 'المقالات والمدونة',
      labelEn: 'Blog & Articles',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'messages',
      labelAr: 'رسائل واستفسارات',
      labelEn: 'Client Inquiries',
      icon: <Inbox className="w-4 h-4" />,
      badge: unreadMessagesCount,
    },
    {
      id: 'testimonials',
      labelAr: 'آراء وتوصيات العملاء',
      labelEn: 'Testimonials',
      icon: <MessageSquareQuote className="w-4 h-4" />,
    },
    {
      id: 'media',
      labelAr: 'مكتبة الوسائط والصور',
      labelEn: 'Media & Assets',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'settings',
      labelAr: 'إعدادات الموقع و SEO',
      labelEn: 'Website Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  const handleTabClick = (tabId: AdminTab) => {
    setAdminTab(tabId);
    navigateToAdminTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#89AACC] border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-muted">
            {isAr ? 'جارِ التحقق من الجلسة الأمنية...' : 'Verifying authenticated session...'}
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col selection:bg-[#4E85BF] selection:text-white">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-stroke h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Left Side: Brand Monogram & Portal Identifier */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-bg border border-stroke text-text-primary hover:bg-stroke/60 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full p-[1px] accent-gradient shrink-0">
              <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                  alt="Mohamed Abu Al-Saud"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5 truncate">
                <span>{settings.fullName || settings.name}</span>
                <span className="text-muted/60 hidden sm:inline">/</span>
                <span className="text-[#89AACC] text-[11px] font-mono hidden sm:inline">Console</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{adminUser?.email || 'abualss3ud@gmail.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Language Switcher, Preview Site, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg hover:bg-stroke/60 border border-stroke text-xs font-mono text-text-primary transition-colors cursor-pointer"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* View Public Website */}
          <button
            onClick={() => navigate('/')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
            title={isAr ? 'معاينة الموقع الحي' : 'View Public Website'}
          >
            <span>{isAr ? 'معاينة الموقع' : 'Live Website'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#89AACC]" />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-bg hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-stroke hover:border-rose-500/30 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            title={isAr ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'خروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto flex flex-col md:flex-row relative">
        {/* Mobile Slide-down / Backdrop Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface border-b border-stroke p-4 flex flex-col gap-1 overflow-hidden z-30"
            >
              {tabs.map((tab) => {
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium transition-colors cursor-pointer text-start ${
                      isActive
                        ? 'bg-text-primary text-bg font-semibold shadow-sm'
                        : 'text-muted hover:text-text-primary hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                    </div>

                    {tab.badge && tab.badge > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500 text-black font-bold">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <div className="pt-2 mt-2 border-t border-stroke/60">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال للموقع العام' : 'Go to Public Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r rtl:border-r-0 rtl:border-l border-stroke p-5 bg-surface/40 shrink-0 flex-col justify-between">
          <nav aria-label="Admin Navigation" className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted/80 block px-3 mb-3">
              {isAr ? 'أقسام الإدارة' : 'Navigation Menu'}
            </span>

            {tabs.map((tab) => {
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer text-start group ${
                    isActive
                      ? 'bg-text-primary text-bg font-semibold shadow-md'
                      : 'text-muted hover:text-text-primary hover:bg-surface/80 border border-transparent hover:border-stroke/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-bg' : 'text-[#89AACC] group-hover:text-white transition-colors'}>
                      {tab.icon}
                    </span>
                    <span className="truncate">{isAr ? tab.labelAr : tab.labelEn}</span>
                  </div>

                  {tab.badge && tab.badge > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-bg text-text-primary'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="pt-6 border-t border-stroke/60 space-y-3">
            <div className="p-3 rounded-2xl bg-bg border border-stroke text-xs">
              <span className="text-[11px] font-mono text-muted block mb-1">
                {isAr ? 'حالة التفرغ' : 'Availability'}
              </span>
              <div className="flex items-center gap-2 text-text-primary font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{settings.siteStatus === 'available' ? (isAr ? 'متاح لمشاريع جديدة' : 'Open for projects') : (isAr ? 'غير متاح حالياً' : 'Booked')}</span>
              </div>
            </div>

            <button
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto min-h-[85vh]">
          {adminTab === 'overview' && <AdminOverview onSelectTab={handleTabClick} />}
          {adminTab === 'projects' && <AdminProjects />}
          {adminTab === 'services' && <AdminServices />}
          {adminTab === 'prototypes' && <AdminPrototypes />}
          {adminTab === 'invoices' && <AdminInvoices />}
          {adminTab === 'blog' && <AdminBlog />}
          {adminTab === 'messages' && <AdminMessages />}
          {adminTab === 'testimonials' && <AdminTestimonials />}
          {adminTab === 'media' && <AdminMedia />}
          {adminTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={logoutModalOpen}
        title={isAr ? 'تسجيل الخروج من لوحة التحكم؟' : 'Sign Out of Admin Console?'}
        message={
          isAr
            ? 'سيتم إنهاء جلستك الإدارية الآمنة، وستحتاج لإدخال كلمة المرور مجدداً للوصول للوحة التحكم.'
            : 'Your authenticated admin session will be invalidated. You will need to log in again to access the console.'
        }
        itemTitle={adminUser?.email || 'abualss3ud@gmail.com'}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </div>
  );
};
